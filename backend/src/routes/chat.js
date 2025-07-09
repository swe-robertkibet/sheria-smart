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
const title_generator_1 = __importDefault(require("../services/title-generator"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const structuredGeminiService = new structured_gemini_1.StructuredGeminiService();
/**
 * DEPRECATED: Old session creation endpoint - removed in new architecture
 * Sessions are now created only when the first message is sent
 */
// Search chat sessions - MUST come before /sessions
router.get('/sessions/search', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { q: query, limit = '10', chatType } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const sessions = yield database_1.default.searchChatSessions(req.user.userId, query, parseInt(limit), chatType);
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
        const { limit = '20', cursor, chatType } = req.query;
        const sessions = yield database_1.default.getArchivedChats(req.user.userId, parseInt(limit), cursor, chatType);
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
        const { limit = '20', cursor, chatType } = req.query;
        const sessions = yield database_1.default.getUserChatSessions(req.user.userId, parseInt(limit), cursor, chatType);
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
/**
 * NEW ARCHITECTURE: Send a message and get streaming AI response
 * This endpoint now handles session creation with the first message
 */
router.post('/send-stream', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e, _f, _g, _h, _j, _k;
    try {
        console.log('🔍 [DEBUG] /send-stream endpoint hit:', {
            timestamp: new Date().toISOString(),
            userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId,
            body: req.body,
            headers: {
                'content-type': req.headers['content-type'],
                'user-agent': req.headers['user-agent'],
                'origin': req.headers.origin,
                'referer': req.headers.referer
            }
        });
        if (!req.user) {
            console.error('🚨 [ERROR] User not authenticated in /send-stream');
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { sessionId, message } = req.body;
        console.log('🔍 [DEBUG] Request validation:', {
            hasSessionId: !!sessionId,
            sessionId,
            hasMessage: !!message,
            messageType: typeof message,
            messageLength: message === null || message === void 0 ? void 0 : message.length,
            messagePreview: (message === null || message === void 0 ? void 0 : message.substring(0, 100)) + ((message === null || message === void 0 ? void 0 : message.length) > 100 ? '...' : '')
        });
        if (!message) {
            console.error('🚨 [ERROR] Message is required but not provided');
            return res.status(400).json({ error: 'Message is required' });
        }
        if (typeof message !== 'string') {
            console.error('🚨 [ERROR] Message must be a string, got:', typeof message);
            return res.status(400).json({ error: 'Message must be a string' });
        }
        if (message.trim().length === 0) {
            console.error('🚨 [ERROR] Message cannot be empty');
            return res.status(400).json({ error: 'Message cannot be empty' });
        }
        // Set headers for streaming response
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        let currentSessionId = sessionId;
        let conversationHistory = [];
        // If sessionId is provided, load existing conversation
        if (sessionId) {
            console.log('🔍 [DEBUG] Loading existing session:', sessionId);
            const session = yield database_1.default.getChatSession(sessionId);
            console.log('🔍 [DEBUG] Session found:', {
                exists: !!session,
                userId: session === null || session === void 0 ? void 0 : session.userId,
                currentUserId: req.user.userId,
                match: (session === null || session === void 0 ? void 0 : session.userId) === req.user.userId
            });
            if (!session || session.userId !== req.user.userId) {
                console.error('🚨 [ERROR] Access denied to session:', sessionId);
                return res.status(403).json({ error: 'Access denied to this chat session' });
            }
            // Get conversation history
            const history = yield database_1.default.getMessageHistory(sessionId, 5);
            console.log('🔍 [DEBUG] Loaded conversation history:', {
                messageCount: history.length,
                lastMessage: ((_f = (_e = history[0]) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.substring(0, 50)) + '...'
            });
            conversationHistory = history.reverse().map(msg => ({
                role: msg.role,
                content: msg.content
            }));
        }
        // Generate streaming AI response
        console.log('🔍 [DEBUG] Starting AI response generation');
        const geminiService = new gemini_1.GeminiService();
        let fullResponse = '';
        try {
            try {
                for (var _l = true, _m = __asyncValues(geminiService.generateStreamingResponse(message, conversationHistory)), _o; _o = yield _m.next(), _a = _o.done, !_a; _l = true) {
                    _c = _o.value;
                    _l = false;
                    const chunk = _c;
                    fullResponse += chunk;
                    res.write(chunk);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_l && !_a && (_b = _m.return)) yield _b.call(_m);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log('🔍 [DEBUG] AI response generated:', {
                responseLength: fullResponse.length,
                responsePreview: fullResponse.substring(0, 100) + '...'
            });
        }
        catch (error) {
            console.error('🚨 [ERROR] Error during AI response generation:', error);
            throw error;
        }
        // NEW ARCHITECTURE: Create session with first message if this is the first message
        if (!currentSessionId) {
            console.log('🔍 [DEBUG] Creating new session with first message...');
            try {
                // Generate title for the session
                const title = yield title_generator_1.default.generateChatTitle(message);
                console.log('🔍 [DEBUG] Generated title:', title);
                // Create session with both messages atomically
                const session = yield database_1.default.createChatSessionWithFirstMessage(req.user.userId, 'QUICK_CHAT', title, message, fullResponse);
                currentSessionId = session.id;
                console.log('🔍 [DEBUG] Created session:', currentSessionId);
                // Write session ID to stream for frontend to pick up
                res.write(`\n__SESSION_ID__:${currentSessionId}\n`);
            }
            catch (error) {
                console.error('🚨 [ERROR] Error creating session:', error);
                throw error;
            }
        }
        else {
            console.log('🔍 [DEBUG] Adding messages to existing session:', currentSessionId);
            try {
                // Add messages to existing session
                yield database_1.default.addMessage(currentSessionId, message, 'USER');
                yield database_1.default.addMessage(currentSessionId, fullResponse, 'ASSISTANT');
                console.log('🔍 [DEBUG] Messages added to existing session');
            }
            catch (error) {
                console.error('🚨 [ERROR] Error adding messages to session:', error);
                throw error;
            }
        }
        res.end();
    }
    catch (error) {
        console.error('🚨 [ERROR] Error processing streaming chat message:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace',
            timestamp: new Date().toISOString(),
            userId: (_g = req.user) === null || _g === void 0 ? void 0 : _g.userId,
            sessionId: (_h = req.body) === null || _h === void 0 ? void 0 : _h.sessionId,
            messageLength: (_k = (_j = req.body) === null || _j === void 0 ? void 0 : _j.message) === null || _k === void 0 ? void 0 : _k.length
        });
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process streaming message' });
        }
        else {
            res.write('\n\nError: Failed to process streaming message');
            res.end();
        }
    }
}));
/**
 * NEW ARCHITECTURE: Send a message and get structured AI response
 * This endpoint now handles session creation with the first message
 */
router.post('/send-structured', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const { sessionId, message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        let currentSessionId = sessionId;
        let conversationHistory = [];
        // If sessionId is provided, load existing conversation
        if (sessionId) {
            const session = yield database_1.default.getChatSession(sessionId);
            if (!session || session.userId !== req.user.userId) {
                return res.status(403).json({ error: 'Access denied to this chat session' });
            }
            // Get conversation history
            const history = yield database_1.default.getMessageHistory(sessionId, 5);
            conversationHistory = history.reverse().map(msg => ({
                role: msg.role,
                content: msg.content
            }));
        }
        // Generate structured AI response
        const { classification, advice } = yield structuredGeminiService.generateFullResponse(message, conversationHistory);
        // NEW ARCHITECTURE: Create session with first message if this is the first message
        if (!currentSessionId) {
            console.log('Creating new structured session with first message...');
            // Generate title for the session
            const title = yield title_generator_1.default.generateChatTitle(message);
            console.log('Generated title:', title);
            // Save structured response as JSON string
            const structuredResponse = JSON.stringify(advice);
            // Create session with both messages atomically
            const session = yield database_1.default.createChatSessionWithFirstMessage(req.user.userId, 'STRUCTURED_ANALYSIS', title, message, structuredResponse);
            currentSessionId = session.id;
            console.log('Created structured session:', currentSessionId);
        }
        else {
            // Add messages to existing session
            yield database_1.default.addMessage(currentSessionId, message, 'USER');
            const structuredResponse = JSON.stringify(advice);
            yield database_1.default.addMessage(currentSessionId, structuredResponse, 'ASSISTANT');
        }
        res.json({
            classification,
            advice,
            sessionId: currentSessionId,
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
