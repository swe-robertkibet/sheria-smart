// Enhanced Employment Contract interfaces
import { BaseDocumentUserInput } from '../../document';

export interface EnhancedEmploymentContractUserInput extends BaseDocumentUserInput {
  // Employee Information
  employeeName: string;
  employeeAddress: string;
  employeeEmail: string;
  employeePhone?: string;
  employeeIdNumber: string;
  employeeKraPin?: string;
  
  // Employer Information
  employerName: string;
  employerAddress: string;
  employerEmail: string;
  employerPhone?: string;
  employerBusinessRegistration: string;
  
  // Position Details
  jobTitle: string;
  jobDescription: string;
  department: string;
  reportingManager: string;
  workLocation: string;
  
  // Terms of Employment
  employmentType: 'permanent' | 'fixed_term' | 'casual' | 'contract';
  contractDuration?: string;
  startDate: string;
  probationaryPeriod?: string;
  
  // Remuneration and Benefits
  basicSalary: string;
  salaryPaymentFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  allowances?: string;
  bonusStructure?: string;
  benefitsPackage: string;
  
  // Working Hours and Leave
  workingHoursPerWeek: string;
  workingDaysPerWeek: string;
  annualLeaveEntitlement: string;
  sickLeaveEntitlement: string;
  maternityPaternityLeave: string;
  publicHolidayEntitlement: string;
  
  // Performance and Development
  performanceReviewFrequency?: string;
  trainingAndDevelopment?: string;
  
  // Termination Provisions
  noticePeriodEmployee: string;
  noticePeriodEmployer: string;
  severancePayProvisions: string;
  
  // Confidentiality and IP
  confidentialityObligations: string;
  intellectualPropertyRights: string;
  nonCompeteClause?: string;
  nonSolicitationClause?: string;
  
  // Disciplinary Procedures
  disciplinaryProcedures: string;
  grievanceProcedures: string;
}

export interface GeneratedEnhancedEmploymentContractContent {
  title: string;
  partiesAndCommencement: string;
  positionAndDuties: string;
  remunerationAndBenefits: string;
  workingTime: string;
  leaveEntitlements: string;
  probationaryPeriod: string;
  terminationProvisions: string;
  confidentiality: string;
  intellectualProperty: string;
  postEmploymentRestrictions: string;
  disciplinaryProcedures: string;
  grievanceProcedures: string;
  generalProvisions: string;
  signatures: string;
}