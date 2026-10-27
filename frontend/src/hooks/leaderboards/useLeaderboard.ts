
import { useQuery } from "@tanstack/react-query";
import { getMyTotalScore } from "../../api/leaderboardApi";

export const myTotalScoreQueryKey = ["leaderboards", "my-total-score"] as const;

export function useMyTotalScore() {
  return useQuery({
    queryKey: myTotalScoreQueryKey,
    queryFn: getMyTotalScore,
  });
}
