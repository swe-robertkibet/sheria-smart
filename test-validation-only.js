// Test script to verify validation logic for Distribution Agreement

const { DocumentValidators } = require('./backend/src/validators/document-validators');
const { DocumentType } = require('./backend/src/types/document');

const distributionAgreementInput = {
  // Required fields from validation
  principalName: "TechCorp Manufacturing Ltd.",
  principalAddress: "1234 Industrial Boulevard\nSuite 200\nNairobi, Kenya\nP.O. Box 12345-00100",
  principalEmail: "info@techcorp.co.ke",
  principalBusinessRegistration: "BRS123456789",
  distributorName: "EastAfrica Distribution Services",
  distributorAddress: "567 Commerce Street\nFloor 3, Block A\nMombasa, Kenya\nP.O. Box 67890-80100",
  distributorEmail: "sales@eastafricadist.com",
  distributorBusinessRegistration: "BRS987654321",
  territoryDefinition: "East Africa region including Kenya, Uganda, and Tanzania",
  productSpecifications: "Consumer electronics including smartphones, tablets, laptops, and accessories",
  exclusivityType: "exclusive",
  minimumSalesTargets: "Minimum annual sales quota of $500,000 USD",
  commissionStructure: "15% commission on net sales",
  marketingObligations: "Distributor responsible for local advertising and marketing",
  agreementTerm: "Initial term of 3 years",
  effectiveDate: "2025-01-15",
  
  // Optional fields
  principalPhone: "+254712345678",
  distributorPhone: "+254798765432",
  marginStructure: "Standard retail markup of 40-60%",
  paymentTerms: "90-day payment terms",
  distributorObligations: "Maintain inventory and customer support",
  principalObligations: "Provide training and materials",
  performanceMetrics: "Quarterly sales reviews",
  terminationConditions: "6-month notice period",
  trademarkUsage: "Limited license for authorized activities",
  intellectualPropertyRights: "All IP remains with TechCorp",
  additionalTerms: "Governed by Kenyan law"
};

console.log('Testing Distribution Agreement validation...');
console.log('Input data keys:', Object.keys(distributionAgreementInput));

try {
  const validation = DocumentValidators.validateDistributionAgreementInput(distributionAgreementInput);
  
  console.log('\n=== VALIDATION RESULT ===');
  console.log('Valid:', validation.isValid);
  console.log('Errors:', validation.errors);
  
  if (validation.isValid) {
    console.log('✅ All required fields are present and valid!');
  } else {
    console.log('❌ Validation failed:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }
  
} catch (error) {
  console.error('❌ Error running validation:', error.message);
}