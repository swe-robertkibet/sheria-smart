// Document generation types and interfaces

export enum DocumentCategory {
  BUSINESS_COMMERCIAL = "BUSINESS_COMMERCIAL",
  EMPLOYMENT_HR = "EMPLOYMENT_HR", 
  PROPERTY_REAL_ESTATE = "PROPERTY_REAL_ESTATE",
  FAMILY_LAW = "FAMILY_LAW",
  INTELLECTUAL_PROPERTY = "INTELLECTUAL_PROPERTY",
  CORPORATE_GOVERNANCE = "CORPORATE_GOVERNANCE",
  LITIGATION_DISPUTE = "LITIGATION_DISPUTE",
  REGULATORY_COMPLIANCE = "REGULATORY_COMPLIANCE"
}

export enum DocumentType {
  // Original
  EMPLOYMENT_CONTRACT = "EMPLOYMENT_CONTRACT",
  SERVICE_AGREEMENT = "SERVICE_AGREEMENT",
  LEASE_AGREEMENT = "LEASE_AGREEMENT",
  
  // Business & Commercial Contracts
  SALES_PURCHASE_AGREEMENT = "SALES_PURCHASE_AGREEMENT",
  DISTRIBUTION_AGREEMENT = "DISTRIBUTION_AGREEMENT",
  PARTNERSHIP_AGREEMENT = "PARTNERSHIP_AGREEMENT",
  
  // Employment & HR Documents
  ENHANCED_EMPLOYMENT_CONTRACT = "ENHANCED_EMPLOYMENT_CONTRACT",
  INDEPENDENT_CONTRACTOR_AGREEMENT = "INDEPENDENT_CONTRACTOR_AGREEMENT", 
  NON_COMPETE_AGREEMENT = "NON_COMPETE_AGREEMENT",
  
  // Property & Real Estate
  ENHANCED_LEASE_AGREEMENT = "ENHANCED_LEASE_AGREEMENT",
  SALE_OF_LAND_AGREEMENT = "SALE_OF_LAND_AGREEMENT",
  PROPERTY_MANAGEMENT_AGREEMENT = "PROPERTY_MANAGEMENT_AGREEMENT",
  
  // Family Law Documents
  PRENUPTIAL_AGREEMENT = "PRENUPTIAL_AGREEMENT",
  POSTNUPTIAL_AGREEMENT = "POSTNUPTIAL_AGREEMENT",
  CHILD_CUSTODY_SUPPORT_AGREEMENT = "CHILD_CUSTODY_SUPPORT_AGREEMENT",
  
  // Intellectual Property
  COPYRIGHT_ASSIGNMENT_AGREEMENT = "COPYRIGHT_ASSIGNMENT_AGREEMENT",
  TRADEMARK_LICENSE_AGREEMENT = "TRADEMARK_LICENSE_AGREEMENT",
  PATENT_LICENSING_AGREEMENT = "PATENT_LICENSING_AGREEMENT",
  
  // Corporate Governance
  ARTICLES_OF_ASSOCIATION = "ARTICLES_OF_ASSOCIATION",
  SHAREHOLDER_AGREEMENT = "SHAREHOLDER_AGREEMENT",
  BOARD_RESOLUTION = "BOARD_RESOLUTION",
  
  // Litigation & Dispute Resolution
  SETTLEMENT_AGREEMENT = "SETTLEMENT_AGREEMENT",
  ARBITRATION_AGREEMENT = "ARBITRATION_AGREEMENT",
  MEDIATION_AGREEMENT = "MEDIATION_AGREEMENT",
  
  // Regulatory & Compliance
  DATA_PROTECTION_COMPLIANCE_AGREEMENT = "DATA_PROTECTION_COMPLIANCE_AGREEMENT",
  ANTI_MONEY_LAUNDERING_COMPLIANCE = "ANTI_MONEY_LAUNDERING_COMPLIANCE",
  ENVIRONMENTAL_COMPLIANCE_AGREEMENT = "ENVIRONMENTAL_COMPLIANCE_AGREEMENT"
}

export enum DocumentFormat {
  PDF = "pdf",
  DOCX = "docx"
}

export enum RequestStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  EMAIL_QUEUED = "EMAIL_QUEUED",
  EMAIL_SENT = "EMAIL_SENT"
}

// Removed NDA interfaces - NDA document type has been discontinued

// Base user input interface
export interface BaseDocumentUserInput {
  effectiveDate: string;
  governingState?: string;
  additionalTerms?: string;
}

// Import all document type interfaces
import {
  SalesPurchaseUserInput,
  DistributionAgreementUserInput,
  PartnershipAgreementUserInput,
  EnhancedEmploymentContractUserInput,
  IndependentContractorUserInput,
  NonCompeteUserInput,
  EnhancedLeaseUserInput,
  SaleOfLandUserInput,
  PropertyManagementUserInput,
  PrenuptialUserInput,
  PostnuptialUserInput,
  ChildCustodyUserInput,
  CopyrightAssignmentUserInput,
  TrademarkLicenseUserInput,
  PatentLicensingUserInput,
  ArticlesOfAssociationUserInput,
  ShareholderAgreementUserInput,
  BoardResolutionUserInput,
  SettlementAgreementUserInput,
  ArbitrationAgreementUserInput,
  MediationAgreementUserInput,
  DataProtectionComplianceUserInput,
  AMLComplianceUserInput,
  EnvironmentalComplianceUserInput
} from './documents';

// Union type for all possible user inputs
export type DocumentUserInput = 
  | SalesPurchaseUserInput
  | DistributionAgreementUserInput
  | PartnershipAgreementUserInput
  | EnhancedEmploymentContractUserInput
  | IndependentContractorUserInput
  | NonCompeteUserInput
  | EnhancedLeaseUserInput
  | SaleOfLandUserInput
  | PropertyManagementUserInput
  | PrenuptialUserInput
  | PostnuptialUserInput
  | ChildCustodyUserInput
  | CopyrightAssignmentUserInput
  | TrademarkLicenseUserInput
  | PatentLicensingUserInput
  | ArticlesOfAssociationUserInput
  | ShareholderAgreementUserInput
  | BoardResolutionUserInput
  | SettlementAgreementUserInput
  | ArbitrationAgreementUserInput
  | MediationAgreementUserInput
  | DataProtectionComplianceUserInput
  | AMLComplianceUserInput
  | EnvironmentalComplianceUserInput;

export interface DocumentGenerationRequest {
  userId: string;
  documentType: DocumentType;
  userInput: DocumentUserInput;
  backstory: string;
  formats: DocumentFormat[];
  emailAddress: string;
}

export interface DocumentGenerationResponse {
  requestId: string;
  status: RequestStatus;
  filePaths?: string[];
  downloadUrls?: string[];
  emailSent: boolean;
  message: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  description: string;
  requiredFields: string[];
  template: string; // Template content or path
  isActive: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentCategoryInfo {
  id: DocumentCategory;
  name: string;
  description: string;
  icon: string;
  documents: DocumentTypeInfo[];
}

export interface DocumentTypeInfo {
  id: DocumentType;
  name: string;
  category: DocumentCategory;
  description: string;
  requiredFields: string[];
  isActive: boolean;
  complexity: 'Low' | 'Medium' | 'High';
}

// Email template interface
export interface DocumentEmailData {
  recipientName: string;
  recipientEmail: string;
  documentType: string;
  attachments: {
    filename: string;
    path: string;
    contentType: string;
  }[];
  generatedDate: string;
}