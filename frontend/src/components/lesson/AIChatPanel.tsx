import AskAI from "./AskAI";
import AIChat from "./AIChat";

type AIChatPanelProps = {
  onClose: () => void;
};

const AIChatPanel = ({ onClose }: AIChatPanelProps) => {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl 
      border border-default bg-surface shadow-xl h-full">
      {/* Chat messages */}
      <AIChat onClose={onClose}/>

      {/* Ask AI */}
      <div className="relative shrink-0 border-t border-default p-3">
        <AskAI />
      </div>
    </section>
  );
};

export default AIChatPanel;

