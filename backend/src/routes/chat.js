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
        const session = yield database_1.default.createChatSession(req.user.userId);
        res.json({
            sessionId: session.id
        });
    }
    catch (error) {
        console.error('Error creating chat session:', error);
        res.status(500).json({ error: 'Failed to create chat session' });
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
