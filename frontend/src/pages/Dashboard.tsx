import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { API } from "../api/api";
import { apiFetch } from "../api/apiFetch";
import { getLessons } from "../api/lessons";

import LeaderboardCard from "../components/leaderboards/LeaderboardCard";
import type { LeaderboardEntry } from "../components/leaderboards/LeaderboardCard";
import LessonLeaderboard from "../components/leaderboards/LessonLeaderboard";

import { useMediaQuery } from "../hooks/useMediaQuery";
import { useHorizontalScroll } from "../hooks/leaderboards/useHorizontalScroll";

type Tab = "overall" | "lessons" | "games";

type LeaderboardResponse = {
  data: {
    leaderboard: LeaderboardEntry[];
  };
};

type GameLeaderboardResponse = {
  data: {
    gameType: string;
    leaderboard: {
      attemptId: string;
      userId: string;
      name: string;
      score: number;
      completedAt: string;
    }[];
  };
};

type AvailableGamesResponse = {
  data: {
    games: {
      gameType: string;
      title: string;
    }[];
  };
};

async function fetchLeaderboard(url: string): Promise<LeaderboardEntry[]> {
  const response = await apiFetch(url);
  const result: LeaderboardResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard.");
  }

  return result.data.leaderboard;
}

async function fetchGameLeaderboard(
  gameType: string,
): Promise<LeaderboardEntry[]> {
  const response = await apiFetch(API.leaderboards.game(gameType));
  const result: GameLeaderboardResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch game leaderboard.");
  }

  return result.data.leaderboard.map((entry) => ({
    id: entry.attemptId,
    userId: entry.userId,
    name: entry.name,
    score: entry.score,
  }));
}

async function fetchAvailableGames(): Promise<
  AvailableGamesResponse["data"]["games"]
> {
  const response = await apiFetch(API.leaderboards.games);
  const result: AvailableGamesResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch games.");
  }

  return result.data.games;
}

function ScrollControls({onPrevious, onNext, canScrollLeft, canScrollRight,}: 
  {onPrevious: () => void; onNext: () => void;canScrollLeft: boolean;canScrollRight: boolean;}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        disabled={!canScrollLeft}
        onClick={onPrevious}
        aria-label="Scroll left"
        className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg 
        border border-default bg-surface text-primary transition-colors hover:bg-surface-secondary 
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color
        disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          ‹
        </span>
      </button>

      <button
        type="button"
        disabled={!canScrollRight}
        onClick={onNext}
        aria-label="Scroll right"
        className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg 
        border border-default bg-surface text-primary transition-colors hover:bg-surface-secondary 
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color
        disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          ›
        </span>
      </button>
    </div>
  );
}

function GameLeaderboardCard({gameType, title}: {gameType: string; title: string;}) {
  const query = useQuery({
    queryKey: ["leaderboards", "games", gameType],
    queryFn: () => fetchGameLeaderboard(gameType),
  });

  return (
    <div className="h-full w-75 shrink-0 sm:w-85">
      <LeaderboardCard
        title={title}
        entries={query.data ?? []}
        isLoading={query.isPending}
        isError={query.isError}
        scoreLabel="points"
      />
    </div>
  );
}

const tabs: {id: Tab;label: string;shortLabel: string;}[] = [
  {
    id: "overall",
    label: "Overall Leaderboard",
    shortLabel: "Overall",
  },
  {
    id: "lessons",
    label: "Lesson Leaderboards",
    shortLabel: "Lessons",
  },
  {
    id: "games",
    label: "Game Leaderboards",
    shortLabel: "Games",
  },
];

const Dashboard = () => {
  const isSmallScreen = useMediaQuery("(max-width: 540px)");
  const [activeTab, setActiveTab] = useState<Tab>("overall");

  const overallScrollRef = useRef<HTMLDivElement>(null);
  const lessonsScrollRef = useRef<HTMLDivElement>(null);
  const gamesScrollRef = useRef<HTMLDivElement>(null);

  const overallQuery = useQuery({
    queryKey: ["leaderboards", "overall"],
    queryFn: () => fetchLeaderboard(API.leaderboards.overall),
    enabled: activeTab === "overall",
  });

  const knowledgeCheckQuery = useQuery({
    queryKey: ["leaderboards", "knowledge-check"],
    queryFn: () => fetchLeaderboard(API.leaderboards.knowledgeCheck),
    enabled: activeTab === "overall",
  });

  const lessonsQuery = useQuery({
    queryKey: ["lessons"],
    queryFn: getLessons,
    enabled: activeTab === "lessons",
  });

  const gamesQuery = useQuery({
    queryKey: ["leaderboards", "games"],
    queryFn: fetchAvailableGames,
    enabled: activeTab === "games",
  });

  const overallScroll = useHorizontalScroll(
    overallScrollRef,
    activeTab === "overall", 2,
  );

  const lessonsScroll = useHorizontalScroll(
    lessonsScrollRef,
    activeTab === "lessons",
    lessonsQuery.data?.length ?? 0,
  );

  const gamesScroll = useHorizontalScroll(
    gamesScrollRef,
    activeTab === "games",
    gamesQuery.data?.length ?? 0,
  );

  return (
    <main className="h-full overflow-y-auto bg-background text-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-3 sm:p-6 lg:p-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary sm:mt-2 sm:text-base">
            Explore student performance across activities, lessons, and games.
          </p>
        </header>

        {/* Dashboard tabs */}
        <nav
          aria-label="Leaderboard categories"
          className="flex w-full gap-1 overflow-x-auto rounded-xl border border-default bg-surface-secondary p-1"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`dashboard-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`dashboard-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer min-h-11 flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${
                  isActive
                    ? "bg-surface text-primary shadow-sm"
                    : "text-secondary hover:bg-surface hover:text-primary"
                }`}
              >
                {isSmallScreen ? tab.shortLabel : tab.label}
              </button>
            );
          })}
        </nav>

        {/* Overall leaderboard */}
        {activeTab === "overall" && (
          <section
            id="dashboard-panel-overall"
            role="tabpanel"
            aria-labelledby="dashboard-tab-overall"
            className="flex min-w-0 flex-col gap-2 sm:gap-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold sm:text-xl">
                  Overall Leaderboards
                </h2>
                <p className="text-xs text-secondary sm:mt-1 sm:text-sm">
                  Compare overall and Knowledge Check scores.
                </p>
              </div>
              
              <ScrollControls
                onPrevious={() => overallScroll.scroll("left")}
                onNext={() => overallScroll.scroll("right")}
                canScrollLeft={overallScroll.canScrollLeft}
                canScrollRight={overallScroll.canScrollRight}
              />
              
            </div>

            <div
              ref={overallScrollRef}
              className="scrollbar-hide flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible"
            >
              <div className="h-87 w-75 shrink-0 snap-start sm:w-85 lg:w-auto">
                <LeaderboardCard
                  title="Overall Score"
                  entries={overallQuery.data ?? []}
                  isLoading={overallQuery.isPending}
                  isError={overallQuery.isError}
                  scoreLabel="points"
                />
              </div>

              <div className="h-87 w-75 shrink-0 snap-start sm:w-85 lg:w-auto">
                <LeaderboardCard
                  title="Knowledge Check"
                  entries={knowledgeCheckQuery.data ?? []}
                  isLoading={knowledgeCheckQuery.isPending}
                  isError={knowledgeCheckQuery.isError}
                  scoreLabel="points"
                />
              </div>
            </div>
          </section>
        )}

        {/* Lesson leaderboards */}
        {activeTab === "lessons" && (
          <section
            id="dashboard-panel-lessons"
            role="tabpanel"
            aria-labelledby="dashboard-tab-lessons"
            className="flex min-w-0 flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold sm:text-xl">
                  Lesson Leaderboards
                </h2>
                <p className="text-xs text-secondary sm:mt-1 sm:text-sm">
                  Based on correct game and Knowledge Check answers.
                </p>
              </div>

              <ScrollControls
                onPrevious={() => lessonsScroll.scroll("left")}
                onNext={() => lessonsScroll.scroll("right")}
                canScrollLeft={lessonsScroll.canScrollLeft}
                canScrollRight={lessonsScroll.canScrollRight}
              />
            </div>

            {lessonsQuery.isPending ? (
              <p className="py-8 text-center text-sm text-secondary">
                Loading lessons...
              </p>
            ) : lessonsQuery.isError ? (
              <p className="py-8 text-center text-sm text-secondary">
                Failed to load lessons.
              </p>
            ) : lessonsQuery.data.length === 0 ? (
              <p className="py-8 text-center text-sm text-secondary">
                No lessons available.
              </p>
            ) : (
              <div
                ref={lessonsScrollRef}
                className="scrollbar-hide flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
              >
                {lessonsQuery.data.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="h-87 w-75 shrink-0 snap-start sm:w-85"
                  >
                    <LessonLeaderboard
                      lessonId={lesson.id}
                      lessonTitle={lesson.title}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Game leaderboards */}
        {activeTab === "games" && (
          <section
            id="dashboard-panel-games"
            role="tabpanel"
            aria-labelledby="dashboard-tab-games"
            className="flex min-w-0 flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold sm:text-xl">
                  Game Leaderboards
                </h2>
                <p className="text-xs text-secondary sm:mt-1 sm:text-sm">
                  Explore the best scores in each game.
                </p>
              </div>

              <ScrollControls
                onPrevious={() => gamesScroll.scroll("left")}
                onNext={() => gamesScroll.scroll("right")}
                canScrollLeft={gamesScroll.canScrollLeft}
                canScrollRight={gamesScroll.canScrollRight}
              />
            </div>

            {gamesQuery.isPending ? (
              <p className="py-8 text-center text-sm text-secondary">
                Loading games...
              </p>
            ) : gamesQuery.isError ? (
              <p className="py-8 text-center text-sm text-secondary">
                Failed to load games.
              </p>
            ) : gamesQuery.data.length === 0 ? (
              <p className="py-8 text-center text-sm text-secondary">
                No games available.
              </p>
            ) : (
              <div
                ref={gamesScrollRef}
                className="scrollbar-hide flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
              >
                {gamesQuery.data.map((game) => (
                  <div
                    key={game.gameType}
                    className="h-87 w-75 shrink-0 snap-start sm:w-85"
                  >
                    <GameLeaderboardCard
                      gameType={game.gameType}
                      title={game.title}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
