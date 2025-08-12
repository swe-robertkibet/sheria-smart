import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { NonCompeteUserInput, GeneratedNonCompeteContent } from '../../types/documents/employment/non-compete';

export class NonCompeteGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'NON-COMPETE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as NonCompeteUserInput;
    const employeeName = input.employeeName.replace(/[^a-zA-Z0-9]/g, '_');
    const employerName = input.employerName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Non_Compete_Agreement_${employerName}_${employeeName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as NonCompeteUserInput;
    const partyInfo: string[] = [];

    partyInfo.push('Employer Information:');
    partyInfo.push(`Name: ${input.employerName}`);
    partyInfo.push(`Address: ${input.employerAddress}`);
    partyInfo.push(`Email: ${input.employerEmail}`);
    partyInfo.push(`Business Registration: ${input.employerBusinessRegistration}`);
    partyInfo.push(`Business Type: ${input.employerBusinessType}`);
    
    partyInfo.push('');
    
    partyInfo.push('Employee Information:');
    partyInfo.push(`Name: ${input.employeeName}`);
    partyInfo.push(`Address: ${input.employeeAddress}`);
    partyInfo.push(`Email: ${input.employeeEmail}`);
    partyInfo.push(`Position: ${input.employeePosition}`);
    if (input.employeeId) partyInfo.push(`Employee ID: ${input.employeeId}`);

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedNonCompeteContent): DocumentSection[] {
    const input = userInput as NonCompeteUserInput;
    
    return [
      { title: 'NON-COMPETITION RESTRICTIONS', content: generatedContent.nonCompetitionRestrictions || this.generateNonCompetitionRestrictions(input) },
      { title: 'GEOGRAPHIC AND TEMPORAL SCOPE', content: generatedContent.geographicAndTemporalScope || this.generateGeographicAndTemporalScope(input) },
      { title: 'RESTRICTED ACTIVITIES', content: generatedContent.restrictedActivities || this.generateRestrictedActivities(input) },
      { title: 'NON-SOLICITATION PROVISIONS', content: generatedContent.nonSolicitationProvisions || this.generateNonSolicitationProvisions(input) },
      { title: 'CONSIDERATION', content: generatedContent.consideration || this.generateConsideration(input) },
      { title: 'EXCEPTIONS AND CARVE-OUTS', content: generatedContent.exceptions || this.generateExceptions(input) },
      { title: 'REMEDIES AND ENFORCEMENT', content: generatedContent.remedies || this.generateRemedies(input) },
      { title: 'SEVERABILITY', content: generatedContent.severability || this.generateSeverability(input) },
      { title: 'GENERAL PROVISIONS', content: generatedContent.generalProvisions || this.generateGeneralProvisions(input) },
      { title: 'SIGNATURES', content: generatedContent.signatures || this.generateSignatures(input) }
    ];
  }

  private generateNonCompetitionRestrictions(input: NonCompeteUserInput): string {
    let restrictionText = `During the term of employment with ${input.employerName} and for a period of ${input.restrictionDuration} following termination of employment (the "Restriction Period"), ${input.employeeName} agrees not to engage in the following competitive activities:\n\n`;
    
    restrictionText += `Restricted Activities: ${input.restrictedActivities}\n\n`;
    restrictionText += `Competitor Definition: ${input.competitorDefinition}\n\n`;
    restrictionText += `Restricted Services: ${input.restrictedServices}\n\n`;
    restrictionText += `Restricted Products: ${input.restrictedProducts}\n\n`;
    
    restrictionText += `Employment Context: Employee has been employed since ${input.employmentStartDate} in the position of ${input.currentPosition}. `;
    restrictionText += `Access to Confidential Information: ${input.accessToConfidentialInfo} `;
    restrictionText += `Customer Relationships: ${input.customerRelationships}`;

    return restrictionText;
  }

  private generateGeographicAndTemporalScope(input: NonCompeteUserInput): string {
    let scopeText = `Geographic Scope: The restrictions set forth in this Agreement shall apply within ${input.geographicScope}.\n\n`;
    
    if (input.specificLocations) {
      scopeText += `Specific Locations: ${input.specificLocations}\n\n`;
    }
    
    scopeText += `Territory Definition: ${input.territoryDefinition}\n\n`;
    scopeText += `Duration: The restriction period shall commence on ${input.restrictionStartDate} and continue for ${input.restrictionDuration}.\n\n`;
    
    scopeText += `The parties acknowledge that these geographic and temporal limitations are reasonable and necessary to protect the legitimate business interests of ${input.employerName}, including but not limited to customer relationships, trade secrets, and confidential information.`;

    return scopeText;
  }

  private generateRestrictedActivities(input: NonCompeteUserInput): string {
    return `During the Restriction Period, ${input.employeeName} shall not, directly or indirectly:\n\n` +
           `1. Engage in any business or activity that competes with ${input.employerName}\n` +
           `2. Provide services similar to those provided to ${input.employerName}\n` +
           `3. Participate in competitive activities as defined: ${input.restrictedActivities}\n` +
           `4. Offer or market products or services that compete with: ${input.restrictedProducts}\n` +
           `5. Provide competitive services including: ${input.restrictedServices}\n\n` +
           `This restriction applies whether ${input.employeeName} acts as an owner, partner, shareholder, director, officer, employee, agent, consultant, or in any other capacity.`;
  }

  private generateNonSolicitationProvisions(input: NonCompeteUserInput): string {
    let solicitationText = `Non-Solicitation of Customers: ${input.customerNonSolicitation}\n\n`;
    solicitationText += `Non-Solicitation of Employees: ${input.employeeNonSolicitation}\n\n`;
    
    if (input.supplierNonSolicitation) {
      solicitationText += `Non-Solicitation of Suppliers: ${input.supplierNonSolicitation}\n\n`;
    }
    
    solicitationText += `These non-solicitation obligations shall survive termination of employment and continue during the entire Restriction Period.`;

    return solicitationText;
  }

  private generateConsideration(input: NonCompeteUserInput): string {
    let considerationText = `Consideration Provided: ${input.considerationProvided}\n\n`;
    
    if (input.considerationValue) {
      considerationText += `Consideration Value: ${input.considerationValue}\n\n`;
    }
    
    if (input.additionalBenefits) {
      considerationText += `Additional Benefits: ${input.additionalBenefits}\n\n`;
    }
    
    considerationText += `${input.employeeName} acknowledges that the consideration provided is adequate and sufficient to support the restrictions contained in this Agreement. This consideration is in addition to the compensation and benefits provided during the course of employment.`;

    return considerationText;
  }

  private generateExceptions(input: NonCompeteUserInput): string {
    let exceptionsText = `The following activities are expressly permitted and shall not be deemed violations of this Agreement:\n\n`;
    
    if (input.permittedActivities) {
      exceptionsText += `Permitted Activities: ${input.permittedActivities}\n\n`;
    }
    
    if (input.generalBusinessExceptions) {
      exceptionsText += `General Business Exceptions: ${input.generalBusinessExceptions}\n\n`;
    }
    
    if (input.investmentExceptions) {
      exceptionsText += `Investment Exceptions: ${input.investmentExceptions}\n\n`;
    }
    
    exceptionsText += `These exceptions are limited to the specific activities described above and do not constitute a general waiver of the restrictions contained in this Agreement.`;

    return exceptionsText;
  }

  private generateRemedies(input: NonCompeteUserInput): string {
    let remediesText = `Remedies Available: ${input.remediesAvailable}\n\n`;
    remediesText += `Injunctive Relief: ${input.injunctiveReliefProvision}\n\n`;
    
    if (input.attorneyFeesProvision) {
      remediesText += `Attorney Fees: ${input.attorneyFeesProvision}\n\n`;
    }
    
    remediesText += `${input.employeeName} acknowledges that a breach of this Agreement would cause irreparable harm to ${input.employerName} for which monetary damages would be inadequate. Therefore, ${input.employerName} shall be entitled to seek injunctive relief, specific performance, and other equitable remedies without posting bond or proving damages.`;

    return remediesText;
  }

  private generateSeverability(input: NonCompeteUserInput): string {
    let severabilityText = `Severability Provisions: ${input.severabilityProvisions}\n\n`;
    
    if (input.modificationRights) {
      severabilityText += `Modification Rights: ${input.modificationRights}\n\n`;
    }
    
    severabilityText += `If any provision of this Agreement is found to be unenforceable or invalid, the remainder of the Agreement shall remain in full force and effect. If any restriction is deemed too broad in duration, geography, or scope, the court is requested to modify such restriction to make it enforceable to the maximum extent permitted by law.`;

    return severabilityText;
  }

  private generateGeneralProvisions(input: NonCompeteUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    
    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.\n\n` +
           `Entire Agreement: This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, and agreements.\n\n` +
           `Amendment: This Agreement may only be amended in writing signed by both parties.\n\n` +
           `Compliance with Kenyan Law: This Agreement is subject to the restraint of trade doctrine under Kenyan common law and shall be enforceable only to the extent reasonable and necessary to protect legitimate business interests.\n\n` +
           `${additionalTerms}`;
  }

  private generateSignatures(input: NonCompeteUserInput): string {
    return `EMPLOYER:\n\n_______________________\n${input.employerName}\nBy: ___________________\nTitle: ________________\nDate: _______________\n\n\nEMPLOYEE:\n\n_______________________\n${input.employeeName}\nDate: _______________`;
  }
}