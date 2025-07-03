// Simple test script to verify chat functionality
const fetch = require('node-fetch');

async function testChat() {
  try {
    // Create a chat session
    console.log('Creating chat session...');
    const sessionResponse = await fetch('http://localhost:5000/api/chat/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const sessionData = await sessionResponse.json();
    console.log('Session created:', sessionData);
    
    // Send a test message
    console.log('Sending test message...');
    const messageResponse = await fetch('http://localhost:5000/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionData.sessionId,
        message: 'What are tenant rights in Kenya?',
      }),
    });
    
    const messageData = await messageResponse.json();
    console.log('AI Response:', messageData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testChat();