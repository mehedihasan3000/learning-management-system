import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const getJwtSecret = (): string => {
  return (
    process.env.JWT_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    'super-secret-jwt-key-for-lms-platform-2026'
  );
};

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Query MongoDB for the admin account
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
      return;
    }

    // Verify password against stored bcrypt hash in MongoDB
    const isPasswordValid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
      return;
    }

    const secret = getJwtSecret();
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
      secret,
      { expiresIn: '7d' }
    );

    // Set secure HttpOnly cookie - invisible to client JavaScript, preventing XSS theft
    res.cookie('lms_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      data: {
        admin: {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

export const getAdminSession = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    // Always fetch fresh admin state directly from MongoDB
    const admin = await Admin.findById(req.user.id).select('-passwordHash');
    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Admin account not found in database',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Admin session is active',
      data: {
        admin: {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify session',
      error: error.message,
    });
  }
};

export const adminLogout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('lms_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully',
  });
};

export const verifyAdminSession = async (req: Request, res: Response): Promise<void> => {
  let token = req.cookies?.lms_admin_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);
    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: decoded,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Token is invalid or expired',
      error: error.message,
    });
  }
};
