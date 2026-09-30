import {
  type RefObject,
  useEffect,
  useState,
} from "react";

type GameOrientation = "portrait" | "landscape";

type GameViewport = {
  width: number;
  height: number;
  scale: number;
};

const GAME_SIZES = {
  portrait: {
    width: 680,
    height: 1100,
  },
  landscape: {
    width: 1200,
    height: 1000,
  },
} as const;

const VIEWPORT_USAGE = 1;

export function useGameViewport(
  containerRef: RefObject<HTMLDivElement | null>,
  orientation: GameOrientation,
): GameViewport {
  const gameSize = GAME_SIZES[orientation];

  const [viewport, setViewport] = useState<GameViewport>({
    width: gameSize.width,
    height: gameSize.height,
    scale: 1,
  });

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateViewport = () => {
      const { width, height } =
        container.getBoundingClientRect();

      const availableWidth =
        width * VIEWPORT_USAGE;

      const availableHeight =
        height * VIEWPORT_USAGE;

      const scale = Math.min(
        availableWidth / gameSize.width,
        availableHeight / gameSize.height,
      );

      setViewport({
        width: gameSize.width * scale,
        height: gameSize.height * scale,
        scale,
      });
    };

    updateViewport();

    const observer = new ResizeObserver(updateViewport);

    observer.observe(container);

    return () => observer.disconnect();
  }, [
    containerRef,
    gameSize.width,
    gameSize.height,
  ]);

  return viewport;
}