// Frontend document types matching backend interfaces

export enum DocumentType {
  NDA = "NDA",
  EMPLOYMENT_CONTRACT = "EMPLOYMENT_CONTRACT",
  SERVICE_AGREEMENT = "SERVICE_AGREEMENT",
  LEASE_AGREEMENT = "LEASE_AGREEMENT"
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

// NDA-specific interfaces
export interface NDAUserInput {
  // Parties Information
  disclosingPartyName: string;
  disclosingPartyAddress: string;
  disclosingPartyEmail: string;
  disclosingPartyPhone?: string;
  
  receivingPartyName: string;
  receivingPartyAddress: string;
  receivingPartyEmail: string;
  receivingPartyPhone?: string;
  
  // Agreement Details
  purposeOfDisclosure: string; // The backstory/context
  specificConfidentialInfo: string;
  agreementDuration: string;
  isPerperual: boolean;
  
  // Optional Details
  additionalTerms?: string;
  governingState?: string; // Defaults to "Republic of Kenya"
  effectiveDate: string;
  
  // Contact for questions
  contactPersonName?: string;
  contactPersonTitle?: string;
}

export interface DocumentGenerationRequest {
  documentType: DocumentType;
  userInput: NDAUserInput;
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
  description: string;
  isActive: boolean;
  requiredFields: string[];
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

// Form state interfaces
export interface NDAFormData extends NDAUserInput {
  backstory: string;
  selectedFormats: DocumentFormat[];
  emailAddress: string;
}

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