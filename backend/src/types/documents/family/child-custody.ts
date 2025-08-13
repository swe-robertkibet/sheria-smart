// Child Custody & Support Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface ChildCustodyUserInput extends BaseDocumentUserInput {
  // Parent/Guardian 1 Information
  parent1Name: string;
  parent1Address: string;
  parent1Email: string;
  parent1Phone?: string;
  parent1IdNumber?: string;
  parent1Occupation?: string;
  parent1EmployerName?: string;
  parent1EmployerAddress?: string;
  parent1MonthlyIncome: string;
  parent1FinancialStatus: string;
  
  // Parent/Guardian 2 Information
  parent2Name: string;
  parent2Address: string;
  parent2Email: string;
  parent2Phone?: string;
  parent2IdNumber?: string;
  parent2Occupation?: string;
  parent2EmployerName?: string;
  parent2EmployerAddress?: string;
  parent2MonthlyIncome: string;
  parent2FinancialStatus: string;
  
  // Child/Children Information
  childrenDetails: string; // Names, ages, birthdates, current residence
  numberOfChildren: number;
  childrenCurrentLivingArrangement: string;
  childrenSchoolInformation: string;
  childrenSpecialNeeds?: string;
  childrenMedicalInformation?: string;
  childrenPreferences?: string; // For older children
  
  // Current Custody Arrangement
  currentCustodyArrangement: string;
  reasonForCustodyAgreement: string;
  existingCourtOrders?: string;
  previousCustodyModifications?: string;
  
  // Physical Custody Arrangements
  primaryPhysicalCustodyParent: string;
  physicalCustodySchedule: string;
  weekdaySchedule: string;
  weekendSchedule: string;
  schoolYearSchedule: string;
  summerVacationSchedule: string;
  holidaySchedule: string;
  specialOccasionSchedule: string;
  pickupDropoffLocations: string;
  pickupDropoffTimes: string;
  transportationResponsibilities: string;
  
  // Legal Custody and Decision Making
  legalCustodyArrangement: string; // Joint or sole
  educationalDecisionMaking: string;
  medicalDecisionMaking: string;
  religiousDecisionMaking: string;
  extracurricularDecisionMaking: string;
  majorDecisionConsultation: string;
  emergencyDecisionProcedures: string;
  schoolCommunicationRights: string;
  medicalRecordAccess: string;
  
  // Child Support Provisions
  childSupportAmount: string;
  childSupportPayingParent: string;
  childSupportFrequency: string; // Monthly, bi-weekly, weekly
  childSupportPaymentMethod: string;
  childSupportStartDate: string;
  childSupportCalculationBasis: string;
  childSupportIncomeConsiderations: string;
  additionalChildSupportExpenses: string;
  medicalInsuranceResponsibility: string;
  medicalExpenseSharing: string;
  educationalExpenseSharing: string;
  extracurricularExpenseSharing: string;
  childcareExpenseSharing: string;
  
  // Communication and Contact Provisions
  communicationBetweenParents: string;
  communicationWithChildren: string;
  phoneCallSchedule?: string;
  emailCommunicationGuidelines?: string;
  emergencyContactProcedures: string;
  thirdPartyContactRestrictions?: string;
  socialMediaGuidelines?: string;
  
  // Travel and Relocation
  travelPermissionRequirements: string;
  vacationTravelNotice: string;
  internationalTravelRestrictions?: string;
  relocationNoticeRequirements: string;
  relocationApprovalProcess: string;
  geographicRestrictions?: string;
  
  // Safety and Supervision
  supervisionRequirements?: string;
  substanceAbuseRestrictions?: string;
  domesticViolenceProtections?: string;
  backgroundCheckRequirements?: string;
  thirdPartyCustodyRestrictions?: string;
  childSafetyProvisions: string;
  
  // Modification Procedures
  modificationProcedures: string;
  modificationRequirements: string;
  materialChangeCircumstances: string;
  mediationRequirement: boolean;
  courtApprovalRequirement: boolean;
  noticeRequirementForModification: string;
  
  // Dispute Resolution
  disputeResolutionMechanism: string;
  mediationRequirements: string;
  arbitrationProvisions?: string;
  courtJurisdiction: string;
  attorneyFeesAllocation?: string;
  
  // Enforcement Provisions
  enforcementMechanisms: string;
  contemptProcedures: string;
  makeupTimeProvisions: string;
  penaltiesForViolation: string;
  bondingRequirements?: string;
  
  // Additional Provisions
  childTaxExemptionAllocation: string;
  insuranceBeneficiaryDesignations: string;
  estatePlanningConsiderations?: string;
  specialCircumstances?: string;
  additionalTerms?: string;
  
  // Legal Representation and Disclosure
  parent1LegalRepresentation: boolean;
  parent2LegalRepresentation: boolean;
  parent1AttorneyName?: string;
  parent2AttorneyName?: string;
  parent1AttorneyContact?: string;
  parent2AttorneyContact?: string;
  independentLegalAdviceConfirmation: string;
  
  // Acknowledgments
  bestInterestOfChildAcknowledgment: string;
  voluntaryAgreementAcknowledgment: boolean;
  fullDisclosureAcknowledgment: boolean;
  duressOrCoercionAbsence: string;
  
  // Jurisdiction and Governing Law
  governingLaw?: string;
  courtJurisdictionForEnforcement: string;
}

export interface GeneratedChildCustodyContent {
  title: string;
  partiesAndChildrenIdentification: string;
  custodyBackground: string;
  physicalCustodyArrangements: string;
  legalCustodyAndDecisionMaking: string;
  childSupportProvisions: string;
  visitationAndParentingSchedule: string;
  communicationAndContactProvisions: string;
  modificationProcedures: string;
  disputeResolutionAndEnforcement: string;
  additionalProvisionsAndSafeguards: string;
  generalProvisions: string;
  signatures: string;
}