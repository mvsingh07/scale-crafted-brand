"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";

const CYCLE: Theme[] = ["system", "light", "dark"];

function resolvedTheme(t: Theme): "light" | "dark" {
  if (t !== "system") return t;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", resolvedTheme(t));
}

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("mv-theme") as Theme | null;
    const t: Theme = stored && CYCLE.includes(stored) ? stored : "system";
    setTheme(t);
    applyTheme(t);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      const curr = (localStorage.getItem("mv-theme") as Theme) ?? "system";
      if (curr === "system") applyTheme("system");
    };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  const cycle = () => {
    setTheme(prev => {
      const next = CYCLE[(CYCLE.indexOf(prev) + 1) % CYCLE.length];
      localStorage.setItem("mv-theme", next);
      applyTheme(next);
      return next;
    });
  };

  const icon = theme === "light" ? <Sun size={15} /> : theme === "dark" ? <Moon size={15} /> : <Monitor size={15} />;
  const label = theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to cycle.`}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      {icon}
    </button>
  );
};
