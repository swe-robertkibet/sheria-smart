// Sale of Land Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface SaleOfLandUserInput extends BaseDocumentUserInput {
  // Vendor Information
  vendorName: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorPhone?: string;
  vendorIdNumber: string;
  vendorMaritalStatus?: string;
  
  // Purchaser Information
  purchaserName: string;
  purchaserAddress: string;
  purchaserEmail: string;
  purchaserPhone?: string;
  purchaserIdNumber: string;
  purchaserMaritalStatus?: string;
  
  // Property Details
  propertyDescription: string;
  propertyAddress: string;
  titleNumber: string;
  landRegistryOffice: string;
  propertySize: string;
  propertyBoundaries: string;
  propertyType: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  
  // Purchase Terms
  purchasePrice: string;
  paymentTerms: string;
  depositAmount: string;
  balancePaymentSchedule: string;
  completionDate: string;
  
  // Title and Encumbrances
  titleWarranties: string;
  existingEncumbrances?: string;
  outstandingCharges?: string;
  caveatOrRestrictions?: string;
  
  // Conditions of Sale
  conditionsToCompletion: string;
  surveyRequirements?: string;
  soilTestRequirements?: string;
  planningPermissionStatus?: string;
  
  // Risk and Insurance
  riskPassageDate: string;
  insuranceRequirements: string;
  propertyInsuranceTransfer: string;
  
  // Completion Arrangements
  completionVenue: string;
  documentsForCompletion: string;
  keyHandoverArrangements?: string;
  possessionDate: string;
  
  // Default and Remedies
  defaultProvisions: string;
  remediesForBreach: string;
  timeIsOfEssenceClause: boolean | string;
  forfeituteClause?: string;
  
  // Legal and Professional Costs
  legalCosts: string;
  stampDutyResponsibility: string;
  registrationFees: string;
  surveyorFees?: string;
  
  // Consent Requirements
  landControlBoardConsent?: string;
  spouseConsent?: string;
  familyConsent?: string;
  
  // Additional Provisions
  reservedRights?: string;
  easementsAndRights?: string;
  environmentalCompliance?: string;
}

export interface GeneratedSaleOfLandContent {
  title: string;
  partiesAndProperty: string;
  purchasePriceAndPayment: string;
  titleAndEncumbrances: string;
  conditionsOfSale: string;
  completionArrangements: string;
  riskAndInsurance: string;
  warrantiesAndRepresentations: string;
  defaultProvisions: string;
  costsAndExpenses: string;
  consentRequirements: string;
  generalConditions: string;
  signatures: string;
}