import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiry: process.env.JWT_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 10485760,
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  thumbnailDir: process.env.THUMBNAIL_DIR || './uploads/thumbnails',
  allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'],
  rateLimitWindow: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost',
  debug: process.env.DEBUG === 'true',
} as const;
