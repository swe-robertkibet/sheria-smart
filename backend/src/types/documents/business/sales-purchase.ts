// Sales & Purchase Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface SalesPurchaseUserInput extends BaseDocumentUserInput {
  // Seller Information
  sellerName: string;
  sellerAddress: string;
  sellerBusinessRegistration?: string;
  sellerEmail: string;
  sellerPhone?: string;
  
  // Buyer Information
  buyerName: string;
  buyerAddress: string;
  buyerEmail: string;
  buyerPhone?: string;
  
  // Sale Details
  goodsServicesDescription: string;
  purchasePrice: string;
  paymentTerms: string;
  deliveryTerms: string;
  deliveryTimeline: string;
  
  // Warranties and Terms
  warrantyProvisions: string;
  inspectionPeriod?: string;
  returnPolicy?: string;
  
  // Additional Terms
  insuranceRequirements?: string;
  riskAllocation?: string;
  disputeResolution?: string;
}

export interface GeneratedSalesPurchaseContent {
  title: string;
  partiesIdentification: string;
  recitalsAndBackground: string;
  saleTermsAndConditions: string;
  priceAndPaymentProvisions: string;
  deliveryAndAcceptance: string;
  warrantiesAndRepresentations: string;
  riskAllocationAndInsurance: string;
  disputeResolution: string;
  generalProvisions: string;
  signatures: string;
}