import type { GameType } from '../../../generated/prisma/client.js';

import prisma from '../../lib/prismaClient.js';
import { createGameSession } from './shared/gameSession.service.js';
import { createGameSpawns } from './shared/gameSpawn.service.js';
import { verifySpawnSignature } from './shared/gameSignature.js';
import { createGameResult } from './shared/gameResult.service.js';
import { cleanupActiveSessions } from './shared/cleanupActiveSessions.service.js';

const TOTAL_SPAWNS = 60;
const GAME_TYPE: GameType = 'ROAD_RACE';

export interface RoadRaceItem {
  spawnId: string;
  gameItemId: string;
  name: string;
  isCorrect: boolean;
  signature: string;
}

export interface RoadRaceMissionPreview {
  mission: {
    id: string;
    title: string;
    description: string | null;
    correctGroup: string;
    wrongGroup: string | null;
  };
  itemType: string;
}

export interface RoadRaceGame extends RoadRaceMissionPreview {
  sessionId: string;
  startedAt: Date;
  items: RoadRaceItem[];
}

interface ItemCandidate {
  id: string;
  name: string;
  type: string;
  group: string | null;
  isCorrect: boolean;
}

function pickRandom<T>(items: T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];

  if (item === undefined) {
    throw new Error('Cannot pick from an empty array.');
  }

  return item;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
}

function selectItems(candidates: ItemCandidate[]): ItemCandidate[] {
  if (candidates.length === 0) {
    throw new Error('No items available for this mission.');
  }

  const selected: ItemCandidate[] = [];

  while (selected.length < TOTAL_SPAWNS) {
    selected.push(
      ...shuffle(candidates).slice(0, TOTAL_SPAWNS - selected.length),
    );
  }

  return shuffle(selected);
}

export interface RoadRaceCompletionInput {
  gameScore: number;
  resolvedSpawns: {
    spawnId: string;
    signature: string;
    collected: boolean;
  }[];
}

export class RoadRaceService {
  private async getMissionOptions(
    lessonId: string,
    missionId?: string,
    requestedItemType?: string,
  ): Promise<RoadRaceMissionPreview & { candidates: ItemCandidate[] }> {
    const missions = await prisma.gameMission.findMany({
      where: {
        lessonId,
        gameType: GAME_TYPE,
        ...(missionId ? { id: missionId } : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        correctGroup: true,
        wrongGroup: true,
      },
    });

    const validMissions = missions.filter(
      (mission) => mission.wrongGroup !== null,
    );

    if (validMissions.length === 0) {
      throw new Error('No valid game missions found for this lesson.');
    }

    const mission = missionId
      ? validMissions[0]!
      : pickRandom(validMissions);

    const items = await prisma.gameItem.findMany({
      where: {
        lessonId,
        group: {
          in: [mission.correctGroup, mission.wrongGroup!],
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        group: true,
      },
    });

    const validTypes = [
      ...new Set(items.map((item) => item.type)),
    ].filter((type) => {
      const groups = new Set(
        items
          .filter((item) => item.type === type)
          .map((item) => item.group),
      );

      return (
        groups.has(mission.correctGroup) &&
        groups.has(mission.wrongGroup!)
      );
    });

    if (validTypes.length === 0) {
      throw new Error(
        'No item type has items for both mission groups.',
      );
    }

    const itemType = requestedItemType
      ? requestedItemType
      : pickRandom(validTypes);

    if (!validTypes.includes(itemType)) {
      throw new Error('Invalid item type for this mission.');
    }

    const candidates: ItemCandidate[] = items
      .filter((item) => item.type === itemType)
      .map((item) => ({
        ...item,
        isCorrect: item.group === mission.correctGroup,
      }));

    return { mission, itemType, candidates };
  }

  async getMission(lessonId: string): Promise<RoadRaceMissionPreview> {
    const { mission, itemType } = await this.getMissionOptions(lessonId);

    return { mission, itemType };
  }

  async startGame(
    lessonId: string,
    userId: string,
    missionId: string,
    itemType: string,
  ): Promise<RoadRaceGame> {
    const { mission, candidates } = await this.getMissionOptions(
      lessonId,
      missionId,
      itemType,
    );

    const selectedCandidates = candidates.filter(
      (item) => item.type === itemType,
    );

    const selectedItems = selectItems(selectedCandidates);

    const session = await prisma.$transaction(async (tx) => {
      await cleanupActiveSessions(tx, userId);
      
      const createdSession = await createGameSession(tx, {
        userId,
        lessonId,
        gameType: GAME_TYPE,
        missionId: mission.id,
        itemType,
      });

      const spawns = await createGameSpawns(
        tx,
        selectedItems.map((item) => ({
          sessionId: createdSession.id,
          gameItemId: item.id,
          isCorrect: item.isCorrect,
        })),
      );

      return { createdSession, spawns };
    });

    const names = new Map(
      selectedCandidates.map((item) => [item.id, item.name]),
    );

    return {
      sessionId: session.createdSession.id,
      startedAt: session.createdSession.startedAt,
      mission,
      itemType,
      items: session.spawns.map((spawn) => ({
        ...spawn,
        name: names.get(spawn.gameItemId)!,
      })),
    };
  }

  async getNextBatch(
    sessionId: string,
    userId: string,
  ): Promise<RoadRaceItem[]> {
    return prisma.$transaction(async (tx) => {
      const session = await tx.gameSession.findFirst({
        where: {
          id: sessionId,
          userId,
          gameType: GAME_TYPE,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          lessonId: true,
          itemType: true,
          mission: {
            select: {
              correctGroup: true,
              wrongGroup: true,
            },
          },
        },
      });

      if (!session) {
        throw new Error('Active game session not found.');
      }

      const items = await tx.gameItem.findMany({
        where: {
          lessonId: session.lessonId,
          type: session.itemType,
          group: {
            in: [
              session.mission.correctGroup,
              session.mission.wrongGroup!,
            ],
          },
        },
        select: {
          id: true,
          name: true,
          group: true,
        },
      });

      const candidates: ItemCandidate[] = items.map((item) => ({
        ...item,
        type: session.itemType,
        isCorrect: item.group === session.mission.correctGroup,
      }));

      const selectedItems = selectItems(candidates);

      const spawns = await createGameSpawns(
        tx,
        selectedItems.map((item) => ({
          sessionId: session.id,
          gameItemId: item.id,
          isCorrect: item.isCorrect,
        })),
      );

      const names = new Map(
        selectedItems.map((item) => [item.id, item.name]),
      );

      return spawns.map((spawn) => ({
        ...spawn,
        name: names.get(spawn.gameItemId)!,
      }));
    });
  }

  async completeGame(
    sessionId: string,
    userId: string,
    input: RoadRaceCompletionInput,
  ): Promise<{ gameScore: number; educationalScore: number }> {
    return prisma.$transaction(async (tx) => {
      const session = await tx.gameSession.findFirst({
        where: {
          id: sessionId,
          userId,
          gameType: GAME_TYPE,
        },
        include: {
          activityAttempt: true,
        },
      });

      if (!session) {
        throw new Error('Game session not found.');
      }

      // Αν έχει ήδη ολοκληρωθεί, επιστρέφουμε το αποθηκευμένο αποτέλεσμα.
      if (session.status === 'COMPLETED') {
        if (!session.activityAttempt) {
          throw new Error('Completed session has no result.');
        }

        return {
          gameScore: session.activityAttempt.gameScore,
          educationalScore: session.activityAttempt.educationalScore,
        };
      }

      if (session.status !== 'ACTIVE') {
        throw new Error('Game session is not active.');
      }

      const now = new Date();

      const reportedSpawns = input.resolvedSpawns;

      const storedSpawns = reportedSpawns.length
        ? await tx.gameSessionSpawn.findMany({
            where: {
              sessionId,
              id: {
                in: reportedSpawns.map((spawn) => spawn.spawnId),
              },
            },
          })
        : [];

      if (storedSpawns.length !== reportedSpawns.length) {
        throw new Error('One or more spawns are invalid.');
      }

      const spawnsById = new Map(
        storedSpawns.map((spawn) => [spawn.id, spawn]),
      );

      let itemScore = 0;
      let educationalScore = 0;

      for (const reported of reportedSpawns) {
        const spawn = spawnsById.get(reported.spawnId);

        if (
          !spawn ||
          !verifySpawnSignature(
            reported.signature,
            sessionId,
            spawn.id,
            spawn.gameItemId,
            spawn.isCorrect,
          )
        ) {
          throw new Error('Invalid spawn signature.');
        }

        if (!reported.collected) {
          continue;
        }

        if (spawn.isCorrect) {
          itemScore += 100;
          educationalScore += 100;
        } else {
          itemScore -= 100;
        }
      }

      // Ελέγχουμε αν το δηλωμένο σκορ χρόνου είναι εύλογο.
      const submittedGameScore = Math.floor(input.gameScore);
      const reportedTimeScore = submittedGameScore - itemScore;

      const elapsedSeconds = Math.max(
        0,
        (now.getTime() - session.startedAt.getTime()) / 1000,
      );

      const maxTimeScore = Math.ceil(elapsedSeconds * 60) + 120;

      if (
        reportedTimeScore < 0 ||
        reportedTimeScore > maxTimeScore
      ) {
        throw new Error('Invalid game score.');
      }

      // Η ενημέρωση γίνεται μόνο αν η συνεδρία παραμένει ενεργή.
      const updated = await tx.gameSession.updateMany({
        where: {
          id: sessionId,
          userId,
          status: 'ACTIVE',
        },
        data: {
          status: 'COMPLETED',
          endedAt: now,
        },
      });

      if (updated.count !== 1) {
        throw new Error('Game session is no longer active.');
      }

      await createGameResult(tx, {
        userId: session.userId,
        lessonId: session.lessonId,
        activityType: 'ROAD_RACE',
        gameScore: submittedGameScore,
        educationalScore,
        gameSessionId: sessionId,
      });

      await tx.gameSessionSpawn.deleteMany({
        where: {
          sessionId,
        },
      });

      return {
        gameScore: submittedGameScore,
        educationalScore,
      };
    });
  }
}

export const roadRaceService = new RoadRaceService();
