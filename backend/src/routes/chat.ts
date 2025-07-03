import express from 'express';
import { GeminiService } from '../services/gemini';
import DatabaseService from '../services/database';

const router = express.Router();
const geminiService = new GeminiService();

// Create a new chat session
router.post('/session', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await DatabaseService.createChatSession(userId);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Send a message and get AI response
router.post('/send', async (req, res) => {
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

    // Generate AI response
    const aiResponse = await geminiService.generateResponse(message, conversationHistory);

    // Save AI response
    await DatabaseService.addMessage(sessionId, aiResponse, 'ASSISTANT');

    res.json({
      response: aiResponse,
      sessionId,
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
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