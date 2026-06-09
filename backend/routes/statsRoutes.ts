import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getStats } from '../controllers/statsController';

const router = Router();

// Stats are per-user — require authentication
router.get('/', authenticateToken, getStats);

export default router;
