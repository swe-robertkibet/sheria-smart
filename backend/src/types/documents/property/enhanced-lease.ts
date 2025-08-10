// Enhanced Lease Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface EnhancedLeaseUserInput extends BaseDocumentUserInput {
  // Landlord Information
  landlordName: string;
  landlordAddress: string;
  landlordEmail: string;
  landlordPhone?: string;
  landlordIdNumber?: string;
  
  // Tenant Information
  tenantName: string;
  tenantAddress: string;
  tenantEmail: string;
  tenantPhone?: string;
  tenantIdNumber?: string;
  tenantOccupation?: string;
  
  // Property Details
  propertyAddress: string;
  propertyDescription: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'mixed_use';
  propertySize: string;
  furnishingStatus: 'furnished' | 'semi_furnished' | 'unfurnished';
  furnishingDetails?: string;
  
  // Lease Terms
  leaseType: 'fixed_term' | 'periodic' | 'at_will';
  leaseTerm: string;
  leaseStartDate: string;
  leaseEndDate?: string;
  renewalOptions?: string;
  
  // Financial Terms
  monthlyRent: string;
  rentPaymentDate: string;
  rentPaymentMethod: string;
  securityDeposit: string;
  advanceRentPayment?: string;
  lateFees?: string;
  rentReviewClause?: string;
  
  // Property Use
  permittedUse: string;
  occupancyLimits?: string;
  businessUseRestrictions?: string;
  sublettingPolicy: 'prohibited' | 'with_consent' | 'freely_permitted';
  
  // Maintenance and Repairs
  landlordMaintenanceResponsibilities: string;
  tenantMaintenanceResponsibilities: string;
  repairNotificationProcess: string;
  emergencyRepairProcedures: string;
  
  // Utilities and Services
  utilitiesIncluded: string;
  utilitiesPaidByTenant: string;
  serviceCharges?: string;
  internetAndCableProvision?: string;
  
  // Insurance and Liability
  landlordInsuranceRequirements: string;
  tenantInsuranceRequirements?: string;
  liabilityAllocation: string;
  propertyDamageResponsibility: string;
  
  // Entry and Inspection
  landlordEntryRights: string;
  inspectionSchedule?: string;
  noticeRequirements: string;
  
  // Termination and Default
  terminationConditions: string;
  noticePeriodsForTermination: string;
  defaultRemedies: string;
  evictionProcedures: string;
  
  // Special Provisions
  petPolicy?: string;
  parkingProvisions?: string;
  securityMeasures?: string;
  alterationsPolicy?: string;
}

export interface GeneratedEnhancedLeaseContent {
  title: string;
  partiesAndPropertyDescription: string;
  leaseTermAndRent: string;
  securityDeposit: string;
  useOfPremises: string;
  maintenanceAndRepairs: string;
  utilitiesAndServices: string;
  insuranceRequirements: string;
  landlordEntryRights: string;
  defaultAndRemedies: string;
  terminationProvisions: string;
  specialProvisions: string;
  generalProvisions: string;
  signatures: string;
}