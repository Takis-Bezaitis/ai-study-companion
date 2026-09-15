import { useQuery } from "@tanstack/react-query";

import { getLesson } from "../../api/lessons";

export const lessonQueryKey = (lessonId: string) =>
  ["lesson", lessonId] as const;

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: lessonQueryKey(lessonId),
    queryFn: () => getLesson(lessonId),
    enabled: Boolean(lessonId),
  });
}