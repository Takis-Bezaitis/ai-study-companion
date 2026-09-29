import prisma from "../lib/prismaClient.js";

const lessonTitle = "Countries of Europe";

const gameItems = [
  // Capitals — North
  {
    type: "CAPITAL",
    name: "Oslo",
    group: "NORTH",
  },
  {
    type: "CAPITAL",
    name: "Stockholm",
    group: "NORTH",
  },
  {
    type: "CAPITAL",
    name: "Helsinki",
    group: "NORTH",
  },
  {
    type: "CAPITAL",
    name: "Copenhagen",
    group: "NORTH",
  },
  {
    type: "CAPITAL",
    name: "Reykjavik",
    group: "NORTH",
  },

  // Capitals — South
  {
    type: "CAPITAL",
    name: "Madrid",
    group: "SOUTH",
  },
  {
    type: "CAPITAL",
    name: "Lisbon",
    group: "SOUTH",
  },
  {
    type: "CAPITAL",
    name: "Rome",
    group: "SOUTH",
  },
  {
    type: "CAPITAL",
    name: "Athens",
    group: "SOUTH",
  },
  {
    type: "CAPITAL",
    name: "Valletta",
    group: "SOUTH",
  },

  // Capitals — West
  {
    type: "CAPITAL",
    name: "Paris",
    group: "WEST",
  },
  {
    type: "CAPITAL",
    name: "London",
    group: "WEST",
  },
  {
    type: "CAPITAL",
    name: "Dublin",
    group: "WEST",
  },
  {
    type: "CAPITAL",
    name: "Brussels",
    group: "WEST",
  },
  {
    type: "CAPITAL",
    name: "Amsterdam",
    group: "WEST",
  },

  // Capitals — Central
  {
    type: "CAPITAL",
    name: "Berlin",
    group: "CENTRAL",
  },
  {
    type: "CAPITAL",
    name: "Vienna",
    group: "CENTRAL",
  },
  {
    type: "CAPITAL",
    name: "Prague",
    group: "CENTRAL",
  },
  {
    type: "CAPITAL",
    name: "Bern",
    group: "CENTRAL",
  },
  {
    type: "CAPITAL",
    name: "Budapest",
    group: "CENTRAL",
  },

  // Capitals — East
  {
    type: "CAPITAL",
    name: "Kyiv",
    group: "EAST",
  },
  {
    type: "CAPITAL",
    name: "Warsaw",
    group: "EAST",
  },
  {
    type: "CAPITAL",
    name: "Bucharest",
    group: "EAST",
  },
  {
    type: "CAPITAL",
    name: "Sofia",
    group: "EAST",
  },
  {
    type: "CAPITAL",
    name: "Chisinau",
    group: "EAST",
  },

  // Rivers — North
  {
    type: "RIVER",
    name: "Glomma",
    group: "NORTH",
  },
  {
    type: "RIVER",
    name: "Torne",
    group: "NORTH",
  },

  // Rivers — South
  {
    type: "RIVER",
    name: "Guadalquivir",
    group: "SOUTH",
  },
  {
    type: "RIVER",
    name: "Po",
    group: "SOUTH",
  },

  // Rivers — West
  {
    type: "RIVER",
    name: "Loire",
    group: "WEST",
  },
  {
    type: "RIVER",
    name: "Seine",
    group: "WEST",
  },
  {
    type: "RIVER",
    name: "Thames",
    group: "WEST",
  },

  // Rivers — Central
  {
    type: "RIVER",
    name: "Danube",
    group: "CENTRAL",
  },
  {
    type: "RIVER",
    name: "Rhine",
    group: "CENTRAL",
  },
  {
    type: "RIVER",
    name: "Elbe",
    group: "CENTRAL",
  },

  // Rivers — East
  {
    type: "RIVER",
    name: "Volga",
    group: "EAST",
  },
  {
    type: "RIVER",
    name: "Dnieper",
    group: "EAST",
  },
  {
    type: "RIVER",
    name: "Dniester",
    group: "EAST",
  },

  // Lakes — North
  {
    type: "LAKE",
    name: "Lake Vänern",
    group: "NORTH",
  },
  {
    type: "LAKE",
    name: "Lake Saimaa",
    group: "NORTH",
  },

  // Lakes — South
  {
    type: "LAKE",
    name: "Lake Garda",
    group: "SOUTH",
  },
  {
    type: "LAKE",
    name: "Lake Como",
    group: "SOUTH",
  },

  // Lakes — West
  {
    type: "LAKE",
    name: "Lake Geneva",
    group: "WEST",
  },

  // Lakes — Central
  {
    type: "LAKE",
    name: "Lake Balaton",
    group: "CENTRAL",
  },
  {
    type: "LAKE",
    name: "Lake Constance",
    group: "CENTRAL",
  },

  // Lakes — East
  {
    type: "LAKE",
    name: "Lake Onega",
    group: "EAST",
  },

  // Mountains — North
  {
    type: "MOUNTAIN",
    name: "Galdhøpiggen",
    group: "NORTH",
  },

  // Mountains — South
  {
    type: "MOUNTAIN",
    name: "Mount Etna",
    group: "SOUTH",
  },
  {
    type: "MOUNTAIN",
    name: "Mulhacén",
    group: "SOUTH",
  },

  // Mountains — West
  {
    type: "MOUNTAIN",
    name: "Ben Nevis",
    group: "WEST",
  },

  // Mountains — Central
  {
    type: "MOUNTAIN",
    name: "Grossglockner",
    group: "CENTRAL",
  },
  {
    type: "MOUNTAIN",
    name: "Zugspitze",
    group: "CENTRAL",
  },

  // Mountains — East
  {
    type: "MOUNTAIN",
    name: "Hoverla",
    group: "EAST",
  },
];


const gameMissions = [
  {
    title: "Escape to the North",
    description:
      "Head north and avoid everything coming from the south.",
    correctGroup: "NORTH",
    wrongGroup: "SOUTH",
  },
  {
    title: "Mediterranean Sprint",
    description:
      "Race toward the south and avoid items from the north.",
    correctGroup: "SOUTH",
    wrongGroup: "NORTH",
  },
  {
    title: "Western Route",
    description:
      "Follow the route west and watch out for items from the east.",
    correctGroup: "WEST",
    wrongGroup: "EAST",
  },
  {
    title: "Heading East",
    description:
      "Move east and avoid items coming from the west.",
    correctGroup: "EAST",
    wrongGroup: "WEST",
  },
  {
    title: "Central Passage",
    description:
      "Stay in the heart of Europe and avoid items from the south.",
    correctGroup: "CENTRAL",
    wrongGroup: "SOUTH",
  },
];



async function seedCountriesOfEurope() {
  const lesson = await prisma.lesson.findFirst({
    where: {
      title: lessonTitle,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!lesson) {
    throw new Error(
      `Lesson "${lessonTitle}" was not found.`,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.gameMission.deleteMany({
      where: {
        lessonId: lesson.id,
      },
    });

    await tx.gameItem.deleteMany({
      where: {
        lessonId: lesson.id,
      },
    });

    await tx.gameItem.createMany({
      data: gameItems.map((item) => ({
        lessonId: lesson.id,
        type: item.type,
        name: item.name,
        group: item.group,
      })),
    });

    await tx.gameMission.createMany({
      data: gameMissions.map((mission) => ({
        lessonId: lesson.id,
        title: mission.title,
        description: mission.description,
        correctGroup: mission.correctGroup,
        wrongGroup: mission.wrongGroup,
      })),
    });
  });

  console.log(
    `Seeded ${gameItems.length} game items for "${lesson.title}".`,
  );

  console.log(
    `Seeded ${gameMissions.length} game missions for "${lesson.title}".`,
  );
}

try {
  await seedCountriesOfEurope();
} catch (error) {
  console.error(
    "Countries of Europe game seed failed:",
    error,
  );

  process.exit(1);
} finally {
  await prisma.$disconnect();
}