import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { ChildCustodyUserInput, GeneratedChildCustodyContent } from '../../types/documents/family/child-custody';

export class ChildCustodyGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'CHILD CUSTODY AND SUPPORT AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as ChildCustodyUserInput;
    const parent1Name = input.parent1Name.replace(/[^a-zA-Z0-9]/g, '_');
    const parent2Name = input.parent2Name.replace(/[^a-zA-Z0-9]/g, '_');
    return `Child_Custody_Support_Agreement_${parent1Name}_${parent2Name}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as ChildCustodyUserInput;
    const partyInfo: string[] = [];

    // Parent/Guardian 1 Information
    partyInfo.push('Parent/Guardian 1 Information:');
    partyInfo.push(`Name: ${input.parent1Name}`);
    partyInfo.push(`Address: ${input.parent1Address}`);
    partyInfo.push(`Email: ${input.parent1Email}`);
    if (input.parent1Phone) {
      partyInfo.push(`Phone: ${input.parent1Phone}`);
    }
    if (input.parent1IdNumber) {
      partyInfo.push(`ID Number: ${input.parent1IdNumber}`);
    }
    if (input.parent1Occupation) {
      partyInfo.push(`Occupation: ${input.parent1Occupation}`);
    }
    partyInfo.push(`Monthly Income: ${input.parent1MonthlyIncome}`);
    partyInfo.push('');

    // Parent/Guardian 2 Information
    partyInfo.push('Parent/Guardian 2 Information:');
    partyInfo.push(`Name: ${input.parent2Name}`);
    partyInfo.push(`Address: ${input.parent2Address}`);
    partyInfo.push(`Email: ${input.parent2Email}`);
    if (input.parent2Phone) {
      partyInfo.push(`Phone: ${input.parent2Phone}`);
    }
    if (input.parent2IdNumber) {
      partyInfo.push(`ID Number: ${input.parent2IdNumber}`);
    }
    if (input.parent2Occupation) {
      partyInfo.push(`Occupation: ${input.parent2Occupation}`);
    }
    partyInfo.push(`Monthly Income: ${input.parent2MonthlyIncome}`);
    partyInfo.push('');

    // Children Information
    partyInfo.push('Children Information:');
    partyInfo.push(`Number of Children: ${input.numberOfChildren}`);
    partyInfo.push(`Children Details: ${input.childrenDetails}`);
    partyInfo.push(`Current Living Arrangement: ${input.childrenCurrentLivingArrangement}`);
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedChildCustodyContent): DocumentSection[] {
    const input = userInput as unknown as ChildCustodyUserInput;
    
    return [
      {
        title: 'PARTIES AND CHILDREN IDENTIFICATION',
        content: generatedContent.partiesAndChildrenIdentification || this.generatePartiesAndChildrenIdentification(input)
      },
      {
        title: 'CUSTODY BACKGROUND AND CIRCUMSTANCES',
        content: generatedContent.custodyBackground || this.generateCustodyBackground(input)
      },
      {
        title: 'PHYSICAL CUSTODY ARRANGEMENTS',
        content: generatedContent.physicalCustodyArrangements || this.generatePhysicalCustodyArrangements(input)
      },
      {
        title: 'LEGAL CUSTODY AND DECISION MAKING',
        content: generatedContent.legalCustodyAndDecisionMaking || this.generateLegalCustodyAndDecisionMaking(input)
      },
      {
        title: 'CHILD SUPPORT PROVISIONS',
        content: generatedContent.childSupportProvisions || this.generateChildSupportProvisions(input)
      },
      {
        title: 'VISITATION AND PARENTING SCHEDULE',
        content: generatedContent.visitationAndParentingSchedule || this.generateVisitationAndParentingSchedule(input)
      },
      {
        title: 'COMMUNICATION AND CONTACT PROVISIONS',
        content: generatedContent.communicationAndContactProvisions || this.generateCommunicationAndContactProvisions(input)
      },
      {
        title: 'MODIFICATION PROCEDURES',
        content: generatedContent.modificationProcedures || this.generateModificationProcedures(input)
      },
      {
        title: 'DISPUTE RESOLUTION AND ENFORCEMENT',
        content: generatedContent.disputeResolutionAndEnforcement || this.generateDisputeResolutionAndEnforcement(input)
      },
      {
        title: 'ADDITIONAL PROVISIONS AND SAFEGUARDS',
        content: generatedContent.additionalProvisionsAndSafeguards || this.generateAdditionalProvisionsAndSafeguards(input)
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

  private generatePartiesAndChildrenIdentification(input: ChildCustodyUserInput): string {
    return `This Child Custody and Support Agreement ("Agreement") is entered into between ${input.parent1Name}, residing at ${input.parent1Address} ("Parent 1"), and ${input.parent2Name}, residing at ${input.parent2Address} ("Parent 2").

Children Subject to Agreement:
${input.childrenDetails}

Number of Children: ${input.numberOfChildren}
Current Living Arrangement: ${input.childrenCurrentLivingArrangement}

School Information: ${input.childrenSchoolInformation}
${input.childrenSpecialNeeds ? `Special Needs: ${input.childrenSpecialNeeds}` : ''}
${input.childrenMedicalInformation ? `Medical Information: ${input.childrenMedicalInformation}` : ''}

This Agreement is entered into in the best interests of the child(ren) and in accordance with the laws of the Republic of Kenya, specifically the Children Act (No. 8 of 2001) and applicable family law provisions.`;
  }

  private generateCustodyBackground(input: ChildCustodyUserInput): string {
    return `Background and Circumstances:

Reason for Custody Agreement: ${input.reasonForCustodyAgreement}

Current Custody Arrangement: ${input.currentCustodyArrangement}

${input.existingCourtOrders ? `Existing Court Orders: ${input.existingCourtOrders}` : ''}

${input.previousCustodyModifications ? `Previous Custody Modifications: ${input.previousCustodyModifications}` : ''}

Financial Status Summary:
• Parent 1 Financial Status: ${input.parent1FinancialStatus}
• Parent 2 Financial Status: ${input.parent2FinancialStatus}

Both parents acknowledge that this Agreement is entered into voluntarily and in the best interests of the child(ren), with full understanding of their respective rights, responsibilities, and obligations.`;
  }

  private generatePhysicalCustodyArrangements(input: ChildCustodyUserInput): string {
    return `Physical Custody Arrangements:

Primary Physical Custody: ${input.primaryPhysicalCustodyParent}

Overall Physical Custody Schedule: ${input.physicalCustodySchedule}

Detailed Schedule:
• Weekday Schedule: ${input.weekdaySchedule}
• Weekend Schedule: ${input.weekendSchedule}
• School Year Schedule: ${input.schoolYearSchedule}
• Summer Vacation Schedule: ${input.summerVacationSchedule}

Holiday and Special Occasions:
• Holiday Schedule: ${input.holidaySchedule}
• Special Occasion Schedule: ${input.specialOccasionSchedule}

Transportation:
• Pickup/Drop-off Locations: ${input.pickupDropoffLocations}
• Pickup/Drop-off Times: ${input.pickupDropoffTimes}
• Transportation Responsibilities: ${input.transportationResponsibilities}

Both parents shall strictly adhere to this schedule and shall ensure that transitions are conducted in a manner that minimizes disruption to the child(ren).`;
  }

  private generateLegalCustodyAndDecisionMaking(input: ChildCustodyUserInput): string {
    return `Legal Custody and Decision Making Authority:

Legal Custody Arrangement: ${input.legalCustodyArrangement}

Decision Making Authority:
• Educational Decisions: ${input.educationalDecisionMaking}
• Medical Decisions: ${input.medicalDecisionMaking}
• Religious Decisions: ${input.religiousDecisionMaking}
• Extracurricular Activities: ${input.extracurricularDecisionMaking}

Consultation Requirements: ${input.majorDecisionConsultation}

Emergency Procedures: ${input.emergencyDecisionProcedures}

Information Access Rights:
• School Communication Rights: ${input.schoolCommunicationRights}
• Medical Record Access: ${input.medicalRecordAccess}

Both parents shall consult with each other on all major decisions affecting the child(ren)'s welfare, health, education, and general upbringing, unless otherwise specified in this Agreement or restricted by court order.`;
  }

  private generateChildSupportProvisions(input: ChildCustodyUserInput): string {
    return `Child Support Provisions:

Support Amount: ${input.childSupportAmount}
Paying Parent: ${input.childSupportPayingParent}
Payment Frequency: ${input.childSupportFrequency}
Payment Method: ${input.childSupportPaymentMethod}
Support Start Date: ${input.childSupportStartDate}

Calculation Basis: ${input.childSupportCalculationBasis}
Income Considerations: ${input.childSupportIncomeConsiderations}

Additional Expenses:
• Additional Support Expenses: ${input.additionalChildSupportExpenses}
• Medical Insurance Responsibility: ${input.medicalInsuranceResponsibility}
• Medical Expense Sharing: ${input.medicalExpenseSharing}
• Educational Expense Sharing: ${input.educationalExpenseSharing}
• Extracurricular Expense Sharing: ${input.extracurricularExpenseSharing}
• Childcare Expense Sharing: ${input.childcareExpenseSharing}

Child support payments shall be made consistently and without deduction. Any changes to income that affect the support calculation shall be promptly disclosed to the other parent.`;
  }

  private generateVisitationAndParentingSchedule(input: ChildCustodyUserInput): string {
    return `Visitation and Parenting Schedule:

Regular Schedule:
• Weekday Schedule: ${input.weekdaySchedule}
• Weekend Schedule: ${input.weekendSchedule}

Extended Periods:
• Summer Vacation Schedule: ${input.summerVacationSchedule}
• Holiday Schedule: ${input.holidaySchedule}
• Special Occasion Schedule: ${input.specialOccasionSchedule}

Travel Provisions:
• Travel Permission Requirements: ${input.travelPermissionRequirements}
• Vacation Travel Notice: ${input.vacationTravelNotice}
${input.internationalTravelRestrictions ? `• International Travel Restrictions: ${input.internationalTravelRestrictions}` : ''}

Relocation:
• Relocation Notice Requirements: ${input.relocationNoticeRequirements}
• Relocation Approval Process: ${input.relocationApprovalProcess}
${input.geographicRestrictions ? `• Geographic Restrictions: ${input.geographicRestrictions}` : ''}

Each parent shall respect the other parent's scheduled time with the child(ren) and shall not interfere with the established visitation schedule except in cases of emergency or with mutual agreement.`;
  }

  private generateCommunicationAndContactProvisions(input: ChildCustodyUserInput): string {
    return `Communication and Contact Provisions:

Parent-to-Parent Communication: ${input.communicationBetweenParents}

Parent-Child Communication: ${input.communicationWithChildren}

${input.phoneCallSchedule ? `Phone Call Schedule: ${input.phoneCallSchedule}` : ''}

${input.emailCommunicationGuidelines ? `Email Communication Guidelines: ${input.emailCommunicationGuidelines}` : ''}

Emergency Contact: ${input.emergencyContactProcedures}

${input.thirdPartyContactRestrictions ? `Third Party Contact Restrictions: ${input.thirdPartyContactRestrictions}` : ''}

${input.socialMediaGuidelines ? `Social Media Guidelines: ${input.socialMediaGuidelines}` : ''}

Both parents shall maintain open, respectful, and child-focused communication. All communication should prioritize the best interests and emotional well-being of the child(ren).`;
  }

  private generateModificationProcedures(input: ChildCustodyUserInput): string {
    return `Modification Procedures:

Modification Process: ${input.modificationProcedures}

Modification Requirements: ${input.modificationRequirements}

Material Change in Circumstances: ${input.materialChangeCircumstances}

Notice Requirements: ${input.noticeRequirementForModification}

Mediation Requirement: ${input.mediationRequirement ? 'Yes - Mediation required before court proceedings' : 'No - Direct court application permitted'}

Court Approval: ${input.courtApprovalRequirement ? 'Yes - Court approval required for all modifications' : 'No - Mutual agreement sufficient for minor modifications'}

This Agreement may only be modified by written agreement of both parties or by court order. Any modifications must be in the best interests of the child(ren) and comply with applicable law.`;
  }

  private generateDisputeResolutionAndEnforcement(input: ChildCustodyUserInput): string {
    return `Dispute Resolution and Enforcement:

Dispute Resolution Mechanism: ${input.disputeResolutionMechanism}

Mediation Requirements: ${input.mediationRequirements}

${input.arbitrationProvisions ? `Arbitration Provisions: ${input.arbitrationProvisions}` : ''}

Court Jurisdiction: ${input.courtJurisdiction}

${input.attorneyFeesAllocation ? `Attorney Fees Allocation: ${input.attorneyFeesAllocation}` : ''}

Enforcement Mechanisms: ${input.enforcementMechanisms}

Contempt Procedures: ${input.contemptProcedures}

Make-up Time Provisions: ${input.makeupTimeProvisions}

Penalties for Violation: ${input.penaltiesForViolation}

${input.bondingRequirements ? `Bonding Requirements: ${input.bondingRequirements}` : ''}

Both parents acknowledge that violation of this Agreement may result in legal consequences, including but not limited to contempt of court proceedings and modification of custody arrangements.`;
  }

  private generateAdditionalProvisionsAndSafeguards(input: ChildCustodyUserInput): string {
    const safetySection = input.supervisionRequirements || input.substanceAbuseRestrictions || input.domesticViolenceProtections || input.backgroundCheckRequirements || input.thirdPartyCustodyRestrictions ?
      `Safety and Supervision:
${input.supervisionRequirements ? `• Supervision Requirements: ${input.supervisionRequirements}` : ''}
${input.substanceAbuseRestrictions ? `• Substance Abuse Restrictions: ${input.substanceAbuseRestrictions}` : ''}
${input.domesticViolenceProtections ? `• Domestic Violence Protections: ${input.domesticViolenceProtections}` : ''}
${input.backgroundCheckRequirements ? `• Background Check Requirements: ${input.backgroundCheckRequirements}` : ''}
${input.thirdPartyCustodyRestrictions ? `• Third Party Custody Restrictions: ${input.thirdPartyCustodyRestrictions}` : ''}

` : '';

    return `Additional Provisions and Safeguards:

${safetySection}Child Safety Provisions: ${input.childSafetyProvisions}

Tax and Financial Considerations:
• Child Tax Exemption Allocation: ${input.childTaxExemptionAllocation}
• Insurance Beneficiary Designations: ${input.insuranceBeneficiaryDesignations}

${input.estatePlanningConsiderations ? `Estate Planning Considerations: ${input.estatePlanningConsiderations}` : ''}

${input.specialCircumstances ? `Special Circumstances: ${input.specialCircumstances}` : ''}

Legal Representation:
• Parent 1 Legal Representation: ${input.parent1LegalRepresentation ? 'Yes' : 'No'}
• Parent 2 Legal Representation: ${input.parent2LegalRepresentation ? 'Yes' : 'No'}

${input.parent1AttorneyName ? `Parent 1's Attorney: ${input.parent1AttorneyName}${input.parent1AttorneyContact ? ` (${input.parent1AttorneyContact})` : ''}` : ''}
${input.parent2AttorneyName ? `Parent 2's Attorney: ${input.parent2AttorneyName}${input.parent2AttorneyContact ? ` (${input.parent2AttorneyContact})` : ''}` : ''}

Independent Legal Advice: ${input.independentLegalAdviceConfirmation}

${input.additionalTerms || ''}`;
  }

  private generateGeneralProvisions(input: ChildCustodyUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `General Provisions:

Best Interest of Child: ${input.bestInterestOfChildAcknowledgment}

Voluntary Agreement: ${input.voluntaryAgreementAcknowledgment ? 'Both parties acknowledge this is a voluntary agreement' : 'Agreement circumstances require documentation'}

Full Disclosure: ${input.fullDisclosureAcknowledgment ? 'Both parties acknowledge full financial and relevant disclosure' : 'Disclosure status requires documentation'}

Duress or Coercion: ${input.duressOrCoercionAbsence}

Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}, specifically the Children Act (No. 8 of 2001) and applicable family law provisions.

Court Jurisdiction: ${input.courtJurisdictionForEnforcement}

Effective Date: This Agreement shall become effective on ${input.effectiveDate}.

Entire Agreement: This Agreement contains the entire agreement between the parties regarding child custody and support and supersedes all prior negotiations and understandings.

Severability: If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.

Priority: In all matters, the best interests and welfare of the child(ren) shall be the paramount consideration.`;
  }

  private generateSignatures(input: ChildCustodyUserInput): string {
    return `PARENT 1:

_______________________
${input.parent1Name}
Address: ${input.parent1Address}
Date: _______________


PARENT 2:

_______________________
${input.parent2Name}
Address: ${input.parent2Address}
Date: _______________


NOTARIZATION:

State/Republic of: _______________
County/Province: _______________

On this _____ day of _________, 20__, before me personally appeared ${input.parent1Name} and ${input.parent2Name}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities, and that by their signatures on the instrument the persons, or the entity upon behalf of which the persons acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of the Republic of Kenya that the foregoing paragraph is true and correct.

WITNESS my hand and official seal.

_______________________
Notary Public`;
  }
}