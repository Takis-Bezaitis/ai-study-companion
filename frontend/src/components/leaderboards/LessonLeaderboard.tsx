
import { useQuery } from "@tanstack/react-query";

import { API } from "../../api/api";
import { apiFetch } from "../../api/apiFetch";

import LeaderboardCard from "./LeaderboardCard";
import type { LeaderboardEntry } from "./LeaderboardCard";

type LessonLeaderboardResponse = {
  data: {
    lesson: {
      id: string;
      title: string;
    };
    leaderboard: LeaderboardEntry[];
  };
};

type LessonLeaderboardProps = {
  lessonId: string;
  lessonTitle: string;
};

async function fetchLessonLeaderboard(
  lessonId: string,
): Promise<LeaderboardEntry[]> {
  const response = await apiFetch(
    API.leaderboards.lesson(lessonId),
  );

  const result: LessonLeaderboardResponse =
    await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch lesson leaderboard.");
  }

  return result.data.leaderboard;
}

const LessonLeaderboard = ({
  lessonId,
  lessonTitle,
}: LessonLeaderboardProps) => {
  const query = useQuery({
    queryKey: ["leaderboards", "lessons", lessonId],
    queryFn: () => fetchLessonLeaderboard(lessonId),
  });

  return (
    <LeaderboardCard
      title={lessonTitle}
      entries={query.data ?? []}
      isLoading={query.isPending}
      isError={query.isError}
      scoreLabel="points"
    />
  );
};

export default LessonLeaderboard;
