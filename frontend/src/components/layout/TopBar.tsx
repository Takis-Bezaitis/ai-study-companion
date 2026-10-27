import { Menu, Trophy } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useMyTotalScore } from "../../hooks/leaderboards/useLeaderboard";
import ThemeToggle from "../common/ThemeToggle";

type TopBarProps = {
  onMenuClick: () => void;
};

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user } = useAuthStore();
  const { data: score, isPending, isError} = useMyTotalScore();

  return (
    <header className="m-3 flex h-14 shrink-0 items-center justify-between rounded-2xl border border-default bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-secondary transition-colors hover:bg-surface-secondary-hover hover:text-primary lg:hidden"
        >
          <Menu aria-hidden="true" size={22} />
        </button>

        <h1 className="truncate text-lg font-semibold text-primary sm:text-xl lg:text-2xl">
          Hello, {user?.name} 👋
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <div
          aria-label={
            isError
              ? "Total score unavailable"
              : `Total score: ${score ?? 0}`
          }
          title={
            isError
              ? "Could not load total score"
              : "Your total score"
          }
          className="flex items-center gap-2 rounded-xl border border-default bg-surface-secondary px-3 py-2"
        >
          <Trophy
            aria-hidden="true"
            size={18}
            className="text-accent"
          />

          <span className="text-sm font-semibold text-primary">
            {isPending
              ? "..."
              : isError
                ? "—"
                : score!.toLocaleString("el-GR")}
          </span>

          <span className="hidden text-xs text-secondary sm:inline">
            Points
          </span>
        </div>



        <ThemeToggle />
      </div>
    </header>
  );
};

export default TopBar;