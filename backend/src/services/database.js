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
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
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
    /**
     * NEW ARCHITECTURE: Create session with first message and title atomically
     * This replaces the old createChatSession method
     */
    createChatSessionWithFirstMessage(userId, chatType, title, firstUserMessage, firstAssistantMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // Create the session with the AI-generated title
                    const session = yield tx.chatSession.create({
                        data: {
                            userId,
                            chatType,
                            title,
                            messageCount: 2, // User message + Assistant message
                            lastMessageAt: new Date(),
                        },
                    });
                    // Create the first user message
                    yield tx.message.create({
                        data: {
                            content: firstUserMessage,
                            role: 'USER',
                            sessionId: session.id,
                        },
                    });
                    // Create the first assistant message
                    yield tx.message.create({
                        data: {
                            content: firstAssistantMessage,
                            role: 'ASSISTANT',
                            sessionId: session.id,
                        },
                    });
                    return session;
                }));
            }));
        });
    }
    /**
     * DEPRECATED: Old session creation method - should not be used in new architecture
     */
    createChatSession(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, chatType = 'QUICK_CHAT') {
            throw new Error('createChatSession is deprecated. Use createChatSessionWithFirstMessage instead.');
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
    /**
     * UPDATED: Only return sessions that have titles (and thus messages)
     */
    getUserChatSessions(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20, lastCursor, chatType) {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const where = Object.assign(Object.assign({ userId, isArchived: false, title: {
                        not: null, // Only sessions with titles
                    }, messageCount: {
                        gt: 0, // Only sessions with messages
                    } }, (chatType && { chatType })), (lastCursor && {
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
    /**
     * UPDATED: No longer auto-generates titles - all sessions should have titles
     */
    getChatSummary(sessionId) {
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
                        createdAt: true,
                    },
                });
            }));
        });
    }
    /**
     * UPDATED: Only search sessions with titles
     */
    searchChatSessions(userId_1, query_1) {
        return __awaiter(this, arguments, void 0, function* (userId, query, limit = 10, chatType) {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.findMany({
                    where: Object.assign({ userId, isArchived: false, title: {
                            contains: query,
                            not: null, // Only sessions with titles
                        } }, (chatType && { chatType })),
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
            }));
        });
    }
    /**
     * UPDATED: Only return archived sessions with titles
     */
    getArchivedChats(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 20, lastCursor, chatType) {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                const where = Object.assign(Object.assign({ userId, isArchived: true, title: {
                        not: null, // Only sessions with titles
                    } }, (chatType && { chatType })), (lastCursor && {
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
    deleteChat(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.delete({
                    where: { id: sessionId },
                });
            }));
        });
    }
    /**
     * UPDATED: Only count sessions with titles
     */
    getUserChatCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.withTimeout(() => __awaiter(this, void 0, void 0, function* () {
                return yield prisma.chatSession.count({
                    where: {
                        userId,
                        isArchived: false,
                        title: {
                            not: null,
                        },
                    },
                });
            }));
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
