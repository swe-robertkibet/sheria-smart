// Distribution Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface DistributionAgreementUserInput extends BaseDocumentUserInput {
  // Principal/Supplier Information
  principalName: string;
  principalAddress: string;
  principalBusinessRegistration: string;
  principalEmail: string;
  principalPhone?: string;
  
  // Distributor Information
  distributorName: string;
  distributorAddress: string;
  distributorBusinessRegistration: string;
  distributorEmail: string;
  distributorPhone?: string;
  
  // Distribution Terms
  territoryDefinition: string;
  productSpecifications: string;
  exclusivityType: 'exclusive' | 'non-exclusive' | 'sole';
  minimumSalesTargets: string;
  
  // Financial Terms
  commissionStructure: string;
  marginStructure: string;
  paymentTerms: string;
  
  // Obligations
  marketingObligations: string;
  distributorObligations: string;
  principalObligations: string;
  
  // Term and Performance
  agreementTerm: string;
  performanceMetrics: string;
  terminationConditions: string;
  
  // Intellectual Property
  trademarkUsage?: string;
  intellectualPropertyRights?: string;
}

export interface GeneratedDistributionAgreementContent {
  title: string;
  partiesAndDefinitions: string;
  grantOfDistributionRights: string;
  territoryAndExclusivity: string;
  distributorObligations: string;
  principalObligations: string;
  salesTargetsAndPerformance: string;
  pricingAndPayment: string;
  marketingAndPromotion: string;
  intellectualPropertyRights: string;
  terminationProvisions: string;
  postTerminationObligations: string;
  generalProvisions: string;
  signatures: string;
}