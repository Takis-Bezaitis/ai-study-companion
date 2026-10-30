import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse } from "../types/custom";

export interface OpenQuestion {
  id: string;
  lessonId: string;
  sectionTitle: string;
  question: string;
  evaluationCriteria: {
    criterion: string;
    maxPoints: number;
  }[];
  createdAt: string;
}

export interface OpenQuestionEvaluation {
  id: string;
  questionId: string;
  answer: string;
  score: number;
  maxScore: number;
  feedback: {
    criterionScores: {
      criterion: string;
      awardedPoints: number;
      feedback: string;
    }[];
    reasoning: string;
    correctPoints: string[];
    missingPoints: string[];
    suggestions: string[];
  };
  createdAt: string;
}

export async function generateOpenQuestion(
  lessonId: string,
): Promise<OpenQuestion> {
  const response = await apiFetch(
    API.lessons.openQuestions(lessonId),
    { method: "POST" },
  );

  const result: ApiResponse<OpenQuestion> =
    await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result
        ? result.error
        : "Failed to generate an open question",
    );
  }

  return result.data;
}

export async function evaluateOpenQuestion({
  lessonId,
  questionId,
  answer,
}: {
  lessonId: string;
  questionId: string;
  answer: string;
}): Promise<OpenQuestionEvaluation> {
  const response = await apiFetch(
    API.lessons.evaluateOpenQuestion(
      lessonId,
      questionId,
    ),
    {
      method: "POST",
      body: JSON.stringify({ answer }),
    },
  );

  const result: ApiResponse<OpenQuestionEvaluation> =
    await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result
        ? result.error
        : "Failed to evaluate the answer",
    );
  }

  return result.data;
}
