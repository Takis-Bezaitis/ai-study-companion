import { z } from 'zod';

export const roadRaceStartBodySchema = z.object({
  missionId: z.uuid('Invalid mission ID'),
  itemType: z.string().min(1, 'Item type is required'),
});

export const roadRaceSessionParamsSchema = z.object({
  sessionId: z.uuid('Invalid session ID'),
});

export const roadRaceCompleteBodySchema = z.object({
  gameScore: z.number(),
  resolvedSpawns: z
    .array(
      z.object({
        spawnId: z.uuid('Invalid spawn ID'),
        signature: z
          .string()
          .regex(/^[a-f0-9]{64}$/i, 'Invalid spawn signature'),
        collected: z.boolean(),
      }),
    )
    .superRefine((spawns, ctx) => {
      const seen = new Set<string>();

      spawns.forEach((spawn, index) => {
        if (seen.has(spawn.spawnId)) {
          console.error("Duplicate spawn detected:", {
            spawnId: spawn.spawnId,
            index,
            firstIndex: spawns.findIndex(
              (entry) => entry.spawnId === spawn.spawnId,
            ),
            collected: spawn.collected,
          });

          ctx.addIssue({
            code: 'custom',
            path: [index, 'spawnId'],
            message: 'Duplicate spawn ID',
          });
        }

        seen.add(spawn.spawnId);
      });
    }),
});
