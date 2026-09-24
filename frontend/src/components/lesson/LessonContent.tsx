import { BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { useLessonChunks } from "../../hooks/queries/useLessonChunks";

type LessonContentProps = {
  lessonId: string;
};

const LessonContent = ({ lessonId }: LessonContentProps) => {
  const {
    data: chunks,
    isLoading,
    isError,
    error,
  } = useLessonChunks(lessonId);

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
        {isLoading && (
          <p className="text-secondary">
            Loading lesson content...
          </p>
        )}

        {isError && (
          <p className="text-secondary">
            {error instanceof Error
              ? error.message
              : "Failed to load lesson content."}
          </p>
        )}

        {chunks && (
          <div className="max-w-4xl space-y-6 text-sm leading-7 text-secondary sm:text-base">
            {chunks.map((chunk, index) => {
              const [mainSection, subsectionTitle] =
                chunk.sectionTitle.split(" — ");

              const previousMainSection =
                index > 0
                  ? chunks[index - 1]?.sectionTitle.split(" — ")[0]
                  : undefined;

              const showMainSection =
                mainSection !== previousMainSection;

              return (
                <section key={chunk.id}>
                  {showMainSection && (
                    <h2 className="text-2xl font-bold text-primary">
                      {mainSection}
                      <br /><br />
                    </h2>
                  )}

                  <h3 className="text-xl font-semibold text-primary">
                    {subsectionTitle}
                  </h3>

                  <div className="mt-3">
                    <ReactMarkdown
                      components={{
                        ul: ({ children }) => (
                          <ul className="my-3 list-disc space-y-1 pl-6">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-3 list-decimal space-y-1 pl-6">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="pl-1">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-primary">
                            {children}
                          </strong>
                        ),
                        h3: ({ children }) => (
                          <h3 className="mt-6 text-lg font-semibold text-primary">
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {chunk.content}
                    </ReactMarkdown>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </article>

    </section>
  );
};

export default LessonContent;
