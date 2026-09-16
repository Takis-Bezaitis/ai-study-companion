import {
  ArrowRight,
  Brain,
  CarFront,
  Gamepad2,
  CircleHelp,
} from "lucide-react";
import { Link } from "react-router";

type LearningActivitiesProps = {
  lessonId: string;
};

const LearningActivities = ({
  lessonId,
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
    <section aria-labelledby="activities-heading">
      <header className="mb-3">
        <h2
          id="activities-heading"
          className="text-lg text-center font-bold text-primary"
        >
          Activities
        </h2>

      </header>

      <div className="grid grid-cols-4 xl:grid-cols-1 gap-2.5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <Link
              key={activity.title}
              to={activity.href}
              className="group rounded-2xl border border-default bg-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
            >
              <article className="flex h-full flex-col">
                <div className="flex place-items-center">
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

