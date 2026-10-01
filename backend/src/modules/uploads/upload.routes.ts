import { Router } from 'express';
import { UploadController } from './upload.controller';
import { uploadMiddleware } from './upload.middleware';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Single file upload route - authenticated users
router.post(
  '/',
  authGuard,
  uploadMiddleware.single('file'),
  UploadController.uploadSingle
);

export default router;
