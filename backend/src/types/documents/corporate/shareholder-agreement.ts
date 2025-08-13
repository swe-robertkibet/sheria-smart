// Shareholder Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface ShareholderInfo {
  shareholderName: string;
  shareholderAddress: string;
  shareholderEmail?: string;
  shareholderPhone?: string;
  shareholdingPercentage: string;
  shareClass?: string;
  numberOfShares: string;
  contributionAmount?: string;
}

export interface ShareholderAgreementUserInput extends BaseDocumentUserInput {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyRegistrationNumber?: string;
  companyBusinessType: string;
  incorporationDate?: string;
  authorizedShareCapital: string;
  
  // Shareholder Information
  shareholdingPercentages: string;
  totalSharesIssued: string;
  shareClasses?: string;
  shareNominalValue: string;
  paidUpCapital: string;
  
  // Individual Shareholders (simplified as text fields for now)
  shareholder1Name: string;
  shareholder1Address: string;
  shareholder1Email?: string;
  shareholder1Percentage: string;
  shareholder1Shares: string;
  
  shareholder2Name: string;
  shareholder2Address: string;
  shareholder2Email?: string;
  shareholder2Percentage: string;
  shareholder2Shares: string;
  
  // Additional shareholders as optional
  shareholder3Name?: string;
  shareholder3Address?: string;
  shareholder3Email?: string;
  shareholder3Percentage?: string;
  shareholder3Shares?: string;
  
  // Board and Management
  boardRepresentation: string;
  boardSize: string;
  directorAppointmentRights: string;
  managementStructure: string;
  votingAgreements: string;
  quorumRequirements: string;
  chairmanAppointment?: string;
  
  // Transfer Restrictions
  transferRestrictions: string;
  rightOfFirstRefusal: string;
  tagAlongRights?: string;
  dragAlongRights?: string;
  transferApprovalProcess: string;
  valuationForTransfers: string;
  restrictedTransferees?: string;
  
  // Information Rights
  informationRights: string;
  financialReporting: string;
  inspectionRights: string;
  boardMeetingRights: string;
  auditRights?: string;
  recordAccessRights: string;
  
  // Financing and Dividends
  dividendPolicy: string;
  preemptionRights: string;
  antiDilutionProvisions?: string;
  capitalCallProcedures?: string;
  liquidationPreferences?: string;
  distributionPolicy: string;
  
  // Exit Mechanisms
  exitMechanisms: string;
  buyoutTriggers?: string;
  valuationMethods: string;
  compulsoryTransferEvents?: string;
  retirementProvisions?: string;
  deathDisabilityProvisions?: string;
  
  // Dispute Resolution and Governance
  disputeResolution: string;
  deadlockResolution: string;
  governingLaw?: string;
  arbitrationProvisions?: string;
  
  // Restrictive Covenants
  nonCompeteRestrictions?: string;
  confidentialityObligations: string;
  nonSolicitationClauses?: string;
  businessOpportunityRights?: string;
  
  // Additional Terms
  amendmentProcedures: string;
  terminationConditions: string;
  successorObligations?: string;
  entireAgreementClause?: string;
  severabilityProvisions?: string;
}

export interface GeneratedShareholderAgreementContent {
  title: string;
  partiesAndShareholdings: string;
  managementAndControl: string;
  transferRestrictions: string;
  informationRights: string;
  financingArrangements: string;
  exitProvisions: string;
  disputeResolution: string;
  generalProvisions: string;
  signatures: string;
}