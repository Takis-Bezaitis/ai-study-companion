import { create } from "zustand";

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AiMessageState {
  messagesByLesson: Record<string, AiMessage[]>;

  addMessage: (
    lessonId: string,
    message: AiMessage,
  ) => void;
}

export const useAiMessageStore =
  create<AiMessageState>((set) => ({
    messagesByLesson: {},

    addMessage: (lessonId, message) =>
      set((state) => ({
        messagesByLesson: {
          ...state.messagesByLesson,
          [lessonId]: [
            ...(state.messagesByLesson[lessonId] ?? []),
            message,
          ],
        },
      })),
  }));