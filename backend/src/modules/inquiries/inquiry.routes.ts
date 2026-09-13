import { Router } from 'express';
import { InquiryController } from './inquiry.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createInquirySchema } from './inquiry.validation';

const router = Router();

router.post(
  '/',
  validateRequest({ body: createInquirySchema }),
  InquiryController.createInquiry
);

export default router;
