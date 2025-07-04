import express from 'express';
import { GeminiService } from '../services/gemini';
import { StructuredGeminiService } from '../services/structured-gemini';
import DatabaseService from '../services/database';

const router = express.Router();
const structuredGeminiService = new StructuredGeminiService();

// Create a new chat session
router.post('/session', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await DatabaseService.createChatSession(userId);
    res.json({ 
      sessionId: session.id,
      debug: 'BACKEND_UPDATED_WITH_CHANGES' // This will confirm if backend is restarting
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Send a message and get AI response (basic mode)
// router.post('/send', async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;

//     if (!sessionId || !message) {
//       return res.status(400).json({ error: 'Missing sessionId or message' });
//     }

//     // Get conversation history
//     const history = await DatabaseService.getMessageHistory(sessionId, 5);
//     const conversationHistory = history.reverse().map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));

//     // Save user message
//     await DatabaseService.addMessage(sessionId, message, 'USER');

//     // Generate AI response
//     const aiResponse = await geminiService.generateResponse(message, conversationHistory);

//     // Save AI response
//     await DatabaseService.addMessage(sessionId, aiResponse, 'ASSISTANT');

//     res.json({
//       response: aiResponse,
//       sessionId,
//     });
//   } catch (error) {
//     console.error('Error processing chat message:', error);
//     res.status(500).json({ error: 'Failed to process message' });
//   }
// });

// Send a message and get streaming AI response
router.post('/send-stream', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Set headers for streaming response
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Get conversation history
    const history = await DatabaseService.getMessageHistory(sessionId, 5);
    const conversationHistory = history.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Save user message
    await DatabaseService.addMessage(sessionId, message, 'USER');

    // Generate streaming AI response
    const geminiService = new GeminiService();
    let fullResponse = '';
    
    for await (const chunk of geminiService.generateStreamingResponse(message, conversationHistory)) {
      fullResponse += chunk;
      res.write(chunk);
    }
    
    // Save complete AI response
    await DatabaseService.addMessage(sessionId, fullResponse, 'ASSISTANT');
    res.end();
    
  } catch (error) {
    console.error('Error processing streaming chat message:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process streaming message' });
    } else {
      res.write('\n\nError: Failed to process streaming message');
      res.end();
    }
  }
});

// Send a message and get structured AI response
router.post('/send-structured', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Get conversation history
    const history = await DatabaseService.getMessageHistory(sessionId, 5);
    const conversationHistory = history.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Save user message
    await DatabaseService.addMessage(sessionId, message, 'USER');

    // Generate structured AI response
    const { classification, advice } = await structuredGeminiService.generateFullResponse(message, conversationHistory);

    // Save structured response as JSON string
    const structuredResponse = JSON.stringify(advice);
    await DatabaseService.addMessage(sessionId, structuredResponse, 'ASSISTANT');

    res.json({
      classification,
      advice,
      sessionId,
    });
  } catch (error) {
    console.error('Error processing structured chat message:', error);
    res.status(500).json({ error: 'Failed to process structured message' });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await DatabaseService.getChatSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.id,
      messages: session.messages,
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;