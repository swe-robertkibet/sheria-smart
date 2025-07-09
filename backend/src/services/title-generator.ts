import { GoogleGenerativeAI } from '@google/generative-ai';

export class TitleGeneratorService {
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
        temperature: 0.3,
        topK: 1,
        topP: 1,
        maxOutputTokens: 50,
      },
    });
  }

  async generateChatTitle(firstUserMessage: string): Promise<string> {
    try {
      const prompt = `Generate a concise, descriptive title for a legal chat session based on this first user message. The title should:
- Be 3-8 words long
- Capture the main legal topic or issue
- Be professional and clear
- Not include quotes or special characters
- Be in title case

User message: "${firstUserMessage}"

Return only the title, no explanations or additional text.`;

      const result = await this.model.generateContent(prompt);
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
    } catch (error) {
      console.error('Error generating chat title:', error);
      // Fallback to a basic title generation based on the message
      return this.generateFallbackTitle(firstUserMessage);
    }
  }

  private generateFallbackTitle(message: string): string {
    // Extract key legal terms or create a basic title
    const legalTerms = [
      'contract', 'employment', 'property', 'family', 'criminal', 'business',
      'consumer', 'tenant', 'landlord', 'divorce', 'custody', 'inheritance',
      'rights', 'obligations', 'dispute', 'agreement', 'lawsuit', 'legal'
    ];
    
    const words = message.toLowerCase().split(' ');
    const foundTerm = legalTerms.find(term => 
      words.some(word => word.includes(term))
    );
    
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

export default new TitleGeneratorService();