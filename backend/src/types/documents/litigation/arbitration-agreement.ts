// Arbitration Agreement interfaces
import { BaseDocumentUserInput } from '../../document';

export interface ArbitrationAgreementUserInput extends BaseDocumentUserInput {
  // Party 1 Information
  party1Name: string;
  party1Address: string;
  party1Email: string;
  party1Phone?: string;
  party1LegalRep?: string;
  party1LegalRepFirm?: string;
  party1LegalRepAddress?: string;
  
  // Party 2 Information
  party2Name: string;
  party2Address: string;
  party2Email: string;
  party2Phone?: string;
  party2LegalRep?: string;
  party2LegalRepFirm?: string;
  party2LegalRepAddress?: string;
  
  // Additional Parties (if applicable)
  additionalParties?: string;
  
  // Agreement Form and Scope
  agreementType: 'clause' | 'separate_agreement';
  disputeScope: string;
  disputeCoverage: 'arising_from_contract' | 'arising_or_may_arise' | 'all_disputes' | 'specific_matters';
  specificMattersDescription?: string;
  contractualBasis?: string;
  legalRelationshipContext: string;
  
  // Arbitration Institution and Rules
  arbitrationRules: 'ncia_rules' | 'ad_hoc' | 'icc_rules' | 'lcia_rules' | 'uncitral_rules' | 'custom_rules';
  customRulesDescription?: string;
  institutionalAdministration?: 'yes' | 'no';
  appointingAuthority?: string;
  
  // Arbitrator Selection
  numberOfArbitrators: '1' | '3' | 'parties_to_agree';
  arbitratorQualifications: string;
  arbitratorSelectionMethod: string;
  arbitratorAppointmentProcess: string;
  arbitratorNationalityRestrictions?: string;
  arbitratorLanguageRequirements?: string;
  arbitratorExpertiseRequired?: string;
  arbitratorChallengeProcess?: string;
  arbitratorIndependenceRequirements: string;
  emergencyArbitratorProvision?: 'yes' | 'no';
  emergencyArbitratorProcedures?: string;
  
  // Procedural Provisions
  arbitrationSeat: string;
  arbitrationVenue?: string;
  procedureLanguage: string;
  hearingLocation?: string;
  documentSubmissionLanguage?: string;
  translationRequirements?: string;
  timelineLimitations?: string;
  proceduralSchedule?: string;
  evidenceRules?: string;
  documentDiscovery?: 'limited' | 'extensive' | 'none';
  witnessExamination?: 'written_only' | 'oral_hearings' | 'both';
  expertWitnessRights?: 'yes' | 'no';
  expertWitnessProcedures?: string;
  
  // Interim Measures
  interimMeasuresRights?: 'yes' | 'no';
  interimMeasuresProcedures?: string;
  courtInterimMeasures?: 'permitted' | 'excluded';
  
  // Legal Framework
  governingLawSubstance: string;
  governingLawProcedure: string;
  jurisdictionExclusion?: 'yes' | 'no';
  courtJurisdictionExceptions?: string;
  
  // Costs and Fees
  costAllocation: 'equal_sharing' | 'loser_pays' | 'tribunal_discretion' | 'custom_allocation';
  customCostAllocation?: string;
  advanceOnCosts?: string;
  feePaymentResponsibility: string;
  legalCostsAllocation?: 'each_party_own' | 'loser_pays' | 'tribunal_discretion';
  currency: 'KES' | 'USD' | 'EUR' | 'GBP' | 'other';
  otherCurrency?: string;
  
  // Confidentiality Provisions
  confidentialityLevel: 'standard' | 'enhanced' | 'limited' | 'custom';
  confidentialityScope: string;
  confidentialityDuration?: string;
  confidentialityExceptions?: string;
  publicationRights?: 'none' | 'anonymized' | 'with_consent';
  
  // Enforcement and Appeals
  awardFinality: 'final_binding' | 'limited_appeals' | 'custom_review';
  appealRights?: string;
  awardEnforcementJurisdiction: string;
  setAsideGrounds?: string;
  recognitionProcedures?: string;
  
  // Special Provisions
  consolidationRights?: 'yes' | 'no';
  consolidationProcedures?: string;
  thirdPartyJoinder?: 'yes' | 'no';
  thirdPartyProcedures?: string;
  multiPartyProcedures?: string;
  expeditedProcedures?: 'yes' | 'no';
  expeditedCriteria?: string;
  
  // General Terms
  amendmentProcedures?: string;
  severabilityProvisions?: string;
  successorObligations?: string;
  noticeRequirements?: string;
  waiverProvisions?: string;
}

// Generated content interface for AI-generated sections
export interface GeneratedArbitrationAgreementContent {
  partiesAndScope?: string;
  arbitrationClause?: string;
  arbitratorSelection?: string;
  proceduralProvisions?: string;
  legalFramework?: string;
  costsAndFees?: string;
  confidentialityProvisions?: string;
  enforcementAndSignatures?: string;
}