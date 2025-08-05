import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Import configuration
import { config, logConfiguration } from './config/environment';

// Helper function to get LLM model info
const getLlmModelInfo = (): string => {
  const provider = config.defaultLlmProvider;
  switch (provider) {
    case 'groq':
      return `${config.groqModel} (Groq)`;
    case 'openai':
      return `${config.openaiModel} (OpenAI)`;
    case 'anthropic':
      return `${config.anthropicModel} (Anthropic)`;
    case 'ollama':
      return `${config.ollamaModel} (Ollama)`;
    default:
      return `${config.groqModel} (Groq)`;
  }
};

// Import database service
import databaseService from './services/databaseService';

// Import routes
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import chatRoutes from './routes/chat';
import paymentLinkRoutes from './routes/paymentLinks';
import fundingRoutes from './routes/funding';
import tokenTransferRoutes from './routes/tokenTransfer';
import metricsRoutes from './routes/metrics';

// Import rate limiting
// import { generalLimiter } from './config/rateLimit';

dotenv.config();

const app = express();
const PORT = config.port;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General rate limiting - temporarily disabled
// app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Dasta Backend API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
    stellarNetwork: config.stellarNetwork,
    frontendUrl: config.frontendUrl,
    llmProvider: config.defaultLlmProvider,
    llmModel: getLlmModelInfo()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment-links', paymentLinkRoutes);
app.use('/api/funding', fundingRoutes);
app.use('/api/transfer', tokenTransferRoutes);
app.use('/api/metrics', metricsRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);

  // Default error response
  res.status(error.status || 500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'production' 
      ? 'Something went wrong' 
      : error.message,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Log configuration
    logConfiguration();
    
    // Connect to MongoDB
    await databaseService.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Dasta Backend API running on port ${PORT}`);
      console.log(`🗄️  MongoDB: Connected`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app; 