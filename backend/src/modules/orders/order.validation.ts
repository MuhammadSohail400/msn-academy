import { z } from 'zod';

export const checkoutSchema = z.object({
  paymentMethod: z.enum(['BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH'], {
    error: 'Please select a valid payment method (BANK_TRANSFER, EASYPAISA, or JAZZCASH)',
  }),
  notes: z.string().trim().max(250, 'Notes cannot exceed 250 characters').optional(),
  billingInfo: z
    .object({
      firstName: z.string().trim().min(2, 'First name must be at least 2 characters').optional(),
      lastName: z.string().trim().min(2, 'Last name must be at least 2 characters').optional(),
      email: z.string().trim().email('Please enter a valid billing email address').optional(),
      phoneNumber: z.string().trim().min(10, 'Please enter a valid phone number').optional(),
    })
    .optional(),
});

export const getOrderParamsSchema = z.object({
  orderId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Order ID must be a valid 24-character ObjectId'),
});

export const getOrdersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val >= 1, { message: 'Page must be a positive integer' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 50, {
      message: 'Limit must be between 1 and 50',
    }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
