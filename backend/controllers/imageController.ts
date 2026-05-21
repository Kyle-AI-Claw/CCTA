import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const thumbnailDir = process.env.THUMBNAIL_DIR || './uploads/thumbnails';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    cb(null, `coin-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req,
  file,
  cb
) => {
  const allowedTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 10485760,
  },
});

// Process and optimize images
export async function processImage(imagePath: string) {
  const filename = path.basename(imagePath);
  const dirname = path.dirname(imagePath);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);

  // Generate thumbnails
  const thumbnailPath = path.join(thumbnailDir, `${baseName}-thumb${ext}`);
  const smallPath = path.join(thumbnailDir, `${baseName}-small${ext}`);

  // Create thumbnails
  await sharp(imagePath)
    .resize(300, 300, {
      fit: 'cover',
      position: 'center',
    })
    .toFile(thumbnailPath);

  await sharp(imagePath)
    .resize(150, 150, {
      fit: 'cover',
      position: 'center',
    })
    .toFile(smallPath);

  return {
    original: imagePath,
    thumbnail: thumbnailPath,
    small: smallPath,
  };
}

// Delete images when coin is deleted
export async function deleteImages(imagePaths: string[]) {
  for (const imagePath of imagePaths) {
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error(`Error deleting image ${imagePath}:`, error);
      }
    }
  }
}
