import prisma from "../lib/prismaClient.js";

const lessonTitle = "Countries of Europe";

/* Round 1 of game items
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
*/

// ROUND 2 — Additional items from Countries of Europe curriculum

const gameItems = [
  // Capitals — North
  { type: "CAPITAL", name: "Tallinn", group: "NORTH" },
  { type: "CAPITAL", name: "Riga", group: "NORTH" },
  { type: "CAPITAL", name: "Vilnius", group: "NORTH" },

  // Capitals — South
  { type: "CAPITAL", name: "Tirana", group: "SOUTH" },
  { type: "CAPITAL", name: "Nicosia", group: "SOUTH" },
  { type: "CAPITAL", name: "Podgorica", group: "SOUTH" },
  { type: "CAPITAL", name: "Skopje", group: "SOUTH" },
  { type: "CAPITAL", name: "San Marino", group: "SOUTH" },
  { type: "CAPITAL", name: "Vatican City", group: "SOUTH" },
  { type: "CAPITAL", name: "Monaco", group: "SOUTH" },

  // Capitals — West
  { type: "CAPITAL", name: "Luxembourg City", group: "WEST" },

  // Capitals — Central
  { type: "CAPITAL", name: "Bratislava", group: "CENTRAL" },
  { type: "CAPITAL", name: "Ljubljana", group: "CENTRAL" },
  { type: "CAPITAL", name: "Vaduz", group: "CENTRAL" },

  // Capitals — East
  { type: "CAPITAL", name: "Minsk", group: "EAST" },
  { type: "CAPITAL", name: "Yerevan", group: "EAST" },
  { type: "CAPITAL", name: "Baku", group: "EAST" },
  { type: "CAPITAL", name: "Tbilisi", group: "EAST" },
  { type: "CAPITAL", name: "Astana", group: "EAST" },
  { type: "CAPITAL", name: "Pristina", group: "EAST" },
  { type: "CAPITAL", name: "Chișinău", group: "EAST" },
  { type: "CAPITAL", name: "Belgrade", group: "EAST" },
  { type: "CAPITAL", name: "Ankara", group: "EAST" },
  { type: "CAPITAL", name: "Moscow", group: "EAST" },

  // Rivers — North
  { type: "RIVER", name: "Narva", group: "NORTH" },
  { type: "RIVER", name: "Daugava", group: "NORTH" },
  { type: "RIVER", name: "Gauja", group: "NORTH" },
  { type: "RIVER", name: "Neman", group: "NORTH" },
  { type: "RIVER", name: "Göta", group: "NORTH" },

  // Rivers — South
  { type: "RIVER", name: "Vjosa", group: "SOUTH" },
  { type: "RIVER", name: "Drin", group: "SOUTH" },
  { type: "RIVER", name: "Neretva", group: "SOUTH" },
  { type: "RIVER", name: "Drina", group: "SOUTH" },
  { type: "RIVER", name: "Una", group: "SOUTH" },
  { type: "RIVER", name: "Maritsa", group: "SOUTH" },
  { type: "RIVER", name: "Vardar", group: "SOUTH" },
  { type: "RIVER", name: "Tara", group: "SOUTH" },
  { type: "RIVER", name: "Morača", group: "SOUTH" },
  { type: "RIVER", name: "White Drin", group: "SOUTH" },
  { type: "RIVER", name: "Sitnica", group: "SOUTH" },

  // Rivers — West
  { type: "RIVER", name: "Shannon", group: "WEST" },
  { type: "RIVER", name: "Garonne", group: "WEST" },
  { type: "RIVER", name: "Scheldt", group: "WEST" },
  { type: "RIVER", name: "Meuse", group: "WEST" },
  { type: "RIVER", name: "Moselle", group: "WEST" },
  { type: "RIVER", name: "Sûre", group: "WEST" },
  { type: "RIVER", name: "Alzette", group: "WEST" },
  { type: "RIVER", name: "Severn", group: "WEST" },

  // Rivers — Central
  { type: "RIVER", name: "Inn", group: "CENTRAL" },
  { type: "RIVER", name: "Sava", group: "CENTRAL" },
  { type: "RIVER", name: "Drava", group: "CENTRAL" },
  { type: "RIVER", name: "Kupa", group: "CENTRAL" },
  { type: "RIVER", name: "Vltava", group: "CENTRAL" },
  { type: "RIVER", name: "Morava", group: "CENTRAL" },
  { type: "RIVER", name: "Váh", group: "CENTRAL" },
  { type: "RIVER", name: "Tisza", group: "CENTRAL" },

  // Rivers — East
  { type: "RIVER", name: "Kura", group: "EAST" },
  { type: "RIVER", name: "Aras", group: "EAST" },
  { type: "RIVER", name: "Western Dvina", group: "EAST" },
  { type: "RIVER", name: "Don", group: "EAST" },
  { type: "RIVER", name: "Southern Bug", group: "EAST" },
  { type: "RIVER", name: "Prut", group: "EAST" },
  { type: "RIVER", name: "Ural", group: "EAST" },

  // Lakes — North
  { type: "LAKE", name: "Lake Peipus", group: "NORTH" },
  { type: "LAKE", name: "Lake Päijänne", group: "NORTH" },
  { type: "LAKE", name: "Lake Vättern", group: "NORTH" },
  { type: "LAKE", name: "Lake Ladoga", group: "NORTH" },

  // Lakes — South
  { type: "LAKE", name: "Lake Shkodër", group: "SOUTH" },
  { type: "LAKE", name: "Lake Ohrid", group: "SOUTH" },
  { type: "LAKE", name: "Lake Prespa", group: "SOUTH" },
  { type: "LAKE", name: "Lake Skadar", group: "SOUTH" },

  // Lakes — Central
  { type: "LAKE", name: "Lake Neusiedl", group: "CENTRAL" },
  { type: "LAKE", name: "Lake Bled", group: "CENTRAL" },
  { type: "LAKE", name: "Masurian Lakes", group: "CENTRAL" },

  // Lakes — East
  { type: "LAKE", name: "Lake Sevan", group: "EAST" },

  // Mountains — North
  { type: "MOUNTAIN", name: "Scandinavian Mountains", group: "NORTH" },

  // Mountains — South
  { type: "MOUNTAIN", name: "Albanian Alps", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Pindus Mountains", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Balkan Mountains", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Rhodope Mountains", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Dinaric Alps", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Šar Mountains", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Troodos Mountains", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Apennines", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Mount Vesuvius", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Mount Olympus", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Mount Triglav", group: "SOUTH" },
  { type: "MOUNTAIN", name: "Mount Titano", group: "SOUTH" },

  // Mountains — West
  { type: "MOUNTAIN", name: "Pyrenees", group: "WEST" },
  { type: "MOUNTAIN", name: "Massif Central", group: "WEST" },
  { type: "MOUNTAIN", name: "Wicklow Mountains", group: "WEST" },
  { type: "MOUNTAIN", name: "Scottish Highlands", group: "WEST" },

  // Mountains — Central
  { type: "MOUNTAIN", name: "Carpathian Mountains", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "High Tatras", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "Sudetes", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "Ore Mountains", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "Julian Alps", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "Jura Mountains", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "Mont Blanc", group: "CENTRAL" },
  { type: "MOUNTAIN", name: "Matterhorn", group: "CENTRAL" },

  // Mountains — East
  { type: "MOUNTAIN", name: "Greater Caucasus", group: "EAST" },
  { type: "MOUNTAIN", name: "Lesser Caucasus", group: "EAST" },
  { type: "MOUNTAIN", name: "Armenian Highlands", group: "EAST" },
  { type: "MOUNTAIN", name: "Pontic Mountains", group: "EAST" },
  { type: "MOUNTAIN", name: "Taurus Mountains", group: "EAST" },
  { type: "MOUNTAIN", name: "Crimean Mountains", group: "EAST" },
  { type: "MOUNTAIN", name: "Mount Elbrus", group: "EAST" },
  { type: "MOUNTAIN", name: "Mount Aragats", group: "EAST" },
  { type: "MOUNTAIN", name: "Mount Ararat", group: "EAST" },
];

const gameMissions = [
  {
    title: "Escape to the North",
    description:
      "Head north and avoid everything coming from the south.",
    correctGroup: "NORTH",
    wrongGroup: "SOUTH",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Mediterranean Sprint",
    description:
      "Race toward the south and avoid items from the north.",
    correctGroup: "SOUTH",
    wrongGroup: "NORTH",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Western Route",
    description:
      "Follow the route west and watch out for items from the east.",
    correctGroup: "WEST",
    wrongGroup: "EAST",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Heading East",
    description:
      "Move east and avoid items coming from the west.",
    correctGroup: "EAST",
    wrongGroup: "WEST",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Central Passage",
    description:
      "Stay in the heart of Europe and avoid items from the south.",
    correctGroup: "CENTRAL",
    wrongGroup: "SOUTH",
    gameType: "ROAD_RACE" as const,
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

  let addedItemsCount = 0;

  await prisma.$transaction(async (tx) => {
    // WARNING:
    // Enable these delete operations only when you
    // intentionally want to reset the game data.
    // Existing sessions and spawns may prevent deletion.

    // await tx.gameMission.deleteMany({
    //   where: {
    //     lessonId: lesson.id,
    //   },
    // });

    // await tx.gameItem.deleteMany({
    //   where: {
    //     lessonId: lesson.id,
    //   },
    // });

    // Fetch existing items to prevent duplicates.
    const existingItems = await tx.gameItem.findMany({
      where: {
        lessonId: lesson.id,
      },
      select: {
        type: true,
        name: true,
        group: true,
      },
    });

    const existingItemKeys = new Set(
      existingItems.map((item) =>
        JSON.stringify([
          item.type,
          item.name,
          item.group,
        ])
      )
    );

    // Keep only items that do not already exist.
    const newItems = gameItems.filter((item) =>
      !existingItemKeys.has(
        JSON.stringify([
          item.type,
          item.name,
          item.group,
        ])
      )
    );

    addedItemsCount = newItems.length;

    if (newItems.length > 0) {
      await tx.gameItem.createMany({
        data: newItems.map((item) => ({
          lessonId: lesson.id,
          type: item.type,
          name: item.name,
          group: item.group,
        })),
      });
    }

    // Enable this section only when intentionally
    // creating missions for this lesson.

    // await tx.gameMission.createMany({
    //   data: gameMissions.map((mission) => ({
    //     lessonId: lesson.id,
    //     title: mission.title,
    //     description: mission.description,
    //     correctGroup: mission.correctGroup,
    //     wrongGroup: mission.wrongGroup,
    //     gameType: mission.gameType,
    //   })),
    // });
  });

  console.log(
    `Added ${addedItemsCount} new game items for "${lesson.title}".`,
  );

  // console.log(
  //   `Seeded ${gameMissions.length} game missions for "${lesson.title}".`,
  // );
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
