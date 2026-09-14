import { z } from 'zod';

export const createLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Lesson must be at least 2 characters')
    .max(30, 'Lesson must be at most 30 characters'),

  description: z
    .string()
    .trim()
    .max(100, 'Description must be at most 100 characters')
    .optional(),

  categoryId: z.uuid(),
});

export type CreateLesson = z.infer<typeof createLessonSchema>;