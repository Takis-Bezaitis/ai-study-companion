import { z } from 'zod';

export const gameParamsSchema = z.object({
  lessonId: z.uuid('Invalid lesson ID'),
});

export type GameParams = z.infer<typeof gameParamsSchema>;
