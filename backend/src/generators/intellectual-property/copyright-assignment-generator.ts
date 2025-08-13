import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { CopyrightAssignmentUserInput, GeneratedCopyrightAssignmentContent } from '../../types/documents/intellectual-property/copyright-assignment';

export class CopyrightAssignmentGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'COPYRIGHT ASSIGNMENT AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as CopyrightAssignmentUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const authorName = (input.authorName || (input as any).party1Name || 'Author').replace(/[^a-zA-Z0-9]/g, '_');
    const assigneeName = (input.assigneeName || (input as any).party2Name || 'Assignee').replace(/[^a-zA-Z0-9]/g, '_');
    return `Copyright_Assignment_Agreement_${authorName}_${assigneeName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as CopyrightAssignmentUserInput;
    const partyInfo: string[] = [];

    // Handle both specific field names and generic field names for backward compatibility
    const authorName = input.authorName || (input as any).party1Name || 'Author';
    const authorAddress = input.authorAddress || (input as any).party1Address || 'Address not provided';
    const assigneeName = input.assigneeName || (input as any).party2Name || 'Assignee';
    const assigneeAddress = input.assigneeAddress || (input as any).party2Address || 'Address not provided';

    // Author Information
    partyInfo.push('Author/Assignor Information:');
    partyInfo.push(`Name: ${authorName}`);
    partyInfo.push(`Address: ${authorAddress}`);
    if (input.authorEmail) {
      partyInfo.push(`Email: ${input.authorEmail}`);
    }
    if (input.authorPhone) {
      partyInfo.push(`Phone: ${input.authorPhone}`);
    }
    partyInfo.push('');

    // Assignee Information
    partyInfo.push('Assignee Information:');
    partyInfo.push(`Name: ${assigneeName}`);
    partyInfo.push(`Address: ${assigneeAddress}`);
    if (input.assigneeEmail) {
      partyInfo.push(`Email: ${input.assigneeEmail}`);
    }
    if (input.assigneePhone) {
      partyInfo.push(`Phone: ${input.assigneePhone}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedCopyrightAssignmentContent): DocumentSection[] {
    const input = userInput as unknown as CopyrightAssignmentUserInput;
    
    return [
      {
        title: 'ASSIGNMENT OF COPYRIGHT',
        content: generatedContent.assignmentOfCopyright || this.generateAssignmentOfCopyright(input)
      },
      {
        title: 'WORK DESCRIPTION',
        content: generatedContent.workDescription || this.generateWorkDescription(input)
      },
      {
        title: 'SCOPE AND LIMITATIONS',
        content: generatedContent.scopeAndLimitations || this.generateScopeAndLimitations(input)
      },
      {
        title: 'CONSIDERATION',
        content: generatedContent.consideration || this.generateConsideration(input)
      },
      {
        title: 'WARRANTIES AND REPRESENTATIONS',
        content: generatedContent.warrantiesAndRepresentations || this.generateWarrantiesAndRepresentations(input)
      },
      {
        title: 'MORAL RIGHTS',
        content: generatedContent.moralRights || this.generateMoralRights(input)
      },
      {
        title: 'INDEMNIFICATION',
        content: generatedContent.indemnification || this.generateIndemnification(input)
      },
      {
        title: 'TERMINATION',
        content: generatedContent.termination || this.generateTermination(input)
      },
      {
        title: 'GENERAL PROVISIONS',
        content: generatedContent.generalProvisions || this.generateGeneralProvisions(input)
      },
      {
        title: 'SIGNATURES',
        content: generatedContent.signatures || this.generateSignatures(input)
      }
    ];
  }

  private generateAssignmentOfCopyright(input: CopyrightAssignmentUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const authorName = input.authorName || (input as any).party1Name || 'Author';
    const assigneeName = input.assigneeName || (input as any).party2Name || 'Assignee';
    const scope = input.assignmentScope === 'exclusive' ? 'exclusive' : 'non-exclusive';
    
    return `This Copyright Assignment Agreement ("Agreement") is entered into between ${authorName}, the author/creator of the Work (as defined below) ("Assignor"), and ${assigneeName} ("Assignee"). By this Agreement, Assignor hereby assigns to Assignee all rights, title, and interest in and to the copyright and all rights under copyright in the Work, on an ${scope} basis, subject to the terms and conditions set forth herein.

The assignment is effective as of ${input.effectiveDate} and shall be binding upon the parties' respective heirs, successors, and assigns.`;
  }

  private generateWorkDescription(input: CopyrightAssignmentUserInput): string {
    const registrationText = input.copyrightRegistrationNumber ? 
      `\n\nCopyright Registration Number: ${input.copyrightRegistrationNumber}` : '';
    const creationText = input.creationDate ? 
      `\n\nDate of Creation: ${input.creationDate}` : '';
    
    return `Work Title: ${input.workTitle}

Work Description: ${input.workDescription}

The Work includes all derivative works, translations, adaptations, and modifications thereof, whether now existing or hereafter created.${registrationText}${creationText}`;
  }

  private generateScopeAndLimitations(input: CopyrightAssignmentUserInput): string {
    const scopeDescription = input.assignmentScope === 'exclusive' ? 
      'This assignment grants Assignee the exclusive right to use, reproduce, distribute, display, perform, and create derivative works based on the Work.' :
      'This assignment grants Assignee the non-exclusive right to use, reproduce, distribute, display, perform, and create derivative works based on the Work. Assignor retains the right to grant similar rights to other parties.';

    return `${scopeDescription}

Territory: ${input.territory}

Duration: ${input.duration}

The rights assigned include, but are not limited to:
• The right to reproduce the Work in any form or medium
• The right to distribute copies of the Work
• The right to display and perform the Work publicly
• The right to create derivative works based on the Work
• The right to license or sublicense the Work to third parties
• The right to register the copyright in the name of the Assignee

All rights not expressly assigned remain with the Assignor.`;
  }

  private generateConsideration(input: CopyrightAssignmentUserInput): string {
    return `In consideration for this assignment, Assignee shall provide the following consideration: ${input.consideration}

Payment terms and conditions are as set forth above. Receipt and sufficiency of consideration are hereby acknowledged by Assignor.

All payments shall be made in Kenya Shillings unless otherwise specified. Any taxes arising from payments under this Agreement shall be the responsibility of the receiving party in accordance with Kenyan tax laws.`;
  }

  private generateWarrantiesAndRepresentations(input: CopyrightAssignmentUserInput): string {
    return `${input.warrantyProvisions}

Assignor warrants and represents that:
• Assignor is the sole author and owner of the Work
• The Work is original and does not infringe upon any third-party rights
• Assignor has the full right and authority to enter into this Agreement
• The Work has not been previously assigned or licensed to any other party (except as disclosed)
• There are no outstanding obligations that would interfere with this assignment
• The Work complies with all applicable laws and regulations

Assignor agrees to execute any additional documents necessary to perfect Assignee's rights in the Work.`;
  }

  private generateMoralRights(input: CopyrightAssignmentUserInput): string {
    const moralRightsText = input.moralRightsWaiver === 'waived' ? 
      'Assignor hereby waives any and all moral rights in the Work, including the right of attribution and the right of integrity, to the extent permitted by law.' :
      'Assignor retains moral rights in the Work, including the right of attribution and the right of integrity. Assignee agrees to respect these moral rights and provide appropriate attribution when using the Work.';

    return `Moral Rights: ${moralRightsText}

Under the Copyright Act 2001 of Kenya, moral rights are recognized and protected. The parties acknowledge that moral rights may be subject to limitations under Kenyan law and international copyright conventions to which Kenya is a signatory.`;
  }

  private generateIndemnification(input: CopyrightAssignmentUserInput): string {
    const indemnificationText = input.indemnificationTerms || 
      'Assignor agrees to indemnify and hold harmless Assignee from any claims, damages, or expenses arising from any breach of the warranties and representations contained herein.';

    return `${indemnificationText}

Each party agrees to promptly notify the other party of any claims or legal proceedings related to the Work. The indemnifying party shall have the right to control the defense of any such claims.

This indemnification obligation shall survive the termination or expiration of this Agreement.`;
  }

  private generateTermination(input: CopyrightAssignmentUserInput): string {
    const terminationText = input.terminationConditions || 
      'This Agreement may be terminated by mutual written consent of the parties or upon material breach by either party, provided that the non-breaching party gives thirty (30) days written notice of such breach and the breaching party fails to cure such breach within the notice period.';

    return `${terminationText}

Upon termination:
• All rights assigned hereunder shall revert to Assignor (except for non-exclusive assignments where third-party rights may continue)
• Assignee shall cease all use of the Work
• Assignee shall return or destroy all copies of the Work in its possession
• Any consideration paid shall not be refundable unless otherwise agreed

This provision does not affect any rights that may have been granted to third parties prior to termination.`;
  }

  private generateGeneralProvisions(input: CopyrightAssignmentUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const disputeText = input.disputeResolution || 
      'Any disputes arising under this Agreement shall be resolved through good faith negotiation, and if necessary, through the courts of Kenya having competent jurisdiction.';
    const additionalTerms = input.additionalTerms || '';

    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}, including the Copyright Act 2001.

${disputeText}

Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements relating to the subject matter hereof.

Amendment: This Agreement may only be modified by a written instrument signed by both parties.

Registration: Assignee may register this assignment with the Kenya Copyright Board (KECOBO) or any other relevant copyright office.

Severability: If any provision of this Agreement is held invalid or unenforceable, the remainder of the Agreement shall continue in full force and effect.

${additionalTerms}`;
  }

  private generateSignatures(input: CopyrightAssignmentUserInput): string {
    return `ASSIGNOR (AUTHOR):

_______________________
${input.authorName}
Address: ${input.authorAddress}
Date: _______________


ASSIGNEE:

_______________________
${input.assigneeName}
Address: ${input.assigneeAddress}
Date: _______________


WITNESSES:

Witness 1:
_______________________
Name: _________________
Address: _______________
Date: _______________

Witness 2:
_______________________
Name: _________________
Address: _______________
Date: _______________`;
  }
}