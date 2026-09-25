import { useMutation } from "@tanstack/react-query";

import { streamAskLesson } from "../../api/aiApi";

export function useAskLesson() {
  return useMutation({
    mutationFn: streamAskLesson,
  });
}