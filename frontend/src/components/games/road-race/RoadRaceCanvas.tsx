import { useEffect, useRef } from "react";

import formulaCarUrl from "../../../assets/games/road-race/formula-car.svg";

type RoadRaceCanvasProps = {
  width: number;
  height: number;
};

type RoadStrip = {
  y: number;
  height: number;
  centerX: number;
  roadWidth: number;
  color: string;
};

const CAR_ASPECT_RATIO = 80 / 140;

const ROAD_WIDTH_RATIO = 0.58;

const ROAD_STRIPE_HEIGHT = 30;

const CENTER_STEP_RATIO = 0.02;

const MAX_CENTER_OFFSET_RATIO = 0.22;

const SPEEDS = [
  120,
  160,
  200,
  240,
  280,
];

const PAIRS_PER_SPEED = 200;

const MAX_DELTA_TIME = 0.05;

const ROAD_COLORS = [
  {
    first: "#b91c1c",
    second: "#2563eb",
  },
  {
    first: "#dc2626",
    second: "#38bdf8",
  },
  {
    first: "#7c3aed",
    second: "#f97316",
  },
  {
    first: "#059669",
    second: "#2563eb",
  },
];

const getRandomInt = (
  min: number,
  max: number,
) =>
  Math.floor(
    Math.random() *
      (max - min + 1),
  ) + min;

const getRandomDirection = () => {
  const directions = [-1, 0, 1];

  return directions[
    getRandomInt(
      0,
      directions.length - 1,
    )
  ];
};

const RoadRaceCanvas = ({
  width,
  height,
}: RoadRaceCanvasProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (
      !canvas ||
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const roadWidth =
      canvas.width *
      ROAD_WIDTH_RATIO;

    const centerX =
      canvas.width / 2;

    const centerStep =
      Math.max(
        1,
        Math.round(
          canvas.width *
            CENTER_STEP_RATIO,
        ),
      );

    const maxCenterOffset =
      canvas.width *
      MAX_CENTER_OFFSET_RATIO;

    let currentCenterX =
      centerX;

    let targetCenterX =
      centerX;

    let generatedStrips = 0;

    let speedLevel = 0;

    let currentRoadColors =
      ROAD_COLORS[0];

    let currentColorIndex = 0;

    let colorGroupRemaining =
      getRandomInt(1, 4);

    let animationFrameId = 0;

    let lastTime =
      performance.now();

    const road: RoadStrip[] =
      [];

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

    const createRoadStrip = (
      y: number,
    ): RoadStrip => {
      /*
       * Move gradually toward the target.
       * This creates smooth curves instead
       * of changing the road position abruptly.
       */
      if (
        Math.abs(
          targetCenterX -
            currentCenterX,
        ) <= centerStep
      ) {
        currentCenterX =
          targetCenterX;

        chooseNextTarget();
      } else if (
        targetCenterX >
        currentCenterX
      ) {
        currentCenterX +=
          centerStep;
      } else {
        currentCenterX -=
          centerStep;
      }

      const color =
        currentColorIndex % 2 === 0
          ? currentRoadColors.first
          : currentRoadColors.second;

      colorGroupRemaining--;

      if (
        colorGroupRemaining === 0
      ) {
        currentColorIndex++;

        colorGroupRemaining =
          getRandomInt(1, 4);
      }

      generatedStrips++;

      return {
        y: Math.round(y),
        height:
          ROAD_STRIPE_HEIGHT,
        centerX:
          currentCenterX,
        roadWidth,
        color,
      };
    };

    const changeColorPalette = (
      level: number,
    ) => {
      currentRoadColors =
        ROAD_COLORS[
          level %
            ROAD_COLORS.length
        ];

      currentColorIndex = 0;

      colorGroupRemaining =
        getRandomInt(1, 4);
    };

    /*
     * Generate enough road strips
     * to cover the whole canvas.
     */
    let y = 0;

    while (
      y < canvas.height
    ) {
      road.push(
        createRoadStrip(y),
      );

      y +=
        ROAD_STRIPE_HEIGHT;
    }

    /*
     * Start the road near the center.
     */
    currentCenterX =
      centerX;

    targetCenterX =
      centerX;

    chooseNextTarget();

    const draw = () => {
      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      /*
       * Base road.
       */
      context.fillStyle =
        "#000";

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      /*
       * Landscape strips.
       */
      for (
        const strip of road
      ) {
        const stripY =
          Math.round(
            strip.y,
          );

        const roadLeft =
          strip.centerX -
          strip.roadWidth / 2;

        const roadRight =
          strip.centerX +
          strip.roadWidth / 2;

        context.fillStyle =
          strip.color;

        /*
         * Left landscape.
         */
        context.fillRect(
          0,
          stripY,
          Math.max(
            0,
            roadLeft,
          ),
          strip.height + 1,
        );

        /*
         * Right landscape.
         */
        context.fillRect(
          roadRight,
          stripY,
          Math.max(
            0,
            canvas.width -
              roadRight,
          ),
          strip.height + 1,
        );
      }

      /*
       * Player car.
       */
      const carWidth = 50;

      const carHeight =
        carWidth /
        CAR_ASPECT_RATIO;

      const carX =
        (canvas.width -
          carWidth) /
        2;

      const carY =
        canvas.height -
        carHeight -
        10;

      context.drawImage(
        carImage,
        carX,
        carY,
        carWidth,
        carHeight,
      );
    };

    const gameLoop = (
      currentTime: number,
    ) => {
      const rawDeltaTime =
        (currentTime -
          lastTime) /
        1000;

      lastTime =
        currentTime;

      const deltaTime =
        Math.min(
          rawDeltaTime,
          MAX_DELTA_TIME,
        );

      const speed =
        SPEEDS[speedLevel];

      const movement =
        speed *
        deltaTime;

      /*
       * Move every road strip
       * toward the player.
       */
      for (
        const strip of road
      ) {
        strip.y +=
          movement;
      }

      /*
       * Remove strips that have
       * completely left the screen.
       */
      const visibleRoad =
        road.filter(
          (strip) =>
            strip.y <
            canvas.height,
        );

      road.length = 0;

      road.push(
        ...visibleRoad,
      );

      /*
       * Find the highest road strip.
       */
      let highestY = 0;

      for (
        const strip of road
      ) {
        if (
          strip.y <
          highestY
        ) {
          highestY =
            strip.y;
        }
      }

      /*
       * Generate new road strips
       * above the screen.
       */
      while (
        highestY >
        -ROAD_STRIPE_HEIGHT
      ) {
        const newStripY =
          highestY -
          ROAD_STRIPE_HEIGHT;

        road.unshift(
          createRoadStrip(
            newStripY,
          ),
        );

        highestY =
          newStripY;
      }

      /*
       * Change speed every fixed
       * number of generated strips.
       *
       * 5 levels:
       * 120 -> 160 -> 200 -> 240 -> 280
       *
       * Then back to 120.
       */
      const newSpeedLevel =
        Math.floor(
          generatedStrips /
            PAIRS_PER_SPEED,
        ) % SPEEDS.length;

      if (
        newSpeedLevel !==
        speedLevel
      ) {
        speedLevel =
          newSpeedLevel;

        changeColorPalette(
          speedLevel,
        );
      }

      draw();

      animationFrameId =
        requestAnimationFrame(
          gameLoop,
        );
    };

    const carImage =
      new Image();

    carImage.onload = () => {
      draw();

      lastTime =
        performance.now();

      animationFrameId =
        requestAnimationFrame(
          gameLoop,
        );
    };

    carImage.onerror = () => {
      console.error(
        "Failed to load Road Race car image.",
      );
    };

    carImage.src =
      formulaCarUrl;

    return () => {
      cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [width, height]);

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