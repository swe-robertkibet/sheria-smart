// Patent Licensing Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface PatentLicensingUserInput extends BaseDocumentUserInput {
  // Patent Owner Information
  patentOwnerName: string;
  patentOwnerAddress: string;
  patentOwnerEmail?: string;
  patentOwnerPhone?: string;
  patentOwnerBusinessRegistration?: string;
  
  // Licensee Information
  licenseeName: string;
  licenseeAddress: string;
  licenseeEmail?: string;
  licenseePhone?: string;
  licenseeBusinessRegistration?: string;
  
  // Patent Details
  patentDescription: string;
  patentNumber?: string;
  patentTitle: string;
  patentClaims?: string;
  filingDate?: string;
  grantDate?: string;
  patentJurisdiction?: string;
  
  // License Terms
  licensedTechnology: string;
  fieldOfUse: string;
  territory: string;
  exclusivity: 'exclusive' | 'non-exclusive' | 'sole';
  licenseDuration: string;
  
  // Financial Terms
  royaltyStructure: string;
  minimumRoyalties?: string;
  paymentTerms: string;
  reportingRequirements?: string;
  
  // Technical and Development
  improvementRights?: string;
  technologyTransfer?: string;
  technicalSupport?: string;
  trainingProvisions?: string;
  
  // Legal and Compliance
  patentProsecution?: string;
  enforcementObligations?: string;
  infringementProcedures?: string;
  validityWarranties?: string;
  indemnificationTerms?: string;
  
  // Additional Terms
  terminationConditions?: string;
  governingLaw?: string;
  disputeResolution?: string;
}

export interface GeneratedPatentLicensingContent {
  title: string;
  patentLicenseGrant: string;
  licensedTechnology: string;
  scopeAndLimitations: string;
  royaltyPayments: string;
  patentProsecution: string;
  infringementEnforcement: string;
  improvements: string;
  termAndTermination: string;
  postTerminationProvisions: string;
  generalProvisions: string;
  signatures: string;
}