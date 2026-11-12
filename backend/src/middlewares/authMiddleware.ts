import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Malformed authorization header.',
      });
      return;
    }

    const secret =
      process.env.JWT_SECRET ||
      process.env.BETTER_AUTH_SECRET ||
      'super-secret-jwt-key-for-lms-platform-2026';

    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
      error: error.message,
    });
  }
};

