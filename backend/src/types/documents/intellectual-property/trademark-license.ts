// Trademark License Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface TrademarkLicenseUserInput extends BaseDocumentUserInput {
  // Licensor Information
  licensorName: string;
  licensorAddress: string;
  licensorEmail?: string;
  licensorPhone?: string;
  licensorBusinessRegistration?: string;
  
  // Licensee Information
  licenseeName: string;
  licenseeAddress: string;
  licenseeEmail?: string;
  licenseePhone?: string;
  licenseeBusinessRegistration?: string;
  
  // Trademark Details
  trademarkDescription: string;
  trademarkRegistrationNumber?: string;
  trademarkClasses?: string;
  registrationDate?: string;
  registrationJurisdiction?: string;
  
  // License Terms
  licensedProducts: string;
  licensedServices?: string;
  territory: string;
  exclusivity: 'exclusive' | 'non-exclusive';
  licenseDuration: string;
  
  // Financial Terms
  royaltyStructure: string;
  minimumRoyalties?: string;
  paymentTerms: string;
  reportingRequirements?: string;
  
  // Quality and Control
  qualityControlStandards: string;
  approvalRequirements?: string;
  inspectionRights?: string;
  
  // Marketing and Promotion
  marketingObligations: string;
  advertisingRequirements?: string;
  promotionalMaterials?: string;
  
  // Legal and Compliance
  infringementProcedures?: string;
  terminationConditions?: string;
  governingLaw?: string;
  disputeResolution?: string;
}

export interface GeneratedTrademarkLicenseContent {
  title: string;
  grantOfLicense: string;
  trademarkRights: string;
  licensedProductsServices: string;
  territoryAndExclusivity: string;
  qualityControl: string;
  royaltiesAndPayments: string;
  marketingRequirements: string;
  infringementProcedures: string;
  termination: string;
  postTerminationObligations: string;
  generalProvisions: string;
  signatures: string;
}