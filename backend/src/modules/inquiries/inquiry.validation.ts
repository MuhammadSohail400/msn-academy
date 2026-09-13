import { z } from 'zod';

export const createInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  phone: z.string().trim().optional(),
  subject: z
    .string()
    .trim()
    .min(5, 'Subject must be at least 5 characters')
    .max(150, 'Subject cannot exceed 150 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
