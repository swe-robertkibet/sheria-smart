import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { TrademarkLicenseUserInput, GeneratedTrademarkLicenseContent } from '../../types/documents/intellectual-property/trademark-license';

export class TrademarkLicenseGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'TRADEMARK LICENSE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as TrademarkLicenseUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const licensorName = (input.licensorName || (input as any).party1Name || 'Licensor').replace(/[^a-zA-Z0-9]/g, '_');
    const licenseeName = (input.licenseeName || (input as any).party2Name || 'Licensee').replace(/[^a-zA-Z0-9]/g, '_');
    return `Trademark_License_Agreement_${licensorName}_${licenseeName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as TrademarkLicenseUserInput;
    const partyInfo: string[] = [];

    // Handle both specific field names and generic field names for backward compatibility
    const licensorName = input.licensorName || (input as any).party1Name || 'Licensor';
    const licensorAddress = input.licensorAddress || (input as any).party1Address || 'Address not provided';
    const licenseeName = input.licenseeName || (input as any).party2Name || 'Licensee';
    const licenseeAddress = input.licenseeAddress || (input as any).party2Address || 'Address not provided';

    // Licensor Information
    partyInfo.push('Licensor Information:');
    partyInfo.push(`Name: ${licensorName}`);
    partyInfo.push(`Address: ${licensorAddress}`);
    if (input.licensorEmail) {
      partyInfo.push(`Email: ${input.licensorEmail}`);
    }
    if (input.licensorPhone) {
      partyInfo.push(`Phone: ${input.licensorPhone}`);
    }
    if (input.licensorBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.licensorBusinessRegistration}`);
    }
    partyInfo.push('');

    // Licensee Information
    partyInfo.push('Licensee Information:');
    partyInfo.push(`Name: ${licenseeName}`);
    partyInfo.push(`Address: ${licenseeAddress}`);
    if (input.licenseeEmail) {
      partyInfo.push(`Email: ${input.licenseeEmail}`);
    }
    if (input.licenseePhone) {
      partyInfo.push(`Phone: ${input.licenseePhone}`);
    }
    if (input.licenseeBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.licenseeBusinessRegistration}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedTrademarkLicenseContent): DocumentSection[] {
    const input = userInput as unknown as TrademarkLicenseUserInput;
    
    return [
      {
        title: 'GRANT OF LICENSE',
        content: generatedContent.grantOfLicense || this.generateGrantOfLicense(input)
      },
      {
        title: 'TRADEMARK RIGHTS',
        content: generatedContent.trademarkRights || this.generateTrademarkRights(input)
      },
      {
        title: 'LICENSED PRODUCTS AND SERVICES',
        content: generatedContent.licensedProductsServices || this.generateLicensedProductsServices(input)
      },
      {
        title: 'TERRITORY AND EXCLUSIVITY',
        content: generatedContent.territoryAndExclusivity || this.generateTerritoryAndExclusivity(input)
      },
      {
        title: 'QUALITY CONTROL',
        content: generatedContent.qualityControl || this.generateQualityControl(input)
      },
      {
        title: 'ROYALTIES AND PAYMENTS',
        content: generatedContent.royaltiesAndPayments || this.generateRoyaltiesAndPayments(input)
      },
      {
        title: 'MARKETING REQUIREMENTS',
        content: generatedContent.marketingRequirements || this.generateMarketingRequirements(input)
      },
      {
        title: 'INFRINGEMENT PROCEDURES',
        content: generatedContent.infringementProcedures || this.generateInfringementProcedures(input)
      },
      {
        title: 'TERMINATION',
        content: generatedContent.termination || this.generateTermination(input)
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

  private generateGrantOfLicense(input: TrademarkLicenseUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const licensorName = input.licensorName || (input as any).party1Name || 'Licensor';
    const licenseeName = input.licenseeName || (input as any).party2Name || 'Licensee';
    const exclusivityType = input.exclusivity === 'exclusive' ? 'exclusive' : 'non-exclusive';
    
    return `This Trademark License Agreement ("Agreement") is entered into between ${licensorName}, the owner of the trademark(s) described herein ("Licensor"), and ${licenseeName} ("Licensee").

Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a ${exclusivityType} license to use the Trademark(s) in connection with the Licensed Products and Services within the Licensed Territory for the duration specified herein.

This license is effective as of ${input.effectiveDate} and is subject to all terms, conditions, and restrictions set forth in this Agreement.

The license granted herein is personal to Licensee and may not be assigned or transferred without the prior written consent of Licensor, except as expressly permitted in this Agreement.`;
  }

  private generateTrademarkRights(input: TrademarkLicenseUserInput): string {
    const registrationInfo = input.trademarkRegistrationNumber ? 
      `\n\nTrademark Registration Number: ${input.trademarkRegistrationNumber}` : '';
    const classesInfo = input.trademarkClasses ? 
      `\nTrademark Classes: ${input.trademarkClasses}` : '';
    const jurisdictionInfo = input.registrationJurisdiction ? 
      `\nRegistration Jurisdiction: ${input.registrationJurisdiction}` : '';
    const registrationDateInfo = input.registrationDate ? 
      `\nRegistration Date: ${input.registrationDate}` : '';

    return `Trademark Description: ${input.trademarkDescription}${registrationInfo}${classesInfo}${jurisdictionInfo}${registrationDateInfo}

The Trademark includes all associated logos, designs, slogans, and other distinctive elements that are part of the registered trademark or that have acquired secondary meaning in connection with the trademark.

Licensor represents and warrants that it is the sole and exclusive owner of all rights, title, and interest in and to the Trademark, and that the Trademark is validly registered and in full force and effect under the Industrial Property Act of Kenya and with the Kenya Industrial Property Institute (KIPI).

Licensee acknowledges that Licensor is the sole owner of the Trademark and that Licensee's use of the Trademark shall not create any ownership rights in favor of Licensee.`;
  }

  private generateLicensedProductsServices(input: TrademarkLicenseUserInput): string {
    const servicesText = input.licensedServices ? 
      `\n\nLicensed Services: ${input.licensedServices}` : '';

    return `Licensed Products: ${input.licensedProducts}${servicesText}

The license granted hereunder applies solely to the specific products and services described above. Any use of the Trademark in connection with other products or services requires the prior written consent of Licensor.

Licensee shall not use the Trademark in connection with any products or services that:
• Are illegal, harmful, or offensive
• Compete directly with Licensor's core business
• Could damage the reputation or goodwill associated with the Trademark
• Do not meet the quality standards specified in this Agreement

All Licensed Products and Services must comply with applicable laws and regulations in the Licensed Territory, including product safety, labeling, and consumer protection requirements.`;
  }

  private generateTerritoryAndExclusivity(input: TrademarkLicenseUserInput): string {
    const exclusivityDescription = input.exclusivity === 'exclusive' ? 
      'This license is granted on an exclusive basis within the Licensed Territory. Licensor agrees not to grant any other party the right to use the Trademark for the Licensed Products and Services within the Licensed Territory during the term of this Agreement.' :
      'This license is granted on a non-exclusive basis. Licensor retains the right to grant similar licenses to other parties and to use the Trademark itself within the Licensed Territory.';

    return `Licensed Territory: ${input.territory}

Duration: ${input.licenseDuration}

${exclusivityDescription}

The Licensed Territory is limited to the geographic area specified above. Licensee may not use the Trademark outside the Licensed Territory without the prior written consent of Licensor.

Any expansion of the Licensed Territory or extension of the license duration requires mutual written agreement between the parties and may be subject to additional terms and conditions.

Licensee acknowledges that Licensor may have granted or may grant rights to use the Trademark in territories outside the Licensed Territory, and Licensee shall not interfere with such rights.`;
  }

  private generateQualityControl(input: TrademarkLicenseUserInput): string {
    const approvalText = input.approvalRequirements ? 
      `\n\nApproval Requirements: ${input.approvalRequirements}` : '';
    const inspectionText = input.inspectionRights ? 
      `\n\nInspection Rights: ${input.inspectionRights}` : '';

    return `Quality Control Standards: ${input.qualityControlStandards}${approvalText}${inspectionText}

Licensee agrees to maintain the quality, character, and reputation of the Licensed Products and Services at a level consistent with the standards previously maintained by Licensor and as may be specified by Licensor from time to time.

Licensor shall have the right to inspect Licensee's facilities, products, services, and business practices related to the use of the Trademark at reasonable times and upon reasonable notice.

All Licensed Products and promotional materials bearing the Trademark must be approved by Licensor in writing before use or distribution. Licensor agrees to respond to approval requests within thirty (30) days of receipt.

Licensee shall implement and maintain quality assurance procedures to ensure consistent compliance with the quality standards specified herein.

Failure to maintain the required quality standards shall constitute a material breach of this Agreement and may result in termination.`;
  }

  private generateRoyaltiesAndPayments(input: TrademarkLicenseUserInput): string {
    const minimumRoyaltiesText = input.minimumRoyalties ? 
      `\n\nMinimum Royalties: ${input.minimumRoyalties}` : '';
    const reportingText = input.reportingRequirements ? 
      `\n\nReporting Requirements: ${input.reportingRequirements}` : '';

    return `Royalty Structure: ${input.royaltyStructure}

Payment Terms: ${input.paymentTerms}${minimumRoyaltiesText}${reportingText}

All royalty payments shall be made in Kenya Shillings unless otherwise specified. Payments are due within thirty (30) days of the end of each reporting period.

Licensee shall maintain complete and accurate records of all sales and use of the Licensed Products and Services bearing the Trademark. Such records shall be available for inspection by Licensor or its authorized representatives upon reasonable notice.

Late payments shall accrue interest at the rate of 2% per month or the maximum rate permitted by law, whichever is lower.

All taxes arising from royalty payments shall be the responsibility of the respective parties in accordance with Kenyan tax laws and any applicable double taxation agreements.`;
  }

  private generateMarketingRequirements(input: TrademarkLicenseUserInput): string {
    const advertisingText = input.advertisingRequirements ? 
      `\n\nAdvertising Requirements: ${input.advertisingRequirements}` : '';
    const promotionalText = input.promotionalMaterials ? 
      `\n\nPromotional Materials: ${input.promotionalMaterials}` : '';

    return `Marketing Obligations: ${input.marketingObligations}${advertisingText}${promotionalText}

Licensee agrees to actively promote and market the Licensed Products and Services bearing the Trademark in accordance with marketing standards and guidelines provided by Licensor.

All marketing and advertising materials using the Trademark must comply with Licensor's brand guidelines and must be approved by Licensor in writing before use.

Licensee shall use the Trademark exactly as specified by Licensor, without alteration, and in accordance with trademark usage guidelines provided by Licensor.

Licensee agrees to include appropriate trademark notices (® or ™) with all uses of the Trademark and to include an attribution statement identifying Licensor as the owner of the Trademark when required.

Licensee shall not engage in any marketing or advertising practices that could damage the reputation or goodwill associated with the Trademark.`;
  }

  private generateInfringementProcedures(input: TrademarkLicenseUserInput): string {
    const customProcedures = input.infringementProcedures || 
      'Each party shall promptly notify the other of any suspected trademark infringement or unauthorized use of the Trademark. Licensor shall have the primary responsibility for enforcement actions, but may, in its discretion, allow or require Licensee to participate in such actions.';

    return `${customProcedures}

Licensee agrees to cooperate with Licensor in any enforcement actions related to the Trademark, including providing information, documentation, and testimony as reasonably requested.

Any damages or monetary awards recovered in infringement actions shall belong to Licensor, except that Licensee may be entitled to recover its direct losses if it participates in the enforcement action at Licensor's request.

Licensee shall not institute any legal proceedings related to the Trademark without the prior written consent of Licensor.

Both parties acknowledge the importance of protecting the Trademark and agree to take reasonable steps to prevent unauthorized use by third parties within their respective spheres of influence.

Costs of enforcement actions shall be borne by Licensor unless otherwise agreed in writing.`;
  }

  private generateTermination(input: TrademarkLicenseUserInput): string {
    const customTermination = input.terminationConditions || 
      'This Agreement may be terminated by either party upon thirty (30) days written notice. This Agreement may be terminated immediately by Licensor in the event of material breach by Licensee, including failure to maintain quality standards or unauthorized use of the Trademark.';

    return `${customTermination}

Automatic termination shall occur upon:
• Expiration of the license duration specified herein
• Bankruptcy or insolvency of either party
• Assignment or transfer of the license without prior written consent
• Material breach that is not cured within the specified cure period

Upon termination, all rights granted to Licensee hereunder shall immediately cease, and Licensee shall discontinue all use of the Trademark.

Termination shall not affect any obligations that have accrued prior to the effective date of termination, including payment of royalties and damages for breach.

The provisions relating to quality control, confidentiality, indemnification, and dispute resolution shall survive termination of this Agreement.`;
  }

  private generatePostTerminationObligations(input: TrademarkLicenseUserInput): string {
    return `Upon termination or expiration of this Agreement, Licensee shall:

• Immediately cease all use of the Trademark in any form
• Remove the Trademark from all products, packaging, marketing materials, and business premises
• Destroy or return to Licensor all materials bearing the Trademark
• Provide Licensor with a written certification of compliance with these obligations
• Cease representing itself as having any relationship with Licensor or the Trademark

Sell-off Period: Licensee may continue to sell existing inventory bearing the Trademark for a period of ninety (90) days following termination, provided that such products meet all quality standards and Licensee continues to pay applicable royalties.

Non-Competition: For a period of one (1) year following termination, Licensee agrees not to use any trademark, trade name, or business identifier that is confusingly similar to the Trademark.

Confidentiality obligations shall continue indefinitely following termination.

These post-termination obligations are in addition to any other remedies available to Licensor at law or in equity.`;
  }

  private generateGeneralProvisions(input: TrademarkLicenseUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const disputeText = input.disputeResolution || 
      'Any disputes arising under this Agreement shall be resolved through good faith negotiation, and if necessary, through binding arbitration in accordance with the Arbitration Act of Kenya.';
    const additionalTerms = input.additionalTerms || '';

    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}, including the Industrial Property Act.

${disputeText}

Registration: This Agreement may be registered with the Kenya Industrial Property Institute (KIPI) or other relevant authorities as required or permitted by law.

Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements relating to the subject matter hereof.

Amendment: This Agreement may only be modified by a written instrument signed by both parties.

Assignment: This Agreement may not be assigned by Licensee without the prior written consent of Licensor. Licensor may assign this Agreement upon notice to Licensee.

Severability: If any provision of this Agreement is held invalid or unenforceable, the remainder of the Agreement shall continue in full force and effect.

Force Majeure: Neither party shall be liable for any failure to perform due to causes beyond its reasonable control, including acts of God, war, terrorism, or government action.

Relationship of Parties: The parties are independent contractors. This Agreement does not create a partnership, joint venture, or agency relationship.

${additionalTerms}`;
  }

  private generateSignatures(input: TrademarkLicenseUserInput): string {
    return `LICENSOR:

_______________________
${input.licensorName}
Address: ${input.licensorAddress}
Date: _______________


LICENSEE:

_______________________
${input.licenseeName}
Address: ${input.licenseeAddress}
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