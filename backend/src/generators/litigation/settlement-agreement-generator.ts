import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { SettlementAgreementUserInput, GeneratedSettlementAgreementContent } from '../../types/documents/litigation/settlement-agreement';

export class SettlementAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'SETTLEMENT AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as SettlementAgreementUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = (input.disputeParty1Name || (input as any).party1Name || 'Party1').replace(/[^a-zA-Z0-9]/g, '_');
    const party2Name = (input.disputeParty2Name || (input as any).party2Name || 'Party2').replace(/[^a-zA-Z0-9]/g, '_');
    return `Settlement_Agreement_${party1Name}_${party2Name}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as SettlementAgreementUserInput;
    const partyInfo: string[] = [];

    // Disputing Party 1 Information
    partyInfo.push('Disputing Party 1 Information:');
    partyInfo.push(`Name: ${input.disputeParty1Name || (input as any).party1Name || 'Party 1'}`);
    partyInfo.push(`Address: ${input.disputeParty1Address || (input as any).party1Address || 'Address not provided'}`);
    partyInfo.push(`Email: ${input.disputeParty1Email || (input as any).party1Email || 'Email not provided'}`);
    if (input.disputeParty1Phone) {
      partyInfo.push(`Phone: ${input.disputeParty1Phone}`);
    }
    if (input.disputeParty1LegalRep) {
      partyInfo.push(`Legal Representative: ${input.disputeParty1LegalRep}`);
      if (input.disputeParty1LegalRepAddress) {
        partyInfo.push(`Legal Rep Address: ${input.disputeParty1LegalRepAddress}`);
      }
    }
    partyInfo.push('');

    // Disputing Party 2 Information
    partyInfo.push('Disputing Party 2 Information:');
    partyInfo.push(`Name: ${input.disputeParty2Name || (input as any).party2Name || 'Party 2'}`);
    partyInfo.push(`Address: ${input.disputeParty2Address || (input as any).party2Address || 'Address not provided'}`);
    partyInfo.push(`Email: ${input.disputeParty2Email || (input as any).party2Email || 'Email not provided'}`);
    if (input.disputeParty2Phone) {
      partyInfo.push(`Phone: ${input.disputeParty2Phone}`);
    }
    if (input.disputeParty2LegalRep) {
      partyInfo.push(`Legal Representative: ${input.disputeParty2LegalRep}`);
      if (input.disputeParty2LegalRepAddress) {
        partyInfo.push(`Legal Rep Address: ${input.disputeParty2LegalRepAddress}`);
      }
    }
    partyInfo.push('');

    // Additional Parties (if applicable)
    if (input.additionalParties) {
      partyInfo.push('Additional Parties:');
      partyInfo.push(input.additionalParties);
      partyInfo.push('');
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedSettlementAgreementContent): DocumentSection[] {
    const input = userInput as unknown as SettlementAgreementUserInput;
    
    return [
      {
        title: 'PARTIES AND BACKGROUND',
        content: generatedContent.partiesAndBackground || this.generatePartiesAndBackground(input)
      },
      {
        title: 'DISPUTE DESCRIPTION',
        content: generatedContent.disputeDescription || this.generateDisputeDescription(input)
      },
      {
        title: 'SETTLEMENT TERMS',
        content: generatedContent.settlementTerms || this.generateSettlementTerms(input)
      },
      {
        title: 'PAYMENT PROVISIONS',
        content: generatedContent.paymentProvisions || this.generatePaymentProvisions(input)
      },
      {
        title: 'RELEASE OF CLAIMS',
        content: generatedContent.releaseOfClaims || this.generateReleaseOfClaims(input)
      },
      {
        title: 'CONFIDENTIALITY PROVISIONS',
        content: generatedContent.confidentialityProvisions || this.generateConfidentialityProvisions(input)
      },
      {
        title: 'PERFORMANCE OBLIGATIONS',
        content: generatedContent.performanceObligations || this.generatePerformanceObligations(input)
      },
      {
        title: 'DEFAULT AND ENFORCEMENT',
        content: generatedContent.defaultAndEnforcement || this.generateDefaultAndEnforcement(input)
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

  private generatePartiesAndBackground(input: SettlementAgreementUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = input.disputeParty1Name || (input as any).party1Name || 'Party 1';
    const party1Address = input.disputeParty1Address || (input as any).party1Address || 'Address not provided';
    const party2Name = input.disputeParty2Name || (input as any).party2Name || 'Party 2';
    const party2Address = input.disputeParty2Address || (input as any).party2Address || 'Address not provided';

    const additionalPartiesText = input.additionalParties ? `\n\nAdditional Parties: ${input.additionalParties}` : '';
    const caseNumberText = input.legalProceedingsCaseNumber ? `\n\nLegal Proceedings Case Number: ${input.legalProceedingsCaseNumber}` : '';
    const courtText = input.courtJurisdiction ? `\nCourt Jurisdiction: ${input.courtJurisdiction}` : '';

    return `This Settlement Agreement ("Agreement") is entered into between ${party1Name}, located at ${party1Address} ("First Party"), and ${party2Name}, located at ${party2Address} ("Second Party"), collectively referred to as the "Parties."${additionalPartiesText}

BACKGROUND:
The Parties have been involved in a dispute arising from ${input.disputeBackground || 'the matters described herein'}. This Agreement represents a complete and final resolution of all disputes, claims, and controversies between the Parties.${caseNumberText}${courtText}

The Parties desire to avoid the uncertainty, expense, and time associated with continued litigation and wish to resolve their differences amicably through this Settlement Agreement, executed in accordance with the laws of the Republic of Kenya.`;
  }

  private generateDisputeDescription(input: SettlementAgreementUserInput): string {
    const originDateText = input.disputeOriginDate ? `\n\nDate of Origin: ${input.disputeOriginDate}` : '';
    const locationText = input.disputeLocation ? `\nLocation: ${input.disputeLocation}` : '';

    return `NATURE OF THE DISPUTE:
${input.disputeDescription}

SUBJECT MATTER:
${input.disputeSubjectMatter}

CLAIMS AND COUNTERCLAIMS:
${input.claimsAndCounterclaims}${originDateText}${locationText}

The Parties acknowledge that this dispute has caused inconvenience, expense, and disruption to their respective interests. Both Parties maintain their respective positions regarding the merits of their claims but agree that settlement is in their mutual best interests.

DISPUTED MATTERS COVERED:
This Settlement Agreement resolves all matters in controversy between the Parties, including but not limited to all claims, demands, actions, causes of action, suits, debts, sums of money, accounts, covenants, contracts, agreements, promises, damages, and liabilities of every kind and nature whatsoever, whether known or unknown, suspected or unsuspected, which arose or may have arisen out of the subject matter of this dispute.`;
  }

  private generateSettlementTerms(input: SettlementAgreementUserInput): string {
    const considerationText = input.settlementConsideration ? `\n\nSettlement Consideration: ${input.settlementConsideration}` : '';
    const nonMonetaryText = input.nonMonetaryTerms ? `\n\nNon-Monetary Terms: ${input.nonMonetaryTerms}` : '';

    return `SETTLEMENT TERMS AND CONDITIONS:
${input.settlementTerms}

SETTLEMENT DESCRIPTION:
${input.settlementDescription}${considerationText}${nonMonetaryText}

MUTUAL AGREEMENTS:
The Parties agree that the terms set forth in this Agreement represent a fair and equitable resolution of their dispute. Each Party acknowledges that they have entered into this Agreement voluntarily and with full knowledge of its terms and legal consequences.

COMPLIANCE WITH KENYAN LAW:
This Settlement Agreement is executed in compliance with the Civil Procedure Rules of Kenya, Alternative Dispute Resolution mechanisms, and all applicable laws of the Republic of Kenya. The Parties acknowledge their understanding of their legal rights and obligations under this Agreement.

NO ADMISSION OF LIABILITY:
The Parties expressly agree that this Settlement Agreement shall not be construed as an admission of liability, fault, or wrongdoing by any Party. Each Party specifically denies any liability or wrongdoing, and this Agreement is entered into solely for the purpose of avoiding the expense and uncertainty of continued litigation.`;
  }

  private generatePaymentProvisions(input: SettlementAgreementUserInput): string {
    if (!input.settlementAmount) {
      return `PAYMENT TERMS:
No monetary settlement is contemplated under this Agreement. The resolution is based on non-monetary terms and mutual releases as set forth in other sections of this Agreement.`;
    }

    const paymentStructureText = input.paymentStructure ? `\n\nPayment Structure: ${input.paymentStructure}` : '';
    const paymentScheduleText = input.paymentSchedule ? `\n\nPayment Schedule: ${input.paymentSchedule}` : '';
    const paymentMethodText = input.paymentMethod ? `\n\nPayment Method: ${input.paymentMethod}` : '';
    const dueDateText = input.paymentDueDate ? `\n\nDue Date: ${input.paymentDueDate}` : '';
    const penaltiesText = input.latePaymentPenalties ? `\n\nLate Payment Penalties: ${input.latePaymentPenalties}` : '';

    return `MONETARY SETTLEMENT:
Settlement Amount: ${input.settlementAmount}${paymentStructureText}${paymentScheduleText}${paymentMethodText}${dueDateText}${penaltiesText}

PAYMENT TERMS AND CONDITIONS:
1. All payments shall be made in Kenya Shillings unless otherwise specified
2. Payments shall be deemed made when received by the payee
3. Time is of the essence with respect to all payment obligations
4. All payments shall be made free and clear of any deductions, withholdings, or set-offs

TAX IMPLICATIONS:
Each Party shall be responsible for their own tax obligations arising from this settlement. The paying Party shall not be responsible for any taxes, penalties, or interest that may be imposed on the receiving Party as a result of this settlement payment.

DEFAULT ON PAYMENT:
Failure to make any payment when due shall constitute a material breach of this Agreement and shall entitle the non-breaching Party to pursue all available remedies at law or in equity, including but not limited to specific performance and monetary damages.

CURRENCY AND BANKING:
All payments shall be made through recognized banking institutions operating in Kenya. Exchange rate risks, if any, shall be borne by the paying Party unless otherwise agreed in writing.`;
  }

  private generateReleaseOfClaims(input: SettlementAgreementUserInput): string {
    const mutualReleaseText = input.mutualRelease === 'yes' ? '\n\nMUTUAL RELEASE: This release is mutual and applies to all Parties to this Agreement.' : '';
    const reservedRightsText = input.reservedRights ? `\n\nRESERVED RIGHTS: Notwithstanding the general release, the following rights are specifically reserved: ${input.reservedRights}` : '';
    const excludedClaimsText = input.excludedClaims ? `\n\nEXCLUDED CLAIMS: The following claims are specifically excluded from this release: ${input.excludedClaims}` : '';
    const thirdPartyText = input.thirdPartyReleases ? `\n\nTHIRD PARTY RELEASES: ${input.thirdPartyReleases}` : '';

    let releaseScope = '';
    if (input.releaseCoverage === 'specific') {
      releaseScope = 'This release applies specifically to the claims and matters described in this Agreement.';
    } else if (input.releaseCoverage === 'broad') {
      releaseScope = 'This release applies broadly to all claims, known or unknown, arising from or related to the subject matter of the dispute.';
    } else if (input.releaseCoverage === 'mutual') {
      releaseScope = 'This release is mutual and comprehensive, applying to all claims between all Parties.';
    } else {
      releaseScope = 'The scope of this release is as specifically defined in the settlement terms.';
    }

    return `GENERAL RELEASE OF CLAIMS:
${input.releaseOfClaimsScope}

SCOPE OF RELEASE:
${releaseScope}${mutualReleaseText}${reservedRightsText}${excludedClaimsText}${thirdPartyText}

COMPREHENSIVE RELEASE:
Each Party, for themselves and their heirs, executors, administrators, successors, and assigns, hereby releases, acquits, and forever discharges the other Parties and their respective heirs, executors, administrators, successors, assigns, officers, directors, employees, agents, and representatives from any and all claims, demands, actions, causes of action, suits, debts, sums of money, accounts, covenants, contracts, agreements, promises, damages, and liabilities of every kind and nature whatsoever.

UNKNOWN CLAIMS:
The Parties acknowledge that they may have claims against each other that are presently unknown or unsuspected. Nevertheless, the Parties waive any right they may have under any statute, rule, or principle of law that would limit the effect of this release to claims that are known or suspected to exist as of the date of this Agreement.

COVENANT NOT TO SUE:
Each Party covenants and agrees that they will not commence, maintain, prosecute, or encourage any action, suit, or other proceeding against any other Party concerning any matter released herein. This covenant not to sue extends to all claims that could have been brought arising out of the same facts, circumstances, or legal theories as the original dispute.

BINDING EFFECT:
This release shall be binding upon and inure to the benefit of the Parties and their respective heirs, executors, administrators, successors, and assigns. No Party may assign their rights under this release without the prior written consent of the other Parties.`;
  }

  private generateConfidentialityProvisions(input: SettlementAgreementUserInput): string {
    const durationText = input.confidentialityDuration ? `\n\nDuration: ${input.confidentialityDuration}` : '\n\nDuration: This confidentiality obligation shall continue indefinitely unless otherwise agreed by the Parties.';
    const publicDisclosureText = input.publicDisclosureRestrictions ? `\n\nPublic Disclosure Restrictions: ${input.publicDisclosureRestrictions}` : '';
    const mediaText = input.mediaStatementRestrictions ? `\n\nMedia Statement Restrictions: ${input.mediaStatementRestrictions}` : '';
    
    let nonDisparagementSection = '';
    if (input.nonDisparagement === 'yes') {
      const nonDisparagementTermsText = input.nonDisparagementTerms ? `\n\nNon-Disparagement Terms: ${input.nonDisparagementTerms}` : '';
      nonDisparagementSection = `\n\nNON-DISPARAGEMENT:
The Parties agree not to make any disparaging, derogatory, or defamatory statements about each other, whether written or oral, to any third party.${nonDisparagementTermsText}`;
    }

    return `CONFIDENTIALITY AND NON-DISCLOSURE:
${input.confidentialityProvisions}${durationText}${publicDisclosureText}${mediaText}${nonDisparagementSection}

CONFIDENTIAL INFORMATION:
The Parties agree that the existence and terms of this Settlement Agreement, the underlying dispute, the settlement negotiations, and all related communications shall be treated as confidential information.

PERMITTED DISCLOSURES:
Notwithstanding the confidentiality provisions, the Parties may disclose information:
1. As required by law or court order
2. To their attorneys, accountants, or other professional advisors
3. To immediate family members (with confidentiality obligations)
4. For tax reporting or compliance purposes
5. In connection with enforcement of this Agreement

BREACH OF CONFIDENTIALITY:
Any breach of these confidentiality provisions shall be considered a material breach of this Agreement, entitling the non-breaching Party to seek injunctive relief and monetary damages.

REMEDIES FOR CONFIDENTIALITY BREACH:
In addition to other available remedies, breach of confidentiality provisions may result in:
1. Immediate injunctive relief
2. Liquidated damages as agreed by the Parties
3. Recovery of attorney fees and costs incurred in enforcement
4. Such other relief as the court may deem appropriate

SURVIVAL:
The confidentiality obligations set forth in this Agreement shall survive the termination or expiration of this Agreement and shall remain in effect until specifically released in writing by all Parties.`;
  }

  private generatePerformanceObligations(input: SettlementAgreementUserInput): string {
    const deadlinesText = input.performanceDeadlines ? `\n\nPerformance Deadlines: ${input.performanceDeadlines}` : '';
    const deliverablesText = input.deliverables ? `\n\nDeliverables: ${input.deliverables}` : '';
    const complianceText = input.complianceRequirements ? `\n\nCompliance Requirements: ${input.complianceRequirements}` : '';
    const monitoringText = input.complianceMonitoring ? `\n\nCompliance Monitoring: ${input.complianceMonitoring}` : '';
    const reportingText = input.reportingRequirements ? `\n\nReporting Requirements: ${input.reportingRequirements}` : '';
    const auditText = input.auditRights ? `\n\nAudit Rights: ${input.auditRights}` : '';

    return `PERFORMANCE OBLIGATIONS:
${input.performanceObligations}${deadlinesText}${deliverablesText}${complianceText}${monitoringText}${reportingText}${auditText}

IMPLEMENTATION TIMELINE:
The Parties acknowledge that time is of the essence in performing their respective obligations under this Agreement. All performance obligations shall be completed according to the specified timelines or, if no specific timeline is provided, within a reasonable time period.

COORDINATION AND COOPERATION:
The Parties agree to cooperate fully in the implementation of this Settlement Agreement. Each Party shall designate a primary contact person responsible for coordination and communication regarding performance obligations.

MATERIAL PERFORMANCE STANDARDS:
All performance obligations shall be completed in a workmanlike manner and in accordance with applicable professional standards. Where specific quality standards are not defined, performance shall meet generally accepted industry standards.

NOTICE OF PERFORMANCE:
Upon completion of any material performance obligation, the performing Party shall provide written notice to the other Parties, including appropriate documentation or evidence of completion.

ACCEPTANCE AND REJECTION:
The receiving Party shall have a reasonable period (not exceeding 30 days unless otherwise specified) to review and either accept or reject any deliverable or performance. Rejection must be accompanied by specific written reasons.

CURE PERIOD FOR DEFICIENT PERFORMANCE:
If any Party fails to perform their obligations in accordance with this Agreement, the non-performing Party shall have 30 days (or such other period as may be specified) to cure such deficiency after receiving written notice of the deficiency.

ONGOING OBLIGATIONS:
Some obligations under this Agreement may be ongoing or continuing in nature. The Parties acknowledge their commitment to fulfill such ongoing obligations for the duration specified in this Agreement.`;
  }

  private generateDefaultAndEnforcement(input: SettlementAgreementUserInput): string {
    const liquidatedDamagesText = input.liquidatedDamages ? `\n\nLiquidated Damages: ${input.liquidatedDamages}` : '';
    const specificPerformanceText = input.specificPerformanceRights ? `\n\nSpecific Performance Rights: ${input.specificPerformanceRights}` : '';
    const accelerationText = input.accelerationClauses ? `\n\nAcceleration Clauses: ${input.accelerationClauses}` : '';

    return `DEFAULT CONDITIONS:
${input.defaultConsequences}

BREACH REMEDY PROCEDURES:
${input.breachRemedyProcedures}

ENFORCEMENT MECHANISMS:
${input.enforcementMechanisms}${liquidatedDamagesText}${specificPerformanceText}${accelerationText}

MATERIAL BREACH:
A material breach of this Agreement shall include, but not be limited to:
1. Failure to make required payments when due
2. Breach of confidentiality provisions
3. Failure to perform material obligations within specified time periods
4. Any action that undermines the fundamental purpose of this Agreement

NOTICE OF DEFAULT:
Before pursuing any remedies for breach, the non-breaching Party shall provide written notice of the alleged breach to the breaching Party, specifying the nature of the breach and the action required to cure such breach.

CURE PERIOD:
Except in cases of material breach involving payment obligations or confidentiality, the breaching Party shall have thirty (30) days from receipt of notice to cure the breach. Payment breaches must be cured within ten (10) days of notice.

REMEDIES FOR BREACH:
In addition to any other remedies available at law or in equity, the non-breaching Party may pursue:
1. Specific performance of the breached obligations
2. Monetary damages, including consequential damages
3. Injunctive relief to prevent ongoing breaches
4. Recovery of reasonable attorney fees and costs
5. Termination of this Agreement

EQUITABLE RELIEF:
The Parties acknowledge that certain breaches (particularly of confidentiality provisions) may cause irreparable harm for which monetary damages may be inadequate. Therefore, the non-breaching Party shall be entitled to seek equitable relief, including injunctive relief, without the necessity of proving inadequacy of legal remedies or posting bond.

WAIVER OF BREACH:
No waiver of any breach shall constitute a waiver of any subsequent breach. All waivers must be in writing and signed by the Party against whom the waiver is sought to be enforced.

ENFORCEMENT JURISDICTION:
All enforcement actions shall be brought in the courts of competent jurisdiction in Kenya, and the Parties consent to the jurisdiction of such courts for purposes of enforcement.`;
  }

  private generateGeneralProvisions(input: SettlementAgreementUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const jurisdiction = input.jurisdiction || 'Courts of Kenya';
    const legalCostsText = input.legalCosts ? `\n\nLegal Costs: ${input.legalCosts}` : '\n\nLegal Costs: Each Party shall bear their own legal costs and expenses incurred in connection with this Agreement, except as otherwise provided for enforcement actions.';
    const attorneyFeesText = input.attorneyFeesAllocation ? `\n\nAttorney Fees: ${input.attorneyFeesAllocation}` : '';
    const executionText = input.executionRequirements ? `\n\nExecution Requirements: ${input.executionRequirements}` : '';
    const effectivenessText = input.effectivenessConditions ? `\n\nEffectiveness Conditions: ${input.effectivenessConditions}` : '';
    const approvalText = input.approvalRequirements ? `\n\nApproval Requirements: ${input.approvalRequirements}` : '';
    const courtApprovalText = input.courtApprovalRequired === 'yes' ? '\n\nCourt Approval: This Agreement requires court approval to become effective.' : '';
    const entireAgreementText = input.entireAgreementClause || 'This Agreement constitutes the entire agreement between the Parties and supersedes all prior negotiations, representations, and agreements relating to the subject matter hereof.';
    const amendmentText = input.amendmentProcedures || 'This Agreement may only be amended by written agreement signed by all Parties.';
    const severabilityText = input.severabilityProvisions || 'If any provision of this Agreement is held invalid or unenforceable, the remainder shall continue in full force and effect.';
    const successorText = input.successorObligations || 'This Agreement shall be binding upon and inure to the benefit of the Parties and their respective heirs, successors, and assigns.';
    const noticeText = input.noticeRequirements || 'All notices shall be in writing and delivered personally, by registered mail, or by email to the addresses specified herein.';
    const interpretationText = input.interpretationRules || 'This Agreement shall be interpreted fairly and reasonably, without presumption for or against any Party.';

    const futureDisputeText = input.futureDisputeResolution ? `\n\nFuture Dispute Resolution: ${input.futureDisputeResolution}` : '';
    const mediationText = input.mediationRequirements ? `\n\nMediation Requirements: ${input.mediationRequirements}` : '';
    const arbitrationText = input.arbitrationProvisions ? `\n\nArbitration Provisions: ${input.arbitrationProvisions}` : '';

    return `GOVERNING LAW:
This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}.

JURISDICTION:
The Parties consent to the exclusive jurisdiction of ${jurisdiction} for any legal proceedings arising out of or relating to this Agreement.${legalCostsText}${attorneyFeesText}${executionText}${effectivenessText}${approvalText}${courtApprovalText}${futureDisputeText}${mediationText}${arbitrationText}

ENTIRE AGREEMENT:
${entireAgreementText}

AMENDMENT:
${amendmentText}

SEVERABILITY:
${severabilityText}

BINDING EFFECT:
${successorText}

NOTICES:
${noticeText}

INTERPRETATION:
${interpretationText}

COUNTERPARTS:
This Agreement may be executed in counterparts, including electronic signatures, each of which shall be deemed an original and all of which together shall constitute one and the same instrument.

VOLUNTARY EXECUTION:
Each Party acknowledges that they have entered into this Agreement voluntarily, with full knowledge of its terms, and with the benefit of legal counsel or the opportunity to obtain legal counsel.

NO DURESS:
No Party has been subjected to duress, coercion, or undue influence in entering into this Agreement. Each Party has had adequate time to review and consider the terms of this Agreement.

AUTHORITY:
Each Party represents and warrants that they have the full legal capacity and authority to enter into this Agreement and that the execution of this Agreement has been duly authorized.

EFFECTIVE DATE:
This Agreement shall become effective upon execution by all Parties or on ${input.effectiveDate || 'the last date of signature by any Party'}, whichever is later.

COMPLIANCE WITH LAW:
The Parties agree to comply with all applicable laws and regulations in the performance of their obligations under this Agreement.`;
  }

  private generateSignatures(input: SettlementAgreementUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = input.disputeParty1Name || (input as any).party1Name || 'Party 1';
    const party1Address = input.disputeParty1Address || (input as any).party1Address || 'Address not provided';
    const party2Name = input.disputeParty2Name || (input as any).party2Name || 'Party 2';
    const party2Address = input.disputeParty2Address || (input as any).party2Address || 'Address not provided';

    const additionalPartiesSignature = input.additionalParties ? `

ADDITIONAL PARTIES:

${input.additionalParties}

_______________________
Signature
Date: _______________` : '';

    return `IN WITNESS WHEREOF, the Parties have executed this Settlement Agreement on ${input.effectiveDate || '_____________'}.

FIRST PARTY:

_______________________
${party1Name}
Address: ${party1Address}
Date: _______________

SECOND PARTY:

_______________________
${party2Name}
Address: ${party2Address}
Date: _______________${additionalPartiesSignature}

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

LEGAL REPRESENTATIVES (if applicable):

Legal Representative for First Party:
_______________________
Name: ${input.disputeParty1LegalRep || '_________________'}
Law Firm: _______________
Date: _______________

Legal Representative for Second Party:
_______________________
Name: ${input.disputeParty2LegalRep || '_________________'}
Law Firm: _______________
Date: _______________

ACKNOWLEDGMENT:

We, the undersigned, acknowledge that:
1. We have read and understood the terms of this Settlement Agreement
2. We have received independent legal advice or waived the right to such advice
3. We enter into this Agreement voluntarily and without duress
4. This Agreement represents a complete and final resolution of the dispute
5. We agree to comply with all terms and conditions set forth herein

NOTARIZATION (if required):

SWORN before me this _____ day of __________, 20_____.

_______________________
Commissioner for Oaths/Notary Public
My commission expires: _______________`;
  }
}