import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must not exceed 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Generate tokens
function generateTokens(userId: string): { accessToken: string; refreshToken: string } {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Register new user
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: validatedData.username },
          { email: validatedData.email },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'User with this username or email already exists',
          code: 'USER_EXISTS',
        },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        passwordHash,
      },
    });

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
      });
    }
    next(error);
  }
}

// Login user
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: error.errors,
        },
      });
    }
    next(error);
  }
}

// Refresh token
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN',
        },
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    ) as { userId: string };

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Refresh token expired',
          code: 'TOKEN_EXPIRED',
        },
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid refresh token',
          code: 'INVALID_TOKEN',
        },
      });
    }
    next(error);
  }
}
