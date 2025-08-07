const DocumentGeneratorService = require('./src/services/document-generator').default;
const { DocumentFormat } = require('./src/types/document');

// Test data
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

const backstory = "The Disclosing Party is engaged in the business of software development and possesses certain confidential and proprietary information relating to its software and business plan; and WHEREAS, the Disclosing Party has employed the Receiving Party as a software engineer, in connection with such employment, the Receiving Party will have access to the Disclosing Party's Confidential Information; and WHEREAS, the Disclosing Party desires to protect the confidentiality of its Confidential Information, and the Receiving Party is willing to agree to maintain the confidentiality of such information.";

async function testDocumentGeneration() {
  console.log('Testing document generation...');
  
  try {
    // Create mock generated content without AI service
    console.log('1. Creating test content...');
    const generatedContent = {
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
      
      signatures: `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\\n\\nDISCLOSING PARTY:\\n\\nSignature: _____________________\\nName: LogicSoft SA\\nTitle: _____________________\\nDate: ___________\\n\\n\\nRECEIVING PARTY:\\n\\nSignature: _____________________\\nName: Robert Kibet\\nTitle: _____________________\\nDate: ___________\\n\\n\\nWITNESS:\\n\\nSignature: _____________________\\nName: _____________________\\nTitle: _____________________\\nDate: ___________`
    };
    
    console.log('Generated content preview:');
    console.log('Title:', generatedContent.title);
    console.log('Signatures preview:', generatedContent.signatures.substring(0, 200) + '...');
    
    // Test document generation
    console.log('2. Testing PDF and DOCX generation...');
    const filePaths = await DocumentGeneratorService.generateNDA(
      testUserInput,
      generatedContent,
      [DocumentFormat.PDF, DocumentFormat.DOCX]
    );
    
    console.log('Generated files:');
    filePaths.forEach(path => console.log(' -', path));
    
    console.log('✅ Document generation test completed successfully!');
    console.log('Check the generated documents to verify formatting improvements.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testDocumentGeneration();