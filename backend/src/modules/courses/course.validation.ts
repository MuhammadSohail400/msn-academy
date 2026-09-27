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

export const courseIdParamSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid 24-character ObjectId'),
});

export const getCourseSyllabusParamsSchema = courseIdParamSchema;

export const createCourseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  subtitle: z.string().trim().min(5, 'Subtitle must be at least 5 characters').default('Comprehensive practical course for tech professionals.'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Web Development', 'Artificial Intelligence', 'Data Science', 'Design', 'Marketing', 'Productivity']),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels', 'Job Ready']).default('All Levels'),
  badge: z.enum(['Bestseller', 'Design', 'Job Ready', 'Advanced', 'Coming Soon']).nullable().optional(),
  language: z.string().trim().default('Urdu / English'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  originalPrice: z.number().min(0).nullable().optional(),
  currency: z.string().trim().default('PKR'),
  thumbnail: z.string().trim().default('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop'),
  previewVideoUrl: z.string().trim().nullable().optional(),
  durationHours: z.number().min(0).default(10),
  totalLectures: z.number().min(0).default(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'COMING_SOON', 'ARCHIVED']).default('PUBLISHED'),
  instructor: z.object({
    name: z.string().trim().min(2).default('MSN Academy Faculty'),
    title: z.string().trim().min(2).default('Lead Technical Instructor'),
    bio: z.string().trim().optional().default('Industry expert with verified domain experience.'),
    avatarUrl: z.string().trim().nullable().optional(),
  }).default({
    name: 'MSN Academy Faculty',
    title: 'Lead Technical Instructor',
    bio: 'Industry expert with verified domain experience.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  }),
  learningOutcomes: z.array(z.string().trim()).default([]),
  prerequisites: z.array(z.string().trim()).default([]),
  modules: z.array(z.any()).default([]),
});

export const updateCourseSchema = createCourseSchema.partial();

export type GetCoursesQuery = z.infer<typeof getCoursesQuerySchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
