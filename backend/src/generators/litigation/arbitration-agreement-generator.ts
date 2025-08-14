import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { ArbitrationAgreementUserInput, GeneratedArbitrationAgreementContent } from '../../types/documents/litigation/arbitration-agreement';

export class ArbitrationAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'ARBITRATION AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as ArbitrationAgreementUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const party1Name = (input.party1Name || 'Party1').replace(/[^a-zA-Z0-9]/g, '_');
    const party2Name = (input.party2Name || 'Party2').replace(/[^a-zA-Z0-9]/g, '_');
    return `Arbitration_Agreement_${party1Name}_${party2Name}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as ArbitrationAgreementUserInput;
    const partyInfo: string[] = [];

    // Party 1 Information
    partyInfo.push('Party 1 Information:');
    partyInfo.push(`Name: ${input.party1Name || 'Party 1'}`);
    partyInfo.push(`Address: ${input.party1Address || 'Address not provided'}`);
    partyInfo.push(`Email: ${input.party1Email || 'Email not provided'}`);
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
    partyInfo.push(`Email: ${input.party2Email || 'Email not provided'}`);
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

    // Additional Parties (if applicable)
    if (input.additionalParties) {
      partyInfo.push('Additional Parties:');
      partyInfo.push(input.additionalParties);
      partyInfo.push('');
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedArbitrationAgreementContent): DocumentSection[] {
    const input = userInput as unknown as ArbitrationAgreementUserInput;
    
    return [
      {
        title: 'PARTIES AND AGREEMENT SCOPE',
        content: generatedContent.partiesAndScope || this.generatePartiesAndScope(input)
      },
      {
        title: 'ARBITRATION CLAUSE DEFINITION',
        content: generatedContent.arbitrationClause || this.generateArbitrationClause(input)
      },
      {
        title: 'ARBITRATOR SELECTION AND APPOINTMENT',
        content: generatedContent.arbitratorSelection || this.generateArbitratorSelection(input)
      },
      {
        title: 'PROCEDURAL PROVISIONS',
        content: generatedContent.proceduralProvisions || this.generateProceduralProvisions(input)
      },
      {
        title: 'APPLICABLE LAW AND JURISDICTION',
        content: generatedContent.legalFramework || this.generateLegalFramework(input)
      },
      {
        title: 'COSTS AND FEES',
        content: generatedContent.costsAndFees || this.generateCostsAndFees(input)
      },
      {
        title: 'CONFIDENTIALITY PROVISIONS',
        content: generatedContent.confidentialityProvisions || this.generateConfidentialityProvisions(input)
      },
      {
        title: 'ENFORCEMENT AND SIGNATURES',
        content: generatedContent.enforcementAndSignatures || this.generateEnforcementAndSignatures(input)
      }
    ];
  }

  private generatePartiesAndScope(input: ArbitrationAgreementUserInput): string {
    const party1Name = input.party1Name || 'Party 1';
    const party1Address = input.party1Address || 'Address not provided';
    const party2Name = input.party2Name || 'Party 2';
    const party2Address = input.party2Address || 'Address not provided';

    const additionalPartiesText = input.additionalParties ? `\n\nAdditional Parties: ${input.additionalParties}` : '';
    const contractualBasisText = input.contractualBasis ? `\n\nContractual Basis: ${input.contractualBasis}` : '';

    const agreementTypeText = input.agreementType === 'clause' ? 
      'This arbitration clause forms part of a larger contractual agreement.' : 
      'This is a separate arbitration agreement between the parties.';

    return `This Arbitration Agreement ("Agreement") is entered into between ${party1Name}, located at ${party1Address} ("First Party"), and ${party2Name}, located at ${party2Address} ("Second Party"), collectively referred to as the "Parties."${additionalPartiesText}

AGREEMENT FORM:
${agreementTypeText}${contractualBasisText}

LEGAL RELATIONSHIP:
${input.legalRelationshipContext}

DISPUTE SCOPE:
The parties agree that any dispute, controversy, or claim ${this.getDisputeCoverageText(input.disputeCoverage)} shall be resolved exclusively through binding arbitration in accordance with this Agreement and the laws of the Republic of Kenya.

${input.specificMattersDescription ? `SPECIFIC MATTERS COVERED:\n${input.specificMattersDescription}` : ''}

EXCLUSION OF COURTS:
The parties waive their right to pursue disputes covered by this Agreement in any court of law, except for the enforcement of arbitral awards or interim measures as specifically provided herein.

KENYA ARBITRATION ACT COMPLIANCE:
This Agreement is executed in accordance with the Arbitration Act No. 4 of 1995 (as amended) of the Republic of Kenya and incorporates the principles of the UNCITRAL Model Law on International Commercial Arbitration.`;
  }

  private getDisputeCoverageText(coverage: string): string {
    switch (coverage) {
      case 'arising_from_contract':
        return 'arising out of or in connection with this contract';
      case 'arising_or_may_arise':
        return 'arising or which may arise between the parties';
      case 'all_disputes':
        return 'of any kind between the parties';
      case 'specific_matters':
        return 'relating to the specific matters described herein';
      default:
        return 'arising between the parties';
    }
  }

  private generateArbitrationClause(input: ArbitrationAgreementUserInput): string {
    const rulesText = this.getArbitrationRulesText(input.arbitrationRules, input.customRulesDescription);
    const institutionText = input.institutionalAdministration === 'yes' ? 
      '\n\nINSTITUTIONAL ADMINISTRATION:\nThis arbitration shall be administered by the designated arbitral institution.' : 
      '\n\nAD HOC ARBITRATION:\nThis arbitration shall be conducted on an ad hoc basis without institutional administration.';
    
    const appointingAuthorityText = input.appointingAuthority ? 
      `\n\nAPPOINTING AUTHORITY:\n${input.appointingAuthority}` : '';

    return `ARBITRATION RULES:
${rulesText}${institutionText}${appointingAuthorityText}

ARBITRATION CLAUSE:
Any dispute, controversy, or claim ${this.getDisputeCoverageText(input.disputeCoverage)} shall be settled by arbitration. The arbitration shall be conducted in accordance with the rules specified above.

BINDING NATURE:
The parties agree that the arbitral award shall be final and binding upon them and may be enforced in any court of competent jurisdiction.

ARBITRATION AGREEMENT VALIDITY:
This arbitration agreement shall remain valid and enforceable even if the main contract (if any) is found to be invalid, void, or terminated. The arbitration agreement is separable from the main contract.

WAIVER OF JURY TRIAL:
The parties hereby waive any right to trial by jury with respect to any matter covered by this arbitration agreement.

SCOPE OF ARBITRAL AUTHORITY:
The arbitral tribunal shall have the authority to:
• Determine its own jurisdiction and the validity of this arbitration agreement
• Grant interim measures of protection
• Award monetary damages and equitable relief
• Allocate costs and fees as provided herein
• Issue a reasoned award in writing`;
  }

  private getArbitrationRulesText(rules: string, customDescription?: string): string {
    switch (rules) {
      case 'ncia_rules':
        return 'The arbitration shall be conducted in accordance with the Rules of the Nairobi Centre for International Arbitration (NCIA).';
      case 'ad_hoc':
        return 'The arbitration shall be conducted on an ad hoc basis in accordance with the UNCITRAL Arbitration Rules.';
      case 'icc_rules':
        return 'The arbitration shall be conducted in accordance with the Rules of Arbitration of the International Chamber of Commerce (ICC).';
      case 'lcia_rules':
        return 'The arbitration shall be conducted in accordance with the London Court of International Arbitration (LCIA) Rules.';
      case 'uncitral_rules':
        return 'The arbitration shall be conducted in accordance with the UNCITRAL Arbitration Rules.';
      case 'custom_rules':
        return customDescription || 'The arbitration shall be conducted in accordance with custom rules as agreed by the parties.';
      default:
        return 'The arbitration shall be conducted in accordance with the applicable arbitration rules.';
    }
  }

  private generateArbitratorSelection(input: ArbitrationAgreementUserInput): string {
    const emergencyArbitratorText = input.emergencyArbitratorProvision === 'yes' ? 
      `\n\nEMERGENCY ARBITRATOR:\nThe parties agree to the appointment of an emergency arbitrator for urgent interim measures.\n\nEmergency Procedures: ${input.emergencyArbitratorProcedures || 'As provided in the applicable arbitration rules.'}` : '';

    const challengeText = input.arbitratorChallengeProcess ? 
      `\n\nARBITRATOR CHALLENGE:\n${input.arbitratorChallengeProcess}` : '';

    const nationalityText = input.arbitratorNationalityRestrictions ? 
      `\n\nNATIONALITY RESTRICTIONS:\n${input.arbitratorNationalityRestrictions}` : '';

    const expertiseText = input.arbitratorExpertiseRequired ? 
      `\n\nEXPERTISE REQUIREMENTS:\n${input.arbitratorExpertiseRequired}` : '';

    return `NUMBER OF ARBITRATORS:
${this.getArbitratorNumberText(input.numberOfArbitrators)}

ARBITRATOR QUALIFICATIONS:
${input.arbitratorQualifications}

SELECTION METHOD:
${input.arbitratorSelectionMethod}

APPOINTMENT PROCESS:
${input.arbitratorAppointmentProcess}

INDEPENDENCE AND IMPARTIALITY:
${input.arbitratorIndependenceRequirements}

All arbitrators must be and remain independent and impartial throughout the proceedings. Any potential conflicts of interest must be disclosed immediately upon discovery.${challengeText}${nationalityText}${expertiseText}${emergencyArbitratorText}

DEFAULT APPOINTMENT PROCEDURE:
If the parties fail to agree on the appointment of arbitrators within the specified time limits, the appointment shall be made in accordance with the applicable arbitration rules or by the designated appointing authority.

ARBITRATOR REMUNERATION:
Arbitrator fees and expenses shall be determined in accordance with the applicable arbitration rules or as agreed by the parties and the tribunal.`;
  }

  private getArbitratorNumberText(number: string): string {
    switch (number) {
      case '1':
        return 'The arbitration shall be conducted by a sole arbitrator.';
      case '3':
        return 'The arbitration shall be conducted by a tribunal of three (3) arbitrators.';
      case 'parties_to_agree':
        return 'The number of arbitrators shall be determined by agreement between the parties.';
      default:
        return 'The number of arbitrators shall be as agreed by the parties.';
    }
  }

  private generateProceduralProvisions(input: ArbitrationAgreementUserInput): string {
    const venueText = input.arbitrationVenue ? `\n\nHEARING VENUE:\n${input.arbitrationVenue}` : '';
    const timelineText = input.timelineLimitations ? `\n\nTIMELINE LIMITATIONS:\n${input.timelineLimitations}` : '';
    const evidenceText = input.evidenceRules ? `\n\nEVIDENCE RULES:\n${input.evidenceRules}` : '';
    const discoveryText = this.getDocumentDiscoveryText(input.documentDiscovery);
    const witnessText = this.getWitnessExaminationText(input.witnessExamination);
    const expertText = input.expertWitnessRights === 'yes' ? 
      `\n\nEXPERT WITNESSES:\nParties have the right to present expert witness testimony.\n\nExpert Procedures: ${input.expertWitnessProcedures || 'As determined by the tribunal.'}` : '';
    const interimText = input.interimMeasuresRights === 'yes' ? 
      `\n\nINTERIM MEASURES:\nThe tribunal has the authority to grant interim measures of protection.\n\nInterim Procedures: ${input.interimMeasuresProcedures || 'As provided in the applicable arbitration rules.'}` : '';
    
    const translationText = input.translationRequirements ? `\n\nTRANSLATION REQUIREMENTS:\n${input.translationRequirements}` : '';
    const scheduleText = input.proceduralSchedule ? `\n\nPROCEDURAL SCHEDULE:\n${input.proceduralSchedule}` : '';

    return `SEAT OF ARBITRATION:
The juridical seat of the arbitration shall be ${input.arbitrationSeat}.${venueText}

LANGUAGE OF PROCEEDINGS:
The arbitration proceedings shall be conducted in ${input.procedureLanguage}.

Document Language: ${input.documentSubmissionLanguage || input.procedureLanguage}${translationText}${timelineText}${scheduleText}${evidenceText}${discoveryText}${witnessText}${expertText}${interimText}

HEARING PROCEDURES:
• Hearings may be conducted in person, by video conference, or by telephone as determined by the tribunal
• The tribunal shall determine the format and duration of hearings
• Parties have the right to be represented by counsel of their choice
• All proceedings shall be recorded as determined by the tribunal

PROCEDURAL ORDERS:
The tribunal may issue procedural orders to ensure the efficient conduct of the arbitration, including:
• Scheduling of proceedings
• Exchange of written submissions
• Production of documents and evidence
• Examination of witnesses
• Site inspections if necessary

EMERGENCY PROCEDURES:
In cases of urgency, the tribunal (or emergency arbitrator if applicable) may issue emergency orders to preserve the status quo or prevent irreparable harm pending the constitution of the full tribunal.`;
  }

  private getDocumentDiscoveryText(discovery?: string): string {
    if (!discovery) return '';
    
    switch (discovery) {
      case 'limited':
        return '\n\nDOCUMENT DISCOVERY:\nDocument production shall be limited to documents that are relevant and material to the dispute.';
      case 'extensive':
        return '\n\nDOCUMENT DISCOVERY:\nBroad document discovery shall be permitted as determined by the tribunal.';
      case 'none':
        return '\n\nDOCUMENT DISCOVERY:\nNo document discovery shall be permitted except as specifically ordered by the tribunal.';
      default:
        return '';
    }
  }

  private getWitnessExaminationText(examination?: string): string {
    if (!examination) return '';
    
    switch (examination) {
      case 'written_only':
        return '\n\nWITNESS EXAMINATION:\nWitness testimony shall be submitted in written form only.';
      case 'oral_hearings':
        return '\n\nWITNESS EXAMINATION:\nWitnesses shall be examined orally at hearings.';
      case 'both':
        return '\n\nWITNESS EXAMINATION:\nWitness testimony may be submitted in written form and witnesses may be examined orally at hearings.';
      default:
        return '';
    }
  }

  private generateLegalFramework(input: ArbitrationAgreementUserInput): string {
    const jurisdictionText = input.jurisdictionExclusion === 'yes' ? 
      '\n\nCOURT JURISDICTION EXCLUSION:\nThe parties exclude the jurisdiction of all courts except for the enforcement of awards and interim measures.' : 
      '\n\nCOURT JURISDICTION:\nCourts shall have jurisdiction only for the enforcement of awards and such other matters as provided by law.';

    const exceptionsText = input.courtJurisdictionExceptions ? 
      `\n\nJURISDICTION EXCEPTIONS:\n${input.courtJurisdictionExceptions}` : '';

    return `GOVERNING LAW - SUBSTANCE:
The arbitral tribunal shall apply ${input.governingLawSubstance} as the law governing the substance of the dispute.

GOVERNING LAW - PROCEDURE:
The arbitration procedure shall be governed by ${input.governingLawProcedure}.

KENYA ARBITRATION ACT:
This arbitration agreement is subject to the Arbitration Act No. 4 of 1995 (as amended) of the Republic of Kenya.

UNCITRAL MODEL LAW:
The procedural provisions shall be interpreted in accordance with the UNCITRAL Model Law on International Commercial Arbitration.${jurisdictionText}${exceptionsText}

TRIBUNAL JURISDICTION:
The arbitral tribunal shall have the competence to rule on its own jurisdiction (kompetenz-kompetenz), including any objections with respect to the existence or validity of the arbitration agreement.

PUBLIC POLICY:
Any award rendered shall be in accordance with the public policy of Kenya and shall not contravene any mandatory provisions of Kenyan law.

ENFORCEMENT COURTS:
Awards may be enforced in the High Court of Kenya or any other court of competent jurisdiction.

APPEAL LIMITATIONS:
The parties agree that the arbitral award shall be final and binding, with appeal rights limited to those provided under the Arbitration Act and applicable procedural law.`;
  }

  private generateCostsAndFees(input: ArbitrationAgreementUserInput): string {
    const customAllocationText = input.customCostAllocation ? 
      `\n\nCustom Allocation: ${input.customCostAllocation}` : '';
    
    const advanceText = input.advanceOnCosts ? 
      `\n\nADVANCE ON COSTS:\n${input.advanceOnCosts}` : '';
    
    const legalCostsText = this.getLegalCostsAllocationText(input.legalCostsAllocation);
    
    const currencyText = input.currency === 'other' && input.otherCurrency ? 
      input.otherCurrency : this.getCurrencyText(input.currency);

    return `COST ALLOCATION:
${this.getCostAllocationText(input.costAllocation)}${customAllocationText}

ARBITRATION FEES:
${input.feePaymentResponsibility}${advanceText}

CURRENCY:
All costs, fees, and awards shall be denominated in ${currencyText}.${legalCostsText}

ARBITRATOR FEES AND EXPENSES:
• Arbitrator fees shall be determined in accordance with the applicable arbitration rules
• Arbitrator expenses (travel, accommodation, etc.) shall be reimbursed at actual cost
• Administrative fees of arbitral institutions (if applicable) shall be paid as required

COST DEPOSIT:
The parties may be required to make deposits on account of costs as determined by the tribunal or arbitral institution.

FINAL COST ALLOCATION:
The tribunal shall include in its final award a determination of how costs shall be allocated between the parties, taking into account:
• The relative success of the parties' claims
• The conduct of the parties during the arbitration
• The complexity of the issues
• The reasonableness of the parties' positions

SECURITY FOR COSTS:
The tribunal may order security for costs in appropriate circumstances, particularly where there are concerns about a party's ability to pay an adverse costs award.`;
  }

  private getCostAllocationText(allocation: string): string {
    switch (allocation) {
      case 'equal_sharing':
        return 'The parties shall share equally all arbitration costs, including tribunal fees and administrative expenses.';
      case 'loser_pays':
        return 'The unsuccessful party shall bear all arbitration costs, including the successful party\'s reasonable legal costs.';
      case 'tribunal_discretion':
        return 'The tribunal shall have discretion to allocate costs between the parties as it deems appropriate.';
      case 'custom_allocation':
        return 'Costs shall be allocated in accordance with the custom allocation specified below.';
      default:
        return 'Costs shall be allocated as determined by the tribunal.';
    }
  }

  private getLegalCostsAllocationText(allocation?: string): string {
    if (!allocation) return '';
    
    switch (allocation) {
      case 'each_party_own':
        return '\n\nLEGAL COSTS:\nEach party shall bear their own legal costs and expenses.';
      case 'loser_pays':
        return '\n\nLEGAL COSTS:\nThe unsuccessful party shall reimburse the successful party\'s reasonable legal costs.';
      case 'tribunal_discretion':
        return '\n\nLEGAL COSTS:\nThe tribunal shall have discretion to award legal costs to the successful party.';
      default:
        return '';
    }
  }

  private getCurrencyText(currency: string): string {
    switch (currency) {
      case 'KES':
        return 'Kenya Shillings (KES)';
      case 'USD':
        return 'United States Dollars (USD)';
      case 'EUR':
        return 'Euros (EUR)';
      case 'GBP':
        return 'British Pounds (GBP)';
      default:
        return currency;
    }
  }

  private generateConfidentialityProvisions(input: ArbitrationAgreementUserInput): string {
    const durationText = input.confidentialityDuration ? 
      `\n\nDURATION:\n${input.confidentialityDuration}` : 
      '\n\nDURATION:\nThe confidentiality obligations shall continue indefinitely unless otherwise agreed by the parties.';
    
    const exceptionsText = input.confidentialityExceptions ? 
      `\n\nEXCEPTIONS:\n${input.confidentialityExceptions}` : '';
    
    const publicationText = this.getPublicationRightsText(input.publicationRights);

    return `CONFIDENTIALITY LEVEL:
${this.getConfidentialityLevelText(input.confidentialityLevel)}

CONFIDENTIALITY SCOPE:
${input.confidentialityScope}${durationText}${exceptionsText}${publicationText}

CONFIDENTIAL INFORMATION:
The following shall be treated as confidential:
• The existence of the arbitration proceedings
• All documents and evidence produced in the arbitration
• The proceedings themselves, including hearings and deliberations
• The arbitral award (unless disclosure is required for enforcement)
• All settlement negotiations and discussions

PERMITTED DISCLOSURES:
Notwithstanding the confidentiality provisions, parties may disclose confidential information:
• As required by law, court order, or regulatory requirement
• To their legal advisors, experts, and other professional advisors
• To potential funders or insurers (with appropriate confidentiality undertakings)
• For the purposes of enforcing or challenging an award
• With the written consent of all parties

TRIBUNAL CONFIDENTIALITY:
The arbitral tribunal and any experts appointed by the tribunal are bound by the same confidentiality obligations as the parties.

BREACH OF CONFIDENTIALITY:
Breach of these confidentiality provisions may result in:
• Injunctive relief to prevent further breaches
• Damages for losses caused by the breach
• Exclusion of evidence obtained through breach
• Costs and legal fees incurred in enforcement

SURVIVAL:
The confidentiality obligations shall survive the completion of the arbitration proceedings and shall remain binding on the parties, their successors, and assigns.`;
  }

  private getConfidentialityLevelText(level: string): string {
    switch (level) {
      case 'standard':
        return 'Standard confidentiality provisions apply to protect sensitive information and maintain privacy of proceedings.';
      case 'enhanced':
        return 'Enhanced confidentiality measures apply, including strict limitations on disclosure and additional protective measures.';
      case 'limited':
        return 'Limited confidentiality applies, with certain information permitted to be disclosed as specified.';
      case 'custom':
        return 'Custom confidentiality provisions apply as specifically defined in this agreement.';
      default:
        return 'Confidentiality provisions apply to protect the privacy and sensitive information of all parties.';
    }
  }

  private getPublicationRightsText(rights?: string): string {
    if (!rights) return '';
    
    switch (rights) {
      case 'none':
        return '\n\nPUBLICATION RIGHTS:\nNo part of the proceedings or award may be published or made public.';
      case 'anonymized':
        return '\n\nPUBLICATION RIGHTS:\nAnonymized versions of the award may be published for educational or research purposes.';
      case 'with_consent':
        return '\n\nPUBLICATION RIGHTS:\nPublication is permitted only with the written consent of all parties.';
      default:
        return '';
    }
  }

  private generateEnforcementAndSignatures(input: ArbitrationAgreementUserInput): string {
    const appealText = input.appealRights ? `\n\nAPPEAL RIGHTS:\n${input.appealRights}` : '';
    const setAsideText = input.setAsideGrounds ? `\n\nSET ASIDE GROUNDS:\n${input.setAsideGrounds}` : '';
    const recognitionText = input.recognitionProcedures ? `\n\nRECOGNITION PROCEDURES:\n${input.recognitionProcedures}` : '';
    
    const consolidationText = input.consolidationRights === 'yes' ? 
      `\n\nCONSOLIDATION:\nThe parties agree to consolidation rights as follows:\n${input.consolidationProcedures || 'As provided in the applicable arbitration rules.'}` : '';
    
    const thirdPartyText = input.thirdPartyJoinder === 'yes' ? 
      `\n\nTHIRD PARTY JOINDER:\nThird parties may be joined to the proceedings as follows:\n${input.thirdPartyProcedures || 'As determined by the tribunal.'}` : '';
    
    const expeditedText = input.expeditedProcedures === 'yes' ? 
      `\n\nEXPEDITED PROCEDURES:\nExpedited procedures may apply in appropriate cases:\n${input.expeditedCriteria || 'As determined by the tribunal or applicable rules.'}` : '';

    const party1Name = input.party1Name || 'Party 1';
    const party1Address = input.party1Address || 'Address not provided';
    const party2Name = input.party2Name || 'Party 2';
    const party2Address = input.party2Address || 'Address not provided';

    return `AWARD FINALITY:
${this.getAwardFinalityText(input.awardFinality)}${appealText}

ENFORCEMENT JURISDICTION:
${input.awardEnforcementJurisdiction}${setAsideText}${recognitionText}

NEW YORK CONVENTION:
Where applicable, awards shall be enforceable under the New York Convention on the Recognition and Enforcement of Foreign Arbitral Awards.

DOMESTIC ENFORCEMENT:
Domestic awards shall be enforceable in accordance with the Arbitration Act of Kenya and the Civil Procedure Rules.${consolidationText}${thirdPartyText}${expeditedText}

AMENDMENT AND MODIFICATION:
${input.amendmentProcedures || 'This Agreement may only be amended by written agreement signed by all parties.'}

SEVERABILITY:
${input.severabilityProvisions || 'If any provision of this Agreement is held invalid or unenforceable, the remainder shall continue in full force and effect.'}

BINDING EFFECT:
${input.successorObligations || 'This Agreement shall be binding upon and inure to the benefit of the parties and their respective successors and assigns.'}

NOTICES:
${input.noticeRequirements || 'All notices shall be in writing and delivered to the addresses specified herein.'}

WAIVER:
${input.waiverProvisions || 'No waiver of any provision shall be effective unless in writing and signed by the waiving party.'}

IN WITNESS WHEREOF, the parties have executed this Arbitration Agreement on ${input.effectiveDate || '_____________'}.

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
Date: _______________`;
  }

  private getAwardFinalityText(finality: string): string {
    switch (finality) {
      case 'final_binding':
        return 'The arbitral award shall be final and binding on all parties with no right of appeal.';
      case 'limited_appeals':
        return 'The arbitral award shall be final and binding, subject only to limited appeal rights as provided by law.';
      case 'custom_review':
        return 'The arbitral award shall be subject to the custom review procedures specified in this agreement.';
      default:
        return 'The arbitral award shall be final and binding on all parties.';
    }
  }
}