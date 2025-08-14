import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { AntiMoneyLaunderingComplianceUserInput, GeneratedAntiMoneyLaunderingComplianceContent } from '../../types/documents/compliance/anti-money-laundering';

export class AntiMoneyLaunderingGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'ANTI-MONEY LAUNDERING COMPLIANCE POLICY';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as AntiMoneyLaunderingComplianceUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const institutionName = (input.institutionName || 'Institution').replace(/[^a-zA-Z0-9]/g, '_');
    return `AML_Compliance_Policy_${institutionName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as AntiMoneyLaunderingComplianceUserInput;
    const partyInfo: string[] = [];

    // Institution Information
    partyInfo.push('Institution Information:');
    partyInfo.push(`Name: ${input.institutionName || 'Institution Name'}`);
    partyInfo.push(`Address: ${input.institutionAddress || 'Address not provided'}`);
    if (input.institutionEmail) {
      partyInfo.push(`Email: ${input.institutionEmail}`);
    }
    if (input.institutionPhone) {
      partyInfo.push(`Phone: ${input.institutionPhone}`);
    }
    if (input.institutionBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.institutionBusinessRegistration}`);
    }
    if (input.institutionLicenseNumber) {
      partyInfo.push(`License Number: ${input.institutionLicenseNumber}`);
    }
    partyInfo.push(`Institution Type: ${input.institutionType || 'Financial Institution'}`);
    if (input.institutionBusinessType) {
      partyInfo.push(`Business Type: ${input.institutionBusinessType}`);
    }
    partyInfo.push('');

    // Compliance Officer Information
    partyInfo.push('Compliance Officer Information:');
    partyInfo.push(`Name: ${input.complianceOfficerName || 'Compliance Officer'}`);
    if (input.complianceOfficerTitle) {
      partyInfo.push(`Title: ${input.complianceOfficerTitle}`);
    }
    if (input.complianceOfficerEmail) {
      partyInfo.push(`Email: ${input.complianceOfficerEmail}`);
    }
    if (input.complianceOfficerPhone) {
      partyInfo.push(`Phone: ${input.complianceOfficerPhone}`);
    }
    if (input.complianceOfficerQualifications) {
      partyInfo.push(`Qualifications: ${input.complianceOfficerQualifications}`);
    }
    if (input.complianceOfficerDesignationDate) {
      partyInfo.push(`Designation Date: ${input.complianceOfficerDesignationDate}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedAntiMoneyLaunderingComplianceContent): DocumentSection[] {
    const input = userInput as unknown as AntiMoneyLaunderingComplianceUserInput;

    return [
      {
        title: 'AML POLICY FRAMEWORK',
        content: generatedContent.amlPolicyFramework || this.generateAmlPolicyFramework(input)
      },
      {
        title: 'CUSTOMER DUE DILIGENCE',
        content: generatedContent.customerDueDiligence || this.generateCustomerDueDiligence(input)
      },
      {
        title: 'TRANSACTION MONITORING',
        content: generatedContent.transactionMonitoring || this.generateTransactionMonitoring(input)
      },
      {
        title: 'SUSPICIOUS ACTIVITY REPORTING',
        content: generatedContent.suspiciousActivityReporting || this.generateSuspiciousActivityReporting(input)
      },
      {
        title: 'RECORD KEEPING REQUIREMENTS',
        content: generatedContent.recordKeeping || this.generateRecordKeeping(input)
      },
      {
        title: 'TRAINING REQUIREMENTS',
        content: generatedContent.trainingRequirements || this.generateTrainingRequirements(input)
      },
      {
        title: 'COMPLIANCE OVERSIGHT',
        content: generatedContent.complianceOversight || this.generateComplianceOversight(input)
      },
      {
        title: 'RISK ASSESSMENT PROCEDURES',
        content: generatedContent.riskAssessment || this.generateRiskAssessment(input)
      },
      {
        title: 'AUDIT AND MONITORING PROCEDURES',
        content: generatedContent.auditProcedures || this.generateAuditProcedures(input)
      }
    ];
  }

  private generateAmlPolicyFramework(input: AntiMoneyLaunderingComplianceUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const institutionName = input.institutionName || 'Institution Name';
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `AML POLICY FRAMEWORK

This Anti-Money Laundering Compliance Policy (the "Policy") is established by ${institutionName} to ensure compliance with the Proceeds of Crime and Anti-Money Laundering Act, 2009, regulations issued by the Central Bank of Kenya (CBK), and guidelines from the Financial Reporting Centre (FRC) of Kenya.

POLICY OBJECTIVES:
${input.policyObjectives || `
• Prevent the use of financial services for money laundering and terrorist financing
• Ensure compliance with all applicable AML/CFT laws and regulations
• Protect the institution's reputation and maintain customer confidence
• Establish clear procedures for identifying and reporting suspicious activities
• Maintain effective risk management and internal controls`}

POLICY SCOPE:
${input.policyScope || `This Policy applies to all employees, directors, agents, and third-party service providers of ${institutionName}. It covers all financial products, services, and customer relationships, including but not limited to:
• Customer onboarding and account opening
• Transaction processing and monitoring
• Suspicious activity identification and reporting
• Record keeping and documentation
• Training and awareness programs`}

LEGAL FRAMEWORK:
This Policy is established in accordance with:
• Proceeds of Crime and Anti-Money Laundering Act, 2009
• Central Bank of Kenya Prudential Guidelines on Anti-Money Laundering and Combating the Financing of Terrorism (AML/CFT)
• Financial Reporting Centre Guidelines
• Banking Act and regulations
• Kenya Association of Bankers Guidelines
• International standards including FATF Recommendations

POLICY APPROVAL:
${input.policyApprovalAuthority || `This Policy has been approved by the Board of Directors and is subject to regular review and updates as required by law or regulatory guidance.`}

REVIEW SCHEDULE:
Policy Review Frequency: ${input.policyReviewFrequency || 'Annually or as required by regulatory changes'}
Last Review Date: ${input.policyLastReviewDate || 'To be determined'}
Next Review Date: ${input.policyNextReviewDate || 'To be scheduled'}

IMPLEMENTATION DATE:
This Policy becomes effective on ${input.effectiveDate} and supersedes all previous AML policies and procedures.

COMPLIANCE AUTHORITY:
The ${input.complianceOfficerTitle || 'Chief Compliance Officer'} is responsible for the implementation, monitoring, and enforcement of this Policy, with direct reporting lines to senior management and the Board of Directors.`;
  }

  private generateCustomerDueDiligence(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `CUSTOMER DUE DILIGENCE PROCEDURES

${input.customerDueDiligenceProcedures}

CUSTOMER IDENTIFICATION REQUIREMENTS:
${input.customerIdentificationRequirements || `All customers must be properly identified and verified before establishing a business relationship. Required identification includes:
• Valid national identity card or passport
• Certificate of incorporation for corporate entities
• Proof of address (utility bill, bank statement, lease agreement)
• Tax identification number
• Business registration documents where applicable`}

KNOW YOUR CUSTOMER (KYC) REQUIREMENTS:
${input.kycRequirements}

KYC DOCUMENTATION:
${input.kycDocumentationRequirements || `The following documents must be obtained and verified:
• Individual customers: National ID/passport, proof of address, income verification
• Corporate customers: Certificate of incorporation, board resolutions, beneficial ownership declarations
• High-risk customers: Enhanced documentation as determined by risk assessment`}

CUSTOMER VERIFICATION PROCEDURES:
${input.customerVerificationProcedures || `• Verify identity documents against original or certified copies
• Conduct database checks where available
• Confirm address through independent sources
• Screen against sanctions lists and PEP databases
• Conduct enhanced verification for high-risk customers`}

ENHANCED DUE DILIGENCE (EDD):
${input.enhancedDueDiligenceThresholds || `Enhanced due diligence is required for:
• Transactions above KES 1,000,000
• Politically Exposed Persons (PEPs) and their associates
• Customers from high-risk jurisdictions
• Complex or unusual transaction patterns
• Non-resident customers
• Cash-intensive businesses`}

SIMPLIFIED DUE DILIGENCE (SDD):
${input.simplifiedDueDiligenceCriteria || `Simplified procedures may apply to:
• Government entities and public bodies
• Listed companies subject to disclosure requirements
• Low-risk products with transaction limits below KES 100,000
• Existing customers with good standing and low-risk profile`}

ONGOING MONITORING:
${input.ongoingMonitoringProcedures || `• Regular review of customer information and risk profiles
• Monitoring of transaction patterns and account activity
• Periodic update of customer information
• Annual review of high-risk customer relationships
• Prompt investigation of unusual or suspicious activities`}

CUSTOMER RISK ASSESSMENT:
${input.customerRiskAssessmentCriteria || `Risk ratings are assigned based on:
• Customer type and business activities
• Geographic location and jurisdiction
• Product and service utilization
• Transaction patterns and volumes
• Source of funds and wealth
• Delivery channels used`}

BENEFICIAL OWNERSHIP IDENTIFICATION:
${input.beneficialOwnershipIdentification || `For corporate customers, identify and verify:
• Natural persons owning 25% or more of shares or voting rights
• Natural persons exercising control through other means
• Senior managing officials where no natural person exercises control
• Complete ownership chain for complex structures`}

SOURCE OF FUNDS VERIFICATION:
${input.sourceOfFundsVerification || `Verify the source of funds through:
• Employment records and salary certificates
• Business registration and financial statements
• Investment portfolios and asset documentation
• Inheritance documents where applicable
• Loan agreements and financing documents`}`;
  }

  private generateTransactionMonitoring(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `TRANSACTION MONITORING PROCEDURES

${input.transactionMonitoring}

MONITORING SYSTEM:
${input.transactionMonitoringSystem || `The institution operates a comprehensive transaction monitoring system that:
• Screens all transactions in real-time
• Applies rule-based and behavioral analytics
• Generates alerts for suspicious patterns
• Maintains audit trails for all monitoring activities
• Integrates with core banking and payment systems`}

SUSPICIOUS TRANSACTION THRESHOLDS:
${input.suspiciousTransactionThresholds || `Automatic alerts are generated for:
• Cash transactions exceeding KES 1,000,000
• Wire transfers above KES 5,000,000
• Multiple transactions just below reporting thresholds
• Transactions inconsistent with customer profile
• Rapid movement of funds across multiple accounts
• Transactions involving high-risk jurisdictions`}

REPORTING TRIGGERS:
${input.transactionReportingTriggers || `Transactions requiring special attention include:
• Structuring to avoid reporting requirements
• Unusual use of cash in large amounts
• Transactions with no apparent economic purpose
• Complex transactions with no clear business rationale
• Transactions involving known or suspected criminals
• Cross-border movements of large amounts`}

MONITORING FREQUENCY:
${input.monitoringFrequency || `• Real-time monitoring for all electronic transactions
• Daily review of cash transaction reports
• Weekly analysis of customer transaction patterns
• Monthly review of high-risk account activities
• Quarterly assessment of monitoring system effectiveness`}

AUTOMATED MONITORING TOOLS:
${input.automaticMonitoringTools || `The monitoring system includes:
• Pattern recognition algorithms
• Behavioral analysis capabilities
• Sanctions and PEP screening
• Geographic and jurisdictional risk scoring
• Velocity and frequency analysis
• Peer group comparison analytics`}

MANUAL REVIEW PROCEDURES:
${input.manualReviewProcedures || `All system-generated alerts undergo manual review to:
• Assess the validity of the alert
• Determine if additional investigation is required
• Escalate to appropriate personnel if suspicious
• Document review findings and decisions
• Clear false positives with proper justification`}

CURRENCY TRANSACTION REPORTING:
${input.currencyTransactionReporting || `All cash transactions exceeding KES 1,000,000 must be reported to the FRC within 7 days through the goAML system.`}

CTR REPORTING THRESHOLDS:
${input.ctrReportingThresholds || `• Single cash transactions of KES 1,000,000 or more
• Multiple related cash transactions totaling KES 1,000,000 or more in one day
• Cross-border transportation of currency exceeding USD 10,000 equivalent`}

CTR EXEMPTION CRITERIA:
${input.ctrExemptionCriteria || `Exemptions may apply to:
• Government entities conducting official business
• Licensed financial institutions in certain circumstances
• Established business customers with known transaction patterns
• Transactions between accounts of the same customer`}

WIRE TRANSFER REQUIREMENTS:
${input.wireTransferRequirements || `All wire transfers must include:
• Complete originator information
• Complete beneficiary information
• Purpose of transfer
• Source of funds documentation for large amounts
• Enhanced scrutiny for high-risk jurisdictions`}`;
  }

  private generateSuspiciousActivityReporting(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `SUSPICIOUS ACTIVITY REPORTING (SAR) PROCEDURES

${input.suspiciousActivityReporting}

SAR REPORTING THRESHOLDS:
${input.sarReportingThresholds || `Suspicious Activity Reports must be filed for:
• Any transaction or pattern of transactions involving KES 1,000,000 or more that appears suspicious
• Any transaction regardless of amount that involves suspected criminal activity
• Attempted transactions that are declined or not completed due to suspicious nature
• Activities that appear to serve no business or lawful purpose`}

SAR REPORTING TIMEFRAMES:
${input.sarReportingTimeframes || `• Initial SAR filing: Within 3 business days of detection
• Supporting documentation: Within 7 business days
• Follow-up reports: As additional information becomes available
• Urgent cases: Immediate verbal notification followed by written report`}

SAR REPORTING AUTHORITY:
${input.sarReportingAuthority || `All SARs must be filed with the Financial Reporting Centre (FRC) through the goAML electronic reporting system.`}

INTERNAL SAR PROCEDURES:
${input.sarInternalReportingProcedures || `Internal reporting process:
1. Staff member identifies potentially suspicious activity
2. Immediate notification to direct supervisor
3. Escalation to Compliance Officer within 24 hours
4. Compliance Officer investigation and decision
5. SAR preparation and filing if warranted
6. Documentation of investigation and decision rationale`}

SAR INVESTIGATION PROCEDURES:
${input.sarInvestigationProcedures || `Investigation procedures include:
• Review of customer account history and transaction patterns
• Analysis of all available customer information
• Consultation with account relationship managers
• Review of similar cases and precedents
• Documentation of all investigation steps and findings
• Decision on whether to file SAR or continue monitoring`}

SUSPICIOUS INDICATORS:
Red flags requiring consideration for SAR filing include:
• Structuring transactions to avoid reporting thresholds
• Use of multiple accounts to obscure transaction trails
• Transactions inconsistent with customer's known business
• Reluctance to provide required identification or information
• Unusual concern about reporting or record-keeping requirements
• Transactions involving high-risk jurisdictions or entities
• Complex transactions with no apparent economic purpose

SAR RECORD KEEPING:
${input.sarRecordKeeping || `Complete records must be maintained for:
• All SAR investigations and decisions
• Supporting documentation and evidence
• Communication with law enforcement
• Follow-up actions and monitoring
• Staff training on SAR procedures`}

CONFIDENTIALITY REQUIREMENTS:
• SAR filings are strictly confidential
• No disclosure to customers or unauthorized personnel
• Limited access to SAR information on need-to-know basis
• Specific procedures for law enforcement requests
• Protection of staff involved in SAR reporting

LAW ENFORCEMENT COOPERATION:
• Full cooperation with FRC and other authorized agencies
• Prompt response to information requests
• Maintenance of confidentiality during investigations
• Documentation of all law enforcement interactions
• Continued monitoring of accounts under investigation`;
  }

  private generateRecordKeeping(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `RECORD KEEPING REQUIREMENTS

${input.recordKeepingRequirements}

RETENTION PERIODS:
${input.recordRetentionPeriods || `The following retention periods apply:
• Customer identification records: 5 years after account closure
• Transaction records: 5 years after transaction date
• SAR records: 5 years after filing date
• CTR records: 5 years after filing date
• Training records: 5 years after training completion
• Audit and examination records: 7 years after examination date`}

STORAGE PROCEDURES:
${input.recordStorageProcedures || `Records must be stored in a manner that:
• Ensures confidentiality and security
• Prevents unauthorized access or modification
• Allows for prompt retrieval when required
• Protects against loss, damage, or destruction
• Maintains legibility throughout retention period
• Complies with data protection requirements`}

RECORD ACCESS PROCEDURES:
${input.recordAccessProcedures || `Access to AML records is restricted to:
• Authorized compliance personnel
• Senior management as required
• Internal and external auditors
• Regulatory authorities upon request
• Law enforcement with proper authorization
• Legal counsel as necessary for regulatory matters`}

REQUIRED DOCUMENTATION:
Customer Records:
• Customer identification and verification documents
• Beneficial ownership information
• Risk assessment and rating documentation
• Account opening and signature cards
• Powers of attorney and authorizations

Transaction Records:
• All transaction instructions and confirmations
• Wire transfer messages and supporting documentation
• Currency transaction reports and exemption records
• Suspicious activity reports and supporting materials
• Cash transaction logs and verification records

BACKUP PROCEDURES:
${input.recordBackupProcedures || `• Daily backup of electronic records to secure offsite location
• Quarterly verification of backup integrity and recoverability
• Annual testing of disaster recovery procedures
• Redundant storage systems to prevent data loss
• Secure transportation and storage of backup media`}

DESTRUCTION PROCEDURES:
${input.recordDestructionProcedures || `Records may only be destroyed:
• After expiration of required retention period
• With approval from Compliance Officer
• Using secure destruction methods that prevent recovery
• With documentation of destruction date and method
• In compliance with data protection regulations`}

ELECTRONIC RECORDS MANAGEMENT:
• Secure database systems with access controls
• Audit trails for all record access and modifications
• Regular system backups and disaster recovery planning
• Data integrity controls and validation procedures
• Migration procedures for system upgrades

DATA PROTECTION COMPLIANCE:
• Customer consent for data collection and processing
• Privacy notices explaining data use and retention
• Data subject access procedures
• Data protection impact assessments
• Cross-border data transfer safeguards
• Breach notification procedures`;
  }

  private generateTrainingRequirements(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `TRAINING REQUIREMENTS

${input.trainingPrograms}

TRAINING FREQUENCY:
${input.trainingFrequency || `• Initial training: All new employees within 30 days of hire
• Annual refresher training: All staff by end of calendar year
• Specialized training: Role-specific training for high-risk positions
• Update training: Within 30 days of significant regulatory changes
• Remedial training: As required for performance issues`}

TRAINING CONTENT:
${input.trainingContent || `Training programs must cover:
• AML/CFT laws and regulations in Kenya
• Institution's AML policies and procedures
• Customer identification and verification requirements
• Suspicious activity recognition and reporting
• Record keeping and documentation requirements
• Sanctions screening and compliance
• Customer risk assessment procedures
• Cultural and behavioral indicators of suspicious activity`}

TARGET AUDIENCE:
${input.trainingTargetAudience || `Training is mandatory for:
• All bank employees regardless of position
• Directors and senior management
• Third-party agents and representatives
• Outsourced service providers with customer contact
• Temporary and contract staff
• New employees during onboarding process`}

SPECIALIZED TRAINING:
High-risk positions require enhanced training including:
• Front-line staff: Customer identification and transaction monitoring
• Compliance staff: Advanced SAR investigation and filing procedures
• Senior management: AML program oversight and governance
• IT staff: System controls and data protection
• Audit staff: AML examination and testing procedures

TRAINING METHODS:
• Classroom instruction by qualified trainers
• Online learning modules and assessments
• Case study analysis and discussion
• Practical exercises and simulations
• External seminars and conferences
• Regulatory briefings and updates

EFFECTIVENESS ASSESSMENT:
${input.trainingEffectivenessAssessment || `Training effectiveness is measured through:
• Written examinations with minimum passing scores
• Practical competency assessments
• Ongoing performance monitoring
• Customer complaint analysis
• Regulatory examination feedback
• Annual training needs analysis`}

TRAINING RECORD KEEPING:
${input.trainingRecordKeeping || `Complete records must be maintained including:
• Training curriculum and materials used
• Attendance records for all sessions
• Assessment scores and competency evaluations
• Training certificates and completion dates
• Remedial training for poor performance
• Annual training summary reports`}

TRAINER QUALIFICATIONS:
• Certified AML professionals or equivalent experience
• Regular updates on regulatory changes and best practices
• Adult learning and training delivery skills
• Knowledge of institution's specific risks and procedures
• Ability to communicate effectively with diverse audiences

TRAINING EVALUATION:
• Annual review of training program effectiveness
• Feedback collection from trainees and supervisors
• Benchmarking against industry best practices
• Regulatory examination findings incorporation
• Continuous improvement based on assessment results`;
  }

  private generateComplianceOversight(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `COMPLIANCE OVERSIGHT AND GOVERNANCE

COMPLIANCE OFFICER RESPONSIBILITIES:
The ${input.complianceOfficerTitle || 'Chief Compliance Officer'} is responsible for:
• Overall AML program implementation and oversight
• Regulatory reporting and communication
• Staff training program management
• Independent testing and audit coordination
• Policy development and maintenance
• Investigation of suspicious activities
• Regulatory examination coordination

MANAGEMENT OVERSIGHT:
Senior management responsibilities include:
• Board reporting on AML program effectiveness
• Resource allocation for compliance functions
• Risk appetite setting and monitoring
• Performance evaluation of compliance staff
• Regulatory relationship management
• Strategic planning for compliance initiatives

BOARD OVERSIGHT:
The Board of Directors provides oversight through:
• Annual AML program review and approval
• Quarterly compliance reports and briefings
• Independent audit review and action plans
• Regulatory examination response oversight
• Compliance budget approval and monitoring
• Risk management framework governance

REPORTING OBLIGATIONS:
${input.reportingObligations}

REGULATORY REPORTING:
${input.regulatoryReportingRequirements || `Regular reports to regulatory authorities include:
• Quarterly AML program status reports to CBK
• Annual compliance certification to FRC
• Suspicious activity reports as required
• Currency transaction reports within deadlines
• Regulatory examination response letters
• Material change notifications`}

FRC REPORTING REQUIREMENTS:
${input.frcReportingRequirements || `Reports to the Financial Reporting Centre include:
• Suspicious transaction reports via goAML system
• Currency transaction reports for cash exceeding thresholds
• Cross-border currency movement reports
• Annual compliance officer designation letters
• AML program assessment reports`}

CBK REPORTING REQUIREMENTS:
${input.cbkReportingRequirements || `Reports to Central Bank of Kenya include:
• Quarterly prudential returns including AML metrics
• Annual AML program effectiveness assessments
• Material weakness notifications
• Significant compliance issues reporting
• Third-party service provider notifications`}

INTERNAL CONTROLS:
${input.internalControls || `Key internal controls include:
• Segregation of duties in compliance functions
• Independent review of all SAR filings
• Dual approval for policy changes
• Regular testing of monitoring systems
• Escalation procedures for compliance issues
• Performance metrics and monitoring`}

COMPLIANCE MONITORING:
${input.monitoringProcedures || `Ongoing monitoring includes:
• Monthly compliance dashboard reviews
• Quarterly risk assessment updates
• Semi-annual policy effectiveness reviews
• Annual program comprehensive assessment
• Continuous improvement initiatives
• Regulatory change impact assessments`}

REGULATORY LIAISON:
${input.regulatoryLiaison || `Maintaining effective relationships with:
• Central Bank of Kenya supervisory staff
• Financial Reporting Centre analysts
• Kenya Association of Bankers working groups
• International correspondent bank compliance teams
• Law enforcement agencies as appropriate`}`;
  }

  private generateRiskAssessment(input: AntiMoneyLaunderingComplianceUserInput): string {
    return `RISK ASSESSMENT PROCEDURES

${input.riskAssessmentProcedures}

INSTITUTIONAL RISK ASSESSMENT:
${input.institutionalRiskAssessment || `Comprehensive assessment of institutional ML/TF risks including:
• Customer base analysis and risk profiling
• Product and service risk evaluation
• Geographic and jurisdictional risk mapping
• Delivery channel risk assessment
• Third-party relationship risk evaluation
• Operational and control risk analysis`}

CUSTOMER RISK RATING:
${input.customerRiskRating || `Customer risk ratings are assigned based on:
• Customer type (individual, corporate, government)
• Business activities and industry sector
• Geographic location and operations
• Source of wealth and funds
• Transaction patterns and volumes
• Relationship duration and complexity
• Public exposure and media attention`}

Risk Rating Categories:
• LOW RISK: Standard KYC procedures and monitoring
• MEDIUM RISK: Enhanced documentation and periodic review
• HIGH RISK: Comprehensive due diligence and ongoing monitoring
• PROHIBITED: Customer types not accepted by the institution

PRODUCT RISK ASSESSMENT:
${input.productRiskAssessment || `Risk assessment for all products and services:
• Savings and current accounts: Low to medium risk
• Trade finance products: Medium to high risk
• Wire transfer services: Medium to high risk
• Cash management services: Medium risk
• Investment products: Medium to high risk
• Foreign exchange services: High risk`}

GEOGRAPHIC RISK ASSESSMENT:
${input.geographicRiskAssessment || `Geographic risk factors include:
• FATF high-risk jurisdictions
• Countries with inadequate AML/CFT regimes
• Jurisdictions with significant corruption levels
• Areas with heightened terrorist activity
• Tax haven jurisdictions
• Countries subject to international sanctions`}

RISK ASSESSMENT FREQUENCY:
${input.riskAssessmentFrequency || `• Institution-wide assessment: Annually
• Customer risk reviews: Based on risk rating
  - High risk: Every 6 months
  - Medium risk: Annually
  - Low risk: Every 2 years
• Product risk assessment: Annually or upon launch
• Geographic risk assessment: Semi-annually`}

RISK MITIGATION MEASURES:
${input.riskMitigationMeasures || `Risk mitigation strategies include:
• Enhanced due diligence for high-risk relationships
• Increased transaction monitoring sensitivity
• Senior management approval for high-risk customers
• Specialized training for staff handling high-risk accounts
• Independent compliance review of high-risk activities
• Regular risk reassessment and monitoring`}

DOCUMENTATION REQUIREMENTS:
Risk assessment documentation includes:
• Risk assessment methodology and criteria
• Individual customer risk ratings and justifications
• Risk factor analysis and scoring
• Risk mitigation measures implemented
• Regular review and update procedures
• Senior management approval and oversight

RISK COMMUNICATION:
• Regular risk reporting to senior management
• Board-level risk committee briefings
• Staff awareness of high-risk indicators
• Regulatory reporting of significant risks
• Cross-functional risk management coordination`;
  }

  private generateAuditProcedures(input: AntiMoneyLaunderingComplianceUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    
    return `AUDIT AND MONITORING PROCEDURES

INDEPENDENT TESTING REQUIREMENTS:
${input.independentTestingRequirements || `Independent testing of the AML program must be conducted:
• Annually by qualified internal audit staff
• Every 2-3 years by external auditors
• Following significant regulatory changes
• After material compliance incidents
• As directed by regulatory authorities`}

INTERNAL AUDIT PROCEDURES:
${input.internalAuditProcedures || `Internal audit scope includes:
• AML policy compliance testing
• Customer due diligence procedures validation
• Transaction monitoring system effectiveness
• Suspicious activity reporting accuracy
• Record keeping compliance verification
• Training program effectiveness assessment
• Management oversight and governance review`}

AUDIT SCOPE AND METHODOLOGY:
Audit procedures must evaluate:
• Design adequacy of AML controls
• Operating effectiveness of procedures
• Compliance with regulatory requirements
• Staff competency and training levels
• System functionality and reliability
• Data integrity and record accuracy

CONTROL DEFICIENCY REPORTING:
${input.controlDeficiencyReporting || `All audit findings must be:
• Documented with clear risk assessment
• Reported to senior management within 30 days
• Escalated to Board for significant deficiencies
• Tracked for timely remediation
• Verified through follow-up testing
• Reported to regulators if material`}

CORRECTIVE ACTION PROCEDURES:
${input.correctiveActionProcedures || `Corrective actions must include:
• Specific remediation plans with timelines
• Responsible party assignments
• Resource allocation for implementation
• Progress monitoring and reporting
• Effectiveness validation through testing
• Documentation of completion and results`}

BUSINESS CONTINUITY PLANNING:
${input.businessContinuityPlanning || `AML continuity procedures include:
• Alternative reporting mechanisms during system outages
• Backup compliance officer designation
• Emergency contact procedures with regulators
• Critical function prioritization during disruptions
• Recovery time objectives for AML systems
• Regular testing of continuity plans`}

TECHNOLOGY AND SYSTEMS OVERSIGHT:
${input.technologySystems || `Technology governance includes:
• AML system configuration management
• Data integrity and validation controls
• User access administration and monitoring
• System backup and disaster recovery testing
• Cybersecurity measures for AML data
• System performance monitoring and optimization`}

REGULATORY EXAMINATION PREPARATION:
${input.examinationPreparation || `Examination readiness includes:
• Comprehensive document organization
• Self-assessment against regulatory standards
• Staff interview preparation and training
• System demonstration capabilities
• Issue remediation documentation
• Regulatory relationship management`}

PERFORMANCE METRICS AND MONITORING:
Key performance indicators include:
• SAR filing timeliness and quality
• Customer risk assessment accuracy
• Training completion rates and scores
• System alert resolution times
• Regulatory examination ratings
• Control testing results

CONTINUOUS IMPROVEMENT:
• Regular benchmarking against industry best practices
• Incorporation of regulatory guidance updates
• Staff feedback and suggestion programs
• Technology enhancement initiatives
• Process optimization and automation
• Risk management framework updates

GOVERNING LAW AND COMPLIANCE:
This AML program is governed by the laws of ${governingLaw} and must comply with:
• Proceeds of Crime and Anti-Money Laundering Act, 2009
• Central Bank of Kenya regulations and guidelines
• Financial Reporting Centre requirements
• International standards and best practices
• Correspondent banking compliance requirements

EFFECTIVE DATE AND IMPLEMENTATION:
This comprehensive AML compliance framework becomes effective on ${input.effectiveDate} and is subject to regular review and updates to maintain effectiveness and regulatory compliance.`;
  }
}