import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createPaymentSchema,
  submitProofSchema,
  adminReviewPaymentSchema,
  getPaymentParamsSchema,
  paymentWebhookSchema,
} from './payment.validation';

const router = Router();

// Public Webhook: Asynchronous payment gateway notifications
router.post(
  '/webhook',
  validateRequest({ body: paymentWebhookSchema }),
  PaymentController.handleWebhook
);
router.get('/webhook', (_req, res) => {
  res.status(405).json({
    success: false,
    message: 'Method Not Allowed. Payment Webhook only accepts POST requests.',
    statusCode: 405,
  });
});

// Protected routes require student or admin authentication
router.use(authGuard);

router.post('/create', validateRequest({ body: createPaymentSchema }), PaymentController.createPayment);
router.post(
  '/:paymentId/verify',
  validateRequest({ params: getPaymentParamsSchema, body: submitProofSchema }),
  PaymentController.submitProof
);
router.get(
  '/:paymentId',
  validateRequest({ params: getPaymentParamsSchema }),
  PaymentController.getPaymentStatus
);
router.patch(
  '/:paymentId/admin-review',
  roleGuard('ADMIN'),
  validateRequest({ params: getPaymentParamsSchema, body: adminReviewPaymentSchema }),
  PaymentController.adminReview
);

export default router;
