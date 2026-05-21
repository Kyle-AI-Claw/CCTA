import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

// Middleware to verify JWT token
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token required',
        code: 'MISSING_TOKEN',
      },
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    const decoded = jwt.verify(token, secret) as { userId: string };

    req.user = {
      id: decoded.userId,
      email: '', // Would need to fetch from DB in production
      username: '', // Would need to fetch from DB in production
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expired',
          code: 'TOKEN_EXPIRED',
        },
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_FAILED',
      },
    });
  }
}