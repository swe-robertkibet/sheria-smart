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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gemini_1 = require("../services/gemini");
const structured_gemini_1 = require("../services/structured-gemini");
const database_1 = __importDefault(require("../services/database"));
const router = express_1.default.Router();
const geminiService = new gemini_1.GeminiService();
const structuredGeminiService = new structured_gemini_1.StructuredGeminiService();
// Create a new chat session
router.post('/session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const session = yield database_1.default.createChatSession(userId);
        res.json({ sessionId: session.id });
    }
    catch (error) {
        console.error('Error creating chat session:', error);
        res.status(500).json({ error: 'Failed to create chat session' });
    }
}));
// Send a message and get AI response (basic mode)
router.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Missing sessionId or message' });
        }
        // Get conversation history
        const history = yield database_1.default.getMessageHistory(sessionId, 5);
        const conversationHistory = history.reverse().map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        // Save user message
        yield database_1.default.addMessage(sessionId, message, 'USER');
        // Generate AI response
        const aiResponse = yield geminiService.generateResponse(message, conversationHistory);
        // Save AI response
        yield database_1.default.addMessage(sessionId, aiResponse, 'ASSISTANT');
        res.json({
            response: aiResponse,
            sessionId,
        });
    }
    catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
}));
// Send a message and get structured AI response
router.post('/send-structured', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId, message } = req.body;
        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Missing sessionId or message' });
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
router.get('/history/:sessionId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const session = yield database_1.default.getChatSession(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
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
