import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import courseRoutes from './routes/courseRoutes';
import lectureRoutes from './routes/lectureRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Vercel preview health checks)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      console.warn(`[CORS] Blocked request from origin: "${origin}". Allowed:`, allowedOrigins);
      return callback(new Error(`CORS request blocked by LMS server policy for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Core Middleware
// ---------------------------------------------------------------------------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Serverless-compatible DB connection middleware
// Ensures MongoDB is connected before any route handler runs.
// Uses global connection caching so warm serverless containers reuse connections.
// ---------------------------------------------------------------------------
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    console.error('[Middleware] DB connection error:', error.message);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Database connection failed.',
    });
  }
});

// ---------------------------------------------------------------------------
// Request Logger
// ---------------------------------------------------------------------------
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    message: 'LMS Backend API is operational',
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/auth', authRoutes);

// ---------------------------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------------------------
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// ---------------------------------------------------------------------------
// Global Error Handler
// ---------------------------------------------------------------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Error Handler]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ---------------------------------------------------------------------------
// Local development server — Vercel ignores app.listen() at runtime
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 LMS Backend server running on: http://localhost:${PORT}`);
    console.log(`📚 Public API: http://localhost:${PORT}/api/courses`);
    console.log(`🔒 Admin Auth: http://localhost:${PORT}/api/auth/login\n`);
  });
}

// ---------------------------------------------------------------------------
// Export the app — Vercel uses this as the serverless function entry point
// ---------------------------------------------------------------------------
export default app;
