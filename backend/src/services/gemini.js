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
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const LEGAL_SYSTEM_PROMPT = `You are a legal assistant specialized in Kenyan law. Your role is to:

1. Provide accurate legal information based on Kenyan legislation
2. Help users understand their rights and obligations under Kenyan law
3. Explain legal concepts in simple, accessible language
4. Suggest appropriate legal procedures and documentation
5. Always recommend consulting with a qualified lawyer for specific legal advice

Important guidelines:
- Always clarify that you provide general legal information, not legal advice
- Encourage users to consult with qualified legal professionals for specific cases
- Focus on Kenyan law and legal procedures
- Be helpful but responsible in your responses
- If you're unsure about specific legal details, acknowledge limitations

Please respond in a friendly, professional manner while maintaining accuracy and helpfulness.`;
class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        console.log('Gemini API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
        console.log('Gemini API Key value:', process.env.GEMINI_API_KEY);
        // Initialize GoogleGenerativeAI here, after dotenv.config() has been called
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
        });
    }
    generateResponse(userMessage_1) {
        return __awaiter(this, arguments, void 0, function* (userMessage, conversationHistory = []) {
            try {
                // Build conversation context
                const context = conversationHistory.map(msg => `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
                const prompt = `${LEGAL_SYSTEM_PROMPT}

${context ? `Previous conversation:\n${context}\n` : ''}

User: ${userMessage}

Assistant:`;
                const result = yield this.model.generateContent(prompt);
                const response = result.response;
                const text = response.text();
                if (!text) {
                    throw new Error('Empty response from Gemini API');
                }
                return text;
            }
            catch (error) {
                console.error('Error generating response:', error);
                throw new Error('Failed to generate AI response');
            }
        });
    }
}
exports.GeminiService = GeminiService;
