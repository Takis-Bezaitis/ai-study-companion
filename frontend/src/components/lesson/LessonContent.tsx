import { BookOpen } from "lucide-react";

import type { Lesson } from "../../types/custom";

type LessonContentProps = {
  lesson: Lesson;
};

const LessonContent = ({ lesson }: LessonContentProps) => {
  return (
    <section
      aria-labelledby="lesson-content-heading"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-default bg-surface"
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-default p-5 sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
          <BookOpen aria-hidden="true" size={20} />
        </div>

        <h2
          id="lesson-content-heading"
          className="text-xl font-bold text-primary"
        >
          Lesson
        </h2>
      </header>

      <article className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-4xl space-y-6 text-sm leading-7 text-secondary sm:text-base">
          <div>
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              {lesson.title}
            </h1>

            <p className="mt-4">
              The Solar System consists of the Sun and all the objects
              that orbit it. It includes planets, moons, asteroids,
              comets, and many other smaller objects.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              The Inner Planets
            </h2>

            <p className="mt-3">
              The four inner planets are Mercury, Venus, Earth, and
              Mars. They are also known as terrestrial planets because
              they have solid, rocky surfaces.
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-primary">Mercury</strong> is the
                closest planet to the Sun.
              </li>

              <li>
                <strong className="text-primary">Venus</strong> has the
                hottest surface of any planet in the Solar System.
              </li>

              <li>
                <strong className="text-primary">Earth</strong> is the
                only planet currently known to support life.
              </li>

              <li>
                <strong className="text-primary">Mars</strong> is often
                called the Red Planet because of its reddish surface.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              The Outer Planets
            </h2>

            <p className="mt-3">
              Jupiter, Saturn, Uranus, and Neptune are the outer
              planets. They are much larger than the terrestrial
              planets and are primarily composed of gases or ice.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Why is the Sun important?
            </h2>

            <p className="mt-3">
              The Sun is the star at the center of our Solar System.
              Its gravity keeps the planets in their orbits, while its
              energy provides the light and heat necessary for life on
              Earth.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
};

export default LessonContent;
