import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { EnvironmentalComplianceUserInput, GeneratedEnvironmentalComplianceContent } from '../../types/documents/compliance/environmental-compliance';

export class EnvironmentalComplianceGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'ENVIRONMENTAL COMPLIANCE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as EnvironmentalComplianceUserInput;
    const companyName = (input.companyName || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
    return `Environmental_Compliance_Agreement_${companyName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as EnvironmentalComplianceUserInput;
    const partyInfo: string[] = [];

    // Company/Organization Information
    partyInfo.push('Company/Organization Information:');
    partyInfo.push(`Name: ${input.companyName || 'Company Name'}`);
    partyInfo.push(`Address: ${input.companyAddress || 'Address not provided'}`);
    if (input.companyEmail) {
      partyInfo.push(`Email: ${input.companyEmail}`);
    }
    if (input.companyPhone) {
      partyInfo.push(`Phone: ${input.companyPhone}`);
    }
    if (input.companyBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.companyBusinessRegistration}`);
    }
    if (input.companyLicenseNumber) {
      partyInfo.push(`License Number: ${input.companyLicenseNumber}`);
    }
    partyInfo.push(`Company Type: ${input.companyType || 'Business Entity'}`);
    if (input.industryCategory) {
      partyInfo.push(`Industry Category: ${input.industryCategory}`);
    }
    partyInfo.push('');

    // Environmental Officer Information
    partyInfo.push('Environmental Officer Information:');
    partyInfo.push(`Name: ${input.environmentalOfficerName || 'Environmental Officer'}`);
    if (input.environmentalOfficerTitle) {
      partyInfo.push(`Title: ${input.environmentalOfficerTitle}`);
    }
    if (input.environmentalOfficerEmail) {
      partyInfo.push(`Email: ${input.environmentalOfficerEmail}`);
    }
    if (input.environmentalOfficerPhone) {
      partyInfo.push(`Phone: ${input.environmentalOfficerPhone}`);
    }
    if (input.environmentalOfficerQualifications) {
      partyInfo.push(`Qualifications: ${input.environmentalOfficerQualifications}`);
    }
    if (input.environmentalOfficerCertification) {
      partyInfo.push(`Certification: ${input.environmentalOfficerCertification}`);
    }
    if (input.environmentalOfficerDesignationDate) {
      partyInfo.push(`Designation Date: ${input.environmentalOfficerDesignationDate}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedEnvironmentalComplianceContent): DocumentSection[] {
    const input = userInput as unknown as EnvironmentalComplianceUserInput;

    return [
      {
        title: 'ENVIRONMENTAL POLICY FRAMEWORK',
        content: generatedContent.environmentalPolicyFramework || this.generateEnvironmentalPolicyFramework(input)
      },
      {
        title: 'LEGAL COMPLIANCE REQUIREMENTS',
        content: generatedContent.legalComplianceRequirements || this.generateLegalComplianceRequirements(input)
      },
      {
        title: 'ENVIRONMENTAL MANAGEMENT SYSTEM',
        content: generatedContent.environmentalManagementSystem || this.generateEnvironmentalManagementSystem(input)
      },
      {
        title: 'POLLUTION PREVENTION AND CONTROL',
        content: generatedContent.pollutionPreventionControl || this.generatePollutionPreventionControl(input)
      },
      {
        title: 'RESOURCE CONSERVATION AND MANAGEMENT',
        content: generatedContent.resourceConservationManagement || this.generateResourceConservationManagement(input)
      },
      {
        title: 'COMMUNITY RELATIONS AND ENGAGEMENT',
        content: generatedContent.communityRelationsEngagement || this.generateCommunityRelationsEngagement(input)
      },
      {
        title: 'MONITORING AND REPORTING PROCEDURES',
        content: generatedContent.monitoringReportingProcedures || this.generateMonitoringReportingProcedures(input)
      },
      {
        title: 'TRAINING AND CAPACITY BUILDING',
        content: generatedContent.trainingCapacityBuilding || this.generateTrainingCapacityBuilding(input)
      },
      {
        title: 'EMERGENCY RESPONSE AND INCIDENT MANAGEMENT',
        content: generatedContent.emergencyResponseIncidentManagement || this.generateEmergencyResponseIncidentManagement(input)
      },
      {
        title: 'AUDIT AND REVIEW MECHANISMS',
        content: generatedContent.auditReviewMechanisms || this.generateAuditReviewMechanisms(input)
      }
    ];
  }

  private generateEnvironmentalPolicyFramework(input: EnvironmentalComplianceUserInput): string {
    const companyName = input.companyName || 'Company Name';
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `ENVIRONMENTAL POLICY FRAMEWORK

This Environmental Compliance Agreement (the "Agreement") is established by ${companyName} to ensure comprehensive compliance with environmental laws and regulations in ${governingLaw}, including the Environmental Management and Co-ordination Act (EMCA) 2015, National Environment Management Authority (NEMA) regulations, and all applicable environmental standards.

ENVIRONMENTAL POLICY STATEMENT:
${input.environmentalPolicyStatement || `${companyName} is committed to:
• Protecting and preserving the environment for current and future generations
• Preventing pollution and minimizing environmental impacts from all operations
• Complying with all applicable environmental laws, regulations, and standards
• Promoting sustainable resource use and waste minimization
• Engaging with local communities and stakeholders on environmental matters
• Continuously improving environmental performance through innovation and best practices`}

ENVIRONMENTAL OBJECTIVES AND TARGETS:
${input.environmentalObjectivesTargets || `Key objectives include:
• Achieve zero environmental violations and maintain full regulatory compliance
• Reduce carbon footprint by implementing energy efficiency and renewable energy measures
• Minimize waste generation and achieve high recycling and reuse rates
• Conserve water resources through efficient use and treatment technologies
• Protect biodiversity and ecosystem services in operational areas
• Maintain air and water quality standards in compliance with NEMA requirements`}

LEGAL FRAMEWORK COMPLIANCE:
${input.environmentalLegalFramework}

EMCA 2015 COMPLIANCE:
${input.emcaComplianceRequirements || `Full compliance with Environmental Management and Co-ordination Act 2015 requirements including:
• Environmental Impact Assessment (EIA) compliance for prescribed projects
• Environmental Audit requirements for existing projects
• Waste management licensing and compliance
• Water resource management and protection
• Air quality management and emissions control
• Noise and vibration control measures`}

NEMA LICENSING REQUIREMENTS:
${input.nemaLicensingRequirements || `Compliance with all NEMA licensing requirements:
• Environmental Impact Assessment License (EIA License)
• Waste Management License for waste generators and handlers
• Water Use License for water abstraction and discharge
• Air Emissions License for air pollution sources
• Noise License for noise-generating activities`}

POLICY IMPLEMENTATION:
The Environmental Officer, ${input.environmentalOfficerName}, is responsible for implementing this policy framework and ensuring all environmental management programs are effectively executed.

POLICY REVIEW AND UPDATES:
This policy framework shall be reviewed annually and updated as necessary to reflect changes in environmental legislation, business operations, and stakeholder expectations.

EFFECTIVE DATE:
This Environmental Policy Framework becomes effective on ${input.effectiveDate} and supersedes all previous environmental policies and procedures.`;
  }

  private generateLegalComplianceRequirements(input: EnvironmentalComplianceUserInput): string {
    return `LEGAL COMPLIANCE REQUIREMENTS

REGULATORY FRAMEWORK:
This Agreement ensures compliance with all applicable environmental laws and regulations in Kenya, including but not limited to:

1. ENVIRONMENTAL MANAGEMENT AND CO-ORDINATION ACT (EMCA) 2015
${input.emcaComplianceRequirements || `• Environmental Impact Assessment requirements for all prescribed projects
• Environmental Audit requirements for existing facilities
• Environmental Restoration Orders compliance
• Environmental Management Plans implementation
• Public participation requirements in environmental decision-making`}

2. NATIONAL ENVIRONMENT MANAGEMENT AUTHORITY (NEMA) REGULATIONS
${input.nemaLicensingRequirements || `• Compliance with Environmental Impact Assessment and Audit Regulations 2003
• Water Quality Regulations compliance
• Air Quality Regulations compliance
• Noise and Excessive Vibration Pollution Control Regulations
• Waste Management Regulations compliance
• Ozone Depleting Substances Regulations`}

3. ENVIRONMENTAL IMPACT ASSESSMENT REQUIREMENTS
${input.eiaRequirements || `• Mandatory EIA for all prescribed projects as per Second Schedule of EMCA 2015
• EIA License application and renewal procedures
• Public participation and stakeholder consultation requirements
• Environmental Management Plan (EMP) implementation
• EIA compliance monitoring and reporting`}

4. ENVIRONMENTAL AUDIT REQUIREMENTS
${input.environmentalAuditRequirements || `• Annual environmental audits for existing projects
• Environmental Audit Report submission to NEMA
• Compliance with Environmental Audit Regulations
• Implementation of audit recommendations
• Corrective action plans for non-compliance issues`}

5. SECTOR-SPECIFIC REGULATIONS
${input.sectorSpecificRegulations || `Compliance with sector-specific environmental regulations including:
• Mining Act and regulations for mining operations
• Water Act 2016 for water resource management
• Public Health Act for health and safety requirements
• Wildlife Conservation and Management Act
• Forest Conservation and Management Act 2016`}

6. COUNTY ENVIRONMENTAL REQUIREMENTS
${input.countyEnvironmentalRequirements || `• Compliance with county environmental bylaws and regulations
• County environmental licensing requirements
• County waste management regulations
• Building and construction environmental standards
• County public health regulations`}

7. INTERNATIONAL STANDARDS COMPLIANCE
${input.internationalStandardsCompliance || `• ISO 14001 Environmental Management System standards
• Convention on Biological Diversity requirements
• Basel Convention on hazardous waste management
• Stockholm Convention on Persistent Organic Pollutants
• Ramsar Convention on wetlands protection`}

COMPLIANCE MONITORING:
Regular compliance audits shall be conducted to ensure adherence to all applicable environmental laws and regulations, with findings documented and remedial actions implemented as required.

REGULATORY UPDATES:
The organization shall maintain awareness of changes in environmental legislation and regulations, updating compliance procedures accordingly to maintain legal compliance at all times.`;
  }

  private generateEnvironmentalManagementSystem(input: EnvironmentalComplianceUserInput): string {
    return `ENVIRONMENTAL MANAGEMENT SYSTEM (EMS)

${input.environmentalManagementSystem}

EMS FRAMEWORK:
The Environmental Management System is designed to systematically manage environmental aspects and impacts, ensure regulatory compliance, and drive continuous environmental improvement.

1. ENVIRONMENTAL MANAGEMENT PROGRAMS
${input.environmentalManagementPrograms || `Comprehensive programs addressing:
• Waste minimization and management
• Energy conservation and efficiency
• Water conservation and quality management
• Air quality management and emissions control
• Biodiversity conservation and ecosystem protection
• Chemical and hazardous materials management
• Community engagement and stakeholder relations`}

2. ENVIRONMENTAL PROCEDURES AND DOCUMENTATION
${input.environmentalProceduresDocumentation || `Documented procedures covering:
• Environmental aspect identification and impact assessment
• Environmental objective and target setting
• Environmental monitoring and measurement procedures
• Emergency preparedness and response procedures
• Environmental incident investigation and reporting
• Environmental compliance evaluation procedures
• Management review and continual improvement processes`}

3. ENVIRONMENTAL RESPONSIBILITIES AND AUTHORITIES
${input.environmentalResponsibilities || `Clear definition of roles and responsibilities:
• Environmental Officer: Overall EMS implementation and compliance monitoring
• Department Heads: Environmental performance within their areas of responsibility
• All Employees: Environmental awareness and compliance with procedures
• Management: Environmental policy commitment and resource provision
• Contractors: Compliance with environmental requirements and procedures`}

4. ENVIRONMENTAL TRAINING REQUIREMENTS
${input.environmentalTrainingRequirements || `Comprehensive training programs including:
• Environmental awareness training for all employees
• Specialized training for personnel in environmentally sensitive roles
• Emergency response training for relevant personnel
• Regulatory compliance training for management and supervisors
• Contractor environmental orientation and training
• Refresher training and competency assessments`}

5. ENVIRONMENTAL PERFORMANCE INDICATORS
${input.environmentalPerformanceIndicators || `Key performance indicators for monitoring environmental performance:
• Compliance with environmental regulations and license conditions
• Waste generation rates and recycling percentages
• Energy consumption and greenhouse gas emissions
• Water consumption and discharge quality
• Air emissions and ambient air quality
• Environmental incident frequency and severity
• Community complaints and stakeholder feedback`}

6. ENVIRONMENTAL DOCUMENTATION AND RECORDS
${input.documentationRequirements}

DOCUMENT CONTROL:
${input.documentControlSystems || `• All environmental documents maintained in controlled document system
• Regular review and update of environmental procedures
• Distribution of current versions to relevant personnel
• Management of obsolete documents and records
• Electronic and physical document security and backup`}

7. MANAGEMENT REVIEW AND CONTINUAL IMPROVEMENT
Regular management reviews shall assess EMS effectiveness, environmental performance, and opportunities for improvement, ensuring the system remains suitable, adequate, and effective.`;
  }

  private generatePollutionPreventionControl(input: EnvironmentalComplianceUserInput): string {
    return `POLLUTION PREVENTION AND CONTROL

${input.pollutionPreventionControl}

COMPREHENSIVE POLLUTION MANAGEMENT:
This section outlines measures to prevent, minimize, and control all forms of environmental pollution from operations.

1. AIR QUALITY MANAGEMENT
${input.airQualityManagement || `Air pollution prevention and control measures:
• Installation and maintenance of appropriate emission control systems
• Regular monitoring of air emissions to ensure compliance with NEMA standards
• Implementation of dust suppression measures for fugitive emissions
• Use of cleaner production technologies and fuel alternatives
• Regular calibration and maintenance of emission monitoring equipment
• Ambient air quality monitoring in surrounding areas`}

2. WATER POLLUTION CONTROL
${input.waterPollutionControl || `Water pollution prevention and control measures:
• Installation of appropriate wastewater treatment systems
• Regular monitoring of water discharge quality parameters
• Implementation of source reduction and waste minimization practices
• Proper storage and handling of chemicals and hazardous materials
• Groundwater protection measures including wellhead protection
• Surface water protection through buffer zones and containment systems`}

3. SOIL CONTAMINATION PREVENTION
${input.soilContaminationPrevention || `Soil protection and contamination prevention:
• Proper storage and handling of chemicals and petroleum products
• Installation of secondary containment for storage tanks and containers
• Regular inspection and maintenance of underground storage systems
• Soil quality monitoring in potentially impacted areas
• Implementation of spill prevention and response procedures
• Contaminated soil remediation procedures and techniques`}

4. NOISE POLLUTION CONTROL
${input.noisePollutonControl || `Noise pollution control and management:
• Implementation of noise control measures for machinery and equipment
• Regular noise level monitoring at facility boundaries
• Use of sound barriers and acoustic enclosures where necessary
• Scheduling of noisy activities to minimize community disturbance
• Employee hearing protection programs
• Community noise complaint response procedures`}

5. WASTE MANAGEMENT
${input.wasteManagementProcedures}

WASTE MINIMIZATION:
${input.wasteMinimizationStrategies || `• Source reduction through process optimization and material substitution
• Reuse of materials and byproducts where technically feasible
• Recycling programs for paper, metals, plastics, and other materials
• Composting of organic waste materials
• Recovery of valuable materials from waste streams`}

HAZARDOUS WASTE MANAGEMENT:
${input.hazardousWasteManagement || `• Proper identification and classification of hazardous wastes
• Safe storage in appropriate containers and storage areas
• Licensed transportation and disposal through approved facilities
• Manifest tracking and record keeping for hazardous waste shipments
• Employee training on hazardous waste handling procedures`}

6. CHEMICAL MANAGEMENT
${input.chemicalManagement || `Chemical and hazardous substances management:
• Comprehensive chemical inventory and safety data sheet management
• Proper storage, labeling, and handling of chemicals
• Spill prevention and response procedures
• Personal protective equipment requirements
• Chemical compatibility and segregation requirements
• Regular inspection of chemical storage areas and containment systems`}

7. EMISSION CONTROL SYSTEMS
${input.emissionControlSystems || `• Installation and maintenance of air pollution control equipment
• Regular performance testing and monitoring of control systems
• Optimization of combustion processes to minimize emissions
• Implementation of leak detection and repair (LDAR) programs
• Use of pollution prevention technologies and cleaner production methods`}

POLLUTION MONITORING AND REPORTING:
Regular monitoring of all pollution parameters with results reported to regulatory authorities as required by license conditions and environmental regulations.`;
  }

  private generateResourceConservationManagement(input: EnvironmentalComplianceUserInput): string {
    return `RESOURCE CONSERVATION AND MANAGEMENT

SUSTAINABLE RESOURCE UTILIZATION:
This section outlines comprehensive strategies for conserving and managing natural resources including water, energy, and biodiversity.

1. WATER RESOURCE MANAGEMENT
${input.waterResourceManagement || `Comprehensive water stewardship program including:
• Water use assessment and efficiency improvement opportunities
• Implementation of water conservation technologies and practices
• Rainwater harvesting and stormwater management systems
• Water recycling and reuse systems where technically feasible
• Groundwater protection through monitoring and sustainable extraction
• Surface water protection through watershed management practices`}

WATER CONSERVATION MEASURES:
${input.waterConservationMeasures || `• Installation of water-efficient fixtures and equipment
• Regular leak detection and repair programs
• Process water optimization and closed-loop systems
• Employee awareness and water conservation training programs
• Landscaping with drought-resistant native plants
• Greywater reuse systems for appropriate applications`}

WATER QUALITY MONITORING:
${input.waterQualityMonitoring || `• Regular testing of water sources for quality parameters
• Monitoring of wastewater discharge quality
• Groundwater monitoring well installation and sampling
• Surface water quality assessment in receiving waters
• Laboratory analysis using accredited testing facilities`}

2. ENERGY MANAGEMENT
${input.energyManagement || `Comprehensive energy management program including:
• Energy audits to identify conservation opportunities
• Implementation of energy-efficient technologies and equipment
• Building energy management systems and automation
• Employee energy conservation awareness programs
• Regular monitoring and reporting of energy consumption
• Setting and tracking energy reduction targets and goals`}

ENERGY CONSERVATION MEASURES:
${input.energyConservationMeasures || `• Upgrading to energy-efficient lighting, HVAC, and motor systems
• Building envelope improvements for thermal efficiency
• Process optimization to reduce energy consumption
• Load management and demand response programs
• Regular maintenance of energy-consuming equipment
• Implementation of energy management standards (ISO 50001)`}

RENEWABLE ENERGY INITIATIVES:
${input.renewableEnergyInitiatives || `• Feasibility assessment for solar, wind, and other renewable energy options
• Implementation of on-site renewable energy generation where appropriate
• Green energy procurement programs and renewable energy certificates
• Energy storage systems to optimize renewable energy utilization
• Community renewable energy partnerships and initiatives`}

3. BIODIVERSITY AND ECOSYSTEM CONSERVATION
${input.biodiversityConservation || `Biodiversity protection and enhancement measures:
• Habitat assessment and conservation planning
• Native species protection and restoration programs
• Invasive species prevention and management
• Wildlife corridors and connectivity conservation
• Ecosystem service assessment and enhancement
• Collaboration with conservation organizations and government agencies`}

ECOSYSTEM PROTECTION MEASURES:
${input.ecosystemProtectionMeasures || `• Buffer zones around sensitive habitats and water bodies
• Restoration of degraded ecosystems and habitats
• Soil conservation and erosion control measures
• Vegetation management and native plant restoration
• Wildlife protection measures and animal crossing structures
• Marine and aquatic ecosystem protection (where applicable)`}

4. FOREST CONSERVATION
${input.forestConservation || `Forest protection and sustainable management:
• Forest area protection and restoration programs
• Sustainable harvesting practices (where applicable)
• Reforestation and afforestation initiatives
• Community forest management partnerships
• Forest fire prevention and management systems
• Carbon sequestration and REDD+ initiatives`}

5. SUSTAINABLE PROCUREMENT
${input.sustainableProcurementPolicies || `• Procurement policies favoring environmentally preferable products
• Supplier environmental performance evaluation and requirements
• Life cycle assessment considerations in procurement decisions
• Local sourcing to reduce transportation impacts
• Renewable and recycled content requirements for purchased materials
• Green building materials and sustainable construction practices`}

RESOURCE EFFICIENCY TARGETS:
Specific targets shall be established for resource conservation including water use reduction, energy efficiency improvements, waste minimization, and biodiversity enhancement, with regular monitoring and reporting of progress.`;
  }

  private generateCommunityRelationsEngagement(input: EnvironmentalComplianceUserInput): string {
    return `COMMUNITY RELATIONS AND ENGAGEMENT

${input.communityEngagement}

STAKEHOLDER ENGAGEMENT FRAMEWORK:
Comprehensive approach to engaging with local communities, government agencies, civil society organizations, and other stakeholders on environmental matters.

1. STAKEHOLDER CONSULTATION PROCEDURES
${input.stakeholderConsultationProcedures || `Structured stakeholder engagement including:
• Identification and mapping of all relevant stakeholders
• Regular community meetings and consultation forums
• Traditional and local authority engagement protocols
• Government agency liaison and coordination
• Civil society and NGO partnership development
• Indigenous peoples consultation (where applicable)`}

2. PUBLIC PARTICIPATION REQUIREMENTS
${input.publicParticipationRequirements || `Public participation in environmental decision-making:
• Public disclosure of environmental information and reports
• Community input opportunities for environmental planning
• Public hearings for major environmental decisions
• Accessible information sharing in local languages
• Community feedback integration in environmental management
• Transparency in environmental performance reporting`}

3. COMMUNITY GRIEVANCE MECHANISMS
${input.communityGrievanceMechanisms || `Accessible and effective grievance procedures:
• Multiple channels for community feedback and complaints
• Clear procedures for grievance receipt, investigation, and response
• Community liaison officers for ongoing communication
• Regular community meetings to address concerns
• Escalation procedures for unresolved grievances
• Confidential reporting mechanisms for sensitive issues`}

4. CORPORATE SOCIAL RESPONSIBILITY
${input.corporateSocialResponsibility || `Community investment and social programs:
• Education and capacity building programs
• Healthcare and public health initiatives
• Infrastructure development and maintenance
• Local employment and skills development
• Small business development and procurement opportunities
• Cultural preservation and promotion programs`}

5. COMMUNITY DEVELOPMENT PROGRAMS
${input.communityDevelopmentPrograms || `Sustainable development initiatives:
• Clean water and sanitation projects
• Renewable energy access programs
• Sustainable agriculture and food security initiatives
• Environmental education and awareness programs
• Community-based natural resource management
• Women's empowerment and gender equality programs`}

6. CULTURAL HERITAGE PROTECTION
${input.culturalHeritageProtection || `Cultural and archaeological heritage preservation:
• Archaeological and cultural site identification and protection
• Traditional knowledge documentation and preservation
• Cultural landscape conservation
• Community cultural practice support
• Traditional medicine and knowledge protection
• Sacred site protection and access arrangements`}

7. LAND RIGHTS CONSIDERATIONS
${input.landRightsConsiderations || `Respect for land and resource rights:
• Recognition of customary land tenure systems
• Fair compensation for land use impacts
• Resettlement and livelihood restoration (where applicable)
• Benefit-sharing agreements for resource utilization
• Land use planning collaboration with communities
• Traditional use rights recognition and protection`}

8. COMMUNITY ENVIRONMENTAL MONITORING
Community-based environmental monitoring programs including:
• Training local residents in environmental monitoring techniques
• Provision of monitoring equipment and technical support
• Integration of community monitoring data in environmental reporting
• Community environmental stewardship programs
• Local environmental ambassadors and champions

STAKEHOLDER COMMUNICATION:
Regular communication with stakeholders through multiple channels including community meetings, newsletters, radio programs, social media, and direct engagement to ensure transparency and maintain positive relationships.

COMMUNITY FEEDBACK INTEGRATION:
Systematic integration of community feedback and concerns into environmental management planning and decision-making processes, with documented responses to community input.`;
  }

  private generateMonitoringReportingProcedures(input: EnvironmentalComplianceUserInput): string {
    return `MONITORING AND REPORTING PROCEDURES

${input.environmentalMonitoring}

COMPREHENSIVE ENVIRONMENTAL MONITORING:
Systematic monitoring program to track environmental performance, ensure regulatory compliance, and identify opportunities for improvement.

1. MONITORING PARAMETERS AND STANDARDS
${input.monitoringParameters || `Key parameters monitored include:
• Air quality: PM10, PM2.5, SO2, NOx, CO, hydrocarbons, and facility-specific pollutants
• Water quality: pH, dissolved oxygen, turbidity, nutrients, heavy metals, and organic compounds
• Soil quality: pH, organic matter, heavy metals, nutrients, and contamination indicators
• Noise levels: ambient noise monitoring at facility boundaries and sensitive receptors
• Waste quantities: generation rates, composition, recycling rates, and disposal methods
• Energy consumption: electricity, fuel consumption, and renewable energy generation`}

2. MONITORING FREQUENCY AND METHODS
${input.monitoringFrequency || `Monitoring schedule and methodologies:
• Continuous monitoring for critical parameters using automated systems
• Daily monitoring for operational parameters and compliance indicators
• Weekly monitoring for routine environmental parameters
• Monthly comprehensive environmental monitoring and reporting
• Quarterly ecological and biodiversity monitoring
• Annual comprehensive environmental audit and assessment`}

MONITORING METHODS:
${input.monitoringMethods || `• Automated monitoring systems with data logging capabilities
• Manual sampling and field measurements using calibrated instruments
• Laboratory analysis by NEMA-accredited laboratories
• Remote sensing and satellite imagery for land use changes
• Biological monitoring using indicator species and ecosystem health assessments
• Community-based monitoring involving local residents and stakeholders`}

3. MONITORING EQUIPMENT REQUIREMENTS
${input.monitoringEquipmentRequirements || `• Calibrated and certified monitoring instruments
• Regular equipment maintenance and calibration schedules
• Quality assurance and quality control procedures
• Backup equipment and contingency monitoring arrangements
• Data logging and automated data collection systems
• Laboratory equipment for on-site analysis capabilities`}

4. DATA COLLECTION AND MANAGEMENT
${input.dataCollectionProcedures || `Data management procedures including:
• Standardized data collection forms and protocols
• Electronic data management systems with backup capabilities
• Quality assurance and quality control procedures for data validity
• Chain of custody procedures for samples and monitoring data
• Data security and confidentiality protection measures
• Long-term data storage and archival procedures`}

5. LABORATORY ANALYSIS REQUIREMENTS
${input.laboratoryAnalysisRequirements || `• Use of NEMA-accredited laboratories for all compliance monitoring
• Regular inter-laboratory comparison and quality assurance programs
• Proper sample collection, preservation, and transport procedures
• Analysis methods following Kenya Bureau of Standards (KEBS) or international standards
• Chain of custody documentation for all samples
• Quality control samples including blanks, duplicates, and spikes`}

6. REGULATORY REPORTING REQUIREMENTS
${input.monitoringReportingTimelines || `Reporting schedule and requirements:
• Monthly monitoring reports to NEMA and other relevant authorities
• Quarterly environmental performance reports
• Annual environmental compliance reports
• Annual environmental audit reports
• Incident and non-compliance reporting within 24-48 hours
• Public disclosure of environmental monitoring results`}

7. ENVIRONMENTAL PERFORMANCE REPORTING
Regular reporting on environmental performance indicators including:
• Compliance status with environmental regulations and license conditions
• Trends in environmental parameters and performance indicators
• Environmental improvement initiatives and their effectiveness
• Community engagement activities and feedback
• Corrective actions taken for non-compliance or environmental impacts

8. DATA MANAGEMENT AND ARCHIVAL
${input.dataManagementProcedures || `• Electronic database systems for environmental monitoring data
• Regular data backup and disaster recovery procedures
• Data retention schedules in compliance with regulatory requirements
• Access controls and data security measures
• Integration with environmental management information systems
• Public access to environmental monitoring data as required by law`}

CONTINUOUS IMPROVEMENT:
Regular review and updating of monitoring procedures based on regulatory changes, technological improvements, and lessons learned from monitoring activities.`;
  }

  private generateTrainingCapacityBuilding(input: EnvironmentalComplianceUserInput): string {
    return `TRAINING AND CAPACITY BUILDING

${input.environmentalTraining}

COMPREHENSIVE ENVIRONMENTAL TRAINING PROGRAM:
Systematic approach to building environmental awareness, knowledge, and capacity among employees, contractors, and community members.

1. STAFF TRAINING PROGRAMS
${input.staffTrainingPrograms || `Comprehensive training for all personnel:
• Environmental awareness training for all new employees
• Role-specific environmental training for personnel in sensitive positions
• Management training on environmental leadership and compliance
• Technical training for environmental monitoring and management
• Emergency response and incident management training
• Regular refresher training and competency assessments`}

2. ENVIRONMENTAL AWARENESS PROGRAMS
${input.environmentalAwarenessPrograms || `Organization-wide environmental awareness initiatives:
• Environmental policy and commitment communication
• Monthly environmental awareness topics and campaigns
• Environmental performance feedback and recognition programs
• Green office and sustainable workplace practices
• Employee suggestion programs for environmental improvements
• Environmental newsletter and internal communication materials`}

3. CAPACITY BUILDING INITIATIVES
${input.capacityBuildingInitiatives || `Skills development and capacity building:
• Technical training on environmental monitoring equipment and procedures
• Professional development opportunities for environmental personnel
• Participation in environmental conferences, workshops, and seminars
• Certification programs for environmental management systems
• Cross-training and knowledge sharing initiatives
• Partnerships with educational institutions and training providers`}

4. TRAINING RECORD KEEPING
${input.trainingRecordKeeping || `Comprehensive training documentation:
• Individual training records for all employees
• Training attendance and completion certificates
• Competency assessments and evaluation results
• Training effectiveness evaluation and feedback
• Training material updates and version control
• Annual training summary reports and statistics`}

5. ENVIRONMENTAL EDUCATION PROGRAMS
${input.environmentalEducationPrograms || `Educational initiatives for broader environmental awareness:
• School environmental education programs and partnerships
• University research collaboration and internship programs
• Adult environmental literacy programs
• Environmental science fair and competition sponsorship
• Environmental scholarship and bursary programs
• Public environmental education campaigns`}

6. COMMUNITY AWARENESS PROGRAMS
${input.communityAwarenessPrograms || `Community-focused environmental awareness:
• Community environmental education workshops and seminars
• Traditional and social media environmental awareness campaigns
• Community environmental monitoring training programs
• Environmental stewardship and conservation programs
• Cultural integration of environmental messages and practices
• Women's and youth environmental leadership programs`}

7. CONTRACTOR AND SUPPLIER TRAINING
Comprehensive environmental training for contractors and suppliers including:
• Pre-contract environmental orientation and requirements
• Specific environmental procedures and protocols training
• Regular safety and environmental toolbox talks
• Environmental incident reporting and response training
• Waste management and pollution prevention training
• Cultural sensitivity and community engagement training

8. TRAINING EFFECTIVENESS EVALUATION
${input.capacityBuildingInitiatives || `Assessment of training program effectiveness:
• Pre- and post-training knowledge assessments
• Practical competency demonstrations and evaluations
• Environmental performance improvement tracking
• Training participant feedback and satisfaction surveys
• Environmental incident reduction correlation with training
• Annual training program review and improvement planning`}

TRAINING RESOURCES AND MATERIALS:
Development and maintenance of comprehensive training resources including:
• Training manuals and procedures in multiple languages
• Visual aids, videos, and interactive training materials
• Online learning platforms and e-learning modules
• Training facilities and equipment for practical demonstrations
• External training provider partnerships and agreements

CONTINUOUS LEARNING CULTURE:
Promotion of continuous environmental learning and improvement through:
• Regular environmental updates and information sharing
• Peer-to-peer learning and knowledge exchange programs
• Environmental best practice sharing and benchmarking
• Innovation and environmental improvement suggestion programs
• Recognition and rewards for environmental excellence and learning`;
  }

  private generateEmergencyResponseIncidentManagement(input: EnvironmentalComplianceUserInput): string {
    return `EMERGENCY RESPONSE AND INCIDENT MANAGEMENT

COMPREHENSIVE EMERGENCY PREPAREDNESS:
Systematic approach to preventing, preparing for, responding to, and recovering from environmental emergencies and incidents.

1. EMERGENCY RESPONSE PLAN
${input.emergencyResponsePlan || `Comprehensive emergency response procedures:
• Emergency response organization structure and responsibilities
• Emergency contact information for internal and external responders
• Emergency notification procedures and communication protocols
• Resource inventory including emergency equipment and supplies
• Mutual aid agreements with neighboring facilities and emergency services
• Regular emergency response plan updates and revisions`}

2. ENVIRONMENTAL INCIDENT MANAGEMENT
${input.environmentalIncidentManagement || `Systematic incident response procedures:
• Incident classification system based on severity and environmental impact
• Immediate response actions to minimize environmental damage
• Incident investigation procedures and root cause analysis
• Corrective and preventive action implementation
• Incident documentation and regulatory reporting requirements
• Lessons learned integration and procedure improvements`}

3. SPILL RESPONSE PROCEDURES
${input.spillResponseProcedures || `Chemical and petroleum spill response:
• Immediate containment and control measures
• Personnel safety and evacuation procedures
• Environmental impact assessment and monitoring
• Cleanup and remediation procedures
• Waste disposal and decontamination protocols
• Regulatory notification and reporting requirements`}

4. FIRE EMERGENCY PROCEDURES
${input.fireEmergencyProcedures || `Fire prevention and response procedures:
• Fire prevention measures and hot work controls
• Fire detection and alarm systems operation
• Emergency evacuation procedures and assembly points
• Fire suppression system operation and maintenance
• Environmental protection during fire emergencies
• Post-fire environmental assessment and cleanup`}

5. EVACUATION PROCEDURES
${input.evacuationProcedures || `Emergency evacuation planning:
• Evacuation routes and assembly point designation
• Personnel accountability and headcount procedures
• Special needs personnel evacuation assistance
• Emergency transportation arrangements
• Communication with families and external authorities
• Return-to-work procedures and safety clearance`}

6. EMERGENCY CONTACT PROCEDURES
${input.emergencyContactProcedures || `Emergency communication protocols:
• 24-hour emergency contact numbers and procedures
• Regulatory authority notification requirements and timelines
• Community notification and public information procedures
• Media relations and public communication protocols
• Family notification procedures for personnel involved in incidents
• External emergency services coordination and communication`}

7. INCIDENT REPORTING PROCEDURES
${input.incidentReportingProcedures || `Comprehensive incident documentation:
• Immediate incident notification procedures (within 2-4 hours)
• Detailed incident investigation and reporting forms
• Photography and evidence collection procedures
• Witness statement collection and documentation
• Regulatory reporting timelines and requirements
• Internal incident reporting and communication procedures`}

8. POST-INCIDENT INVESTIGATION
${input.postIncidentInvestigation || `Thorough incident investigation procedures:
• Investigation team formation and roles
• Evidence collection and preservation procedures
• Root cause analysis using systematic methodologies
• Contributing factor identification and analysis
• Corrective action development and implementation
• Investigation report preparation and distribution`}

EMERGENCY EQUIPMENT AND RESOURCES:
Maintenance of emergency response equipment including:
• Spill response materials and containment equipment
• Personal protective equipment for emergency responders
• Environmental monitoring equipment for incident assessment
• Communication equipment and emergency power supplies
• First aid and medical emergency supplies
• Heavy equipment and specialized response tools

EMERGENCY DRILLS AND TRAINING:
Regular emergency preparedness activities including:
• Monthly emergency evacuation drills
• Annual spill response training and simulation exercises
• Emergency response team training and certification
• Coordination exercises with external emergency services
• Equipment testing and maintenance procedures
• Emergency response plan effectiveness evaluation

BUSINESS CONTINUITY PLANNING:
Integration of environmental emergency response with business continuity planning to ensure rapid recovery and restoration of operations while maintaining environmental protection and compliance.`;
  }

  private generateAuditReviewMechanisms(input: EnvironmentalComplianceUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `AUDIT AND REVIEW MECHANISMS

COMPREHENSIVE ENVIRONMENTAL AUDITING SYSTEM:
Systematic approach to evaluating environmental management system effectiveness, regulatory compliance, and environmental performance.

1. ENVIRONMENTAL AUDIT PROCEDURES
${input.environmentalAuditProcedures || `Systematic environmental auditing including:
• Annual comprehensive environmental audit as required by EMCA 2015
• Internal environmental management system audits
• Compliance audits for regulatory requirements and license conditions
• Performance audits for environmental objectives and targets
• Special-purpose audits for specific environmental issues or incidents
• Third-party independent audits for verification and validation`}

2. INTERNAL AUDIT SCHEDULE
${input.internalAuditSchedule || `Regular internal auditing program:
• Monthly departmental environmental compliance checks
• Quarterly environmental management system audits
• Semi-annual comprehensive facility environmental audits
• Annual environmental management system effectiveness review
• Special audits following incidents or regulatory changes
• Continuous monitoring and audit of critical environmental controls`}

3. EXTERNAL AUDIT REQUIREMENTS
${input.externalAuditRequirements || `Independent external auditing:
• Annual environmental audit by qualified environmental auditors as required by NEMA
• ISO 14001 certification audits by accredited certification bodies
• Regulatory compliance audits by government authorities
• Due diligence audits for financing and insurance purposes
• Supply chain environmental audits for major suppliers and contractors
• Community-requested independent environmental assessments`}

4. AUDIT FINDINGS MANAGEMENT
${input.auditFindingsManagement || `Systematic management of audit findings:
• Audit finding classification by severity and regulatory significance
• Root cause analysis for all major and moderate findings
• Corrective action plan development with specific timelines
• Assignment of responsibilities for corrective action implementation
• Progress tracking and verification of corrective action effectiveness
• Closure procedures for verified corrective actions`}

5. CORRECTIVE ACTION PROCEDURES
${input.correctiveActionProcedures || `Comprehensive corrective action system:
• Immediate actions to address urgent environmental risks
• Short-term corrective actions to prevent recurrence
• Long-term system improvements to enhance environmental performance
• Resource allocation and budget planning for corrective actions
• Regular progress monitoring and reporting on corrective actions
• Verification and validation of corrective action effectiveness`}

6. MANAGEMENT REVIEW PROCEDURES
${input.managementReviewProcedures || `Senior management environmental review:
• Quarterly environmental performance review meetings
• Annual comprehensive environmental management system review
• Review of environmental policy, objectives, and targets
• Assessment of environmental regulatory compliance status
• Evaluation of environmental training and awareness effectiveness
• Strategic planning for environmental improvement initiatives`}

7. CONTINUOUS IMPROVEMENT PROGRAMS
${input.continuousImprovementPrograms || `Systematic environmental improvement:
• Environmental performance trend analysis and benchmarking
• Best practice identification and implementation
• Technology assessment and upgrade planning
• Process optimization for environmental performance improvement
• Innovation programs for environmental technology development
• Stakeholder feedback integration in improvement planning`}

8. REGULATORY COMPLIANCE VERIFICATION
Regular verification of compliance with environmental laws and regulations:
• Legal compliance registers and obligation tracking
• Regular legal compliance assessments and gap analyses
• Regulatory update monitoring and impact assessments
• Compliance training and awareness for relevant personnel
• Documentation and record keeping for compliance demonstration

AUDIT DOCUMENTATION AND REPORTING:
Comprehensive audit documentation including:
• Audit plans, procedures, and checklists
• Audit findings, evidence, and supporting documentation
• Corrective action plans and implementation tracking
• Management review meeting minutes and decisions
• Annual environmental audit reports submitted to NEMA
• Public disclosure of environmental performance information

PERFORMANCE METRICS AND INDICATORS:
Regular monitoring of environmental performance indicators including:
• Environmental compliance rates and violation frequency
• Environmental objective and target achievement
• Environmental incident frequency and severity
• Resource consumption and efficiency improvements
• Waste generation and recycling rates
• Community satisfaction and stakeholder feedback

EFFECTIVE DATE AND IMPLEMENTATION:
This comprehensive Environmental Compliance Agreement becomes effective on ${input.effectiveDate} and is subject to regular review and updates to maintain effectiveness and alignment with environmental laws and regulations in ${governingLaw}.

GOVERNING LAW AND JURISDICTION:
This Agreement is governed by the environmental laws of ${governingLaw} and compliance is subject to the jurisdiction of NEMA and other relevant regulatory authorities.`;
  }
}