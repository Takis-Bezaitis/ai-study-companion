import AskAI from "./AskAI";
import AIChat from "./AIChat";

import { useAskLesson } from "../../hooks/ai/useAskLesson";
import { useAiMessageStore, type AiMessage } from "../../store/aiMessageStore";

const EMPTY_MESSAGES: AiMessage[] = [];

type AIChatPanelProps = {
  onClose: () => void;
  lessonId: string;
};

const AIChatPanel = ({
  onClose,
  lessonId,
}: AIChatPanelProps) => {

  const messages = useAiMessageStore(
    (state) =>
      state.messagesByLesson[lessonId] ??
      EMPTY_MESSAGES,
  );

  const appendMessageContent = useAiMessageStore(
    (state) => state.appendMessageContent,
  );

  const addMessage = useAiMessageStore(
    (state) => state.addMessage,
  );

  const askLessonMutation = useAskLesson();

  const submitQuestion = (
    question: string,
  ) => {
    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      askLessonMutation.isPending
    ) {
      return;
    }

    const history = messages
      .slice(-20)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    addMessage(lessonId, {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuestion,
    });

    const assistantMessageId =
      crypto.randomUUID();

    addMessage(lessonId, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    });

    askLessonMutation.mutate({
      lessonId,
      question: trimmedQuestion,
      history,
      onDelta: (text) => {
        appendMessageContent(
          lessonId,
          assistantMessageId,
          text,
        );
      },
    });
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