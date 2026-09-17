import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, LayoutGrid } from "lucide-react";

import LessonHeader from "../components/lesson/LessonHeader";
import LessonContent from "../components/lesson/LessonContent";
import LearningActivities from "../components/lesson/LearningActivities";
import { useLesson } from "../hooks/queries/useLesson";
import LessonActionsDrawer from "../components/lesson/LessonActionsDrawer";
import AIChatPanel from "../components/lesson/AIChatPanel";

const Lesson = () => {
  const [showActions, setShowActions] = useState(false);
  const [showAskAI, setShowAskAI] = useState(false);
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
      <div className="grid min-h-0 w-full flex-1 gap-6 xl:flex">
        {/* Main learning area */}
        <div className="min-h-0 min-w-0 overflow-hidden xl:flex-9 min-[1600px]:flex-10">
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <LessonHeader lesson={lesson} />

            {/* for mobile, sm, md, lg views */}
            <aside className="flex items-end justify-end xl:hidden">
              <button
                type="button"
                onClick={() => setShowActions(true)}
                aria-label="Open lesson activities"
                aria-expanded={showActions}
                className="flex cursor-pointer flex-col items-center rounded-xl px-3 py-1.5 
                  text-primary-color transition-colors hover:bg-surface-secondary-hover 
                  sm:flex-row sm:gap-2"
              >
                <LayoutGrid
                  aria-hidden="true"
                  size={30}
                />

                <span className="text-sm font-semibold sm:text-lg">
                  Activities
                </span>
              </button>
            </aside>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <LessonContent lesson={lesson} />

              {showAskAI &&
                <div className="absolute inset-0 z-20 xl:hidden">
                  <AIChatPanel
                    onClose={() => setShowAskAI(false)}
                  />
                </div>
              }
            </div>
          </div>
        </div>

        {/* for xl views */}
        <aside className="hidden min-h-0 min-w-0 overflow-hidden xl:block xl:flex-3 min-[1600px]:flex-2">
          {showAskAI ? (
            <AIChatPanel
              onClose={() => setShowAskAI(false)}
            />
          ) : (
            <LearningActivities
              lessonId={lesson.id}
              onAskAI={() => setShowAskAI(true)}
            />
          )}
        </aside>

        {/* for mobile, sm, md, lg views */}
        <LessonActionsDrawer
          open={showActions}
          lessonId={lesson.id}
          onClose={() => setShowActions(false)}
          onAskAI={() => {
            setShowActions(false);
            setShowAskAI(true);
          }}
        />
      </div>
    </section>
  );
};

export default Lesson;