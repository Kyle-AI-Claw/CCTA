import { Router } from 'express';
import authRoutes from './authRoutes';
import coinRoutes from './coinRoutes';
import tagRoutes from './tagRoutes';
import imageRoutes from './imageRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Coin routes
router.use('/coins', coinRoutes);

// Tag routes
router.use('/tags', tagRoutes);

// Image routes
router.use('/images', imageRoutes);

// Stats routes
router.use('/stats', statsRoutes);

export default router;
