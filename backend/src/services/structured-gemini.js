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
exports.StructuredGeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const legal_1 = require("../types/legal");
class StructuredGeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }
        console.log('Structured Gemini API Service initialized');
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use a single model with JSON output
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
            },
        });
    }
    classifyQuestion(userMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `Analyze this legal question and classify it according to Kenyan law. Return ONLY a valid JSON object with this exact structure:

{
  "legalArea": "one of: Contract Law, Employment Law, Property Law, Family Law, Criminal Law, Business Law, Consumer Protection, Tenancy Law, Constitutional Law, Civil Procedure, Other",
  "urgencyLevel": "one of: low, medium, high, urgent",
  "complexity": "one of: simple, moderate, complex",
  "requiresSpecialist": boolean,
  "keywords": ["array", "of", "keywords"]
}

Question to analyze: "${userMessage}"

Focus on Kenyan legal system and laws. Respond with ONLY the JSON object, no other text.`;
                const result = yield this.model.generateContent(prompt);
                const response = result.response;
                const text = response.text();
                // Clean up the response to ensure it's valid JSON
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                return JSON.parse(cleanedText);
            }
            catch (error) {
                console.error('Error classifying question:', error);
                // Return default classification on error
                return {
                    legalArea: legal_1.LegalArea.OTHER,
                    urgencyLevel: legal_1.UrgencyLevel.MEDIUM,
                    complexity: "moderate",
                    requiresSpecialist: true,
                    keywords: []
                };
            }
        });
    }
    generateStructuredResponse(userMessage_1, classification_1) {
        return __awaiter(this, arguments, void 0, function* (userMessage, classification, conversationHistory = []) {
            try {
                const context = conversationHistory.map(msg => `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
                const prompt = `You are a legal assistant specialized in Kenyan law. Provide structured legal advice for this question.

Question: "${userMessage}"
Legal Area: ${classification.legalArea}
Urgency: ${classification.urgencyLevel}
Complexity: ${classification.complexity}

${context ? `Previous conversation:\n${context}\n` : ''}

Return ONLY a valid JSON object with this exact structure (no markdown formatting):

{
  "legalArea": "${classification.legalArea}",
  "urgencyLevel": "${classification.urgencyLevel}",
  "summary": "Brief overview of the legal situation",
  "rights": [
    {
      "title": "Right title",
      "description": "Description of the right",
      "legalBasis": "Kenyan statute or law reference",
      "limitations": ["Optional array of limitations"]
    }
  ],
  "obligations": [
    {
      "title": "Obligation title", 
      "description": "Description of the obligation",
      "legalBasis": "Kenyan statute or law reference",
      "consequences": "What happens if not followed",
      "deadline": "Optional deadline"
    }
  ],
  "procedures": [
    {
      "name": "Procedure name",
      "description": "Description of the procedure", 
      "steps": ["Step 1", "Step 2", "Step 3"],
      "timeline": "Expected timeline",
      "cost": "Optional cost estimate",
      "requirements": ["Required documents or conditions"]
    }
  ],
  "nextSteps": [
    {
      "action": "one of: consult_lawyer, gather_documents, file_complaint, negotiate, mediation, court_proceedings, documentation, compliance",
      "description": "What to do",
      "timeframe": "When to do it",
      "priority": "one of: low, medium, high, urgent",
      "requiredDocuments": ["Optional list of documents needed"]
    }
  ],
  "requiredDocuments": ["List of all documents needed"],
  "relevantLaws": ["Kenyan statutes and regulations"],
  "caseReferences": ["Optional Kenyan court cases"],
  "disclaimers": ["Standard legal disclaimers"],
  "warnings": ["Optional urgent warnings"],
  "recommendConsultation": true/false,
  "consultationReason": "Optional reason why consultation is recommended"
}

Important guidelines:
- Base all advice on Kenyan law and legal system
- Provide specific legal references to Kenyan statutes
- Include appropriate disclaimers about legal advice vs information
- Be practical and actionable in recommendations
- Consider cultural and local context of Kenya
- Ensure all arrays have at least one item where required
- Return ONLY the JSON object, no other text or formatting`;
                const result = yield this.model.generateContent(prompt);
                const response = result.response;
                const text = response.text();
                // Clean up the response to ensure it's valid JSON
                const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
                return JSON.parse(cleanedText);
            }
            catch (error) {
                console.error('Error generating structured response:', error);
                console.error('Raw response:', error);
                throw new Error('Failed to generate structured legal advice');
            }
        });
    }
    generateFullResponse(userMessage_1) {
        return __awaiter(this, arguments, void 0, function* (userMessage, conversationHistory = []) {
            try {
                // First classify the question
                const classification = yield this.classifyQuestion(userMessage);
                // Then generate structured advice based on classification
                const advice = yield this.generateStructuredResponse(userMessage, classification, conversationHistory);
                return { classification, advice };
            }
            catch (error) {
                console.error('Error generating full response:', error);
                throw new Error('Failed to generate legal response');
            }
        });
    }
}
exports.StructuredGeminiService = StructuredGeminiService;
