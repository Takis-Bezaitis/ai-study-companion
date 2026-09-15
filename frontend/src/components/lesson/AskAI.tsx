import { ArrowRight, Bot } from "lucide-react";

const AskAI = () => {
  return (
    <section
      aria-labelledby="ask-ai-heading"
      className="rounded-2xl border border-default bg-surface p-5"
    >
      <header className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
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
      </header>

      <form className="flex gap-2">
        <label htmlFor="lesson-question" className="sr-only">
          Ask a question about this lesson
        </label>

        <input
          id="lesson-question"
          type="text"
          placeholder="Ask a question..."
          className="min-w-0 flex-1 rounded-xl border border-default bg-background px-3 py-2.5 text-sm text-primary outline-none placeholder:text-muted focus:border-primary"
        />

        <button
          type="submit"
          disabled
          aria-label="Ask AI"
          className="flex shrink-0 cursor-not-allowed items-center justify-center rounded-xl bg-button-main px-3 text-button opacity-60"
        >
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </form>
    </section>
  );
};

export default AskAI;

