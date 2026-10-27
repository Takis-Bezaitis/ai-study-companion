
import { useQuery } from "@tanstack/react-query";

import { API } from "../api/api";
import { apiFetch } from "../api/apiFetch";
import { getLessons } from "../api/lessons";

import LeaderboardCard from "../components/leaderboards/LeaderboardCard";
import type { LeaderboardEntry } from "../components/leaderboards/LeaderboardCard";
import LessonLeaderboard from "../components/leaderboards/LessonLeaderboard";

type LeaderboardResponse = {
  data: {
    leaderboard: LeaderboardEntry[];
  };
};

type GameDefinition = {
  gameType: string;
  title: string;
};

type GamesResponse = {
  data: {
    games: GameDefinition[];
  };
};

type GameAttempt = LeaderboardEntry & {
  attemptId: string;
  completedAt: string;
};

type GameLeaderboardResponse = {
  data: {
    gameType: string;
    leaderboard: GameAttempt[];
  };
};

async function fetchLeaderboard(
  url: string,
): Promise<LeaderboardEntry[]> {
  const response = await apiFetch(url);
  const result: LeaderboardResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard.");
  }

  return result.data.leaderboard;
}

async function fetchGames(): Promise<GameDefinition[]> {
  const response = await apiFetch(API.leaderboards.games);
  const result: GamesResponse = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch games.");
  }

  return result.data.games;
}

async function fetchGameLeaderboard(
  gameType: string,
): Promise<LeaderboardEntry[]> {
  const response = await apiFetch(
    API.leaderboards.game(gameType),
  );

  const result: GameLeaderboardResponse =
    await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch game leaderboard.");
  }

  return result.data.leaderboard.map((attempt) => ({
    id: attempt.attemptId,
    userId: attempt.userId,
    name: attempt.name,
    score: attempt.score,
  }));
}

const Dashboard = () => {
  const overallQuery = useQuery({
    queryKey: ["leaderboards", "overall"],
    queryFn: () => fetchLeaderboard(API.leaderboards.overall),
  });

  const knowledgeCheckQuery = useQuery({
    queryKey: ["leaderboards", "knowledge-check"],
    queryFn: () =>
      fetchLeaderboard(API.leaderboards.knowledgeCheck),
  });

  const lessonsQuery = useQuery({
    queryKey: ["lessons"],
    queryFn: getLessons,
  });

  const gamesQuery = useQuery({
    queryKey: ["leaderboards", "games"],
    queryFn: fetchGames,
  });

  return (
    <main className="h-full overflow-y-auto bg-background p-4 text-primary sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Top student performances across all activities.
          </p>
        </header>

        {/* Row 1: Overall and Knowledge Check */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Overall Leaderboard
          </h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <LeaderboardCard
              title="Overall Score"
              entries={overallQuery.data ?? []}
              isLoading={overallQuery.isPending}
              isError={overallQuery.isError}
            />

            <LeaderboardCard
              title="Knowledge Check"
              entries={knowledgeCheckQuery.data ?? []}
              isLoading={knowledgeCheckQuery.isPending}
              isError={knowledgeCheckQuery.isError}
            />
          </div>
        </section>

        {/* Row 2: All lessons */}
        <section className="flex min-w-0 flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Lesson Leaderboards
          </h2>

          {lessonsQuery.isPending ? (
            <p className="text-sm text-secondary">
              Loading lessons...
            </p>
          ) : lessonsQuery.isError ? (
            <p className="text-sm text-secondary">
              Failed to load lessons.
            </p>
          ) : lessonsQuery.data.length === 0 ? (
            <p className="text-sm text-secondary">
              No lessons available.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3">
              {lessonsQuery.data.map((lesson) => (
                <div
                  key={lesson.id}
                  className="w-75 shrink-0 sm:w-85"
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

        {/* Row 3: All games */}
        <section className="flex min-w-0 flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Game Leaderboards
          </h2>

          {gamesQuery.isPending ? (
            <p className="text-sm text-secondary">
              Loading games...
            </p>
          ) : gamesQuery.isError ? (
            <p className="text-sm text-secondary">
              Failed to load games.
            </p>
          ) : gamesQuery.data.length === 0 ? (
            <p className="text-sm text-secondary">
              No games available.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-3">
              {gamesQuery.data.map((game) => (
                <div
                  key={game.gameType}
                  className="w-75 shrink-0 sm:w-85"
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
      </div>
    </main>
  );
};

type GameLeaderboardCardProps = {
  gameType: string;
  title: string;
};

function GameLeaderboardCard({
  gameType,
  title,
}: GameLeaderboardCardProps) {
  const query = useQuery({
    queryKey: ["leaderboards", "games", gameType],
    queryFn: () => fetchGameLeaderboard(gameType),
  });

  return (
    <LeaderboardCard
      title={title}
      entries={query.data ?? []}
      isLoading={query.isPending}
      isError={query.isError}
    />
  );
}

export default Dashboard;
