// Articles of Association interfaces
import { BaseDocumentUserInput } from '../../document';

export interface ArticlesOfAssociationUserInput extends BaseDocumentUserInput {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyRegistrationNumber?: string;
  companyType: 'private' | 'public' | 'limited' | 'unlimited';
  businessObjectives: string;
  
  // Share Capital Structure
  authorizedShareCapital: string;
  shareNominalValue: string;
  shareClasses?: string;
  shareCapitalStructure: string;
  initialShareAllocation: string;
  
  // Director Information
  directorPowers: string;
  directorQualifications?: string;
  directorLimitations: string;
  boardComposition: string;
  directorAppointmentProcedure: string;
  directorRemovalProcedure: string;
  
  // Shareholder Rights
  shareholderRights: string;
  votingRights: string;
  shareholderMeetingRights: string;
  informationRights: string;
  preemptionRights?: string;
  
  // Meeting Procedures
  meetingProcedures: string;
  boardMeetingProcedures: string;
  generalMeetingProcedures: string;
  noticeRequirements: string;
  quorumRequirements: string;
  votingProcedures: string;
  
  // Financial Provisions
  dividendRules: string;
  dividendDeclarationProcedure: string;
  profitDistribution: string;
  reserveFunds?: string;
  
  // Transfer and Ownership
  transferRestrictions: string;
  shareTransferProcedure: string;
  transferApprovalRequirements?: string;
  rightOfFirstRefusal?: string;
  
  // Company Operations
  auditRequirements: string;
  accountingStandards: string;
  financialReporting: string;
  recordKeeping: string;
  
  // Amendment and Winding Up
  amendmentProcedures: string;
  specialResolutionRequirements: string;
  windingUpProcedures: string;
  assetDistribution: string;
  
  // Additional Provisions
  indemnityProvisions?: string;
  conflictOfInterestRules?: string;
  complianceRequirements?: string;
  additionalClauses?: string;
}

export interface GeneratedArticlesOfAssociationContent {
  title: string;
  companyNameAndObjects: string;
  shareCapitalAndShares: string;
  variationOfRights: string;
  shareTransfers: string;
  generalMeetings: string;
  directors: string;
  boardMeetings: string;
  dividends: string;
  accountsAndAudit: string;
  notices: string;
  indemnity: string;
  windingUp: string;
  signatures: string;
}