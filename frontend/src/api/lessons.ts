import { API } from "./api";
import { apiFetch } from "./apiFetch";
import type { ApiResponse, Lesson, LessonChunk } from "../types/custom";

export async function getLessons(): Promise<Lesson[]> {
  const response = await apiFetch(API.lessons.base);

  const result: ApiResponse<Lesson[]> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Failed to fetch lessons",
    );
  }

  return result.data;
}

export async function getLesson(lessonId: string): Promise<Lesson> {
  const response = await apiFetch(`${API.lessons.base}/${lessonId}`);

  const result: ApiResponse<Lesson> = await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result ? result.error : "Failed to fetch lesson",
    );
  }

  return result.data;
}

export async function getLessonChunks(
  lessonId: string,
): Promise<LessonChunk[]> {
  const response = await apiFetch(
    API.lessons.chunks(lessonId),
  );

  const result: ApiResponse<LessonChunk[]> =
    await response.json();

  if (!response.ok || "error" in result) {
    throw new Error(
      "error" in result
        ? result.error
        : "Failed to fetch lesson chunks",
    );
  }

  return result.data;
}
