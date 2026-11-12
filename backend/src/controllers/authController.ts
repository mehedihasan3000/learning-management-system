import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lms.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    if (email.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
      return;
    }

    const secret =
      process.env.JWT_SECRET ||
      process.env.BETTER_AUTH_SECRET ||
      'super-secret-jwt-key-for-lms-platform-2026';

    const token = jwt.sign(
      {
        id: 'admin-001',
        email: adminEmail,
        role: 'admin',
        name: 'System Administrator',
      },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin authenticated successfully',
      data: {
        token,
        admin: {
          id: 'admin-001',
          email: adminEmail,
          name: 'System Administrator',
          role: 'admin',
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

export const verifyAdminSession = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret =
      process.env.JWT_SECRET ||
      process.env.BETTER_AUTH_SECRET ||
      'super-secret-jwt-key-for-lms-platform-2026';

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

