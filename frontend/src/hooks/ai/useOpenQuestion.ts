import { useMutation } from "@tanstack/react-query";

import {
  generateOpenQuestion,
  evaluateOpenQuestion,
} from "../../api/openQuestionApi";

export function useOpenQuestion() {
  const generateMutation = useMutation({
    mutationFn: generateOpenQuestion,
  });

  const evaluateMutation = useMutation({
    mutationFn: evaluateOpenQuestion,
  });

  return {
    generateMutation,
    evaluateMutation,
  };
}
