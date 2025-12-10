// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables first - specify path explicitly
const envPath = join(__dirname, '.env');
const result = dotenv.config({ path: envPath });

// Debug: Check if .env was loaded (but don't exit if missing - use env vars from Render)
if (result.error) {
  console.log('⚠️  No .env file found (using environment variables from hosting platform)');
  console.log('📍 Looking for .env at:', envPath);
} else {
  console.log('✅ Environment variables loaded from .env file');
  console.log('📍 .env file location:', envPath);
}

console.log(`📊 Database Type: ${process.env.DATABASE_TYPE || 'sqlite'}`);

// Now import everything else after env vars are loaded
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import database connection
import { connectDatabase, getDatabaseType } from './config/database.js';

// Import SQL controllers
import * as authController from './controllers/authController.js';

// Import middleware
import { authenticateToken, authorize } from './middleware/auth.js';
import { generalLimiter, authLimiter, writeLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Import validators
import { registerSchema, loginSchema, validate } from './validators/authValidator.js';
import { createStudentSchema, updateStudentSchema } from './validators/studentValidator.js';
import { createCourseSchema, updateCourseSchema } from './validators/courseValidator.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(logger.requestLogger());

// Apply general rate limiting to all routes
app.use('/api/', generalLimiter);

// Connect to Database (MySQL or SQLite based on env)
await connectDatabase();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbType = getDatabaseType();
    res.json({
      success: true,
      message: 'Server is running',
      database: dbType.toUpperCase(),
      dbStatus: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      database: getDatabaseType().toUpperCase(),
      dbStatus: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Authentication routes (with rate limiting and validation)
app.post('/api/auth/register', authLimiter, validate(registerSchema), authController.register);
app.post('/api/auth/login', authLimiter, validate(loginSchema), authController.login);
app.get('/api/auth/profile', authenticateToken, authController.getProfile);
app.put('/api/auth/profile', authenticateToken, authController.updateProfile);
app.put('/api/auth/change-password', authenticateToken, authController.changePassword);

// TODO: Add more routes (students, courses, assignments, attendance) with SQL controllers

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 Database: ${getDatabaseType().toUpperCase()}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔒 Security: Helmet enabled`);
  logger.info(`⚡ Rate limiting: Active`);
});

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, closing server gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      const { closeDatabase } = await import('./config/database.js');
      await closeDatabase();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', { error: error.message });
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


