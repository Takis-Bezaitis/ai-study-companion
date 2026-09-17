import { X } from "lucide-react";

import AskAI from "./AskAI";
import AIChat from "./AIChat";

type AIChatPanelProps = {
  onClose: () => void;
};

const AIChatPanel = ({ onClose }: AIChatPanelProps) => {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-default bg-surface shadow-xl">
      {/* Chat messages */}
      <AIChat />

      {/* Ask AI */}
      <div className="relative shrink-0 border-t border-default p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI chat"
          className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl text-secondary transition-colors hover:bg-surface-secondary-hover hover:text-primary-color"
        >
          <X aria-hidden="true" size={20} />
        </button>

        <AskAI />
      </div>
    </section>
  );
};

export default AIChatPanel;

