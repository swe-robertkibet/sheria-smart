import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { PartnershipAgreementUserInput, GeneratedPartnershipAgreementContent } from '../../types/documents/business/partnership-agreement';

export class PartnershipAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'PARTNERSHIP AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as PartnershipAgreementUserInput;
    const partnershipName = input.partnershipName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Partnership_Agreement_${partnershipName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as PartnershipAgreementUserInput;
    const partyInfo: string[] = [];

    // Partnership Information
    partyInfo.push('Partnership Information:');
    partyInfo.push(`Partnership Name: ${input.partnershipName}`);
    partyInfo.push(`Business Purpose: ${input.businessPurpose}`);
    partyInfo.push(`Partnership Type: ${input.partnershipType.replace('_', ' ').toUpperCase()}`);
    partyInfo.push(`Business Address: ${input.businessAddress}`);
    partyInfo.push('');

    // Partners Information
    partyInfo.push('Partners:');
    input.partners.forEach((partner, index) => {
      partyInfo.push(`Partner ${index + 1}:`);
      partyInfo.push(`Name: ${partner.partnerName}`);
      partyInfo.push(`Address: ${partner.partnerAddress}`);
      partyInfo.push(`Email: ${partner.partnerEmail}`);
      if (partner.partnerPhone) {
        partyInfo.push(`Phone: ${partner.partnerPhone}`);
      }
      partyInfo.push(`Capital Contribution: ${partner.capitalContribution} (${partner.contributionType})`);
      partyInfo.push(`Profit Share: ${partner.profitSharePercentage}%`);
      partyInfo.push(`Loss Share: ${partner.lossSharePercentage}%`);
      if (partner.managementRole) {
        partyInfo.push(`Management Role: ${partner.managementRole}`);
      }
      partyInfo.push('');
    });

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedPartnershipAgreementContent): DocumentSection[] {
    const input = userInput as PartnershipAgreementUserInput;
    
    return [
      {
        title: 'PARTNERSHIP FORMATION',
        content: generatedContent.partnershipFormation || this.generatePartnershipFormation(input)
      },
      {
        title: 'NAME AND BUSINESS PURPOSE',
        content: generatedContent.nameAndBusinessPurpose || this.generateNameAndPurpose(input)
      },
      {
        title: 'CAPITAL CONTRIBUTIONS',
        content: generatedContent.capitalContributions || this.generateCapitalContributions(input)
      },
      {
        title: 'PROFIT AND LOSS SHARING',
        content: generatedContent.profitAndLossSharing || this.generateProfitLossSharing(input)
      },
      {
        title: 'MANAGEMENT AND AUTHORITY',
        content: generatedContent.managementAndAuthority || this.generateManagementAndAuthority(input)
      },
      {
        title: 'BOOKS AND RECORDS',
        content: generatedContent.booksAndRecords || this.generateBooksAndRecords(input)
      },
      {
        title: 'PARTNER DUTIES AND RESTRICTIONS',
        content: generatedContent.partnerDutiesAndRestrictions || this.generatePartnerDuties(input)
      },
      {
        title: 'ADMISSION AND WITHDRAWAL',
        content: generatedContent.admissionAndWithdrawal || this.generateAdmissionWithdrawal(input)
      },
      {
        title: 'DISSOLUTION PROCEDURES',
        content: generatedContent.dissolutionProcedures || this.generateDissolutionProcedures(input)
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

  private generatePartnershipFormation(input: PartnershipAgreementUserInput): string {
    const partnerNames = input.partners.map(p => p.partnerName).join(', ');
    return `The undersigned partners, ${partnerNames}, hereby agree to form a ${input.partnershipType.replace('_', ' ')} partnership under the laws of the Republic of Kenya, specifically the Partnership Act (Cap 29).`;
  }

  private generateNameAndPurpose(input: PartnershipAgreementUserInput): string {
    return `Partnership Name: The partnership shall operate under the name "${input.partnershipName}". Business Purpose: ${input.businessPurpose}. Principal place of business: ${input.businessAddress}.`;
  }

  private generateCapitalContributions(input: PartnershipAgreementUserInput): string {
    let contributionText = `Total capital contribution: ${input.totalCapitalContribution}. Individual partner contributions:\n`;
    
    input.partners.forEach((partner, index) => {
      contributionText += `${partner.partnerName}: ${partner.capitalContribution} (${partner.contributionType})\n`;
    });

    contributionText += `Capital account maintenance: ${input.capitalAccountMaintenance}`;
    return contributionText;
  }

  private generateProfitLossSharing(input: PartnershipAgreementUserInput): string {
    let sharingText = `Profit distribution method: ${input.profitDistributionMethod}. Loss allocation method: ${input.lossAllocationMethod}.\n\nProfit and loss sharing percentages:\n`;
    
    input.partners.forEach(partner => {
      sharingText += `${partner.partnerName}: ${partner.profitSharePercentage}% profits, ${partner.lossSharePercentage}% losses\n`;
    });

    return sharingText;
  }

  private generateManagementAndAuthority(input: PartnershipAgreementUserInput): string {
    return `Management structure: ${input.managementStructure}. Decision-making process: ${input.decisionMakingProcess}. Signatory authority: ${input.signatoryAuthority}. ${input.meetingRequirements ? `Meeting requirements: ${input.meetingRequirements}` : ''}`;
  }

  private generateBooksAndRecords(input: PartnershipAgreementUserInput): string {
    return `Banking arrangements: ${input.bankingArrangements}. Bookkeeping responsibilities: ${input.bookkeepingResponsibilities}. Tax responsibilities: ${input.taxResponsibilities}. All partners shall have access to partnership books and records during normal business hours.`;
  }

  private generatePartnerDuties(input: PartnershipAgreementUserInput): string {
    const nonCompete = input.nonCompeteProvisions ? `Non-compete provisions: ${input.nonCompeteProvisions}` : '';
    return `Partner duties and restrictions: ${input.partnerDutiesAndRestrictions}. Confidentiality obligations: ${input.confidentialityObligations}. ${nonCompete} All partners shall act in good faith and in the best interests of the partnership.`;
  }

  private generateAdmissionWithdrawal(input: PartnershipAgreementUserInput): string {
    return `Partner withdrawal process: ${input.partnerWithdrawalProcess}. New partner admission process: ${input.newPartnerAdmissionProcess}. Any changes to partnership composition require written agreement of all existing partners.`;
  }

  private generateDissolutionProcedures(input: PartnershipAgreementUserInput): string {
    return `Dissolution triggers: ${input.dissolutionTriggers}. Dissolution procedures: ${input.dissolutionProcedures}. Asset distribution: ${input.assetDistribution}. Upon dissolution, the partnership shall be wound up in accordance with the Partnership Act (Cap 29).`;
  }

  private generateGeneralProvisions(input: PartnershipAgreementUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    return `This Agreement shall be governed by the laws of ${governingState} and the Partnership Act (Cap 29). Any amendments must be in writing and signed by all partners. ${additionalTerms}`;
  }

  private generateSignatures(input: PartnershipAgreementUserInput): string {
    let signatureText = '';
    
    input.partners.forEach(partner => {
      signatureText += `PARTNER:\n\n_______________________\n${partner.partnerName}\nAddress: ${partner.partnerAddress}\nDate: _______________\n\n`;
    });

    return signatureText;
  }
}