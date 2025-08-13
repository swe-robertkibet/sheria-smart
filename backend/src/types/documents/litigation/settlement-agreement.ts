// Settlement Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface SettlementAgreementUserInput extends BaseDocumentUserInput {
  // Disputing Party 1 Information
  disputeParty1Name: string;
  disputeParty1Address: string;
  disputeParty1Email: string;
  disputeParty1Phone?: string;
  disputeParty1LegalRep?: string;
  disputeParty1LegalRepAddress?: string;
  
  // Disputing Party 2 Information
  disputeParty2Name: string;
  disputeParty2Address: string;
  disputeParty2Email: string;
  disputeParty2Phone?: string;
  disputeParty2LegalRep?: string;
  disputeParty2LegalRepAddress?: string;
  
  // Additional Parties (if applicable)
  additionalParties?: string;
  
  // Dispute Background and Description
  disputeDescription: string;
  disputeBackground: string;
  disputeOriginDate?: string;
  disputeLocation?: string;
  disputeSubjectMatter: string;
  claimsAndCounterclaims: string;
  legalProceedingsCaseNumber?: string;
  courtJurisdiction?: string;
  
  // Settlement Terms and Agreements
  settlementTerms: string;
  settlementDescription: string;
  settlementConsideration: string;
  
  // Payment Provisions
  settlementAmount?: string;
  paymentStructure?: string;
  paymentSchedule?: string;
  paymentMethod?: string;
  paymentDueDate?: string;
  latePaymentPenalties?: string;
  
  // Non-Monetary Settlement Terms
  nonMonetaryTerms?: string;
  performanceObligations: string;
  performanceDeadlines?: string;
  deliverables?: string;
  complianceRequirements?: string;
  
  // Release of Claims
  releaseOfClaimsScope: string;
  mutualRelease?: 'yes' | 'no';
  reservedRights?: string;
  excludedClaims?: string;
  releaseCoverage: 'specific' | 'broad' | 'mutual';
  thirdPartyReleases?: string;
  
  // Confidentiality and Non-Disclosure
  confidentialityProvisions: string;
  confidentialityDuration?: string;
  publicDisclosureRestrictions?: string;
  mediaStatementRestrictions?: string;
  nonDisparagement?: 'yes' | 'no';
  nonDisparagementTerms?: string;
  
  // Compliance and Monitoring
  complianceMonitoring?: string;
  reportingRequirements?: string;
  auditRights?: string;
  oversightMechanisms?: string;
  
  // Default and Enforcement
  defaultConsequences: string;
  breachRemedyProcedures: string;
  enforcementMechanisms: string;
  liquidatedDamages?: string;
  specificPerformanceRights?: string;
  accelerationClauses?: string;
  
  // Dispute Resolution for Future Issues
  futureDisputeResolution?: string;
  mediationRequirements?: string;
  arbitrationProvisions?: string;
  
  // Legal and Administrative
  governingLaw?: string;
  jurisdiction?: string;
  legalCosts?: string;
  attorneyFeesAllocation?: string;
  
  // Execution and Effectiveness
  executionRequirements?: string;
  effectivenessConditions?: string;
  approvalRequirements?: string;
  courtApprovalRequired?: 'yes' | 'no';
  
  // Miscellaneous Provisions
  entireAgreementClause?: string;
  amendmentProcedures?: string;
  severabilityProvisions?: string;
  successorObligations?: string;
  noticeRequirements?: string;
  interpretationRules?: string;
}

export interface GeneratedSettlementAgreementContent {
  title: string;
  partiesAndBackground: string;
  disputeDescription: string;
  settlementTerms: string;
  paymentProvisions: string;
  releaseOfClaims: string;
  confidentialityProvisions: string;
  performanceObligations: string;
  defaultAndEnforcement: string;
  generalProvisions: string;
  signatures: string;
}