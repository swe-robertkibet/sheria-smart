// Service Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface ServiceAgreementUserInput extends BaseDocumentUserInput {
  // Service Provider Information
  serviceProviderName: string;
  serviceProviderAddress: string;
  serviceProviderEmail: string;
  serviceProviderPhone?: string;
  serviceProviderBusinessRegistration?: string;
  
  // Client Information
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone?: string;
  
  // Service Details
  scopeOfServices: string;
  deliverablesDescription: string;
  serviceTimeline: string;
  milestones?: string;
  
  // Financial Terms
  feeStructure: string;
  paymentTerms: string;
  expenseReimbursement?: string;
  
  // Intellectual Property
  intellectualPropertyOwnership: string;
  workProductRights: string;
  preExistingIPRights?: string;
  
  // Confidentiality and Legal
  confidentialityRequirements: string;
  independentContractorStatus: string;
  liabilityLimitations: string;
  
  // Termination and Miscellaneous
  terminationConditions: string;
  terminationNotice: string;
  disputeResolution?: string;
  governingLaw?: string;
  insuranceRequirements?: string;
}

export interface GeneratedServiceAgreementContent {
  title: string;
  partiesAndAppointment: string;
  servicesAndDeliverables: string;
  timelineAndMilestones: string;
  feesAndExpenses: string;
  intellectualProperty: string;
  confidentiality: string;
  independentContractorStatus: string;
  liabilityLimitations: string;
  terminationProvisions: string;
  generalProvisions: string;
  signatures: string;
}