import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { EnhancedEmploymentContractUserInput, GeneratedEnhancedEmploymentContractContent } from '../../types/documents/employment/enhanced-employment-contract';

export class EnhancedEmploymentContractGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'EMPLOYMENT CONTRACT';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as EnhancedEmploymentContractUserInput;
    const employeeName = input.employeeName.replace(/[^a-zA-Z0-9]/g, '_');
    const employerName = input.employerName.replace(/[^a-zA-Z0-9]/g, '_');
    return `Employment_Contract_${employerName}_${employeeName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as EnhancedEmploymentContractUserInput;
    const partyInfo: string[] = [];

    // Employer Information
    partyInfo.push('Employer Information:');
    partyInfo.push(`Company Name: ${input.employerName}`);
    partyInfo.push(`Address: ${input.employerAddress}`);
    partyInfo.push(`Email: ${input.employerEmail}`);
    partyInfo.push(`Business Registration: ${input.employerBusinessRegistration}`);
    
    if (input.employerPhone) {
      partyInfo.push(`Phone: ${input.employerPhone}`);
    }

    partyInfo.push(''); // Empty line

    // Employee Information
    partyInfo.push('Employee Information:');
    partyInfo.push(`Name: ${input.employeeName}`);
    partyInfo.push(`Address: ${input.employeeAddress}`);
    partyInfo.push(`Email: ${input.employeeEmail}`);
    partyInfo.push(`ID Number: ${input.employeeIdNumber}`);
    
    if (input.employeePhone) {
      partyInfo.push(`Phone: ${input.employeePhone}`);
    }
    
    if (input.employeeKraPin) {
      partyInfo.push(`KRA PIN: ${input.employeeKraPin}`);
    }

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedEnhancedEmploymentContractContent): DocumentSection[] {
    const input = userInput as EnhancedEmploymentContractUserInput;
    
    return [
      {
        title: 'PARTIES AND COMMENCEMENT',
        content: generatedContent.partiesAndCommencement || this.generatePartiesAndCommencement(input)
      },
      {
        title: 'POSITION AND DUTIES',
        content: generatedContent.positionAndDuties || this.generatePositionAndDuties(input)
      },
      {
        title: 'REMUNERATION AND BENEFITS',
        content: generatedContent.remunerationAndBenefits || this.generateRemunerationAndBenefits(input)
      },
      {
        title: 'WORKING TIME',
        content: generatedContent.workingTime || this.generateWorkingTime(input)
      },
      {
        title: 'LEAVE ENTITLEMENTS',
        content: generatedContent.leaveEntitlements || this.generateLeaveEntitlements(input)
      },
      {
        title: 'PROBATIONARY PERIOD',
        content: generatedContent.probationaryPeriod || this.generateProbationaryPeriod(input)
      },
      {
        title: 'TERMINATION PROVISIONS',
        content: generatedContent.terminationProvisions || this.generateTerminationProvisions(input)
      },
      {
        title: 'CONFIDENTIALITY',
        content: generatedContent.confidentiality || this.generateConfidentiality(input)
      },
      {
        title: 'INTELLECTUAL PROPERTY',
        content: generatedContent.intellectualProperty || this.generateIntellectualProperty(input)
      },
      {
        title: 'POST-EMPLOYMENT RESTRICTIONS',
        content: generatedContent.postEmploymentRestrictions || this.generatePostEmploymentRestrictions(input)
      },
      {
        title: 'DISCIPLINARY PROCEDURES',
        content: generatedContent.disciplinaryProcedures || this.generateDisciplinaryProcedures(input)
      },
      {
        title: 'GRIEVANCE PROCEDURES',
        content: generatedContent.grievanceProcedures || this.generateGrievanceProcedures(input)
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

  private generatePartiesAndCommencement(input: EnhancedEmploymentContractUserInput): string {
    return `This Employment Contract is entered into between ${input.employerName} (the "Employer"), a company incorporated under the laws of Kenya with business registration ${input.employerBusinessRegistration}, and ${input.employeeName} (the "Employee"), ID No. ${input.employeeIdNumber}. Employment shall commence on ${input.startDate} and shall be ${input.employmentType.replace('_', ' ')} employment. ${input.contractDuration ? `Contract duration: ${input.contractDuration}.` : ''}`;
  }

  private generatePositionAndDuties(input: EnhancedEmploymentContractUserInput): string {
    const reportingManager = input.reportingManager || 'To be determined';
    const workLocation = input.workLocation || 'To be determined';
    return `Job Title: ${input.jobTitle}. Department: ${input.department}. Reporting Manager: ${reportingManager}. Work Location: ${workLocation}. Job Description and Duties: ${input.jobDescription}. The Employee shall perform such additional duties as may be reasonably assigned by the Employer from time to time.`;
  }

  private generateRemunerationAndBenefits(input: EnhancedEmploymentContractUserInput): string {
    const allowancesText = input.allowances ? `Allowances: ${input.allowances}.` : '';
    const bonusText = input.bonusStructure ? `Bonus structure: ${input.bonusStructure}.` : '';
    return `Basic Salary: ${input.basicSalary} per ${input.salaryPaymentFrequency.replace('_', '-')}. ${allowancesText} ${bonusText} Benefits: ${input.benefitsPackage}. The Employer shall deduct statutory contributions including NSSF, NHIF, and PAYE as required by law.`;
  }

  private generateWorkingTime(input: EnhancedEmploymentContractUserInput): string {
    const workingHours = input.workingHoursPerWeek || '40';
    const workingDays = input.workingDaysPerWeek || '5';
    return `Working Hours: ${workingHours} hours per week, ${workingDays} days per week. Normal working hours shall be as determined by the Employer in compliance with the Employment Act 2007. Overtime shall be compensated in accordance with Kenyan labor law.`;
  }

  private generateLeaveEntitlements(input: EnhancedEmploymentContractUserInput): string {
    const annualLeave = input.annualLeaveEntitlement || '21';
    const sickLeave = input.sickLeaveEntitlement || '14';
    const maternityPaternityLeave = input.maternityPaternityLeave || 'As per Employment Act 2007';
    const publicHolidays = input.publicHolidayEntitlement || 'As per Employment Act 2007';
    return `Annual Leave: ${annualLeave} days per year. Sick Leave: ${sickLeave} days per year. Maternity/Paternity Leave: ${maternityPaternityLeave}. Public Holidays: ${publicHolidays}. All leave shall be subject to the provisions of the Employment Act 2007.`;
  }

  private generateProbationaryPeriod(input: EnhancedEmploymentContractUserInput): string {
    if (!input.probationaryPeriod) {
      return 'No probationary period applies to this employment.';
    }
    return `Probationary Period: ${input.probationaryPeriod}. During this period, either party may terminate the employment with seven (7) days written notice or payment in lieu thereof. Upon successful completion of the probationary period, this contract shall continue as a permanent employment contract.`;
  }

  private generateTerminationProvisions(input: EnhancedEmploymentContractUserInput): string {
    const noticePeriodEmployee = input.noticePeriodEmployee || 'One month';
    const noticePeriodEmployer = input.noticePeriodEmployer || 'One month';
    const severancePayProvisions = input.severancePayProvisions || 'As per Employment Act 2007';
    return `Notice Period - Employee: ${noticePeriodEmployee}. Notice Period - Employer: ${noticePeriodEmployer}. Severance Pay: ${severancePayProvisions}. Termination shall be in accordance with the Employment Act 2007. The Employer may terminate employment immediately for gross misconduct without notice or payment in lieu thereof.`;
  }

  private generateConfidentiality(input: EnhancedEmploymentContractUserInput): string {
    const confidentialityObligations = input.confidentialityObligations || 'The Employee shall maintain strict confidentiality of all business information and trade secrets';
    return `Confidentiality Obligations: ${confidentialityObligations}. The Employee shall not, during or after employment, disclose any confidential information belonging to the Employer. This obligation shall survive termination of employment.`;
  }

  private generateIntellectualProperty(input: EnhancedEmploymentContractUserInput): string {
    const intellectualPropertyRights = input.intellectualPropertyRights || 'All work product and innovations created during employment shall belong to the Employer';
    return `Intellectual Property Rights: ${intellectualPropertyRights}. All intellectual property created by the Employee in the course of employment shall belong to the Employer. The Employee hereby assigns all such rights to the Employer.`;
  }

  private generatePostEmploymentRestrictions(input: EnhancedEmploymentContractUserInput): string {
    const nonCompeteText = input.nonCompeteClause ? `Non-Compete: ${input.nonCompeteClause}.` : '';
    const nonSolicitText = input.nonSolicitationClause ? `Non-Solicitation: ${input.nonSolicitationClause}.` : '';
    return `Post-employment restrictions: ${nonCompeteText} ${nonSolicitText} These restrictions are reasonable and necessary for the protection of the Employer's legitimate business interests.`;
  }

  private generateDisciplinaryProcedures(input: EnhancedEmploymentContractUserInput): string {
    const disciplinaryProcedures = input.disciplinaryProcedures || 'Progressive discipline including verbal warning, written warning, final written warning, and termination';
    return `Disciplinary Procedures: ${disciplinaryProcedures}. The Employer shall follow fair disciplinary procedures in accordance with the Employment Act 2007 and the Labour Relations Act.`;
  }

  private generateGrievanceProcedures(input: EnhancedEmploymentContractUserInput): string {
    const grievanceProcedures = input.grievanceProcedures || 'Internal grievance procedure with escalation to management, followed by external mediation if necessary';
    return `Grievance Procedures: ${grievanceProcedures}. The Employee has the right to raise grievances through the established procedures and to be represented during grievance hearings.`;
  }

  private generateGeneralProvisions(input: EnhancedEmploymentContractUserInput): string {
    const governingState = input.governingState || 'Republic of Kenya';
    const additionalTerms = input.additionalTerms || '';
    const performanceReview = input.performanceReviewFrequency ? `Performance reviews shall be conducted ${input.performanceReviewFrequency}.` : '';
    const training = input.trainingAndDevelopment ? `Training and development: ${input.trainingAndDevelopment}.` : '';
    return `This contract is governed by the laws of ${governingState} and the Employment Act 2007. ${performanceReview} ${training} ${additionalTerms}`;
  }

  private generateSignatures(input: EnhancedEmploymentContractUserInput): string {
    return `EMPLOYER:\n\n_______________________\n${input.employerName}\nBy: ___________________\nTitle: ________________\nDate: _______________\n\nEMPLOYEE:\n\n_______________________\n${input.employeeName}\nID No: ${input.employeeIdNumber}\nDate: _______________`;
  }
}