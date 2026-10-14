import { useEffect, useRef } from "react";

import useGameAudio from "../../../hooks/games/useGameAudio";

import type { RoadRaceGame } from "../../../types/games/roadRace.types";
import type { GameSprite } from "../../../types/games/roadRace.types";

import formulaCarUrl from "../../../assets/games/road-race/images/formula-car.svg";
import enemyCarUrl from "../../../assets/games/road-race/images/formula-enemy-car.svg";
import fuelCanUrl from "../../../assets/games/road-race/images/fuel-can.svg";

import engineLevel1 from "../../../assets/games/road-race/sounds/engine-level-1.mp3";
import engineLevel2 from "../../../assets/games/road-race/sounds/engine-level-2.mp3";
import engineLevel3 from "../../../assets/games/road-race/sounds/engine-level-3.mp3";
import engineLevel4 from "../../../assets/games/road-race/sounds/engine-level-4.mp3";
import engineLevel5 from "../../../assets/games/road-race/sounds/engine-level-5.mp3";
import engineLevel6 from "../../../assets/games/road-race/sounds/engine-level-6.mp3";
import engineLevel7 from "../../../assets/games/road-race/sounds/engine-level-7.mp3";
import correctSound from "../../../assets/games/road-race/sounds/correct.mp3";
import wrongSound from "../../../assets/games/road-race/sounds/wrong.mp3";
import collisionSound from "../../../assets/games/road-race/sounds/collision.mp3";

type RoadRaceCanvasProps = {
  width: number;
  height: number;
  game: RoadRaceGame;
  scoreTextRef: React.RefObject<HTMLSpanElement | null>;
  fuelBarRef: React.RefObject<HTMLDivElement | null>;
  playerDirectionRef: React.RefObject<"left" | "right" | null>;
};

type RoadStrip = {
  y: number;
  height: number;
  centerX: number;
  roadWidth: number;
  color: string;
};

const CAR_ASPECT_RATIO = 80 / 140;
const CAR_WIDTH_RATIO = 0.05;
const MOBILE_CAR_WIDTH_RATIO = 0.07;
const PLAYER_MOVE_SPEED = 400;

const FUEL_SIZE_RATIO = 0.05;
const MOBILE_FUEL_SIZE_RATIO = 0.06;

const ITEM_LABEL_GAP = 2;
const ITEM_LABEL_FONT_RATIO = 0.018;
const MIN_ITEM_LABEL_FONT_SIZE = 12;

const ROAD_WIDTH_RATIO = 0.58;
const ROAD_STRIPE_HEIGHT = 30;
const CENTER_STEP_RATIO = 0.02;
const MAX_CENTER_OFFSET_RATIO = 0.22;
const MIN_LEFT_LANDSCAPE_WIDTH_RATIO = 0.06;
const SPEEDS = [250, 300, 350, 400, 450, 500, 550];
const PAIRS_PER_SPEED = 200;
const MAX_DELTA_TIME = 0.05;

const ITEM_SPAWN_INTERVALS = [3.5, 3.0, 2.5, 2.0, 1.5, 1, 0.8];
const ENEMY_CAR_SPAWN_INTERVALS = [2.2, 1.6, 1.2, 0.8, 0.5, 0.3, 0.2];
const ENEMY_CAR_SPAWN_OFFSET = 0;
const ENEMY_COLLISION_WIDTH_RATIO = 0.75;
const ENEMY_COLLISION_HEIGHT_RATIO = 0.9;

const SCORE_PER_SECOND = 60;
const FUEL_DRAIN_INTERVAL = 1;
const CORRECT_ITEM_FUEL = 10;
const WRONG_ITEM_FUEL = 10;
const CORRECT_ITEM_SCORE = 100;
const ENEMY_CAR_FUEL = 10;
const LANDSCAPE_COLLISION_FUEL = 10;
const LANDSCAPE_COLLISION_COOLDOWN = 0.4;
const ENEMY_COLLISION_COOLDOWN = 0.5;
const COLLISION_PUSH_DURATION = 0.15;
const COLLISION_PUSH_SPEED = 320;

const MOBILE_SCREEN = 640;

const ROAD_COLORS = [{roadColor: "#b91c1c"}, {roadColor: "#38bdf8"}, {roadColor: "#7c3aed"},
  {roadColor: "#f9bc16"}, {roadColor: "#059669"}, {roadColor: "#2563eb"}, {roadColor: "#050113"}];

const engineSounds = [engineLevel1, engineLevel2, engineLevel3, engineLevel4, engineLevel5,
  engineLevel6, engineLevel7,
];

const lessonSounds = [correctSound, wrongSound, collisionSound];

const getRandomInt = (min: number, max: number,) =>
  Math.floor(Math.random() * (max - min + 1), ) + min;

const getRandomDirection = () => {
  const directions = [-1, 0, 1];

  return directions[
    getRandomInt(
      0,
      directions.length - 1,
    )
  ];
};

const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1;i > 0;i--) {
    const j = Math.floor(
      Math.random() * (i + 1),
    );

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const isColliding = (playerLeft: number, playerRight: number, playerTop: number, 
  playerBottom: number, item: GameSprite, collisionWidth: number, 
  collisionHeight: number, spriteWidth: number, spriteHeight: number,) => {
  
  const spriteLeft = item.x - spriteWidth / 2;
  const spriteTop = item.y;

  const itemLeft = spriteLeft + (spriteWidth - collisionWidth) / 2;

  const itemTop = spriteTop + (spriteHeight - collisionHeight) / 2;

  const itemRight = itemLeft + collisionWidth;
  const itemBottom = itemTop + collisionHeight;

  return (
    playerLeft < itemRight &&
    playerRight > itemLeft &&
    playerTop < itemBottom &&
    playerBottom > itemTop
  );
};

const getSpawnX = (canvas: HTMLCanvasElement, road: RoadStrip[], spawnY: number, objectWidth: number,
  objectHeight: number,) => {
  const minLandscapeWidth = canvas.width * MIN_LEFT_LANDSCAPE_WIDTH_RATIO;

  const intersectingStrips = road.filter(
    (strip) =>
      spawnY < strip.y + strip.height &&
      spawnY + objectHeight > strip.y,
  );

  if (intersectingStrips.length === 0) {
    return canvas.width / 2;
  }

  let minX = 0;
  let maxX = canvas.width;

  for (const strip of intersectingStrips) {
    let roadLeft = strip.centerX - strip.roadWidth / 2;
    let roadRight = strip.centerX + strip.roadWidth / 2;
    roadLeft = Math.min(Math.max(roadLeft, minLandscapeWidth), canvas.width - minLandscapeWidth,);
    roadRight = Math.max(Math.min(roadRight, canvas.width - minLandscapeWidth), minLandscapeWidth,);
    minX = Math.max(minX, roadLeft + objectWidth / 2,);
    maxX = Math.min(maxX, roadRight - objectWidth / 2,);
  }

  if (maxX <= minX) {
    return (minX + maxX) / 2;
  }

  return minX + Math.random() * (maxX - minX);
};

const RoadRaceCanvas = ({width, height, game, scoreTextRef, fuelBarRef, playerDirectionRef }: RoadRaceCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let score = 0;
  let fuel = 100;
  let fuelTimer = 0;
  let enemyCarSpawnTimer = 0;

  let collisionPushTimer = 0;
  let collisionPushDirection = 0;
  let landscapeCollisionCooldown = 0;
  let gameOver = false;

  const {preload, playLoop, playOneShot, stop, stopAll, } = useGameAudio();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || width <= 0 || height <= 0) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let isActive = true;

    // player
    const carWidth = canvas.width < MOBILE_SCREEN
      ? canvas.width * MOBILE_CAR_WIDTH_RATIO
      : canvas.width * CAR_WIDTH_RATIO;
    const carHeight = carWidth / CAR_ASPECT_RATIO;

    const enemyCollisionWidth = carWidth * ENEMY_COLLISION_WIDTH_RATIO;
    const enemyCollisionHeight = carHeight * ENEMY_COLLISION_HEIGHT_RATIO;

    let playerX = canvas.width / 2;
    const playerY = canvas.height - carHeight - 10;

    let enemyCollisionCooldown = 0;

    const roadWidth = canvas.width * ROAD_WIDTH_RATIO;
    const centerX = canvas.width / 2;
    const centerStep = Math.max(1, Math.round(canvas.width * CENTER_STEP_RATIO,),);
    const maxCenterOffset = canvas.width * MAX_CENTER_OFFSET_RATIO;
    let currentCenterX = centerX;
    let targetCenterX = centerX;
    let generatedStrips = 0;
    let speedLevel = 0;
    let currentRoadColors = ROAD_COLORS[0];
    let currentColorIndex = 0;
    let colorGroupRemaining = getRandomInt(1, 4);
    let animationFrameId = 0;
    let lastTime = performance.now();

    const road: RoadStrip[] = [];
    const roadItems: GameSprite[] = [];
    const enemyPushStates = new Map<string,{
        timer: number;
        direction: number;
      }
    >();
    
    const itemPool = shuffle([...game.correctItems, ...game.wrongItems, ]);
    let nextItemIndex = 0;
    let itemSpawnTimer = 0;

    const chooseNextTarget = () => {
      const direction =
        getRandomDirection();

      targetCenterX =
        currentCenterX +
        direction *
          centerStep;

      const minCenter =
        centerX -
        maxCenterOffset;

      const maxCenter =
        centerX +
        maxCenterOffset;

      targetCenterX =
        Math.max(
          minCenter,
          Math.min(
            targetCenterX,
            maxCenter,
          ),
        );
    };

    const createRoadStrip = (y: number, ): RoadStrip => {
      if (Math.abs(targetCenterX - currentCenterX,) <= centerStep) {
        currentCenterX = targetCenterX;
        chooseNextTarget();
      } else if (targetCenterX > currentCenterX ) {
        currentCenterX += centerStep;
      } else {
        currentCenterX -= centerStep;
      }

      const color = currentRoadColors.roadColor;

      colorGroupRemaining--;

      if (colorGroupRemaining === 0) {
        currentColorIndex++;
        colorGroupRemaining = getRandomInt(1, 4);
      }

      generatedStrips++;

      return {
        y,
        height: ROAD_STRIPE_HEIGHT,
        centerX: currentCenterX,
        roadWidth,
        color,
      };
    };

    const getRoadAtY = (
      y: number,
    ): RoadStrip | null => {
      let closestStrip: RoadStrip | null = null;
      let closestDistance = Infinity;

      for (const strip of road) {
        const distance = Math.abs(
          strip.y - y,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestStrip = strip;
        }
      }

      return closestStrip;
    };

    const spawnRoadItem = () => {
      if (itemPool.length === 0) {
        return;
      }

      const item = itemPool[nextItemIndex];
      nextItemIndex++;

      if (nextItemIndex >= itemPool.length) {
        nextItemIndex = 0;
      }

      const size = canvas.width < MOBILE_SCREEN
        ? canvas.width * MOBILE_FUEL_SIZE_RATIO
        : canvas.width * FUEL_SIZE_RATIO;

      const spawnY = -size - ITEM_LABEL_GAP - 10;
      const roadStrip = getRoadAtY(spawnY);

      if (!roadStrip) {
        return;
      }

      const x = getSpawnX(canvas, road, spawnY, size, size, );

      roadItems.push({
        itemId: item.id,
        name: item.name,
        type: "lesson-item",
        isCorrect: item.isCorrect,
        x,
        y: spawnY,
        size,
      });
    };

    const spawnEnemyCar = () => {
      const size = carWidth;
      const spawnY = -carHeight - ENEMY_CAR_SPAWN_OFFSET;
      const roadStrip = getRoadAtY(spawnY);

      if (!roadStrip) return;

      const x = getSpawnX(canvas, road, spawnY, carWidth, carHeight,);

      roadItems.push({
        itemId: `enemy-${Date.now()}-${Math.random()}`,
        type: "enemy-car",
        x,
        y: spawnY,
        size,
      });
    };

    const changeColorPalette = (level: number,) => {
      currentRoadColors = ROAD_COLORS[level % ROAD_COLORS.length];
      currentColorIndex = 0;
      colorGroupRemaining = getRandomInt(1, 4);
    };

    /*Generate enough road strips to cover the whole canvas. */
    let y = -ROAD_STRIPE_HEIGHT;

    while (y < canvas.height) {
      road.push(createRoadStrip(y));
      y += ROAD_STRIPE_HEIGHT;
    }

    /* Start the road near the center.*/
    currentCenterX = centerX;
    targetCenterX = centerX;

    chooseNextTarget();
    
    const drawGameOverOverlay = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.65)";

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      context.fillStyle = "#ffffff";

      context.textAlign = "center";
      context.textBaseline = "middle";

      context.font = "bold 42px sans-serif";

      context.fillText(
        "Game Over",
        canvas.width / 2,
        canvas.height / 2 - 30,
      );

      context.font = "bold 22px sans-serif";

      context.fillText(
        `Score: ${Math.floor(score)
          .toString()
          .padStart(6, "0")}`,
        canvas.width / 2,
        canvas.height / 2 + 25,
      );
    };

    const draw = () => {
      //const fuelSize = canvas.width * FUEL_SIZE_RATIO;
      context.clearRect(0, 0, canvas.width, canvas.height,);
      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height,);
      const minLandscapeWidth = canvas.width * MIN_LEFT_LANDSCAPE_WIDTH_RATIO;

      for (
        const strip of road
      ) {
        const stripY = Math.floor(strip.y); 
        const stripHeight = Math.ceil(strip.height) + 1;

        let roadLeft = strip.centerX - strip.roadWidth / 2;
        let roadRight = strip.centerX + strip.roadWidth / 2;

        /* Keep a guaranteed minimum landscape width on the left. */
        roadLeft = Math.min(Math.max(roadLeft, minLandscapeWidth,), canvas.width - minLandscapeWidth,);

        /* Keep a guaranteed minimum landscape width on the right. */
        roadRight = Math.max(Math.min(roadRight, canvas.width - minLandscapeWidth, ),
            minLandscapeWidth,
          );

        context.fillStyle = strip.color;

        /* Left landscape.*/
        context.fillRect(0, stripY, roadLeft, stripHeight,);

        /* Right landscape. */
        context.fillRect(roadRight, stripY, canvas.width - roadRight, stripHeight,);
      }
      
      /* enemy cars moving */
      for (const item of roadItems) {
        if (item.type === "enemy-car" && enemyCarLoaded) {
          context.drawImage(enemyCarImage, item.x - carWidth / 2, item.y, carWidth, carHeight,);
        }
      }

      /* lesson items moving */
      for (const item of roadItems) {
        if (item.type === "lesson-item") {
          context.font = `bold ${Math.max(
            MIN_ITEM_LABEL_FONT_SIZE,
            canvas.width * ITEM_LABEL_FONT_RATIO,
          )}px sans-serif`;
          context.textAlign = "center";
          context.textBaseline = "bottom";
          context.fillStyle = "#ffffff";
          context.fillText(item.name ?? "", item.x, item.y - ITEM_LABEL_GAP,);
          context.drawImage(fuelImage, item.x - item.size / 2, item.y, item.size, item.size, );
        }
      }

      /* player movement */
      context.drawImage(carImage, playerX - carWidth / 2, playerY, carWidth, carHeight, );

      if (gameOver) {
        drawGameOverOverlay();
      }
    };

    const handleKeyDown = (event: KeyboardEvent,) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();
      playerDirectionRef.current = event.key === "ArrowLeft" ? "left" : "right";
    };

    const handleKeyUp = (event: KeyboardEvent,) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      playerDirectionRef.current = null;
    };

    window.addEventListener("keydown", handleKeyDown,);
    window.addEventListener("keyup", handleKeyUp,);

    const gameLoop = (currentTime: number) => {
      if (!isActive || gameOver) {
         return;
      }

      const rawDeltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const deltaTime = Math.min(rawDeltaTime, MAX_DELTA_TIME,);
      const speed = SPEEDS[speedLevel];
      const movement = speed * deltaTime;
      
      if (enemyCollisionCooldown > 0) {
        enemyCollisionCooldown = Math.max(0, enemyCollisionCooldown - deltaTime,);
      }

      if (landscapeCollisionCooldown > 0) {
        landscapeCollisionCooldown = Math.max(0, landscapeCollisionCooldown - deltaTime,);
      }

      if (collisionPushTimer > 0) {
        collisionPushTimer = Math.max(0, collisionPushTimer - deltaTime,);
      }

      let movementDirection = 0;

      if (collisionPushTimer > 0) {
        movementDirection = collisionPushDirection;
      } else {
        if (playerDirectionRef.current === "left") {
          movementDirection = -1;
        }

        if (playerDirectionRef.current === "right") {
          movementDirection = 1;
        }
      }

      playerX += movementDirection * (collisionPushTimer > 0
          ? COLLISION_PUSH_SPEED
          : PLAYER_MOVE_SPEED) *
        deltaTime;

      score += SCORE_PER_SECOND * deltaTime;

      if (scoreTextRef.current) {
        scoreTextRef.current.innerText = Math.floor(score).toString().padStart(6, "0");
      }

      if (fuelBarRef.current) {
        fuelBarRef.current.style.width = `${fuel}%`;

        if (fuel <= 25) {
          fuelBarRef.current.className =
            "h-full rounded-full bg-red-500 transition-colors";
        } else if (fuel <= 50) {
          fuelBarRef.current.className =
            "h-full rounded-full bg-yellow-500 transition-colors";
        } else {
          fuelBarRef.current.className =
            "h-full rounded-full bg-green-500 transition-colors";
        }
      }

      enemyCarSpawnTimer += deltaTime;

      const enemyCarSpawnInterval = ENEMY_CAR_SPAWN_INTERVALS[speedLevel] ??
        ENEMY_CAR_SPAWN_INTERVALS[ENEMY_CAR_SPAWN_INTERVALS.length - 1];

      if (enemyCarSpawnTimer >= enemyCarSpawnInterval) {
        enemyCarSpawnTimer = 0;
        spawnEnemyCar();
      }

      fuelTimer += deltaTime;

      if (fuelTimer >= FUEL_DRAIN_INTERVAL) {
        fuel -= 1;
        fuelTimer = 0;
      }

      /* Move every road strip toward the player. */
      for (const strip of road) {
        strip.y += movement;
      }

      /* Move road items toward the player. */
      for (const item of roadItems) {
        item.y += movement;
      }

      for (const item of roadItems) {
        if (item.type !== "enemy-car") {
          continue;
        }

        const pushState = enemyPushStates.get(item.itemId,);

        if (!pushState) {
          continue;
        }

        item.x += pushState.direction * COLLISION_PUSH_SPEED * deltaTime;
        pushState.timer -= deltaTime;

        if (pushState.timer <= 0) {
          enemyPushStates.delete(
            item.itemId,
          );
        }
      }

      /* Remove road items that have left the screen. */
      const visibleItems = roadItems.filter(
          (item) =>
            item.y <
            canvas.height + item.size,
        );

      roadItems.length = 0;
      roadItems.push(...visibleItems);

      /* Remove strips that have completely left the screen. */
      const visibleRoad = road.filter((strip) => strip.y < canvas.height, );
      road.length = 0;
      road.push(...visibleRoad,);

      /* Find the highest road strip.*/
      let highestY = 0;

      for (const strip of road) {
        if (strip.y < highestY) {
          highestY = strip.y;
        }
      }

      /* Generate new road strips above the screen. */
      while (highestY > -ROAD_STRIPE_HEIGHT) {
        const newStripY = highestY - ROAD_STRIPE_HEIGHT;

        road.unshift(createRoadStrip(newStripY, ),);
        highestY = newStripY;
      }

      /* Change speed every fixed number of generated strips. */
      const newSpeedLevel = Math.floor(generatedStrips / PAIRS_PER_SPEED, ) % SPEEDS.length;

      if (newSpeedLevel !== speedLevel) {
        speedLevel = newSpeedLevel;
        changeColorPalette(speedLevel);
        void playLoop("engine", engineSounds[speedLevel], 0.1);
      }

      itemSpawnTimer += deltaTime;

      const itemSpawnInterval = ITEM_SPAWN_INTERVALS[speedLevel];

      if (itemSpawnTimer >= itemSpawnInterval) {
        itemSpawnTimer = 0;
        spawnRoadItem();
      }

      const playerLeft = playerX - carWidth / 2;
      const playerRight = playerX + carWidth / 2;
      const playerTop = playerY;
      const playerBottom = playerY + carHeight;

      for (const item of roadItems) {
        if (item.type !== "enemy-car") {
          continue;
        }

        const collision = isColliding(playerLeft, playerRight, playerTop, playerBottom, item,
          enemyCollisionWidth, enemyCollisionHeight, carWidth, carHeight,
        );

        if (!collision || enemyCollisionCooldown > 0) {
          continue;
        }

        fuel = Math.max(0, fuel - ENEMY_CAR_FUEL,);
        enemyCollisionCooldown = ENEMY_COLLISION_COOLDOWN;
        void playOneShot("collision", collisionSound, 0.3);

        /* Push the player away from the enemy. */
        const playerPushDirection = playerX < item.x ? -1 : 1;
        collisionPushDirection = playerPushDirection;
        collisionPushTimer = COLLISION_PUSH_DURATION;

        /* Push the enemy in the opposite direction, unless that would send
         it outside the road. */
        const enemyPushDirection = playerX < item.x ? 1 : -1;
        const roadStrip = getRoadAtY(item.y + item.size / 2,);
        let finalEnemyPushDirection = enemyPushDirection;

        if (roadStrip) {
          const roadLeft = roadStrip.centerX - roadStrip.roadWidth / 2;
          const roadRight = roadStrip.centerX + roadStrip.roadWidth / 2;
          const enemyHalfWidth = item.size / 2;
          const pushDistance = COLLISION_PUSH_SPEED * COLLISION_PUSH_DURATION;
          const proposedEnemyX = item.x + enemyPushDirection * pushDistance;
          const proposedLeft = proposedEnemyX - enemyHalfWidth;
          const proposedRight = proposedEnemyX + enemyHalfWidth;

          if (proposedLeft < roadLeft || proposedRight > roadRight) {
            const alternativeDirection = -enemyPushDirection;
            const alternativeX = item.x + alternativeDirection * pushDistance;
            const alternativeLeft = alternativeX - enemyHalfWidth;
            const alternativeRight = alternativeX + enemyHalfWidth;

            if (alternativeLeft >= roadLeft && alternativeRight <= roadRight) {
              finalEnemyPushDirection = alternativeDirection;
            } else {
              finalEnemyPushDirection = 0;
            }
          }
        }

        if (finalEnemyPushDirection !== 0) {
          enemyPushStates.set(
            item.itemId,
            {
              timer: COLLISION_PUSH_DURATION,
              direction: finalEnemyPushDirection,
            },
          );
        }
      }

      /* add score or subtract fuel in case of collision */
      for (let i = roadItems.length - 1;i >= 0;i -= 1) {
        const item = roadItems[i];
        if (item.type !== "lesson-item") {
          continue;
        }

        const collision = isColliding(playerLeft, playerRight, playerTop, playerBottom, item,
          item.size, item.size, item.size, item.size,
        );

        if (!collision) {
          continue;
        }

        if (item.isCorrect) {
          void playOneShot("correct", correctSound, 0.3);
          fuel = Math.min(100, fuel + CORRECT_ITEM_FUEL,);
          score += CORRECT_ITEM_SCORE;
        } else {
          void playOneShot("wrong", wrongSound, 0.3);
          fuel = Math.max(0, fuel - WRONG_ITEM_FUEL,);
        }

        /* remove the item */
        roadItems.splice(i, 1);
      }

      const playerRoadStrip = getRoadAtY(playerY + carHeight / 2,);

      if (playerRoadStrip) {
        const roadLeft = playerRoadStrip.centerX - playerRoadStrip.roadWidth / 2;
        const roadRight = playerRoadStrip.centerX + playerRoadStrip.roadWidth / 2;

        if (landscapeCollisionCooldown <= 0 ) {
          if (playerLeft < roadLeft) {
            playerX = roadLeft + carWidth / 2;
            fuel = Math.max(0, fuel - LANDSCAPE_COLLISION_FUEL,);
            void playOneShot("collision", collisionSound, 0.3);
            collisionPushDirection = 1;
            collisionPushTimer = COLLISION_PUSH_DURATION;
            landscapeCollisionCooldown = LANDSCAPE_COLLISION_COOLDOWN;
          } else if (playerRight > roadRight) {
            playerX = roadRight - carWidth / 2;
            fuel = Math.max(0, fuel - LANDSCAPE_COLLISION_FUEL,);
            void playOneShot("collision", collisionSound, 0.3);
            collisionPushDirection = -1;
            collisionPushTimer = COLLISION_PUSH_DURATION;
            landscapeCollisionCooldown = LANDSCAPE_COLLISION_COOLDOWN;
          }
        }
      }

      /* Final canvas safety clamp. */
      playerX = Math.max(carWidth / 2, Math.min(canvas.width - carWidth / 2, playerX),);

      if (fuelBarRef.current) {
        fuelBarRef.current.style.width = `${fuel}%`;

        if (fuel <= 25) {
          fuelBarRef.current.className =
            "h-full rounded-full bg-red-500 transition-colors";
        } else if (fuel <= 50) {
          fuelBarRef.current.className =
            "h-full rounded-full bg-yellow-500 transition-colors";
        } else {
          fuelBarRef.current.className =
            "h-full rounded-full bg-green-500 transition-colors";
        }
      }

      if (fuel <= 0) {
        fuel = 0;
        gameOver = true;
        stop("engine");
      }

      draw();

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    const carImage = new Image();
    const enemyCarImage = new Image();
    let enemyCarLoaded = false;
    const fuelImage = new Image();

    let carLoaded = false;
    let fuelLoaded = false;
    let isStarting = false;

    const startGame = async () => {
      if (!isActive || isStarting || !carLoaded || !fuelLoaded || !enemyCarLoaded) {
        return;
      }

      isStarting = true;

      try {
        await preload(engineSounds);
        await preload(lessonSounds);
        
        if (!isActive) {
          return;
        }

        void playLoop("engine", engineSounds[0], 0.1);

        draw();
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error("Failed to preload engine sounds:", error);
      }
    };

    carImage.onload = () => {
      carLoaded = true;
      startGame();
    };

    carImage.onerror = () => {
      console.error(
        "Failed to load Road Race car image.",
      );
    };
    
    carImage.src = formulaCarUrl;

    enemyCarImage.onload = () => {
      enemyCarLoaded = true;
      startGame();
    };

    enemyCarImage.onerror = () => {
      console.error("Failed to load enemy car image.");
    };

    enemyCarImage.src = enemyCarUrl;

    fuelImage.onload = () => {
      fuelLoaded = true;
      startGame();
    };

    fuelImage.onerror = () => {
      console.error(
        "Failed to load Road Race fuel image.",
      );
    };

    fuelImage.src = fuelCanUrl;

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      stopAll();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      playerDirectionRef.current = null;
    };
  }, [width, height, game, scoreTextRef, fuelBarRef, playerDirectionRef,
      preload, playLoop, stopAll,]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block h-auto w-auto max-h-full max-w-full"
      aria-label="Road Race game"
    />
  );
};

export default RoadRaceCanvas;