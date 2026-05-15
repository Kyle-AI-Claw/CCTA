import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import authRoutes from './routes/authRoutes';
import coinRoutes from './routes/coinRoutes';
import tagRoutes from './routes/tagRoutes';
import imageRoutes from './routes/imageRoutes';
import statsRoutes from './routes/statsRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(config.uploadDir));
app.use(express.static(config.thumbnailDir));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API root
app.get('/api', (_req, res) => {
  res.json({ name: 'Coin Collection Tracker API', version: '1.0.0' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/coins', coinRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
