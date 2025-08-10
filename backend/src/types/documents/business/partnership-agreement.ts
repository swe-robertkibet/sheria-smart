// Partnership Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface PartnerDetails {
  partnerName: string;
  partnerAddress: string;
  partnerEmail: string;
  partnerPhone?: string;
  capitalContribution: string;
  contributionType: 'cash' | 'assets' | 'services' | 'mixed';
  profitSharePercentage: string;
  lossSharePercentage: string;
  managementRole?: string;
}

export interface PartnershipAgreementUserInput extends BaseDocumentUserInput {
  // Partnership Details
  partnershipName: string;
  businessPurpose: string;
  partnershipType: 'general' | 'limited' | 'limited_liability';
  businessAddress: string;
  
  // Partners Information
  partners: PartnerDetails[];
  
  // Financial Structure
  totalCapitalContribution: string;
  profitDistributionMethod: string;
  lossAllocationMethod: string;
  capitalAccountMaintenance: string;
  
  // Management Structure
  managementStructure: string;
  decisionMakingProcess: string;
  signatoryAuthority: string;
  meetingRequirements?: string;
  
  // Operations
  bankingArrangements: string;
  bookkeepingResponsibilities: string;
  taxResponsibilities: string;
  
  // Partner Rights and Duties
  partnerDutiesAndRestrictions: string;
  nonCompeteProvisions?: string;
  confidentialityObligations: string;
  
  // Withdrawal and Addition
  partnerWithdrawalProcess: string;
  newPartnerAdmissionProcess: string;
  
  // Dissolution
  dissolutionTriggers: string;
  dissolutionProcedures: string;
  assetDistribution: string;
}

export interface GeneratedPartnershipAgreementContent {
  title: string;
  partnershipFormation: string;
  nameAndBusinessPurpose: string;
  capitalContributions: string;
  profitAndLossSharing: string;
  managementAndAuthority: string;
  booksAndRecords: string;
  partnerDutiesAndRestrictions: string;
  admissionAndWithdrawal: string;
  dissolutionProcedures: string;
  generalProvisions: string;
  signatures: string;
}