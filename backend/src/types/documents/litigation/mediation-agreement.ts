import { BaseDocumentUserInput } from '../../document';

// Mediation Agreement user input interface
export interface MediationAgreementUserInput extends BaseDocumentUserInput {
  // Party 1 Information
  party1Name: string;
  party1Address: string;
  party1Email?: string;
  party1Phone?: string;
  party1LegalRep?: string;
  party1LegalRepFirm?: string;
  party1LegalRepAddress?: string;
  
  // Party 2 Information
  party2Name: string;
  party2Address: string;
  party2Email?: string;
  party2Phone?: string;
  party2LegalRep?: string;
  party2LegalRepFirm?: string;
  party2LegalRepAddress?: string;
  
  // Dispute Background and Context
  disputeDescription: string;
  disputeBackground?: string;
  disputeSubjectMatter?: string;
  disputeValue?: string;
  priorNegotiationAttempts?: string;
  urgencyFactors?: string;
  
  // Mediation Process and Structure
  mediationObjectives?: string;
  mediationTimeline?: string;
  mediationVenue?: string;
  mediationLanguage?: string;
  mediationProcedures: string;
  sessionScheduling?: string;
  documentDisclosure?: string;
  preparatorySteps?: string;
  
  // Mediator Selection and Qualifications
  mediatorSelection: string;
  mediatorQualifications?: string;
  mediatorAppointmentProcess?: string;
  mediatorChallengeProcess?: string;
  mediatorRemunerationRate?: string;
  alternativeMediatorProvisions?: string;
  
  // Cost Sharing and Financial Arrangements
  costSharing: string;
  mediatorFeeAllocation?: string;
  venueAndFacilityCosts?: string;
  administrativeFees?: string;
  paymentSchedule?: string;
  currency?: string;
  
  // Confidentiality and Non-Disclosure
  confidentialityLevel?: 'strict' | 'standard' | 'limited';
  confidentialityProvisions: string;
  confidentialityScope?: string;
  confidentialityExceptions?: string;
  documentProtection?: string;
  mediatorDisclosureRestrictions?: string;
  
  // Legal Framework and Compliance
  governingLaw?: string;
  mediationRules?: 'ad_hoc' | 'ciarb_rules' | 'ncia_rules' | 'uncitral_conciliation' | 'custom_rules';
  customRulesDescription?: string;
  legalRepresentationRights?: string;
  complianceRequirements?: string;
  
  // Settlement and Outcome Provisions
  settlementAuthority?: string;
  bindingSettlementProcess?: string;
  partialSettlementProvisions?: string;
  implementationProcedures?: string;
  postMediationObligations?: string;
  
  // Termination and Alternative Procedures
  terminationConditions?: string;
  terminationNoticeRequirements?: string;
  unsuccessfulMediationConsequences?: string;
  alternativeDisputeResolution?: string;
  courtProceedingsRestrictions?: string;
  
  // General Provisions
  communicationProtocol?: string;
  amendmentProcedures?: string;
  forceeMajeureProvisions?: string;
  noticeRequirements?: string;
  jurisdiction?: string;
  
  // Execution Details
  effectiveDate: string;
  mediationCommencementDate?: string;
  signatureRequirements?: string;
  witnessRequirements?: string;
  notarizationRequirements?: string;
  
  // Additional Terms
  additionalTerms?: string;
  specialConditions?: string;
}

// Generated content interface for AI-created sections
export interface GeneratedMediationAgreementContent {
  partiesAndBackground?: string;
  mediationProcessDefinition?: string;
  mediatorSelectionAndProcedures?: string;
  costSharingAndFinancialTerms?: string;
  confidentialityProvisions?: string;
  generalProvisionsAndSignatures?: string;
}