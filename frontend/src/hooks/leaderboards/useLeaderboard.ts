import { useQuery } from "@tanstack/react-query";
import { getMyTotalScore } from "../../api/leaderboardApi";
import { useAuthStore } from "../../store/authStore";

export const myTotalScoreQueryKey = (userId: string) =>
  ["leaderboards", "my-total-score", userId] as const;

export function useMyTotalScore() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: myTotalScoreQueryKey(userId!),
    queryFn: getMyTotalScore,
    enabled: Boolean(userId),
  });
}