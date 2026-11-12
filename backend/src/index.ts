import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import courseRoutes from './routes/courseRoutes';
import lectureRoutes from './routes/lectureRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    message: 'LMS Backend API is operational',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 LMS Backend server running on: http://localhost:${PORT}`);
  console.log(`📚 Public API: http://localhost:${PORT}/api/courses`);
  console.log(`🔒 Admin Auth: http://localhost:${PORT}/api/auth/login\n`);
});

export default app;

