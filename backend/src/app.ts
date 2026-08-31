import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Express = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for dev/prototype simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple logger
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LMS Platform Backend API',
    database: 'MongoDB Atlas',
    version: '1.0.0'
  });
});

// Master API Routes
app.use('/api', apiRouter);

// 404 handler for undefined API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
