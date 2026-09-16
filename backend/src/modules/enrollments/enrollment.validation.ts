import { z } from 'zod';

export const getEnrollmentsQuerySchema = z.object({
  status: z.enum(['ALL', 'ACTIVE', 'COMPLETED']).optional().default('ALL'),
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

export type GetEnrollmentsQuery = z.infer<typeof getEnrollmentsQuerySchema>;
