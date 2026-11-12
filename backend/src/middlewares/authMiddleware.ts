import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    name?: string;
    [key: string]: any;
  };
}

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    // 1. Check HttpOnly cookie first
    if (req.cookies && req.cookies.lms_admin_token) {
      token = req.cookies.lms_admin_token;
    }

    // 2. Fall back to Authorization header (Bearer token)
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authentication session or token provided.',
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
      message: 'Invalid or expired authentication session. Please log in again.',
      error: error.message,
    });
  }
};
