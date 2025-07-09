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
exports.TitleGeneratorService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class TitleGeneratorService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.3,
                topK: 1,
                topP: 1,
                maxOutputTokens: 50,
            },
        });
    }
    generateChatTitle(firstUserMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `Generate a concise, descriptive title for a legal chat session based on this first user message. The title should:
- Be 3-8 words long
- Capture the main legal topic or issue
- Be professional and clear
- Not include quotes or special characters
- Be in title case

User message: "${firstUserMessage}"

Return only the title, no explanations or additional text.`;
                const result = yield this.model.generateContent(prompt);
                const response = result.response;
                const title = response.text().trim();
                if (!title) {
                    throw new Error('Empty title generated');
                }
                // Ensure the title is reasonable length and clean
                const cleanTitle = title.replace(/['"]/g, '').trim();
                if (cleanTitle.length > 60) {
                    return cleanTitle.substring(0, 60).trim();
                }
                return cleanTitle;
            }
            catch (error) {
                console.error('Error generating chat title:', error);
                // Fallback to a basic title generation based on the message
                return this.generateFallbackTitle(firstUserMessage);
            }
        });
    }
    generateFallbackTitle(message) {
        // Extract key legal terms or create a basic title
        const legalTerms = [
            'contract', 'employment', 'property', 'family', 'criminal', 'business',
            'consumer', 'tenant', 'landlord', 'divorce', 'custody', 'inheritance',
            'rights', 'obligations', 'dispute', 'agreement', 'lawsuit', 'legal'
        ];
        const words = message.toLowerCase().split(' ');
        const foundTerm = legalTerms.find(term => words.some(word => word.includes(term)));
        if (foundTerm) {
            return `${foundTerm.charAt(0).toUpperCase() + foundTerm.slice(1)} Question`;
        }
        // If no legal terms found, create a generic but meaningful title
        const firstFewWords = message.split(' ').slice(0, 4).join(' ');
        return firstFewWords.length > 30
            ? firstFewWords.substring(0, 30).trim() + '...'
            : firstFewWords;
    }
}
exports.TitleGeneratorService = TitleGeneratorService;
exports.default = new TitleGeneratorService();
