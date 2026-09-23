import { useState } from "react";

import AskAI from "./AskAI";
import AIChat from "./AIChat";

import { useAskLesson } from "../../hooks/ai/useAskLesson";

type AIChatPanelProps = {
  onClose: () => void;
  lessonId: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const AIChatPanel = ({
  onClose,
  lessonId,
}: AIChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const askLessonMutation = useAskLesson();

  const submitQuestion = (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || askLessonMutation.isPending) {
      return;
    }

    const history = messages
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    askLessonMutation.mutate(
      {
        lessonId,
        question: trimmedQuestion,
        history,
      },
      {
        onSuccess: (data) => {
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: data.answer,
            },
          ]);
        },
      },
    );
  };

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden 
      rounded-2xl border border-default bg-surface shadow-xl"
    >
      <AIChat
        onClose={onClose}
        messages={messages}
        isLoading={askLessonMutation.isPending}
        error={askLessonMutation.error}
      />

      <div className="relative shrink-0 border-t border-default p-3">
        <AskAI
          onSubmit={submitQuestion}
          disabled={askLessonMutation.isPending}
        />
      </div>
    </section>
  );
};

export default AIChatPanel;