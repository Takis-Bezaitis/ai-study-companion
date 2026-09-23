import { useMutation } from "@tanstack/react-query";

import { askLesson } from "../../api/aiApi";

export function useAskLesson() {
  return useMutation({
    mutationFn: askLesson,
  });
}