import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import type { AiMessage } from "../../store/aiMessageStore";

type AIChatProps = {
  onClose: () => void;
  messages: AiMessage[];
  isLoading: boolean;
  error: Error | null;
};

const AIChat = ({ onClose, messages, isLoading, error }: AIChatProps) => {
  {isLoading && (
    <div className="text-sm text-secondary">
      AI is thinking...
    </div>
  )}

  {error && (
    <div className="text-sm text-red-500">
      {error.message}
    </div>
  )}

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="h-9 shrink-0 bg-primary">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI chat"
          className="absolute right-2 top-0 z-10 flex h-9 w-9 cursor-pointer items-center 
            justify-center rounded-xl text-secondary transition-colors 
            hover:bg-surface-secondary-hover hover:text-primary-color"
        >
          <X aria-hidden="true" size={20} className="text-primary" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col gap-4">

          {messages.map((message) => {
            if (
              message.role === "assistant" &&
              !message.content
            ) {
              return null;
            }

            if (message.role === "user") {
              return (
                <div
                  key={message.id}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
                    {message.content}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
                  <ReactMarkdown
                    components={{
                      ul: ({ children }) => (
                        <ul className="my-2 list-disc space-y-1 pl-5">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-2 list-decimal space-y-1 pl-5">
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
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">
                          {children}
                        </p>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            );

          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
                AI is thinking...
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
                {error.message}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AIChat;