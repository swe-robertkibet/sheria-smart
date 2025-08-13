import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { ShareholderAgreementUserInput, GeneratedShareholderAgreementContent } from '../../types/documents/corporate/shareholder-agreement';

export class ShareholderAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'SHAREHOLDER AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as ShareholderAgreementUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = (input.companyName || (input as any).party1Name || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
    return `Shareholder_Agreement_${companyName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as ShareholderAgreementUserInput;
    const partyInfo: string[] = [];

    // Company Information
    partyInfo.push('Company Information:');
    partyInfo.push(`Name: ${input.companyName || (input as any).party1Name || 'Company Name'}`);
    partyInfo.push(`Address: ${input.companyAddress || (input as any).party1Address || 'Address not provided'}`);
    if (input.companyRegistrationNumber) {
      partyInfo.push(`Registration Number: ${input.companyRegistrationNumber}`);
    }
    partyInfo.push(`Business Type: ${input.companyBusinessType || 'Business activities'}`);
    if (input.incorporationDate) {
      partyInfo.push(`Incorporation Date: ${input.incorporationDate}`);
    }
    partyInfo.push('');

    // Shareholders Information
    partyInfo.push('Shareholders:');
    
    // Shareholder 1
    partyInfo.push(`Shareholder 1: ${input.shareholder1Name || (input as any).party2Name || 'Shareholder 1'}`);
    partyInfo.push(`Address: ${input.shareholder1Address || (input as any).party2Address || 'Address not provided'}`);
    if (input.shareholder1Email) {
      partyInfo.push(`Email: ${input.shareholder1Email}`);
    }
    partyInfo.push(`Shareholding: ${input.shareholder1Percentage || 'Not specified'}%`);
    partyInfo.push(`Shares: ${input.shareholder1Shares || 'Not specified'}`);
    partyInfo.push('');

    // Shareholder 2
    partyInfo.push(`Shareholder 2: ${input.shareholder2Name || 'Shareholder 2'}`);
    partyInfo.push(`Address: ${input.shareholder2Address || 'Address not provided'}`);
    if (input.shareholder2Email) {
      partyInfo.push(`Email: ${input.shareholder2Email}`);
    }
    partyInfo.push(`Shareholding: ${input.shareholder2Percentage || 'Not specified'}%`);
    partyInfo.push(`Shares: ${input.shareholder2Shares || 'Not specified'}`);
    partyInfo.push('');

    // Shareholder 3 (if provided)
    if (input.shareholder3Name) {
      partyInfo.push(`Shareholder 3: ${input.shareholder3Name}`);
      partyInfo.push(`Address: ${input.shareholder3Address || 'Address not provided'}`);
      if (input.shareholder3Email) {
        partyInfo.push(`Email: ${input.shareholder3Email}`);
      }
      partyInfo.push(`Shareholding: ${input.shareholder3Percentage || 'Not specified'}%`);
      partyInfo.push(`Shares: ${input.shareholder3Shares || 'Not specified'}`);
      partyInfo.push('');
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedShareholderAgreementContent): DocumentSection[] {
    const input = userInput as unknown as ShareholderAgreementUserInput;
    
    return [
      {
        title: 'PARTIES AND SHAREHOLDINGS',
        content: generatedContent.partiesAndShareholdings || this.generatePartiesAndShareholdings(input)
      },
      {
        title: 'MANAGEMENT AND CONTROL',
        content: generatedContent.managementAndControl || this.generateManagementAndControl(input)
      },
      {
        title: 'TRANSFER RESTRICTIONS',
        content: generatedContent.transferRestrictions || this.generateTransferRestrictions(input)
      },
      {
        title: 'INFORMATION RIGHTS',
        content: generatedContent.informationRights || this.generateInformationRights(input)
      },
      {
        title: 'FINANCING ARRANGEMENTS',
        content: generatedContent.financingArrangements || this.generateFinancingArrangements(input)
      },
      {
        title: 'EXIT PROVISIONS',
        content: generatedContent.exitProvisions || this.generateExitProvisions(input)
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

  private generatePartiesAndShareholdings(input: ShareholderAgreementUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = input.companyName || (input as any).party1Name || 'Company Name';
    
    return `This Shareholder Agreement (\"Agreement\") is entered into between the shareholders of ${companyName}, a company incorporated under the Companies Act, 2015 of the Republic of Kenya.

COMPANY DETAILS:
Name: ${companyName}
Registration Number: ${input.companyRegistrationNumber || 'To be inserted'}
Address: ${input.companyAddress || 'Company address'}
Business Type: ${input.companyBusinessType}
Incorporation Date: ${input.incorporationDate || 'To be inserted'}

SHARE CAPITAL STRUCTURE:
Authorized Share Capital: ${input.authorizedShareCapital}
Total Shares Issued: ${input.totalSharesIssued}
Nominal Value per Share: ${input.shareNominalValue}
Paid-Up Capital: ${input.paidUpCapital}
${input.shareClasses ? `Share Classes: ${input.shareClasses}` : ''}

CURRENT SHAREHOLDING STRUCTURE:
${input.shareholdingPercentages}

The parties acknowledge that the shareholding percentages and number of shares set out above represent the current shareholding in the Company as at the date of this Agreement.

SHARE CERTIFICATES:
Each shareholder shall be entitled to receive share certificates in respect of their shareholding in the Company, issued in accordance with the Company's Articles of Association.

SHAREHOLDERS' STATUS:
All shareholders agree to be bound by the terms of this Agreement in their capacity as shareholders of the Company, and this Agreement shall supplement and be read together with the Company's Articles of Association.`;
  }

  private generateManagementAndControl(input: ShareholderAgreementUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `BOARD OF DIRECTORS:
${input.boardRepresentation}

Board Size: ${input.boardSize}

DIRECTOR APPOINTMENT RIGHTS:
${input.directorAppointmentRights}

MANAGEMENT STRUCTURE:
${input.managementStructure}

VOTING AGREEMENTS:
${input.votingAgreements}

QUORUM REQUIREMENTS:
${input.quorumRequirements}

${input.chairmanAppointment ? `CHAIRMAN APPOINTMENT:
${input.chairmanAppointment}` : ''}

DECISION MAKING:
• Ordinary resolutions require a simple majority of votes cast
• Special resolutions require not less than 75% of votes cast
• Certain matters may require unanimous consent as specified in this Agreement

RESERVED MATTERS:
The following matters shall require the approval of shareholders holding not less than 75% of the issued share capital:
• Amendment of the Company's Articles of Association
• Increase or reduction of share capital
• Declaration of dividends above the agreed policy
• Appointment or removal of auditors
• Entry into material contracts outside the ordinary course of business
• Borrowing above agreed limits
• Merger, acquisition, or disposal of substantial assets
• Winding up or liquidation of the Company

BOARD MEETINGS:
• Board meetings shall be held at least quarterly
• Notice of not less than 7 days shall be given for board meetings
• Decisions may be made by written resolution signed by all directors
• Minutes shall be kept of all board meetings and resolutions

FIDUCIARY DUTIES:
All directors appointed under this Agreement shall owe fiduciary duties to the Company and must act in the best interests of the Company as a whole, in accordance with the Companies Act, 2015 and the laws of ${governingLaw}.`;
  }

  private generateTransferRestrictions(input: ShareholderAgreementUserInput): string {
    return `TRANSFER RESTRICTIONS:
${input.transferRestrictions}

RIGHT OF FIRST REFUSAL:
${input.rightOfFirstRefusal}

TRANSFER APPROVAL PROCESS:
${input.transferApprovalProcess}

VALUATION FOR TRANSFERS:
${input.valuationForTransfers}

${input.tagAlongRights ? `TAG-ALONG RIGHTS:
${input.tagAlongRights}` : ''}

${input.dragAlongRights ? `DRAG-ALONG RIGHTS:
${input.dragAlongRights}` : ''}

${input.restrictedTransferees ? `RESTRICTED TRANSFEREES:
${input.restrictedTransferees}` : ''}

PERMITTED TRANSFERS:
The following transfers shall be permitted without the need for approval:
• Transfers to immediate family members (spouse, children, parents)
• Transfers to trusts established for the benefit of the shareholder or family
• Transfers pursuant to court orders or legal requirements
• Transfers as security for bona fide loans (subject to right of first refusal)

TRANSFER PROCEDURES:
1. Notice of intended transfer must be given in writing to all other shareholders
2. Right of first refusal period of 30 days commences upon notice
3. If right is exercised, completion must occur within 60 days
4. Fair market value to be determined by independent valuation if disputed
5. Transfer documents must be in form approved by the Company

CONSEQUENCES OF UNAUTHORIZED TRANSFER:
Any purported transfer in breach of these provisions shall be void and of no effect. The Company shall not be obliged to register such transfer or recognize the purported transferee as a shareholder.

DEATH OR INCAPACITY:
Upon death or permanent incapacity of a shareholder, the remaining shareholders shall have the option (but not obligation) to purchase the deceased/incapacitated shareholder's shares at fair market value within 12 months of the relevant event.`;
  }

  private generateInformationRights(input: ShareholderAgreementUserInput): string {
    return `INFORMATION RIGHTS:
${input.informationRights}

FINANCIAL REPORTING:
${input.financialReporting}

RECORD ACCESS RIGHTS:
${input.recordAccessRights}

INSPECTION RIGHTS:
${input.inspectionRights}

BOARD MEETING RIGHTS:
${input.boardMeetingRights}

${input.auditRights ? `AUDIT RIGHTS:
${input.auditRights}` : ''}

MONTHLY REPORTING:
The Company shall provide all shareholders with monthly management accounts within 15 days of month-end, including:
• Profit and loss statement
• Balance sheet
• Cash flow statement
• Key performance indicators
• Management commentary on performance

ANNUAL REPORTING:
The Company shall provide shareholders with:
• Audited annual financial statements within 6 months of financial year-end
• Annual budget and business plan before start of each financial year
• Annual report including directors' report and auditor's report

EXTRAORDINARY REPORTING:
Shareholders shall be promptly notified of:
• Any material litigation or regulatory investigations
• Material contracts entered into outside ordinary course of business
• Any events that may materially affect the Company's financial position
• Proposed changes to senior management or auditors

CONFIDENTIALITY:
All information provided to shareholders under this Agreement shall be treated as confidential and may only be used for purposes relating to their shareholding in the Company.

SHAREHOLDERS' MEETINGS:
• Annual General Meeting to be held within 6 months of financial year-end
• Extraordinary General Meetings may be called by shareholders holding 10% or more of issued shares
• 21 days' notice required for all general meetings
• All shareholders entitled to receive notice and attend meetings

ACCESS TO RECORDS:
Shareholders may inspect the following records during business hours upon reasonable notice:
• Register of members and directors
• Minutes of general meetings
• Company's statutory books
• Material contracts and agreements
• Such other records as may be reasonably requested`;
  }

  private generateFinancingArrangements(input: ShareholderAgreementUserInput): string {
    return `DIVIDEND POLICY:
${input.dividendPolicy}

DISTRIBUTION POLICY:
${input.distributionPolicy}

PREEMPTION RIGHTS:
${input.preemptionRights}

${input.antiDilutionProvisions ? `ANTI-DILUTION PROVISIONS:
${input.antiDilutionProvisions}` : ''}

${input.capitalCallProcedures ? `CAPITAL CALL PROCEDURES:
${input.capitalCallProcedures}` : ''}

${input.liquidationPreferences ? `LIQUIDATION PREFERENCES:
${input.liquidationPreferences}` : ''}

FINANCING ARRANGEMENTS:
All new equity financing shall be subject to the following procedures:
1. Board approval by special resolution
2. Offer to existing shareholders on pro rata basis
3. Right of first refusal period of 30 days
4. Fair market valuation by independent valuers
5. Compliance with Companies Act and regulatory requirements

DEBT FINANCING:
• Material borrowings (above KES 5 million) require shareholder approval
• Personal guarantees by shareholders require unanimous consent
• Security over Company assets requires special resolution
• All loan agreements to be reviewed by Company's legal advisors

WORKING CAPITAL:
The Company shall maintain adequate working capital as determined by the board, with monthly cash flow monitoring and quarterly reviews with shareholders.

FINANCIAL COVENANTS:
The Company shall maintain:
• Debt-to-equity ratio not exceeding 2:1
• Current ratio of not less than 1.5:1
• Minimum cash reserves of 3 months' operating expenses
• Such other financial covenants as may be agreed by shareholders

BUDGETS AND BUSINESS PLANS:
Annual budgets and 3-year business plans shall be prepared and approved by shareholders before the start of each financial year, with quarterly reviews and updates as necessary.

USE OF FUNDS:
Company funds may only be used for legitimate business purposes in accordance with approved budgets and business plans. Any material expenditure outside approved budgets requires board approval.

BANKING ARRANGEMENTS:
• All bank accounts to be held in the Company's name
• Signatory requirements as determined by the board
• Monthly bank reconciliations and cash flow reports
• Banking relationships to be reviewed annually`;
  }

  private generateExitProvisions(input: ShareholderAgreementUserInput): string {
    return `EXIT MECHANISMS:
${input.exitMechanisms}

VALUATION METHODS:
${input.valuationMethods}

${input.buyoutTriggers ? `BUYOUT TRIGGERS:
${input.buyoutTriggers}` : ''}

${input.compulsoryTransferEvents ? `COMPULSORY TRANSFER EVENTS:
${input.compulsoryTransferEvents}` : ''}

${input.retirementProvisions ? `RETIREMENT PROVISIONS:
${input.retirementProvisions}` : ''}

${input.deathDisabilityProvisions ? `DEATH AND DISABILITY PROVISIONS:
${input.deathDisabilityProvisions}` : ''}

VOLUNTARY EXIT:
Any shareholder wishing to exit may do so subject to:
• 6 months' written notice to other shareholders
• Right of first refusal by remaining shareholders
• Independent valuation of shares
• Completion within 90 days of valuation

INVOLUNTARY EXIT:
A shareholder may be required to transfer their shares upon:
• Material breach of this Agreement
• Conviction of a criminal offense involving fraud or dishonesty
• Bankruptcy or insolvency
• Breach of confidentiality or non-compete obligations
• Conduct prejudicial to the Company's interests

VALUATION PROCESS:
1. Independent valuation by qualified business valuers
2. Valuation based on fair market value of the Company as a going concern
3. Discount for minority holdings and lack of marketability
4. Valuation date shall be the date of the triggering event
5. Costs of valuation shared equally between parties

COMPLETION PROCEDURES:
• Share transfer forms to be executed within 30 days of agreement
• Purchase price payable within 60 days unless payment terms agreed
• Company to update register of members
• Share certificates to be delivered upon payment

RESTRICTION ON COMPETITION:
Exiting shareholders shall be subject to:
• 2-year non-compete restriction within Kenya
• Non-solicitation of Company employees and customers
• Confidentiality obligations continuing indefinitely
• Return of all Company property and confidential information

DISPUTE RESOLUTION FOR EXITS:
Any disputes relating to exit provisions shall be resolved through:
1. Good faith negotiation for 30 days
2. Mediation by qualified mediator for 60 days
3. Binding arbitration under Arbitration Act of Kenya
4. Expedited procedures for urgent matters

TAG-ALONG AND DRAG-ALONG:
• Tag-along rights protect minority shareholders on major sales
• Drag-along rights enable majority shareholders to effect complete exit
• Applies to sales of more than 50% of issued share capital
• Fair market value and terms to apply equally to all shareholders`;
  }

  private generateDisputeResolution(input: ShareholderAgreementUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const disputeResolution = input.disputeResolution || 'Any disputes shall be resolved through good faith negotiation, mediation, and if necessary, binding arbitration in accordance with the Arbitration Act of Kenya.';
    
    return `DISPUTE RESOLUTION:
${disputeResolution}

DEADLOCK RESOLUTION:
${input.deadlockResolution}

${input.arbitrationProvisions ? `ARBITRATION PROVISIONS:
${input.arbitrationProvisions}` : ''}

GOVERNING LAW:
This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}, including the Companies Act, 2015.

DISPUTE RESOLUTION PROCEDURE:
1. **Good Faith Negotiation**: The parties shall first attempt to resolve any dispute through good faith negotiation for a period of 30 days.

2. **Mediation**: If negotiation fails, the dispute shall be referred to mediation before a qualified mediator agreed upon by the parties or appointed by the Chartered Institute of Arbitrators (Kenya Branch).

3. **Arbitration**: If mediation is unsuccessful within 60 days, the dispute shall be referred to binding arbitration under the Arbitration Act, 1995 of Kenya.

4. **Emergency Procedures**: For urgent matters requiring immediate relief, any party may seek interim measures from the High Court of Kenya.

ARBITRATION RULES:
• Single arbitrator for disputes under KES 10 million
• Three arbitrators for larger disputes
• Arbitrator(s) to be qualified lawyers or business professionals
• Proceedings to be conducted in English
• Seat of arbitration shall be Nairobi, Kenya
• Arbitral award shall be final and binding

COSTS AND EXPENSES:
• Each party to bear their own legal costs initially
• Arbitrator may award costs to the successful party
• Mediation costs to be shared equally
• Frivolous claims may result in cost sanctions

CONFIDENTIALITY:
All dispute resolution proceedings shall be confidential, and parties shall not disclose details of disputes or proceedings to third parties except as required by law or for enforcement purposes.

ENFORCEMENT:
Any arbitral award may be enforced in any court of competent jurisdiction. The parties waive any right to challenge the jurisdiction of Kenyan courts for enforcement purposes.

CONTINUING OBLIGATIONS:
During dispute resolution proceedings:
• Shareholders shall continue to comply with this Agreement
• Company operations shall continue normally where possible
• No party may take actions to prejudice the dispute resolution process
• Confidentiality and non-compete obligations remain in force

DEADLOCK MECHANISMS:
In case of irreconcilable deadlock:
• Independent chairman may be appointed to break deadlock
• Shareholders may agree to exit mechanisms
• Company may be wound up if no resolution possible
• Court intervention as last resort

JURISDICTION:
The High Court of Kenya shall have exclusive jurisdiction over any matters not subject to arbitration, including:
• Applications for interim relief
• Enforcement of arbitral awards
• Matters relating to Company registration and statutory compliance`;
  }

  private generateGeneralProvisions(input: ShareholderAgreementUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const entireAgreementClause = input.entireAgreementClause || 'This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements relating to the subject matter hereof.';
    const severabilityProvisions = input.severabilityProvisions || 'If any provision of this Agreement is held invalid or unenforceable, the remainder shall continue in full force and effect.';
    
    return `CONFIDENTIALITY OBLIGATIONS:
${input.confidentialityObligations}

${input.nonCompeteRestrictions ? `NON-COMPETE RESTRICTIONS:
${input.nonCompeteRestrictions}` : ''}

${input.nonSolicitationClauses ? `NON-SOLICITATION:
${input.nonSolicitationClauses}` : ''}

${input.businessOpportunityRights ? `BUSINESS OPPORTUNITY RIGHTS:
${input.businessOpportunityRights}` : ''}

AMENDMENT PROCEDURES:
${input.amendmentProcedures}

TERMINATION CONDITIONS:
${input.terminationConditions}

${input.successorObligations ? `SUCCESSOR OBLIGATIONS:
${input.successorObligations}` : ''}

ENTIRE AGREEMENT:
${entireAgreementClause}

SEVERABILITY:
${severabilityProvisions}

NOTICES:
All notices under this Agreement shall be in writing and delivered:
• By hand delivery with receipt acknowledged
• By registered mail to the addresses set out herein
• By email to the email addresses provided (with read receipt)
• By such other means as the parties may agree

Notices shall be deemed received:
• If delivered by hand, upon delivery
• If sent by registered mail, 5 days after posting
• If sent by email, upon receipt of read receipt

ASSIGNMENT:
This Agreement shall be binding upon and inure to the benefit of the parties and their respective heirs, executors, administrators, successors, and permitted assigns. No party may assign their rights under this Agreement without the prior written consent of all other parties.

WAIVER:
No waiver of any provision of this Agreement shall be effective unless in writing and signed by the party against whom such waiver is sought. No single or partial exercise of any right or remedy shall preclude further exercise thereof.

RELATIONSHIP OF PARTIES:
Nothing in this Agreement shall be construed to create a partnership, joint venture, or agency relationship between the shareholders. Each shareholder is an independent party with separate interests in the Company.

FURTHER ASSURANCE:
Each party agrees to execute such further documents and take such further actions as may be reasonably necessary to implement the provisions of this Agreement.

COUNTERPARTS:
This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument.

COMPLIANCE WITH LAW:
All parties shall comply with applicable laws and regulations, including:
• Companies Act, 2015
• Capital Markets Act
• Competition Act
• Foreign exchange regulations
• Tax laws and regulations
• Employment laws
• Environmental regulations

EFFECTIVENESS:
This Agreement shall become effective upon execution by all parties and shall remain in force until terminated in accordance with its terms or by mutual agreement of all parties.

LANGUAGE:
This Agreement is executed in English, which shall be the controlling language for all purposes.`;
  }

  private generateSignatures(input: ShareholderAgreementUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = input.companyName || (input as any).party1Name || 'Company Name';
    const shareholder1Name = input.shareholder1Name || (input as any).party2Name || 'Shareholder 1';
    const shareholder1Address = input.shareholder1Address || (input as any).party2Address || 'Address not provided';
    
    return `IN WITNESS WHEREOF, the parties have executed this Shareholder Agreement on ${input.effectiveDate}.

COMPANY:

${companyName}

By: _______________________
Name: _____________________
Title: Director/Secretary
Date: _______________


SHAREHOLDERS:

SHAREHOLDER 1:

_______________________
${shareholder1Name}
Address: ${shareholder1Address}
Date: _______________


SHAREHOLDER 2:

_______________________
${input.shareholder2Name || 'Shareholder 2'}
Address: ${input.shareholder2Address || 'Address not provided'}
Date: _______________

${input.shareholder3Name ? `
SHAREHOLDER 3:

_______________________
${input.shareholder3Name}
Address: ${input.shareholder3Address || 'Address not provided'}
Date: _______________` : ''}

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
Date: _______________


ACKNOWLEDGMENT:

We, the undersigned, acknowledge that:
1. We have read and understood the terms of this Agreement
2. We have received independent legal advice or waived the right to such advice
3. We enter into this Agreement voluntarily and without duress
4. This Agreement shall be binding upon our heirs, successors, and assigns
5. We agree to comply with all terms and conditions set forth herein

NOTARIZATION:

SWORN before me this _____ day of __________, 20___.

_______________________
Commissioner for Oaths/Notary Public
My commission expires: _______________`;
  }
}