import { useQuery } from "@tanstack/react-query";

import { getLessonChunks } from "../../api/lessons";

export const lessonChunksQueryKey = (
  lessonId: string,
) => ["lesson", lessonId, "chunks"] as const;

export function useLessonChunks(
  lessonId: string,
) {
  return useQuery({
    queryKey: lessonChunksQueryKey(lessonId),
    queryFn: () => getLessonChunks(lessonId),
    enabled: Boolean(lessonId),
  });
}