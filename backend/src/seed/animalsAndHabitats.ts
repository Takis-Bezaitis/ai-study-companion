import prisma from "../lib/prismaClient.js";

const lessonTitle = "Animals & Habitats";

const gameItems = [
  // GRASSLANDS (savannah and temperate grasslands)
  { type: "ANIMAL", name: "Lion", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "African elephant", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Giraffe", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Zebra", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Cheetah", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Leopard", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Spotted hyena", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Wildebeest", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "African buffalo", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Gazelle", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Warthog", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Meerkat", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Ostrich", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Secretary bird", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Vulture", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Bison", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Prairie dog", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Pronghorn", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Coyote", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Ground squirrel", group: "GRASSLANDS" },
  { type: "ANIMAL", name: "Saiga antelope", group: "GRASSLANDS" },

  // FOREST (temperate, boreal and tropical)
  { type: "ANIMAL", name: "Red fox", group: "FOREST" },
  { type: "ANIMAL", name: "Brown bear", group: "FOREST" },
  { type: "ANIMAL", name: "Gray wolf", group: "FOREST" },
  { type: "ANIMAL", name: "Deer", group: "FOREST" },
  { type: "ANIMAL", name: "Wild boar", group: "FOREST" },
  { type: "ANIMAL", name: "Squirrel", group: "FOREST" },
  { type: "ANIMAL", name: "Badger", group: "FOREST" },
  { type: "ANIMAL", name: "Hedgehog", group: "FOREST" },
  { type: "ANIMAL", name: "Owl", group: "FOREST" },
  { type: "ANIMAL", name: "Woodpecker", group: "FOREST" },
  { type: "ANIMAL", name: "Lynx", group: "FOREST" },
  { type: "ANIMAL", name: "Raccoon", group: "FOREST" },
  { type: "ANIMAL", name: "Moose", group: "FOREST" },
  { type: "ANIMAL", name: "Reindeer", group: "FOREST" },
  { type: "ANIMAL", name: "Wolverine", group: "FOREST" },
  { type: "ANIMAL", name: "Snowshoe hare", group: "FOREST" },
  { type: "ANIMAL", name: "Orangutan", group: "FOREST" },
  { type: "ANIMAL", name: "Gorilla", group: "FOREST" },
  { type: "ANIMAL", name: "Jaguar", group: "FOREST" },
  { type: "ANIMAL", name: "Sloth", group: "FOREST" },
  { type: "ANIMAL", name: "Toucan", group: "FOREST" },
  { type: "ANIMAL", name: "Parrot", group: "FOREST" },
  { type: "ANIMAL", name: "Tree frog", group: "FOREST" },
  { type: "ANIMAL", name: "Chameleon", group: "FOREST" },

  // COLD_REGIONS (polar, tundra and mountain)
  { type: "ANIMAL", name: "Arctic fox", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Arctic hare", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Caribou", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Musk ox", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Lemming", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Snowy owl", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Arctic wolf", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Polar bear", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Walrus", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Ringed seal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Bearded seal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Beluga whale", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Narwhal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Emperor penguin", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Adélie penguin", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Chinstrap penguin", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Leopard seal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Weddell seal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Crabeater seal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Southern elephant seal", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Antarctic petrel", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Snow petrel", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Orca", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Mountain goat", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Ibex", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Snow leopard", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Yak", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Marmot", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Golden eagle", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Alpine chamois", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Pika", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Andean condor", group: "COLD_REGIONS" },
  { type: "ANIMAL", name: "Himalayan tahr", group: "COLD_REGIONS" },

  // FRESHWATER (wetlands, rivers and lakes)
  { type: "ANIMAL", name: "Trout", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Salmon", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Catfish", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Pike", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Freshwater turtle", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Frog", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Salamander", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Beaver", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Otter", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Crocodile", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Alligator", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Dragonfly", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Crayfish", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Heron", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Flamingo", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Duck", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Swan", group: "FRESHWATER" },
  { type: "ANIMAL", name: "Capybara", group: "FRESHWATER" },

  // MARINE (coral reefs, open ocean and deep sea)
  { type: "ANIMAL", name: "Blue whale", group: "MARINE" },
  { type: "ANIMAL", name: "Humpback whale", group: "MARINE" },
  { type: "ANIMAL", name: "Dolphin", group: "MARINE" },
  { type: "ANIMAL", name: "Tuna", group: "MARINE" },
  { type: "ANIMAL", name: "Swordfish", group: "MARINE" },
  { type: "ANIMAL", name: "Sailfish", group: "MARINE" },
  { type: "ANIMAL", name: "Oceanic shark", group: "MARINE" },
  { type: "ANIMAL", name: "Manta ray", group: "MARINE" },
  { type: "ANIMAL", name: "Jellyfish", group: "MARINE" },
  { type: "ANIMAL", name: "Squid", group: "MARINE" },
  { type: "ANIMAL", name: "Sea turtle", group: "MARINE" },
  { type: "ANIMAL", name: "Albatross", group: "MARINE" },
  { type: "ANIMAL", name: "Clownfish", group: "MARINE" },
  { type: "ANIMAL", name: "Parrotfish", group: "MARINE" },
  { type: "ANIMAL", name: "Angelfish", group: "MARINE" },
  { type: "ANIMAL", name: "Butterflyfish", group: "MARINE" },
  { type: "ANIMAL", name: "Moray eel", group: "MARINE" },
  { type: "ANIMAL", name: "Reef shark", group: "MARINE" },
  { type: "ANIMAL", name: "Sea anemone", group: "MARINE" },
  { type: "ANIMAL", name: "Sea urchin", group: "MARINE" },
  { type: "ANIMAL", name: "Starfish", group: "MARINE" },
  { type: "ANIMAL", name: "Seahorse", group: "MARINE" },
  { type: "ANIMAL", name: "Lobster", group: "MARINE" },
  { type: "ANIMAL", name: "Sea sponge", group: "MARINE" },
  { type: "ANIMAL", name: "Anglerfish", group: "MARINE" },
  { type: "ANIMAL", name: "Giant squid", group: "MARINE" },
  { type: "ANIMAL", name: "Vampire squid", group: "MARINE" },
  { type: "ANIMAL", name: "Gulper eel", group: "MARINE" },
  { type: "ANIMAL", name: "Dumbo octopus", group: "MARINE" },
  { type: "ANIMAL", name: "Deep-sea shrimp", group: "MARINE" },
  { type: "ANIMAL", name: "Siphonophore", group: "MARINE" },
];

const gameMissions = [
  {
    title: "Grassland Sprint",
    description: "Collect grassland animals and avoid forest animals.",
    correctGroup: "GRASSLANDS",
    wrongGroup: "FOREST",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Forest Run",
    description: "Find forest animals and avoid animals from cold regions.",
    correctGroup: "FOREST",
    wrongGroup: "COLD_REGIONS",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Frozen Frontier",
    description: "Collect animals adapted to cold regions and high mountains. Avoid grassland animals.",
    correctGroup: "COLD_REGIONS",
    wrongGroup: "GRASSLANDS",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Freshwater Dash",
    description: "Collect freshwater and wetland animals while avoiding marine animals.",
    correctGroup: "FRESHWATER",
    wrongGroup: "MARINE",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Ocean Escape",
    description: "Collect marine animals and avoid grassland animals.",
    correctGroup: "MARINE",
    wrongGroup: "GRASSLANDS",
    gameType: "ROAD_RACE" as const,
  },
];


async function seedAnimalsAndHabitats() {
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

     await tx.gameMission.createMany({
       data: gameMissions.map((mission) => ({
         lessonId: lesson.id,
         title: mission.title,
         description: mission.description,
         correctGroup: mission.correctGroup,
         wrongGroup: mission.wrongGroup,
         gameType: mission.gameType,
       })),
     });
  });

  console.log(
    `Added ${addedItemsCount} new game items for "${lesson.title}".`,
  );

   console.log(
     `Seeded ${gameMissions.length} game missions for "${lesson.title}".`,
   );
}

try {
  await seedAnimalsAndHabitats();
} catch (error) {
  console.error(
    "Animals & Habitats game seed failed:",
    error,
  );

  process.exit(1);
} finally {
  await prisma.$disconnect();
}
