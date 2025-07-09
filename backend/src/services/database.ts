import { PrismaClient, ChatType } from '@prisma/client';

const prisma = new PrismaClient({
  // Optimize for shared hosting with connection pooling
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  // Configure connection pool for shared hosting limits
  // __internal: {
  //   engine: {
  //     connectTimeout: 60000,
  //     queryTimeout: 60000,
  //     maxConnections: 10, // Keep well below cPanel's 25 connection limit
  //   },
  // },
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

  async createChatSession(userId: string, chatType: ChatType = 'QUICK_CHAT') {
    return await this.withTimeout(async () => {
      return await prisma.chatSession.create({
        data: {
          userId,
          chatType,
        },
      });
    });
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

  // New methods for efficient chat management
  async getUserChatSessions(userId: string, limit: number = 20, lastCursor?: string) {
    return await this.withTimeout(async () => {
      const where = {
        userId,
        isArchived: false,
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

  async getChatSummary(sessionId: string) {
    const session = await prisma.chatSession.findUnique({
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

    // Generate title from first user message if no title exists
    if (session && !session.title) {
      const firstMessage = await prisma.message.findFirst({
        where: { sessionId, role: 'USER' },
        orderBy: { createdAt: 'asc' },
        select: { content: true },
      });

      if (firstMessage) {
        const autoTitle = firstMessage.content.substring(0, 50).trim();
        await this.updateChatTitle(sessionId, autoTitle);
        session.title = autoTitle;
      }
    }

    return session;
  }

  async searchChatSessions(userId: string, query: string, limit: number = 10) {
    return await prisma.chatSession.findMany({
      where: {
        userId,
        isArchived: false,
        title: {
          contains: query,
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
  }

  async getArchivedChats(userId: string, limit: number = 20, lastCursor?: string) {
    const where = {
      userId,
      isArchived: true,
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
  }

  async deleteChat(sessionId: string) {
    return await prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }

  async getUserChatCount(userId: string) {
    return await prisma.chatSession.count({
      where: { userId, isArchived: false },
    });
  }

  // Connection management for shared hosting
  async disconnect() {
    await prisma.$disconnect();
  }
}

export default new DatabaseService();