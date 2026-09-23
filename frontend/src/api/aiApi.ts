import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse } from "../types/custom";

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type askLessonProps = {
    lessonId: string;
    question: string;
    history: ChatHistoryMessage[];
}

export interface AskLessonResult {
  answer: string;
  sources: {
    id: string;
    content: string;
    sectionTitle: string;
    chunkIndex: number;
    similarity: number;
  }[];
}

export async function askLesson({lessonId, question, history}: askLessonProps): Promise<AskLessonResult> {
    const response = await apiFetch(API.lessons.ask(lessonId),
        {
            method: "POST",
            body: JSON.stringify({ question, history }),
        },
    );
    
    const result: ApiResponse<AskLessonResult> = await response.json();

    if (!response.ok || "error" in result) {
        throw new Error(
            "error" in result 
                ? result.error 
                : "Failed to ask the question",
        );
    }

    return result.data;
}