import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse, Lesson } from "../types/custom";

export async function getLessons(): Promise<Lesson[]> {
  const response = await apiFetch(API.lessons);

  const result: ApiResponse<Lesson[]> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Failed to fetch lessons",
    );
  }

  return result.data;
}

export async function getLesson(lessonId: string): Promise<Lesson> {
  const response = await apiFetch(`${API.lessons}/${lessonId}`);

  const result: ApiResponse<Lesson> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Failed to fetch lesson",
    );
  }

  return result.data;
}