import {
  ArrowRight,
  Brain,
  CarFront,
  CircleHelp,
  Gamepad2,
} from "lucide-react";
import { Link } from "react-router";

type CompactActivitiesProps = {
  lessonId: string;
};

const CompactActivities = ({ lessonId }: CompactActivitiesProps) => {
  const activities = [
    {
      title: "Quiz",
      icon: Brain,
      href: `/lessons/${lessonId}/quiz`,
      accent: "bg-primary-soft text-primary-color",
      action: "Start",
    },
    {
      title: "Question",
      icon: CircleHelp,
      href: `/lessons/${lessonId}`,
      accent: "bg-primary-soft text-primary-color",
      action: "Try",
    },
    {
      title: "Catch Items",
      icon: Gamepad2,
      href: `/lessons/${lessonId}/games`,
      accent: "bg-accent-soft text-accent",
      action: "Play",
    },
    {
      title: "Road Race",
      icon: CarFront,
      href: `/lessons/${lessonId}/games`,
      accent: "bg-accent-soft text-accent",
      action: "Play",
    },
  ];

  return (
    <section aria-labelledby="compact-activities-heading" className="shrink-0">
      <h2
        id="compact-activities-heading"
        className="mb-3 text-center text-sm font-bold text-primary"
      >
        Activities
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <Link
              key={activity.title}
              to={activity.href}
              className="group rounded-xl border border-default bg-surface p-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
            >
              <article className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.accent}`}
                >
                  <Icon aria-hidden="true" size={16} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-xs font-semibold text-primary">
                    {activity.title}
                  </h3>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-color">
                    {activity.action}
                    <ArrowRight
                      aria-hidden="true"
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CompactActivities;