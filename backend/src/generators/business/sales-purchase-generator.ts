import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { SalesPurchaseUserInput, GeneratedSalesPurchaseContent } from '../../types/documents/business/sales-purchase';

export class SalesPurchaseGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'SALES AND PURCHASE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as SalesPurchaseUserInput;
    const sellerName = input.sellerName.replace(/[^a-zA-Z0-9]/g, '_');
    const buyerName = input.buyerName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Sales_Purchase_Agreement_${sellerName}_${buyerName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as SalesPurchaseUserInput;
    const partyInfo: string[] = [];

    // Seller Information
    partyInfo.push('Seller Information:');
    partyInfo.push(`Name: ${input.sellerName}`);
    partyInfo.push(`Address: ${input.sellerAddress}`);
    partyInfo.push(`Email: ${input.sellerEmail}`);
    
    if (input.sellerPhone) {
      partyInfo.push(`Phone: ${input.sellerPhone}`);
    }
    
    if (input.sellerBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.sellerBusinessRegistration}`);
    }

    partyInfo.push(''); // Empty line

    // Buyer Information
    partyInfo.push('Buyer Information:');
    partyInfo.push(`Name: ${input.buyerName}`);
    partyInfo.push(`Address: ${input.buyerAddress}`);
    partyInfo.push(`Email: ${input.buyerEmail}`);
    
    if (input.buyerPhone) {
      partyInfo.push(`Phone: ${input.buyerPhone}`);
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedSalesPurchaseContent): DocumentSection[] {
    const input = userInput as SalesPurchaseUserInput;
    
    return [
      {
        title: 'PARTIES IDENTIFICATION',
        content: generatedContent.partiesIdentification || this.generatePartiesIdentification(input)
      },
      {
        title: 'RECITALS AND BACKGROUND',
        content: generatedContent.recitalsAndBackground || this.generateRecitals(input)
      },
      {
        title: 'SALE TERMS AND CONDITIONS',
        content: generatedContent.saleTermsAndConditions || this.generateSaleTerms(input)
      },
      {
        title: 'PRICE AND PAYMENT PROVISIONS',
        content: generatedContent.priceAndPaymentProvisions || this.generatePaymentTerms(input)
      },
      {
        title: 'DELIVERY AND ACCEPTANCE',
        content: generatedContent.deliveryAndAcceptance || this.generateDeliveryTerms(input)
      },
      {
        title: 'WARRANTIES AND REPRESENTATIONS',
        content: generatedContent.warrantiesAndRepresentations || this.generateWarranties(input)
      },
      {
        title: 'RISK ALLOCATION AND INSURANCE',
        content: generatedContent.riskAllocationAndInsurance || this.generateRiskAllocation(input)
      },
      {
        title: 'DISPUTE RESOLUTION',
        content: generatedContent.disputeResolution || this.generateDisputeResolution(input)
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

  private generatePartiesIdentification(input: SalesPurchaseUserInput): string {
    return `This Sales and Purchase Agreement is entered into between ${input.sellerName} (the "Seller"), a party with address at ${input.sellerAddress}, and ${input.buyerName} (the "Buyer"), a party with address at ${input.buyerAddress}, for the sale and purchase of goods/services as described herein.`;
  }

  private generateRecitals(input: SalesPurchaseUserInput): string {
    return `WHEREAS, the Seller desires to sell and the Buyer desires to purchase the goods/services described as: ${input.goodsServicesDescription}; and WHEREAS, the parties wish to set forth the terms and conditions of such sale and purchase; NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:`;
  }

  private generateSaleTerms(input: SalesPurchaseUserInput): string {
    return `The Seller agrees to sell and the Buyer agrees to purchase the following: ${input.goodsServicesDescription}. The sale shall be subject to the terms and conditions set forth in this Agreement and in accordance with the laws of the Republic of Kenya, specifically the Sale of Goods Act (Cap 31).`;
  }

  private generatePaymentTerms(input: SalesPurchaseUserInput): string {
    return `The total purchase price for the goods/services shall be ${input.purchasePrice}. Payment terms: ${input.paymentTerms}. All payments shall be made in Kenya Shillings unless otherwise specified. Time shall be of the essence with respect to all payment obligations.`;
  }

  private generateDeliveryTerms(input: SalesPurchaseUserInput): string {
    return `Delivery terms: ${input.deliveryTerms}. Delivery timeline: ${input.deliveryTimeline}. Risk of loss shall pass to the Buyer upon delivery and acceptance of the goods/services. The Buyer shall have a reasonable opportunity to inspect the goods/services upon delivery.`;
  }

  private generateWarranties(input: SalesPurchaseUserInput): string {
    return `Warranty provisions: ${input.warrantyProvisions}. The Seller warrants that the goods/services conform to the description provided and are free from defects. ${input.inspectionPeriod ? `The Buyer shall have ${input.inspectionPeriod} to inspect and report any defects.` : ''} ${input.returnPolicy ? `Return policy: ${input.returnPolicy}` : ''}`;
  }

  private generateRiskAllocation(input: SalesPurchaseUserInput): string {
    const insurance = input.insuranceRequirements || 'Each party shall maintain appropriate insurance coverage for their respective obligations under this Agreement.';
    const riskAllocation = input.riskAllocation || 'Risk of loss shall pass to the Buyer upon delivery and acceptance of the goods/services.';
    return `Risk allocation: ${riskAllocation} Insurance requirements: ${insurance}`;
  }

  private generateDisputeResolution(input: SalesPurchaseUserInput): string {
    const disputeResolution = input.disputeResolution || 'Any disputes arising under this Agreement shall be resolved through mediation, and if necessary, arbitration in accordance with the laws of Kenya.';
    return `Dispute resolution: ${disputeResolution} This Agreement shall be governed by and construed in accordance with the laws of the Republic of Kenya.`;
  }

  private generateGeneralProvisions(input: SalesPurchaseUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    return `This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements. This Agreement shall be governed by the laws of ${governingState}. ${additionalTerms}`;
  }

  private generateSignatures(input: SalesPurchaseUserInput): string {
    return `SELLER:\n\n_______________________\n${input.sellerName}\nDate: _______________\n\nBUYER:\n\n_______________________\n${input.buyerName}\nDate: _______________`;
  }
}