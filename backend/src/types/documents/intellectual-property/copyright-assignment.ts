// Copyright Assignment Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface CopyrightAssignmentUserInput extends BaseDocumentUserInput {
  // Author Information
  authorName: string;
  authorAddress: string;
  authorEmail?: string;
  authorPhone?: string;
  
  // Assignee Information
  assigneeName: string;
  assigneeAddress: string;
  assigneeEmail?: string;
  assigneePhone?: string;
  
  // Work Details
  workDescription: string;
  workTitle: string;
  creationDate?: string;
  copyrightRegistrationNumber?: string;
  
  // Assignment Terms
  assignmentScope: 'exclusive' | 'non-exclusive';
  consideration: string;
  territory: string;
  duration: string;
  
  // Rights and Warranties
  moralRightsWaiver: 'waived' | 'retained';
  warrantyProvisions: string;
  indemnificationTerms?: string;
  
  // Additional Terms
  terminationConditions?: string;
  governingLaw?: string;
  disputeResolution?: string;
}

export interface GeneratedCopyrightAssignmentContent {
  title: string;
  assignmentOfCopyright: string;
  workDescription: string;
  scopeAndLimitations: string;
  consideration: string;
  warrantiesAndRepresentations: string;
  moralRights: string;
  indemnification: string;
  termination: string;
  generalProvisions: string;
  signatures: string;
}