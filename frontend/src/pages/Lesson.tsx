import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

import LessonHeader from "../components/lesson/LessonHeader";
import LessonContent from "../components/lesson/LessonContent";
import AskAI from "../components/lesson/AskAI";
import LearningActivities from "../components/lesson/LearningActivities";
import { useLesson } from "../hooks/queries/useLesson";

const Lesson = () => {
  const { lessonId } = useParams();

  const {
    data: lesson,
    isLoading,
    isError,
    error,
  } = useLesson(lessonId ?? "");

  if (isLoading) {
    return (
      <section className="w-full p-4 sm:p-6">
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-default bg-surface">
          <p className="text-secondary">Loading lesson...</p>
        </div>
      </section>
    );
  }

  if (isError || !lesson) {
    return (
      <section className="w-full p-4 sm:p-6">
        <Link
          to="/lessons"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary-color"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Back to Lessons
        </Link>

        <div
          role="alert"
          className="rounded-2xl border border-default bg-surface p-6"
        >
          <h2 className="font-semibold text-primary">
            Failed to load lesson
          </h2>

          <p className="mt-2 text-sm text-secondary">
            {error instanceof Error
              ? error.message
              : "The lesson could not be found."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden p-4 sm:p-6">
      <div className="grid min-h-0 w-full flex-1 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main learning area */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          <LessonHeader lesson={lesson} />

          <div className="min-h-0 flex-1 overflow-hidden">
            <LessonContent lesson={lesson} />
          </div>
        </div>

        {/* AI & activities */}
        <aside className="flex min-h-0 flex-col gap-5 overflow-hidden">
          <AskAI />

          <LearningActivities lessonId={lesson.id} />
        </aside>
      </div>
    </section>
  );
};

export default Lesson;

