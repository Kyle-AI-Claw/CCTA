import { Router } from 'express';
import {
  getAllTags,
  createTag,
  deleteTag,
} from '../controllers/tagController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public - anyone can view tags
router.get('/', getAllTags);

// Protected - require auth to create/delete tags
router.post('/', authenticateToken, createTag);
router.delete('/:id', authenticateToken, deleteTag);

export default router;
