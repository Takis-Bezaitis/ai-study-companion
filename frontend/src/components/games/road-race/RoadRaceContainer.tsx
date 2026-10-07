import { useRef } from "react";

import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useGameViewport } from "../../../hooks/games/useGameViewport";

import { ChevronLeft, ChevronRight } from "lucide-react";

import RoadRaceCanvas from "./RoadRaceCanvas";
import RoadRaceUI from "./RoadRaceUI";

import type { RoadRaceGame } from "../../../types/games/roadRace.types";

type RoadRaceContainerProps = {
  game: RoadRaceGame;
  onBack: () => void;
};

const RoadRaceContainer = ({ game, onBack }: RoadRaceContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLandscape = useMediaQuery("(min-width: 768px)",);
  const orientation = isLandscape ? "landscape" : "portrait";
  const viewport = useGameViewport(containerRef, orientation, );
  const scoreTextRef = useRef<HTMLSpanElement | null>(null);
  const fuelBarRef = useRef<HTMLDivElement | null>(null);
  const playerDirectionRef = useRef<"left" | "right" | null>(null);

  return (
  <section className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-4 sm:p-6">
    <div
      ref={containerRef}
      className="flex h-full min-h-0 w-full items-center justify-center"
    >
      <div className="flex flex-col items-center">
        <RoadRaceUI 
          scoreTextRef={scoreTextRef}
          fuelBarRef={fuelBarRef}
          onBack={onBack}
        />
        <div
          className="relative overflow-hidden rounded-2xl bg-black shadow-2xl"
          style={{
            width: viewport.width,
            height: viewport.height,
          }}
        >
          <RoadRaceCanvas
            width={viewport.width}
            height={viewport.height}
            game={game}
            scoreTextRef={scoreTextRef}
            fuelBarRef={fuelBarRef}
            playerDirectionRef={playerDirectionRef}
          />
        </div>

        {!isLandscape && (
          <div className="flex w-full max-w-sm items-center justify-center gap-4 my-2">
            <button
              type="button"
              className="cursor-pointer flex h-11 flex-1 items-center justify-center rounded-xl border border-default bg-surface text-primary shadow-sm active:scale-95"
              aria-label="Move left"
              onPointerDown={() => {
                playerDirectionRef.current = "left";
              }}
              onPointerUp={() => {
                playerDirectionRef.current = null;
              }}
              onPointerCancel={() => {
                playerDirectionRef.current = null;
              }}
              onPointerLeave={() => {
                playerDirectionRef.current = null;
              }}
            >
              <ChevronLeft size={32} />
            </button>

            <button
              type="button"
              className="cursor-pointer flex h-11 flex-1 items-center justify-center rounded-xl border border-default bg-surface text-primary shadow-sm active:scale-95"
              aria-label="Move right"
              onPointerDown={() => {
                playerDirectionRef.current = "right";
              }}
              onPointerUp={() => {
                playerDirectionRef.current = null;
              }}
              onPointerCancel={() => {
                playerDirectionRef.current = null;
              }}
              onPointerLeave={() => {
                playerDirectionRef.current = null;
              }}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  </section>
);
};

export default RoadRaceContainer;