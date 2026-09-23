import { X } from "lucide-react";

import type { ChatMessage } from "./AIChatPanel";

type AIChatProps = {
  onClose: () => void;
  messages: ChatMessage[];
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
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div className="bg-primary h-9">
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

      <div className="h-full">
        <div className="flex flex-col h-full overflow-y-auto px-3 gap-4">

          {messages.map((message) => {
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
                  {message.content}
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