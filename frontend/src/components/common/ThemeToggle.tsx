import { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {

    const stored = localStorage.getItem("ai-study-companion-theme");
    if (stored === "light" || stored === "dark") return stored;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("ai-study-companion-theme", theme);
  }, [theme]);

  return (
    <div
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="content-center cursor-pointer"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </div>
  );
};

export default ThemeToggle;
