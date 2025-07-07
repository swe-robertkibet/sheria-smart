import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatabaseService {
  async createChatSession(userId: string) {
    return await prisma.chatSession.create({
      data: {
        userId,
      },
    });
  }

  async getChatSession(sessionId: string) {
    return await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async addMessage(sessionId: string, content: string, role: 'USER' | 'ASSISTANT') {
    return await prisma.message.create({
      data: {
        content,
        role,
        sessionId,
      },
    });
  }

  async getMessageHistory(sessionId: string, limit: number = 10) {
    return await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export default new DatabaseService();