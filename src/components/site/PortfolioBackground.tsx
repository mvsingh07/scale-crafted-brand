"use client";

import { useEffect, useState } from "react";
import { PrismaticBurst } from "./PrismaticBurst";

function useThemeMode() {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const update = () =>
      setMode(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

export const PortfolioBackground = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const mode = useThemeMode();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const isLight = mode === "light";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <PrismaticBurst
        animationType="rotate3d"
        intensity={isLight ? 0.6 : 0.82}
        speed={0.2}
        distort={0.7}
        paused={reduceMotion}
        offset={{ x: 0, y: "-8px" }}
        rayCount={26}
        mixBlendMode={isLight ? "multiply" : "lighten"}
        colors={isLight
          ? ["#B8860B", "#9C7A35", "#6B7280", "#8B6914"]
          : ["#C9A55A", "#E0C27A", "#F8FAFC", "#9C7A35"]
        }
        className={isLight ? "opacity-30" : "opacity-45"}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_12%,transparent_0%,hsl(var(--background)/0.34)_44%,hsl(var(--background)/0.94)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.2),hsl(var(--background)/0.82)_58%,hsl(var(--background)/0.98))]" />
      <div className="absolute inset-0 bg-grid opacity-25" />
    </div>
  );
};
