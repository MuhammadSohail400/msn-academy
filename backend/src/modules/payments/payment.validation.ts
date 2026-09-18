import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Order ID must be a valid 24-character ObjectId'),
});

export const submitProofSchema = z.object({
  transactionReference: z
    .string()
    .trim()
    .min(4, 'Transaction reference/TID must be at least 4 characters')
    .max(100, 'Transaction reference cannot exceed 100 characters'),
  receiptScreenshotUrl: z
    .string()
    .trim()
    .url('Receipt screenshot must be a valid URL')
    .optional()
    .or(z.literal(''))
    .nullable(),
});

export const adminReviewPaymentSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    error: 'Status must be either APPROVED or REJECTED',
  }),
  verificationNotes: z.string().trim().max(500, 'Verification notes cannot exceed 500 characters').optional(),
});

export const getPaymentParamsSchema = z.object({
  paymentId: z
    .string()
    .trim()
    .refine((val) => val === 'latest' || /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Payment ID must be a valid 24-character ObjectId or "latest"',
    }),
});

export const paymentWebhookSchema = z.object({
  eventId: z.string().trim().min(1, 'Event ID is required').optional(),
  eventType: z.string().trim().optional(),
  orderId: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Order ID must be a valid 24-character ObjectId'),
  transactionId: z.string().trim().min(1, 'Transaction ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().trim().default('PKR'),
  status: z.enum(['PAID', 'FAILED', 'PENDING']),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type SubmitProofInput = z.infer<typeof submitProofSchema>;
export type AdminReviewPaymentInput = z.infer<typeof adminReviewPaymentSchema>;
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;
