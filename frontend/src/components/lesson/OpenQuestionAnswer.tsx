import { ArrowRight, LoaderCircle } from "lucide-react";
import { useId, useState } from "react";

type OpenQuestionAnswerProps = {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  isSubmitting?: boolean;
};

const MAX_ANSWER_LENGTH = 5000;

const OpenQuestionAnswer = ({onSubmit, disabled = false, isSubmitting = false}: OpenQuestionAnswerProps) => {
  const [answer, setAnswer] = useState("");
  const answerInputId = useId();

  const isDisabled = disabled || isSubmitting;
  const canSubmit = answer.trim().length > 0 && !isDisabled;

  const handleSubmit = () => {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer || isDisabled) {
      return;
    }

    onSubmit(trimmedAnswer);
  };

  return (
    <section
      aria-labelledby="open-question-answer-heading"
      className="shrink-0 rounded-2xl border border-default bg-surface p-3 sm:p-4"
    >
      <header className="mb-3">
        <h2
          id="open-question-answer-heading"
          className="text-base font-bold text-primary"
        >
          Your answer
        </h2>

        <p className="mt-1 text-sm text-secondary">
          Explain your answer using what you learned in this lesson.
        </p>
      </header>

      <label htmlFor={answerInputId} className="sr-only">
        Write your answer
      </label>

      <textarea
        id={answerInputId}
        value={answer}
        onChange={(event) =>
          setAnswer(event.target.value.slice(0, MAX_ANSWER_LENGTH))
        }
        disabled={isDisabled}
        maxLength={MAX_ANSWER_LENGTH}
        rows={3}
        placeholder={
          isSubmitting
            ? "Evaluating your answer..."
            : "Write your answer here..."
        }
        className="min-h-20 w-full resize-none rounded-xl border border-default
          bg-background px-3 py-2 text-sm leading-6 text-primary outline-none
          placeholder:text-muted focus:border-primary disabled:cursor-not-allowed
          disabled:opacity-60"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted" aria-live="polite">
          {answer.length}/{MAX_ANSWER_LENGTH} characters
        </span>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="flex min-h-10 cursor-pointer items-center justify-center
            gap-2 rounded-xl bg-button-main px-4 py-2 text-sm font-semibold
            text-button transition-colors hover:bg-button-hover
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                size={17}
                className="animate-spin"
              />
              Evaluating...
            </>
          ) : (
            <>
              Submit Answer
              <ArrowRight aria-hidden="true" size={17} />
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default OpenQuestionAnswer;