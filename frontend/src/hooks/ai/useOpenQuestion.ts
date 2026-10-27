import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  generateOpenQuestion,
  evaluateOpenQuestion,
} from "../../api/openQuestionApi";

import { myTotalScoreQueryKey } from "../leaderboards/useLeaderboard";

export function useOpenQuestion() {
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generateOpenQuestion,
  });

  const evaluateMutation = useMutation({
    mutationFn: evaluateOpenQuestion,
    
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: myTotalScoreQueryKey,
      });
    },
  });

  return {
    generateMutation,
    evaluateMutation,
  };
}
