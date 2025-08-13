import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { PatentLicensingUserInput, GeneratedPatentLicensingContent } from '../../types/documents/intellectual-property/patent-licensing';

export class PatentLicensingGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'PATENT LICENSING AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as PatentLicensingUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const patentOwnerName = (input.patentOwnerName || (input as any).party1Name || 'PatentOwner').replace(/[^a-zA-Z0-9]/g, '_');
    const licenseeName = (input.licenseeName || (input as any).party2Name || 'Licensee').replace(/[^a-zA-Z0-9]/g, '_');
    return `Patent_Licensing_Agreement_${patentOwnerName}_${licenseeName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as PatentLicensingUserInput;
    const partyInfo: string[] = [];

    // Handle both specific field names and generic field names for backward compatibility
    const patentOwnerName = input.patentOwnerName || (input as any).party1Name || 'Patent Owner';
    const patentOwnerAddress = input.patentOwnerAddress || (input as any).party1Address || 'Address not provided';
    const licenseeName = input.licenseeName || (input as any).party2Name || 'Licensee';
    const licenseeAddress = input.licenseeAddress || (input as any).party2Address || 'Address not provided';

    // Patent Owner Information
    partyInfo.push('Patent Owner Information:');
    partyInfo.push(`Name: ${patentOwnerName}`);
    partyInfo.push(`Address: ${patentOwnerAddress}`);
    if (input.patentOwnerEmail) {
      partyInfo.push(`Email: ${input.patentOwnerEmail}`);
    }
    if (input.patentOwnerPhone) {
      partyInfo.push(`Phone: ${input.patentOwnerPhone}`);
    }
    if (input.patentOwnerBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.patentOwnerBusinessRegistration}`);
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

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedPatentLicensingContent): DocumentSection[] {
    const input = userInput as unknown as PatentLicensingUserInput;
    
    return [
      {
        title: 'PATENT LICENSE GRANT',
        content: generatedContent.patentLicenseGrant || this.generatePatentLicenseGrant(input)
      },
      {
        title: 'LICENSED TECHNOLOGY',
        content: generatedContent.licensedTechnology || this.generateLicensedTechnology(input)
      },
      {
        title: 'SCOPE AND LIMITATIONS',
        content: generatedContent.scopeAndLimitations || this.generateScopeAndLimitations(input)
      },
      {
        title: 'ROYALTY PAYMENTS',
        content: generatedContent.royaltyPayments || this.generateRoyaltyPayments(input)
      },
      {
        title: 'PATENT PROSECUTION',
        content: generatedContent.patentProsecution || this.generatePatentProsecution(input)
      },
      {
        title: 'INFRINGEMENT ENFORCEMENT',
        content: generatedContent.infringementEnforcement || this.generateInfringementEnforcement(input)
      },
      {
        title: 'IMPROVEMENTS',
        content: generatedContent.improvements || this.generateImprovements(input)
      },
      {
        title: 'TERM AND TERMINATION',
        content: generatedContent.termAndTermination || this.generateTermAndTermination(input)
      },
      {
        title: 'POST-TERMINATION PROVISIONS',
        content: generatedContent.postTerminationProvisions || this.generatePostTerminationProvisions(input)
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

  private generatePatentLicenseGrant(input: PatentLicensingUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const patentOwnerName = input.patentOwnerName || (input as any).party1Name || 'Patent Owner';
    const licenseeName = input.licenseeName || (input as any).party2Name || 'Licensee';
    const exclusivityType = input.exclusivity === 'exclusive' ? 'exclusive' : input.exclusivity === 'sole' ? 'sole' : 'non-exclusive';
    
    return `This Patent Licensing Agreement ("Agreement") is entered into between ${patentOwnerName}, the owner of the patent(s) described herein ("Patent Owner"), and ${licenseeName} ("Licensee").

Subject to the terms and conditions of this Agreement, Patent Owner hereby grants to Licensee a ${exclusivityType} license under the Patent(s) to make, have made, use, offer for sale, sell, and import the Licensed Technology within the Licensed Field of Use and Licensed Territory.

This license is effective as of ${input.effectiveDate} and is subject to all terms, conditions, and restrictions set forth in this Agreement.

The license granted herein includes the right to practice the patented invention as described in the patent claims, subject to the scope and limitations specified herein.`;
  }

  private generateLicensedTechnology(input: PatentLicensingUserInput): string {
    const patentInfo = input.patentNumber ? 
      `\n\nPatent Number: ${input.patentNumber}` : '';
    const filingInfo = input.filingDate ? 
      `\nFiling Date: ${input.filingDate}` : '';
    const grantInfo = input.grantDate ? 
      `\nGrant Date: ${input.grantDate}` : '';
    const jurisdictionInfo = input.patentJurisdiction ? 
      `\nJurisdiction: ${input.patentJurisdiction}` : '';
    const claimsInfo = input.patentClaims ? 
      `\n\nPatent Claims: ${input.patentClaims}` : '';

    return `Patent Title: ${input.patentTitle}

Patent Description: ${input.patentDescription}${patentInfo}${filingInfo}${grantInfo}${jurisdictionInfo}${claimsInfo}

Licensed Technology: ${input.licensedTechnology}

The Licensed Technology includes all methods, processes, compositions, devices, and systems covered by the valid claims of the Patent(s), including any divisional, continuation, continuation-in-part, reissue, or extension thereof.

Patent Owner represents and warrants that it is the sole and exclusive owner of all rights, title, and interest in and to the Patent(s), and that the Patent(s) are valid and enforceable under the Industrial Property Act of Kenya and with the Kenya Industrial Property Institute (KIPI).`;
  }

  private generateScopeAndLimitations(input: PatentLicensingUserInput): string {
    const exclusivityDescription = input.exclusivity === 'exclusive' ? 
      'This license is granted on an exclusive basis within the Licensed Field of Use and Licensed Territory. Patent Owner agrees not to grant any other party the right to practice the patented invention within the Licensed Field of Use and Licensed Territory during the term of this Agreement.' :
      input.exclusivity === 'sole' ?
      'This license is granted on a sole basis, meaning Patent Owner will not grant licenses to others but retains the right to practice the patented invention itself within the Licensed Field of Use and Licensed Territory.' :
      'This license is granted on a non-exclusive basis. Patent Owner retains the right to grant similar licenses to other parties and to practice the patented invention itself within the Licensed Field of Use and Licensed Territory.';

    return `Licensed Field of Use: ${input.fieldOfUse}

Licensed Territory: ${input.territory}

License Duration: ${input.licenseDuration}

${exclusivityDescription}

The rights granted under this license are limited to:
• The right to make the patented invention within the Licensed Field of Use
• The right to have the patented invention made by third parties for Licensee's account
• The right to use the patented invention within the Licensed Field of Use
• The right to offer for sale and sell the patented invention within the Licensed Territory
• The right to import the patented invention into the Licensed Territory

Licensee shall not:
• Practice the patented invention outside the Licensed Field of Use
• Use the patented invention outside the Licensed Territory
• Grant sublicenses without prior written consent of Patent Owner
• Challenge the validity or enforceability of the Patent(s)

All rights not expressly granted remain with Patent Owner.`;
  }

  private generateRoyaltyPayments(input: PatentLicensingUserInput): string {
    const minimumRoyaltiesText = input.minimumRoyalties ? 
      `\n\nMinimum Royalties: ${input.minimumRoyalties}` : '';
    const reportingText = input.reportingRequirements ? 
      `\n\nReporting Requirements: ${input.reportingRequirements}` : '';

    return `Royalty Structure: ${input.royaltyStructure}

Payment Terms: ${input.paymentTerms}${minimumRoyaltiesText}${reportingText}

All royalty payments shall be made in Kenya Shillings unless otherwise specified. Payments are due within thirty (30) days of the end of each reporting period.

Licensee shall maintain complete and accurate records of all sales, use, and manufacture of Licensed Products. Such records shall include:
• Quantities manufactured, sold, and used
• Sales prices and net sales revenues
• Manufacturing costs and expenses
• Inventory levels and locations

Patent Owner shall have the right to inspect Licensee's records upon reasonable notice during normal business hours, not more than once per calendar year.

Late payments shall accrue interest at the rate of 2% per month or the maximum rate permitted by law, whichever is lower.

All taxes arising from royalty payments shall be the responsibility of the respective parties in accordance with Kenyan tax laws and any applicable double taxation agreements.`;
  }

  private generatePatentProsecution(input: PatentLicensingUserInput): string {
    const customProsecution = input.patentProsecution || 
      'Patent Owner shall maintain the Patent(s) in full force and effect during the term of this Agreement, including payment of all maintenance fees, annuities, and other charges required to keep the Patent(s) valid and enforceable.';

    return `${customProsecution}

Patent Owner shall have the sole right and responsibility to prosecute patent applications and maintain issued patents related to the Licensed Technology, including:
• Filing continuation and divisional applications
• Responding to office actions and examiner rejections
• Payment of patent prosecution fees and maintenance fees
• Coordination with patent attorneys and agents

Licensee may provide input and assistance regarding patent prosecution matters, but all final decisions rest with Patent Owner.

Patent Owner shall promptly notify Licensee of any material developments in patent prosecution, including:
• Office actions received from patent offices
• Patent grants and issuances
• Patent expirations or lapses
• Changes in patent scope or claims

If Patent Owner decides to abandon or not maintain any Patent(s), it shall provide Licensee with at least ninety (90) days advance notice, and Licensee may elect to assume responsibility for such prosecution and maintenance at its own expense.`;
  }

  private generateInfringementEnforcement(input: PatentLicensingUserInput): string {
    const customProcedures = input.infringementProcedures || 
      'Each party shall promptly notify the other of any suspected patent infringement or unauthorized use of the Licensed Technology. Patent Owner shall have the primary responsibility for enforcement actions, but may, in its discretion, allow or require Licensee to participate in such actions.';

    return `${customProcedures}

Patent Owner shall have the first right, but not the obligation, to enforce the Patent(s) against third-party infringers. Patent Owner may:
• Institute legal proceedings against infringers
• Negotiate licensing agreements with third parties
• Take other appropriate action to protect the Patent(s)

If Patent Owner elects not to enforce the Patent(s) within ninety (90) days of receiving notice of infringement, Licensee may, with Patent Owner's prior written consent, institute enforcement proceedings at its own expense.

Licensee agrees to cooperate with Patent Owner in any enforcement actions, including:
• Providing information and documentation
• Making personnel available for testimony
• Assisting in discovery and investigation
• Providing technical expertise

Any damages or monetary awards recovered in infringement actions shall be allocated as follows:
• If Patent Owner conducts the enforcement: Patent Owner retains all proceeds after reimbursement of Licensee's costs
• If Licensee conducts the enforcement: Licensee retains all proceeds after reimbursement of its costs, with any excess shared with Patent Owner

Costs of enforcement actions shall be borne by the party conducting the enforcement unless otherwise agreed in writing.`;
  }

  private generateImprovements(input: PatentLicensingUserInput): string {
    const improvementText = input.improvementRights || 
      'Any improvements, modifications, or enhancements to the Licensed Technology made by either party shall be owned by the party making such improvements, subject to the license grants contained herein.';

    return `${improvementText}

For purposes of this Agreement, "Improvements" means any modification, enhancement, or development of the Licensed Technology that:
• Falls within the scope of the Patent(s)
• Constitutes patentable subject matter
• Is conceived or reduced to practice during the term of this Agreement

Patent Owner Improvements:
• Patent Owner retains all rights in improvements it develops
• Licensee automatically receives rights to use Patent Owner improvements under the same terms as the original license
• No additional royalties shall be due for Patent Owner improvements

Licensee Improvements:
• Licensee retains all rights in improvements it develops
• Patent Owner receives a non-exclusive, royalty-free license to use Licensee improvements
• Licensee may file patent applications for its improvements at its own expense

Joint Improvements:
• Jointly developed improvements shall be jointly owned
• Each party may exploit joint improvements without accounting to the other
• Neither party may assign or license joint improvements without the other's consent

Disclosure Obligations:
• Both parties shall promptly disclose any improvements to the other party
• Disclosure shall include sufficient technical detail to enable practice of the improvement
• Each party shall maintain confidentiality of the other's improvement disclosures`;
  }

  private generateTermAndTermination(input: PatentLicensingUserInput): string {
    const customTermination = input.terminationConditions || 
      'This Agreement shall commence on the Effective Date and continue until the expiration of the last-to-expire Patent(s) unless earlier terminated in accordance with the provisions hereof.';

    return `Term: ${customTermination}

This Agreement may be terminated:

1. **Natural Expiration**: Upon expiration of all Patent(s) covered by this Agreement

2. **Mutual Agreement**: By mutual written agreement of the parties

3. **Material Breach**: By either party upon thirty (30) days written notice if the other party materially breaches this Agreement and fails to cure such breach within the notice period

4. **Patent Invalidity**: Automatically if all Patent(s) are finally determined to be invalid or unenforceable by a court of competent jurisdiction

5. **Insolvency**: By either party if the other party becomes insolvent, files for bankruptcy, or makes an assignment for the benefit of creditors

6. **Patent Challenge**: By Patent Owner immediately upon notice if Licensee challenges the validity or enforceability of any Patent(s)

Notice Requirements:
• All termination notices must be in writing
• Notices must specify the grounds for termination
• Cure periods commence upon receipt of written notice

Effect of Termination:
• All rights granted to Licensee shall immediately cease
• Licensee shall discontinue all use of the Licensed Technology
• Accrued payment obligations shall survive termination
• Confidentiality obligations shall survive termination

Survival Provisions:
The following provisions shall survive termination: confidentiality, indemnification, governing law, dispute resolution, and any accrued payment obligations.`;
  }

  private generatePostTerminationProvisions(input: PatentLicensingUserInput): string {
    return `Upon termination or expiration of this Agreement, Licensee shall:

• Immediately cease all manufacture, use, sale, and distribution of Licensed Products
• Discontinue all use of the Licensed Technology
• Return or destroy all confidential information related to the Licensed Technology
• Provide Patent Owner with a written certification of compliance with these obligations

Sell-off Period:
Licensee may continue to sell existing inventory of Licensed Products for a period of ninety (90) days following termination, provided that:
• Such products were manufactured prior to termination
• Licensee continues to pay applicable royalties on such sales
• Such products meet all quality standards and specifications
• No modifications or improvements are made to existing inventory

No Implied Licenses:
Termination of this Agreement shall not create any implied license or right to continue practicing the Licensed Technology under any theory of law or equity.

Patent Marking:
Within thirty (30) days of termination, Licensee shall cease all use of patent markings related to the Patent(s) and remove such markings from all materials, products, and documentation.

Third-Party Obligations:
• Licensee shall terminate any sublicenses granted (if applicable)
• Licensee shall notify all customers and distributors of termination
• Licensee shall cooperate in transitioning any ongoing obligations

Post-Termination Non-Competition:
For a period of one (1) year following termination, Licensee agrees not to engage in research, development, or commercialization of technology that directly competes with the Licensed Technology within the Licensed Field of Use.

These post-termination obligations are in addition to any other remedies available to Patent Owner at law or in equity.`;
  }

  private generateGeneralProvisions(input: PatentLicensingUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const disputeText = input.disputeResolution || 
      'Any disputes arising under this Agreement shall be resolved through good faith negotiation, and if necessary, through binding arbitration in accordance with the Arbitration Act of Kenya.';
    const additionalTerms = input.additionalTerms || '';
    const validityWarranties = input.validityWarranties || 
      'Patent Owner warrants that it has good and marketable title to the Patent(s) and that the Patent(s) are valid and enforceable.';
    const indemnificationTerms = input.indemnificationTerms || 
      'Each party agrees to indemnify and hold harmless the other party from claims arising from its breach of this Agreement or negligent acts.';

    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}, including the Industrial Property Act.

${disputeText}

Patent Warranties: ${validityWarranties}

Patent Owner further warrants that:
• It has the full right and authority to grant the license contained herein
• The Patent(s) are free from any liens, encumbrances, or conflicting rights
• No prior licenses have been granted that would conflict with this Agreement
• All patent prosecution has been conducted in good faith and in compliance with applicable laws

Technology Transfer: Patent Owner shall provide reasonable technical assistance to enable Licensee to practice the Licensed Technology, including access to technical documentation, know-how, and personnel consultation as reasonably necessary.

Compliance with Laws: Both parties shall comply with all applicable laws and regulations, including:
• Export control and import regulations
• Foreign exchange regulations
• Technology transfer regulations
• Environmental and safety regulations

Indemnification: ${indemnificationTerms}

Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements relating to the subject matter hereof.

Amendment: This Agreement may only be modified by a written instrument signed by both parties.

Assignment: This Agreement may not be assigned by Licensee without the prior written consent of Patent Owner. Patent Owner may assign this Agreement upon notice to Licensee.

Severability: If any provision of this Agreement is held invalid or unenforceable, the remainder of the Agreement shall continue in full force and effect.

Force Majeure: Neither party shall be liable for any failure to perform due to causes beyond its reasonable control, including acts of God, war, terrorism, or government action.

Relationship of Parties: The parties are independent contractors. This Agreement does not create a partnership, joint venture, or agency relationship.

${additionalTerms}`;
  }

  private generateSignatures(input: PatentLicensingUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const patentOwnerName = input.patentOwnerName || (input as any).party1Name || 'Patent Owner';
    const patentOwnerAddress = input.patentOwnerAddress || (input as any).party1Address || 'Address not provided';
    const licenseeName = input.licenseeName || (input as any).party2Name || 'Licensee';
    const licenseeAddress = input.licenseeAddress || (input as any).party2Address || 'Address not provided';

    return `PATENT OWNER:

_______________________
${patentOwnerName}
Address: ${patentOwnerAddress}
Date: _______________


LICENSEE:

_______________________
${licenseeName}
Address: ${licenseeAddress}
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