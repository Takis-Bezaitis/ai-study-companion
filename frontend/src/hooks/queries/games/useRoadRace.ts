
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getRoadRaceMission,
  startRoadRaceGame,
  getNextRoadRaceBatch,
  completeRoadRaceGame,
} from "../../../api/gameApi";

import type { RoadRaceCompletionInput } from "../../../api/gameApi";

export const roadRaceQueryKey = (lessonId: string) => ["games", "road-race", "mission", lessonId] as const;

export function useRoadRaceMission(lessonId: string) {
  return useQuery({
    queryKey: roadRaceQueryKey(lessonId),
    queryFn: () => getRoadRaceMission(lessonId),
    enabled: Boolean(lessonId),
    refetchOnMount: "always",
  });
}

export function useStartRoadRace() {
  return useMutation({
    mutationFn: ({
      lessonId,
      missionId,
      itemType,
    }: {
      lessonId: string;
      missionId: string;
      itemType: string;
    }) => startRoadRaceGame(lessonId, missionId, itemType),
  });
}

export function useNextRoadRaceBatch() {
  return useMutation({
    mutationFn: (sessionId: string) => getNextRoadRaceBatch(sessionId),
  });
}


export function useCompleteRoadRace() {
  return useMutation({
    mutationFn: ({
      sessionId,
      input,
    }: {
      sessionId: string;
      input: RoadRaceCompletionInput;
    }) => completeRoadRaceGame(sessionId, input),
  });
}