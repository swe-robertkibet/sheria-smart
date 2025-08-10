// Property Management Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface PropertyDetails {
  propertyAddress: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'mixed_use';
  propertyDescription: string;
  titleNumber?: string;
  propertySize?: string;
  currentTenancyStatus: 'vacant' | 'occupied' | 'partially_occupied';
  rentalIncome?: string;
}

export interface PropertyManagementUserInput extends BaseDocumentUserInput {
  // Property Owner Information
  ownerName: string;
  ownerAddress: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerIdNumber?: string;
  
  // Property Manager Information
  managerName: string;
  managerAddress: string;
  managerEmail: string;
  managerPhone?: string;
  managerBusinessRegistration: string;
  managerLicenseNumber?: string;
  
  // Property Portfolio
  properties: PropertyDetails[];
  
  // Management Services
  servicesScope: string;
  tenantScreeningServices: boolean;
  rentCollectionServices: boolean;
  maintenanceManagement: boolean;
  propertyInspections: boolean;
  legalComplianceManagement: boolean;
  financialReporting: boolean;
  tenancyManagement: boolean;
  
  // Fee Structure
  managementFeeType: 'percentage' | 'fixed_monthly' | 'per_unit' | 'commission_based';
  managementFeeRate: string;
  setupFees?: string;
  renewalFees?: string;
  vacancyFees?: string;
  maintenanceFees?: string;
  
  // Financial Management
  rentCollectionSchedule: string;
  securityDepositHandling: string;
  expenseReimbursementProcess: string;
  reserveFundManagement?: string;
  
  // Reporting and Accounting
  monthlyReportingRequirements: string;
  annualReportingRequirements: string;
  accountingStandards: string;
  recordKeepingRequirements: string;
  
  // Authority and Limitations
  managerAuthority: string;
  authorityLimitations: string;
  expenditureAuthorizationLimits: string;
  contractingAuthority: string;
  
  // Tenant Relations
  tenantCommunicationResponsibilities: string;
  leaseNegotiationAuthority: string;
  evictionProcedures: string;
  tenantComplaintHandling: string;
  
  // Maintenance and Repairs
  routineMaintenanceAuthority: string;
  emergencyRepairAuthorization: string;
  vendorManagementResponsibilities: string;
  qualityControlMeasures: string;
  
  // Insurance and Liability
  insuranceRequirements: string;
  liabilityAllocation: string;
  indemnificationProvisions: string;
  professionalInsuranceRequirements: string;
  
  // Performance Standards
  performanceMetrics: string;
  serviceStandards: string;
  responseTimeRequirements: string;
  
  // Termination
  terminationConditions: string;
  terminationNoticePeriod: string;
  handoverProcedures: string;
  postTerminationObligations: string;
}

export interface GeneratedPropertyManagementContent {
  title: string;
  appointmentAndAuthority: string;
  servicesAndDuties: string;
  feesAndExpenses: string;
  accountingAndReporting: string;
  insuranceRequirements: string;
  performanceStandards: string;
  limitationsAndRestrictions: string;
  terminationProvisions: string;
  indemnification: string;
  disputeResolution: string;
  generalProvisions: string;
  signatures: string;
}