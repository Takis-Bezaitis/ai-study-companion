import { useEffect, useRef, useState,  } from "react";

import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useGameViewport } from "../../../hooks/games/useGameViewport";

import RoadRaceCanvas from "./RoadRaceCanvas";
import RoadRaceUI from "./RoadRaceUI";

import type { GameMission, GameSpawn } from "../../../types/games/game.types";

import { 
  useStartRoadRace, 
  useCompleteRoadRace, 
  useNextRoadRaceBatch, 
} from "../../../hooks/queries/games/useRoadRace";

import { ChevronLeft, ChevronRight } from "lucide-react";


type RoadRaceContainerProps = {
  lessonId: string;
  missionDetails: GameMission;
  itemType: string;
  onBack: () => void;
  onContinue: () => void;
};

const RoadRaceContainer = ({ lessonId, missionDetails, itemType, onBack, onContinue }: RoadRaceContainerProps) => {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const isLandscape = useMediaQuery("(min-width: 768px)",);
  const orientation = isLandscape ? "landscape" : "portrait";
  const viewport = useGameViewport(canvasAreaRef, orientation, );
  const scoreTextRef = useRef<HTMLSpanElement | null>(null);
  const fuelBarRef = useRef<HTMLDivElement | null>(null);
  const playerDirectionRef = useRef<"left" | "right" | null>(null);
  const sessionStartedRef = useRef(false);

  const {
    mutate: createSession,
    data: game,
    isPending,
    isError,
    error,
  } = useStartRoadRace();

  const completeRoadRaceMutation = useCompleteRoadRace();

  const { mutateAsync: fetchNextBatch } = useNextRoadRaceBatch();

  const handleFetchNextBatch = async (): Promise<GameSpawn[]> => {
    if (!game?.sessionId) {
      throw new Error("No active Road Race session.");
    }

    return await fetchNextBatch(game.sessionId);
  };


  const handleGameOver = (result: {
    gameScore: number;
    resolvedSpawns: {
      spawnId: string;
      signature: string;
      collected: boolean;
    }[];
  }) => {
    if (!game || completeRoadRaceMutation.isPending || finalScore !== null) {
      return;
    }

    setCompletionError(null);

    completeRoadRaceMutation.mutate(
      {
        sessionId: game.sessionId,
        input: result,
      },
      {
        onSuccess: (finalResult) => {
          setFinalScore(finalResult.gameScore + finalResult.educationalScore);
        },
        onError: (error) => {
          setCompletionError(
            error instanceof Error
              ? error.message
              : "Failed to save the game result.",
          );
        },
      },
    );
  };

  useEffect(() => {
    if (sessionStartedRef.current) return;

    sessionStartedRef.current = true;

    createSession({
      lessonId,
      missionId: missionDetails.id,
      itemType,
    });
  }, [lessonId, missionDetails.id, itemType, createSession]);
  
  if (!lessonId) {
    return null;
  }

  
return (
    <section className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-2 sm:p-6">
      <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)_auto]">

        {/* Top space: HUD */}
        <div className="flex justify-center pb-1 sm:pb-2">
          <div
            className="w-full"
            style={{ maxWidth: viewport.width }}
          >
            <RoadRaceUI
              scoreTextRef={scoreTextRef}
              fuelBarRef={fuelBarRef}
              onBack={onBack}
            />
          </div>
        </div>

        {/* Middle space: Canvas */}
        <div
          ref={canvasAreaRef}
          className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden"
        >
          <div
            className="relative shrink-0 overflow-hidden rounded-2xl bg-black shadow-2xl"
            style={{
              width: viewport.width,
              height: viewport.height,
            }}
          >
            {completionError && (
              <div role="alert" className="mt-3 text-center">
                <p className="text-sm text-destructive">{completionError}</p>
                <button
                  type="button"
                  className="mt-2 rounded-xl border border-default px-4 py-2"
                  onClick={() => {
                    setCompletionError(null);
                    handleGameOver({
                      gameScore: 0,
                      resolvedSpawns: [],
                    });
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {finalScore !== null && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-black/80 p-6 text-center text-white">
                <h2 className="text-3xl font-bold">Game Over</h2>
                <p className="mt-4 text-sm text-white/70">Final Score</p>
                <p className="mt-1 text-4xl font-bold tabular-nums">
                  {Math.floor(finalScore).toString().padStart(6, "0")}
                </p>
                <button
                  type="button"
                  className="mt-6 cursor-pointer rounded-xl bg-white px-6 py-3 font-semibold text-black"
                  onClick={onContinue}
                >
                  Continue
                </button>
              </div>
            )}

            {game ? (
              <RoadRaceCanvas
                width={viewport.width}
                height={viewport.height}
                game={game}
                scoreTextRef={scoreTextRef}
                fuelBarRef={fuelBarRef}
                playerDirectionRef={playerDirectionRef}
                onGameOver={handleGameOver}
                onFetchNextBatch={handleFetchNextBatch}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg text-primary-color">
                Preparing race...
              </div>
            )}
          </div>
        </div>

        {/* Bottom space: Mobile controls */}
        <div className="flex shrink-0 items-center justify-center pt-1 sm:pt-2">
          {!isLandscape && (
            <div className="flex h-10 w-full max-w-sm items-center justify-center gap-4 px-4 sm:h-11 sm:px-0">
              <button
                type="button"
                className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-xl border border-default bg-surface text-primary shadow-sm active:scale-95"
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
                className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-xl border border-default bg-surface text-primary shadow-sm active:scale-95"
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

        {isPending && (
          <span className="sr-only text-lg text-primary-color">
            Preparing game items
          </span>
        )}

        {isError && (
          <p role="alert" className="text-sm text-destructive">
            {error instanceof Error
              ? error.message
              : "Failed to start the game."}
          </p>
        )}
      </div>
    </section>
  );

};

export default RoadRaceContainer;