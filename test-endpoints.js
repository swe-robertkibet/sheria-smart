const fetch = require('node-fetch');

async function testEndpoints() {
  console.log('Testing chat endpoints...');
  
  // Test health endpoint
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
  
  // Test session creation (should fail due to auth)
  try {
    const sessionResponse = await fetch('http://localhost:5000/api/chat/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatType: 'QUICK_CHAT' }),
    });
    
    const sessionData = await sessionResponse.json();
    console.log('Session creation (no auth):', sessionData);
  } catch (error) {
    console.error('Session creation failed:', error.message);
  }
  
  // Test sessions endpoint (should fail due to auth)
  try {
    const sessionsResponse = await fetch('http://localhost:5000/api/chat/sessions');
    const sessionsData = await sessionsResponse.json();
    console.log('Sessions endpoint (no auth):', sessionsData);
  } catch (error) {
    console.error('Sessions endpoint failed:', error.message);
  }
}

testEndpoints();