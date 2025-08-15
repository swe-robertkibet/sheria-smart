import { GoogleGenerativeAI } from '@google/generative-ai';
import { StructuredLegalResponse, QuestionClassification, LegalArea, UrgencyLevel, ActionType, DocumentSuggestion } from '../types/legal';
import DocumentCatalog from './document-catalog';

export class StructuredGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    console.log('Structured Gemini API Service initialized');
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use a single model with JSON output
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });
  }

  async classifyQuestion(userMessage: string): Promise<QuestionClassification> {
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

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      return JSON.parse(cleanedText) as QuestionClassification;
    } catch (error) {
      console.error('Error classifying question:', error);
      // Return default classification on error
      return {
        legalArea: LegalArea.OTHER,
        urgencyLevel: UrgencyLevel.MEDIUM,
        complexity: "moderate",
        requiresSpecialist: true,
        keywords: []
      };
    }
  }

  private shouldSuggestDocuments(legalArea: string, userMessage: string): boolean {
    const messageLower = userMessage.toLowerCase();
    
    // Don't suggest documents for these types of cases
    const noDocumentCases = [
      // Criminal cases (unless settlement context)
      ['assault', 'hit', 'attack', 'violence', 'crime', 'police'],
      // Information seeking only
      ['what is', 'how to', 'can you explain', 'tell me about'],
      // Emergency situations
      ['urgent', 'emergency', 'immediate help', 'right now']
    ];
    
    // Criminal law cases should only suggest settlement/mediation documents if dispute resolution context
    if (legalArea === 'Criminal Law') {
      const settlementContext = ['settle', 'mediation', 'resolve', 'agreement', 'compensation'];
      const hasSettlementContext = settlementContext.some(term => messageLower.includes(term));
      if (!hasSettlementContext) {
        return false; // No documents for pure criminal cases
      }
    }
    
    // Check if this is a case where documents are not appropriate
    for (const caseType of noDocumentCases) {
      if (caseType.some(term => messageLower.includes(term))) {
        return false;
      }
    }
    
    return true;
  }

  private generateDocumentSuggestions(
    legalArea: string,
    keywords: string[],
    userMessage: string
  ): DocumentSuggestion[] {
    // Check if we should suggest documents for this case
    if (!this.shouldSuggestDocuments(legalArea, userMessage)) {
      return [];
    }
    
    const suggestedDocs = DocumentCatalog.getDocumentSuggestions(legalArea, keywords, userMessage);
    
    return suggestedDocs.map(doc => {
      // Generate reason based on document type and user context
      let reason = `Based on your ${legalArea.toLowerCase()} situation, this document can help formalize your legal position.`;
      
      // Customize reason based on document type
      if (doc.name.includes('Agreement') || doc.name.includes('Contract')) {
        reason = `This document will help establish clear terms and protect your rights in your ${legalArea.toLowerCase()} matter.`;
      } else if (doc.name.includes('Notice')) {
        reason = `This formal notice document will help you communicate your legal position properly.`;
      } else if (doc.name.includes('Application') || doc.name.includes('Petition')) {
        reason = `This document will help you formally request the legal remedy or action you need.`;
      }

      return {
        documentType: doc.id,
        documentName: doc.name,
        category: DocumentCatalog.getCategoryInfo(doc.category)?.name || doc.category,
        reason,
        navigationSteps: DocumentCatalog.getDocumentNavigationSteps(doc.id),
        requiredInputs: doc.requiredFields.slice(0, 5), // Show first 5 key fields
        estimatedTime: DocumentCatalog.getEstimatedCompletionTime(doc.id),
        priority: doc.complexity === 'High' ? UrgencyLevel.HIGH : 
                 doc.complexity === 'Medium' ? UrgencyLevel.MEDIUM : UrgencyLevel.LOW
      };
    });
  }

  async generateStructuredResponse(
    userMessage: string, 
    classification: QuestionClassification,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<StructuredLegalResponse> {
    try {
      const context = conversationHistory.map(msg => 
        `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

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

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      const structuredResponse = JSON.parse(cleanedText) as StructuredLegalResponse;
      
      // Add document suggestions
      const documentSuggestions = this.generateDocumentSuggestions(
        classification.legalArea,
        classification.keywords,
        userMessage
      );
      
      if (documentSuggestions.length > 0) {
        structuredResponse.documentSuggestions = documentSuggestions;
      }
      
      return structuredResponse;
    } catch (error) {
      console.error('Error generating structured response:', error);
      console.error('Raw response:', error);
      throw new Error('Failed to generate structured legal advice');
    }
  }

  async generateFullResponse(
    userMessage: string,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<{ classification: QuestionClassification; advice: StructuredLegalResponse }> {
    try {
      // First classify the question
      const classification = await this.classifyQuestion(userMessage);
      
      // Then generate structured advice based on classification
      const advice = await this.generateStructuredResponse(userMessage, classification, conversationHistory);
      
      return { classification, advice };
    } catch (error) {
      console.error('Error generating full response:', error);
      throw new Error('Failed to generate legal response');
    }
  }
}