import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { SaleOfLandUserInput, GeneratedSaleOfLandContent } from '../../types/documents/property/sale-of-land';

export class SaleOfLandGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'SALE OF LAND AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as SaleOfLandUserInput;
    const vendorName = input.vendorName.replace(/[^a-zA-Z0-9]/g, '_');
    const purchaserName = input.purchaserName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Sale_of_Land_Agreement_${vendorName}_${purchaserName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as SaleOfLandUserInput;
    const partyInfo: string[] = [];

    partyInfo.push('Vendor Information:');
    partyInfo.push(`Name: ${input.vendorName}`);
    partyInfo.push(`Address: ${input.vendorAddress}`);
    partyInfo.push(`Email: ${input.vendorEmail}`);
    if (input.vendorPhone) partyInfo.push(`Phone: ${input.vendorPhone}`);
    partyInfo.push(`ID Number: ${input.vendorIdNumber}`);
    if (input.vendorMaritalStatus) partyInfo.push(`Marital Status: ${input.vendorMaritalStatus}`);
    
    partyInfo.push('');
    
    partyInfo.push('Purchaser Information:');
    partyInfo.push(`Name: ${input.purchaserName}`);
    partyInfo.push(`Address: ${input.purchaserAddress}`);
    partyInfo.push(`Email: ${input.purchaserEmail}`);
    if (input.purchaserPhone) partyInfo.push(`Phone: ${input.purchaserPhone}`);
    partyInfo.push(`ID Number: ${input.purchaserIdNumber}`);
    if (input.purchaserMaritalStatus) partyInfo.push(`Marital Status: ${input.purchaserMaritalStatus}`);

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedSaleOfLandContent): DocumentSection[] {
    const input = userInput as SaleOfLandUserInput;
    
    return [
      { title: 'PARTIES AND PROPERTY DESCRIPTION', content: generatedContent.partiesAndProperty || this.generatePartiesAndProperty(input) },
      { title: 'PURCHASE PRICE AND PAYMENT TERMS', content: generatedContent.purchasePriceAndPayment || this.generatePurchasePriceAndPayment(input) },
      { title: 'TITLE AND ENCUMBRANCES', content: generatedContent.titleAndEncumbrances || this.generateTitleAndEncumbrances(input) },
      { title: 'CONDITIONS OF SALE', content: generatedContent.conditionsOfSale || this.generateConditionsOfSale(input) },
      { title: 'COMPLETION ARRANGEMENTS', content: generatedContent.completionArrangements || this.generateCompletionArrangements(input) },
      { title: 'RISK AND INSURANCE', content: generatedContent.riskAndInsurance || this.generateRiskAndInsurance(input) },
      { title: 'WARRANTIES AND REPRESENTATIONS', content: generatedContent.warrantiesAndRepresentations || this.generateWarrantiesAndRepresentations(input) },
      { title: 'DEFAULT PROVISIONS', content: generatedContent.defaultProvisions || this.generateDefaultProvisions(input) },
      { title: 'LEGAL AND PROFESSIONAL COSTS', content: generatedContent.costsAndExpenses || this.generateCostsAndExpenses(input) },
      { title: 'CONSENT REQUIREMENTS', content: generatedContent.consentRequirements || this.generateConsentRequirements(input) },
      { title: 'GENERAL CONDITIONS', content: generatedContent.generalConditions || this.generateGeneralConditions(input) },
      { title: 'SIGNATURES', content: generatedContent.signatures || this.generateSignatures(input) }
    ];
  }

  private generatePartiesAndProperty(input: SaleOfLandUserInput): string {
    let propertyText = `This Sale of Land Agreement is entered into between ${input.vendorName} (the "Vendor") and ${input.purchaserName} (the "Purchaser").\n\n`;
    
    propertyText += `PROPERTY DETAILS:\n`;
    propertyText += `Description: ${input.propertyDescription}\n`;
    propertyText += `Address: ${input.propertyAddress}\n`;
    propertyText += `Title Number: ${input.titleNumber}\n`;
    propertyText += `Land Registry Office: ${input.landRegistryOffice}\n`;
    propertyText += `Property Size: ${input.propertySize}\n`;
    propertyText += `Property Type: ${input.propertyType.replace('_', ' ').toUpperCase()}\n`;
    propertyText += `Boundaries: ${input.propertyBoundaries}\n`;
    
    propertyText += `\nThe Vendor hereby agrees to sell and the Purchaser agrees to purchase the above-described property subject to the terms and conditions set forth in this Agreement.`;

    return propertyText;
  }

  private generatePurchasePriceAndPayment(input: SaleOfLandUserInput): string {
    let paymentText = `PURCHASE PRICE: ${input.purchasePrice}\n\n`;
    paymentText += `PAYMENT TERMS:\n${input.paymentTerms}\n\n`;
    paymentText += `DEPOSIT AMOUNT: ${input.depositAmount}\n\n`;
    paymentText += `BALANCE PAYMENT SCHEDULE:\n${input.balancePaymentSchedule}\n\n`;
    paymentText += `COMPLETION DATE: ${input.completionDate}\n\n`;
    
    paymentText += `The deposit shall be paid upon signing of this agreement and shall form part of the purchase price. The balance shall be paid according to the schedule specified above. Time is of the essence regarding all payment obligations.`;

    return paymentText;
  }

  private generateTitleAndEncumbrances(input: SaleOfLandUserInput): string {
    let titleText = `TITLE WARRANTIES:\n${input.titleWarranties}\n\n`;
    
    if (input.existingEncumbrances) {
      titleText += `EXISTING ENCUMBRANCES:\n${input.existingEncumbrances}\n\n`;
    }
    
    if (input.outstandingCharges) {
      titleText += `OUTSTANDING CHARGES:\n${input.outstandingCharges}\n\n`;
    }
    
    if (input.caveatOrRestrictions) {
      titleText += `CAVEATS OR RESTRICTIONS:\n${input.caveatOrRestrictions}\n\n`;
    }
    
    titleText += `The Vendor warrants that they have good and marketable title to the property and the right to sell the same. The Vendor shall deliver clear title to the Purchaser at completion, free from encumbrances except as disclosed herein.`;

    return titleText;
  }

  private generateConditionsOfSale(input: SaleOfLandUserInput): string {
    let conditionsText = `CONDITIONS TO COMPLETION:\n${input.conditionsToCompletion}\n\n`;
    
    if (input.surveyRequirements) {
      conditionsText += `SURVEY REQUIREMENTS:\n${input.surveyRequirements}\n\n`;
    }
    
    if (input.soilTestRequirements) {
      conditionsText += `SOIL TEST REQUIREMENTS:\n${input.soilTestRequirements}\n\n`;
    }
    
    if (input.planningPermissionStatus) {
      conditionsText += `PLANNING PERMISSION STATUS:\n${input.planningPermissionStatus}\n\n`;
    }
    
    conditionsText += `All conditions precedent must be satisfied or waived in writing by the benefiting party before completion. If any condition is not satisfied by the specified date, either party may terminate this agreement with notice.`;

    return conditionsText;
  }

  private generateCompletionArrangements(input: SaleOfLandUserInput): string {
    let completionText = `COMPLETION VENUE: ${input.completionVenue}\n\n`;
    completionText += `POSSESSION DATE: ${input.possessionDate}\n\n`;
    completionText += `DOCUMENTS FOR COMPLETION:\n${input.documentsForCompletion}\n\n`;
    
    if (input.keyHandoverArrangements) {
      completionText += `KEY HANDOVER ARRANGEMENTS:\n${input.keyHandoverArrangements}\n\n`;
    }
    
    completionText += `Completion shall take place at the specified venue on the completion date. The Vendor shall deliver vacant possession and all required documents. Transfer of ownership shall be registered immediately after completion.`;

    return completionText;
  }

  private generateRiskAndInsurance(input: SaleOfLandUserInput): string {
    let riskText = `RISK PASSAGE DATE: ${input.riskPassageDate}\n\n`;
    riskText += `INSURANCE REQUIREMENTS:\n${input.insuranceRequirements}\n\n`;
    riskText += `PROPERTY INSURANCE TRANSFER:\n${input.propertyInsuranceTransfer}\n\n`;
    
    riskText += `Risk in the property shall pass to the Purchaser on the specified date. The Purchaser shall maintain adequate insurance coverage from the risk passage date. Any damage occurring before risk passage shall be the Vendor's responsibility.`;

    return riskText;
  }

  private generateWarrantiesAndRepresentations(input: SaleOfLandUserInput): string {
    let warrantiesText = `The Vendor warrants and represents that:\n\n`;
    warrantiesText += `1. They have the full right, power, and authority to enter into this agreement and sell the property.\n`;
    warrantiesText += `2. The property is free from defects in title except as disclosed.\n`;
    warrantiesText += `3. All information provided about the property is true and accurate.\n`;
    warrantiesText += `4. There are no pending legal proceedings affecting the property.\n`;
    warrantiesText += `5. All necessary consents and approvals have been obtained or will be obtained before completion.\n\n`;
    
    if (input.environmentalCompliance) {
      warrantiesText += `ENVIRONMENTAL COMPLIANCE:\n${input.environmentalCompliance}\n\n`;
    }
    
    warrantiesText += `These warranties shall survive completion and shall be enforceable by the Purchaser for a period of five (5) years from the completion date.`;

    return warrantiesText;
  }

  private generateDefaultProvisions(input: SaleOfLandUserInput): string {
    let defaultText = `DEFAULT PROVISIONS:\n${input.defaultProvisions}\n\n`;
    defaultText += `REMEDIES FOR BREACH:\n${input.remediesForBreach}\n\n`;
    const isTimeOfEssence = input.timeIsOfEssenceClause === true || input.timeIsOfEssenceClause === 'true';
    defaultText += `TIME IS OF THE ESSENCE: ${isTimeOfEssence ? 'YES' : 'NO'}\n\n`;
    
    if (input.forfeituteClause) {
      defaultText += `FORFEITURE CLAUSE:\n${input.forfeituteClause}\n\n`;
    }
    
    defaultText += `In the event of default by either party, the non-defaulting party may pursue all remedies available at law or equity. All remedies are cumulative and not exclusive.`;

    return defaultText;
  }

  private generateCostsAndExpenses(input: SaleOfLandUserInput): string {
    let costsText = `LEGAL COSTS:\n${input.legalCosts}\n\n`;
    costsText += `STAMP DUTY RESPONSIBILITY:\n${input.stampDutyResponsibility}\n\n`;
    costsText += `REGISTRATION FEES:\n${input.registrationFees}\n\n`;
    
    if (input.surveyorFees) {
      costsText += `SURVEYOR FEES:\n${input.surveyorFees}\n\n`;
    }
    
    costsText += `Each party shall be responsible for their own legal costs unless otherwise specified. All statutory fees, taxes, and charges shall be apportioned as set out above.`;

    return costsText;
  }

  private generateConsentRequirements(input: SaleOfLandUserInput): string {
    let consentText = '';
    
    if (input.landControlBoardConsent) {
      consentText += `LAND CONTROL BOARD CONSENT:\n${input.landControlBoardConsent}\n\n`;
    }
    
    if (input.spouseConsent) {
      consentText += `SPOUSE CONSENT:\n${input.spouseConsent}\n\n`;
    }
    
    if (input.familyConsent) {
      consentText += `FAMILY CONSENT:\n${input.familyConsent}\n\n`;
    }
    
    if (consentText === '') {
      consentText = 'No specific consent requirements have been identified for this transaction.';
    } else {
      consentText += 'All required consents must be obtained before completion. Failure to obtain necessary consents may result in termination of this agreement.';
    }

    return consentText;
  }

  private generateGeneralConditions(input: SaleOfLandUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    
    let generalText = `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.\n\n`;
    generalText += `Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements.\n\n`;
    generalText += `Amendment: This Agreement may only be amended in writing signed by both parties.\n\n`;
    generalText += `Severability: If any provision of this Agreement is found to be unenforceable, the remainder shall remain in full force and effect.\n\n`;
    generalText += `Kenya Legal Compliance: This Agreement complies with the Land Registration Act, Land Control Act, Stamp Duty Act, and other applicable Kenyan laws.\n\n`;
    
    if (input.reservedRights) {
      generalText += `RESERVED RIGHTS:\n${input.reservedRights}\n\n`;
    }
    
    if (input.easementsAndRights) {
      generalText += `EASEMENTS AND RIGHTS:\n${input.easementsAndRights}\n\n`;
    }
    
    generalText += `Notices: All notices under this Agreement shall be in writing and delivered to the addresses specified herein.\n\n`;
    generalText += `${additionalTerms}`;

    return generalText;
  }

  private generateSignatures(input: SaleOfLandUserInput): string {
    return `VENDOR:\n\n_______________________\n${input.vendorName}\nDate: _______________\n\n\nPURCHASER:\n\n_______________________\n${input.purchaserName}\nDate: _______________\n\n\nWITNESS 1:\n\n_______________________\nName: ________________\nDate: _______________\n\n\nWITNESS 2:\n\n_______________________\nName: ________________\nDate: _______________`;
  }
}