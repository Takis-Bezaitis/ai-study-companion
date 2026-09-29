import { z } from 'zod';

export const roadRaceParamsSchema = z.object({
  lessonId: z.uuid('Invalid lesson ID'),
});

export type RoadRaceParams = z.infer<
  typeof roadRaceParamsSchema
>;