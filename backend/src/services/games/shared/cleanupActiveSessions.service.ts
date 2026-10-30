import type { Prisma } from '../../../../generated/prisma/client.js';
import prisma from '../../../lib/prismaClient.js';

export async function cleanupActiveSessions(tx: Prisma.TransactionClient, userId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const activeSessions = await tx.gameSession.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
      },
    });

    if (activeSessions.length === 0) {
      return;
    }

    const sessionIds = activeSessions.map((session) => session.id);

    await tx.gameSessionSpawn.deleteMany({
      where: {
        sessionId: {
          in: sessionIds,
        },
      },
    });

    await tx.gameSession.deleteMany({
      where: {
        id: {
          in: sessionIds,
        },
        userId,
        status: 'ACTIVE',
      },
    });
  });
}