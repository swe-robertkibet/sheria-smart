// Prenuptial Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface PrenuptialUserInput extends BaseDocumentUserInput {
  // Prospective Spouses' Details
  prospectiveSpouse1Name: string;
  prospectiveSpouse2Name: string;
  prospectiveSpouse1Address: string;
  prospectiveSpouse2Address: string;
  prospectiveSpouse1Email: string;
  prospectiveSpouse2Email: string;
  prospectiveSpouse1Phone?: string;
  prospectiveSpouse2Phone?: string;
  prospectiveSpouse1IdNumber?: string;
  prospectiveSpouse2IdNumber?: string;
  intendedMarriageDate: string;
  marriageLocation?: string;
  
  // Current Assets and Liabilities
  spouse1CurrentAssets: string;
  spouse2CurrentAssets: string;
  spouse1CurrentLiabilities: string;
  spouse2CurrentLiabilities: string;
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
  
  // Property Ownership Arrangements
  separatePropertyDefinition: string;
  maritalPropertyDefinition: string;
  propertyAcquisitionRules: string;
  realEstateOwnership: string;
  personalPropertyOwnership: string;
  appreciationRights: string;
  
  // Business Interest Protection
  spouse1BusinessInterests: string;
  spouse2BusinessInterests: string;
  businessInterestProtection: string;
  futureBusinessVentures: string;
  businessValuationMethods: string;
  
  // Spousal Support Provisions
  spousalSupportWaiver: boolean;
  spousalSupportTerms: string;
  spousalSupportDuration?: string;
  spousalSupportAmount?: string;
  spousalSupportModification: string;
  circumstancesForSupport: string;
  
  // Inheritance Rights
  inheritanceRightsWaiver: boolean;
  inheritanceRightsArrangements: string;
  estatePlanningCoordination: string;
  beneficiaryDesignations: string;
  willRequirements: string;
  
  // Financial Obligations
  debtResponsibility: string;
  jointAccountManagement: string;
  separateAccountMaintenance: string;
  expenseSharing: string;
  majorPurchaseRequirements: string;
  
  // Children and Family Planning
  childrenFromPriorRelationships: string;
  childSupportObligations: string;
  futureChildrenArrangements: string;
  educationFundingResponsibilities: string;
  
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
  
  // Modification and Enforcement
  modificationProcedures: string;
  modificationRequirements: string;
  enforceabilityProvisions: string;
  severabilityClause: string;
  
  // Jurisdiction and Dispute Resolution
  governingLaw?: string;
  disputeResolutionMechanism: string;
  jurisdictionForEnforcement: string;
  
  // Additional Terms
  sunsetProvisions?: string;
  periodicReviewRequirements?: string;
  specialCircumstances?: string;
}

export interface GeneratedPrenuptialContent {
  title: string;
  partiesAndIntendedMarriage: string;
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