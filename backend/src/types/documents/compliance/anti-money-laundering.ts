import { BaseDocumentUserInput } from '../../document';

// Anti-Money Laundering Compliance User Input Interface
export interface AntiMoneyLaunderingComplianceUserInput extends BaseDocumentUserInput {
  // Institution Information
  institutionName: string;
  institutionAddress: string;
  institutionEmail?: string;
  institutionPhone?: string;
  institutionBusinessRegistration?: string;
  institutionLicenseNumber?: string;
  institutionType: 'bank' | 'microfinance' | 'sacco' | 'forex_bureau' | 'money_remittance' | 'insurance' | 'securities_dealer' | 'other';
  institutionBusinessType?: string;
  
  // Compliance Officer Information
  complianceOfficerName: string;
  complianceOfficerTitle?: string;
  complianceOfficerEmail?: string;
  complianceOfficerPhone?: string;
  complianceOfficerQualifications?: string;
  complianceOfficerExperience?: string;
  complianceOfficerDesignationDate?: string;
  
  // AML Policy Framework
  amlPolicyFramework: string;
  policyObjectives?: string;
  policyScope?: string;
  policyApprovalAuthority?: string;
  policyReviewFrequency?: string;
  policyLastReviewDate?: string;
  policyNextReviewDate?: string;
  
  // Customer Due Diligence (CDD)
  customerDueDiligenceProcedures: string;
  customerIdentificationRequirements?: string;
  enhancedDueDiligenceThresholds?: string;
  simplifiedDueDiligenceCriteria?: string;
  ongoingMonitoringProcedures?: string;
  customerRiskAssessmentCriteria?: string;
  
  // Know Your Customer (KYC) Requirements
  kycRequirements: string;
  kycDocumentationRequirements?: string;
  customerVerificationProcedures?: string;
  businessRelationshipPurpose?: string;
  sourceOfFundsVerification?: string;
  beneficialOwnershipIdentification?: string;
  
  // Transaction Monitoring
  transactionMonitoring: string;
  transactionMonitoringSystem?: string;
  suspiciousTransactionThresholds?: string;
  transactionReportingTriggers?: string;
  monitoringFrequency?: string;
  automaticMonitoringTools?: string;
  manualReviewProcedures?: string;
  
  // Suspicious Activity Reporting (SAR)
  suspiciousActivityReporting: string;
  sarReportingThresholds?: string;
  sarReportingTimeframes?: string;
  sarReportingAuthority?: string;
  sarInternalReportingProcedures?: string;
  sarInvestigationProcedures?: string;
  sarRecordKeeping?: string;
  
  // Currency Transaction Reporting (CTR)
  currencyTransactionReporting?: string;
  ctrReportingThresholds?: string;
  ctrReportingTimeframes?: string;
  ctrExemptionCriteria?: string;
  ctrRecordKeeping?: string;
  
  // Record Keeping Requirements
  recordKeepingRequirements: string;
  recordRetentionPeriods?: string;
  recordStorageProcedures?: string;
  recordAccessProcedures?: string;
  recordBackupProcedures?: string;
  recordDestructionProcedures?: string;
  
  // Training Programs
  trainingPrograms: string;
  trainingFrequency?: string;
  trainingContent?: string;
  trainingTargetAudience?: string;
  trainingEffectivenessAssessment?: string;
  trainingRecordKeeping?: string;
  
  // Risk Assessment
  riskAssessmentProcedures: string;
  institutionalRiskAssessment?: string;
  customerRiskRating?: string;
  productRiskAssessment?: string;
  geographicRiskAssessment?: string;
  riskAssessmentFrequency?: string;
  riskMitigationMeasures?: string;
  
  // Sanctions Screening
  sanctionsScreeningProcedures?: string;
  sanctionsListsUsed?: string;
  sanctionsScreeningFrequency?: string;
  sanctionsMatchHandling?: string;
  sanctionsRecordKeeping?: string;
  
  // Politically Exposed Persons (PEP) Management
  pepManagementProcedures?: string;
  pepIdentificationCriteria?: string;
  pepApprovalRequirements?: string;
  pepOngoingMonitoring?: string;
  pepRecordKeeping?: string;
  
  // Third Party Risk Management
  thirdPartyRiskManagement?: string;
  thirdPartyDueDiligence?: string;
  correspondentBankingControls?: string;
  agentNetworkControls?: string;
  outsourcingRiskManagement?: string;
  
  // Reporting Obligations
  reportingObligations: string;
  regulatoryReportingRequirements?: string;
  frcReportingRequirements?: string;
  cbkReportingRequirements?: string;
  reportingDeadlines?: string;
  reportingFormats?: string;
  
  // Internal Controls and Audit
  internalControls?: string;
  internalAuditProcedures?: string;
  independentTestingRequirements?: string;
  controlDeficiencyReporting?: string;
  correctiveActionProcedures?: string;
  
  // Technology and Systems
  technologySystems?: string;
  amlSoftwareSystems?: string;
  dataIntegrityControls?: string;
  systemAccessControls?: string;
  systemBackupProcedures?: string;
  cybersecurityMeasures?: string;
  
  // Cross-Border Transaction Controls
  crossBorderControls?: string;
  wireTransferRequirements?: string;
  currencyExchangeControls?: string;
  internationalSanctionsCompliance?: string;
  
  // Customer Communication
  customerCommunication?: string;
  privacyNoticeRequirements?: string;
  customerNotificationProcedures?: string;
  customerComplaintHandling?: string;
  
  // Regulatory Liaison
  regulatoryLiaison?: string;
  regulatoryCommunication?: string;
  examinationPreparation?: string;
  regulatoryChangeManagement?: string;
  
  // Penalties and Enforcement
  penaltiesAndEnforcement?: string;
  violationHandlingProcedures?: string;
  disciplinaryActions?: string;
  correctionMeasures?: string;
  
  // Business Continuity
  businessContinuityPlanning?: string;
  amlContinuityProcedures?: string;
  emergencyContactProcedures?: string;
  backupSystemsProcedures?: string;
  
  // Governing Law and Jurisdiction
  governingLaw?: string;
  regulatoryAuthority?: string;
  disputeResolution?: string;
  jurisdictionClauses?: string;
  
  // Implementation and Monitoring
  implementationTimeline?: string;
  monitoringProcedures?: string;
  complianceReviewSchedule?: string;
  effectivenessAssessment?: string;
  continuousImprovement?: string;
  
  // Amendment and Termination
  amendmentProcedures?: string;
  terminationConditions?: string;
  terminationNotice?: string;
  postTerminationObligations?: string;
  
  // Signatures and Effective Date
  effectiveDate: string;
  signatureRequirements?: string;
  witnessRequirements?: string;
  notarizationRequirements?: string;
  boardApprovalDate?: string;
  managementApprovalDate?: string;
}

// Generated content interface for AI-generated sections
export interface GeneratedAntiMoneyLaunderingComplianceContent {
  amlPolicyFramework?: string;
  customerDueDiligence?: string;
  transactionMonitoring?: string;
  suspiciousActivityReporting?: string;
  recordKeeping?: string;
  trainingRequirements?: string;
  complianceOversight?: string;
  riskAssessment?: string;
  auditProcedures?: string;
}