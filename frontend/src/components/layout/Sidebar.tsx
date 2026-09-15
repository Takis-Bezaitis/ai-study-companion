import { NavLink } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { mainMenu, logoutMenuItem } from "../../config/menu";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();

  const avatarLetter = user?.name?.trim().charAt(0).toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 cursor-default bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 m-3 flex w-64 flex-col rounded-2xl
          border border-default bg-surface
          transition-transform duration-200
          lg:static lg:z-auto lg:m-3 lg:flex
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)]"}
        `}
      >
        <nav aria-label="Main navigation" className="flex flex-col gap-1 p-3">
          {mainMenu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-soft text-primary-color"
                      : "text-secondary hover:bg-surface-secondary-hover"
                  }`
                }
              >
                <Icon aria-hidden="true" size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-default p-3">
          <section
            aria-label="User account"
            className="mb-2 flex items-center gap-3 rounded-xl p-2"
          >
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-button"
            >
              {avatarLetter}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-secondary-hover"
          >
            <logoutMenuItem.icon aria-hidden="true" size={20} />
            <span>{logoutMenuItem.label}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;