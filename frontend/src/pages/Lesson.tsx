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
      <div className="grid min-h-0 w-full flex-1 gap-6">
        {/* Main learning area */}
        <div className="block xl:flex min-h-0 overflow-hidden">
          <div className="w-full xl:flex-3 min-w-0">
            <LessonHeader lesson={lesson} />
          </div>

          <aside className="hidden xl:block xl:flex-2 mb-4 min-w-0 sm:mb-5 xl:mb-0">
            <AskAI />
          </aside>
          
        </div>

        <div className="contents xl:flex min-h-0 gap-6">
          <div className="min-w-0 overflow-hidden xl:flex-9 min-[1600px]:flex-10">
            <LessonContent lesson={lesson} />
          </div>

          <aside className="min-h-0 min-w-0 overflow-hidden hidden xl:block xl:flex-3 min-[1600px]:flex-2">
            <LearningActivities lessonId={lesson.id} />
          </aside>
        </div>
        
      </div>
    </section>
  );
};

export default Lesson;

