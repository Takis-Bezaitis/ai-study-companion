import { useQuery } from "@tanstack/react-query";

import { getLessons } from "../../api/lessons";

export const lessonsQueryKey = ["lessons"] as const;

export function useLessons() {
  return useQuery({
    queryKey: lessonsQueryKey,
    queryFn: getLessons,
  });
}