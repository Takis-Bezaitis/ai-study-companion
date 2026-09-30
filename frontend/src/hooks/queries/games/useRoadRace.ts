import { useQuery } from "@tanstack/react-query";

import { getRoadRaceGame } from "../../../api/gameApi";

export const roadRaceQueryKey = (lessonId: string) => ["games", "road-race", lessonId] as const;

export function useRoadRace(lessonId: string) {
  return useQuery({
    queryKey: roadRaceQueryKey(lessonId),
    queryFn: () => getRoadRaceGame(lessonId),
  });
}