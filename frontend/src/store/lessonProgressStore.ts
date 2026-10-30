
import { create } from "zustand";

interface LessonProgressState {
  pages: Record<string, number>;
  setPage: (lessonId: string, page: number) => void;
}

export const useLessonProgressStore =
  create<LessonProgressState>((set) => ({
    pages: {},

    setPage: (lessonId, page) =>
      set((state) => ({
        pages: {
          ...state.pages,
          [lessonId]: page,
        },
      })),
  }));
