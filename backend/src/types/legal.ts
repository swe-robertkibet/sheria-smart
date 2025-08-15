// TypeScript interfaces for structured legal responses

export enum LegalArea {
  CONTRACT_LAW = "Contract Law",
  EMPLOYMENT_LAW = "Employment Law", 
  PROPERTY_LAW = "Property Law",
  FAMILY_LAW = "Family Law",
  CRIMINAL_LAW = "Criminal Law",
  BUSINESS_LAW = "Business Law",
  CONSUMER_PROTECTION = "Consumer Protection",
  TENANCY_LAW = "Tenancy Law",
  CONSTITUTIONAL_LAW = "Constitutional Law",
  CIVIL_PROCEDURE = "Civil Procedure",
  OTHER = "Other"
}

export enum UrgencyLevel {
  LOW = "low",
  MEDIUM = "medium", 
  HIGH = "high",
  URGENT = "urgent"
}

export enum ActionType {
  CONSULT_LAWYER = "consult_lawyer",
  GATHER_DOCUMENTS = "gather_documents",
  FILE_COMPLAINT = "file_complaint",
  NEGOTIATE = "negotiate",
  MEDIATION = "mediation",
  COURT_PROCEEDINGS = "court_proceedings",
  DOCUMENTATION = "documentation",
  COMPLIANCE = "compliance"
}

export interface NextStep {
  action: ActionType;
  description: string;
  timeframe: string;
  priority: UrgencyLevel;
  requiredDocuments?: string[];
}

export interface LegalRight {
  title: string;
  description: string;
  legalBasis: string; // Reference to Kenyan law/statute
  limitations?: string[];
}

export interface LegalObligation {
  title: string;
  description: string;
  legalBasis: string;
  consequences: string;
  deadline?: string;
}

export interface LegalProcedure {
  name: string;
  description: string;
  steps: string[];
  timeline: string;
  cost?: string;
  requirements: string[];
}

export interface DocumentSuggestion {
  documentType: string;
  documentName: string;
  category: string;
  reason: string;
  navigationSteps: string[];
  requiredInputs: string[];
  estimatedTime: string;
  priority: UrgencyLevel;
}

export interface StructuredLegalResponse {
  // Classification
  legalArea: LegalArea;
  urgencyLevel: UrgencyLevel;
  
  // Main Response
  summary: string;
  
  // Detailed Information
  rights: LegalRight[];
  obligations: LegalObligation[];
  procedures: LegalProcedure[];
  
  // Actionable Items
  nextSteps: NextStep[];
  requiredDocuments: string[];
  
  // Legal References
  relevantLaws: string[];
  caseReferences?: string[];
  
  // Disclaimers and Warnings
  disclaimers: string[];
  warnings?: string[];
  
  // Recommendation
  recommendConsultation: boolean;
  consultationReason?: string;

  // Document Suggestions
  documentSuggestions?: DocumentSuggestion[];
}

export interface QuestionClassification {
  legalArea: LegalArea;
  urgencyLevel: UrgencyLevel;
  complexity: "simple" | "moderate" | "complex";
  requiresSpecialist: boolean;
  keywords: string[];
}