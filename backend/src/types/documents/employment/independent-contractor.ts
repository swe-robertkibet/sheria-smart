// Independent Contractor Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface IndependentContractorUserInput extends BaseDocumentUserInput {
  // Contractor Information
  contractorName: string;
  contractorAddress: string;
  contractorEmail: string;
  contractorPhone?: string;
  contractorBusinessRegistration?: string;
  contractorKraPin?: string;
  
  // Client Information
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone?: string;
  clientBusinessRegistration: string;
  
  // Service Details
  servicesDescription: string;
  projectScope: string;
  deliverablesSpecifications: string;
  performanceStandards: string;
  
  // Timeline and Schedule
  projectStartDate: string;
  projectEndDate?: string;
  projectDuration: string;
  workSchedule?: string;
  keyMilestones?: string;
  
  // Compensation
  compensationStructure: 'fixed_fee' | 'hourly_rate' | 'milestone_based' | 'retainer';
  totalCompensation?: string;
  hourlyRate?: string;
  paymentSchedule: string;
  paymentTerms: string;
  expenseReimbursement?: string;
  
  // Work Arrangements
  workLocation: string;
  equipmentAndMaterials: string;
  clientProvidedResources?: string;
  
  // Intellectual Property
  intellectualPropertyOwnership: string;
  workForHireProvisions: string;
  preExistingIPRights?: string;
  
  // Confidentiality and Non-Disclosure
  confidentialityObligations: string;
  nonDisclosureTerms: string;
  
  // Termination
  terminationConditions: string;
  terminationNoticeRequired: string;
  
  // Independent Contractor Status
  independentContractorAcknowledgment: string;
  taxResponsibilities: string;
  insuranceRequirements?: string;
}

export interface GeneratedIndependentContractorContent {
  title: string;
  independentContractorRelationship: string;
  servicesAndDeliverables: string;
  compensation: string;
  expenses: string;
  timelineAndDeadlines: string;
  intellectualProperty: string;
  confidentiality: string;
  equipmentAndMaterials: string;
  termination: string;
  taxAndInsurance: string;
  generalProvisions: string;
  signatures: string;
}