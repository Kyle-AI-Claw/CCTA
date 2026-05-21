import { Router } from 'express';
import {
  getAllTags,
  createTag,
  deleteTag,
} from '../controllers/tagController';

const router = Router();

router.get('/', getAllTags);
router.post('/', createTag);
router.delete('/:id', deleteTag);

export default router;
