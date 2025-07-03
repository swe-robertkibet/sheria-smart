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
const prisma = new client_1.PrismaClient();
class DatabaseService {
    createChatSession(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.chatSession.create({
                data: {
                    userId,
                },
            });
        });
    }
    getChatSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.chatSession.findUnique({
                where: { id: sessionId },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
        });
    }
    addMessage(sessionId, content, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.message.create({
                data: {
                    content,
                    role,
                    sessionId,
                },
            });
        });
    }
    getMessageHistory(sessionId_1) {
        return __awaiter(this, arguments, void 0, function* (sessionId, limit = 10) {
            return yield prisma.message.findMany({
                where: { sessionId },
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
        });
    }
}
exports.DatabaseService = DatabaseService;
exports.default = new DatabaseService();
