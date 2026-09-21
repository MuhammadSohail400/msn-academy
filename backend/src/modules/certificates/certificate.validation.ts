import { z } from 'zod';

export const certificateParamsSchema = z.object({
  certificateId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid certificate ID format'),
});

export const verifyCertificateParamsSchema = z.object({
  certificateNumber: z
    .string()
    .trim()
    .regex(/^MSN-[0-9]{4}-[0-9]{4,6}$/, 'Invalid certificate number format. Expected format: MSN-YYYY-XXXXX'),
});
