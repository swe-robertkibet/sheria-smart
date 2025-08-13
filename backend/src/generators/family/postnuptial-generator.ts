import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { PostnuptialUserInput, GeneratedPostnuptialContent } from '../../types/documents/family/postnuptial';

export class PostnuptialGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'POSTNUPTIAL AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as PostnuptialUserInput;
    const spouse1Name = input.spouse1Name.replace(/[^a-zA-Z0-9]/g, '_');
    const spouse2Name = input.spouse2Name.replace(/[^a-zA-Z0-9]/g, '_');
    return `Postnuptial_Agreement_${spouse1Name}_${spouse2Name}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as PostnuptialUserInput;
    const partyInfo: string[] = [];

    // Spouse 1 Information
    partyInfo.push('Spouse 1 Information:');
    partyInfo.push(`Name: ${input.spouse1Name}`);
    partyInfo.push(`Address: ${input.spouse1Address}`);
    partyInfo.push(`Email: ${input.spouse1Email}`);
    if (input.spouse1Phone) {
      partyInfo.push(`Phone: ${input.spouse1Phone}`);
    }
    if (input.spouse1IdNumber) {
      partyInfo.push(`ID Number: ${input.spouse1IdNumber}`);
    }
    partyInfo.push('');

    // Spouse 2 Information
    partyInfo.push('Spouse 2 Information:');
    partyInfo.push(`Name: ${input.spouse2Name}`);
    partyInfo.push(`Address: ${input.spouse2Address}`);
    partyInfo.push(`Email: ${input.spouse2Email}`);
    if (input.spouse2Phone) {
      partyInfo.push(`Phone: ${input.spouse2Phone}`);
    }
    if (input.spouse2IdNumber) {
      partyInfo.push(`ID Number: ${input.spouse2IdNumber}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedPostnuptialContent): DocumentSection[] {
    const input = userInput as unknown as PostnuptialUserInput;
    
    return [
      {
        title: 'PARTIES AND MARRIAGE',
        content: generatedContent.partiesAndMarriage || this.generatePartiesAndMarriage(input)
      },
      {
        title: 'REASONS AND CIRCUMSTANCES',
        content: generatedContent.reasonsAndCircumstances || this.generateReasonsAndCircumstances(input)
      },
      {
        title: 'FINANCIAL DISCLOSURE',
        content: generatedContent.financialDisclosure || this.generateFinancialDisclosure(input)
      },
      {
        title: 'SEPARATE PROPERTY',
        content: generatedContent.separateProperty || this.generateSeparateProperty(input)
      },
      {
        title: 'MARITAL PROPERTY',
        content: generatedContent.maritalProperty || this.generateMaritalProperty(input)
      },
      {
        title: 'SPOUSAL SUPPORT',
        content: generatedContent.spousalSupport || this.generateSpousalSupport(input)
      },
      {
        title: 'INHERITANCE RIGHTS',
        content: generatedContent.inheritanceRights || this.generateInheritanceRights(input)
      },
      {
        title: 'BUSINESS INTERESTS',
        content: generatedContent.businessInterests || this.generateBusinessInterests(input)
      },
      {
        title: 'LEGAL REPRESENTATION',
        content: generatedContent.legalRepresentation || this.generateLegalRepresentation(input)
      },
      {
        title: 'MODIFICATION PROCEDURES',
        content: generatedContent.modificationProcedures || this.generateModificationProcedures(input)
      },
      {
        title: 'ENFORCEABILITY PROVISIONS',
        content: generatedContent.enforceabilityProvisions || this.generateEnforceabilityProvisions(input)
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

  private generatePartiesAndMarriage(input: PostnuptialUserInput): string {
    const marriageLocation = input.marriageLocation ? ` in ${input.marriageLocation}` : '';
    return `This Postnuptial Agreement (\"Agreement\") is entered into between ${input.spouse1Name}, residing at ${input.spouse1Address} (\"Spouse 1\"), and ${input.spouse2Name}, residing at ${input.spouse2Address} (\"Spouse 2\"). 

The parties were lawfully married on ${input.marriageDate}${marriageLocation} and are currently married to each other.

This Agreement is entered into post-marriage to clarify and define the rights, obligations, and property arrangements between the spouses during their marriage and in the event of separation, divorce, or death.`;
  }

  private generateReasonsAndCircumstances(input: PostnuptialUserInput): string {
    return `Reason for Agreement: ${input.reasonForPostnuptialAgreement}

Changed Circumstances: ${input.changedCircumstances}

The parties acknowledge that circumstances may have changed since their marriage, and they desire to enter into this Agreement to provide clarity and certainty regarding their financial and property rights and obligations.

Both parties enter into this Agreement voluntarily and with full understanding of its terms and consequences.`;
  }

  private generateFinancialDisclosure(input: PostnuptialUserInput): string {
    return `Full Financial Disclosure: ${input.fullFinancialDisclosure ? 'Both parties have made full and complete financial disclosure' : 'Limited financial disclosure has been made'}

Disclosure Documents Provided: ${input.disclosureDocumentsProvided}

Pre-Marital Assets:
• ${input.spouse1Name}: ${input.spouse1PreMaritalAssets}
• ${input.spouse2Name}: ${input.spouse2PreMaritalAssets}

Pre-Marital Liabilities:
• ${input.spouse1Name}: ${input.spouse1PreMaritalLiabilities}
• ${input.spouse2Name}: ${input.spouse2PreMaritalLiabilities}

Current Financial Position:
• ${input.spouse1Name} - Assets: ${input.spouse1CurrentAssets}, Liabilities: ${input.spouse1CurrentLiabilities}, Net Worth: ${input.spouse1NetWorth}
• ${input.spouse2Name} - Assets: ${input.spouse2CurrentAssets}, Liabilities: ${input.spouse2CurrentLiabilities}, Net Worth: ${input.spouse2NetWorth}

Marital Assets Acquired: ${input.maritalAssetsAcquired}
Marital Liabilities Incurred: ${input.maritalLiabilitiesIncurred}

Income Information:
• ${input.spouse1Name}: ${input.spouse1CurrentIncome} from ${input.spouse1IncomeSource}
• ${input.spouse2Name}: ${input.spouse2CurrentIncome} from ${input.spouse2IncomeSource}

Income Changes Since Marriage: ${input.incomeChangesSpouseMarriage}

Each party acknowledges that they have been provided with adequate opportunity to review and verify the financial information disclosed by the other party.`;
  }

  private generateSeparateProperty(input: PostnuptialUserInput): string {
    return `Separate Property Definition: ${input.separatePropertyDefinition}

Pre-Marital Property Transformation: ${input.premaritalPropertyTransformation}

Real Estate Ownership: ${input.realEstateOwnership}

Personal Property Ownership: ${input.personalPropertyOwnership}

Appreciation Rights: ${input.appreciationRights}

Each party's separate property shall remain their sole and exclusive property and shall not be subject to division upon separation, divorce, or death, except as otherwise specifically provided in this Agreement.

The parties agree that any property owned by either party prior to marriage shall retain its separate character unless specifically transmuted to marital property by written agreement.`;
  }

  private generateMaritalProperty(input: PostnuptialUserInput): string {
    return `Marital Property Definition: ${input.maritalPropertyDefinition}

Property Acquisition Rules: ${input.propertyAcquisitionRules}

Joint Account Management: ${input.jointAccountManagement}

Separate Account Maintenance: ${input.separateAccountMaintenance}

Expense Sharing: ${input.expenseSharing}

Household Expense Allocation: ${input.householdExpenseAllocation}

Major Purchase Requirements: ${input.majorPurchaseRequirements}

Financial Decision Making: ${input.financialDecisionMaking}

Property acquired during marriage shall be classified and treated according to the terms set forth herein, taking into consideration the source of funds, manner of acquisition, and intent of the parties.`;
  }

  private generateSpousalSupport(input: PostnuptialUserInput): string {
    const supportWaiver = input.spousalSupportWaiver ? 'Both parties waive any right to spousal support' : 'Spousal support rights are preserved subject to the terms below';
    
    return `Spousal Support Waiver: ${supportWaiver}

Spousal Support Terms: ${input.spousalSupportTerms}

${input.spousalSupportDuration ? `Support Duration: ${input.spousalSupportDuration}\n\n` : ''}${input.spousalSupportAmount ? `Support Amount: ${input.spousalSupportAmount}\n\n` : ''}Circumstances for Support: ${input.circumstancesForSupport}

Rehabilitative Support: ${input.rehabilitativeSupport}

Support Modification: ${input.spousalSupportModification}

The parties acknowledge that this provision regarding spousal support is fair and reasonable given their respective financial circumstances, earning capacities, and contributions to the marriage.`;
  }

  private generateInheritanceRights(input: PostnuptialUserInput): string {
    const inheritanceWaiver = input.inheritanceRightsWaiver ? 'Both parties waive inheritance rights' : 'Inheritance rights are modified as follows';
    
    return `Inheritance Rights Waiver: ${inheritanceWaiver}

Inheritance Rights Arrangements: ${input.inheritanceRightsArrangements}

Estate Planning Coordination: ${input.estatePlanningCoordination}

Beneficiary Designations: ${input.beneficiaryDesignations}

Will Requirements: ${input.willRequirements}

Survivorship Rights: ${input.survivorshipRights}

Retirement Account Benefits: ${input.retirementAccountBenefits}

Each party acknowledges that they understand the inheritance rights they may be waiving or modifying and that such waiver or modification is voluntary and made with full knowledge of its consequences.`;
  }

  private generateBusinessInterests(input: PostnuptialUserInput): string {
    return `Business Interests:
• ${input.spouse1Name}: ${input.spouse1BusinessInterests}
• ${input.spouse2Name}: ${input.spouse2BusinessInterests}

Business Interest Protection: ${input.businessInterestProtection}

Business Operations During Marriage: ${input.businessOperationsDuringMarriage}

Future Business Ventures: ${input.futureBusinessVentures}

Business Valuation Methods: ${input.businessValuationMethods}

The parties agree that each spouse's business interests shall be protected according to the terms herein, and that the other spouse shall have no claim to such business interests except as specifically provided.`;
  }

  private generateLegalRepresentation(input: PostnuptialUserInput): string {
    const spouse1Rep = input.spouse1LegalRepresentation ? `represented by ${input.spouse1AttorneyName || 'legal counsel'}` : 'proceeding without separate legal representation';
    const spouse2Rep = input.spouse2LegalRepresentation ? `represented by ${input.spouse2AttorneyName || 'legal counsel'}` : 'proceeding without separate legal representation';
    
    return `Legal Representation:
• ${input.spouse1Name} is ${spouse1Rep}${input.spouse1AttorneyContact ? `, contact: ${input.spouse1AttorneyContact}` : ''}
• ${input.spouse2Name} is ${spouse2Rep}${input.spouse2AttorneyContact ? `, contact: ${input.spouse2AttorneyContact}` : ''}

Independent Legal Advice Confirmation: ${input.independentLegalAdviceConfirmation}

Voluntary Execution: ${input.voluntaryExecution ? 'Both parties confirm voluntary execution' : 'Voluntary execution status unclear'}

Absence of Duress or Coercion: ${input.duressOrCoercionAbsence}

Fairness at Execution: ${input.fairnessAtExecution}

Each party acknowledges that they have been advised of their right to independent legal counsel and either have obtained such counsel or have voluntarily chosen to proceed without separate representation.`;
  }

  private generateModificationProcedures(input: PostnuptialUserInput): string {
    return `Modification Procedures: ${input.modificationProcedures}

Modification Requirements: ${input.modificationRequirements}

Periodic Review Triggers: ${input.periodicReviewTriggers}

${input.periodicReviewRequirements ? `Periodic Review Requirements: ${input.periodicReviewRequirements}\n\n` : ''}${input.reconciliationProcedures ? `Reconciliation Procedures: ${input.reconciliationProcedures}\n\n` : ''}${input.separationArrangements ? `Separation Arrangements: ${input.separationArrangements}\n\n` : ''}${input.temporarySupportDuringSeparation ? `Temporary Support During Separation: ${input.temporarySupportDuringSeparation}\n\n` : ''}This Agreement may only be modified by a written document signed by both parties and, where required by law, acknowledged before a notary public.`;
  }

  private generateEnforceabilityProvisions(input: PostnuptialUserInput): string {
    return `Enforceability Provisions: ${input.enforceabilityProvisions}

Severability Clause: ${input.severabilityClause}

Tax Considerations:
• Tax Filing Status: ${input.taxFilingStatus}
• Tax Liability Allocation: ${input.taxLiabilityAllocation}
• Deduction Allocation: ${input.deductionAllocation}

Debt Responsibility: ${input.debtResponsibility}

Children Considerations:
• Existing Children: ${input.existingChildrenArrangements}
• Future Children: ${input.futureChildrenArrangements}
• Child Support Obligations: ${input.childSupportObligations}
• Education Funding: ${input.educationFundingResponsibilities}
• Custody Considerations: ${input.custodyConsiderations}

If any provision of this Agreement is deemed unenforceable, the remaining provisions shall continue in full force and effect.`;
  }

  private generateGeneralProvisions(input: PostnuptialUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    
    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.

Dispute Resolution: ${input.disputeResolutionMechanism}

Jurisdiction for Enforcement: ${input.jurisdictionForEnforcement}

Entire Agreement: This Agreement constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior negotiations, representations, or agreements relating to such matters.

Amendment: This Agreement may only be modified by written agreement signed by both parties.

Effective Date: This Agreement shall be effective as of ${input.effectiveDate}.

${input.sunsetProvisions ? `Sunset Provisions: ${input.sunsetProvisions}\n\n` : ''}${input.specialCircumstances ? `Special Circumstances: ${input.specialCircumstances}\n\n` : ''}${additionalTerms}`;
  }

  private generateSignatures(input: PostnuptialUserInput): string {
    return `SPOUSE 1:

_______________________
${input.spouse1Name}
Address: ${input.spouse1Address}
Date: _______________


SPOUSE 2:

_______________________
${input.spouse2Name}
Address: ${input.spouse2Address}
Date: _______________


NOTARIZATION:

State of _______________
County of _____________

On this _____ day of __________, 2024, before me personally appeared ${input.spouse1Name} and ${input.spouse2Name}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities, and that by their signatures on the instrument the persons, or the entity upon behalf of which the persons acted, executed the instrument.

_______________________
Notary Public`;
  }
}