import { z } from 'zod';

export const getCoursesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val >= 1, { message: 'Page must be a positive integer' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 12))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 50, {
      message: 'Limit must be between 1 and 50',
    }),
  search: z.string().trim().optional(),
  category: z
    .enum(['Web Development', 'Artificial Intelligence', 'Data Science', 'Design', 'Marketing', 'Productivity'])
    .optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels', 'Job Ready']).optional(),
  sort: z
    .enum(['newest', 'price_asc', 'price_desc', 'popular', 'rating'])
    .default('newest')
    .optional(),
});

export const getCourseBySlugParamsSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, 'Slug must be a lowercase URL-friendly string'),
});

export const getCourseSyllabusParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid 24-character ObjectId'),
});

export type GetCoursesQuery = z.infer<typeof getCoursesQuerySchema>;
