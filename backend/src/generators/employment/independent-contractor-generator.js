"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndependentContractorGenerator = void 0;
const base_document_generator_1 = require("../base/base-document-generator");
class IndependentContractorGenerator extends base_document_generator_1.BaseDocumentGenerator {
    getDocumentTitle(userInput) {
        return 'INDEPENDENT CONTRACTOR AGREEMENT';
    }
    getBaseFilename(userInput) {
        const input = userInput;
        const contractorName = input.contractorName.replace(/[^a-zA-Z0-9]/g, '_');
        const clientName = input.clientName.replace(/[^a-zA-Z0-9]/g, '_');
        return `Independent_Contractor_${clientName}_${contractorName}`;
    }
    getPartyInformation(userInput) {
        const input = userInput;
        const partyInfo = [];
        partyInfo.push('Client Information:');
        partyInfo.push(`Name: ${input.clientName}`);
        partyInfo.push(`Address: ${input.clientAddress}`);
        partyInfo.push(`Email: ${input.clientEmail}`);
        partyInfo.push(`Business Registration: ${input.clientBusinessRegistration}`);
        if (input.clientPhone)
            partyInfo.push(`Phone: ${input.clientPhone}`);
        partyInfo.push('');
        partyInfo.push('Contractor Information:');
        partyInfo.push(`Name: ${input.contractorName}`);
        partyInfo.push(`Address: ${input.contractorAddress}`);
        partyInfo.push(`Email: ${input.contractorEmail}`);
        if (input.contractorPhone)
            partyInfo.push(`Phone: ${input.contractorPhone}`);
        if (input.contractorBusinessRegistration)
            partyInfo.push(`Business Registration: ${input.contractorBusinessRegistration}`);
        return partyInfo;
    }
    getDocumentSections(userInput, generatedContent) {
        const input = userInput;
        return [
            { title: 'INDEPENDENT CONTRACTOR RELATIONSHIP', content: generatedContent.independentContractorRelationship || this.generateContractorRelationship(input) },
            { title: 'SERVICES AND DELIVERABLES', content: generatedContent.servicesAndDeliverables || this.generateServicesAndDeliverables(input) },
            { title: 'COMPENSATION', content: generatedContent.compensation || this.generateCompensation(input) },
            { title: 'EXPENSES', content: generatedContent.expenses || this.generateExpenses(input) },
            { title: 'TIMELINE AND DEADLINES', content: generatedContent.timelineAndDeadlines || this.generateTimeline(input) },
            { title: 'INTELLECTUAL PROPERTY', content: generatedContent.intellectualProperty || this.generateIntellectualProperty(input) },
            { title: 'CONFIDENTIALITY', content: generatedContent.confidentiality || this.generateConfidentiality(input) },
            { title: 'EQUIPMENT AND MATERIALS', content: generatedContent.equipmentAndMaterials || this.generateEquipmentAndMaterials(input) },
            { title: 'TERMINATION', content: generatedContent.termination || this.generateTermination(input) },
            { title: 'TAX AND INSURANCE', content: generatedContent.taxAndInsurance || this.generateTaxAndInsurance(input) },
            { title: 'GENERAL PROVISIONS', content: generatedContent.generalProvisions || this.generateGeneralProvisions(input) },
            { title: 'SIGNATURES', content: generatedContent.signatures || this.generateSignatures(input) }
        ];
    }
    generateContractorRelationship(input) {
        return `${input.contractorName} is engaged as an independent contractor, not as an employee. ${input.independentContractorAcknowledgment} The Contractor has the right to control the manner and means of performing services, subject to the requirement that services conform to the specifications in this Agreement.`;
    }
    generateServicesAndDeliverables(input) {
        return `Services Description: ${input.servicesDescription}. Project Scope: ${input.projectScope}. Deliverables: ${input.deliverablesSpecifications}. Performance Standards: ${input.performanceStandards}.`;
    }
    generateCompensation(input) {
        let compensationText = `Compensation Structure: ${input.compensationStructure}.`;
        if (input.totalCompensation)
            compensationText += ` Total Compensation: ${input.totalCompensation}.`;
        if (input.hourlyRate)
            compensationText += ` Hourly Rate: ${input.hourlyRate}.`;
        compensationText += ` Payment Schedule: ${input.paymentSchedule}. Payment Terms: ${input.paymentTerms}.`;
        return compensationText;
    }
    generateExpenses(input) {
        return input.expenseReimbursement || 'The Contractor shall be responsible for all expenses incurred in connection with the performance of services unless otherwise agreed in writing.';
    }
    generateTimeline(input) {
        let timelineText = `Project Start Date: ${input.projectStartDate}. Project Duration: ${input.projectDuration}.`;
        if (input.projectEndDate)
            timelineText += ` Project End Date: ${input.projectEndDate}.`;
        if (input.workSchedule)
            timelineText += ` Work Schedule: ${input.workSchedule}.`;
        if (input.keyMilestones)
            timelineText += ` Key Milestones: ${input.keyMilestones}.`;
        return timelineText;
    }
    generateIntellectualProperty(input) {
        let ipText = `Intellectual Property Ownership: ${input.intellectualPropertyOwnership}. Work for Hire: ${input.workForHireProvisions}.`;
        if (input.preExistingIPRights)
            ipText += ` Pre-existing IP Rights: ${input.preExistingIPRights}.`;
        return ipText;
    }
    generateConfidentiality(input) {
        return `Confidentiality Obligations: ${input.confidentialityObligations}. Non-disclosure Terms: ${input.nonDisclosureTerms}. These obligations shall survive termination of this Agreement.`;
    }
    generateEquipmentAndMaterials(input) {
        let equipmentText = `Equipment and Materials: ${input.equipmentAndMaterials}.`;
        if (input.clientProvidedResources)
            equipmentText += ` Client-Provided Resources: ${input.clientProvidedResources}.`;
        equipmentText += ` Work Location: ${input.workLocation}.`;
        return equipmentText;
    }
    generateTermination(input) {
        return `Termination Conditions: ${input.terminationConditions}. Termination Notice: ${input.terminationNoticeRequired}. Upon termination, the Contractor shall deliver all work product and return all confidential materials.`;
    }
    generateTaxAndInsurance(input) {
        let taxText = `Tax Responsibilities: ${input.taxResponsibilities}. The Contractor is responsible for all tax obligations arising from this Agreement.`;
        if (input.insuranceRequirements)
            taxText += ` Insurance Requirements: ${input.insuranceRequirements}.`;
        return taxText;
    }
    generateGeneralProvisions(input) {
        const governingState = input.governingState || 'Republic of Kenya';
        const additionalTerms = input.additionalTerms || '';
        return `This Agreement shall be governed by the laws of ${governingState}. This Agreement constitutes the entire agreement between the parties. ${additionalTerms}`;
    }
    generateSignatures(input) {
        return `CLIENT:\n\n_______________________\n${input.clientName}\nDate: _______________\n\nCONTRACTOR:\n\n_______________________\n${input.contractorName}\nDate: _______________`;
    }
}
exports.IndependentContractorGenerator = IndependentContractorGenerator;
