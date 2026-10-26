import type { Prisma } from '../../../../generated/prisma/client.js';
import { randomUUID } from 'node:crypto';
import { createSpawnSignature } from './gameSignature.js';

export interface CreateSpawnInput {
  sessionId: string;
  gameItemId: string;
  isCorrect: boolean;
}

export interface CreatedSpawn {
  spawnId: string;
  gameItemId: string;
  isCorrect: boolean;
  signature: string;
}

export async function createGameSpawns(
  tx: Prisma.TransactionClient,
  inputs: CreateSpawnInput[],
): Promise<CreatedSpawn[]> {
  const spawns = inputs.map((input) => {
    const spawnId = randomUUID();

    return {
      id: spawnId,
      sessionId: input.sessionId,
      gameItemId: input.gameItemId,
      isCorrect: input.isCorrect,
      signature: createSpawnSignature(
        input.sessionId,
        spawnId,
        input.gameItemId,
        input.isCorrect,
      ),
    };
  });

  await tx.gameSessionSpawn.createMany({
    data: spawns,
  });

  return spawns.map((spawn) => ({
    spawnId: spawn.id,
    gameItemId: spawn.gameItemId,
    isCorrect: spawn.isCorrect,
    signature: spawn.signature,
  }));
}
