import { X } from "lucide-react";

type AIChatProps = {
  onClose: () => void;
};

const AIChat = ({ onClose }: AIChatProps) => {
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
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
              What are the inner planets?
            </div>
          </div>

          {/* AI response */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
              The inner planets are Mercury, Venus, Earth, and Mars. They
              are also known as terrestrial planets because they have
              solid, rocky surfaces.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
              The inner planets are Mercury, Venus, Earth, and Mars. They
              are also known as terrestrial planets because they have
              solid, rocky surfaces.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
              The inner planets are Mercury, Venus, Earth, and Mars. They
              are also known as terrestrial planets because they have
              solid, rocky surfaces.
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl bg-surface-secondary px-4 py-3 text-sm leading-6 text-secondary">
              The inner planets are Mercury, Venus, Earth, and Mars. They
              are also known as terrestrial planets because they have
              solid, rocky surfaces.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;