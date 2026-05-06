import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [light, setLight] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") === "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", light);
    localStorage.setItem("theme", light ? "light" : "dark");
  }, [light]);

  return (
    <button
      onClick={() => setLight((s) => !s)}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      {light ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};
