import { Menu } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import ThemeToggle from "../common/ThemeToggle";

type TopBarProps = {
  onMenuClick: () => void;
};

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const { user } = useAuthStore();

  return (
    <header className="m-3 flex h-20 shrink-0 items-center justify-between rounded-2xl border border-default bg-surface px-4 sm:px-6">
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

      <div className="flex items-center gap-4">
        {/* Future Search */}

        <ThemeToggle />
      </div>
    </header>
  );
};

export default TopBar;