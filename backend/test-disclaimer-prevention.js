const DocumentGeneratorService = require('./src/services/document-generator').default;
const { DocumentFormat } = require('./src/types/document');

// Test data with attempt to inject disclaimer text
const testUserInput = {
  disclosingPartyName: "LogicSoft SA",
  disclosingPartyAddress: "Johannesburg, South Africa",
  disclosingPartyEmail: "contact@logicsoft.com",
  disclosingPartyPhone: "+254 712 367 783",
  
  receivingPartyName: "Robert Kibet",
  receivingPartyAddress: "Faith st, Eldoret, 30100",
  receivingPartyEmail: "swe.robertkibet@gmail.com",
  receivingPartyPhone: "+254 714 200 683",
  
  purposeOfDisclosure: "software development and business collaboration",
  specificConfidentialInfo: "software codebase, business plans, financial information, customer lists, and marketing strategies",
  agreementDuration: "2 years",
  isPerperual: false,
  effectiveDate: "2025-08-07",
  
  additionalTerms: "",
  governingState: "Republic of Kenya"
};

const backstory = "The Disclosing Party is engaged in the business of software development and possesses certain confidential and proprietary information relating to its software and business plan;";

// Test content that includes disclaimer text that should be stripped
const testContentWithDisclaimer = {
  title: "NON-DISCLOSURE AGREEMENT",
  
  recitals: `WHEREAS, LogicSoft SA ("Disclosing Party") possesses certain confidential and proprietary information related to software development and business collaboration; and WHEREAS, Robert Kibet ("Receiving Party") desires to receive such confidential information for the purpose of ${backstory}; and WHEREAS, both parties wish to protect the confidentiality of such information under the laws of the Republic of Kenya;`,
  
  definitions: `For the purposes of this Agreement: (a) "Confidential Information" means software codebase, business plans, financial information, customer lists, and marketing strategies and any other technical, business, or proprietary information disclosed by the Disclosing Party; (b) "Disclosing Party" means LogicSoft SA; (c) "Receiving Party" means Robert Kibet; (d) "Purpose" means software development and business collaboration.`,
  
  confidentialityObligations: `The Receiving Party agrees to: (a) maintain the confidentiality of all Confidential Information; (b) not disclose Confidential Information to any third parties without prior written consent; (c) use reasonable care to protect the confidentiality of such information; (d) limit access to Confidential Information to authorized personnel only; (e) return or destroy all Confidential Information upon request or termination of this Agreement.`,
  
  permittedUses: `The Receiving Party may use Confidential Information solely for the Purpose as defined herein. Any other use requires express written permission from the Disclosing Party.`,
  
  exclusions: `This Agreement shall not apply to information that: (a) is or becomes publicly available through no breach of this Agreement; (b) is rightfully known by the Receiving Party prior to disclosure; (c) is independently developed by the Receiving Party without use of Confidential Information; (d) is required to be disclosed by law or court order.`,
  
  termDuration: `This Agreement shall remain in effect for 2 years from the Effective Date, unless earlier terminated by mutual consent of the parties.`,
  
  remediesAndEnforcement: `The Receiving Party acknowledges that breach of this Agreement may cause irreparable harm to the Disclosing Party. Therefore, the Disclosing Party shall be entitled to seek injunctive relief and monetary damages in the courts of Kenya. The prevailing party shall be entitled to reasonable attorney's fees and costs.`,
  
  generalProvisions: `This Agreement constitutes the entire agreement between the parties regarding the subject matter herein. Any modifications must be in writing and signed by both parties. If any provision is deemed unenforceable, the remainder shall remain in effect. All notices shall be in writing and delivered to the addresses specified herein.`,
  
  governingLaw: `This Agreement shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts of Kenya.`,
  
  // This signature section contains disclaimer text that MUST be removed
  signatures: `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\\n\\nDISCLOSING PARTY:\\n\\nSignature: _____________________\\nName: LogicSoft SA\\nTitle: _____________________\\nDate: ___________\\n\\n\\nRECEIVING PARTY:\\n\\nSignature: _____________________\\nName: Robert Kibet\\nTitle: _____________________\\nDate: ___________\\n\\n\\nWITNESS:\\n\\nSignature: _____________________\\nName: _____________________\\nTitle: _____________________\\nDate: ___________\\n\\nIMPORTANT NOTICE: This document is generated for informational purposes only and does not constitute legal advice. It is strongly recommended that both parties seek independent legal counsel from qualified Kenyan attorneys before executing this agreement.`
};

async function testDisclaimerPrevention() {
  console.log('🔒 Testing disclaimer prevention safeguards...');
  
  try {
    console.log('1. Testing content with intentional disclaimer text...');
    
    // Test document generation with content containing disclaimer
    const filePaths = await DocumentGeneratorService.generateNDA(
      testUserInput,
      testContentWithDisclaimer,
      [DocumentFormat.PDF]
    );
    
    console.log('Generated test file:', filePaths[0]);
    
    // Check if the generated content contains disclaimer text
    const fs = require('fs');
    const pdfBytes = fs.readFileSync(filePaths[0]);
    const pdfContent = pdfBytes.toString('utf8');
    
    // Check for disclaimer patterns
    const disclaimerPatterns = [
      'IMPORTANT NOTICE',
      'informational purposes only',
      'does not constitute legal advice',
      'seek independent legal counsel',
      'qualified Kenyan attorneys'
    ];
    
    let disclaimerFound = false;
    for (const pattern of disclaimerPatterns) {
      if (pdfContent.toLowerCase().includes(pattern.toLowerCase())) {
        console.error('❌ CRITICAL: Disclaimer text found in PDF:', pattern);
        disclaimerFound = true;
      }
    }
    
    if (!disclaimerFound) {
      console.log('✅ SUCCESS: No disclaimer text found in generated PDF');
      console.log('✅ All disclaimer prevention safeguards working correctly');
    }
    
    // Test signature lines are preserved
    if (pdfContent.includes('_____________________')) {
      console.log('✅ SUCCESS: Signature lines preserved');
    } else {
      console.error('❌ ERROR: Signature lines missing');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDisclaimerPrevention();