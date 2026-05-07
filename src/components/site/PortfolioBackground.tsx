import { useEffect, useState } from "react";
import { PrismaticBurst } from "./PrismaticBurst";

export const PortfolioBackground = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05060d]">
      <PrismaticBurst
        animationType="rotate3d"
        intensity={1.25}
        speed={0.28}
        distort={1.1}
        paused={reduceMotion}
        offset={{ x: 0, y: "-8px" }}
        rayCount={34}
        mixBlendMode="lighten"
        colors={["#ff007a", "#4d3dff", "#ffffff", "#00d2ff"]}
        className="opacity-75"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.28)_42%,hsl(var(--background)/0.9)_100%)]" />
      <div className="absolute inset-0 bg-background/45" />
      <div className="absolute inset-0 bg-grid opacity-45" />
    </div>
  );
};
