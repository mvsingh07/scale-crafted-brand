"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

const CYCLE: Theme[] = ["dark", "light"];

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("mv-theme") as Theme | null;
    const t: Theme = stored === "light" ? "light" : "dark";
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggle = () => {
    setTheme(prev => {
      const next = CYCLE[(CYCLE.indexOf(prev) + 1) % CYCLE.length];
      localStorage.setItem("mv-theme", next);
      applyTheme(next);
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className="grid h-8 w-8 place-items-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
};
