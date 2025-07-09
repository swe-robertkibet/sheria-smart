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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gemini_1 = require("../services/gemini");
const structured_gemini_1 = require("../services/structured-gemini");
const database_1 = __importDefault(require("../services/database"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const structuredGeminiService = new structured_gemini_1.StructuredGeminiService();
// Create a new chat session
router.post('/session', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { chatType = 'QUICK_CHAT' } = req.body;
        const session = yield database_1.default.createChatSession(req.user.userId, chatType);
        res.json({
            sessionId: session.id,
            chatType: session.chatType
        });
    }
    catch (error) {
        console.error('Error creating chat session:', error);
        res.status(500).json({ error: 'Failed to create chat session' });
    }
}));
// Search chat sessions - MUST come before /sessions
router.get('/sessions/search', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { q: query, limit = '10' } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const sessions = yield database_1.default.searchChatSessions(req.user.userId, query, parseInt(limit));
        res.json({ sessions });
    }
    catch (error) {
        console.error('Error searching chat sessions:', error);
        res.status(500).json({ error: 'Failed to search chat sessions' });
    }
}));
// Get archived chats - MUST come before /sessions
router.get('/sessions/archived', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { limit = '20', cursor } = req.query;
        const sessions = yield database_1.default.getArchivedChats(req.user.userId, parseInt(limit), cursor);
        res.json({
            sessions,
            hasMore: sessions.length === parseInt(limit),
            nextCursor: sessions.length > 0 ? sessions[sessions.length - 1].updatedAt.toISOString() : null
        });
    }
    catch (error) {
        console.error('Error fetching archived chats:', error);
        res.status(500).json({ error: 'Failed to fetch archived chats' });
    }
}));
// Get user's chat sessions with pagination
router.get('/sessions', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { limit = '20', cursor } = req.query;
        const sessions = yield database_1.default.getUserChatSessions(req.user.userId, parseInt(limit), cursor);
        res.json({
            sessions,
            hasMore: sessions.length === parseInt(limit),
            nextCursor: sessions.length > 0 ? sessions[sessions.length - 1].updatedAt.toISOString() : null
        });
    }
    catch (error) {
        console.error('Error fetching chat sessions:', error);
        res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }
}));
// Update chat title
router.put('/sessions/:id/title', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { id } = req.params;
        const { title } = req.body;
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: 'Title is required' });
        }
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(id);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        const updatedSession = yield database_1.default.updateChatTitle(id, title.trim());
        res.json({
            sessionId: updatedSession.id,
            title: updatedSession.title
        });
    }
    catch (error) {
        console.error('Error updating chat title:', error);
        res.status(500).json({ error: 'Failed to update chat title' });
    }
}));
// Archive a chat session
router.put('/sessions/:id/archive', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { id } = req.params;
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(id);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        const archivedSession = yield database_1.default.archiveChat(id);
        res.json({
            sessionId: archivedSession.id,
            isArchived: archivedSession.isArchived
        });
    }
    catch (error) {
        console.error('Error archiving chat session:', error);
        res.status(500).json({ error: 'Failed to archive chat session' });
    }
}));
// Delete a chat session
router.delete('/sessions/:id', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { id } = req.params;
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(id);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        yield database_1.default.deleteChat(id);
        res.json({ message: 'Chat session deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting chat session:', error);
        res.status(500).json({ error: 'Failed to delete chat session' });
    }
}));
// Get chat preview
router.get('/sessions/:id/preview', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { id } = req.params;
        const preview = yield database_1.default.getChatPreview(id);
        if (!preview) {
            return res.status(404).json({ error: 'Chat session not found' });
        }
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(id);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        res.json(preview);
    }
    catch (error) {
        console.error('Error fetching chat preview:', error);
        res.status(500).json({ error: 'Failed to fetch chat preview' });
    }
}));
// Get chat summary
router.get('/sessions/:id/summary', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { id } = req.params;
        const summary = yield database_1.default.getChatSummary(id);
        if (!summary) {
            return res.status(404).json({ error: 'Chat session not found' });
        }
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(id);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        res.json(summary);
    }
    catch (error) {
        console.error('Error fetching chat summary:', error);
        res.status(500).json({ error: 'Failed to fetch chat summary' });
    }
}));
// Get paginated messages for a chat session
router.get('/sessions/:id/messages', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { id } = req.params;
        const { limit = '50', cursor } = req.query;
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(id);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        const messages = yield database_1.default.getMessagesPaginated(id, parseInt(limit), cursor ? parseInt(cursor) : undefined);
        res.json({
            messages,
            hasMore: messages.length === parseInt(limit),
            nextCursor: messages.length > 0 ? messages[messages.length - 1].msgCursor : null
        });
    }
    catch (error) {
        console.error('Error fetching paginated messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}));
// Send a message and get AI response (basic mode)
// router.post('/send', async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;
//     if (!sessionId || !message) {
//       return res.status(400).json({ error: 'Missing sessionId or message' });
//     }
//     // Get conversation history
//     const history = await DatabaseService.getMessageHistory(sessionId, 5);
//     const conversationHistory = history.reverse().map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));
//     // Save user message
//     await DatabaseService.addMessage(sessionId, message, 'USER');
//     // Generate AI response
//     const aiResponse = await geminiService.generateResponse(message, conversationHistory);
//     // Save AI response
//     await DatabaseService.addMessage(sessionId, aiResponse, 'ASSISTANT');
//     res.json({
//       response: aiResponse,
//       sessionId,
//     });
//   } catch (error) {
//     console.error('Error processing chat message:', error);
//     res.status(500).json({ error: 'Failed to process message' });
//   }
// });
// Send a message and get streaming AI response
router.post('/send-stream', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Missing sessionId or message' });
        }
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(sessionId);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        // Set headers for streaming response
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Get conversation history
        const history = yield database_1.default.getMessageHistory(sessionId, 5);
        const conversationHistory = history.reverse().map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        // Save user message
        yield database_1.default.addMessage(sessionId, message, 'USER');
        // Generate streaming AI response
        const geminiService = new gemini_1.GeminiService();
        let fullResponse = '';
        try {
            for (var _d = true, _e = __asyncValues(geminiService.generateStreamingResponse(message, conversationHistory)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                fullResponse += chunk;
                res.write(chunk);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Save complete AI response
        yield database_1.default.addMessage(sessionId, fullResponse, 'ASSISTANT');
        res.end();
    }
    catch (error) {
        console.error('Error processing streaming chat message:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process streaming message' });
        }
        else {
            res.write('\n\nError: Failed to process streaming message');
            res.end();
        }
    }
}));
// Send a message and get structured AI response
router.post('/send-structured', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Missing sessionId or message' });
        }
        // Verify the session belongs to the authenticated user
        const session = yield database_1.default.getChatSession(sessionId);
        if (!session || session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        // Get conversation history
        const history = yield database_1.default.getMessageHistory(sessionId, 5);
        const conversationHistory = history.reverse().map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        // Save user message
        yield database_1.default.addMessage(sessionId, message, 'USER');
        // Generate structured AI response
        const { classification, advice } = yield structuredGeminiService.generateFullResponse(message, conversationHistory);
        // Save structured response as JSON string
        const structuredResponse = JSON.stringify(advice);
        yield database_1.default.addMessage(sessionId, structuredResponse, 'ASSISTANT');
        res.json({
            classification,
            advice,
            sessionId,
        });
    }
    catch (error) {
        console.error('Error processing structured chat message:', error);
        res.status(500).json({ error: 'Failed to process structured message' });
    }
}));
// Get chat history
router.get('/history/:sessionId', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { sessionId } = req.params;
        const session = yield database_1.default.getChatSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        // Verify the session belongs to the authenticated user
        if (session.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied to this chat session' });
        }
        res.json({
            sessionId: session.id,
            messages: session.messages,
        });
    }
    catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
}));
exports.default = router;
