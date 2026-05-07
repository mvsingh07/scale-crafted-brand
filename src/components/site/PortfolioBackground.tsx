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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#090a0f]">
      <PrismaticBurst
        animationType="rotate3d"
        intensity={0.82}
        speed={0.2}
        distort={0.7}
        paused={reduceMotion}
        offset={{ x: 0, y: "-8px" }}
        rayCount={26}
        mixBlendMode="lighten"
        colors={["#0a84ff", "#64d2ff", "#f5f5f7", "#bf5af2"]}
        className="opacity-45"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_12%,transparent_0%,hsl(var(--background)/0.34)_44%,hsl(var(--background)/0.94)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.2),hsl(var(--background)/0.82)_58%,hsl(var(--background)/0.98))]" />
      <div className="absolute inset-0 bg-grid opacity-25" />
    </div>
  );
};
