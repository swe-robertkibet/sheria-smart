import { BaseDocumentUserInput } from '../../document';

// Data Protection Compliance Agreement User Input Interface
export interface DataProtectionComplianceUserInput extends BaseDocumentUserInput {
  // Data Controller Information
  controllerName: string;
  controllerAddress: string;
  controllerEmail?: string;
  controllerPhone?: string;
  controllerBusinessRegistration?: string;
  controllerContactPerson?: string;
  controllerContactTitle?: string;
  controllerContactEmail?: string;
  controllerContactPhone?: string;
  
  // Data Processor Information (if applicable)
  processorName?: string;
  processorAddress?: string;
  processorEmail?: string;
  processorPhone?: string;
  processorBusinessRegistration?: string;
  processorContactPerson?: string;
  processorContactTitle?: string;
  processorContactEmail?: string;
  processorContactPhone?: string;
  
  // Data Processing Context and Purpose
  processingPurpose: string;
  processingDescription?: string;
  dataCategories: string;
  dataSubjectCategories: string;
  personalDataTypes?: string;
  specialCategoryData?: string;
  dataSources?: string;
  processingActivities?: string;
  
  // Legal Basis for Processing
  legalBasisController: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  legalBasisDescription?: string;
  consentRequirements?: string;
  legitimateInterestsAssessment?: string;
  legalObligationSource?: string;
  
  // Data Subject Rights and Procedures
  dataSubjectRights: string;
  accessRequestProcedure?: string;
  rectificationProcedure?: string;
  erasureProcedure?: string;
  portabilityProcedure?: string;
  objectionProcedure?: string;
  restrictionProcedure?: string;
  automatedDecisionMaking?: string;
  responseTimeframe?: string;
  
  // Security Measures and Safeguards
  securityMeasures: string;
  technicalSafeguards?: string;
  organizationalMeasures?: string;
  accessControls?: string;
  encryptionMeasures?: string;
  backupProcedures?: string;
  incidentResponsePlan?: string;
  staffTraining?: string;
  
  // Data Breach and Notification
  breachNotificationProcedure: string;
  breachNotificationTimeframe?: string;
  supervisoryAuthorityContact?: string;
  dataSubjectNotificationCriteria?: string;
  breachAssessmentProcedure?: string;
  breachDocumentationRequirements?: string;
  
  // Data Retention and Deletion
  retentionPeriod: string;
  retentionCriteria?: string;
  deletionProcedures?: string;
  archivalRequirements?: string;
  retentionSchedule?: string;
  disposalMethods?: string;
  
  // International Transfers (if applicable)
  internationalTransfers?: string;
  transferSafeguards?: string;
  adequacyDecisionCountries?: string;
  standardContractualClauses?: string;
  bindingCorporateRules?: string;
  transferRiskAssessment?: string;
  
  // Compliance and Monitoring
  complianceMonitoring: string;
  auditProcedures?: string;
  recordKeepingRequirements?: string;
  impactAssessmentRequirements?: string;
  consultationRequirements?: string;
  complianceOfficerDetails?: string;
  
  // Processor Obligations (if applicable)
  processorObligations?: string;
  subProcessorArrangements?: string;
  processorSecurityMeasures?: string;
  processorAuditRights?: string;
  processorTerminationObligations?: string;
  
  // Governing Law and Jurisdiction
  governingLaw?: string;
  disputeResolution?: string;
  supervisoryAuthority?: string;
  
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
}

// Generated content interface for AI-generated sections
export interface GeneratedDataProtectionComplianceContent {
  partiesAndContext?: string;
  processingPurposeAndLegalBasis?: string;
  dataSubjectRightsAndProcedures?: string;
  securityMeasuresAndSafeguards?: string;
  breachNotificationAndResponse?: string;
  retentionAndDeletion?: string;
  complianceAndMonitoring?: string;
  generalProvisionsAndSignatures?: string;
}