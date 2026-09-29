import prisma from '../../lib/prismaClient.js';

export interface RoadRaceItem {
  id: string;
  name: string;
  isCorrect: boolean;
}

export interface RoadRaceGame {
  mission: {
    id: string;
    title: string;
    description: string | null;
    correctGroup: string;
    wrongGroup: string | null;
  };
  itemType: string;
  correctItems: RoadRaceItem[];
  wrongItems: RoadRaceItem[];
}

function pickRandom<T>(items: T[]): T {
  const item =
    items[Math.floor(Math.random() * items.length)];

  if (!item) {
    throw new Error(
      'Cannot pick from an empty array.',
    );
  }

  return item;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [
      result[j]!,
      result[i]!,
    ];
  }

  return result;
}

export class RoadRaceService {
    async createGame(
        lessonId: string,
    ): Promise<RoadRaceGame> {
        const missions =
        await prisma.gameMission.findMany({
            where: {
            lessonId,
            },
            select: {
            id: true,
            title: true,
            description: true,
            correctGroup: true,
            wrongGroup: true,
            },
        });

        if (missions.length === 0) {
        throw new Error(
            'No game missions found for this lesson.',
        );
        }

        const mission = pickRandom(missions);

        if (!mission.wrongGroup) {
        throw new Error(
            'The selected mission does not have a wrong group.',
        );
        }

        const items =
        await prisma.gameItem.findMany({
            where: {
            lessonId,
            group: {
                in: [
                mission.correctGroup,
                mission.wrongGroup,
                ],
            },
            },
            select: {
            id: true,
            name: true,
            type: true,
            group: true,
            },
        });

        if (items.length === 0) {
        throw new Error(
            'No game items found for this mission.',
        );
        }

        const validTypes = [
        ...new Set(
            items
            .filter(
                (item) => item.group !== null,
            )
            .map((item) => item.type),
        ),
        ].filter((type) => {
        const typeGroups = new Set(
            items
            .filter(
                (item) => item.type === type,
            )
            .map((item) => item.group),
        );

        return (
            typeGroups.has(
            mission.correctGroup,
            ) &&
            typeGroups.has(
            mission.wrongGroup,
            )
        );
        });

        if (validTypes.length === 0) {
        throw new Error(
            'No game item type has items for both mission groups.',
        );
        }

        const itemType = pickRandom(validTypes);

        const typeItems = items.filter(
        (item) => item.type === itemType,
        );

        const correctItems = shuffle(
        typeItems
            .filter(
            (item) =>
                item.group ===
                mission.correctGroup,
            )
            .map((item) => ({
            id: item.id,
            name: item.name,
            isCorrect: true,
            })),
        );

        const wrongItems = shuffle(
        typeItems
            .filter(
            (item) =>
                item.group ===
                mission.wrongGroup,
            )
            .map((item) => ({
            id: item.id,
            name: item.name,
            isCorrect: false,
            })),
        );

        return {
        mission,
        itemType,
        correctItems,
        wrongItems,
        };
    }
}

export const roadRaceService =
  new RoadRaceService();