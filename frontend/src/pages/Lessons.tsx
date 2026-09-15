import { Link } from "react-router";
import { BookOpen } from "lucide-react";

import { useLessons } from "../hooks/queries/useLessons";
import type { Lesson } from "../types/custom";

const Lessons = () => {
  const { data: lessons, isLoading, isError, error } = useLessons();

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">
            Lessons
          </h2>

          <p className="mt-2 text-secondary">
            Explore your lessons and keep learning.
          </p>
        </header>

        <div className="flex items-center justify-center rounded-2xl border border-default bg-surface p-12">
          <p className="text-secondary">Loading lessons...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">
            Lessons
          </h2>
        </header>

        <div
          role="alert"
          className="rounded-2xl border border-default bg-surface p-6"
        >
          <p className="font-medium text-primary">
            Failed to load lessons.
          </p>

          <p className="mt-2 text-sm text-secondary">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </p>
        </div>
      </section>
    );
  }

  const groupedLessons = new Map<
    string,
    {
      id: string;
      name: string;
      lessons: Lesson[];
    }
  >();

  for (const lesson of lessons ?? []) {
    const categoryId = lesson.category.id;

    if (!groupedLessons.has(categoryId)) {
      groupedLessons.set(categoryId, {
        id: categoryId,
        name: lesson.category.name,
        lessons: [],
      });
    }

    groupedLessons.get(categoryId)!.lessons.push(lesson);
  }

  const categories = Array.from(groupedLessons.values());

  return (
    <section className="w-full max-w-6xl p-4 sm:p-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
          Lessons
        </h2>

        <p className="mt-2 text-secondary">
          Explore your lessons and build your knowledge.
        </p>
      </header>

      {categories.length === 0 ? (
        <section className="rounded-2xl border border-default bg-surface p-8 text-center">
          <BookOpen
            aria-hidden="true"
            className="mx-auto mb-4 text-muted"
            size={36}
          />

          <h3 className="text-lg font-semibold text-primary">
            No lessons available
          </h3>

          <p className="mt-2 text-sm text-secondary">
            There are no lessons available yet.
          </p>
        </section>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <section
              key={category.id}
              aria-labelledby={`category-${category.id}`}
            >
              <header className="mb-4">
                <h3
                  id={`category-${category.id}`}
                  className="text-lg font-bold text-primary sm:text-xl"
                >
                  {category.name}
                </h3>
              </header>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/lessons/${lesson.id}`}
                    className="group rounded-2xl border border-default bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
                  >
                    <article className="h-full">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
                        <BookOpen aria-hidden="true" size={21} />
                      </div>

                      <h4 className="text-base font-semibold text-primary sm:text-lg">
                        {lesson.title}
                      </h4>

                      {lesson.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-secondary">
                          {lesson.description}
                        </p>
                      )}

                      <span className="mt-5 inline-block text-sm font-medium text-primary-color">
                        Start learning →
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};

export default Lessons;
