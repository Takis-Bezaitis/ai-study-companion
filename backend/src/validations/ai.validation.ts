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