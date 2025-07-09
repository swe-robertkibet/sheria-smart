import express from 'express';
import { GeminiService } from '../services/gemini';
import { StructuredGeminiService } from '../services/structured-gemini';
import DatabaseService from '../services/database';
import TitleGeneratorService from '../services/title-generator';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
const structuredGeminiService = new StructuredGeminiService();

/**
 * DEPRECATED: Old session creation endpoint - removed in new architecture
 * Sessions are now created only when the first message is sent
 */

// Search chat sessions - MUST come before /sessions
router.get('/sessions/search', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { q: query, limit = '10', chatType } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const sessions = await DatabaseService.searchChatSessions(
      req.user.userId,
      query,
      parseInt(limit as string),
      chatType as 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS'
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

    const { limit = '20', cursor, chatType } = req.query;
    const sessions = await DatabaseService.getArchivedChats(
      req.user.userId,
      parseInt(limit as string),
      cursor as string,
      chatType as 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS'
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

    const { limit = '20', cursor, chatType } = req.query;
    const sessions = await DatabaseService.getUserChatSessions(
      req.user.userId,
      parseInt(limit as string),
      cursor as string,
      chatType as 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS'
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

/**
 * NEW ARCHITECTURE: Send a message and get streaming AI response
 * This endpoint now handles session creation with the first message
 */
router.post('/send-stream', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    console.log('🔍 [DEBUG] /send-stream endpoint hit:', {
      timestamp: new Date().toISOString(),
      userId: req.user?.userId,
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent'],
        'origin': req.headers.origin,
        'referer': req.headers.referer
      }
    });

    if (!req.user) {
      console.error('🚨 [ERROR] User not authenticated in /send-stream');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { sessionId, message } = req.body;

    console.log('🔍 [DEBUG] Request validation:', {
      hasSessionId: !!sessionId,
      sessionId,
      hasMessage: !!message,
      messageType: typeof message,
      messageLength: message?.length,
      messagePreview: message?.substring(0, 100) + (message?.length > 100 ? '...' : '')
    });

    if (!message) {
      console.error('🚨 [ERROR] Message is required but not provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    if (typeof message !== 'string') {
      console.error('🚨 [ERROR] Message must be a string, got:', typeof message);
      return res.status(400).json({ error: 'Message must be a string' });
    }

    if (message.trim().length === 0) {
      console.error('🚨 [ERROR] Message cannot be empty');
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let currentSessionId = sessionId;
    let conversationHistory: Array<{role: string, content: string}> = [];

    // If sessionId is provided, load existing conversation
    if (sessionId) {
      console.log('🔍 [DEBUG] Loading existing session:', sessionId);
      const session = await DatabaseService.getChatSession(sessionId);
      console.log('🔍 [DEBUG] Session found:', {
        exists: !!session,
        userId: session?.userId,
        currentUserId: req.user.userId,
        match: session?.userId === req.user.userId
      });
      
      if (!session || session.userId !== req.user.userId) {
        console.error('🚨 [ERROR] Access denied to session:', sessionId);
        return res.status(403).json({ error: 'Access denied to this chat session' });
      }
      
      // Get conversation history
      const history = await DatabaseService.getMessageHistory(sessionId, 5);
      console.log('🔍 [DEBUG] Loaded conversation history:', {
        messageCount: history.length,
        lastMessage: history[0]?.content?.substring(0, 50) + '...'
      });
      
      conversationHistory = history.reverse().map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    }

    // Generate streaming AI response
    console.log('🔍 [DEBUG] Starting AI response generation');
    const geminiService = new GeminiService();
    let fullResponse = '';
    
    try {
      for await (const chunk of geminiService.generateStreamingResponse(message, conversationHistory)) {
        fullResponse += chunk;
        res.write(chunk);
      }
      console.log('🔍 [DEBUG] AI response generated:', {
        responseLength: fullResponse.length,
        responsePreview: fullResponse.substring(0, 100) + '...'
      });
    } catch (error) {
      console.error('🚨 [ERROR] Error during AI response generation:', error);
      throw error;
    }

    // NEW ARCHITECTURE: Create session with first message if this is the first message
    if (!currentSessionId) {
      console.log('🔍 [DEBUG] Creating new session with first message...');
      
      try {
        // Generate title for the session
        const title = await TitleGeneratorService.generateChatTitle(message);
        console.log('🔍 [DEBUG] Generated title:', title);
        
        // Create session with both messages atomically
        const session = await DatabaseService.createChatSessionWithFirstMessage(
          req.user.userId,
          'QUICK_CHAT',
          title,
          message,
          fullResponse
        );
        
        currentSessionId = session.id;
        console.log('🔍 [DEBUG] Created session:', currentSessionId);
        
        // Write session ID to stream for frontend to pick up
        res.write(`\n__SESSION_ID__:${currentSessionId}\n`);
      } catch (error) {
        console.error('🚨 [ERROR] Error creating session:', error);
        throw error;
      }
    } else {
      console.log('🔍 [DEBUG] Adding messages to existing session:', currentSessionId);
      try {
        // Add messages to existing session
        await DatabaseService.addMessage(currentSessionId, message, 'USER');
        await DatabaseService.addMessage(currentSessionId, fullResponse, 'ASSISTANT');
        console.log('🔍 [DEBUG] Messages added to existing session');
      } catch (error) {
        console.error('🚨 [ERROR] Error adding messages to session:', error);
        throw error;
      }
    }
    
    res.end();
    
  } catch (error) {
    console.error('🚨 [ERROR] Error processing streaming chat message:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString(),
      userId: req.user?.userId,
      sessionId: req.body?.sessionId,
      messageLength: req.body?.message?.length
    });
    
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process streaming message' });
    } else {
      res.write('\n\nError: Failed to process streaming message');
      res.end();
    }
  }
});

/**
 * NEW ARCHITECTURE: Send a message and get structured AI response
 * This endpoint now handles session creation with the first message
 */
router.post('/send-structured', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { sessionId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let currentSessionId = sessionId;
    let conversationHistory: Array<{role: string, content: string}> = [];

    // If sessionId is provided, load existing conversation
    if (sessionId) {
      const session = await DatabaseService.getChatSession(sessionId);
      if (!session || session.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied to this chat session' });
      }
      
      // Get conversation history
      const history = await DatabaseService.getMessageHistory(sessionId, 5);
      conversationHistory = history.reverse().map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    }

    // Generate structured AI response
    const { classification, advice } = await structuredGeminiService.generateFullResponse(message, conversationHistory);

    // NEW ARCHITECTURE: Create session with first message if this is the first message
    if (!currentSessionId) {
      console.log('Creating new structured session with first message...');
      
      // Generate title for the session
      const title = await TitleGeneratorService.generateChatTitle(message);
      console.log('Generated title:', title);
      
      // Save structured response as JSON string
      const structuredResponse = JSON.stringify(advice);
      
      // Create session with both messages atomically
      const session = await DatabaseService.createChatSessionWithFirstMessage(
        req.user.userId,
        'STRUCTURED_ANALYSIS',
        title,
        message,
        structuredResponse
      );
      
      currentSessionId = session.id;
      console.log('Created structured session:', currentSessionId);
    } else {
      // Add messages to existing session
      await DatabaseService.addMessage(currentSessionId, message, 'USER');
      const structuredResponse = JSON.stringify(advice);
      await DatabaseService.addMessage(currentSessionId, structuredResponse, 'ASSISTANT');
    }

    res.json({
      classification,
      advice,
      sessionId: currentSessionId,
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