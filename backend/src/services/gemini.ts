import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });
  }

  async generateResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
    try {
      // Build conversation context
      const context = conversationHistory.map(msg => 
        `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const prompt = `${LEGAL_SYSTEM_PROMPT}

${context ? `Previous conversation:\n${context}\n` : ''}

User: ${userMessage}