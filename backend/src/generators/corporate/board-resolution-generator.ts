import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { BoardResolutionUserInput, GeneratedBoardResolutionContent } from '../../types/documents/corporate/board-resolution';

export class BoardResolutionGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'BOARD RESOLUTION';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as BoardResolutionUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = (input.companyName || (input as any).party1Name || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
    const meetingDate = input.meetingDate?.replace(/[^a-zA-Z0-9]/g, '_') || 'Meeting';
    return `Board_Resolution_${companyName}_${meetingDate}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as BoardResolutionUserInput;
    const partyInfo: string[] = [];

    // Company Information
    partyInfo.push('Company Information:');
    partyInfo.push(`Name: ${input.companyName || (input as any).party1Name || 'Company Name'}`);
    partyInfo.push(`Address: ${input.companyAddress || (input as any).party1Address || 'Address not provided'}`);
    if (input.companyRegistrationNumber) {
      partyInfo.push(`Registration Number: ${input.companyRegistrationNumber}`);
    }
    if (input.incorporationDate) {
      partyInfo.push(`Incorporation Date: ${input.incorporationDate}`);
    }
    partyInfo.push('');

    // Meeting Information
    partyInfo.push('Meeting Information:');
    partyInfo.push(`Date: ${input.meetingDate}`);
    partyInfo.push(`Time: ${input.meetingTime || 'Not specified'}`);
    partyInfo.push(`Location: ${input.meetingLocation || 'Not specified'}`);
    partyInfo.push(`Type: ${input.meetingType || 'board'} meeting`);
    partyInfo.push(`Chairman: ${input.meetingChairman || 'Not specified'}`);
    partyInfo.push('');

    // Attendance Summary
    partyInfo.push('Attendance Summary:');
    partyInfo.push(`Total Directors: ${input.totalDirectors || 'Not specified'}`);
    partyInfo.push(`Directors Present: ${input.directorsPresent || 'Not specified'}`);
    if (input.directorsAbsent) {
      partyInfo.push(`Directors Absent: ${input.directorsAbsent}`);
    }
    partyInfo.push(`Quorum Required: ${input.quorumRequired || 'Not specified'}`);
    partyInfo.push(`Quorum Met: ${input.quorumMet === 'yes' ? 'Yes' : input.quorumMet === 'no' ? 'No' : 'Not specified'}`);
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedBoardResolutionContent): DocumentSection[] {
    const input = userInput as unknown as BoardResolutionUserInput;
    
    return [
      {
        title: 'MEETING DETAILS',
        content: generatedContent.meetingDetails || this.generateMeetingDetails(input)
      },
      {
        title: 'ATTENDANCE AND QUORUM',
        content: generatedContent.attendanceAndQuorum || this.generateAttendanceAndQuorum(input)
      },
      {
        title: 'RESOLUTIONS PASSED',
        content: generatedContent.resolutionsPassed || this.generateResolutionsPassed(input)
      },
      {
        title: 'VOTING RESULTS',
        content: generatedContent.votingResults || this.generateVotingResults(input)
      },
      {
        title: 'IMPLEMENTATION AUTHORITY',
        content: generatedContent.implementationAuthority || this.generateImplementationAuthority(input)
      },
      {
        title: 'EFFECTIVE DATES',
        content: generatedContent.effectiveDates || this.generateEffectiveDates(input)
      },
      {
        title: 'SECRETARY CERTIFICATION',
        content: generatedContent.secretaryCertification || this.generateSecretaryCertification(input)
      }
    ];
  }

  private generateMeetingDetails(input: BoardResolutionUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = input.companyName || (input as any).party1Name || 'Company Name';
    const meetingTypeText = this.getMeetingTypeText(input.meetingType);
    
    return `${meetingTypeText} of ${companyName}

MEETING PARTICULARS:
Date: ${input.meetingDate}
Time: ${input.meetingTime || 'As scheduled'}
Location: ${input.meetingLocation || 'Company premises'}

MEETING CONVENED:
This ${input.meetingType || 'board'} meeting was duly convened and held in accordance with the provisions of:
• The Companies Act, 2015 of the Republic of Kenya
• The Company's Articles of Association
• The Company's internal procedures and bylaws

NOTICE:
Proper notice of this meeting was given to all directors in accordance with the Company's Articles of Association and the requirements of the Companies Act, 2015.

CHAIRMAN:
The meeting was chaired by ${input.meetingChairman || 'the Chairman of the Board'}, who was duly appointed to preside over the meeting.

COMPANY SECRETARY:
${input.companySecretary || 'The Company Secretary'} was present to record the proceedings and maintain the minutes of the meeting.`;
  }

  private generateAttendanceAndQuorum(input: BoardResolutionUserInput): string {
    const quorumStatus = input.quorumMet === 'yes' ? 'was achieved' : input.quorumMet === 'no' ? 'was not achieved' : 'status not specified';
    const absentText = input.directorsAbsent ? `\n\nDirectors Absent:\n${input.directorsAbsent}` : '';
    
    return `BOARD COMPOSITION:
Total Number of Directors: ${input.totalDirectors || 'Not specified'}

ATTENDANCE:
Directors Present: ${input.directorsPresent || 'Not specified'}${absentText}

QUORUM:
Quorum Required: ${input.quorumRequired || 'As per Articles of Association'}
Quorum Status: ${quorumStatus}

${input.quorumMet === 'yes' ? 
  'The Chairman declared that a quorum was present and that the meeting was properly constituted to transact business.' : 
  input.quorumMet === 'no' ? 
  'The Chairman noted that the required quorum was not present and the meeting was adjourned.' : 
  'The quorum status was verified in accordance with the Company\'s Articles of Association.'}

AUTHORITY TO PROCEED:
${input.quorumMet === 'yes' ? 
  'Having confirmed that the meeting was properly constituted with the required quorum present, the meeting proceeded to consider the business on the agenda.' : 
  'The meeting proceeded in accordance with applicable procedures.'}`;
  }

  private generateResolutionsPassed(input: BoardResolutionUserInput): string {
    const resolutionTypeText = this.getResolutionTypeText(input.resolutionType);
    const previousResolutionsText = input.previousResolutions ? 
      `\n\nRELATED PREVIOUS RESOLUTIONS:\n${input.previousResolutions}` : '';

    return `RESOLUTION TITLE:
${input.resolutionTitle || 'Resolution'}

RESOLUTION TYPE:
${resolutionTypeText}

RESOLUTION DETAILS:
${input.resolutionDescription || 'Resolution details not specified'}

BACKGROUND AND RATIONALE:
This resolution was proposed to address the business needs of the Company and is in the best interests of the Company and its shareholders.

LEGAL BASIS:
This resolution is passed under the authority granted by:
• The Companies Act, 2015 of the Republic of Kenya
• The Company's Articles of Association
• The powers vested in the Board of Directors

COMPLIANCE:
The resolution complies with all applicable laws, regulations, and the Company's governing documents.${previousResolutionsText}

IMPLEMENTATION:
The Board authorizes the implementation of this resolution in accordance with the terms set out herein and applicable legal requirements.`;
  }

  private generateVotingResults(input: BoardResolutionUserInput): string {
    const votesAgainstText = input.votesAgainst ? `\nVotes Against: ${input.votesAgainst}` : '';
    const abstentionsText = input.abstentions ? `\nAbstentions: ${input.abstentions}` : '';
    
    return `VOTING PROCEDURE:
The resolution was put to a vote of the directors present at the meeting.

VOTING RESULTS:
${input.votingResults || 'Voting results not specified'}

VOTE BREAKDOWN:
Votes in Favor: ${input.votesInFavor || 'Not specified'}${votesAgainstText}${abstentionsText}

VOTING METHOD:
${input.resolutionType === 'unanimous' ? 
  'The resolution was passed by unanimous consent of all directors present.' :
  input.resolutionType === 'special' ?
  'The resolution was passed as a special resolution requiring the support of at least 75% of the directors present.' :
  'The resolution was passed by ordinary majority vote of the directors present.'}

RESOLUTION STATUS:
${input.resolutionType === 'unanimous' && input.votesInFavor ? 'PASSED BY UNANIMOUS CONSENT' :
  'DULY PASSED AND ADOPTED'}

The Chairman declared the resolution to be duly passed and adopted by the Board of Directors.

RECORD OF VOTE:
This vote and its results are hereby recorded in the minutes of the meeting and shall form part of the Company's corporate records.`;
  }

  private generateImplementationAuthority(input: BoardResolutionUserInput): string {
    const implementationDeadlineText = input.implementationDeadline ? 
      `\n\nImplementation Deadline: ${input.implementationDeadline}` : '';
    const reportingText = input.reportingRequirements ? 
      `\n\nReporting Requirements:\n${input.reportingRequirements}` : '';

    return `IMPLEMENTATION AUTHORITY:
${input.implementationAuthority || 'The Board hereby authorizes the implementation of this resolution.'}

RESPONSIBLE PERSONS:
${input.responsiblePersons || 'The management team and designated officers are responsible for implementation.'}${implementationDeadlineText}

POWERS GRANTED:
The Board hereby grants the following powers and authorities for the implementation of this resolution:
• Authority to execute necessary documents and agreements
• Power to engage third parties and service providers as required
• Authorization to incur reasonable expenses in implementation
• Authority to make operational decisions consistent with this resolution

LIMITATIONS AND CONDITIONS:
• All actions must be consistent with the terms of this resolution
• All expenditures must be within approved budgets and limits
• Regular progress reports must be provided to the Board
• Any material deviations must receive prior Board approval

DELEGATION:
The Board may delegate specific aspects of implementation to appropriate committees or officers while retaining overall oversight and responsibility.${reportingText}

MONITORING:
The Board shall monitor the implementation of this resolution and may require periodic reports on progress and compliance.`;
  }

  private generateEffectiveDates(input: BoardResolutionUserInput): string {
    return `EFFECTIVE DATE:
This resolution shall take effect from ${input.effectiveDate || 'the date of its passage by the Board'}.

DATE OF RESOLUTION:
Passed on: ${input.meetingDate}

IMPLEMENTATION COMMENCEMENT:
Implementation activities may commence immediately upon the effectiveness of this resolution, subject to any specific conditions or requirements set out herein.

DURATION:
This resolution shall remain in effect until:
• Its purposes are fully accomplished
• It is superseded by a subsequent Board resolution
• It is revoked or amended by the Board
• Any specified expiration date is reached

NOTICE REQUIREMENTS:
${input.filingRequirements || 'Appropriate notices shall be given to all relevant parties and regulatory bodies as required by law.'}

REGULATORY COMPLIANCE:
Any required filings or notifications to regulatory authorities shall be completed within the timeframes specified by applicable laws and regulations.

RECORD KEEPING:
This resolution shall be properly recorded in the Company's minute book and corporate records, and copies shall be provided to all directors and relevant officers.

EFFECTIVENESS CONDITIONS:
This resolution is subject to:
• Compliance with all applicable legal and regulatory requirements
• Receipt of any necessary approvals or consents
• Satisfaction of any conditions precedent specified herein`;
  }

  private generateSecretaryCertification(input: BoardResolutionUserInput): string {
    const governingLaw = input.governingLaw || 'Republic of Kenya';
    const witnessText = input.witnessName ? `

WITNESS:

_______________________
${input.witnessName}
Address: ${input.witnessAddress || 'Address not provided'}
Date: _______________` : '';
    
    const additionalProvisionsText = input.additionalProvisions ? 
      `\n\nADDITIONAL PROVISIONS:\n${input.additionalProvisions}` : '';

    return `SECRETARY'S CERTIFICATION:

I, ${input.companySecretary || 'the Company Secretary'}, hereby certify that:

1. I am the duly appointed Secretary of the Company;
2. The above resolution was duly passed at a meeting of the Board of Directors held on ${input.meetingDate};
3. The meeting was properly convened with due notice given to all directors;
4. A quorum was present throughout the meeting;
5. The resolution was passed in accordance with the Company's Articles of Association and the Companies Act, 2015;
6. This is a true and complete copy of the resolution as recorded in the Company's minute book.

GOVERNING LAW:
This resolution is governed by the laws of ${governingLaw} and shall be construed in accordance with the Companies Act, 2015.

COMPANY SECRETARY:

_______________________
${input.companySecretary || 'Company Secretary Name'}
Company Secretary
${input.secretaryAddress ? `Address: ${input.secretaryAddress}` : ''}
Date: _______________${witnessText}

CORPORATE SEAL:
[Place for Company Seal]

FILING AND DISTRIBUTION:
Copies of this resolution shall be:
• Filed in the Company's minute book
• Distributed to all directors
• Provided to relevant officers and management
• Filed with regulatory authorities as required

AUTHENTICITY:
This document constitutes an authentic record of the Board's decision and may be relied upon by third parties dealing with the Company.${additionalProvisionsText}`;
  }

  private getMeetingTypeText(meetingType?: string): string {
    switch (meetingType) {
      case 'annual_general':
        return 'ANNUAL GENERAL MEETING';
      case 'extraordinary_general':
        return 'EXTRAORDINARY GENERAL MEETING';
      case 'special':
        return 'SPECIAL MEETING';
      case 'board':
      default:
        return 'BOARD MEETING';
    }
  }

  private getResolutionTypeText(resolutionType?: string): string {
    switch (resolutionType) {
      case 'special':
        return 'Special Resolution (requiring 75% majority)';
      case 'unanimous':
        return 'Unanimous Resolution (requiring consent of all directors)';
      case 'ordinary':
      default:
        return 'Ordinary Resolution (requiring simple majority)';
    }
  }
}