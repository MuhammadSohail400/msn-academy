import { Router } from 'express';
import { InquiryController } from './inquiry.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createInquirySchema,
  updateInquiryStatusSchema,
  inquiryIdParamSchema,
} from './inquiry.validation';

const router = Router();

// Public submission
router.post(
  '/',
  validateRequest({ body: createInquirySchema }),
  InquiryController.createInquiry
);

// Protected Admin leads pipeline
router.get(
  '/admin/all',
  authGuard,
  roleGuard('ADMIN'),
  InquiryController.getAllInquiries
);

router.patch(
  '/admin/:inquiryId/status',
  authGuard,
  roleGuard('ADMIN'),
  validateRequest({ params: inquiryIdParamSchema, body: updateInquiryStatusSchema }),
  InquiryController.updateStatus
);

export default router;
