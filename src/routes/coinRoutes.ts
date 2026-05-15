import { Router } from 'express';
import {
  getAllCoins,
  getCoinById,
  createCoin,
  updateCoin,
  deleteCoin,
} from '../controllers/coinController';
import { upload } from '../controllers/imageController';

const router = Router();

router.get('/', getAllCoins);
router.get('/:id', getCoinById);
router.post('/', upload.fields([{ name: 'frontImage' }, { name: 'backImage' }]), createCoin);
router.put('/:id', upload.fields([{ name: 'frontImage' }, { name: 'backImage' }]), updateCoin);
router.delete('/:id', deleteCoin);

export default router;
