import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { ServiceAgreementUserInput, GeneratedServiceAgreementContent } from '../../types/documents/business/service-agreement';

export class ServiceAgreementGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'SERVICE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as ServiceAgreementUserInput;
    const providerName = input.serviceProviderName.replace(/[^a-zA-Z0-9]/g, '_');
    const clientName = input.clientName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Service_Agreement_${providerName}_${clientName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as ServiceAgreementUserInput;
    const partyInfo: string[] = [];

    // Service Provider Information
    partyInfo.push('Service Provider Information:');
    partyInfo.push(`Name: ${input.serviceProviderName}`);
    partyInfo.push(`Address: ${input.serviceProviderAddress}`);
    partyInfo.push(`Email: ${input.serviceProviderEmail}`);
    if (input.serviceProviderPhone) {
      partyInfo.push(`Phone: ${input.serviceProviderPhone}`);
    }
    if (input.serviceProviderBusinessRegistration) {
      partyInfo.push(`Business Registration: ${input.serviceProviderBusinessRegistration}`);
    }
    partyInfo.push('');

    // Client Information
    partyInfo.push('Client Information:');
    partyInfo.push(`Name: ${input.clientName}`);
    partyInfo.push(`Address: ${input.clientAddress}`);
    partyInfo.push(`Email: ${input.clientEmail}`);
    if (input.clientPhone) {
      partyInfo.push(`Phone: ${input.clientPhone}`);
    }
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedServiceAgreementContent): DocumentSection[] {
    const input = userInput as unknown as ServiceAgreementUserInput;
    
    return [
      {
        title: 'PARTIES AND APPOINTMENT',
        content: generatedContent.partiesAndAppointment || this.generatePartiesAndAppointment(input)
      },
      {
        title: 'SERVICES AND DELIVERABLES',
        content: generatedContent.servicesAndDeliverables || this.generateServicesAndDeliverables(input)
      },
      {
        title: 'TIMELINE AND MILESTONES',
        content: generatedContent.timelineAndMilestones || this.generateTimelineAndMilestones(input)
      },
      {
        title: 'FEES AND EXPENSES',
        content: generatedContent.feesAndExpenses || this.generateFeesAndExpenses(input)
      },
      {
        title: 'INTELLECTUAL PROPERTY',
        content: generatedContent.intellectualProperty || this.generateIntellectualProperty(input)
      },
      {
        title: 'CONFIDENTIALITY',
        content: generatedContent.confidentiality || this.generateConfidentiality(input)
      },
      {
        title: 'INDEPENDENT CONTRACTOR STATUS',
        content: generatedContent.independentContractorStatus || this.generateIndependentContractorStatus(input)
      },
      {
        title: 'LIABILITY LIMITATIONS',
        content: generatedContent.liabilityLimitations || this.generateLiabilityLimitations(input)
      },
      {
        title: 'TERMINATION PROVISIONS',
        content: generatedContent.terminationProvisions || this.generateTerminationProvisions(input)
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

  private generatePartiesAndAppointment(input: ServiceAgreementUserInput): string {
    return `This Service Agreement ("Agreement") is entered into between ${input.serviceProviderName}, a service provider located at ${input.serviceProviderAddress} ("Service Provider"), and ${input.clientName}, located at ${input.clientAddress} ("Client"). The Client hereby engages the Service Provider to provide professional services as described herein, and the Service Provider agrees to perform such services under the terms and conditions set forth in this Agreement.`;
  }

  private generateServicesAndDeliverables(input: ServiceAgreementUserInput): string {
    return `Scope of Services: ${input.scopeOfServices}\n\nDeliverables: ${input.deliverablesDescription}\n\nThe Service Provider shall perform the services with professional competence and in accordance with industry standards. All services shall be performed by qualified personnel under the direct supervision of the Service Provider.`;
  }

  private generateTimelineAndMilestones(input: ServiceAgreementUserInput): string {
    const milestonesText = input.milestones ? `\n\nMilestones: ${input.milestones}` : '';
    return `Service Timeline: ${input.serviceTimeline}\n\nTime is of the essence in this Agreement. The Service Provider shall use best efforts to meet all specified deadlines and shall promptly notify the Client of any potential delays.${milestonesText}`;
  }

  private generateFeesAndExpenses(input: ServiceAgreementUserInput): string {
    const expenseText = input.expenseReimbursement ? `\n\nExpense Reimbursement: ${input.expenseReimbursement}` : '\n\nExpenses: Unless otherwise agreed in writing, the Service Provider shall bear all expenses related to the performance of services.';
    return `Fee Structure: ${input.feeStructure}\n\nPayment Terms: ${input.paymentTerms}\n\nAll fees are exclusive of applicable taxes, which shall be added to invoices where required by law.${expenseText}`;
  }

  private generateIntellectualProperty(input: ServiceAgreementUserInput): string {
    const preExistingText = input.preExistingIPRights ? `\n\nPre-existing IP Rights: ${input.preExistingIPRights}` : '';
    return `Intellectual Property Ownership: ${input.intellectualPropertyOwnership}\n\nWork Product Rights: ${input.workProductRights}\n\nThe Service Provider warrants that the work product will not infringe any third-party intellectual property rights.${preExistingText}`;
  }

  private generateConfidentiality(input: ServiceAgreementUserInput): string {
    return `Confidentiality Requirements: ${input.confidentialityRequirements}\n\nThe Service Provider shall maintain in confidence all non-public, proprietary, or confidential information of the Client and shall not disclose such information to any third party without the prior written consent of the Client. This obligation shall survive the termination of this Agreement.`;
  }

  private generateIndependentContractorStatus(input: ServiceAgreementUserInput): string {
    return `Independent Contractor Status: ${input.independentContractorStatus}\n\nThe Service Provider is an independent contractor and not an employee, agent, or representative of the Client. The Service Provider shall be solely responsible for all taxes, social security contributions, and other statutory obligations relating to the performance of services under this Agreement.`;
  }

  private generateLiabilityLimitations(input: ServiceAgreementUserInput): string {
    const insuranceText = input.insuranceRequirements ? `\n\nInsurance Requirements: ${input.insuranceRequirements}` : '';
    return `Liability Limitations: ${input.liabilityLimitations}\n\nEach party's total liability under this Agreement shall be limited to the amount of fees paid or payable under this Agreement. Neither party shall be liable for any indirect, consequential, or special damages.${insuranceText}`;
  }

  private generateTerminationProvisions(input: ServiceAgreementUserInput): string {
    return `Termination Conditions: ${input.terminationConditions}\n\nTermination Notice: ${input.terminationNotice}\n\nUpon termination, the Service Provider shall promptly deliver all work product and confidential information to the Client and shall be compensated for all services performed up to the date of termination.`;
  }

  private generateGeneralProvisions(input: ServiceAgreementUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const disputeText = input.disputeResolution ? `Dispute Resolution: ${input.disputeResolution}` : 'Any disputes shall be resolved through good faith negotiation, and if necessary, through the courts of Kenya.';
    const additionalTerms = input.additionalTerms || '';
    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.\n\n${disputeText}\n\nThis Agreement constitutes the entire agreement between the parties and may only be modified in writing signed by both parties. ${additionalTerms}`;
  }

  private generateSignatures(input: ServiceAgreementUserInput): string {
    return `SERVICE PROVIDER:\n\n_______________________\n${input.serviceProviderName}\nAddress: ${input.serviceProviderAddress}\nDate: _______________\n\n\nCLIENT:\n\n_______________________\n${input.clientName}\nAddress: ${input.clientAddress}\nDate: _______________`;
  }
}