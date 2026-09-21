import { z } from 'zod';

export const addCartItemSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid 24-character ObjectId'),
});

export const removeCartItemParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid 24-character ObjectId'),
});

export const applyPromoSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Promo code must be at least 3 characters')
    .max(20, 'Promo code cannot exceed 20 characters')
    .toUpperCase(),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type ApplyPromoInput = z.infer<typeof applyPromoSchema>;
