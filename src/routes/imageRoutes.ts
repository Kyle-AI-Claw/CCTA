import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload, processImage } from '../controllers/imageController';

const router = Router();

// Apply authentication to image routes
router.use(authenticateToken);

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No file uploaded',
          code: 'NO_FILE',
        },
      });
    }

    // Process the image
    const { thumbnail, small } = await processImage(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        path: req.file.path,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        thumbnail,
        small,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Image processing failed',
        code: 'IMAGE_PROCESSING_ERROR',
      },
    });
  }
});

export default router;
