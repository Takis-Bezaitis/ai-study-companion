import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse } from "../types/custom";
import type { RoadRaceGame } from "../types/games/roadRace.types";
import type { GameSpawn } from "../types/games/game.types";

export type RoadRaceMissionPreview = Pick<
  RoadRaceGame,
  "mission" | "itemType"
>;

export type RoadRaceBatch = Pick<RoadRaceGame, "items">;

export type RoadRaceCompletionInput = {
  gameScore: number;
  resolvedSpawns: {
    spawnId: string;
    signature: string;
    collected: boolean;
  }[];
};

export type RoadRaceCompletionResult = {
  gameScore: number;
  educationalScore: number;
};

async function readResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const result: ApiResponse<T> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : fallbackMessage,
    );
  }

  return result.data;
}

export async function getRoadRaceMission(lessonId: string): Promise<RoadRaceMissionPreview> {
  const response = await apiFetch(API.games.roadRaceMission(lessonId));

  return readResponse<RoadRaceMissionPreview>(
    response,
    "Failed to fetch the Road Race mission",
  );
}

export async function startRoadRaceGame(lessonId: string, missionId: string, itemType: string): Promise<RoadRaceGame> {
  const response = await apiFetch(API.games.startRoadRace(lessonId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ missionId, itemType }),
  });

  return readResponse<RoadRaceGame>(
    response,
    "Failed to start the Road Race game",
  );
}

export async function getNextRoadRaceBatch(sessionId: string): Promise<GameSpawn[]> {
  const response = await apiFetch(API.games.nextRoadRaceBatch(sessionId), {
    method: "POST",
  });

  return readResponse<GameSpawn[]>(
    response,
    "Failed to fetch the next Road Race batch",
  );
}

export async function completeRoadRaceGame(
  sessionId: string,
  input: RoadRaceCompletionInput,
): Promise<RoadRaceCompletionResult> {
  const response = await apiFetch(API.completeGameSession(sessionId), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return readResponse<RoadRaceCompletionResult>(
    response,
    "Failed to complete the Road Race game",
  );
}