
import type { GameType, Prisma } from '../../../../generated/prisma/client.js';

export interface CreateGameSessionInput {
  userId: string;
  lessonId: string;
  gameType: GameType;
  missionId: string;
  itemType: string;
}

export interface CreatedGameSession {
  id: string;
  userId: string;
  lessonId: string;
  gameType: GameType;
  missionId: string;
  itemType: string;
  startedAt: Date;
}

export async function createGameSession(
  tx: Prisma.TransactionClient,
  input: CreateGameSessionInput,
): Promise<CreatedGameSession> {
  return tx.gameSession.create({
    data: {
      userId: input.userId,
      lessonId: input.lessonId,
      gameType: input.gameType,
      missionId: input.missionId,
      itemType: input.itemType,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      userId: true,
      lessonId: true,
      gameType: true,
      missionId: true,
      itemType: true,
      startedAt: true,
    },
  });
}
