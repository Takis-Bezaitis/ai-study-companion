import { ArrowRight, Bot } from "lucide-react";
import { useId, useState } from "react";

type AskAIProps = {
  onSubmit: (question: string) => void;
  disabled?: boolean;
};

const AskAI = ({
  onSubmit,
  disabled = false,
}: AskAIProps) => {
  const [aiQuestion, setAiQuestion] = useState("");
  const questionInputId = useId();

  const isButtonDisabled =
    disabled || aiQuestion.trim() === "";

  const handleSubmit = () => {
    const question = aiQuestion.trim();

    if (!question || disabled) {
      return;
    }

    onSubmit(question);
    setAiQuestion("");
  };

  return (
    <section
      aria-labelledby="ask-ai-heading"
      className="rounded-2xl border border-default bg-surface p-3"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center 
            rounded-xl bg-primary-soft text-primary-color"
          >
            <Bot aria-hidden="true" size={20} />
          </div>

          <div>
            <h2
              id="ask-ai-heading"
              className="text-lg font-bold text-primary"
            >
              Ask AI
            </h2>

            <p className="text-sm text-secondary">
              Ask anything about this lesson.
            </p>
          </div>
        </div>
      </header>

      <div className="flex gap-2">
        <label
          htmlFor={questionInputId}
          className="sr-only"
        >
          Ask a question about this lesson
        </label>

        <input
          id={questionInputId}
          type="text"
          autoFocus
          value={aiQuestion}
          disabled={disabled}
          placeholder={
            disabled
              ? "Waiting for AI..."
              : "Ask a question..."
          }
          className="min-w-0 flex-1 rounded-xl border border-default 
          bg-background px-3 py-2.5 text-sm text-primary 
          outline-none placeholder:text-muted focus:border-primary 
          disabled:cursor-not-allowed disabled:opacity-60"
          onChange={(e) =>
            setAiQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <button
          type="button"
          disabled={isButtonDisabled}
          aria-label="Ask AI"
          className="flex shrink-0 cursor-pointer items-center justify-center 
            rounded-xl bg-button-main px-3 text-button 
            disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleSubmit}
        >
          <ArrowRight
            aria-hidden="true"
            size={18}
          />
        </button>

      </div>
    </section>
  );
};

export default AskAI;