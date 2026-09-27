import { z } from 'zod';

export const adminUsersQuerySchema = z.object({
  page: z.string().optional().default('1').transform((val) => Math.max(1, parseInt(val, 10) || 1)),
  limit: z.string().optional().default('10').transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))),
  search: z.string().trim().optional(),
  role: z.enum(['STUDENT', 'ADMIN', 'ALL']).optional().default('ALL'),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['STUDENT', 'ADMIN'], {
    error: 'Role must be either STUDENT or ADMIN',
  }),
});

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});

export type AdminUsersQueryInput = z.infer<typeof adminUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
