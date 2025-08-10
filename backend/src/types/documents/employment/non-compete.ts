// Non-Compete Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface NonCompeteUserInput extends BaseDocumentUserInput {
  // Employee Information
  employeeName: string;
  employeeAddress: string;
  employeeEmail: string;
  employeePosition: string;
  employeeId?: string;
  
  // Employer Information
  employerName: string;
  employerAddress: string;
  employerEmail: string;
  employerBusinessRegistration: string;
  employerBusinessType: string;
  
  // Employment Context
  employmentStartDate: string;
  currentPosition: string;
  accessToConfidentialInfo: string;
  customerRelationships: string;
  
  // Non-Compete Restrictions
  restrictedActivities: string;
  competitorDefinition: string;
  restrictedServices: string;
  restrictedProducts: string;
  
  // Geographic Scope
  geographicScope: string;
  specificLocations?: string;
  territoryDefinition: string;
  
  // Temporal Scope
  restrictionDuration: string;
  restrictionStartDate: string;
  
  // Non-Solicitation
  customerNonSolicitation: string;
  employeeNonSolicitation: string;
  supplierNonSolicitation?: string;
  
  // Consideration
  considerationProvided: string;
  considerationValue?: string;
  additionalBenefits?: string;
  
  // Exceptions and Carve-outs
  permittedActivities?: string;
  generalBusinessExceptions?: string;
  investmentExceptions?: string;
  
  // Enforcement
  remediesAvailable: string;
  injunctiveReliefProvision: string;
  attorneyFeesProvision?: string;
  
  // Severability
  severabilityProvisions: string;
  modificationRights?: string;
}

export interface GeneratedNonCompeteContent {
  title: string;
  nonCompetitionRestrictions: string;
  geographicAndTemporalScope: string;
  restrictedActivities: string;
  nonSolicitationProvisions: string;
  consideration: string;
  exceptions: string;
  remedies: string;
  severability: string;
  generalProvisions: string;
  signatures: string;
}