import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { DataProtectionComplianceUserInput, GeneratedDataProtectionComplianceContent } from '../../types/documents/compliance/data-protection-compliance';

export class DataProtectionComplianceGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'DATA PROTECTION COMPLIANCE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as DataProtectionComplianceUserInput;
    const controllerName = (input.controllerName || 'Controller').replace(/[^a-zA-Z0-9]/g, '_');
    const processorName = (input.processorName || 'Processor').replace(/[^a-zA-Z0-9]/g, '_');
    return `Data_Protection_Compliance_Agreement_${controllerName}_${processorName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as DataProtectionComplianceUserInput;
    const partyInfo: string[] = [];

    // Data Controller Information
    partyInfo.push('Data Controller Information:');
    partyInfo.push(`Name: ${input.controllerName || 'Controller Name'}`);
    partyInfo.push(`Address: ${input.controllerAddress || 'Address not provided'}`);
    if (input.controllerEmail) {
      partyInfo.push(`Email: ${input.controllerEmail}`);
    }
    if (input.controllerPhone) {
      partyInfo.push(`Phone: ${input.controllerPhone}`);
    }
    if (input.controllerBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.controllerBusinessRegistration}`);
    }
    if (input.controllerContactPerson) {
      partyInfo.push(`Contact Person: ${input.controllerContactPerson}`);
      if (input.controllerContactTitle) {
        partyInfo.push(`Contact Title: ${input.controllerContactTitle}`);
      }
      if (input.controllerContactEmail) {
        partyInfo.push(`Contact Email: ${input.controllerContactEmail}`);
      }
    }
    partyInfo.push('');

    // Data Processor Information (if applicable)
    if (input.processorName) {
      partyInfo.push('Data Processor Information:');
      partyInfo.push(`Name: ${input.processorName}`);
      partyInfo.push(`Address: ${input.processorAddress || 'Address not provided'}`);
      if (input.processorEmail) {
        partyInfo.push(`Email: ${input.processorEmail}`);
      }
      if (input.processorPhone) {
        partyInfo.push(`Phone: ${input.processorPhone}`);
      }
      if (input.processorBusinessRegistration) {
        partyInfo.push(`Business Registration: ${input.processorBusinessRegistration}`);
      }
      if (input.processorContactPerson) {
        partyInfo.push(`Contact Person: ${input.processorContactPerson}`);
        if (input.processorContactTitle) {
          partyInfo.push(`Contact Title: ${input.processorContactTitle}`);
        }
        if (input.processorContactEmail) {
          partyInfo.push(`Contact Email: ${input.processorContactEmail}`);
        }
      }
      partyInfo.push('');
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedDataProtectionComplianceContent): DocumentSection[] {
    const input = userInput as unknown as DataProtectionComplianceUserInput;

    return [
      {
        title: 'PARTIES AND CONTEXT',
        content: generatedContent.partiesAndContext || this.generatePartiesAndContext(input)
      },
      {
        title: 'PROCESSING PURPOSE AND LEGAL BASIS',
        content: generatedContent.processingPurposeAndLegalBasis || this.generateProcessingPurposeAndLegalBasis(input)
      },
      {
        title: 'DATA SUBJECT RIGHTS AND PROCEDURES',
        content: generatedContent.dataSubjectRightsAndProcedures || this.generateDataSubjectRightsAndProcedures(input)
      },
      {
        title: 'SECURITY MEASURES AND SAFEGUARDS',
        content: generatedContent.securityMeasuresAndSafeguards || this.generateSecurityMeasuresAndSafeguards(input)
      },
      {
        title: 'BREACH NOTIFICATION AND RESPONSE',
        content: generatedContent.breachNotificationAndResponse || this.generateBreachNotificationAndResponse(input)
      },
      {
        title: 'RETENTION AND DELETION',
        content: generatedContent.retentionAndDeletion || this.generateRetentionAndDeletion(input)
      },
      {
        title: 'COMPLIANCE AND MONITORING',
        content: generatedContent.complianceAndMonitoring || this.generateComplianceAndMonitoring(input)
      },
      {
        title: 'GENERAL PROVISIONS AND SIGNATURES',
        content: generatedContent.generalProvisionsAndSignatures || this.generateGeneralProvisionsAndSignatures(input)
      }
    ];
  }

  private generatePartiesAndContext(input: DataProtectionComplianceUserInput): string {
    const controllerName = input.controllerName || 'Controller Name';
    const processorName = input.processorName || 'Processor Name';
    
    return `This Data Protection Compliance Agreement ("Agreement") is entered into on ${input.effectiveDate} between the parties identified below to ensure compliance with the Data Protection Act, 2019 of the Republic of Kenya and other applicable data protection laws.

DATA CONTROLLER:
Name: ${controllerName}
Address: ${input.controllerAddress || 'Controller address'}
Business Registration: ${input.controllerBusinessRegistration || 'To be inserted'}
Contact Person: ${input.controllerContactPerson || 'To be inserted'}
Email: ${input.controllerEmail || 'To be inserted'}
Phone: ${input.controllerPhone || 'To be inserted'}

${input.processorName ? `DATA PROCESSOR:
Name: ${processorName}
Address: ${input.processorAddress || 'Processor address'}
Business Registration: ${input.processorBusinessRegistration || 'To be inserted'}
Contact Person: ${input.processorContactPerson || 'To be inserted'}
Email: ${input.processorEmail || 'To be inserted'}
Phone: ${input.processorPhone || 'To be inserted'}

RELATIONSHIP DEFINITION:
The Controller determines the purposes and means of processing personal data, while the Processor processes personal data on behalf of the Controller in accordance with the Controller's documented instructions.` : ''}

PROCESSING CONTEXT:
This Agreement governs the processing of personal data as described herein and ensures compliance with the Data Protection Act, 2019, which is administered by the Office of the Data Protection Commissioner (ODPC) of Kenya.

SCOPE OF AGREEMENT:
This Agreement covers all personal data processing activities conducted by the parties in connection with their business relationship and sets forth the obligations, responsibilities, and procedures for lawful data processing.

DEFINITIONS:
For the purposes of this Agreement, the terms "personal data," "data subject," "processing," "controller," "processor," and other data protection terms shall have the meanings ascribed to them under the Data Protection Act, 2019.`;
  }

  private generateProcessingPurposeAndLegalBasis(input: DataProtectionComplianceUserInput): string {
    const legalBasisMap = {
      'consent': 'Consent of the data subject',
      'contract': 'Performance of a contract or pre-contractual measures',
      'legal_obligation': 'Compliance with a legal obligation',
      'vital_interests': 'Protection of vital interests',
      'public_task': 'Performance of a task in the public interest',
      'legitimate_interests': 'Legitimate interests pursued by the controller'
    };

    return `PROCESSING PURPOSE:
${input.processingPurpose}

${input.processingDescription ? `DETAILED PROCESSING DESCRIPTION:
${input.processingDescription}` : ''}

DATA CATEGORIES:
${input.dataCategories}

DATA SUBJECT CATEGORIES:
${input.dataSubjectCategories}

${input.personalDataTypes ? `TYPES OF PERSONAL DATA:
${input.personalDataTypes}` : ''}

${input.specialCategoryData ? `SPECIAL CATEGORY DATA:
${input.specialCategoryData}

ADDITIONAL SAFEGUARDS FOR SPECIAL CATEGORY DATA:
Special category data shall be processed only where explicitly permitted under Article 23 of the Data Protection Act, 2019, and with appropriate additional safeguards to protect the fundamental rights and freedoms of data subjects.` : ''}

LEGAL BASIS FOR PROCESSING:
Primary Legal Basis: ${legalBasisMap[input.legalBasisController] || input.legalBasisController}

${input.legalBasisDescription ? `Legal Basis Description:
${input.legalBasisDescription}` : ''}

${input.consentRequirements ? `CONSENT REQUIREMENTS:
${input.consentRequirements}

Consent shall be freely given, specific, informed, and unambiguous. Data subjects shall have the right to withdraw consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.` : ''}

${input.legitimateInterestsAssessment ? `LEGITIMATE INTERESTS ASSESSMENT:
${input.legitimateInterestsAssessment}

The parties have conducted a legitimate interests assessment balancing the interests of the controller against the rights and freedoms of data subjects, ensuring that processing does not override the fundamental rights of data subjects.` : ''}

${input.legalObligationSource ? `LEGAL OBLIGATION SOURCE:
${input.legalObligationSource}` : ''}

DATA SOURCES:
${input.dataSources || 'Data is collected directly from data subjects and from legitimate third-party sources in accordance with applicable law.'}

PROCESSING ACTIVITIES:
${input.processingActivities || 'Collection, recording, organization, structuring, storage, adaptation, retrieval, consultation, use, disclosure, dissemination, alignment, restriction, erasure, and destruction of personal data.'}

COMPLIANCE WITH KENYAN LAW:
All processing activities shall comply with the Data Protection Act, 2019, the Constitution of Kenya, and any regulations or guidelines issued by the Office of the Data Protection Commissioner.`;
  }

  private generateDataSubjectRightsAndProcedures(input: DataProtectionComplianceUserInput): string {
    return `DATA SUBJECT RIGHTS:
${input.dataSubjectRights}

Under the Data Protection Act, 2019, data subjects have the following rights:
• Right of access to their personal data
• Right to rectification of inaccurate personal data
• Right to erasure ("right to be forgotten")
• Right to restriction of processing
• Right to data portability
• Right to object to processing
• Rights related to automated decision-making and profiling

${input.accessRequestProcedure ? `ACCESS REQUEST PROCEDURE:
${input.accessRequestProcedure}` : `ACCESS REQUEST PROCEDURE:
Data subjects may request access to their personal data by submitting a written request to the Controller. The Controller shall respond within one month of receipt, providing a copy of the personal data and information about the processing.`}

${input.rectificationProcedure ? `RECTIFICATION PROCEDURE:
${input.rectificationProcedure}` : `RECTIFICATION PROCEDURE:
Data subjects may request rectification of inaccurate personal data. The Controller shall rectify inaccurate data without undue delay and inform all recipients of the data about the rectification.`}

${input.erasureProcedure ? `ERASURE PROCEDURE:
${input.erasureProcedure}` : `ERASURE PROCEDURE:
Data subjects may request erasure of their personal data where processing is no longer necessary, consent is withdrawn, processing is unlawful, or erasure is required for compliance with legal obligations.`}

${input.portabilityProcedure ? `DATA PORTABILITY PROCEDURE:
${input.portabilityProcedure}` : `DATA PORTABILITY PROCEDURE:
Where processing is based on consent or contract and carried out by automated means, data subjects have the right to receive their data in a structured, commonly used, and machine-readable format.`}

${input.objectionProcedure ? `OBJECTION PROCEDURE:
${input.objectionProcedure}` : `OBJECTION PROCEDURE:
Data subjects may object to processing based on legitimate interests or for direct marketing purposes. The Controller shall cease processing unless compelling legitimate grounds override the data subject's interests.`}

${input.restrictionProcedure ? `RESTRICTION PROCEDURE:
${input.restrictionProcedure}` : `RESTRICTION PROCEDURE:
Data subjects may request restriction of processing where accuracy is contested, processing is unlawful, data is no longer needed but required for legal claims, or objection is pending.`}

${input.automatedDecisionMaking ? `AUTOMATED DECISION-MAKING:
${input.automatedDecisionMaking}` : ''}

RESPONSE TIMEFRAME:
${input.responseTimeframe || 'The Controller shall respond to data subject requests within one month of receipt. This period may be extended by two months for complex requests, with notification to the data subject.'}

VERIFICATION PROCEDURES:
The Controller shall verify the identity of data subjects making requests and may request additional information necessary to confirm identity before processing requests.

FREE OF CHARGE:
Data subject requests shall be processed free of charge unless requests are manifestly unfounded or excessive, in which case a reasonable fee may be charged.

FACILITATION OF RIGHTS:
The parties shall take appropriate measures to facilitate the exercise of data subject rights and shall not prevent or discourage data subjects from making requests.`;
  }

  private generateSecurityMeasuresAndSafeguards(input: DataProtectionComplianceUserInput): string {
    return `SECURITY MEASURES:
${input.securityMeasures}

TECHNICAL SAFEGUARDS:
${input.technicalSafeguards || `The parties shall implement appropriate technical measures including:
• Encryption of personal data in transit and at rest
• Regular security testing and vulnerability assessments
• Secure authentication and access control mechanisms
• Network security measures including firewalls and intrusion detection
• Secure backup and recovery procedures
• Regular software updates and security patches`}

ORGANIZATIONAL MEASURES:
${input.organizationalMeasures || `The parties shall implement appropriate organizational measures including:
• Data protection policies and procedures
• Staff training on data protection requirements
• Clear roles and responsibilities for data protection
• Regular review and updating of security measures
• Incident response and breach notification procedures
• Vendor management and due diligence procedures`}

ACCESS CONTROLS:
${input.accessControls || `Access to personal data shall be restricted to authorized personnel who require access for legitimate business purposes. Access controls shall include:
• Role-based access controls
• Regular review of access rights
• Immediate revocation of access upon termination
• Logging and monitoring of data access
• Multi-factor authentication for sensitive data access`}

${input.encryptionMeasures ? `ENCRYPTION MEASURES:
${input.encryptionMeasures}` : `ENCRYPTION MEASURES:
Personal data shall be encrypted using industry-standard encryption methods both in transit and at rest. Encryption keys shall be managed securely and separately from encrypted data.`}

${input.backupProcedures ? `BACKUP PROCEDURES:
${input.backupProcedures}` : `BACKUP PROCEDURES:
Regular backups of personal data shall be maintained with appropriate security measures. Backup data shall be subject to the same protection requirements as live data.`}

${input.incidentResponsePlan ? `INCIDENT RESPONSE PLAN:
${input.incidentResponsePlan}` : `INCIDENT RESPONSE PLAN:
The parties shall maintain an incident response plan to address potential security incidents, including procedures for containment, assessment, notification, and remediation.`}

STAFF TRAINING:
${input.staffTraining || `All personnel with access to personal data shall receive regular training on data protection requirements, security procedures, and their obligations under this Agreement and applicable law.`}

SECURITY ASSESSMENTS:
Regular security assessments and audits shall be conducted to ensure the ongoing effectiveness of security measures. Any identified vulnerabilities shall be promptly addressed.

PHYSICAL SECURITY:
Appropriate physical security measures shall be implemented to protect systems, equipment, and facilities where personal data is processed or stored.

COMPLIANCE WITH STANDARDS:
Security measures shall comply with relevant international standards such as ISO 27001 and any specific requirements under Kenyan law or regulations.`;
  }

  private generateBreachNotificationAndResponse(input: DataProtectionComplianceUserInput): string {
    return `BREACH NOTIFICATION PROCEDURE:
${input.breachNotificationProcedure}

NOTIFICATION TIMEFRAMES:
${input.breachNotificationTimeframe || `Personal data breaches shall be reported as follows:
• To the Office of the Data Protection Commissioner: Within 72 hours of becoming aware of the breach
• To affected data subjects: Without undue delay where the breach is likely to result in a high risk to their rights and freedoms`}

SUPERVISORY AUTHORITY CONTACT:
${input.supervisoryAuthorityContact || `Office of the Data Protection Commissioner (ODPC)
Kenya Information and Communications Technology Authority (ICTA) Building
Waiyaki Way, Westlands
P.O. Box 42721-00100
Nairobi, Kenya
Email: info@odpc.go.ke
Phone: +254-20-4986000`}

BREACH ASSESSMENT PROCEDURE:
${input.breachAssessmentProcedure || `Upon discovering a potential breach, the parties shall:
1. Immediately contain the breach and assess its scope
2. Determine the categories and approximate number of affected data subjects
3. Assess the likely consequences and risks to data subjects
4. Evaluate the effectiveness of implemented safeguards
5. Determine notification requirements based on risk assessment
6. Document all findings and actions taken`}

DATA SUBJECT NOTIFICATION CRITERIA:
${input.dataSubjectNotificationCriteria || `Data subjects shall be notified of a breach where it is likely to result in a high risk to their rights and freedoms, considering factors such as:
• Nature of the personal data affected
• Sensitivity of the data
• Likelihood and severity of impact
• Existence of appropriate safeguards`}

BREACH DOCUMENTATION REQUIREMENTS:
${input.breachDocumentationRequirements || `All personal data breaches shall be documented, including:
• Facts relating to the breach
• Effects and consequences of the breach
• Remedial action taken or proposed
• Timeline of events and response actions
• Communications with authorities and data subjects
• Lessons learned and preventive measures implemented`}

NOTIFICATION CONTENT:
Breach notifications shall include:
• Description of the nature of the breach
• Categories and approximate number of affected data subjects
• Categories and approximate number of affected personal data records
• Contact details for obtaining more information
• Description of likely consequences
• Measures taken or proposed to address the breach
• Measures taken or proposed to mitigate adverse effects

COORDINATION BETWEEN PARTIES:
Where both Controller and Processor are involved, they shall coordinate their breach response efforts and ensure consistent communication with authorities and data subjects.

BREACH REGISTER:
A register of all personal data breaches shall be maintained, including those not reported to the supervisory authority, for review by the ODPC upon request.

CONTINUOUS IMPROVEMENT:
Breach response procedures shall be regularly reviewed and updated based on lessons learned from incidents and changes in legal requirements.`;
  }

  private generateRetentionAndDeletion(input: DataProtectionComplianceUserInput): string {
    return `RETENTION PERIOD:
${input.retentionPeriod}

RETENTION CRITERIA:
${input.retentionCriteria || `Personal data shall be retained only for as long as necessary to fulfill the purposes for which it was collected, considering:
• Legal and regulatory requirements
• Contractual obligations
• Legitimate business needs
• Data subject consent (where applicable)
• Statutory limitation periods`}

DELETION PROCEDURES:
${input.deletionProcedures || `Personal data shall be securely deleted or anonymized when:
• The retention period expires
• The purpose for processing no longer exists
• Data subject consent is withdrawn (where applicable)
• Processing is found to be unlawful
• Required by legal obligation or court order`}

${input.archivalRequirements ? `ARCHIVAL REQUIREMENTS:
${input.archivalRequirements}` : `ARCHIVAL REQUIREMENTS:
Where personal data must be retained for archival purposes in the public interest, scientific or historical research, or statistical purposes, appropriate safeguards shall be implemented to protect data subject rights.`}

RETENTION SCHEDULE:
${input.retentionSchedule || `A detailed retention schedule shall be maintained specifying:
• Categories of personal data
• Applicable retention periods
• Criteria for determining retention periods
• Deletion or anonymization procedures
• Responsible persons for retention decisions
• Review and update procedures`}

DISPOSAL METHODS:
${input.disposalMethods || `Personal data shall be disposed of using secure methods including:
• Secure deletion of electronic data using certified deletion software
• Physical destruction of storage media containing personal data
• Degaussing or overwriting of magnetic storage devices
• Shredding or incineration of paper records
• Certificate of destruction where required`}

ANONYMIZATION PROCEDURES:
Where personal data is anonymized rather than deleted, the anonymization process shall ensure that:
• Data cannot be attributed to a specific data subject
• Data subjects cannot be identified through reasonably available means
• Risk of re-identification is minimized through appropriate techniques
• Anonymized data is clearly marked and separated from personal data

RETENTION REVIEWS:
Regular reviews of retained personal data shall be conducted to:
• Verify continued necessity for retention
• Ensure compliance with retention periods
• Identify data eligible for deletion or anonymization
• Update retention schedules as needed

BUSINESS CONTINUITY:
Retention and deletion procedures shall consider business continuity requirements while ensuring compliance with data protection obligations.

DOCUMENTATION:
All retention and deletion activities shall be properly documented, including:
• Decisions to retain or delete personal data
• Methods used for deletion or anonymization
• Dates of deletion or anonymization
• Persons responsible for the activity
• Any exceptions or special circumstances`;
  }

  private generateComplianceAndMonitoring(input: DataProtectionComplianceUserInput): string {
    return `COMPLIANCE MONITORING:
${input.complianceMonitoring}

AUDIT PROCEDURES:
${input.auditProcedures || `Regular audits shall be conducted to assess compliance with this Agreement and applicable data protection laws:
• Annual comprehensive compliance audits
• Quarterly risk assessments
• Ad hoc audits following incidents or complaints
• Third-party security assessments where appropriate
• Documentation review and testing of procedures`}

RECORD KEEPING REQUIREMENTS:
${input.recordKeepingRequirements || `The parties shall maintain records of processing activities including:
• Purposes of processing
• Categories of data subjects and personal data
• Categories of recipients
• Transfers to third countries
• Time limits for erasure
• Security measures implemented
• Data protection impact assessments`}

IMPACT ASSESSMENT REQUIREMENTS:
${input.impactAssessmentRequirements || `Data Protection Impact Assessments (DPIA) shall be conducted for:
• High-risk processing operations
• Systematic monitoring of public areas
• Processing of special category data on a large scale
• Automated decision-making with legal effects
• New technologies or processing methods
• Processing likely to result in high risk to data subjects`}

CONSULTATION REQUIREMENTS:
${input.consultationRequirements || `The Controller shall consult with the Office of the Data Protection Commissioner before processing where:
• A DPIA indicates high risk that cannot be mitigated
• Processing involves new technologies
• Processing is for purposes not previously contemplated
• As required by applicable law or regulations`}

${input.complianceOfficerDetails ? `COMPLIANCE OFFICER:
${input.complianceOfficerDetails}` : `DATA PROTECTION OFFICER:
Where required by law, a Data Protection Officer (DPO) shall be appointed with responsibility for:
• Monitoring compliance with data protection laws
• Conducting privacy impact assessments
• Providing data protection training and awareness
• Serving as contact point for supervisory authorities
• Advising on data protection matters`}

TRAINING AND AWARENESS:
Ongoing training programs shall ensure that personnel understand:
• Data protection principles and requirements
• Individual roles and responsibilities
• Procedures for handling personal data
• Incident reporting and response procedures
• Updates to laws and regulations

COMPLIANCE REPORTING:
Regular compliance reports shall be prepared covering:
• Processing activities and purposes
• Security incidents and breaches
• Data subject requests and responses
• Audit findings and remediation actions
• Changes to processing operations
• Regulatory developments and their impact

CONTINUOUS IMPROVEMENT:
Compliance procedures shall be regularly reviewed and updated to:
• Address identified deficiencies
• Incorporate regulatory changes
• Reflect best practices
• Respond to emerging risks
• Enhance effectiveness

GOVERNANCE STRUCTURE:
A clear governance structure shall be established with:
• Defined roles and responsibilities
• Escalation procedures for compliance issues
• Regular review meetings and reporting
• Approval processes for new processing activities
• Change management procedures

COMPLIANCE METRICS:
Key performance indicators shall be established to measure:
• Timeliness of breach notifications
• Response times for data subject requests
• Completion rates for compliance training
• Results of security assessments
• Effectiveness of implemented controls`;
  }

  private generateGeneralProvisionsAndSignatures(input: DataProtectionComplianceUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const disputeResolution = input.disputeResolution || 'Any disputes arising under this Agreement shall be resolved through good faith negotiation, mediation, and if necessary, binding arbitration in accordance with the Arbitration Act of Kenya.';
    
    return `${input.internationalTransfers ? `INTERNATIONAL TRANSFERS:
${input.internationalTransfers}

TRANSFER SAFEGUARDS:
${input.transferSafeguards || 'International transfers of personal data shall only occur with appropriate safeguards including adequacy decisions, standard contractual clauses, binding corporate rules, or other legally recognized transfer mechanisms.'}

${input.adequacyDecisionCountries ? `ADEQUACY DECISION COUNTRIES:
${input.adequacyDecisionCountries}` : ''}

${input.standardContractualClauses ? `STANDARD CONTRACTUAL CLAUSES:
${input.standardContractualClauses}` : ''}

${input.transferRiskAssessment ? `TRANSFER RISK ASSESSMENT:
${input.transferRiskAssessment}` : ''}` : ''}

${input.processorObligations ? `PROCESSOR OBLIGATIONS:
${input.processorObligations}

${input.subProcessorArrangements ? `SUB-PROCESSOR ARRANGEMENTS:
${input.subProcessorArrangements}` : ''}

${input.processorSecurityMeasures ? `PROCESSOR SECURITY MEASURES:
${input.processorSecurityMeasures}` : ''}

${input.processorAuditRights ? `PROCESSOR AUDIT RIGHTS:
${input.processorAuditRights}` : ''}

${input.processorTerminationObligations ? `PROCESSOR TERMINATION OBLIGATIONS:
${input.processorTerminationObligations}` : ''}` : ''}

AMENDMENT PROCEDURES:
${input.amendmentProcedures || 'This Agreement may only be amended in writing with the mutual consent of all parties. Amendments shall be documented and signed by authorized representatives.'}

TERMINATION CONDITIONS:
${input.terminationConditions || 'This Agreement may be terminated by either party with 30 days written notice. Termination shall not affect obligations that by their nature should survive termination.'}

${input.terminationNotice ? `TERMINATION NOTICE:
${input.terminationNotice}` : ''}

POST-TERMINATION OBLIGATIONS:
${input.postTerminationObligations || 'Upon termination, the parties shall return or securely delete all personal data processed under this Agreement, except where retention is required by law.'}

GOVERNING LAW AND JURISDICTION:
This Agreement shall be governed by and construed in accordance with the laws of ${governingLaw}. The parties submit to the exclusive jurisdiction of the courts of Kenya for any disputes arising under this Agreement.

DISPUTE RESOLUTION:
${disputeResolution}

SUPERVISORY AUTHORITY:
${input.supervisoryAuthority || 'The Office of the Data Protection Commissioner of Kenya is the lead supervisory authority for matters arising under this Agreement.'}

SEVERABILITY:
If any provision of this Agreement is held invalid or unenforceable, the remainder shall continue in full force and effect.

ENTIRE AGREEMENT:
This Agreement constitutes the entire agreement between the parties regarding data protection compliance and supersedes all prior negotiations, representations, and agreements.

NOTICES:
All notices under this Agreement shall be in writing and delivered to the addresses specified above or such other addresses as may be designated in writing.

FORCE MAJEURE:
Neither party shall be liable for any failure to perform due to causes beyond their reasonable control, provided that such party takes all reasonable steps to mitigate the impact.

SURVIVAL:
The provisions relating to confidentiality, data protection, indemnification, and governing law shall survive termination of this Agreement.

COUNTERPARTS:
This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one instrument.

EFFECTIVENESS:
This Agreement shall become effective on ${input.effectiveDate} and shall remain in force until terminated in accordance with its terms.

SIGNATURES:

DATA CONTROLLER:

_______________________
${input.controllerName || 'Controller Name'}
By: ___________________
Name: _________________
Title: ________________
Date: _________________

${input.processorName ? `DATA PROCESSOR:

_______________________
${input.processorName}
By: ___________________
Name: _________________
Title: ________________
Date: _________________` : ''}

${input.witnessRequirements || input.signatureRequirements ? `WITNESSES:

Witness 1:
_______________________
Name: _________________
Address: _______________
Date: _________________

Witness 2:
_______________________
Name: _________________
Address: _______________
Date: _________________` : ''}

${input.notarizationRequirements ? `NOTARIZATION:

SWORN before me this _____ day of __________, 20_____.

_______________________
Commissioner for Oaths/Notary Public
My commission expires: _______________` : ''}

ACKNOWLEDGMENT:
The parties acknowledge that they have read, understood, and agree to be bound by the terms of this Data Protection Compliance Agreement and that they have received independent legal advice or waived the right to such advice.`;
  }
}