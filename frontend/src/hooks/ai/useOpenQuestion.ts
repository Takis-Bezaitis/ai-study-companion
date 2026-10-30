import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";

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
      const userId = useAuthStore.getState().user?.id;

      if (!userId) return;

      await queryClient.invalidateQueries({
        queryKey: myTotalScoreQueryKey(userId),
      });
    },
  });

  return {
    generateMutation,
    evaluateMutation,
  };
}
