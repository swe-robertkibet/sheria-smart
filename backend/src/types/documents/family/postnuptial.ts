// Postnuptial Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface PostnuptialUserInput extends BaseDocumentUserInput {
  // Married Spouses' Details
  spouse1Name: string;
  spouse2Name: string;
  spouse1Address: string;
  spouse2Address: string;
  spouse1Email: string;
  spouse2Email: string;
  spouse1Phone?: string;
  spouse2Phone?: string;
  spouse1IdNumber?: string;
  spouse2IdNumber?: string;
  marriageDate: string;
  marriageLocation?: string;
  
  // Pre-Marriage Assets and Liabilities
  spouse1PreMaritalAssets: string;
  spouse2PreMaritalAssets: string;
  spouse1PreMaritalLiabilities: string;
  spouse2PreMaritalLiabilities: string;
  
  // Current Assets and Liabilities (including marital property)
  spouse1CurrentAssets: string;
  spouse2CurrentAssets: string;
  spouse1CurrentLiabilities: string;
  spouse2CurrentLiabilities: string;
  maritalAssetsAcquired: string;
  maritalLiabilitiesIncurred: string;
  spouse1NetWorth: string;
  spouse2NetWorth: string;
  
  // Income and Earning Capacity
  spouse1CurrentIncome: string;
  spouse2CurrentIncome: string;
  spouse1IncomeSource: string;
  spouse2IncomeSource: string;
  spouse1EarningCapacity: string;
  spouse2EarningCapacity: string;
  spouse1ProfessionalQualifications: string;
  spouse2ProfessionalQualifications: string;
  incomeChangesSpouseMarriage: string;
  
  // Property Ownership Arrangements
  separatePropertyDefinition: string;
  maritalPropertyDefinition: string;
  propertyAcquisitionRules: string;
  realEstateOwnership: string;
  personalPropertyOwnership: string;
  appreciationRights: string;
  premaritalPropertyTransformation: string;
  
  // Business Interest Protection
  spouse1BusinessInterests: string;
  spouse2BusinessInterests: string;
  businessInterestProtection: string;
  futureBusinessVentures: string;
  businessValuationMethods: string;
  businessOperationsDuringMarriage: string;
  
  // Spousal Support Provisions
  spousalSupportWaiver: boolean;
  spousalSupportTerms: string;
  spousalSupportDuration?: string;
  spousalSupportAmount?: string;
  spousalSupportModification: string;
  circumstancesForSupport: string;
  rehabilitativeSupport: string;
  
  // Inheritance Rights
  inheritanceRightsWaiver: boolean;
  inheritanceRightsArrangements: string;
  estatePlanningCoordination: string;
  beneficiaryDesignations: string;
  willRequirements: string;
  survivorshipRights: string;
  
  // Financial Obligations and Management
  debtResponsibility: string;
  jointAccountManagement: string;
  separateAccountMaintenance: string;
  expenseSharing: string;
  majorPurchaseRequirements: string;
  householdExpenseAllocation: string;
  financialDecisionMaking: string;
  
  // Children and Family Obligations
  childrenFromPriorRelationships: string;
  childSupportObligations: string;
  existingChildrenArrangements: string;
  futureChildrenArrangements: string;
  educationFundingResponsibilities: string;
  custodyConsiderations: string;
  
  // Legal Representation Confirmation
  spouse1LegalRepresentation: boolean;
  spouse2LegalRepresentation: boolean;
  spouse1AttorneyName?: string;
  spouse2AttorneyName?: string;
  spouse1AttorneyContact?: string;
  spouse2AttorneyContact?: string;
  independentLegalAdviceConfirmation: string;
  
  // Disclosure and Fairness
  fullFinancialDisclosure: boolean;
  disclosureDocumentsProvided: string;
  voluntaryExecution: boolean;
  duressOrCoercionAbsence: string;
  fairnessAtExecution: string;
  changedCircumstances: string;
  
  // Modification and Enforcement
  modificationProcedures: string;
  modificationRequirements: string;
  enforceabilityProvisions: string;
  severabilityClause: string;
  periodicReviewTriggers: string;
  
  // Tax Considerations
  taxFilingStatus: string;
  taxLiabilityAllocation: string;
  deductionAllocation: string;
  retirementAccountBenefits: string;
  
  // Jurisdiction and Dispute Resolution
  governingLaw?: string;
  disputeResolutionMechanism: string;
  jurisdictionForEnforcement: string;
  
  // Reconciliation and Separation
  reconciliationProcedures?: string;
  separationArrangements?: string;
  temporarySupportDuringSeparation?: string;
  
  // Additional Terms and Special Circumstances
  sunsetProvisions?: string;
  periodicReviewRequirements?: string;
  specialCircumstances?: string;
  reasonForPostnuptialAgreement: string;
}

export interface GeneratedPostnuptialContent {
  title: string;
  partiesAndMarriage: string;
  reasonsAndCircumstances: string;
  financialDisclosure: string;
  separateProperty: string;
  maritalProperty: string;
  spousalSupport: string;
  inheritanceRights: string;
  businessInterests: string;
  legalRepresentation: string;
  modificationProcedures: string;
  enforceabilityProvisions: string;
  generalProvisions: string;
  signatures: string;
}