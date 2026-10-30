import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useLesson } from "../hooks/queries/lessons/useLesson";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import OpenQuestionAnswer from "../components/lesson/OpenQuestionAnswer";
import { useOpenQuestion } from "../hooks/ai/useOpenQuestion";

const TYPEWRITER_INTERVAL_MS = 8;

const OpenQuestion = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const {
    data: lesson,
    isLoading,
    isError,
    error,
  } = useLesson(lessonId ?? "");

  const handleBack = () => {
    if (lessonId) {
      navigate(`/lessons/${lessonId}`);
    }
  };

  const {
    generateMutation,
    evaluateMutation,
  } = useOpenQuestion();

  const [displayedQuestion, setDisplayedQuestion] = useState("");

  const question = generateMutation.data;
  const evaluation = evaluateMutation.data;

  useEffect(() => {
    if (!question?.question) {
      setDisplayedQuestion("");
      return;
    }

    const text = question.question;
    let index = 0;

    setDisplayedQuestion("");

    const intervalId = window.setInterval(() => {
      index += 3;

      setDisplayedQuestion(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
      }
    }, TYPEWRITER_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [question?.id, question?.question]);

  const handleGenerateQuestion = () => {
    if (!lessonId || generateMutation.isPending) {
      return;
    }

    evaluateMutation.reset();
    generateMutation.mutate(lessonId);
  };

  const handleSubmitAnswer = (answer: string) => {
    if (!lessonId || !question || evaluateMutation.isPending) {
      return;
    }

    evaluateMutation.mutate({
      lessonId,
      questionId: question.id,
      answer,
    });
  };

  const isGenerating = generateMutation.isPending;
  const isEvaluating = evaluateMutation.isPending;
  const hasError = generateMutation.isError || evaluateMutation.isError;
  const errorMessage = generateMutation.isError
    ? generateMutation.error.message
    : evaluateMutation.isError
      ? evaluateMutation.error.message
      : null;

  if (!lessonId) {
    return (
      <div className="rounded-2xl border border-default bg-surface p-6">
        <p className="text-sm text-secondary">
          Lesson not found. Please return to the lesson and try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-background p-6">
        <div className="flex items-center gap-3 text-secondary">
          <LoaderCircle
            aria-hidden="true"
            size={22}
            className="animate-spin text-primary-color"
          />
          <p className="text-sm">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="rounded-2xl border border-default bg-surface p-6">
        <p role="alert" className="text-sm text-secondary">
          {error?.message ?? "Unable to load the lesson. Please try again."}
        </p>

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary-color"
        >
          <ArrowLeft aria-hidden="true" size={18} /> Back to lesson
        </button>
      </div>
    );
  }

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden bg-background p-4 sm:p-6 sm:pt-2">
      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary-color"
        >
          <ArrowLeft aria-hidden="true" size={18} /> Back to lesson
        </button>
      </div>

      <section
        aria-labelledby="open-question-title"
        className="mx-auto mt-2 flex w-full max-w-6xl h-full min-h-0 flex-col gap-3 rounded-2xl
          border border-default bg-surface shadow-lg p-2.5"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
            <BookOpen aria-hidden="true" size={24} />
          </div>
          <div className="min-w-0">
            <p className="mb-1 text-sm font-medium text-primary-color">
              {lesson.category.name}
            </p>
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
            <Lightbulb aria-hidden="true" size={24} />
          </div>
          <div className="min-w-0">
            <h1
              id="open-question-title"
              className="text-xl font-bold text-primary sm:text-2xl"
            >
              Knowledge Check
            </h1>
            <p className="mt-1 text-sm text-secondary">
                Think it through, write your answer, and get AI feedback.
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-(--color-border)"></div>

        {/* Question */}
        {!evaluation && (
          <section
            aria-labelledby="question-heading"
            className="h-36 shrink-0 overflow-y-auto rounded-2xl border border-default bg-surface-secondary p-3 sm:h-44 sm:p-4"
          >
            {question ? (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary-color">
                  {question.sectionTitle}
                </p>

                <h2 id="question-heading" className="sr-only">
                  Your question
                </h2>

                <p className="whitespace-pre-wrap text-base leading-7 text-primary sm:text-lg">
                  {displayedQuestion}
                  {displayedQuestion.length < question.question.length && (
                    <span
                      aria-hidden="true"
                      className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle"
                    />
                  )}
                </p>
              </>
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                {isGenerating ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      size={28}
                      className="animate-spin text-primary-color"
                    />
                    <p className="text-sm text-secondary">
                      Preparing a question from your lesson...
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold text-primary">
                      Ready to test your understanding?
                    </h2>
                    <p className="max-w-md text-sm leading-6 text-secondary">
                      Generate an open question based on your lesson material.
                    </p>

                    <button
                      type="button"
                      onClick={handleGenerateQuestion}
                      disabled={isGenerating}
                      className="mt-2 flex min-h-10 cursor-pointer items-center
                        justify-center gap-2 rounded-xl bg-button-main px-4 py-2
                        text-sm font-semibold text-button hover:bg-button-hover
                        disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Generate Question
                      <ArrowRight aria-hidden="true" size={17} />
                    </button>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {/* Error */}
        {hasError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-default
              bg-accent-soft p-3 text-sm text-primary"
          >
            <AlertCircle
              aria-hidden="true"
              size={19}
              className="mt-0.5 shrink-0 text-accent"
            />
            <div className="min-w-0 flex-1">
              <p>{errorMessage}</p>

              {generateMutation.isError && (
                <button
                  type="button"
                  onClick={handleGenerateQuestion}
                  className="mt-2 font-semibold text-primary-color underline"
                >
                  Try again
                </button>
              )}

              {evaluateMutation.isError && (
                <button
                  type="button"
                  onClick={() => evaluateMutation.reset()}
                  className="mt-2 font-semibold text-primary-color underline"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        )}

        {/* Evaluation result */}
        <section
          aria-live="polite"
          aria-labelledby="feedback-heading"
          className={`min-h-0 overflow-y-auto rounded-2xl
            border border-default bg-background p-4 sm:p-5
            ${evaluation ? "flex-1" : "shrink-0"}`}
        >
          {evaluation ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2
                    id="feedback-heading"
                    className="text-lg font-bold text-primary"
                  >
                    Your Results
                  </h2>
                  <p className="mt-1 text-sm text-secondary">
                    Here is how your answer was evaluated.
                  </p>
                </div>

                <div className="rounded-xl bg-primary-soft px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-primary-color">
                    {evaluation.score}
                    <span className="text-base font-medium">
                      /{evaluation.maxScore}
                    </span>
                  </p>
                  <p className="text-xs text-secondary">Your score</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-primary">
                  Criteria breakdown
                </h3>

                {evaluation.feedback.criterionScores.map((item) => {
                  const criterion = question?.evaluationCriteria.find(
                    (candidate) => candidate.criterion === item.criterion,
                  );

                  const maxPoints = criterion?.maxPoints ?? 100;
                  const percentage = Math.min(
                    100,
                    (item.awardedPoints / maxPoints) * 100,
                  );

                  return (
                    <div key={item.criterion} className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-5 text-primary">
                          {item.criterion}
                        </p>
                        <span className="shrink-0 text-sm font-semibold text-primary">
                          {item.awardedPoints}/{maxPoints}
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full bg-surface-secondary"
                        role="progressbar"
                        aria-label={item.criterion}
                        aria-valuemin={0}
                        aria-valuemax={maxPoints}
                        aria-valuenow={item.awardedPoints}
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="text-sm leading-6 text-secondary">
                        {item.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-surface-secondary p-3">
                <h3 className="font-semibold text-primary">
                  Overall feedback
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {evaluation.feedback.reasoning}
                </p>
              </div>

              {evaluation.feedback.correctPoints.length > 0 && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle2
                      aria-hidden="true"
                      size={18}
                      className="text-success"
                    />
                    What you got right
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm leading-6 text-secondary">
                    {evaluation.feedback.correctPoints.map((point, index) => (
                      <li key={`${point}-${index}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.feedback.missingPoints.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">
                    What was missing
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm leading-6 text-secondary">
                    {evaluation.feedback.missingPoints.map((point, index) => (
                      <li key={`${point}-${index}`}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation.feedback.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 font-semibold text-primary">
                    <Lightbulb
                      aria-hidden="true"
                      size={18}
                      className="text-accent"
                    />
                    Suggestions to improve
                  </h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm leading-6 text-secondary">
                    {evaluation.feedback.suggestions.map((suggestion, index) => (
                      <li key={`${suggestion}-${index}`}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerateQuestion}
                disabled={isGenerating}
                className="flex min-h-10 w-fit max-w-full cursor-pointer items-center
                  justify-center gap-2 self-start rounded-xl bg-button-main
                  px-5 py-2 text-sm font-semibold text-button
                  hover:bg-button-hover disabled:cursor-not-allowed
                  disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      size={17}
                      className="animate-spin"
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <RotateCcw aria-hidden="true" size={17} />
                    Next Question
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex min-h-32 flex-col items-center justify-center gap-2 text-center">
              <h2
                id="feedback-heading"
                className="font-semibold text-primary"
              >
                Your feedback will appear here
              </h2>

              <p className="max-w-md text-sm leading-6 text-secondary">
                Submit your answer to see your score, what you got right, and how you can improve.
              </p>
            </div>
          )}
        </section>

        {/* Answer input */}
        {!evaluation && (
          <OpenQuestionAnswer
            key={question?.id}
            onSubmit={handleSubmitAnswer}
            disabled={
              !question ||
              isGenerating ||
              isEvaluating ||
              Boolean(evaluation)
            }
            isSubmitting={isEvaluating}
          />
        )}
      </section>
    </main>
  );
};

export default OpenQuestion;