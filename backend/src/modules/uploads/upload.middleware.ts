import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';
import { ApiError } from '../../utils/ApiError';

const ALLOWED_FOLDERS = ['receipts', 'thumbnails', 'avatars', 'resources', 'general'];
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const storage = multer.diskStorage({
  destination: (req: Request, _file, cb) => {
    let folder = (req.query.folder as string) || 'general';
    folder = folder.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!ALLOWED_FOLDERS.includes(folder)) {
      folder = 'general';
    }

    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    let folder = (req.query.folder as string) || 'general';
    if (!ALLOWED_FOLDERS.includes(folder)) folder = 'general';

    const ext = path.extname(file.originalname).toLowerCase() || '.bin';
    const randomHex = crypto.randomBytes(6).toString('hex');
    const safeName = `${folder}-${Date.now()}-${randomHex}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Unsupported file type '${file.mimetype}'. Allowed types: JPG, PNG, WEBP, GIF, PDF.`
      )
    );
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
});
