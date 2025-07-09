import { PrismaClient, ChatType } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

// Handle connection management for shared hosting
let prismaConnected = false;

const connectPrisma = async () => {
  if (!prismaConnected) {
    await prisma.$connect();
    prismaConnected = true;
  }
};

// Graceful shutdown for shared hosting
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  prismaConnected = false;
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  prismaConnected = false;
});

export class DatabaseService {
  // Ensure connection before each operation
  private async ensureConnection() {
    await connectPrisma();
  }

  // Wrap operations with timeout and error handling
  private async withTimeout<T>(operation: () => Promise<T>, timeoutMs: number = 30000): Promise<T> {
    await this.ensureConnection();
    
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * NEW ARCHITECTURE: Create session with first message and title atomically
   * This replaces the old createChatSession method
   */
  async createChatSessionWithFirstMessage(
    userId: string,
    chatType: ChatType,
    title: string,
    firstUserMessage: string,
    firstAssistantMessage: string
  ) {
    return await this.withTimeout(async () => {
      return await prisma.$transaction(async (tx) => {
        // Create the session with the AI-generated title
        const session = await tx.chatSession.create({
          data: {
            userId,
            chatType,
            title,
            messageCount: 2, // User message + Assistant message
            lastMessageAt: new Date(),
          },
        });

        // Create the first user message
        await tx.message.create({
          data: {
            content: firstUserMessage,
            role: 'USER',
            sessionId: session.id,
          },
        });

        // Create the first assistant message
        await tx.message.create({
          data: {
            content: firstAssistantMessage,
            role: 'ASSISTANT',
            sessionId: session.id,
          },
        });

        return session;
      });
    });
  }

  /**
   * DEPRECATED: Old session creation method - should not be used in new architecture
   */
  async createChatSession(userId: string, chatType: ChatType = 'QUICK_CHAT') {
    throw new Error('createChatSession is deprecated. Use createChatSessionWithFirstMessage instead.');
  }

  async getChatSession(sessionId: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    });
  }

  async addMessage(sessionId: string, content: string, role: 'USER' | 'ASSISTANT') {
    return await this.withTimeout(async () => {
      const [message] = await prisma.$transaction([
        prisma.message.create({
          data: {
            content,
            role,
            sessionId,
          },
        }),
        prisma.chatSession.update({
          where: { id: sessionId },
          data: {
            messageCount: { increment: 1 },
            lastMessageAt: new Date(),
          },
        }),
      ]);
      
      return message;
    });
  }

  async getMessageHistory(sessionId: string, limit: number = 10) {
    return await this.withTimeout(async () => {
      return await prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    });
  }

  /**
   * UPDATED: Only return sessions that have titles (and thus messages)
   */
  async getUserChatSessions(userId: string, limit: number = 20, lastCursor?: string) {
    return await this.withTimeout(async () => {
      const where = {
        userId,
        isArchived: false,
        title: {
          not: null, // Only sessions with titles
        },
        messageCount: {
          gt: 0, // Only sessions with messages
        },
        ...(lastCursor && {
          updatedAt: {
            lt: new Date(lastCursor),
          },
        }),
      };

      return await prisma.chatSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          chatType: true,
          messageCount: true,
          lastMessageAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  async updateChatTitle(sessionId: string, title: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title },
      });
    });
  }

  async archiveChat(sessionId: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.update({
        where: { id: sessionId },
        data: { isArchived: true },
      });
    });
  }

  async getChatPreview(sessionId: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          title: true,
          chatType: true,
          messageCount: true,
          lastMessageAt: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              role: true,
              createdAt: true,
            },
          },
        },
      });
    });
  }

  async getMessagesPaginated(sessionId: string, limit: number = 50, cursor?: number) {
    return await this.withTimeout(async () => {
      const where = {
        sessionId,
        ...(cursor && {
          msgCursor: {
            lt: cursor,
          },
        }),
      };

      return await prisma.message.findMany({
        where,
        orderBy: { msgCursor: 'desc' },
        take: limit,
      });
    });
  }

  /**
   * UPDATED: No longer auto-generates titles - all sessions should have titles
   */
  async getChatSummary(sessionId: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          title: true,
          chatType: true,
          messageCount: true,
          lastMessageAt: true,
          createdAt: true,
        },
      });
    });
  }

  /**
   * UPDATED: Only search sessions with titles
   */
  async searchChatSessions(userId: string, query: string, limit: number = 10) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.findMany({
        where: {
          userId,
          isArchived: false,
          title: {
            contains: query,
            not: null, // Only sessions with titles
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          chatType: true,
          messageCount: true,
          lastMessageAt: true,
          createdAt: true,
        },
      });
    });
  }

  /**
   * UPDATED: Only return archived sessions with titles
   */
  async getArchivedChats(userId: string, limit: number = 20, lastCursor?: string) {
    return await this.withTimeout(async () => {
      const where = {
        userId,
        isArchived: true,
        title: {
          not: null, // Only sessions with titles
        },
        ...(lastCursor && {
          updatedAt: {
            lt: new Date(lastCursor),
          },
        }),
      };

      return await prisma.chatSession.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          chatType: true,
          messageCount: true,
          lastMessageAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  async deleteChat(sessionId: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.delete({
        where: { id: sessionId },
      });
    });
  }

  /**
   * UPDATED: Only count sessions with titles
   */
  async getUserChatCount(userId: string) {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.count({
        where: { 
          userId, 
          isArchived: false,
          title: {
            not: null,
          },
        },
      });
    });
  }

  // Connection management for shared hosting
  async disconnect() {
    await prisma.$disconnect();
  }
}

export default new DatabaseService();