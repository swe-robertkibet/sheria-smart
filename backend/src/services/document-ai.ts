import { GoogleGenerativeAI } from '@google/generative-ai';

// Generic legal system prompt for Kenyan law (NDA-specific content removed)
const KENYAN_LEGAL_SYSTEM_PROMPT = `You are a specialized legal document assistant for Kenyan law. Your role is to generate professional, legally sound content for various legal documents that comply with Kenyan legal standards.

Key Requirements:
1. Base all content on Kenyan law and legal principles
2. Reference relevant Acts and statutes where applicable
3. Include provisions that align with the Constitution of Kenya 2010
4. Ensure compliance with relevant data protection and privacy laws
5. Use formal legal language appropriate for Kenyan courts
6. Include appropriate disclaimers about legal advice vs information
7. Structure content according to Kenyan contract law requirements

Legal Framework Context:
- Kenyan contract law is based on English common law
- Essential elements: offer/acceptance, consideration, intention, capacity, consent
- Written contracts are preferred for enforceability
- Courts favor clear, unambiguous language
- Standard remedies include damages and injunctions

Important: Generate production-ready legal documents without disclaimers or recommendations to seek legal counsel, as these will be handled separately in the application's terms and conditions.`;

export class DocumentAIService {
  private model;
  private genAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for legal documents
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096,
      },
    });
  }

  // NDA-specific methods removed - document type has been discontinued
  // Future document generation methods will be added here as needed
}

export default new DocumentAIService();