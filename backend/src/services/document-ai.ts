import { GoogleGenerativeAI } from '@google/generative-ai';
import { NDAUserInput, GeneratedNDAContent } from '../types/document';

const KENYAN_LEGAL_SYSTEM_PROMPT = `You are a specialized legal document assistant for Kenyan law. Your role is to generate professional, legally sound content for Non-Disclosure Agreements (NDAs) that comply with Kenyan legal standards.

Key Requirements:
1. Base all content on Kenyan law and legal principles
2. Reference the Law of Contract Act (Cap 23) where applicable
3. Include provisions that align with the Constitution of Kenya 2010, Article 31 (right to privacy)
4. Ensure compliance with the Data Protection Act 2019 where relevant
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

  async generateNDAContent(userInput: NDAUserInput, backstory: string): Promise<GeneratedNDAContent> {
    try {
      const prompt = `${KENYAN_LEGAL_SYSTEM_PROMPT}

Generate professional content for a Non-Disclosure Agreement (NDA) based on the following information:

PARTIES INFORMATION:
Disclosing Party: ${userInput.disclosingPartyName}
Address: ${userInput.disclosingPartyAddress}

Receiving Party: ${userInput.receivingPartyName}
Address: ${userInput.receivingPartyAddress}

AGREEMENT CONTEXT:
Purpose: ${userInput.purposeOfDisclosure}
Backstory: ${backstory}
Specific Confidential Information: ${userInput.specificConfidentialInfo}
Duration: ${userInput.agreementDuration}
Is Perpetual: ${userInput.isPerperual}
Effective Date: ${userInput.effectiveDate}
${userInput.additionalTerms ? `Additional Terms: ${userInput.additionalTerms}` : ''}

Generate ONLY a valid JSON object with this exact structure:

{
  "title": "Professional title for the NDA document",
  "recitals": "Background and purpose section explaining why parties are entering into this agreement, referencing the specific context provided",
  "definitions": "Clear definitions of key terms including 'Confidential Information', 'Disclosing Party', 'Receiving Party', and other relevant terms under Kenyan law",
  "confidentialityObligations": "Detailed obligations of the receiving party regarding confidential information, including restrictions on use, disclosure, and copying under Kenyan legal standards",
  "permittedUses": "Specific authorized uses of confidential information based on the purpose provided, with clear limitations",
  "exclusions": "Standard exclusions from confidentiality (public domain information, independently developed information, etc.) as recognized under Kenyan contract law",
  "termDuration": "Duration clause covering the term of confidentiality obligations, considering whether perpetual or time-limited",
  "remediesAndEnforcement": "Remedies for breach including injunctive relief and damages, referencing Kenyan legal remedies and court jurisdiction",
  "generalProvisions": "Standard contractual provisions including entire agreement, amendment procedures, severability, and notice requirements compliant with Kenyan law",
  "governingLaw": "Governing law clause specifying jurisdiction under Kenyan law and courts",
  "signatures": "Professional signature blocks with proper execution requirements for enforceability under Kenyan law, formatted for immediate signing"
}

Guidelines:
- Use professional legal language appropriate for Kenyan legal documents
- Reference specific Kenyan statutes where applicable
- Create production-ready documents ready for signing without any disclaimers, notices, or recommendations for legal counsel
- Ensure enforceability under Kenyan contract law
- Tailor content to the specific context and backstory provided
- Include clear consequences for breach
- Address the specific confidential information categories mentioned

CRITICAL RESTRICTIONS - NEVER INCLUDE:
- Do NOT include any text suggesting the document is for informational purposes only
- Do NOT include recommendations to consult legal counsel
- Do NOT include "IMPORTANT NOTICE" or similar disclaimer language
- Do NOT include phrases like "does not constitute legal advice"
- Do NOT include any text suggesting parties should seek independent legal counsel
- The document must be fully executable and legally binding as-is

Return ONLY the JSON object, no additional text or formatting.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      const generatedContent = JSON.parse(cleanedText) as GeneratedNDAContent;
      
      // Clean content for PDF compatibility and remove any disclaimer text
      const cleanContent = (str: string): string => {
        return str
          // Remove disclaimer text patterns
          .replace(/IMPORTANT\s+NOTICE:?[^.]*\.?/gi, '')
          .replace(/This document is generated for informational purposes only[^.]*\.?/gi, '')
          .replace(/does not constitute legal advice[^.]*\.?/gi, '')
          .replace(/It is strongly recommended that both parties seek independent legal counsel[^.]*\.?/gi, '')
          .replace(/parties should consult with qualified.*?legal counsel[^.]*\.?/gi, '')
          .replace(/seek independent legal advice[^.]*\.?/gi, '')
          .replace(/\*\*Disclaimer:\*\*[^.]*\.?/gi, '')
          .replace(/\*\*Recommendation:\*\*[^.]*\.?/gi, '')
          // Clean formatting
          .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes with regular quotes
          .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
          .replace(/[\u2013\u2014]/g, '-') // Replace em/en dashes with hyphens
          .replace(/[\u2026]/g, '...') // Replace ellipsis
          .replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only ASCII + basic whitespace
          .trim();
      };
      
      // Apply cleaning to all content fields
      Object.keys(generatedContent).forEach(key => {
        const value = generatedContent[key as keyof GeneratedNDAContent];
        if (typeof value === 'string') {
          (generatedContent as any)[key] = cleanContent(value);
        }
      });
      
      // Validate the response has all required fields
      const requiredFields = [
        'title', 'recitals', 'definitions', 'confidentialityObligations',
        'permittedUses', 'exclusions', 'termDuration', 'remediesAndEnforcement',
        'generalProvisions', 'governingLaw', 'signatures'
      ];
      
      for (const field of requiredFields) {
        if (!generatedContent[field as keyof GeneratedNDAContent]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Final validation: Ensure no disclaimer text made it through
      const disclaimerPatterns = [
        /informational purposes only/i,
        /does not constitute legal advice/i,
        /seek independent legal counsel/i,
        /important notice/i,
        /qualified.*attorneys/i,
        /legal advice/i
      ];

      for (const field of requiredFields) {
        const content = generatedContent[field as keyof GeneratedNDAContent] as string;
        for (const pattern of disclaimerPatterns) {
          if (pattern.test(content)) {
            console.warn(`Disclaimer text detected in field ${field}, regenerating with fallback`);
            return this.getFallbackNDAContent(userInput, backstory);
          }
        }
      }
      
      return generatedContent;
    } catch (error) {
      console.error('Error generating NDA content:', error);
      
      // Fallback content if AI generation fails
      return this.getFallbackNDAContent(userInput, backstory);
    }
  }

  private getFallbackNDAContent(userInput: NDAUserInput, backstory: string): GeneratedNDAContent {
    // Clean content for PDF compatibility
    const cleanContent = (str: string): string => {
      return str
        .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes with regular quotes
        .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
        .replace(/[\u2013\u2014]/g, '-') // Replace em/en dashes with hyphens
        .replace(/[\u2026]/g, '...') // Replace ellipsis
        .replace(/[^\x20-\x7E\n\r\t]/g, '') // Keep only ASCII + basic whitespace
        .trim();
    };

    const fallbackContent = {
      title: "NON-DISCLOSURE AGREEMENT",
      
      recitals: `WHEREAS, ${userInput.disclosingPartyName} ("Disclosing Party") possesses certain confidential and proprietary information related to ${userInput.purposeOfDisclosure}; and WHEREAS, ${userInput.receivingPartyName} ("Receiving Party") desires to receive such confidential information for the purpose of ${backstory}; and WHEREAS, both parties wish to protect the confidentiality of such information under the laws of the Republic of Kenya;`,
      
      definitions: `For the purposes of this Agreement: (a) "Confidential Information" means ${userInput.specificConfidentialInfo} and any other technical, business, or proprietary information disclosed by the Disclosing Party; (b) "Disclosing Party" means ${userInput.disclosingPartyName}; (c) "Receiving Party" means ${userInput.receivingPartyName}; (d) "Purpose" means ${userInput.purposeOfDisclosure}.`,
      
      confidentialityObligations: `The Receiving Party agrees to: (a) maintain the confidentiality of all Confidential Information; (b) not disclose Confidential Information to any third parties without prior written consent; (c) use reasonable care to protect the confidentiality of such information; (d) limit access to Confidential Information to authorized personnel only; (e) return or destroy all Confidential Information upon request or termination of this Agreement.`,
      
      permittedUses: `The Receiving Party may use Confidential Information solely for the Purpose as defined herein. Any other use requires express written permission from the Disclosing Party.`,
      
      exclusions: `This Agreement shall not apply to information that: (a) is or becomes publicly available through no breach of this Agreement; (b) is rightfully known by the Receiving Party prior to disclosure; (c) is independently developed by the Receiving Party without use of Confidential Information; (d) is required to be disclosed by law or court order.`,
      
      termDuration: userInput.isPerperual 
        ? `The obligations of confidentiality shall survive indefinitely unless terminated by mutual written agreement of the parties.`
        : `This Agreement shall remain in effect for ${userInput.agreementDuration} from the Effective Date, unless earlier terminated by mutual consent of the parties.`,
      
      remediesAndEnforcement: `The Receiving Party acknowledges that breach of this Agreement may cause irreparable harm to the Disclosing Party. Therefore, the Disclosing Party shall be entitled to seek injunctive relief and monetary damages in the courts of Kenya. The prevailing party shall be entitled to reasonable attorney's fees and costs.`,
      
      generalProvisions: `This Agreement constitutes the entire agreement between the parties regarding the subject matter herein. Any modifications must be in writing and signed by both parties. If any provision is deemed unenforceable, the remainder shall remain in effect. All notices shall be in writing and delivered to the addresses specified herein.`,
      
      governingLaw: `This Agreement shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of Kenya.`,
      
      signatures: `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\nDISCLOSING PARTY:\n\nSignature: _____________________\nName: ${userInput.disclosingPartyName}\nTitle: _____________________\nDate: ___________\n\n\nRECEIVING PARTY:\n\nSignature: _____________________\nName: ${userInput.receivingPartyName}\nTitle: _____________________\nDate: ___________\n\n\nWITNESS:\n\nSignature: _____________________\nName: _____________________\nTitle: _____________________\nDate: ___________`
    };

    // Apply cleaning to all content fields
    Object.keys(fallbackContent).forEach(key => {
      const value = fallbackContent[key as keyof GeneratedNDAContent];
      if (typeof value === 'string') {
        (fallbackContent as any)[key] = cleanContent(value);
      }
    });

    return fallbackContent;
  }

  async validateNDAInput(userInput: NDAUserInput): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Required field validation
    if (!userInput.disclosingPartyName?.trim()) {
      errors.push('Disclosing party name is required');
    }
    if (!userInput.receivingPartyName?.trim()) {
      errors.push('Receiving party name is required');
    }
    if (!userInput.disclosingPartyAddress?.trim()) {
      errors.push('Disclosing party address is required');
    }
    if (!userInput.receivingPartyAddress?.trim()) {
      errors.push('Receiving party address is required');
    }
    if (!userInput.disclosingPartyEmail?.trim()) {
      errors.push('Disclosing party email is required');
    }
    if (!userInput.receivingPartyEmail?.trim()) {
      errors.push('Receiving party email is required');
    }
    if (!userInput.purposeOfDisclosure?.trim()) {
      errors.push('Purpose of disclosure is required');
    }
    if (!userInput.specificConfidentialInfo?.trim()) {
      errors.push('Specific confidential information description is required');
    }
    if (!userInput.effectiveDate?.trim()) {
      errors.push('Effective date is required');
    }
    if (!userInput.isPerperual && !userInput.agreementDuration?.trim()) {
      errors.push('Agreement duration is required when not perpetual');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userInput.disclosingPartyEmail && !emailRegex.test(userInput.disclosingPartyEmail)) {
      errors.push('Disclosing party email format is invalid');
    }
    if (userInput.receivingPartyEmail && !emailRegex.test(userInput.receivingPartyEmail)) {
      errors.push('Receiving party email format is invalid');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new DocumentAIService();