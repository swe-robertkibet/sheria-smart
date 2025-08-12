// Frontend document types matching backend interfaces

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
  EMAIL_SENT = "EMAIL_SENT"
}

// Removed NDA interfaces - NDA document type has been discontinued

export interface DocumentGenerationRequest {
  documentType: DocumentType;
  userInput: any; // Generic user input interface
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

export interface DocumentTypeInfo {
  id: DocumentType;
  name: string;
  category: DocumentCategory;
  description: string;
  isActive: boolean;
  requiredFields: string[];
  complexity: 'Low' | 'Medium' | 'High';
}

export interface DocumentCategoryInfo {
  id: DocumentCategory;
  name: string;
  description: string;
  icon: string;
  documents: DocumentTypeInfo[];
}

export interface DocumentRequest {
  id: string;
  documentType: DocumentType;
  status: RequestStatus;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequestsResponse {
  requests: DocumentRequest[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Removed NDA form data - NDA document type has been discontinued

export interface DocumentFormStep {
  id: string;
  title: string;
  description?: string;
  isComplete: boolean;
  isActive: boolean;
}

// API response interfaces
export interface DocumentTypesResponse {
  documentTypes: DocumentTypeInfo[];
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services?: {
    documentGenerator: boolean;
    emailService: boolean;
    database: boolean;
  };
  error?: string;
}