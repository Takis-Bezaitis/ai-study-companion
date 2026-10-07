import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

import RoadRaceContainer from "../../components/games/road-race/RoadRaceContainer";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useRoadRace } from "../../hooks/queries/games/useRoadRace";

const RoadRace = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);

  const handleBack = () => {
    navigate(`/lessons/${lessonId}`);
  };

  const { data: game, isLoading, isError, error } = useRoadRace(
    lessonId ?? "",
  );

  if (!lessonId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted">Loading game...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load the game."}
        </p>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  if (gameStarted) {
    return <RoadRaceContainer game={game} onBack={handleBack} />;
  }

  return (
    <RoadRaceStartScreen
      title={game.mission.title}
      description={game.mission.description}
      onStart={() => setGameStarted(true)}
      onBack={handleBack}
    />
  );
};

type RoadRaceStartScreenProps = {
  title: string;
  description: string | null;
  onStart: () => void;
  onBack: () => void;
};

const RoadRaceStartScreen = ({title, description, onStart, onBack,}: RoadRaceStartScreenProps) => {
  const isMobileOrTablet = useMediaQuery("(max-width: 1023px)");

  return (
    <section className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <div className="border-2 border-primary bg-surface px-5 py-7 
          shadow-[8px_8px_0_var(--color-primary)] sm:px-8 sm:py-9">

          <div className="mb-6 flex justify-start">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-primary-color"
            >
              <ChevronLeft size={18} />
              Back to lesson
            </button>
          </div>

          <div className="text-center">
            <p className="mb-2 text-7xl font-black uppercase text-accent">
              Road Race
            </p>

            <h1 className="text-xl font-black uppercase tracking-wide text-primary sm:text-4xl">
              {title}
            </h1>

            {description && (
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-secondary sm:text-base">
                {description}
              </p>
            )}
          </div>

          <div className="mt-7 border-2 border-default bg-surface-secondary p-4 sm:mt-8 sm:p-5">
            <h2 className="text-center text-sm font-black uppercase tracking-wider text-primary">
              How to Play
            </h2>

            <div className="mt-4 flex flex-col items-center justify-center gap-3 text-sm text-secondary sm:flex-row sm:gap-5">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-10 items-center justify-center border border-default bg-surface font-bold text-primary shadow-sm">
                  <ChevronLeft size={20} />
                </span>

                <span className="flex h-9 w-10 items-center justify-center border border-default bg-surface font-bold text-primary shadow-sm">
                  <ChevronRight size={20} />
                </span>
              </div>

              <span>
                {isMobileOrTablet
                  ? "Tap the buttons to steer your car."
                  : "Use the arrow keys to steer your car."}
              </span>
            </div>
          </div>

          <div className="mt-7 flex justify-center sm:mt-8">
            <button
              type="button"
              onClick={onStart}
              className="flex min-w-44 items-center justify-center gap-2 border-2 border-primary 
                bg-game-button-main px-6 py-3 text-sm font-black uppercase tracking-wider text-game-button 
                shadow-[4px_4px_0_var(--color-primary)] transition-transform hover:bg-game-button-hover 
                active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
            >
              <Play size={19} fill="currentColor" />
              Start Race
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadRace;