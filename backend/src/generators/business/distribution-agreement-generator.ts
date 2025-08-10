import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { DistributionAgreementUserInput, GeneratedDistributionAgreementContent } from '../../types/documents/business/distribution-agreement';

export class DistributionAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'DISTRIBUTION AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as DistributionAgreementUserInput;
    const principalName = input.principalName.replace(/[^a-zA-Z0-9]/g, '_');
    const distributorName = input.distributorName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Distribution_Agreement_${principalName}_${distributorName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as DistributionAgreementUserInput;
    const partyInfo: string[] = [];

    // Principal Information
    partyInfo.push('Principal/Supplier Information:');
    partyInfo.push(`Name: ${input.principalName}`);
    partyInfo.push(`Address: ${input.principalAddress}`);
    partyInfo.push(`Business Registration: ${input.principalBusinessRegistration}`);
    partyInfo.push(`Email: ${input.principalEmail}`);
    
    if (input.principalPhone) {
      partyInfo.push(`Phone: ${input.principalPhone}`);
    }

    partyInfo.push(''); // Empty line

    // Distributor Information
    partyInfo.push('Distributor Information:');
    partyInfo.push(`Name: ${input.distributorName}`);
    partyInfo.push(`Address: ${input.distributorAddress}`);
    partyInfo.push(`Business Registration: ${input.distributorBusinessRegistration}`);
    partyInfo.push(`Email: ${input.distributorEmail}`);
    
    if (input.distributorPhone) {
      partyInfo.push(`Phone: ${input.distributorPhone}`);
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedDistributionAgreementContent): DocumentSection[] {
    const input = userInput as DistributionAgreementUserInput;
    
    return [
      {
        title: 'PARTIES AND DEFINITIONS',
        content: generatedContent.partiesAndDefinitions || this.generatePartiesAndDefinitions(input)
      },
      {
        title: 'GRANT OF DISTRIBUTION RIGHTS',
        content: generatedContent.grantOfDistributionRights || this.generateDistributionRights(input)
      },
      {
        title: 'TERRITORY AND EXCLUSIVITY',
        content: generatedContent.territoryAndExclusivity || this.generateTerritoryAndExclusivity(input)
      },
      {
        title: 'DISTRIBUTOR OBLIGATIONS',
        content: generatedContent.distributorObligations || this.generateDistributorObligations(input)
      },
      {
        title: 'PRINCIPAL OBLIGATIONS',
        content: generatedContent.principalObligations || this.generatePrincipalObligations(input)
      },
      {
        title: 'SALES TARGETS AND PERFORMANCE',
        content: generatedContent.salesTargetsAndPerformance || this.generateSalesTargets(input)
      },
      {
        title: 'PRICING AND PAYMENT',
        content: generatedContent.pricingAndPayment || this.generatePricingAndPayment(input)
      },
      {
        title: 'MARKETING AND PROMOTION',
        content: generatedContent.marketingAndPromotion || this.generateMarketingAndPromotion(input)
      },
      {
        title: 'INTELLECTUAL PROPERTY RIGHTS',
        content: generatedContent.intellectualPropertyRights || this.generateIPRights(input)
      },
      {
        title: 'TERMINATION PROVISIONS',
        content: generatedContent.terminationProvisions || this.generateTerminationProvisions(input)
      },
      {
        title: 'POST-TERMINATION OBLIGATIONS',
        content: generatedContent.postTerminationObligations || this.generatePostTerminationObligations(input)
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

  private generatePartiesAndDefinitions(input: DistributionAgreementUserInput): string {
    return `This Distribution Agreement is entered into between ${input.principalName} (the "Principal"), a company registered under ${input.principalBusinessRegistration}, and ${input.distributorName} (the "Distributor"), a company registered under ${input.distributorBusinessRegistration}. "Products" means ${input.productSpecifications}.`;
  }

  private generateDistributionRights(input: DistributionAgreementUserInput): string {
    const exclusivityText = input.exclusivityType === 'exclusive' ? 'exclusive' : 
                           input.exclusivityType === 'sole' ? 'sole' : 'non-exclusive';
    return `The Principal hereby grants to the Distributor the ${exclusivityText} right to distribute, market, and sell the Products within the Territory as defined herein. This grant includes the right to use the Principal's trademarks and trade names solely in connection with the distribution of the Products.`;
  }

  private generateTerritoryAndExclusivity(input: DistributionAgreementUserInput): string {
    return `Territory: ${input.territoryDefinition}. The distribution rights granted hereunder are ${input.exclusivityType}. ${input.exclusivityType === 'exclusive' ? 'The Principal shall not appoint any other distributors within the Territory during the term of this Agreement.' : ''}`;
  }

  private generateDistributorObligations(input: DistributionAgreementUserInput): string {
    return `Distributor obligations: ${input.distributorObligations}. The Distributor shall maintain adequate inventory levels, provide customer support, and comply with all applicable laws and regulations in the Territory. Marketing obligations: ${input.marketingObligations}.`;
  }

  private generatePrincipalObligations(input: DistributionAgreementUserInput): string {
    return `Principal obligations: ${input.principalObligations}. The Principal shall provide product training, marketing support, and technical assistance as reasonably required. The Principal warrants that the Products comply with all applicable laws and regulations.`;
  }

  private generateSalesTargets(input: DistributionAgreementUserInput): string {
    return `Minimum sales targets: ${input.minimumSalesTargets}. The Distributor agrees to use its best efforts to achieve these targets. Failure to meet minimum sales targets may result in modification or termination of this Agreement as provided herein.`;
  }

  private generatePricingAndPayment(input: DistributionAgreementUserInput): string {
    return `Commission structure: ${input.commissionStructure}. Margin structure: ${input.marginStructure}. Payment terms: ${input.paymentTerms}. All payments shall be made in Kenya Shillings unless otherwise agreed.`;
  }

  private generateMarketingAndPromotion(input: DistributionAgreementUserInput): string {
    return `Marketing and promotion obligations: ${input.marketingObligations}. The Distributor shall promote the Products in accordance with the Principal's marketing guidelines and brand standards. All marketing materials must be approved by the Principal in writing.`;
  }

  private generateIPRights(input: DistributionAgreementUserInput): string {
    const trademarkUsage = input.trademarkUsage || 'The Distributor may use the Principal\'s trademarks solely for the purpose of distributing the Products.';
    const ipRights = input.intellectualPropertyRights || 'All intellectual property rights remain the exclusive property of the Principal.';
    return `Trademark usage: ${trademarkUsage} Intellectual property rights: ${ipRights}`;
  }

  private generateTerminationProvisions(input: DistributionAgreementUserInput): string {
    return `Term: ${input.agreementTerm}. Termination conditions: ${input.terminationConditions}. Either party may terminate this Agreement upon material breach by the other party, subject to a cure period of thirty (30) days written notice.`;
  }

  private generatePostTerminationObligations(input: DistributionAgreementUserInput): string {
    return `Upon termination, the Distributor shall: (a) cease all distribution activities; (b) return all marketing materials and confidential information; (c) dispose of remaining inventory as directed by the Principal; and (d) cease use of all trademarks and trade names.`;
  }

  private generateGeneralProvisions(input: DistributionAgreementUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    return `This Agreement shall be governed by the laws of ${governingState}. Any disputes shall be resolved through arbitration in Nairobi, Kenya. This Agreement may require approval by the Competition Authority of Kenya if applicable. ${additionalTerms}`;
  }

  private generateSignatures(input: DistributionAgreementUserInput): string {
    return `PRINCIPAL:\n\n_______________________\n${input.principalName}\nBy: ___________________\nTitle: ________________\nDate: _______________\n\nDISTRIBUTOR:\n\n_______________________\n${input.distributorName}\nBy: ___________________\nTitle: ________________\nDate: _______________`;
  }
}