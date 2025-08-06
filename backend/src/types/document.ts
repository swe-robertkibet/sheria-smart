// Document generation types and interfaces

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

export interface GeneratedNDAContent {
  title: string;
  recitals: string;
  definitions: string;
  confidentialityObligations: string;
  permittedUses: string;
  exclusions: string;
  termDuration: string;
  remediesAndEnforcement: string;
  generalProvisions: string;
  governingLaw: string;
  signatures: string;
}

export interface DocumentGenerationRequest {
  userId: string;
  documentType: DocumentType;
  userInput: NDAUserInput; // Will be expanded for other document types
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
  description: string;
  requiredFields: string[];
  template: string; // Template content or path
  isActive: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
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