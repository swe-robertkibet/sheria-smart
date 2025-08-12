import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { EnhancedLeaseUserInput, GeneratedEnhancedLeaseContent } from '../../types/documents/property/enhanced-lease';

export class EnhancedLeaseGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'ENHANCED LEASE AGREEMENT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as EnhancedLeaseUserInput;
    const tenantName = input.tenantName.replace(/[^a-zA-Z0-9]/g, '_');
    const landlordName = input.landlordName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Enhanced_Lease_Agreement_${landlordName}_${tenantName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as EnhancedLeaseUserInput;
    const partyInfo: string[] = [];

    partyInfo.push('Landlord Information:');
    partyInfo.push(`Name: ${input.landlordName}`);
    partyInfo.push(`Address: ${input.landlordAddress}`);
    partyInfo.push(`Email: ${input.landlordEmail}`);
    if (input.landlordPhone) partyInfo.push(`Phone: ${input.landlordPhone}`);
    if (input.landlordIdNumber) partyInfo.push(`ID Number: ${input.landlordIdNumber}`);
    
    partyInfo.push('');
    
    partyInfo.push('Tenant Information:');
    partyInfo.push(`Name: ${input.tenantName}`);
    partyInfo.push(`Address: ${input.tenantAddress}`);
    partyInfo.push(`Email: ${input.tenantEmail}`);
    if (input.tenantPhone) partyInfo.push(`Phone: ${input.tenantPhone}`);
    if (input.tenantIdNumber) partyInfo.push(`ID Number: ${input.tenantIdNumber}`);
    if (input.tenantOccupation) partyInfo.push(`Occupation: ${input.tenantOccupation}`);

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedEnhancedLeaseContent): DocumentSection[] {
    const input = userInput as EnhancedLeaseUserInput;
    
    return [
      { title: 'PARTIES AND PROPERTY DESCRIPTION', content: generatedContent.partiesAndPropertyDescription || this.generatePartiesAndPropertyDescription(input) },
      { title: 'LEASE TERM AND RENT', content: generatedContent.leaseTermAndRent || this.generateLeaseTermAndRent(input) },
      { title: 'SECURITY DEPOSIT', content: generatedContent.securityDeposit || this.generateSecurityDeposit(input) },
      { title: 'USE OF PREMISES', content: generatedContent.useOfPremises || this.generateUseOfPremises(input) },
      { title: 'MAINTENANCE AND REPAIRS', content: generatedContent.maintenanceAndRepairs || this.generateMaintenanceAndRepairs(input) },
      { title: 'UTILITIES AND SERVICES', content: generatedContent.utilitiesAndServices || this.generateUtilitiesAndServices(input) },
      { title: 'INSURANCE REQUIREMENTS', content: generatedContent.insuranceRequirements || this.generateInsuranceRequirements(input) },
      { title: 'LANDLORD ENTRY RIGHTS', content: generatedContent.landlordEntryRights || this.generateLandlordEntryRights(input) },
      { title: 'DEFAULT AND REMEDIES', content: generatedContent.defaultAndRemedies || this.generateDefaultAndRemedies(input) },
      { title: 'TERMINATION PROVISIONS', content: generatedContent.terminationProvisions || this.generateTerminationProvisions(input) },
      { title: 'SPECIAL PROVISIONS', content: generatedContent.specialProvisions || this.generateSpecialProvisions(input) },
      { title: 'GENERAL PROVISIONS', content: generatedContent.generalProvisions || this.generateGeneralProvisions(input) },
      { title: 'SIGNATURES', content: generatedContent.signatures || this.generateSignatures(input) }
    ];
  }

  private generatePartiesAndPropertyDescription(input: EnhancedLeaseUserInput): string {
    let propertyText = `This Enhanced Lease Agreement is entered into between ${input.landlordName} (the "Landlord") and ${input.tenantName} (the "Tenant").\n\n`;
    
    propertyText += `PROPERTY DETAILS:\n`;
    propertyText += `Address: ${input.propertyAddress}\n`;
    propertyText += `Description: ${input.propertyDescription}\n`;
    propertyText += `Property Type: ${input.propertyType.replace('_', ' ').toUpperCase()}\n`;
    propertyText += `Size: ${input.propertySize}\n`;
    propertyText += `Furnishing Status: ${input.furnishingStatus.replace('_', ' ').toUpperCase()}\n`;
    
    if (input.furnishingDetails) {
      propertyText += `Furnishing Details: ${input.furnishingDetails}\n`;
    }
    
    propertyText += `\nThe Landlord hereby leases to the Tenant the above-described property subject to the terms and conditions set forth in this Agreement.`;

    return propertyText;
  }

  private generateLeaseTermAndRent(input: EnhancedLeaseUserInput): string {
    let leaseText = `Lease Type: ${input.leaseType.replace('_', ' ').toUpperCase()}\n`;
    leaseText += `Lease Term: ${input.leaseTerm}\n`;
    leaseText += `Lease Start Date: ${input.leaseStartDate}\n`;
    
    if (input.leaseEndDate) {
      leaseText += `Lease End Date: ${input.leaseEndDate}\n`;
    }
    
    if (input.renewalOptions) {
      leaseText += `Renewal Options: ${input.renewalOptions}\n`;
    }
    
    leaseText += `\nRENTAL TERMS:\n`;
    leaseText += `Monthly Rent: ${input.monthlyRent}\n`;
    leaseText += `Rent Payment Date: ${input.rentPaymentDate}\n`;
    leaseText += `Payment Method: ${input.rentPaymentMethod}\n`;
    
    if (input.advanceRentPayment) {
      leaseText += `Advance Rent Payment: ${input.advanceRentPayment}\n`;
    }
    
    if (input.lateFees) {
      leaseText += `Late Fees: ${input.lateFees}\n`;
    }
    
    if (input.rentReviewClause) {
      leaseText += `Rent Review: ${input.rentReviewClause}\n`;
    }
    
    leaseText += `\nRent shall be paid in advance without demand, deduction, or set-off. Time is of the essence regarding rent payments.`;

    return leaseText;
  }

  private generateSecurityDeposit(input: EnhancedLeaseUserInput): string {
    let depositText = `Security Deposit Amount: ${input.securityDeposit}\n\n`;
    
    depositText += `The security deposit shall be held by the Landlord as security for the faithful performance of the Tenant's obligations under this Agreement. The deposit may be applied toward:\n`;
    depositText += `1. Unpaid rent or other charges\n`;
    depositText += `2. Damages to the property beyond normal wear and tear\n`;
    depositText += `3. Cleaning costs if the property is not returned in clean condition\n`;
    depositText += `4. Any other breach of lease terms\n\n`;
    
    depositText += `The security deposit will be refunded within thirty (30) days after termination of the lease, less any lawful deductions, provided the Tenant has fulfilled all lease obligations.`;

    return depositText;
  }

  private generateUseOfPremises(input: EnhancedLeaseUserInput): string {
    let useText = `Permitted Use: ${input.permittedUse}\n\n`;
    
    if (input.occupancyLimits) {
      useText += `Occupancy Limits: ${input.occupancyLimits}\n\n`;
    }
    
    if (input.businessUseRestrictions) {
      useText += `Business Use Restrictions: ${input.businessUseRestrictions}\n\n`;
    }
    
    useText += `Subletting Policy: ${input.sublettingPolicy.replace('_', ' ').toUpperCase()}\n\n`;
    
    useText += `The Tenant shall use the premises solely for the permitted purposes and shall not engage in any activity that may disturb neighbors, violate local laws, or damage the property. Any change in use requires prior written consent from the Landlord.`;

    return useText;
  }

  private generateMaintenanceAndRepairs(input: EnhancedLeaseUserInput): string {
    let maintenanceText = `LANDLORD RESPONSIBILITIES:\n${input.landlordMaintenanceResponsibilities}\n\n`;
    maintenanceText += `TENANT RESPONSIBILITIES:\n${input.tenantMaintenanceResponsibilities}\n\n`;
    maintenanceText += `REPAIR NOTIFICATION PROCESS:\n${input.repairNotificationProcess}\n\n`;
    maintenanceText += `EMERGENCY REPAIR PROCEDURES:\n${input.emergencyRepairProcedures}\n\n`;
    
    maintenanceText += `The Tenant shall promptly notify the Landlord of any needed repairs. The Landlord shall make repairs within a reasonable time after notice, except for emergency repairs which shall be addressed immediately. The Tenant shall not attempt major repairs without landlord consent.`;

    return maintenanceText;
  }

  private generateUtilitiesAndServices(input: EnhancedLeaseUserInput): string {
    let utilitiesText = `UTILITIES INCLUDED IN RENT:\n${input.utilitiesIncluded}\n\n`;
    utilitiesText += `UTILITIES PAID BY TENANT:\n${input.utilitiesPaidByTenant}\n\n`;
    
    if (input.serviceCharges) {
      utilitiesText += `SERVICE CHARGES:\n${input.serviceCharges}\n\n`;
    }
    
    if (input.internetAndCableProvision) {
      utilitiesText += `INTERNET AND CABLE:\n${input.internetAndCableProvision}\n\n`;
    }
    
    utilitiesText += `The Tenant is responsible for arranging and paying for utilities not included in the rent. All utility accounts must be in the Tenant's name unless otherwise specified.`;

    return utilitiesText;
  }

  private generateInsuranceRequirements(input: EnhancedLeaseUserInput): string {
    let insuranceText = `LANDLORD INSURANCE REQUIREMENTS:\n${input.landlordInsuranceRequirements}\n\n`;
    
    if (input.tenantInsuranceRequirements) {
      insuranceText += `TENANT INSURANCE REQUIREMENTS:\n${input.tenantInsuranceRequirements}\n\n`;
    }
    
    insuranceText += `LIABILITY ALLOCATION:\n${input.liabilityAllocation}\n\n`;
    insuranceText += `PROPERTY DAMAGE RESPONSIBILITY:\n${input.propertyDamageResponsibility}\n\n`;
    
    insuranceText += `Both parties shall maintain appropriate insurance coverage as specified above. Insurance policies shall name the other party as an additional insured where required. Proof of insurance must be provided upon request.`;

    return insuranceText;
  }

  private generateLandlordEntryRights(input: EnhancedLeaseUserInput): string {
    let entryText = `LANDLORD ENTRY RIGHTS:\n${input.landlordEntryRights}\n\n`;
    entryText += `NOTICE REQUIREMENTS:\n${input.noticeRequirements}\n\n`;
    
    if (input.inspectionSchedule) {
      entryText += `INSPECTION SCHEDULE:\n${input.inspectionSchedule}\n\n`;
    }
    
    entryText += `The Landlord may enter the premises for inspections, repairs, showing to prospective tenants or buyers, or in case of emergency. Except for emergencies, the Landlord shall provide reasonable notice as specified above.`;

    return entryText;
  }

  private generateDefaultAndRemedies(input: EnhancedLeaseUserInput): string {
    return `DEFAULT REMEDIES:\n${input.defaultRemedies}\n\n` +
           `EVICTION PROCEDURES:\n${input.evictionProcedures}\n\n` +
           `In the event of default by the Tenant, the Landlord may pursue any remedy available at law or equity, including but not limited to termination of the lease, eviction, and recovery of damages. The Landlord's remedies are cumulative and not exclusive.`;
  }

  private generateTerminationProvisions(input: EnhancedLeaseUserInput): string {
    let terminationText = `TERMINATION CONDITIONS:\n${input.terminationConditions}\n\n`;
    terminationText += `NOTICE PERIODS FOR TERMINATION:\n${input.noticePeriodsForTermination}\n\n`;
    
    terminationText += `Upon termination of this lease, the Tenant shall surrender the premises in good condition, normal wear and tear excepted. Any holding over by the Tenant after expiration shall be deemed a month-to-month tenancy at double the monthly rent rate.`;

    return terminationText;
  }

  private generateSpecialProvisions(input: EnhancedLeaseUserInput): string {
    let specialText = '';
    
    if (input.petPolicy) {
      specialText += `PET POLICY:\n${input.petPolicy}\n\n`;
    }
    
    if (input.parkingProvisions) {
      specialText += `PARKING PROVISIONS:\n${input.parkingProvisions}\n\n`;
    }
    
    if (input.securityMeasures) {
      specialText += `SECURITY MEASURES:\n${input.securityMeasures}\n\n`;
    }
    
    if (input.alterationsPolicy) {
      specialText += `ALTERATIONS POLICY:\n${input.alterationsPolicy}\n\n`;
    }
    
    if (specialText === '') {
      specialText = 'No special provisions apply to this lease agreement.';
    } else {
      specialText += 'These special provisions form an integral part of this lease agreement and shall be binding upon both parties.';
    }

    return specialText;
  }

  private generateGeneralProvisions(input: EnhancedLeaseUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    
    return `Governing Law: This Agreement shall be governed by and construed in accordance with the laws of ${governingState}.\n\n` +
           `Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements.\n\n` +
           `Amendment: This Agreement may only be amended in writing signed by both parties.\n\n` +
           `Severability: If any provision of this Agreement is found to be unenforceable, the remainder shall remain in full force and effect.\n\n` +
           `Kenya Legal Compliance: This Agreement complies with the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act, Rent Restriction Act, and other applicable Kenyan laws.\n\n` +
           `${additionalTerms}`;
  }

  private generateSignatures(input: EnhancedLeaseUserInput): string {
    return `LANDLORD:\n\n_______________________\n${input.landlordName}\nDate: _______________\n\n\nTENANT:\n\n_______________________\n${input.tenantName}\nDate: _______________\n\n\nWITNESS 1:\n\n_______________________\nName: ________________\nDate: _______________\n\n\nWITNESS 2:\n\n_______________________\nName: ________________\nDate: _______________`;
  }
}