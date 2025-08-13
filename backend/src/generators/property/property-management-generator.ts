import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { PropertyManagementUserInput, GeneratedPropertyManagementContent } from '../../types/documents/property/property-management';

export class PropertyManagementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'PROPERTY MANAGEMENT AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as PropertyManagementUserInput;
    const ownerName = (input.ownerName || 'PropertyOwner').replace(/[^a-zA-Z0-9]/g, '_');
    const managerName = (input.managerName || 'PropertyManager').replace(/[^a-zA-Z0-9]/g, '_');
    return `Property_Management_Agreement_${ownerName}_${managerName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as PropertyManagementUserInput;
    const partyInfo: string[] = [];

    // Property Owner Information
    partyInfo.push('Property Owner Information:');
    partyInfo.push(`Name: ${input.ownerName || 'Property Owner'}`);
    partyInfo.push(`Address: ${input.ownerAddress || 'Property Owner Address'}`);
    partyInfo.push(`Email: ${input.ownerEmail || 'Property Owner Email'}`);
    if (input.ownerPhone) {
      partyInfo.push(`Phone: ${input.ownerPhone}`);
    }
    if (input.ownerIdNumber) {
      partyInfo.push(`ID Number: ${input.ownerIdNumber}`);
    }
    partyInfo.push('');

    // Property Manager Information
    partyInfo.push('Property Manager Information:');
    partyInfo.push(`Name: ${input.managerName || 'Property Manager'}`);
    partyInfo.push(`Address: ${input.managerAddress || 'Property Manager Address'}`);
    partyInfo.push(`Email: ${input.managerEmail || 'Property Manager Email'}`);
    if (input.managerPhone) {
      partyInfo.push(`Phone: ${input.managerPhone}`);
    }
    partyInfo.push(`Business Registration: ${input.managerBusinessRegistration || 'Business Registration Number'}`);
    if (input.managerLicenseNumber) {
      partyInfo.push(`License Number: ${input.managerLicenseNumber}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedPropertyManagementContent): DocumentSection[] {
    const input = userInput as unknown as PropertyManagementUserInput;
    
    return [
      {
        title: 'APPOINTMENT AND AUTHORITY',
        content: generatedContent.appointmentAndAuthority || this.generateAppointmentAndAuthority(input)
      },
      {
        title: 'SERVICES AND DUTIES',
        content: generatedContent.servicesAndDuties || this.generateServicesAndDuties(input)
      },
      {
        title: 'FEES AND EXPENSES',
        content: generatedContent.feesAndExpenses || this.generateFeesAndExpenses(input)
      },
      {
        title: 'ACCOUNTING AND REPORTING',
        content: generatedContent.accountingAndReporting || this.generateAccountingAndReporting(input)
      },
      {
        title: 'INSURANCE REQUIREMENTS',
        content: generatedContent.insuranceRequirements || this.generateInsuranceRequirements(input)
      },
      {
        title: 'PERFORMANCE STANDARDS',
        content: generatedContent.performanceStandards || this.generatePerformanceStandards(input)
      },
      {
        title: 'LIMITATIONS AND RESTRICTIONS',
        content: generatedContent.limitationsAndRestrictions || this.generateLimitationsAndRestrictions(input)
      },
      {
        title: 'TERMINATION PROVISIONS',
        content: generatedContent.terminationProvisions || this.generateTerminationProvisions(input)
      },
      {
        title: 'INDEMNIFICATION',
        content: generatedContent.indemnification || this.generateIndemnification(input)
      },
      {
        title: 'DISPUTE RESOLUTION',
        content: generatedContent.disputeResolution || this.generateDisputeResolution(input)
      },
      {
        title: 'GENERAL PROVISIONS',
        content: generatedContent.generalProvisions || this.generateGeneralProvisions(input)
      },
      {
        title: 'SIGNATURES',
        content: generatedContent.signatures || this.generateSignatures(input)
      }
    ];
  }

  private generateAppointmentAndAuthority(input: PropertyManagementUserInput): string {
    const propertyList = input.properties.map(p => `${p.propertyAddress} (${p.propertyType})`).join(', ');
    return `This Property Management Agreement ("Agreement") is entered into between ${input.ownerName}, property owner located at ${input.ownerAddress} ("Owner"), and ${input.managerName}, a property management company located at ${input.managerAddress} ("Manager"). 

The Owner hereby appoints the Manager as the exclusive agent for the management of the following properties: ${propertyList}.

Manager Authority: ${input.managerAuthority}

The Manager shall have the authority to act on behalf of the Owner in all matters relating to the management of the properties, subject to the limitations and restrictions set forth in this Agreement.`;
  }

  private generateServicesAndDuties(input: PropertyManagementUserInput): string {
    const services = [];
    if (input.tenantScreeningServices) services.push('Tenant screening and selection');
    if (input.rentCollectionServices) services.push('Rent collection and payment processing');
    if (input.maintenanceManagement) services.push('Maintenance coordination and supervision');
    if (input.propertyInspections) services.push('Regular property inspections');
    if (input.legalComplianceManagement) services.push('Legal compliance management');
    if (input.financialReporting) services.push('Financial reporting and accounting');
    if (input.tenancyManagement) services.push('Tenancy agreement management');

    return `Scope of Services: ${input.servicesScope}

The Manager shall provide the following services:
${services.map(s => `• ${s}`).join('\n')}

Tenant Relations: ${input.tenantCommunicationResponsibilities}

Lease Negotiation Authority: ${input.leaseNegotiationAuthority}

Eviction Procedures: ${input.evictionProcedures}

Tenant Complaint Handling: ${input.tenantComplaintHandling}

The Manager shall perform all services with professional competence and in accordance with industry standards and applicable laws.`;
  }

  private generateFeesAndExpenses(input: PropertyManagementUserInput): string {
    const feeStructure = `Fee Type: ${input.managementFeeType}\nManagement Fee Rate: ${input.managementFeeRate}`;
    const additionalFees = [];
    
    if (input.setupFees) additionalFees.push(`Setup Fees: ${input.setupFees}`);
    if (input.renewalFees) additionalFees.push(`Renewal Fees: ${input.renewalFees}`);
    if (input.vacancyFees) additionalFees.push(`Vacancy Fees: ${input.vacancyFees}`);
    if (input.maintenanceFees) additionalFees.push(`Maintenance Fees: ${input.maintenanceFees}`);

    return `${feeStructure}

${additionalFees.length > 0 ? additionalFees.join('\n') + '\n\n' : ''}Rent Collection Schedule: ${input.rentCollectionSchedule}

Security Deposit Handling: ${input.securityDepositHandling}

Expense Reimbursement Process: ${input.expenseReimbursementProcess}

${input.reserveFundManagement ? `Reserve Fund Management: ${input.reserveFundManagement}\n\n` : ''}All fees are exclusive of applicable taxes. Management fees shall be deducted from rental income before remittance to the Owner.`;
  }

  private generateAccountingAndReporting(input: PropertyManagementUserInput): string {
    return `Monthly Reporting Requirements: ${input.monthlyReportingRequirements}

Annual Reporting Requirements: ${input.annualReportingRequirements}

Accounting Standards: ${input.accountingStandards}

Record Keeping Requirements: ${input.recordKeepingRequirements}

The Manager shall maintain accurate records of all transactions and shall provide detailed financial reports to the Owner as specified. All records shall be made available for inspection by the Owner upon reasonable notice.`;
  }

  private generateInsuranceRequirements(input: PropertyManagementUserInput): string {
    return `Insurance Requirements: ${input.insuranceRequirements}

Professional Insurance Requirements: ${input.professionalInsuranceRequirements}

The Manager shall maintain appropriate insurance coverage for professional liability, errors and omissions, and general liability. The Owner shall maintain property insurance and shall name the Manager as an additional insured where appropriate.`;
  }

  private generatePerformanceStandards(input: PropertyManagementUserInput): string {
    return `Performance Metrics: ${input.performanceMetrics}

Service Standards: ${input.serviceStandards}

Response Time Requirements: ${input.responseTimeRequirements}

Maintenance and Repairs:
• Routine Maintenance Authority: ${input.routineMaintenanceAuthority}
• Emergency Repair Authorization: ${input.emergencyRepairAuthorization}
• Vendor Management Responsibilities: ${input.vendorManagementResponsibilities}
• Quality Control Measures: ${input.qualityControlMeasures}

The Manager shall meet or exceed all specified performance standards and shall promptly address any deficiencies identified by the Owner.`;
  }

  private generateLimitationsAndRestrictions(input: PropertyManagementUserInput): string {
    return `Authority Limitations: ${input.authorityLimitations}

Expenditure Authorization Limits: ${input.expenditureAuthorizationLimits}

Contracting Authority: ${input.contractingAuthority}

The Manager shall not exceed the specified authority limits without prior written consent from the Owner. Any expenditure exceeding the authorized limits must be approved by the Owner in advance, except for emergency repairs necessary to protect the property or ensure tenant safety.`;
  }

  private generateTerminationProvisions(input: PropertyManagementUserInput): string {
    return `Termination Conditions: ${input.terminationConditions}

Termination Notice Period: ${input.terminationNoticePeriod}

Handover Procedures: ${input.handoverProcedures}

Post-Termination Obligations: ${input.postTerminationObligations}

Upon termination, the Manager shall transfer all records, keys, security deposits, and other property-related materials to the Owner or the Owner's designated representative. The Manager shall cooperate fully in the transition to ensure continuity of property management services.`;
  }

  private generateIndemnification(input: PropertyManagementUserInput): string {
    return `Liability Allocation: ${input.liabilityAllocation}

Indemnification Provisions: ${input.indemnificationProvisions}

Each party shall indemnify and hold harmless the other party from any claims, damages, or losses arising from their own negligent acts or omissions in the performance of this Agreement. The Manager's liability shall be limited to the management fees received under this Agreement, except in cases of gross negligence or willful misconduct.`;
  }

  private generateDisputeResolution(input: PropertyManagementUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    return `Any disputes arising under this Agreement shall be resolved through good faith negotiation between the parties. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the Arbitration Act of Kenya.

This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.`;
  }

  private generateGeneralProvisions(input: PropertyManagementUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    
    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.

Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof.

Amendment: This Agreement may only be modified by written agreement signed by both parties.

Severability: If any provision of this Agreement is found to be unenforceable, the remainder of the Agreement shall remain in full force and effect.

Effective Date: This Agreement shall be effective as of ${input.effectiveDate}.

${additionalTerms}`;
  }

  private generateSignatures(input: PropertyManagementUserInput): string {
    return `PROPERTY OWNER:

_______________________
${input.ownerName}
Address: ${input.ownerAddress}
Date: _______________


PROPERTY MANAGER:

_______________________
${input.managerName}
Business Registration: ${input.managerBusinessRegistration}
Address: ${input.managerAddress}
Date: _______________`;
  }
}