import {
  ArrowRight,
  Brain,
  CarFront,
  CircleHelp,
  Gamepad2,
  MessageCircle,
  X,
} from "lucide-react";
import { Link } from "react-router";

type LessonActionsDrawerProps = {
  open: boolean;
  lessonId: string;
  onClose: () => void;
  onAskAI: () => void;
};

const LessonActionsDrawer = ({
  lessonId,
  open,
  onClose,
  onAskAI,
}: LessonActionsDrawerProps) => {
  const activities = [
    {
      title: "Quiz",
      description: "Test your knowledge.",
      icon: Brain,
      href: `/lessons/${lessonId}/quiz`,
      accent: "bg-primary-soft text-primary-color",
      action: "Start Quiz",
    },
    {
      title: "Question",
      description: "Answer an AI-generated question.",
      icon: CircleHelp,
      href: `/lessons/${lessonId}`,
      accent: "bg-primary-soft text-primary-color",
      action: "Try Question",
    },
    {
      title: "Catch Items",
      description: "Learn through an arcade challenge.",
      icon: Gamepad2,
      href: `/lessons/${lessonId}/games`,
      accent: "bg-accent-soft text-accent",
      action: "Play Game",
    },
    {
      title: "Road Race",
      description: "Race through lesson questions.",
      icon: CarFront,
      href: `/lessons/${lessonId}/games`,
      accent: "bg-accent-soft text-accent",
      action: "Play Game",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`xl:hidden absolute inset-0 z-20 bg-black/20 backdrop-blur-[2px] transition-opacity 
            duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        aria-label="Lesson actions"
        className={`xl:hidden absolute inset-y-0 right-0 z-30 w-full max-w-md overflow-y-auto rounded-l-2xl border-l border-default bg-surface p-4 shadow-2xl transition-transform duration-300 ease-out sm:p-5 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">
            Lesson Actions
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lesson actions"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-secondary 
            transition-colors hover:bg-surface-secondary-hover hover:text-primary-color cursor-pointer"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        {/* Ask AI */}
        <button
          type="button"
          onClick={onAskAI}
          className="group mb-3 w-full cursor-pointer rounded-2xl border border-default bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
        >
          <div className="flex items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
              <MessageCircle aria-hidden="true" size={20} />
            </div>

            <h3 className="ml-2 text-sm font-semibold text-primary">
              Ask AI
            </h3>
          </div>

          <p className="mt-1 text-xs leading-5 text-secondary">
            Ask anything about this lesson.
          </p>

          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-color">
            Ask a Question
            <ArrowRight
              aria-hidden="true"
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </button>

        {/* Activities */}
        <div className="grid gap-3 sm:grid-cols-2">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <Link
                key={activity.title}
                to={activity.href}
                onClick={onClose}
                className="group rounded-2xl border border-default bg-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
              >
                <article className="flex h-full flex-col">
                  <div className="flex items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.accent}`}
                    >
                      <Icon aria-hidden="true" size={20} />
                    </div>

                    <h3 className="ml-2 text-sm font-semibold text-primary">
                      {activity.title}
                    </h3>
                  </div>

                  <p className="mt-1 flex-1 text-xs leading-5 text-secondary">
                    {activity.description}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-color">
                    {activity.action}
                    <ArrowRight
                      aria-hidden="true"
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default LessonActionsDrawer;