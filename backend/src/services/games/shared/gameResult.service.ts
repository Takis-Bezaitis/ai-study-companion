import type { Prisma } from '../../../../generated/prisma/client.js';

export interface CreateGameResultInput {
  userId: string;
  lessonId: string;
  activityType: Prisma.ActivityAttemptCreateManyInput['activityType'];
  gameScore: number;
  educationalScore: number;
  gameSessionId: string;
}

export async function createGameResult(
  tx: Prisma.TransactionClient,
  input: CreateGameResultInput,
) {
  return tx.activityAttempt.create({
    data: {
      userId: input.userId,
      lessonId: input.lessonId,
      activityType: input.activityType,
      gameScore: input.gameScore,
      educationalScore: input.educationalScore,
      gameSessionId: input.gameSessionId,
    },
  });
}
