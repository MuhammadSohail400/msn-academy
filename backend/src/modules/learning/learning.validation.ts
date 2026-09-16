import { z } from 'zod';

export const courseLearningParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid 24-character ObjectId'),
});

export const lessonParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Course ID must be a valid 24-character ObjectId'),
  lessonId: z.string().trim().min(1, 'Lesson ID is required'),
});

export type CourseLearningParams = z.infer<typeof courseLearningParamsSchema>;
export type LessonParams = z.infer<typeof lessonParamsSchema>;
