import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { PrenuptialUserInput, GeneratedPrenuptialContent } from '../../types/documents/family/prenuptial';

export class PrenuptialGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'PRENUPTIAL AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as PrenuptialUserInput;
    const spouse1Name = input.prospectiveSpouse1Name.replace(/[^a-zA-Z0-9]/g, '_');
    const spouse2Name = input.prospectiveSpouse2Name.replace(/[^a-zA-Z0-9]/g, '_');
    return `Prenuptial_Agreement_${spouse1Name}_${spouse2Name}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as PrenuptialUserInput;
    const partyInfo: string[] = [];

    // Prospective Spouse 1 Information
    partyInfo.push('Prospective Spouse 1 Information:');
    partyInfo.push(`Name: ${input.prospectiveSpouse1Name}`);
    partyInfo.push(`Address: ${input.prospectiveSpouse1Address}`);
    partyInfo.push(`Email: ${input.prospectiveSpouse1Email}`);
    if (input.prospectiveSpouse1Phone) {
      partyInfo.push(`Phone: ${input.prospectiveSpouse1Phone}`);
    }
    if (input.prospectiveSpouse1IdNumber) {
      partyInfo.push(`ID Number: ${input.prospectiveSpouse1IdNumber}`);
    }
    partyInfo.push('');

    // Prospective Spouse 2 Information
    partyInfo.push('Prospective Spouse 2 Information:');
    partyInfo.push(`Name: ${input.prospectiveSpouse2Name}`);
    partyInfo.push(`Address: ${input.prospectiveSpouse2Address}`);
    partyInfo.push(`Email: ${input.prospectiveSpouse2Email}`);
    if (input.prospectiveSpouse2Phone) {
      partyInfo.push(`Phone: ${input.prospectiveSpouse2Phone}`);
    }
    if (input.prospectiveSpouse2IdNumber) {
      partyInfo.push(`ID Number: ${input.prospectiveSpouse2IdNumber}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedPrenuptialContent): DocumentSection[] {
    const input = userInput as unknown as PrenuptialUserInput;
    
    return [
      {
        title: 'PARTIES AND INTENDED MARRIAGE',
        content: generatedContent.partiesAndIntendedMarriage || this.generatePartiesAndIntendedMarriage(input)
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

  private generatePartiesAndIntendedMarriage(input: PrenuptialUserInput): string {
    const marriageLocation = input.marriageLocation ? ` at ${input.marriageLocation}` : '';
    return `This Prenuptial Agreement ("Agreement") is entered into between ${input.prospectiveSpouse1Name}, residing at ${input.prospectiveSpouse1Address} ("First Party"), and ${input.prospectiveSpouse2Name}, residing at ${input.prospectiveSpouse2Address} ("Second Party").

The parties are engaged and intend to marry each other on ${input.intendedMarriageDate}${marriageLocation}. This Agreement is entered into in contemplation of marriage and shall become effective upon the solemnization of the marriage between the parties.

The parties acknowledge that they are entering into this Agreement voluntarily and with full understanding of its terms and legal consequences.`;
  }

  private generateFinancialDisclosure(input: PrenuptialUserInput): string {
    return `Full Financial Disclosure: ${input.fullFinancialDisclosure ? 'Complete' : 'Pending'}

First Party Financial Position:
• Current Assets: ${input.spouse1CurrentAssets}
• Current Liabilities: ${input.spouse1CurrentLiabilities}
• Net Worth: ${input.spouse1NetWorth}
• Current Income: ${input.spouse1CurrentIncome}
• Income Source: ${input.spouse1IncomeSource}
• Earning Capacity: ${input.spouse1EarningCapacity}
• Professional Qualifications: ${input.spouse1ProfessionalQualifications}

Second Party Financial Position:
• Current Assets: ${input.spouse2CurrentAssets}
• Current Liabilities: ${input.spouse2CurrentLiabilities}
• Net Worth: ${input.spouse2NetWorth}
• Current Income: ${input.spouse2CurrentIncome}
• Income Source: ${input.spouse2IncomeSource}
• Earning Capacity: ${input.spouse2EarningCapacity}
• Professional Qualifications: ${input.spouse2ProfessionalQualifications}

Disclosure Documentation: ${input.disclosureDocumentsProvided}

Each party acknowledges receipt of complete and accurate financial disclosure from the other party and has had adequate opportunity to review and understand such disclosure.`;
  }

  private generateSeparateProperty(input: PrenuptialUserInput): string {
    return `Separate Property Definition: ${input.separatePropertyDefinition}

Real Estate Ownership: ${input.realEstateOwnership}

Personal Property Ownership: ${input.personalPropertyOwnership}

Appreciation Rights: ${input.appreciationRights}

All property owned by each party prior to marriage, including any appreciation thereof, shall remain the separate property of the owning party. Property acquired during marriage by gift, inheritance, or devise shall also remain separate property.

Each party waives any claim to the separate property of the other party, including any right of inheritance, dower, curtesy, or other marital property rights unless specifically provided otherwise in this Agreement.`;
  }

  private generateMaritalProperty(input: PrenuptialUserInput): string {
    return `Marital Property Definition: ${input.maritalPropertyDefinition}

Property Acquisition Rules: ${input.propertyAcquisitionRules}

Expense Sharing: ${input.expenseSharing}

Joint Account Management: ${input.jointAccountManagement}

Separate Account Maintenance: ${input.separateAccountMaintenance}

Major Purchase Requirements: ${input.majorPurchaseRequirements}

Property acquired during marriage through the joint efforts of both parties shall be considered marital property and subject to division according to the terms of this Agreement and applicable law.`;
  }

  private generateSpousalSupport(input: PrenuptialUserInput): string {
    const supportWaiver = input.spousalSupportWaiver ? 
      'Each party hereby waives any right to spousal support, maintenance, or alimony from the other party.' :
      `Spousal Support Terms: ${input.spousalSupportTerms}`;
    
    const supportDetails = !input.spousalSupportWaiver ? `
Duration: ${input.spousalSupportDuration || 'As specified in terms'}
Amount: ${input.spousalSupportAmount || 'As specified in terms'}
Modification: ${input.spousalSupportModification}
Circumstances for Support: ${input.circumstancesForSupport}` : '';

    return `${supportWaiver}${supportDetails}

This waiver or arrangement is made with full understanding of the financial circumstances of both parties and the legal consequences of such waiver or arrangement. Each party acknowledges that they have adequate means of self-support or will be able to maintain themselves after dissolution of marriage.`;
  }

  private generateInheritanceRights(input: PrenuptialUserInput): string {
    const inheritanceWaiver = input.inheritanceRightsWaiver ?
      'Each party hereby waives all rights of inheritance in the estate of the other party, including but not limited to rights as a surviving spouse under intestacy laws.' :
      `Inheritance Rights Arrangements: ${input.inheritanceRightsArrangements}`;

    return `${inheritanceWaiver}

Estate Planning Coordination: ${input.estatePlanningCoordination}

Beneficiary Designations: ${input.beneficiaryDesignations}

Will Requirements: ${input.willRequirements}

This provision shall not prevent either party from making specific bequests to the other in their will or other estate planning documents, but such bequests shall be voluntary and not based on any legal obligation arising from the marriage.`;
  }

  private generateBusinessInterests(input: PrenuptialUserInput): string {
    return `First Party Business Interests: ${input.spouse1BusinessInterests}

Second Party Business Interests: ${input.spouse2BusinessInterests}

Business Interest Protection: ${input.businessInterestProtection}

Future Business Ventures: ${input.futureBusinessVentures}

Business Valuation Methods: ${input.businessValuationMethods}

Each party's business interests, including any appreciation, expansion, or development thereof during marriage, shall remain the separate property of the owning party. The non-owning party waives any claim to such business interests, including any increase in value during marriage.`;
  }

  private generateLegalRepresentation(input: PrenuptialUserInput): string {
    const attorney1Info = input.spouse1AttorneyName ? 
      `First Party's Attorney: ${input.spouse1AttorneyName}${input.spouse1AttorneyContact ? ` (${input.spouse1AttorneyContact})` : ''}` :
      'First Party has chosen not to retain separate counsel.';
      
    const attorney2Info = input.spouse2AttorneyName ?
      `Second Party's Attorney: ${input.spouse2AttorneyName}${input.spouse2AttorneyContact ? ` (${input.spouse2AttorneyContact})` : ''}` :
      'Second Party has chosen not to retain separate counsel.';

    return `Independent Legal Representation:
• First Party Legal Representation: ${input.spouse1LegalRepresentation ? 'Yes' : 'No'}
• Second Party Legal Representation: ${input.spouse2LegalRepresentation ? 'Yes' : 'No'}

${attorney1Info}

${attorney2Info}

Independent Legal Advice Confirmation: ${input.independentLegalAdviceConfirmation}

Each party acknowledges that they have been advised of the right to independent legal counsel and have either obtained such counsel or voluntarily waived this right with full understanding of the legal implications.`;
  }

  private generateModificationProcedures(input: PrenuptialUserInput): string {
    return `Modification Procedures: ${input.modificationProcedures}

Modification Requirements: ${input.modificationRequirements}

${input.periodicReviewRequirements ? `Periodic Review Requirements: ${input.periodicReviewRequirements}` : ''}

${input.sunsetProvisions ? `Sunset Provisions: ${input.sunsetProvisions}` : ''}

This Agreement may only be modified by written agreement signed by both parties before a notary public. No oral modifications shall be valid or enforceable.`;
  }

  private generateEnforceabilityProvisions(input: PrenuptialUserInput): string {
    return `Enforceability Provisions: ${input.enforceabilityProvisions}

Severability Clause: ${input.severabilityClause}

Voluntary Execution: ${input.voluntaryExecution ? 'Both parties acknowledge voluntary execution' : 'Execution circumstances require documentation'}

Duress or Coercion Absence: ${input.duressOrCoercionAbsence}

Fairness at Execution: ${input.fairnessAtExecution}

If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect. The parties intend for this Agreement to be enforceable to the maximum extent permitted by law.`;
  }

  private generateGeneralProvisions(input: PrenuptialUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}.

Dispute Resolution: ${input.disputeResolutionMechanism}

Jurisdiction for Enforcement: ${input.jurisdictionForEnforcement}

Debt Responsibility: ${input.debtResponsibility}

Children and Family Planning:
• Children from Prior Relationships: ${input.childrenFromPriorRelationships}
• Child Support Obligations: ${input.childSupportObligations}
• Future Children Arrangements: ${input.futureChildrenArrangements}
• Education Funding Responsibilities: ${input.educationFundingResponsibilities}

${input.specialCircumstances ? `Special Circumstances: ${input.specialCircumstances}` : ''}

Effective Date: This Agreement shall become effective upon the marriage of the parties on ${input.intendedMarriageDate}.

Entire Agreement: This Agreement contains the entire agreement between the parties regarding the subject matter hereof and supersedes all prior negotiations and understandings.

${input.additionalTerms || ''}`;
  }

  private generateSignatures(input: PrenuptialUserInput): string {
    return `FIRST PARTY:

_______________________
${input.prospectiveSpouse1Name}
Address: ${input.prospectiveSpouse1Address}
Date: _______________


SECOND PARTY:

_______________________
${input.prospectiveSpouse2Name}
Address: ${input.prospectiveSpouse2Address}
Date: _______________


NOTARIZATION:

State/Republic of: _______________
County/Province: _______________

On this _____ day of _________, 20__, before me personally appeared ${input.prospectiveSpouse1Name} and ${input.prospectiveSpouse2Name}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities, and that by their signatures on the instrument the persons, or the entity upon behalf of which the persons acted, executed the instrument.

_______________________
Notary Public`;
  }
}