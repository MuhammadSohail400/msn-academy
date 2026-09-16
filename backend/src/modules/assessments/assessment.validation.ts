import { z } from 'zod';

export const courseAssessmentParamsSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID format'),
});

export const attemptParamsSchema = z.object({
  attemptId: z
    .string()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid attempt ID format'),
});

export const recordAnswerSchema = z.object({
  questionId: z.string().trim().min(1, 'Question ID is required'),
  selectedOptionKey: z.enum(['A', 'B', 'C', 'D']).nullable().optional(),
  isFlagged: z.boolean().optional(),
});

export type RecordAnswerInput = z.infer<typeof recordAnswerSchema>;
