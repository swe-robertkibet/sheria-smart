// Test script to verify Distribution Agreement end-to-end functionality

const testDistributionAgreement = async () => {
  const distributionAgreementData = {
    documentType: "DISTRIBUTION_AGREEMENT",
    userInput: {
      // Principal/Supplier Information
      principalName: "TechCorp Manufacturing Ltd.",
      principalAddress: "1234 Industrial Boulevard\nSuite 200\nNairobi, Kenya\nP.O. Box 12345-00100",
      principalBusinessRegistration: "BRS123456789",
      principalEmail: "info@techcorp.co.ke",
      principalPhone: "+254712345678",
      
      // Distributor Information
      distributorName: "EastAfrica Distribution Services",
      distributorAddress: "567 Commerce Street\nFloor 3, Block A\nMombasa, Kenya\nP.O. Box 67890-80100",
      distributorBusinessRegistration: "BRS987654321",
      distributorEmail: "sales@eastafricadist.com",
      distributorPhone: "+254798765432",
      
      // Distribution Terms
      territoryDefinition: "East Africa region including Kenya, Uganda, and Tanzania",
      productSpecifications: "Consumer electronics including smartphones, tablets, laptops, and accessories",
      exclusivityType: "exclusive",
      minimumSalesTargets: "Minimum annual sales quota of $500,000 USD with quarterly targets of $125,000",
      
      // Financial Terms
      commissionStructure: "15% commission on net sales with volume bonuses: 17% for sales above $750K, 20% for sales above $1M",
      marginStructure: "Standard retail markup of 40-60% depending on product category",
      paymentTerms: "90-day payment terms with 2% early payment discount for payments within 30 days",
      
      // Obligations
      marketingObligations: "Distributor responsible for local advertising, trade shows, and digital marketing. Minimum marketing spend of 3% of annual sales",
      distributorObligations: "Maintain adequate inventory, provide customer support, warranty service, and technical assistance",
      principalObligations: "Provide product training, marketing materials, technical documentation, and prompt order fulfillment",
      
      // Term and Performance
      agreementTerm: "Initial term of 3 years with automatic renewal for additional 2-year periods",
      performanceMetrics: "Quarterly sales reviews, customer satisfaction scores above 85%, and timely payment compliance",
      terminationConditions: "Either party may terminate with 6-month written notice. Immediate termination for material breach",
      
      // Intellectual Property
      trademarkUsage: "Distributor granted limited license to use TechCorp trademarks strictly for authorized distribution activities",
      intellectualPropertyRights: "All intellectual property remains with TechCorp. Distributor may not reverse engineer or modify products",
      
      // Basic fields
      effectiveDate: "2025-01-15",
      additionalTerms: "This agreement shall be governed by Kenyan law. Any disputes shall be resolved through arbitration in Nairobi."
    },
    backstory: "Generate a comprehensive Distribution Agreement between TechCorp Manufacturing Ltd. and EastAfrica Distribution Services for the exclusive distribution of consumer electronics in East Africa.",
    formats: ["PDF", "DOCX"],
    emailAddress: "info@techcorp.co.ke"
  };

  try {
    console.log('Testing Distribution Agreement generation...');
    console.log('Request data:', JSON.stringify(distributionAgreementData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/documents/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(distributionAgreementData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('HTTP Error:', response.status, errorData);
      return;
    }

    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.status === 'FAILED' || (result.message && result.message.includes('Validation failed:'))) {
      console.error('❌ VALIDATION FAILED:', result.message);
    } else {
      console.log('✅ SUCCESS:', result.message || 'Document generation initiated');
      console.log('Request ID:', result.requestId);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
};

// Run the test
testDistributionAgreement();