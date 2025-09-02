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

// Environment variable validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GEMINI_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'BACKEND_URL',
  'FRONTEND_URL'
];

const conditionalEnvVars = [
  { var: 'SMTP_HOST', condition: 'EMAIL_ENABLED' },
  { var: 'SMTP_USER', condition: 'EMAIL_ENABLED' },
  { var: 'SMTP_PASS', condition: 'EMAIL_ENABLED' }
];

function validateEnvironment() {
  const missing: string[] = [];
  
  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  // Check conditional variables (if email is enabled)
  if (process.env.EMAIL_ENABLED === 'true') {
    for (const { var: envVar } of conditionalEnvVars) {
      if (!process.env[envVar]) {
        missing.push(`${envVar} (required when EMAIL_ENABLED=true)`);
      }
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  console.log('✅ Environment validation passed');
}

validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Production Middleware
if (process.env.NODE_ENV === 'production') {
  // Security headers for production
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });
  
  // Trust proxy in production (for cPanel/shared hosting)
  app.set('trust proxy', true);
}

// CORS Configuration
const corsOrigins = process.env.FRONTEND_URL ? 
  [process.env.FRONTEND_URL, process.env.FRONTEND_URL.replace('http://', 'https://'), process.env.FRONTEND_URL.replace('https://', 'http://')] :
  ['http://localhost:3000', 'https://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware with limits
app.use(express.json({ 
  limit: process.env.MAX_JSON_SIZE || '10mb'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_URL_ENCODED_SIZE || '10mb'
}));
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