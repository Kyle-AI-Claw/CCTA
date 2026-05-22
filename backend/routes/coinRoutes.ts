import { Router } from 'express';
import {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
} from '../controllers/coinController';
import { upload } from '../controllers/imageController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes - anyone can view coins
router.get('/', getAllCoins);
router.get('/:id', getCoinById);

// Protected routes - require authentication
router.post('/', authenticateToken, upload.fields([{ name: 'frontImage' }, { name: 'backImage' }]), createCoin);
router.put('/:id', authenticateToken, upload.fields([{ name: 'frontImage' }, { name: 'backImage' }]), updateCoin);
router.delete('/:id', authenticateToken, deleteCoin);

export default router;
