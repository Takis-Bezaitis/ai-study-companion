import {
  LayoutDashboard,
  BookOpen,
  ChartNoAxesCombined,
  Settings,
  LogOut,
} from "lucide-react";

export const mainMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Lessons",
    path: "/lessons",
    icon: BookOpen,
  },
  {
    label: "Progress",
    path: "/progress",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export const logoutMenuItem = {
  label: "Log out",
  icon: LogOut,
};