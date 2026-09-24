import { useEffect, useRef, useState } from "react";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { useLessonChunks } from "../../hooks/queries/useLessonChunks";

type LessonContentProps = {
  lessonId: string;
};

const LessonContent = ({
  lessonId,
}: LessonContentProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState("");

  const articleRef = useRef<HTMLElement>(null);

  const {
    data: chunks,
    isLoading,
    isError,
    error,
  } = useLessonChunks(lessonId);

  const totalPages = chunks?.length ?? 0;
  const currentChunk = chunks?.[currentPage];

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const [mainSection, subsectionTitle] = currentChunk?.sectionTitle.split(" — ") ?? [];

  const handlePageInput = () => {
    const page = Number(pageInput);

    if (
      Number.isInteger(page) &&
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page - 1);
      setPageInput("");
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [lessonId]);

  useEffect(() => {
    articleRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  return (
    <section
      aria-label="Lesson content"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-default bg-surface"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-default p-5 sm:p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary-color">
          <BookOpen
            aria-hidden="true"
            size={20}
          />
        </div>

        {totalPages > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isFirstPage}
              aria-label="Previous page"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-secondary-hover hover:text-primary disabled:cursor-default disabled:opacity-40"
              onClick={() => {
                setCurrentPage(
                  (page) => page - 1,
                );
              }}
            >
              <ChevronLeft
                aria-hidden="true"
                size={20}
              />
            </button>

            <span className="min-w-14 text-center text-sm font-medium text-secondary">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              type="button"
              disabled={isLastPage}
              aria-label="Next page"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-secondary-hover hover:text-primary disabled:cursor-default disabled:opacity-40"
              onClick={() => {
                setCurrentPage(
                  (page) => page + 1,
                );
              }}
            >
              <ChevronRight
                aria-hidden="true"
                size={20}
              />
            </button>

            <div className="flex items-center gap-2 text-sm text-secondary">
              <label htmlFor="page-input">
                Go to:
              </label>

              <input
                id="page-input"
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) =>
                  setPageInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handlePageInput();
                  }
                }}
                className="h-8 w-12 rounded-lg border border-default bg-surface px-2 text-center text-sm text-primary outline-none focus:border-primary-color"
                aria-label="Page number"
              />

              <button
                type="button"
                onClick={handlePageInput}
                className="cursor-pointer h-8 rounded-lg bg-primary px-3 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                Go
              </button>
            </div>

          </div>
        )}
      </header>

      <article ref={articleRef} className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
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

        {currentChunk && (
          <div className="max-w-4xl text-sm leading-7 text-secondary sm:text-base">
            <section>
              <h2 className="text-2xl font-bold text-primary">
                {mainSection}
                <br />
                <br />
              </h2>

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
                      <li className="pl-1">
                        {children}
                      </li>
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
                  {currentChunk.content}
                </ReactMarkdown>
              </div>
            </section>
          </div>
        )}

      </article>
    </section>
  );
};

export default LessonContent;