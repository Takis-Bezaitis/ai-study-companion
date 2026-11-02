import prisma from "../lib/prismaClient.js";

const lessonTitle = "Inventions & Discoveries";

const gameItems = [
    // ANCIENT
    { type: "INVENTION", name: "Stone Hand Axe", group: "ANCIENT" },
    { type: "INVENTION", name: "Bow and Arrow", group: "ANCIENT" },
    { type: "INVENTION", name: "Fishing Hook", group: "ANCIENT" },
    { type: "INVENTION", name: "Wheel", group: "ANCIENT" },
    { type: "INVENTION", name: "Pulley", group: "ANCIENT" },
    { type: "INVENTION", name: "Lever", group: "ANCIENT" },
    { type: "INVENTION", name: "Archimedean Screw", group: "ANCIENT" },
    { type: "INVENTION", name: "Plow", group: "ANCIENT" },
    { type: "INVENTION", name: "Abacus", group: "ANCIENT" },
    { type: "INVENTION", name: "Papyrus", group: "ANCIENT" },
    { type: "INVENTION", name: "Sundial", group: "ANCIENT" },
    { type: "INVENTION", name: "Water Clock", group: "ANCIENT" },
    { type: "INVENTION", name: "Aqueduct", group: "ANCIENT" },
    { type: "INVENTION", name: "Concrete", group: "ANCIENT" },
    { type: "INVENTION", name: "Sailing Ship", group: "ANCIENT" },
    { type: "INVENTION", name: "Stone Knife", group: "ANCIENT" },
    { type: "INVENTION", name: "Flint Scraper", group: "ANCIENT" },
    { type: "INVENTION", name: "Spear", group: "ANCIENT" },
    { type: "INVENTION", name: "Harpoon", group: "ANCIENT" },
    { type: "INVENTION", name: "Bone Needle", group: "ANCIENT" },
    { type: "INVENTION", name: "Pottery", group: "ANCIENT" },
    { type: "INVENTION", name: "Seed Drill", group: "ANCIENT" },
    { type: "INVENTION", name: "Irrigation Canals", group: "ANCIENT" },
    { type: "INVENTION", name: "Shaduf", group: "ANCIENT" },
    { type: "INVENTION", name: "Quern", group: "ANCIENT" },
    { type: "INVENTION", name: "Millstone", group: "ANCIENT" },
    { type: "INVENTION", name: "Sickle", group: "ANCIENT" },
    { type: "INVENTION", name: "Scythe", group: "ANCIENT" },
    { type: "INVENTION", name: "Cuneiform Writing", group: "ANCIENT" },
    { type: "INVENTION", name: "Egyptian Hieroglyphs", group: "ANCIENT" },
    { type: "INVENTION", name: "Clay Tablets", group: "ANCIENT" },
    { type: "INVENTION", name: "Phoenician Alphabet", group: "ANCIENT" },
    { type: "INVENTION", name: "Arch", group: "ANCIENT" },
    { type: "INVENTION", name: "Dome", group: "ANCIENT" },
    { type: "INVENTION", name: "Roman Roads", group: "ANCIENT" },
    { type: "INVENTION", name: "Astrolabe", group: "ANCIENT" },
    { type: "INVENTION", name: "Armillary Sphere", group: "ANCIENT" },
    { type: "INVENTION", name: "Reed Boat", group: "ANCIENT" },
    { type: "INVENTION", name: "Ship Anchor", group: "ANCIENT" },

    // TRANSPORT
    { type: "INVENTION", name: "Bicycle", group: "TRANSPORT" },
    { type: "INVENTION", name: "Steam Locomotive", group: "TRANSPORT" },
    { type: "INVENTION", name: "Automobile", group: "TRANSPORT" },
    { type: "INVENTION", name: "Motorcycle", group: "TRANSPORT" },
    { type: "INVENTION", name: "Diesel Engine", group: "TRANSPORT" },
    { type: "INVENTION", name: "Electric Car", group: "TRANSPORT" },
    { type: "INVENTION", name: "Steamship", group: "TRANSPORT" },
    { type: "INVENTION", name: "Submarine", group: "TRANSPORT" },
    { type: "INVENTION", name: "Hot-air Balloon", group: "TRANSPORT" },
    { type: "INVENTION", name: "Glider", group: "TRANSPORT" },
    { type: "INVENTION", name: "Airplane", group: "TRANSPORT" },
    { type: "INVENTION", name: "Helicopter", group: "TRANSPORT" },
    { type: "INVENTION", name: "Jet Engine", group: "TRANSPORT" },
    { type: "INVENTION", name: "Rocket", group: "TRANSPORT" },
    { type: "INVENTION", name: "Space Shuttle", group: "TRANSPORT" },
    { type: "INVENTION", name: "Railway", group: "TRANSPORT" },
    { type: "INVENTION", name: "Passenger Train", group: "TRANSPORT" },
    { type: "INVENTION", name: "Freight Train", group: "TRANSPORT" },
    { type: "INVENTION", name: "Electric Locomotive", group: "TRANSPORT" },
    { type: "INVENTION", name: "Diesel Locomotive", group: "TRANSPORT" },
    { type: "INVENTION", name: "Subway", group: "TRANSPORT" },
    { type: "INVENTION", name: "High-Speed Train", group: "TRANSPORT" },
    { type: "INVENTION", name: "Maglev Train", group: "TRANSPORT" },
    { type: "INVENTION", name: "Galley", group: "TRANSPORT" },
    { type: "INVENTION", name: "Caravel", group: "TRANSPORT" },
    { type: "INVENTION", name: "Iron-Hulled Ship", group: "TRANSPORT" },
    { type: "INVENTION", name: "Steel-Hulled Ship", group: "TRANSPORT" },
    { type: "INVENTION", name: "Nuclear Submarine", group: "TRANSPORT" },
    { type: "INVENTION", name: "Container Ship", group: "TRANSPORT" },
    { type: "INVENTION", name: "Airship", group: "TRANSPORT" },
    { type: "INVENTION", name: "Seaplane", group: "TRANSPORT" },
    { type: "INVENTION", name: "Supersonic Aircraft", group: "TRANSPORT" },
    { type: "INVENTION", name: "Drone", group: "TRANSPORT" },
    { type: "INVENTION", name: "Multistage Rocket", group: "TRANSPORT" },
    { type: "INVENTION", name: "Artificial Satellite", group: "TRANSPORT" },
    { type: "INVENTION", name: "Space Capsule", group: "TRANSPORT" },
    { type: "INVENTION", name: "Space Station", group: "TRANSPORT" },
    { type: "INVENTION", name: "Lunar Lander", group: "TRANSPORT" },
    //{ type: "INVENTION", name: "Interplanetary Spacecraft", group: "TRANSPORT" }, large
    { type: "INVENTION", name: "Autonomous Vehicle", group: "TRANSPORT" },

    // COMMUNICATION
    { type: "INVENTION", name: "Writing", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Paper", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Printing Press", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Typewriter", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Telegraph", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Morse Code", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Telephone", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Radio", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Television", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Fax Machine", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Internet", group: "COMMUNICATION" },
    { type: "INVENTION", name: "World Wide Web", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Smartphone", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Bluetooth", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Email", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Postal System", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Messenger Network", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Signal Fires", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Smoke Signals", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Semaphore", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Woodblock Printing", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Movable-Type Printing", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Newspaper Printing", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Photocopier", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Laser Printer", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Digital Printing", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Wireless Telegraphy", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Radio Transmitter", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Fax Machine", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Computer Network", group: "COMMUNICATION" },
    { type: "INVENTION", name: "World Wide Web", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Instant Messaging", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Mobile Phone", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Video Calling", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Social Networking", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Satellite Communication", group: "COMMUNICATION" },
    { type: "INVENTION", name: "Wireless Networking", group: "COMMUNICATION" },

    // MEDICINE
    { type: "INVENTION", name: "Stethoscope", group: "MEDICINE" },
    { type: "INVENTION", name: "Thermometer", group: "MEDICINE" },
    { type: "INVENTION", name: "X-ray Machine", group: "MEDICINE" },
    { type: "INVENTION", name: "ECG Machine", group: "MEDICINE" },
    { type: "INVENTION", name: "Ultrasound Scanner", group: "MEDICINE" },
    { type: "INVENTION", name: "CT Scanner", group: "MEDICINE" },
    { type: "INVENTION", name: "MRI Scanner", group: "MEDICINE" },
    { type: "INVENTION", name: "Endoscope", group: "MEDICINE" },
    { type: "INVENTION", name: "Smallpox Vaccine", group: "MEDICINE" },
    { type: "INVENTION", name: "Polio Vaccine", group: "MEDICINE" },
    { type: "INVENTION", name: "Penicillin", group: "MEDICINE" },
    { type: "INVENTION", name: "Insulin Therapy", group: "MEDICINE" },
    { type: "INVENTION", name: "Anesthesia", group: "MEDICINE" },
    { type: "INVENTION", name: "Pacemaker", group: "MEDICINE" },
    { type: "INVENTION", name: "Cochlear Implant", group: "MEDICINE" },
    { type: "INVENTION", name: "Surgical Instruments", group: "MEDICINE" },
    { type: "INVENTION", name: "Splints", group: "MEDICINE" },
    { type: "INVENTION", name: "Bandages", group: "MEDICINE" },
    { type: "INVENTION", name: "Prosthetic Limbs", group: "MEDICINE" },
    { type: "INVENTION", name: "Dental Tools", group: "MEDICINE" },
    { type: "INVENTION", name: "Blood Pressure Monitor", group: "MEDICINE" },
    { type: "INVENTION", name: "Otoscope", group: "MEDICINE" },
    { type: "INVENTION", name: "Ophthalmoscope", group: "MEDICINE" },
    { type: "INVENTION", name: "Endoscope", group: "MEDICINE" },
    { type: "INVENTION", name: "Blood Transfusion", group: "MEDICINE" },
    { type: "INVENTION", name: "Dialysis", group: "MEDICINE" },
    { type: "INVENTION", name: "Chemotherapy", group: "MEDICINE" },
    { type: "INVENTION", name: "Organ Transplantation", group: "MEDICINE" },
    { type: "INVENTION", name: "Robotic Surgery", group: "MEDICINE" },
    { type: "INVENTION", name: "Artificial Heart", group: "MEDICINE" },
    { type: "INVENTION", name: "Cochlear Implant", group: "MEDICINE" },
    { type: "INVENTION", name: "Laser Surgery", group: "MEDICINE" },
    //{ type: "INVENTION", name: "3D-Printed Prosthetics", group: "MEDICINE" }, large
    { type: "INVENTION", name: "Gene Therapy", group: "MEDICINE" },

    // ENERGY
    { type: "INVENTION", name: "Windmill", group: "ENERGY" },
    { type: "INVENTION", name: "Watermill", group: "ENERGY" },
    { type: "INVENTION", name: "Steam Engine", group: "ENERGY" },
    { type: "INVENTION", name: "Steam Turbine", group: "ENERGY" },
    { type: "INVENTION", name: "Electric Generator", group: "ENERGY" },
    { type: "INVENTION", name: "Electric Motor", group: "ENERGY" },
    { type: "INVENTION", name: "Transformer", group: "ENERGY" },
    { type: "INVENTION", name: "Electric Battery", group: "ENERGY" },
    { type: "INVENTION", name: "Nuclear Reactor", group: "ENERGY" },
    { type: "INVENTION", name: "Solar Panel", group: "ENERGY" },
    { type: "INVENTION", name: "Wind Turbine", group: "ENERGY" },
    { type: "INVENTION", name: "Fuel Cell", group: "ENERGY" },
    { type: "INVENTION", name: "Lithium-ion Battery", group: "ENERGY" },
    { type: "INVENTION", name: "Treadwheel", group: "ENERGY" },
    { type: "INVENTION", name: "Newcomen Steam Engine", group: "ENERGY" },
    { type: "INVENTION", name: "Watt Steam Engine", group: "ENERGY" },
    { type: "INVENTION", name: "Steam Turbine", group: "ENERGY" },
    { type: "INVENTION", name: "Industrial Boiler", group: "ENERGY" },
    { type: "INVENTION", name: "Dynamo", group: "ENERGY" },
    { type: "INVENTION", name: "Power Station", group: "ENERGY" },
    { type: "INVENTION", name: "Electrical Grid", group: "ENERGY" },
    //{ type: "INVENTION", name: "Hydroelectric Power Station", group: "ENERGY" }, large
    //{ type: "INVENTION", name: "Coal-Fired Power Station", group: "ENERGY" }, large
    { type: "INVENTION", name: "Oil Refinery", group: "ENERGY" },
    { type: "INVENTION", name: "Gas Turbine", group: "ENERGY" },
    { type: "INVENTION", name: "Solar Thermal Collector", group: "ENERGY" },
    { type: "INVENTION", name: "Photovoltaic Solar Cell", group: "ENERGY" },
    { type: "INVENTION", name: "Hydroelectric Turbine", group: "ENERGY" },
    { type: "INVENTION", name: "Geothermal Power Plant", group: "ENERGY" },
    { type: "INVENTION", name: "Tidal Power Generator", group: "ENERGY" },
    { type: "INVENTION", name: "Wave Energy Converter", group: "ENERGY" },
    { type: "INVENTION", name: "Biomass Energy System", group: "ENERGY" },
    { type: "INVENTION", name: "Lead-Acid Battery", group: "ENERGY" },
    { type: "INVENTION", name: "Nickel-Cadmium Battery", group: "ENERGY" },
    { type: "INVENTION", name: "Rechargeable Battery", group: "ENERGY" },
    //{ type: "INVENTION", name: "Pumped-Storage Hydroelectricity", group: "ENERGY" }, large
    //{ type: "INVENTION", name: "Grid-Scale Battery Storage", group: "ENERGY" }, large

    // COMPUTING
    { type: "INVENTION", name: "Pascaline", group: "COMPUTING" },
    { type: "INVENTION", name: "Slide Rule", group: "COMPUTING" },
    { type: "INVENTION", name: "Difference Engine", group: "COMPUTING" },
    { type: "INVENTION", name: "Analytical Engine", group: "COMPUTING" },
    { type: "INVENTION", name: "Punch-card Machine", group: "COMPUTING" },
    { type: "INVENTION", name: "Colossus", group: "COMPUTING" },
    { type: "INVENTION", name: "ENIAC", group: "COMPUTING" },
    { type: "INVENTION", name: "Transistor", group: "COMPUTING" },
    { type: "INVENTION", name: "Integrated Circuit", group: "COMPUTING" },
    { type: "INVENTION", name: "Microprocessor", group: "COMPUTING" },
    { type: "INVENTION", name: "Personal Computer", group: "COMPUTING" },
    { type: "INVENTION", name: "3D Printer", group: "COMPUTING" },
    { type: "INVENTION", name: "Quantum Computer", group: "COMPUTING" },
    { type: "INVENTION", name: "Artificial Intelligence", group: "COMPUTING" },
    { type: "INVENTION", name: "Counting Board", group: "COMPUTING" },
    { type: "INVENTION", name: "Napier's Bones", group: "COMPUTING" },
    { type: "INVENTION", name: "Pascaline", group: "COMPUTING" },
    { type: "INVENTION", name: "Stepped Reckoner", group: "COMPUTING" },
    { type: "INVENTION", name: "Mechanical Calculator", group: "COMPUTING" },
    { type: "INVENTION", name: "Punch-Card Machine", group: "COMPUTING" },
    { type: "INVENTION", name: "EDVAC", group: "COMPUTING" },
    { type: "INVENTION", name: "UNIVAC I", group: "COMPUTING" },
    { type: "INVENTION", name: "Mainframe Computer", group: "COMPUTING" },
    { type: "INVENTION", name: "Minicomputer", group: "COMPUTING" },
    { type: "INVENTION", name: "Transistor Computer", group: "COMPUTING" },
];

const gameMissions = [
  {
    title: "Ancient Innovation",
    description: "Collect ancient inventions and avoid modern transportation technologies.",
    correctGroup: "ANCIENT",
    wrongGroup: "TRANSPORT",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Communication Rush",
    description: "Collect communication inventions and avoid medical technologies.",
    correctGroup: "COMMUNICATION",
    wrongGroup: "MEDICINE",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Power Quest",
    description: "Collect energy technologies and avoid computing inventions.",
    correctGroup: "ENERGY",
    wrongGroup: "COMPUTING",
    gameType: "ROAD_RACE" as const,
  },
  {
    title: "Modern World",
    description: "Collect modern technologies and avoid transportation inventions.",
    correctGroup: "COMPUTING",
    wrongGroup: "TRANSPORT",
    gameType: "ROAD_RACE" as const,
  },
];

async function seedInventionsAndDiscoveries() {
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
  await seedInventionsAndDiscoveries();
} catch (error) {
  console.error(
    "Inventions & Discoveries game seed failed:",
    error,
  );

  process.exit(1);
} finally {
  await prisma.$disconnect();
}
