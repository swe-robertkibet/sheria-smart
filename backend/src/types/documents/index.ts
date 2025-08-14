// Export all document type interfaces

// Business & Commercial
export * from './business/sales-purchase';
export * from './business/distribution-agreement';
export * from './business/partnership-agreement';
export * from './business/service-agreement';

// Employment & HR
export * from './employment/enhanced-employment-contract';
export * from './employment/independent-contractor';
export * from './employment/non-compete';

// Property & Real Estate
export * from './property/enhanced-lease';
export * from './property/sale-of-land';
export * from './property/property-management';

// Family Law
export * from './family/prenuptial';

// Intellectual Property
export * from './intellectual-property/copyright-assignment';
export * from './intellectual-property/trademark-license';
export * from './intellectual-property/patent-licensing';

// Corporate Governance
export * from './corporate/articles-of-association';
export * from './corporate/shareholder-agreement';
export * from './corporate/board-resolution';

// Litigation & Dispute Resolution
export * from './litigation/settlement-agreement';
export * from './litigation/arbitration-agreement';
export * from './litigation/mediation-agreement';

// Regulatory & Compliance
export * from './compliance/data-protection-compliance';
export * from './compliance/anti-money-laundering';

// Family Law (simplified interfaces for remaining categories)

export interface PostnuptialUserInput {
  spouseName1: string;
  spouseName2: string;
  spouse1Address: string;
  spouse2Address: string;
  spouse1Email: string;
  spouse2Email: string;
  marriageDate: string;
  currentFinancialSituation: string;
  propertyDivisionArrangements: string;
  supportObligations: string;
  debtAllocation: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface ChildCustodyUserInput {
  parent1Name: string;
  parent2Name: string;
  parent1Address: string;
  parent2Address: string;
  parent1Email: string;
  parent2Email: string;
  childName: string;
  childDateOfBirth: string;
  custodyArrangement: 'joint' | 'sole_parent1' | 'sole_parent2';
  visitationSchedule: string;
  childSupportAmount: string;
  healthcareArrangements: string;
  educationDecisions: string;
  effectiveDate: string;
  additionalTerms?: string;
}

// Intellectual Property (moved to dedicated files)

export interface TrademarkLicenseUserInput {
  licensorName: string;
  licenseeName: string;
  licensorAddress: string;
  licenseeAddress: string;
  trademarkDescription: string;
  licensedProducts: string;
  territory: string;
  exclusivity: 'exclusive' | 'non-exclusive';
  royaltyStructure: string;
  qualityControlStandards: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface PatentLicensingUserInput {
  patentOwnerName: string;
  licenseeName: string;
  patentOwnerAddress: string;
  licenseeAddress: string;
  patentDescription: string;
  patentNumber?: string;
  licensedTechnology: string;
  fieldOfUse: string;
  territory: string;
  royaltyStructure: string;
  effectiveDate: string;
  additionalTerms?: string;
}

// Corporate Governance
export interface ArticlesOfAssociationUserInput {
  companyName: string;
  companyAddress: string;
  shareCapitalStructure: string;
  directorPowers: string;
  shareholderRights: string;
  meetingProcedures: string;
  dividendRules: string;
  transferRestrictions: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface ShareholderAgreementUserInput {
  companyName: string;
  shareholder1Name: string;
  shareholder2Name: string;
  shareholdingPercentages: string;
  transferRestrictions: string;
  boardRepresentation: string;
  votingAgreements: string;
  informationRights: string;
  exitMechanisms: string;
  effectiveDate: string;
  additionalTerms?: string;
}


// Litigation & Dispute Resolution
export interface SettlementAgreementUserInput {
  party1Name: string;
  party2Name: string;
  party1Address: string;
  party2Address: string;
  disputeDescription: string;
  settlementTerms: string;
  paymentAmount?: string;
  releaseScope: string;
  confidentialityProvisions: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface ArbitrationAgreementUserInput {
  party1Name: string;
  party2Name: string;
  party1Address: string;
  party2Address: string;
  disputeScope: string;
  arbitrationRules: string;
  arbitratorSelection: string;
  arbitrationLocation: string;
  costAllocation: string;
  governingLaw: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface MediationAgreementUserInput {
  party1Name: string;
  party2Name: string;
  party1Address: string;
  party2Address: string;
  disputeDescription: string;
  mediatorSelection: string;
  mediationProcedures: string;
  costSharing: string;
  confidentialityProvisions: string;
  effectiveDate: string;
  additionalTerms?: string;
}

// Regulatory & Compliance
export interface DataProtectionComplianceUserInput {
  controllerName: string;
  processorName?: string;
  controllerAddress: string;
  processorAddress?: string;
  dataCategories: string;
  processingPurposes: string;
  legalBasis: string;
  securityMeasures: string;
  retentionPeriod: string;
  dataSubjectRights: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface AMLComplianceUserInput {
  institutionName: string;
  institutionAddress: string;
  complianceOfficer: string;
  customerDueDiligence: string;
  transactionMonitoring: string;
  reportingProcedures: string;
  recordKeeping: string;
  trainingPrograms: string;
  riskAssessment: string;
  effectiveDate: string;
  additionalTerms?: string;
}

export interface EnvironmentalComplianceUserInput {
  companyName: string;
  companyAddress: string;
  environmentalOfficer: string;
  complianceObligations: string;
  monitoringRequirements: string;
  reportingProcedures: string;
  remediationPlans: string;
  communityEngagement: string;
  effectiveDate: string;
  additionalTerms?: string;
}