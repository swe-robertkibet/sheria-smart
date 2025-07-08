import express from 'express';
import { GeminiService } from '../services/gemini';
import { StructuredGeminiService } from '../services/structured-gemini';
import DatabaseService from '../services/database';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const structuredGeminiService = new StructuredGeminiService();

// Create a new chat session
router.post('/session', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { chatType = 'QUICK_CHAT' } = req.body;
    const session = await DatabaseService.createChatSession(req.user.userId, chatType);
    res.json({ 
      sessionId: session.id,
      chatType: session.chatType
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Search chat sessions - MUST come before /sessions
router.get('/sessions/search', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { q: query, limit = '10' } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const sessions = await DatabaseService.searchChatSessions(
      req.user.userId,
      query,
      parseInt(limit as string)
    );

    res.json({ sessions });
  } catch (error) {
    console.error('Error searching chat sessions:', error);
    res.status(500).json({ error: 'Failed to search chat sessions' });
  }
});

// Get archived chats - MUST come before /sessions
router.get('/sessions/archived', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { limit = '20', cursor } = req.query;
    const sessions = await DatabaseService.getArchivedChats(
      req.user.userId,
      parseInt(limit as string),
      cursor as string
    );

    res.json({
      sessions,
      hasMore: sessions.length === parseInt(limit as string),
      nextCursor: sessions.length > 0 ? sessions[sessions.length - 1].updatedAt.toISOString() : null
    });
  } catch (error) {
    console.error('Error fetching archived chats:', error);
    res.status(500).json({ error: 'Failed to fetch archived chats' });
  }
});

// Get user's chat sessions with pagination
router.get('/sessions', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { limit = '20', cursor } = req.query;
    const sessions = await DatabaseService.getUserChatSessions(
      req.user.userId,
      parseInt(limit as string),
      cursor as string
    );

    res.json({
      sessions,
      hasMore: sessions.length === parseInt(limit as string),
      nextCursor: sessions.length > 0 ? sessions[sessions.length - 1].updatedAt.toISOString() : null
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// Update chat title
router.put('/sessions/:id/title', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(id);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    const updatedSession = await DatabaseService.updateChatTitle(id, title.trim());
    res.json({ 
      sessionId: updatedSession.id,
      title: updatedSession.title
    });
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
});

// Archive a chat session
router.put('/sessions/:id/archive', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(id);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    const archivedSession = await DatabaseService.archiveChat(id);
    res.json({ 
      sessionId: archivedSession.id,
      isArchived: archivedSession.isArchived
    });
  } catch (error) {
    console.error('Error archiving chat session:', error);
    res.status(500).json({ error: 'Failed to archive chat session' });
  }
});

// Delete a chat session
router.delete('/sessions/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(id);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    await DatabaseService.deleteChat(id);
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ error: 'Failed to delete chat session' });
  }
});

// Get chat preview
router.get('/sessions/:id/preview', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const preview = await DatabaseService.getChatPreview(id);
    
    if (!preview) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(id);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    res.json(preview);
  } catch (error) {
    console.error('Error fetching chat preview:', error);
    res.status(500).json({ error: 'Failed to fetch chat preview' });
  }
});

// Get chat summary
router.get('/sessions/:id/summary', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const summary = await DatabaseService.getChatSummary(id);
    
    if (!summary) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(id);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    res.json(summary);
  } catch (error) {
    console.error('Error fetching chat summary:', error);
    res.status(500).json({ error: 'Failed to fetch chat summary' });
  }
});


// Get paginated messages for a chat session
router.get('/sessions/:id/messages', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { id } = req.params;
    const { limit = '50', cursor } = req.query;

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(id);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    const messages = await DatabaseService.getMessagesPaginated(
      id,
      parseInt(limit as string),
      cursor ? parseInt(cursor as string) : undefined
    );

    res.json({
      messages,
      hasMore: messages.length === parseInt(limit as string),
      nextCursor: messages.length > 0 ? messages[messages.length - 1].msgCursor : null
    });
  } catch (error) {
    console.error('Error fetching paginated messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
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
router.post('/send-stream', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(sessionId);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
    }

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

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
router.post('/send-structured', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Verify the session belongs to the authenticated user
    const session = await DatabaseService.getChatSession(sessionId);
    if (!session || session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
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
router.get('/history/:sessionId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { sessionId } = req.params;
    const session = await DatabaseService.getChatSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify the session belongs to the authenticated user
    if (session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied to this chat session' });
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