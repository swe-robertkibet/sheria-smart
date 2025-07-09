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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
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
        console.log('Gemini API Key loaded successfully');
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
    generateStreamingResponse(userMessage_1) {
        return __asyncGenerator(this, arguments, function* generateStreamingResponse_1(userMessage, conversationHistory = []) {
            var _a, e_1, _b, _c;
            try {
                // Build conversation context
                const context = conversationHistory.map(msg => `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
                const prompt = `${LEGAL_SYSTEM_PROMPT}

${context ? `Previous conversation:\n${context}\n` : ''}

User: ${userMessage}

Assistant:`;
                const result = yield __await(this.model.generateContentStream(prompt));
                try {
                    for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const chunk = _c;
                        const chunkText = chunk.text();
                        if (chunkText) {
                            yield yield __await(chunkText);
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                console.error('Error generating streaming response:', error);
                throw new Error('Failed to generate streaming AI response');
            }
        });
    }
}
exports.GeminiService = GeminiService;
