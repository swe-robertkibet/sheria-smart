import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { MediationAgreementUserInput, GeneratedMediationAgreementContent } from '../../types/documents/litigation/mediation-agreement';

export class MediationAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'MEDIATION AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as MediationAgreementUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = (input.party1Name || 'Party1').replace(/[^a-zA-Z0-9]/g, '_');
    const party2Name = (input.party2Name || 'Party2').replace(/[^a-zA-Z0-9]/g, '_');
    return `Mediation_Agreement_${party1Name}_${party2Name}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as MediationAgreementUserInput;
    const partyInfo: string[] = [];

    // Party 1 Information
    partyInfo.push('Party 1 Information:');
    partyInfo.push(`Name: ${input.party1Name || 'Party 1'}`);
    partyInfo.push(`Address: ${input.party1Address || 'Address not provided'}`);
    if (input.party1Email) {
      partyInfo.push(`Email: ${input.party1Email}`);
    }
    if (input.party1Phone) {
      partyInfo.push(`Phone: ${input.party1Phone}`);
    }
    if (input.party1LegalRep) {
      partyInfo.push(`Legal Representative: ${input.party1LegalRep}`);
      if (input.party1LegalRepFirm) {
        partyInfo.push(`Law Firm: ${input.party1LegalRepFirm}`);
      }
      if (input.party1LegalRepAddress) {
        partyInfo.push(`Legal Rep Address: ${input.party1LegalRepAddress}`);
      }
    }
    partyInfo.push('');

    // Party 2 Information
    partyInfo.push('Party 2 Information:');
    partyInfo.push(`Name: ${input.party2Name || 'Party 2'}`);
    partyInfo.push(`Address: ${input.party2Address || 'Address not provided'}`);
    if (input.party2Email) {
      partyInfo.push(`Email: ${input.party2Email}`);
    }
    if (input.party2Phone) {
      partyInfo.push(`Phone: ${input.party2Phone}`);
    }
    if (input.party2LegalRep) {
      partyInfo.push(`Legal Representative: ${input.party2LegalRep}`);
      if (input.party2LegalRepFirm) {
        partyInfo.push(`Law Firm: ${input.party2LegalRepFirm}`);
      }
      if (input.party2LegalRepAddress) {
        partyInfo.push(`Legal Rep Address: ${input.party2LegalRepAddress}`);
      }
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedMediationAgreementContent): DocumentSection[] {
    const input = userInput as unknown as MediationAgreementUserInput;
    
    return [
      {
        title: 'PARTIES AND BACKGROUND',
        content: generatedContent.partiesAndBackground || this.generatePartiesAndBackground(input)
      },
      {
        title: 'MEDIATION PROCESS DEFINITION',
        content: generatedContent.mediationProcessDefinition || this.generateMediationProcessDefinition(input)
      },
      {
        title: 'MEDIATOR SELECTION AND PROCEDURES',
        content: generatedContent.mediatorSelectionAndProcedures || this.generateMediatorSelectionAndProcedures(input)
      },
      {
        title: 'COST SHARING AND FINANCIAL TERMS',
        content: generatedContent.costSharingAndFinancialTerms || this.generateCostSharingAndFinancialTerms(input)
      },
      {
        title: 'CONFIDENTIALITY PROVISIONS',
        content: generatedContent.confidentialityProvisions || this.generateConfidentialityProvisions(input)
      },
      {
        title: 'GENERAL PROVISIONS AND SIGNATURES',
        content: generatedContent.generalProvisionsAndSignatures || this.generateGeneralProvisionsAndSignatures(input)
      }
    ];
  }

  private generatePartiesAndBackground(input: MediationAgreementUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = input.party1Name || 'Party 1';
    const party1Address = input.party1Address || 'Address not provided';
    const party2Name = input.party2Name || 'Party 2';
    const party2Address = input.party2Address || 'Address not provided';

    const disputeBackgroundText = input.disputeBackground ? `\n\nDispute Background: ${input.disputeBackground}` : '';
    const disputeValueText = input.disputeValue ? `\n\nDispute Value: ${input.disputeValue}` : '';
    const priorNegotiationText = input.priorNegotiationAttempts ? `\n\nPrior Negotiation Attempts: ${input.priorNegotiationAttempts}` : '';
    const urgencyText = input.urgencyFactors ? `\n\nUrgency Factors: ${input.urgencyFactors}` : '';

    return `This Mediation Agreement ("Agreement") is entered into between ${party1Name}, located at ${party1Address} ("First Party"), and ${party2Name}, located at ${party2Address} ("Second Party"), collectively referred to as the "Parties."

BACKGROUND AND CONTEXT:
The Parties have a dispute arising from ${input.disputeDescription}. Rather than pursuing formal litigation, the Parties have agreed to attempt resolution through mediation as provided for under the Alternative Dispute Resolution Act of Kenya and in accordance with internationally recognized mediation principles.${disputeBackgroundText}${disputeValueText}${priorNegotiationText}${urgencyText}

SUBJECT MATTER OF THE DISPUTE:
${input.disputeSubjectMatter || 'The specific matters in dispute are as described in the dispute description above.'}

COMMITMENT TO MEDIATION:
The Parties acknowledge their mutual commitment to engage in good faith mediation proceedings with the objective of reaching a mutually acceptable resolution. This Agreement represents their shared desire to avoid the costs, delays, and uncertainties associated with formal litigation.

LEGAL FRAMEWORK:
This mediation shall be conducted in accordance with the Alternative Dispute Resolution Act, 2015 of Kenya, the Civil Procedure Rules relating to court-connected mediation, and internationally recognized mediation standards and practices.

VOLUNTARY NATURE:
The Parties acknowledge that mediation is a voluntary process and that this Agreement to mediate does not guarantee resolution of their dispute. However, both Parties commit to participating in good faith with a genuine intention to explore settlement possibilities.`;
  }

  private generateMediationProcessDefinition(input: MediationAgreementUserInput): string {
    const objectivesText = input.mediationObjectives ? `\n\nMediation Objectives: ${input.mediationObjectives}` : '';
    const timelineText = input.mediationTimeline ? `\n\nTimeline: ${input.mediationTimeline}` : '';
    const venueText = input.mediationVenue ? `\n\nVenue: ${input.mediationVenue}` : '';
    const languageText = input.mediationLanguage ? `\n\nLanguage: ${input.mediationLanguage}` : '\n\nLanguage: The mediation shall be conducted in English unless otherwise agreed by all parties.';
    const schedulingText = input.sessionScheduling ? `\n\nSession Scheduling: ${input.sessionScheduling}` : '';
    const disclosureText = input.documentDisclosure ? `\n\nDocument Disclosure: ${input.documentDisclosure}` : '';
    const preparatoryText = input.preparatorySteps ? `\n\nPreparatory Steps: ${input.preparatorySteps}` : '';

    return `MEDIATION PROCEDURES:
${input.mediationProcedures}${objectivesText}${timelineText}${venueText}${languageText}${schedulingText}${disclosureText}${preparatoryText}

MEDIATION PROCESS STRUCTURE:
1. **Opening Session**: Joint session with all parties and the mediator to establish ground rules and process guidelines
2. **Information Gathering**: Exchange of relevant information and documentation as agreed by the parties
3. **Issue Identification**: Systematic identification and prioritization of issues in dispute
4. **Option Generation**: Collaborative exploration of potential solutions and settlement options
5. **Negotiation Phase**: Structured negotiation with mediator assistance in joint and separate sessions
6. **Documentation**: Recording of any agreements reached during the mediation process

GOOD FAITH PARTICIPATION:
Each Party agrees to:
• Participate in good faith with a genuine intention to resolve the dispute
• Attend all scheduled mediation sessions punctually and be prepared
• Be represented by persons with appropriate settlement authority
• Provide requested information and documentation in a timely manner
• Respect the mediation process and other participants
• Maintain a constructive and professional approach throughout

COMMUNICATION PROTOCOLS:
${input.communicationProtocol || 'All communications during mediation shall be through the mediator unless otherwise agreed. Direct party-to-party communication is encouraged when constructive and appropriate.'}

SETTLEMENT AUTHORITY:
${input.settlementAuthority || 'Each Party represents that their representative has full authority to settle the dispute or has immediate access to a person with such authority.'}

MEDIATION SESSIONS:
• Sessions shall be scheduled by mutual agreement of all parties and the mediator
• Each session shall normally be 3-4 hours unless otherwise agreed
• Parties may request separate (caucus) sessions with the mediator
• The mediator may adjourn sessions as necessary for effective process management

DOCUMENTATION AND RECORD KEEPING:
• No formal record or transcript shall be kept of mediation proceedings
• The mediator may take notes for process management purposes only
• Any agreements reached shall be documented in writing and signed by all parties
• Working documents and settlement proposals shall be returned or destroyed at mediation conclusion`;
  }

  private generateMediatorSelectionAndProcedures(input: MediationAgreementUserInput): string {
    const qualificationsText = input.mediatorQualifications ? `\n\nMediator Qualifications: ${input.mediatorQualifications}` : '';
    const appointmentText = input.mediatorAppointmentProcess ? `\n\nAppointment Process: ${input.mediatorAppointmentProcess}` : '';
    const challengeText = input.mediatorChallengeProcess ? `\n\nChallenge Process: ${input.mediatorChallengeProcess}` : '';
    const remunerationText = input.mediatorRemunerationRate ? `\n\nRemuneration: ${input.mediatorRemunerationRate}` : '';
    const alternativeText = input.alternativeMediatorProvisions ? `\n\nAlternative Mediator Provisions: ${input.alternativeMediatorProvisions}` : '';

    return `MEDIATOR SELECTION:
${input.mediatorSelection}${qualificationsText}${appointmentText}${challengeText}${remunerationText}${alternativeText}

MEDIATOR APPOINTMENT PROCEDURE:
1. **Mutual Agreement**: The parties shall first attempt to agree on a mediator within 14 days of signing this Agreement
2. **Institution Appointment**: If parties cannot agree, the mediator shall be appointed by the Chartered Institute of Arbitrators (Kenya Branch) or other agreed appointing authority
3. **Acceptance**: The appointed mediator must confirm acceptance and availability within 7 days of appointment
4. **Commencement**: Mediation shall commence within 30 days of mediator acceptance unless otherwise agreed

MEDIATOR QUALIFICATIONS AND REQUIREMENTS:
The mediator shall:
• Be qualified and experienced in commercial/civil mediation
• Have no conflict of interest with any party or the subject matter
• Be independent and impartial throughout the process
• Maintain strict confidentiality as required by this Agreement
• Possess appropriate professional indemnity insurance
• Have experience in matters similar to the dispute at hand

MEDIATOR DUTIES AND RESPONSIBILITIES:
The mediator shall:
• Facilitate communication and negotiation between the parties
• Assist parties in identifying issues and exploring settlement options
• Maintain impartiality and avoid advocacy for any party position
• Respect confidentiality and privacy requirements
• Manage the mediation process efficiently and professionally
• Not impose solutions but assist parties in reaching their own agreement

MEDIATOR DISQUALIFICATION:
The mediator shall be disqualified if:
• A conflict of interest is discovered or arises during mediation
• The mediator becomes unable to perform duties due to illness or other incapacity
• Any party reasonably demonstrates bias or partiality by the mediator
• The mediator breaches confidentiality or other material obligations

REPLACEMENT MEDIATOR:
If the original mediator becomes unavailable or is disqualified:
• The parties shall attempt to agree on a replacement within 7 days
• If no agreement, the same appointing authority shall appoint a replacement
• The replacement mediator shall be bound by all terms of this Agreement
• Mediation shall continue from the point of interruption unless otherwise agreed

MEDIATOR IMMUNITY:
The mediator shall have immunity from liability for any actions taken in good faith in the course of the mediation, except for willful misconduct or gross negligence.

MEDIATOR'S ROLE LIMITATIONS:
The mediator shall not:
• Provide legal advice to any party
• Act as an advocate for any party's position
• Make binding decisions or impose solutions
• Serve as a witness in any subsequent legal proceedings relating to the dispute
• Disclose confidential information learned during mediation`;
  }

  private generateCostSharingAndFinancialTerms(input: MediationAgreementUserInput): string {
    const feeAllocationText = input.mediatorFeeAllocation ? `\n\nMediator Fee Allocation: ${input.mediatorFeeAllocation}` : '';
    const venueCostsText = input.venueAndFacilityCosts ? `\n\nVenue and Facility Costs: ${input.venueAndFacilityCosts}` : '';
    const adminFeesText = input.administrativeFees ? `\n\nAdministrative Fees: ${input.administrativeFees}` : '';
    const paymentScheduleText = input.paymentSchedule ? `\n\nPayment Schedule: ${input.paymentSchedule}` : '';
    const currencyText = input.currency ? `\n\nCurrency: ${input.currency}` : '\n\nCurrency: All costs shall be paid in Kenya Shillings (KES) unless otherwise agreed.';

    return `COST SHARING ARRANGEMENTS:
${input.costSharing}${feeAllocationText}${venueCostsText}${adminFeesText}${paymentScheduleText}${currencyText}

MEDIATION COSTS BREAKDOWN:
The following costs shall be shared as specified above:
1. **Mediator Fees**: Professional fees for mediation services
2. **Administrative Costs**: Appointment and administrative fees if using an institution
3. **Venue Costs**: Room rental and facility charges for mediation sessions
4. **Document Preparation**: Costs for preparing and copying documents for mediation
5. **Travel Expenses**: If applicable, reasonable travel costs for mediator or parties
6. **Technology Costs**: Video conferencing or other technology platform fees

PAYMENT RESPONSIBILITIES:
• Each party shall be responsible for their own legal representation costs
• Shared costs shall be paid in advance or as invoiced by the mediator/institution
• Payment terms shall be net 30 days unless otherwise agreed
• Failure to pay shared costs may result in suspension of mediation proceedings
• Final accounting shall be provided at the conclusion of mediation

ADVANCE PAYMENT REQUIREMENTS:
The parties may be required to make advance payments to cover estimated mediation costs:
• Initial deposit may be required before commencement of mediation
• Additional deposits may be requested during the process if costs exceed initial estimates
• Unused deposits shall be refunded at the conclusion of mediation
• Parties shall receive detailed accounting of all costs incurred

COST VARIATIONS:
If the mediation extends beyond initially estimated timeframes or requires additional services:
• Parties shall be notified of additional costs in advance
• Consent of both parties required for significant cost increases
• Emergency or urgent additional costs may be incurred with single party approval

CANCELLATION AND POSTPONEMENT COSTS:
• Cancellation with less than 48 hours notice may result in cancellation fees
• Postponement costs shall be borne by the party requesting postponement
• Multiple postponements may result in additional administrative charges

UNSUCCESSFUL MEDIATION COSTS:
Even if mediation does not result in settlement:
• All mediation costs remain payable as specified in this Agreement
• No party shall be liable for the other party's legal or internal costs
• Shared costs allocation remains unchanged regardless of outcome

COST DISPUTES:
Any disputes regarding costs or payment obligations:
• Shall first be addressed directly with the mediator or appointing institution
• May be subject to expedited determination by the mediator
• Shall not prevent continuation of mediation proceedings unless payment is substantially in arrears

FINANCIAL RESPONSIBILITY:
Each party warrants that they have adequate financial resources to meet their cost-sharing obligations under this Agreement and will not default on payment responsibilities.`;
  }

  private generateConfidentialityProvisions(input: MediationAgreementUserInput): string {
    const levelText = input.confidentialityLevel === 'strict' ? 'Strict confidentiality applies to all aspects of the mediation.' 
                    : input.confidentialityLevel === 'limited' ? 'Limited confidentiality applies with specified exceptions.'
                    : 'Standard confidentiality provisions apply as set forth below.';
    
    const scopeText = input.confidentialityScope ? `\n\nConfidentiality Scope: ${input.confidentialityScope}` : '';
    const exceptionsText = input.confidentialityExceptions ? `\n\nExceptions: ${input.confidentialityExceptions}` : '';
    const documentProtectionText = input.documentProtection ? `\n\nDocument Protection: ${input.documentProtection}` : '';
    const mediatorRestrictionsText = input.mediatorDisclosureRestrictions ? `\n\nMediator Disclosure Restrictions: ${input.mediatorDisclosureRestrictions}` : '';

    return `CONFIDENTIALITY AND NON-DISCLOSURE:
${input.confidentialityProvisions}

CONFIDENTIALITY LEVEL:
${levelText}${scopeText}${exceptionsText}${documentProtectionText}${mediatorRestrictionsText}

SCOPE OF CONFIDENTIAL INFORMATION:
The following shall be treated as confidential:
1. **Mediation Communications**: All statements, admissions, and communications made during mediation
2. **Settlement Offers**: All offers, proposals, and counter-proposals made during mediation
3. **Mediator Communications**: All communications with the mediator in joint or separate sessions
4. **Working Documents**: All documents prepared specifically for mediation purposes
5. **Process Information**: The fact that mediation occurred and details of the process
6. **Outcome Information**: Results of mediation, whether successful or unsuccessful

PERMITTED DISCLOSURES:
Notwithstanding confidentiality provisions, disclosure is permitted:
• As required by law or court order after proper legal challenge
• To legal advisors and other professional consultants (under confidentiality)
• For enforcement of any settlement agreement reached
• To obtain approval from corporate boards or other necessary entities
• For tax or regulatory compliance purposes
• With written consent of all parties to the mediation

INADMISSIBILITY AND NON-USE:
• Mediation communications shall not be admissible in any subsequent legal proceedings
• No party may rely on statements made during mediation in future litigation
• Settlement offers made during mediation cannot be used as admissions in court
• Mediator cannot be compelled to testify about mediation proceedings
• Working documents from mediation shall not be discoverable in litigation

MEDIATOR CONFIDENTIALITY OBLIGATIONS:
The mediator shall:
• Maintain strict confidentiality of all mediation communications
• Not disclose information learned in separate sessions without permission
• Not use confidential information for any purpose other than conducting mediation
• Destroy notes and working documents after completion of mediation
• Decline to serve as witness in any related legal proceedings

DURATION OF CONFIDENTIALITY:
Confidentiality obligations shall:
• Commence upon execution of this Agreement
• Continue indefinitely after completion or termination of mediation
• Survive any settlement agreement or subsequent legal proceedings
• Apply to successors, assigns, employees, and agents of the parties
• Remain in effect regardless of the outcome of mediation

BREACH OF CONFIDENTIALITY:
Breach of confidentiality provisions:
• Constitutes a material breach of this Agreement
• May result in immediate termination of mediation proceedings
• Entitles non-breaching parties to seek injunctive relief
• May result in liability for damages caused by the breach
• Does not waive confidentiality as to other matters

ENFORCEMENT OF CONFIDENTIALITY:
• Confidentiality provisions are specifically enforceable
• Courts of Kenya shall have jurisdiction to enforce confidentiality
• Injunctive relief may be sought without posting bond
• Prevailing party in confidentiality enforcement may recover legal costs
• Emergency relief may be sought if immediate harm is threatened

RETURN OF CONFIDENTIAL MATERIALS:
Upon completion or termination of mediation:
• All confidential documents shall be returned or destroyed as directed
• Electronic copies shall be permanently deleted
• Notes and working documents shall be destroyed unless needed for settlement implementation
• Confirmation of destruction may be required if requested by any party

THIRD PARTY OBLIGATIONS:
Any third parties involved in mediation (experts, advisors, interpreters) shall:
• Be bound by the same confidentiality obligations
• Sign separate confidentiality agreements if required
• Be informed of confidentiality requirements before participation
• Be subject to the same enforcement provisions as the parties`;
  }

  private generateGeneralProvisionsAndSignatures(input: MediationAgreementUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const jurisdiction = input.jurisdiction || 'Courts of Kenya';
    const amendmentText = input.amendmentProcedures || 'This Agreement may only be amended by written agreement signed by all parties.';
    const forceeMajeureText = input.forceeMajeureProvisions || 'Neither party shall be liable for delays caused by circumstances beyond their reasonable control.';
    const noticeText = input.noticeRequirements || 'All notices shall be in writing and delivered personally, by registered mail, or by email to the addresses specified herein.';
    
    const terminationText = input.terminationConditions ? `\n\nTermination Conditions: ${input.terminationConditions}` : '';
    const terminationNoticeText = input.terminationNoticeRequirements ? `\n\nTermination Notice: ${input.terminationNoticeRequirements}` : '';
    const unsuccessfulText = input.unsuccessfulMediationConsequences ? `\n\nUnsuccessful Mediation Consequences: ${input.unsuccessfulMediationConsequences}` : '';
    const alternativeText = input.alternativeDisputeResolution ? `\n\nAlternative Dispute Resolution: ${input.alternativeDisputeResolution}` : '';
    const courtRestrictionsText = input.courtProceedingsRestrictions ? `\n\nCourt Proceedings Restrictions: ${input.courtProceedingsRestrictions}` : '';
    
    const mediationRulesText = input.mediationRules === 'ciarb_rules' ? '\n\nMediation Rules: This mediation shall be conducted under CIArb (Kenya) Rules.'
                             : input.mediationRules === 'ncia_rules' ? '\n\nMediation Rules: This mediation shall be conducted under NCIA Mediation Rules.'
                             : input.mediationRules === 'uncitral_conciliation' ? '\n\nMediation Rules: This mediation shall be conducted under UNCITRAL Conciliation Rules.'
                             : input.mediationRules === 'custom_rules' ? `\n\nMediation Rules: ${input.customRulesDescription || 'Custom rules as agreed by the parties.'}`
                             : '\n\nMediation Rules: This mediation shall be conducted as an ad hoc mediation under general mediation principles.';

    const commencementText = input.mediationCommencementDate ? `\n\nMediation Commencement: ${input.mediationCommencementDate}` : '';
    const bindingSettlementText = input.bindingSettlementProcess ? `\n\nBinding Settlement Process: ${input.bindingSettlementProcess}` : '';
    const partialSettlementText = input.partialSettlementProvisions ? `\n\nPartial Settlement Provisions: ${input.partialSettlementProvisions}` : '';
    const implementationText = input.implementationProcedures ? `\n\nImplementation Procedures: ${input.implementationProcedures}` : '';
    const postMediationText = input.postMediationObligations ? `\n\nPost-Mediation Obligations: ${input.postMediationObligations}` : '';

    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = input.party1Name || 'Party 1';
    const party1Address = input.party1Address || 'Address not provided';
    const party2Name = input.party2Name || 'Party 2';
    const party2Address = input.party2Address || 'Address not provided';

    return `GOVERNING LAW AND JURISDICTION:
This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}. The courts of ${jurisdiction} shall have exclusive jurisdiction over any matters not resolved through mediation.${mediationRulesText}

LEGAL FRAMEWORK COMPLIANCE:
This mediation is conducted in compliance with:
• Alternative Dispute Resolution Act, 2015 of Kenya
• Civil Procedure Rules relating to court-connected ADR
• International mediation standards and best practices
• Professional mediation ethics and conduct standards

MEDIATION AGREEMENT TERMS:${terminationText}${terminationNoticeText}${unsuccessfulText}${alternativeText}${courtRestrictionsText}${commencementText}${bindingSettlementText}${partialSettlementText}${implementationText}${postMediationText}

TERMINATION OF MEDIATION:
Mediation may be terminated:
• By mutual agreement of all parties
• By declaration of impasse by the mediator
• By withdrawal of any party with appropriate notice
• If settlement agreement is reached and executed
• By failure to comply with material provisions of this Agreement

POST-MEDIATION PROCEDURES:
If mediation is unsuccessful:
• Parties are free to pursue other dispute resolution methods
• All confidentiality obligations remain in full force
• No statements made during mediation may be used in subsequent proceedings
• Parties may agree to further alternative dispute resolution processes

SETTLEMENT AGREEMENT:
If settlement is reached during mediation:
• Terms shall be documented in a binding settlement agreement
• All parties must sign the settlement agreement for it to be effective
• Settlement agreement shall be governed by general contract law principles
• Implementation procedures shall be specified in the settlement agreement

AMENDMENT AND MODIFICATION:
${amendmentText}

FORCE MAJEURE:
${forceeMajeureText}

NOTICES:
${noticeText}

ENTIRE AGREEMENT:
This Agreement constitutes the entire agreement between the parties regarding mediation of their dispute and supersedes all prior negotiations and agreements relating to mediation.

SEVERABILITY:
If any provision of this Agreement is held invalid or unenforceable, the remainder shall continue in full force and effect.

BINDING EFFECT:
This Agreement shall be binding upon and inure to the benefit of the parties and their respective heirs, successors, and assigns.

EXECUTION:
This Agreement may be executed in counterparts, including electronic signatures, each of which shall be deemed an original.

AUTHORITY:
Each party represents that they have full authority to enter into this Agreement and to participate in mediation.

EFFECTIVE DATE:
This Agreement becomes effective on ${input.effectiveDate || 'the date of execution by all parties'}.

IN WITNESS WHEREOF, the parties have executed this Mediation Agreement on ${input.effectiveDate || '_____________'}.

FIRST PARTY:

_______________________
${party1Name}
Address: ${party1Address}
Date: _______________

SECOND PARTY:

_______________________
${party2Name}
Address: ${party2Address}
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
Date: _______________

LEGAL REPRESENTATIVES (if applicable):

Legal Representative for First Party:
_______________________
Name: ${input.party1LegalRep || '_________________'}
Law Firm: ${input.party1LegalRepFirm || '_______________'}
Date: _______________

Legal Representative for Second Party:
_______________________
Name: ${input.party2LegalRep || '_________________'}
Law Firm: ${input.party2LegalRepFirm || '_______________'}
Date: _______________

ACKNOWLEDGMENT:

We, the undersigned, acknowledge that:
1. We have read and understood the terms of this Mediation Agreement
2. We enter into this Agreement voluntarily and in good faith
3. We commit to participating constructively in the mediation process
4. We understand our rights and obligations under this Agreement
5. We have received independent legal advice or waived the right to such advice

${input.notarizationRequirements === 'yes' ? `
NOTARIZATION:

SWORN before me this _____ day of __________, 20_____.

_______________________
Commissioner for Oaths/Notary Public
My commission expires: _______________` : ''}`;
  }
}