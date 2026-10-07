import { ChevronLeft } from "lucide-react";

type GameBackButtonProps = {
  onBack: () => void;
  label?: string;
};

const GameBackButton = ({
  onBack,
  label = "Back to lesson",
}: GameBackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onBack}
      aria-label={label}
      className="pointer-events-auto flex h-6 w-6 md:h-9 md:w-9 cursor-pointer items-center justify-center rounded-lg border border-default bg-surface text-primary shadow-sm transition-colors hover:bg-surface-secondary-hover"
    >
      <ChevronLeft size={20} />
    </button>
  );
};

export default GameBackButton;