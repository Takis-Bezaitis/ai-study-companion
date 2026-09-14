import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(30, 'Category must be at most 30 characters'),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;