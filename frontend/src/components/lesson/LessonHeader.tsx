import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router";

import type { Lesson } from "../../types/custom";

type LessonHeaderProps = {
  lesson: Lesson;
};

const LessonHeader = ({ lesson }: LessonHeaderProps) => {
  return (
    <header>
      <Link
        to="/lessons"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-primary-color"
      >
        <ArrowLeft aria-hidden="true" size={18} />Back to Lessons
      </Link>

      <div className="flex items-start gap-4">
        <div className="flex h-7 w-7 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
          <BookOpen aria-hidden="true" size={24} />
        </div>
        <div className="min-w-0">
            <p className="sm:mb-1 text-sm font-medium text-primary-color">
              {lesson.category.name}
            </p>

            <h1 className="text-lg font-bold text-primary sm:text-3xl">
              {lesson.title}
            </h1>
        </div>
      </div>
      {lesson.description && (
      <p className="sm:mt-2 max-w-3xl text-sm text-secondary sm:text-base">
        {lesson.description}
      </p>
      )}
    </header>
  );
};

export default LessonHeader;

