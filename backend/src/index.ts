import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat';
import authRoutes from './routes/auth';
import documentsRoutes from './routes/documents';
import adminRoutes from './routes/admin';
import DatabaseService from './services/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}, gracefully shutting down...`);
  
  // Close server first to stop accepting new connections
  server.close(async (err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
    } else {
      console.log('Server closed.');
    }
    
    try {
      // Close database connections
      await DatabaseService.disconnect();
      console.log('Database connections closed.');
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
    
    console.log('Graceful shutdown complete.');
    process.exit(err ? 1 : 0);
  });
  
  // Force exit after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit...');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));