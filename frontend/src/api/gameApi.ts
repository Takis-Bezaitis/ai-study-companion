import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse } from "../types/custom";
import type { RoadRaceGame } from "../types/games/roadRace.types";

export async function getRoadRaceGame(lessonId: string): Promise<RoadRaceGame> {
  const response = await apiFetch(API.games.roadRace(lessonId));

  const result: ApiResponse<RoadRaceGame> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Failed to fetch the road race items",
    );
  }

  return result.data;
}