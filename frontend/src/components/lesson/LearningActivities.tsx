import {
  ArrowRight,
  Brain,
  CarFront,
  CircleHelp,
  Gamepad2,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router";

type LearningActivitiesProps = {
  lessonId: string;
  onAskAI: () => void;
};

const LearningActivities = ({
  lessonId,
  onAskAI,
}: LearningActivitiesProps) => {
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
    <section aria-labelledby="activities-heading" className="flex flex-col items-center">
      {/* Ask AI */}
      <button
        type="button"
        onClick={onAskAI}
        className="group mb-5 w-60 cursor-pointer rounded-2xl border border-default bg-surface p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
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
      <header className="mb-3">
        <h2
          id="activities-heading"
          className="text-center text-lg font-bold text-primary"
        >
          Activities
        </h2>
      </header>

      <div className="grid grid-cols-4 gap-2.5 md:grid-cols-1">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <Link
              key={activity.title}
              to={activity.href}
              className="group w-60 rounded-2xl border border-default bg-surface p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
            >
              <article className="flex h-full flex-col">
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${activity.accent}`}
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
    </section>
  );
};

export default LearningActivities;