"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
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
const connectPrisma = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!prismaConnected) {
        yield prisma.$connect();
        prismaConnected = true;
    }
});
// Graceful shutdown for shared hosting
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    prismaConnected = false;
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    prismaConnected = false;
}));
class DatabaseService {
    // Ensure connection before each operation
    ensureConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield connectPrisma();
        });
    }
    // Wrap operations with timeout and error handling
    withTimeout(operation_1) {
        return __awaiter(this, arguments, void 0, function* (operation, timeoutMs = 30000) {
            yield this.ensureConnection();
            return Promise.race([
                operation(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Database operation timeout')), timeoutMs))
            ]);
        });
    }
    createChatSession(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, chatType = 'QUICK_CHAT') {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.create({
                    data: {
                        userId,
                        chatType,
                    },
                });
            }));
        });
    }
    getChatSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.findUnique({
                    where: { id: sessionId },
                    include: {
                        messages: {
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                });
            }));
        });
    }
    addMessage(sessionId, content, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const [message] = yield prisma.$transaction([
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
            }));
        });
    }
    getMessageHistory(sessionId_1) {
        return __awaiter(this, arguments, void 0, function* (sessionId, limit = 10) {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.message.findMany({
                    where: { sessionId },
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                });
            }));
        });
    }
    // New methods for efficient chat management
    getUserChatSessions(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20, lastCursor) {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const where = Object.assign({ userId, isArchived: false }, (lastCursor && {
                    updatedAt: {
                        lt: new Date(lastCursor),
                    },
                }));
                return yield prisma.chatSession.findMany({
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
            }));
        });
    }
    updateChatTitle(sessionId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.update({
                    where: { id: sessionId },
                    data: { title },
                });
            }));
        });
    }
    archiveChat(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.update({
                    where: { id: sessionId },
                    data: { isArchived: true },
                });
            }));
        });
    }
    getChatPreview(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.findUnique({
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
            }));
        });
    }
    getMessagesPaginated(sessionId_1) {
        return __awaiter(this, arguments, void 0, function* (sessionId, limit = 50, cursor) {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const where = Object.assign({ sessionId }, (cursor && {
                    msgCursor: {
                        lt: cursor,
                    },
                }));
                return yield prisma.message.findMany({
                    where,
                    orderBy: { msgCursor: 'desc' },
                    take: limit,
                });
            }));
        });
    }
    getChatSummary(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield prisma.chatSession.findUnique({
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
                const firstMessage = yield prisma.message.findFirst({
                    where: { sessionId, role: 'USER' },
                    orderBy: { createdAt: 'asc' },
                    select: { content: true },
                });
                if (firstMessage) {
                    const autoTitle = firstMessage.content.substring(0, 50).trim();
                    yield this.updateChatTitle(sessionId, autoTitle);
                    session.title = autoTitle;
                }
            }
            return session;
        });
    }
    searchChatSessions(userId_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (userId, query, limit = 10) {
            return yield prisma.chatSession.findMany({
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
        });
    }
    getArchivedChats(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20, lastCursor) {
            const where = Object.assign({ userId, isArchived: true }, (lastCursor && {
                updatedAt: {
                    lt: new Date(lastCursor),
                },
            }));
            return yield prisma.chatSession.findMany({
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
    deleteChat(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.chatSession.delete({
                where: { id: sessionId },
            });
        });
    }
    getUserChatCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.chatSession.count({
                where: { userId, isArchived: false },
            });
        });
    }
    // Connection management for shared hosting
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
        });
    }
}
exports.DatabaseService = DatabaseService;
exports.default = new DatabaseService();
