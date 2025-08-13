// Board Resolution interfaces
import { BaseDocumentUserInput } from '../../document';

export interface BoardResolutionUserInput extends BaseDocumentUserInput {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyRegistrationNumber?: string;
  incorporationDate?: string;
  
  // Meeting Details
  meetingDate: string;
  meetingTime: string;
  meetingLocation: string;
  meetingType: 'board' | 'annual_general' | 'extraordinary_general' | 'special';
  meetingChairman: string;
  
  // Directors and Attendance
  totalDirectors: string;
  directorsPresent: string;
  directorsAbsent?: string;
  quorumRequired: string;
  quorumMet: 'yes' | 'no';
  
  // Resolution Details
  resolutionTitle: string;
  resolutionDescription: string;
  resolutionType: 'ordinary' | 'special' | 'unanimous';
  votingResults: string;
  votesInFavor: string;
  votesAgainst?: string;
  abstentions?: string;
  
  // Implementation and Authority
  implementationAuthority: string;
  implementationDeadline?: string;
  responsiblePersons: string;
  reportingRequirements?: string;
  
  // Secretary and Certification
  companySecretary: string;
  secretaryAddress?: string;
  witnessName?: string;
  witnessAddress?: string;
  filingRequirements?: string;
  
  // Additional Information
  previousResolutions?: string;
  governingLaw?: string;
  additionalProvisions?: string;
}

export interface GeneratedBoardResolutionContent {
  meetingDetails: string;
  attendanceAndQuorum: string;
  resolutionsPassed: string;
  votingResults: string;
  implementationAuthority: string;
  effectiveDates: string;
  secretaryCertification: string;
}