import { BaseDocumentUserInput } from '../../document';

// Environmental Compliance Agreement User Input Interface
export interface EnvironmentalComplianceUserInput extends BaseDocumentUserInput {
  // Company/Organization Information
  companyName: string;
  companyAddress: string;
  companyEmail?: string;
  companyPhone?: string;
  companyBusinessRegistration?: string;
  companyLicenseNumber?: string;
  companyType: 'manufacturing' | 'mining' | 'agriculture' | 'construction' | 'energy' | 'transport' | 'waste_management' | 'hospitality' | 'other';
  industryCategory?: string;
  operationalScope?: string;
  
  // Environmental Officer Information
  environmentalOfficerName: string;
  environmentalOfficerTitle?: string;
  environmentalOfficerEmail?: string;
  environmentalOfficerPhone?: string;
  environmentalOfficerQualifications?: string;
  environmentalOfficerExperience?: string;
  environmentalOfficerDesignationDate?: string;
  environmentalOfficerCertification?: string;
  
  // Legal Framework and Compliance
  environmentalLegalFramework: string;
  emcaComplianceRequirements?: string;
  nemaLicensingRequirements?: string;
  eiaRequirements?: string;
  environmentalAuditRequirements?: string;
  countyEnvironmentalRequirements?: string;
  internationalStandardsCompliance?: string;
  sectorSpecificRegulations?: string;
  
  // Environmental Management System (EMS)
  environmentalManagementSystem: string;
  environmentalPolicyStatement?: string;
  environmentalObjectivesTargets?: string;
  environmentalManagementPrograms?: string;
  environmentalProceduresDocumentation?: string;
  environmentalResponsibilities?: string;
  environmentalTrainingRequirements?: string;
  
  // Environmental Impact Assessment
  environmentalImpactAssessment?: string;
  eiaStudyRequirements?: string;
  environmentalImpactMitigation?: string;
  cumulativeImpactAssessment?: string;
  strategicEnvironmentalAssessment?: string;
  environmentalRiskAssessment?: string;
  
  // Pollution Prevention and Control
  pollutionPreventionControl: string;
  airQualityManagement?: string;
  waterPollutionControl?: string;
  soilContaminationPrevention?: string;
  noisePollutonControl?: string;
  lightPollutionManagement?: string;
  odorControlMeasures?: string;
  emissionControlSystems?: string;
  
  // Waste Management
  wasteManagementProcedures: string;
  wasteMinimizationStrategies?: string;
  wasteSegregationProcedures?: string;
  hazardousWasteManagement?: string;
  wasteStorageRequirements?: string;
  wasteTransportationProcedures?: string;
  wasteDisposalMethods?: string;
  wasteRecyclingPrograms?: string;
  wasteAuditProcedures?: string;
  
  // Water Resource Management
  waterResourceManagement?: string;
  waterConservationMeasures?: string;
  waterQualityMonitoring?: string;
  waterUseEfficiency?: string;
  waterRecyclingReuse?: string;
  groundwaterProtection?: string;
  surfaceWaterProtection?: string;
  waterPermitCompliance?: string;
  
  // Energy Management
  energyManagement?: string;
  energyConservationMeasures?: string;
  energyEfficiencyPrograms?: string;
  renewableEnergyInitiatives?: string;
  energyAuditRequirements?: string;
  carbonFootprintReduction?: string;
  climateChangeAdaptation?: string;
  
  // Biodiversity and Ecosystem Conservation
  biodiversityConservation?: string;
  ecosystemProtectionMeasures?: string;
  wildlifeProtection?: string;
  forestConservation?: string;
  marineProtection?: string;
  habitatRestoration?: string;
  invasiveSpeciesManagement?: string;
  
  // Chemical and Hazardous Substances Management
  chemicalManagement?: string;
  hazardousSubstancesHandling?: string;
  chemicalStorageRequirements?: string;
  chemicalTransportSafety?: string;
  chemicalInventoryManagement?: string;
  materialSafetyDataSheets?: string;
  chemicalEmergencyResponse?: string;
  
  // Environmental Monitoring and Reporting
  environmentalMonitoring: string;
  monitoringParameters?: string;
  monitoringFrequency?: string;
  monitoringMethods?: string;
  monitoringEquipmentRequirements?: string;
  dataCollectionProcedures?: string;
  laboratoryAnalysisRequirements?: string;
  monitoringReportingTimelines?: string;
  
  // Community Engagement and Relations
  communityEngagement: string;
  stakeholderConsultationProcedures?: string;
  publicParticipationRequirements?: string;
  communityGrievanceMechanisms?: string;
  corporateSocialResponsibility?: string;
  communityDevelopmentPrograms?: string;
  culturalHeritageProtection?: string;
  landRightsConsiderations?: string;
  
  // Environmental Training and Awareness
  environmentalTraining: string;
  staffTrainingPrograms?: string;
  environmentalAwarenessPrograms?: string;
  capacityBuildingInitiatives?: string;
  trainingRecordKeeping?: string;
  environmentalEducationPrograms?: string;
  communityAwarenessPrograms?: string;
  
  // Emergency Response and Incident Management
  emergencyResponsePlan?: string;
  environmentalIncidentManagement?: string;
  spillResponseProcedures?: string;
  fireEmergencyProcedures?: string;
  evacuationProcedures?: string;
  emergencyContactProcedures?: string;
  incidentReportingProcedures?: string;
  postIncidentInvestigation?: string;
  
  // Environmental Audit and Review
  environmentalAuditProcedures?: string;
  internalAuditSchedule?: string;
  externalAuditRequirements?: string;
  auditFindingsManagement?: string;
  correctiveActionProcedures?: string;
  managementReviewProcedures?: string;
  continuousImprovementPrograms?: string;
  
  // Compliance Monitoring and Enforcement
  complianceMonitoring: string;
  regulatoryInspectionProcedures?: string;
  complianceReportingRequirements?: string;
  nonComplianceManagement?: string;
  enforcementActionResponse?: string;
  legalComplianceVerification?: string;
  
  // Environmental Performance Indicators
  environmentalPerformanceIndicators?: string;
  kpiMonitoringProcedures?: string;
  performanceBenchmarking?: string;
  improvementTargetSetting?: string;
  performanceReporting?: string;
  
  // Financial Provisions
  environmentalBondRequirements?: string;
  environmentalInsuranceRequirements?: string;
  rehabilitationFundProvisions?: string;
  environmentalLiabilityManagement?: string;
  costBenefitAnalysis?: string;
  
  // Technology and Innovation
  environmentalTechnologies?: string;
  cleanerProductionTechnologies?: string;
  environmentalInnovationPrograms?: string;
  technologyTransferInitiatives?: string;
  digitalizationOfEnvironmentalManagement?: string;
  
  // Supply Chain Environmental Management
  supplierEnvironmentalRequirements?: string;
  sustainableProcurementPolicies?: string;
  contractorEnvironmentalObligations?: string;
  supplyChainMonitoring?: string;
  
  // Documentation and Record Keeping
  documentationRequirements: string;
  recordKeepingProcedures?: string;
  documentControlSystems?: string;
  dataManagementProcedures?: string;
  reportingFormats?: string;
  archivalRequirements?: string;
  
  // Penalties and Sanctions Framework
  penaltiesAndSanctions?: string;
  violationHandlingProcedures?: string;
  disciplinaryActionProcedures?: string;
  complianceIncentives?: string;
  prosecutionProcedures?: string;
  
  // Governing Law and Jurisdiction
  governingLaw?: string;
  regulatoryAuthorities?: string;
  disputeResolutionMechanisms?: string;
  jurisdictionClauses?: string;
  internationalAgreementsCompliance?: string;
  
  // Implementation and Review
  implementationTimeline?: string;
  implementationPhasePlanning?: string;
  reviewSchedule?: string;
  updateProcedures?: string;
  stakeholderFeedbackIncorporation?: string;
  adaptiveManagementApproach?: string;
  
  // Amendment and Termination
  amendmentProcedures?: string;
  terminationConditions?: string;
  terminationNoticeRequirements?: string;
  postTerminationObligations?: string;
  handoverProcedures?: string;
  
  // Signatures and Approvals
  effectiveDate: string;
  signatureRequirements?: string;
  witnessRequirements?: string;
  notarizationRequirements?: string;
  boardApprovalDate?: string;
  managementApprovalDate?: string;
  nemaApprovalRequirements?: string;
  countyGovernmentApproval?: string;
}

// Generated content interface for AI-generated sections
export interface GeneratedEnvironmentalComplianceContent {
  environmentalPolicyFramework?: string;
  legalComplianceRequirements?: string;
  environmentalManagementSystem?: string;
  pollutionPreventionControl?: string;
  resourceConservationManagement?: string;
  communityRelationsEngagement?: string;
  monitoringReportingProcedures?: string;
  trainingCapacityBuilding?: string;
  emergencyResponseIncidentManagement?: string;
  auditReviewMechanisms?: string;
}