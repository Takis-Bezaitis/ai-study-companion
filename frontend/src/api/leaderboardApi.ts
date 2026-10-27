
import { API } from "./api";
import { apiFetch } from "./apiFetch";

type MyTotalScoreResponse = {
  data: {
    score: number;
  };
};

export async function getMyTotalScore(): Promise<number> {
  const response = await apiFetch(API.leaderboards.myScore);

  if (!response.ok) {
    throw new Error("Failed to fetch your total score.");
  }

  const result: MyTotalScoreResponse = await response.json();

  return result.data.score;
}
