import { BaseDocumentGenerator, DocumentSection } from '../base/base-document-generator';
import { DocumentUserInput } from '../../types/document';
import { ArticlesOfAssociationUserInput, GeneratedArticlesOfAssociationContent } from '../../types/documents/corporate/articles-of-association';

export class ArticlesOfAssociationGenerator extends BaseDocumentGenerator {
  getDocumentTitle(userInput: DocumentUserInput): string {
    return 'ARTICLES OF ASSOCIATION';
  }

  getBaseFilename(userInput: DocumentUserInput): string {
    const input = userInput as unknown as ArticlesOfAssociationUserInput;
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = (input.companyName || (input as any).party1Name || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
    return `Articles_of_Association_${companyName}`;
  }

  getPartyInformation(userInput: DocumentUserInput): string[] {
    const input = userInput as unknown as ArticlesOfAssociationUserInput;
    const partyInfo: string[] = [];

    // Company Information
    partyInfo.push('Company Information:');
    partyInfo.push(`Name: ${input.companyName || (input as any).party1Name || 'Company Name'}`);
    partyInfo.push(`Address: ${input.companyAddress || (input as any).party1Address || 'Address not provided'}`);
    if (input.companyRegistrationNumber) {
      partyInfo.push(`Registration Number: ${input.companyRegistrationNumber}`);
    }
    partyInfo.push(`Company Type: ${input.companyType || 'private'}`);
    partyInfo.push(`Business Objectives: ${input.businessObjectives || 'General business activities'}`);
    partyInfo.push('');

    return partyInfo;
  }

  getDocumentSections(userInput: DocumentUserInput, generatedContent: GeneratedArticlesOfAssociationContent): DocumentSection[] {
    const input = userInput as unknown as ArticlesOfAssociationUserInput;
    
    return [
      {
        title: 'COMPANY NAME AND OBJECTS',
        content: generatedContent.companyNameAndObjects || this.generateCompanyNameAndObjects(input)
      },
      {
        title: 'SHARE CAPITAL AND SHARES',
        content: generatedContent.shareCapitalAndShares || this.generateShareCapitalAndShares(input)
      },
      {
        title: 'VARIATION OF RIGHTS',
        content: generatedContent.variationOfRights || this.generateVariationOfRights(input)
      },
      {
        title: 'SHARE TRANSFERS',
        content: generatedContent.shareTransfers || this.generateShareTransfers(input)
      },
      {
        title: 'GENERAL MEETINGS',
        content: generatedContent.generalMeetings || this.generateGeneralMeetings(input)
      },
      {
        title: 'DIRECTORS',
        content: generatedContent.directors || this.generateDirectors(input)
      },
      {
        title: 'BOARD MEETINGS',
        content: generatedContent.boardMeetings || this.generateBoardMeetings(input)
      },
      {
        title: 'DIVIDENDS',
        content: generatedContent.dividends || this.generateDividends(input)
      },
      {
        title: 'ACCOUNTS AND AUDIT',
        content: generatedContent.accountsAndAudit || this.generateAccountsAndAudit(input)
      },
      {
        title: 'NOTICES',
        content: generatedContent.notices || this.generateNotices(input)
      },
      {
        title: 'INDEMNITY',
        content: generatedContent.indemnity || this.generateIndemnity(input)
      },
      {
        title: 'WINDING UP',
        content: generatedContent.windingUp || this.generateWindingUp(input)
      },
      {
        title: 'SIGNATURES',
        content: generatedContent.signatures || this.generateSignatures(input)
      }
    ];
  }

  private generateCompanyNameAndObjects(input: ArticlesOfAssociationUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = input.companyName || (input as any).party1Name || 'Company Name';
    const companyType = input.companyType || 'private';
    
    return `1. COMPANY NAME
The name of the company is "${companyName}" (hereinafter referred to as "the Company").

2. COMPANY TYPE
The Company is a ${companyType} company limited by shares, incorporated under the Companies Act, 2015 of the Republic of Kenya.

3. REGISTERED OFFICE
The registered office of the Company shall be situated at ${input.companyAddress || 'the address as may be determined by the Board of Directors'}.

4. OBJECTS AND PURPOSES
The objects for which the Company is established are:

Primary Objects:
${input.businessObjectives}

The Company shall have full power to carry on any other business which may seem to the Company capable of being conveniently carried on in connection with the above business or calculated directly or indirectly to enhance the value of or render profitable any of the Company's property or rights.

Ancillary Powers:
The Company shall have all the powers conferred by the Companies Act, 2015, including but not limited to:
• To acquire, hold, and dispose of property of all kinds
• To enter into contracts and agreements
• To borrow money and give security
• To invest funds and grant loans
• To employ personnel and engage contractors

5. LIABILITY OF MEMBERS
The liability of the members is limited to the amount, if any, unpaid on the shares held by them respectively.`;
  }

  private generateShareCapitalAndShares(input: ArticlesOfAssociationUserInput): string {
    return `6. AUTHORIZED SHARE CAPITAL
The authorized share capital of the Company is ${input.authorizedShareCapital}.

7. SHARE STRUCTURE
${input.shareCapitalStructure}

8. NOMINAL VALUE
The nominal value of each share shall be ${input.shareNominalValue}.

${input.shareClasses ? `9. SHARE CLASSES
${input.shareClasses}` : ''}

10. INITIAL SHARE ALLOCATION
${input.initialShareAllocation}

11. SHARE CERTIFICATES
Every member shall be entitled to receive, without charge, a certificate under the seal of the Company specifying the shares held by them and the amount paid up thereon.

12. SHARE RIGHTS
Subject to these Articles and the provisions of the Companies Act, shares shall carry the following rights:
• The right to receive dividends
• The right to attend and vote at general meetings
• The right to participate in the distribution of assets upon winding up
• Such other rights as may be attached to the shares

13. CALLS ON SHARES
The Board may make calls upon members in respect of any money unpaid on their shares, provided that:
• Not less than 14 days' notice is given
• The call does not exceed 25% of the nominal value per call
• Calls are made uniformly on all shares of the same class

14. FORFEITURE OF SHARES
If a member fails to pay any call or installment when due, the Board may serve notice requiring payment within 14 days, failing which the shares may be forfeited.`;
  }

  private generateVariationOfRights(input: ArticlesOfAssociationUserInput): string {
    return `15. VARIATION OF CLASS RIGHTS
The rights attached to any class of shares may be varied or abrogated with:
• The consent in writing of the holders of three-fourths of the issued shares of that class, or
• A special resolution passed at a separate general meeting of the holders of that class

16. SPECIAL RESOLUTION REQUIREMENTS
${input.specialResolutionRequirements}

17. PROTECTION OF MINORITY RIGHTS
No variation of class rights shall be effective unless:
• Proper notice has been given to all shareholders of the affected class
• The variation is approved by the requisite majority
• The variation is in the best interests of the Company as a whole

18. OBJECTIONS TO VARIATIONS
Any holder of shares of the affected class who did not consent to the variation may apply to the High Court to have the variation cancelled within 21 days of the resolution.`;
  }

  private generateShareTransfers(input: ArticlesOfAssociationUserInput): string {
    const transferRestrictions = input.transferRestrictions || 'Shares may be transferred subject to board approval';
    const rightOfFirstRefusal = input.rightOfFirstRefusal || '';
    
    return `19. SHARE TRANSFERS
${transferRestrictions}

20. TRANSFER PROCEDURE
${input.shareTransferProcedure}

21. TRANSFER APPROVAL
${input.transferApprovalRequirements || 'The Board of Directors shall have discretion to approve or refuse any transfer of shares.'}

${rightOfFirstRefusal ? `22. RIGHT OF FIRST REFUSAL
${rightOfFirstRefusal}` : ''}

23. TRANSFER INSTRUMENTS
All transfers of shares shall be effected by a proper instrument of transfer in the form prescribed by the Companies Act or in such other form as the Board may approve.

24. REGISTRATION OF TRANSFERS
The Board may refuse to register any transfer unless:
• The transfer is in favor of a person of good standing
• The transferor has paid all calls and other monies due on the shares
• The transfer complies with these Articles

25. TRANSMISSION OF SHARES
In case of death or bankruptcy of a member, the Company shall recognize only:
• The legal personal representative of a deceased member
• The trustee in bankruptcy of a bankrupt member
• Such persons as may be entitled by operation of law

26. LIEN ON SHARES
The Company shall have a first and paramount lien on every share for:
• All monies called or payable in respect of that share
• All monies owed by the member to the Company
Such lien shall extend to all dividends declared in respect of such shares.`;
  }

  private generateGeneralMeetings(input: ArticlesOfAssociationUserInput): string {
    return `27. ANNUAL GENERAL MEETING
The Company shall hold an Annual General Meeting each year within 15 months of the last Annual General Meeting, and in any case within 6 months of the end of the financial year.

28. EXTRAORDINARY GENERAL MEETINGS
${input.generalMeetingProcedures}

29. CONVENING MEETINGS
General meetings may be convened by:
• The Board of Directors
• Members holding not less than 10% of the voting rights
• Such other persons as authorized by law

30. NOTICE OF MEETINGS
${input.noticeRequirements}

Notice shall specify:
• The date, time, and place of the meeting
• The general nature of the business to be transacted
• The text of any special resolution to be proposed

31. QUORUM
${input.quorumRequirements}

If a quorum is not present within 30 minutes of the time appointed, the meeting shall stand adjourned to the same day in the next week at the same time and place.

32. VOTING PROCEDURES
${input.votingProcedures}

33. VOTING RIGHTS
${input.votingRights}

34. PROXY VOTING
Every member entitled to attend and vote may appoint a proxy to attend and vote instead of them. A proxy need not be a member of the Company.

35. CHAIRMAN OF MEETINGS
The Chairman of the Board shall preside at general meetings. In their absence, the members present shall elect a chairman for the meeting.

36. RESOLUTIONS
• Ordinary resolutions require a simple majority of votes cast
• Special resolutions require not less than 75% of votes cast
• Written resolutions may be passed without a meeting if signed by all members entitled to vote`;
  }

  private generateDirectors(input: ArticlesOfAssociationUserInput): string {
    return `37. BOARD COMPOSITION
${input.boardComposition}

38. DIRECTOR POWERS
${input.directorPowers}

The Board shall have power to:
• Manage the business and affairs of the Company
• Make decisions on behalf of the Company
• Delegate powers to committees or individual directors
• Appoint and remove officers and employees
• Determine remuneration and benefits

39. DIRECTOR QUALIFICATIONS
${input.directorQualifications || 'Directors must be natural persons of at least 18 years of age and of sound mind.'}

40. DIRECTOR LIMITATIONS
${input.directorLimitations}

Directors shall not:
• Enter into contracts with the Company without disclosure
• Use Company property for personal benefit
• Compete with the Company's business
• Breach their fiduciary duties

41. APPOINTMENT OF DIRECTORS
${input.directorAppointmentProcedure}

42. REMOVAL OF DIRECTORS
${input.directorRemovalProcedure}

43. VACATION OF OFFICE
A director's office shall become vacant if they:
• Resign by notice in writing
• Become bankrupt or insolvent
• Are convicted of a criminal offense
• Become mentally incapacitated
• Are absent from three consecutive board meetings without excuse

44. DIRECTORS' REMUNERATION
The remuneration of directors shall be determined by ordinary resolution of the members or as the Board may determine within limits set by the members.

45. DIRECTORS' EXPENSES
Directors shall be entitled to reimbursement of reasonable expenses incurred in the performance of their duties.

46. CONFLICTS OF INTEREST
${input.conflictOfInterestRules || 'Directors must disclose any interest in transactions with the Company and may not vote on matters in which they have a material interest.'}`;
  }

  private generateBoardMeetings(input: ArticlesOfAssociationUserInput): string {
    return `47. BOARD MEETING PROCEDURES
${input.boardMeetingProcedures}

48. CALLING BOARD MEETINGS
Board meetings may be called by:
• The Chairman of the Board
• Any two directors
• The Company Secretary upon instruction

49. NOTICE OF BOARD MEETINGS
Unless otherwise agreed, not less than 7 days' notice of board meetings shall be given to all directors.

Notice may be given by:
• Written notice delivered personally or by post
• Electronic communication (email, fax)
• Telephone notice confirmed in writing

50. QUORUM FOR BOARD MEETINGS
The quorum for board meetings shall be one-third of the total number of directors or two directors, whichever is greater.

51. VOTING AT BOARD MEETINGS
Each director shall have one vote. Questions shall be decided by a majority of votes.

In case of equality of votes, the Chairman shall have a casting vote in addition to their deliberative vote.

52. PARTICIPATION BY TECHNOLOGY
Directors may participate in board meetings by telephone, video conference, or other electronic means that allow all participants to communicate simultaneously.

53. BOARD RESOLUTIONS
Written resolutions signed by all directors shall be as valid as if passed at a duly convened board meeting.

54. MINUTES
Minutes of all board meetings shall be kept and signed by the Chairman. Minutes shall record:
• Directors present and absent
• Decisions made and resolutions passed
• Any dissenting votes recorded

55. COMMITTEE DELEGATION
The Board may delegate any of its powers to committees consisting of such directors as they think fit, subject to such conditions as the Board may impose.

56. MANAGING DIRECTOR
The Board may appoint one or more Managing Directors and determine their powers, duties, and remuneration.`;
  }

  private generateDividends(input: ArticlesOfAssociationUserInput): string {
    return `57. DIVIDEND DECLARATION
${input.dividendDeclarationProcedure}

58. DIVIDEND RULES
${input.dividendRules}

59. PROFIT DISTRIBUTION
${input.profitDistribution}

60. DIVIDEND ENTITLEMENT
Dividends shall be paid to members according to the amounts paid up on their shares, unless otherwise provided in the terms of issue.

61. INTERIM DIVIDENDS
The Board may pay interim dividends if they are satisfied that the Company's financial position justifies such payment.

62. DIVIDEND PAYMENT
Dividends shall be paid:
• In cash unless otherwise resolved
• Within 30 days of declaration
• To the persons registered as holders at the date of declaration

63. UNCLAIMED DIVIDENDS
Dividends remaining unclaimed for 12 months may be invested or otherwise used by the Board until claimed.

64. NO INTEREST ON DIVIDENDS
No dividend shall bear interest against the Company.

${input.reserveFunds ? `65. RESERVE FUNDS
${input.reserveFunds}` : ''}

66. CAPITALIZATION OF PROFITS
The Company in general meeting may resolve to capitalize any undivided profits and distribute them among members as fully paid shares.`;
  }

  private generateAccountsAndAudit(input: ArticlesOfAssociationUserInput): string {
    return `67. ACCOUNTING RECORDS
${input.recordKeeping}

68. ACCOUNTING STANDARDS
${input.accountingStandards}

69. FINANCIAL REPORTING
${input.financialReporting}

70. AUDIT REQUIREMENTS
${input.auditRequirements}

71. ANNUAL FINANCIAL STATEMENTS
The Company shall prepare annual financial statements comprising:
• Statement of financial position
• Statement of comprehensive income
• Statement of changes in equity
• Statement of cash flows
• Notes to the financial statements

72. AUDITOR APPOINTMENT
Auditors shall be appointed at each Annual General Meeting to serve until the next Annual General Meeting.

73. AUDITOR REMUNERATION
The remuneration of auditors shall be fixed by the Company in general meeting or in such manner as the meeting may determine.

74. AUDITOR DUTIES
The auditors shall:
• Examine the Company's accounts and records
• Report to members on the annual financial statements
• Attend the Annual General Meeting
• Provide such other services as may be required

75. ACCESS TO RECORDS
Members shall have the right to inspect:
• The register of members
• Minutes of general meetings
• Annual financial statements
• Such other records as provided by law

76. BOOKS OF ACCOUNT
Proper books of account shall be kept at the registered office or such other place as the Board determines, and shall be open to inspection by directors at all times.`;
  }

  private generateNotices(input: ArticlesOfAssociationUserInput): string {
    return `77. SERVICE OF NOTICES
Any notice required to be given under these Articles may be served:
• Personally on the member
• By sending it through the post in a prepaid letter
• By electronic communication to the member's registered address
• By publication in a newspaper circulating in Kenya

78. NOTICE PERIODS
Unless otherwise specified:
• Not less than 14 days' notice shall be given for general meetings
• Not less than 21 days' notice shall be given for meetings to consider special resolutions
• Not less than 7 days' notice shall be given for board meetings

79. CALCULATION OF NOTICE
In calculating notice periods:
• The day of service and the day of the meeting shall be excluded
• Sundays and public holidays shall be included
• Notice by post shall be deemed served 48 hours after posting

80. WAIVER OF NOTICE
Any member may waive their right to notice of any meeting, either before or after the meeting.

81. ACCIDENTAL OMISSION
The accidental omission to give notice to any member, or the non-receipt of notice by any member, shall not invalidate proceedings at any meeting.

82. NOTICE TO JOINT HOLDERS
Notice given to the first-named joint holder shall be sufficient notice to all joint holders.

83. NOTICE WHERE ADDRESS UNKNOWN
If a member's address is unknown, notice may be given by displaying it prominently at the registered office for at least 48 hours before the meeting.`;
  }

  private generateIndemnity(input: ArticlesOfAssociationUserInput): string {
    const indemnityProvisions = input.indemnityProvisions || 'The Company shall indemnify directors and officers against liabilities incurred in the proper performance of their duties.';
    
    return `84. INDEMNIFICATION OF DIRECTORS
${indemnityProvisions}

85. SCOPE OF INDEMNITY
The Company may indemnify any director or officer against:
• Liability incurred in defending proceedings where judgment is given in their favor
• Liability incurred in connection with proceedings in which relief is granted by the court
• Reasonable legal costs incurred in defending proceedings

86. LIMITATIONS ON INDEMNITY
The Company shall not indemnify any person against:
• Liability to the Company or its members
• Costs incurred in defending criminal proceedings where convicted
• Costs incurred in defending civil proceedings where judgment is given against them
• Fines imposed in criminal proceedings

87. INSURANCE
The Company may purchase and maintain insurance for any director or officer against:
• Liability incurred in their capacity as director or officer
• Costs incurred in defending proceedings
• Such other matters as the Board may determine

88. ADVANCEMENT OF EXPENSES
The Company may advance expenses to directors and officers for legal proceedings, subject to:
• Written undertaking to repay if not entitled to indemnification
• Determination that the person acted in good faith
• Board authorization of such advancement

89. SURVIVAL OF INDEMNIFICATION
The indemnification provisions shall survive:
• Amendment of these Articles
• Resignation or removal of directors/officers
• Dissolution of the Company

90. NON-EXCLUSIVITY
The indemnification provisions are not exclusive of other rights to which directors and officers may be entitled.`;
  }

  private generateWindingUp(input: ArticlesOfAssociationUserInput): string {
    return `91. WINDING UP PROCEDURES
${input.windingUpProcedures}

92. DISTRIBUTION OF ASSETS
${input.assetDistribution}

93. VOLUNTARY WINDING UP
The Company may be wound up voluntarily by:
• Special resolution of members
• Resolution passed after the Company has resolved it cannot continue by reason of its liabilities
• Resolution passed as provided in the Articles

94. LIQUIDATOR APPOINTMENT
In the event of winding up, a liquidator shall be appointed by:
• Ordinary resolution of members in voluntary winding up
• The court in compulsory winding up
• Such other manner as provided by law

95. LIQUIDATOR POWERS
The liquidator shall have power to:
• Realize the assets of the Company
• Pay the debts and liabilities
• Distribute the surplus among members
• Take such other actions as necessary for winding up

96. DISTRIBUTION IN SPECIE
The liquidator may, with the authority of a special resolution:
• Divide among members in specie any part of the Company's assets
• Set a valuation on assets to be divided
• Determine how the division shall be carried out

97. PRIORITY OF PAYMENTS
In winding up, the assets shall be applied in the following order:
• Costs and expenses of winding up
• Debts and liabilities of the Company
• Return of capital to members
• Distribution of surplus among members according to their rights

98. UNCLAIMED ASSETS
Any monies or assets not claimed within 6 years of the date of winding up shall be donated to such charitable organization as the liquidator may determine.

99. FINAL MEETING
Upon completion of the winding up, the liquidator shall call a final meeting of members to present the final account and report on the winding up.`;
  }

  private generateSignatures(input: ArticlesOfAssociationUserInput): string {
    // Handle both specific field names and generic field names for backward compatibility
    const companyName = input.companyName || (input as any).party1Name || 'Company Name';
    
    return `ADOPTION OF ARTICLES

These Articles of Association were adopted by the Company on ${input.effectiveDate}.

FOUNDING MEMBERS:

The undersigned, being the founding members of ${companyName}, hereby adopt these Articles of Association:

Member 1:
_______________________
Name: _________________
Address: _______________
Shares: ________________
Date: _______________

Member 2:
_______________________
Name: _________________
Address: _______________
Shares: ________________
Date: _______________

Member 3:
_______________________
Name: _________________
Address: _______________
Shares: ________________
Date: _______________

WITNESSES:

Witness 1:
_______________________
Name: _________________
Address: _______________
Date: _______________

Witness 2:
_______________________
Name: _________________
Address: _______________
Date: _______________

COMPANY SECRETARY:

_______________________
Name: _________________
Company Secretary
Date: _______________

CERTIFICATE OF COMPLIANCE

I certify that these Articles of Association comply with the requirements of the Companies Act, 2015 of the Republic of Kenya and have been duly adopted by the Company.

_______________________
Company Secretary
Date: _______________`;
  }
}