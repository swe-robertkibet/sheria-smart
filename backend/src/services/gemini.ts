import { GoogleGenerativeAI } from '@google/generative-ai';
import DocumentCatalog from './document-catalog';

const LEGAL_SYSTEM_PROMPT = `You are a legal assistant specialized in Kenyan law. Your role is to:

1. Provide accurate legal information based on Kenyan legislation
2. Help users understand their rights and obligations under Kenyan law
3. Explain legal concepts in simple, accessible language
4. Suggest appropriate legal procedures and documentation
5. Always recommend consulting with a qualified lawyer for specific legal advice
6. When relevant, suggest specific documents that users might need to create for their situation

Important guidelines:
- Always clarify that you provide general legal information, not legal advice
- Encourage users to consult with qualified legal professionals for specific cases
- Focus on Kenyan law and legal procedures
- Be helpful but responsible in your responses
- If you're unsure about specific legal details, acknowledge limitations
- When suggesting documents, explain why they would be helpful and guide users on how to access them
- If a user's situation would benefit from creating legal documents, mention this and suggest they use the "Documents" feature

Please respond in a friendly, professional manner while maintaining accuracy and helpfulness.`;

export class GeminiService {
  private model;
  private genAI;

  private detectLegalArea(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();
    
    // Enhanced keyword mapping with context-specific terms
    const legalKeywords = {
      'Criminal Law': {
        primary: ['assault', 'hit', 'attack', 'violence', 'beaten', 'struck', 'crime', 'police', 'arrest', 'charge', 'theft', 'robbery', 'fraud'],
        secondary: ['report', 'complaint', 'incident', 'victim', 'perpetrator', 'criminal'],
        exclusions: ['contract', 'agreement', 'business'] // Don't classify as criminal if these appear
      },
      'Property Law': {
        primary: ['land', 'property', 'sale', 'purchase', 'title', 'deed', 'real estate', 'plot', 'acres', 'hectares'],
        secondary: ['buy', 'sell', 'owner', 'ownership', 'transfer', 'registration'],
        exclusions: []
      },
      'Employment Law': {
        primary: ['job', 'work', 'employee', 'employer', 'salary', 'wages', 'fired', 'dismissed', 'termination'],
        secondary: ['workplace', 'office', 'boss', 'supervisor', 'payroll', 'benefits'],
        exclusions: []
      },
      'Family Law': {
        primary: ['marriage', 'divorce', 'custody', 'child support', 'spouse', 'matrimonial'],
        secondary: ['family', 'children', 'husband', 'wife', 'separation'],
        exclusions: []
      },
      'Tenancy Law': {
        primary: ['rent', 'tenant', 'landlord', 'lease', 'eviction', 'rental'],
        secondary: ['apartment', 'house rental', 'deposit', 'monthly payment'],
        exclusions: []
      },
      'Business Law': {
        primary: ['business', 'company', 'partnership', 'shareholder', 'corporation', 'commercial'],
        secondary: ['investment', 'shares', 'board', 'director', 'profit'],
        exclusions: []
      },
      'Contract Law': {
        primary: ['contract', 'agreement', 'breach', 'terms', 'obligations', 'service agreement'],
        secondary: ['party', 'clause', 'provision', 'payment terms'],
        exclusions: ['land sale', 'property sale', 'employment contract'] // These have specific areas
      },
      'Consumer Protection': {
        primary: ['consumer', 'warranty', 'refund', 'defective goods', 'faulty product'],
        secondary: ['purchase', 'buyer', 'seller', 'goods', 'services'],
        exclusions: []
      }
    };

    // Score each legal area based on keyword matches
    const scores: { [key: string]: number } = {};
    
    for (const [area, keywordSet] of Object.entries(legalKeywords)) {
      let score = 0;
      
      // Check for exclusions first
      const hasExclusions = keywordSet.exclusions.some(exclusion => 
        messageLower.includes(exclusion.toLowerCase())
      );
      
      if (hasExclusions && area !== 'Contract Law') {
        continue; // Skip this area if exclusions are found
      }
      
      // Primary keywords get higher weight
      keywordSet.primary.forEach(keyword => {
        if (messageLower.includes(keyword.toLowerCase())) {
          score += 3;
        }
      });
      
      // Secondary keywords get lower weight
      keywordSet.secondary.forEach(keyword => {
        if (messageLower.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });
      
      scores[area] = score;
    }
    
    // Find the area with the highest score
    const scoreValues = Object.values(scores);
    const maxScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
    if (maxScore > 0) {
      const bestArea = Object.keys(scores).find(area => scores[area] === maxScore);
      return bestArea || 'Other';
    }
    
    return 'Other';
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

  private getDocumentSuggestionText(legalArea: string, userMessage: string): string {
    // Check if we should suggest documents for this case
    if (!this.shouldSuggestDocuments(legalArea, userMessage)) {
      return '';
    }
    
    const suggestions = DocumentCatalog.getDocumentSuggestions(legalArea, [], userMessage);
    
    if (suggestions.length === 0) {
      return '';
    }

    const suggestionText = suggestions.map(doc => 
      `- **${doc.name}**: ${doc.description}`
    ).join('\n');

    return `\n\n**📋 Document Suggestions:**\nBased on your ${legalArea.toLowerCase()} question, you might need to create these documents:\n\n${suggestionText}\n\n💡 **Tip:** You can create these documents using our "Documents" feature. Just click on "Documents" from the main dashboard, select the appropriate category, and follow the guided form.`;
  }

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    console.log('Gemini API Key loaded successfully');
    
    // Initialize GoogleGenerativeAI here, after dotenv.config() has been called
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
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

  async generateResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
    try {
      // Build conversation context
      const context = conversationHistory.map(msg => 
        `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const prompt = `${LEGAL_SYSTEM_PROMPT}

${context ? `Previous conversation:\n${context}\n` : ''}

User: ${userMessage}

Assistant:`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      // Add document suggestions based on detected legal area
      const legalArea = this.detectLegalArea(userMessage);
      const documentSuggestion = this.getDocumentSuggestionText(legalArea, userMessage);
      
      if (documentSuggestion) {
        text += documentSuggestion;
      }
      
      return text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async* generateStreamingResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}> = []): AsyncGenerator<string, void, unknown> {
    try {
      // Build conversation context
      const context = conversationHistory.map(msg => 
        `${msg.role === 'USER' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');

      const prompt = `${LEGAL_SYSTEM_PROMPT}

${context ? `Previous conversation:\n${context}\n` : ''}

User: ${userMessage}

Assistant:`;

      const result = await this.model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          yield chunkText;
        }
      }
      
      // Add document suggestions at the end of streaming
      const legalArea = this.detectLegalArea(userMessage);
      const documentSuggestion = this.getDocumentSuggestionText(legalArea, userMessage);
      
      if (documentSuggestion) {
        yield documentSuggestion;
      }
    } catch (error) {
      console.error('Error generating streaming response:', error);
      throw new Error('Failed to generate streaming AI response');
    }
  }
}