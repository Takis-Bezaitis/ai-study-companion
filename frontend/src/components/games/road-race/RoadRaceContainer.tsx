import { useRef } from "react";

import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useGameViewport } from "../../../hooks/games/useGameViewport";
import { useRoadRace } from "../../../hooks/queries/games/useRoadRace";

import RoadRaceCanvas from "./RoadRaceCanvas";
import RoadRaceUI from "./RoadRaceUI";

type RoadRaceContainerProps = {
  lessonId: string;
};

const RoadRaceContainer = ({ lessonId, }: RoadRaceContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLandscape = useMediaQuery("(min-width: 1024px)",);
  const orientation = isLandscape ? "landscape" : "portrait";
  const viewport = useGameViewport(containerRef, orientation, );

  const { data: game, isLoading, isError, error } = useRoadRace(lessonId);

  if (isLoading) {
    return (
      <section className="flex h-full min-h-0 w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading game...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex h-full min-h-0 w-full items-center justify-center">
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load the game."}
        </p>
      </section>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <section className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-4 sm:p-6">
      <div
        ref={containerRef}
        className="flex h-full min-h-0 w-full items-center justify-center"
      >
        <div
          className="relative overflow-hidden rounded-2xl bg-black shadow-2xl"
          style={{
            width: viewport.width,
            height: viewport.height,
          }}
        >
          <RoadRaceCanvas />

          <RoadRaceUI 
            title={game.mission.title}
            description={game.mission.description}
          />
        </div>
      </div>
    </section>
  );
};

export default RoadRaceContainer;