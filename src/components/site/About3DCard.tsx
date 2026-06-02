"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/spline-scene";
import { Spotlight } from "@/components/ui/spotlight";

export const About3DCard = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // rootMargin of 200px preloads the Spline bundle before it scrolls into
    // view, while still keeping the heavy WebGL init off the critical path.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="h-full">
      <Card className="relative h-[520px] overflow-hidden rounded-[2rem] border-border/70 bg-black/[0.96] shadow-elegant">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-24" fill="white" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="relative min-h-0 flex-1">
            {inView ? (
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="h-full w-full"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-white/5 rounded-t-[2rem]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,transparent_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.7)_100%)]" />
          </div>

          <div className="relative border-t border-white/10 bg-background/55 p-6 backdrop-blur-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary">
              Integrating 3d components into web with AI
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Creating immersive, performant interfaces where AI workflows and spatial interaction feel native to the product.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
