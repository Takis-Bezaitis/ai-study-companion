import { z } from 'zod';

export const generateTextSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(4000, 'Prompt is too long'),
});

export type GenerateTextInput = z.infer<
  typeof generateTextSchema
>;

export const retrieveLessonSchema = z.object({
  lessonId: z
    .string()
    .uuid('Invalid lesson ID'),

  query: z
    .string()
    .trim()
    .min(1, 'Query is required')
    .max(1000, 'Query is too long'),

  limit: z
    .number()
    .int()
    .positive()
    .max(10)
    .optional(),
});

export type RetrieveLessonInput = z.infer<
  typeof retrieveLessonSchema
>;

export const askLessonSchema = z.object({
  lessonId: z
    .string()
    .uuid('Invalid lesson ID'),

  question: z
    .string()
    .trim()
    .min(1, 'Question is required')
    .max(2000, 'Question is too long'),
});

export type AskLessonInput = z.infer<
  typeof askLessonSchema
>;