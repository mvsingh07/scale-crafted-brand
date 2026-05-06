import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import working from "@/assets/engineer-working.jpg";
import keyboard from "@/assets/engineer-keyboard.jpg";
import architecture from "@/assets/engineer-architecture.jpg";

const useScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section enters bottom of viewport, 1 when it leaves the top
      const raw = 1 - (rect.top + rect.height * 0.3) / (vh + rect.height * 0.3);
      setP(Math.max(0, Math.min(1, raw)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, p };
};

export const Atelier = () => {
  const { ref, p } = useScrollProgress();

  // Parallax offsets driven by scroll
  const t1 = (p - 0.5) * 120; // big card
  const t2 = (p - 0.5) * -180; // floating right
  const t3 = (p - 0.5) * 90;   // floating left
  const rot = (p - 0.5) * 6;

  return (
    <section
      id="atelier"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="glow-orb top-10 left-1/3 h-[420px] w-[420px] bg-[hsl(var(--brand-cyan)/0.25)]" />
      <div className="glow-orb bottom-0 right-10 h-[360px] w-[360px] bg-[hsl(var(--brand-violet)/0.30)]" />

      <div className="container relative">
        <SectionHeader
          eyebrow="04 — In the Atelier"
          title="Where the systems get built."
          description="Late nights, deep focus, whiteboards full of arrows. The craft behind the code."
        />

        <div className="relative mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Hero image — large left */}
          <div
            className="lg:col-span-8 relative overflow-hidden rounded-2xl border border-border/60 card-premium p-0 group"
            style={{
              transform: `translate3d(0, ${t1}px, 0) rotate(${rot * 0.3}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={working}
                alt="Senior software engineer working across multiple monitors building distributed systems"
                loading="lazy"
                width={1600}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ transform: `scale(${1.05 + p * 0.08})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  Deep work · 02:14 AM
                </div>
                <div className="font-display mt-2 text-2xl font-semibold md:text-3xl">
                  Tuning a Kafka pipeline at <span className="text-brand">200K events/sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — two stacked floating images */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div
              className="relative overflow-hidden rounded-2xl border border-border/60 card-premium"
              style={{
                transform: `translate3d(0, ${t2}px, 0) rotate(${-rot * 0.4}deg)`,
                transition: "transform 0.1s linear",
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={architecture}
                  alt="Engineer sketching distributed systems architecture on a whiteboard"
                  loading="lazy"
                  width={1280}
                  height={1280}
                  className="h-full w-full object-cover"
                  style={{ transform: `scale(${1.05 + p * 0.1}) translateY(${(p - 0.5) * 20}px)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Architecture</div>
                  <div className="mt-1 font-display text-lg font-semibold">Designing for failure first.</div>
                </div>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl border border-border/60 card-premium"
              style={{
                transform: `translate3d(0, ${t3}px, 0) rotate(${rot * 0.5}deg)`,
                transition: "transform 0.1s linear",
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={keyboard}
                  alt="Close up of hands typing on a backlit mechanical keyboard"
                  loading="lazy"
                  width={1280}
                  height={1280}
                  className="h-full w-full object-cover"
                  style={{ transform: `scale(${1.05 + p * 0.12}) translateY(${(p - 0.5) * -20}px)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Craft</div>
                  <div className="mt-1 font-display text-lg font-semibold">Code that reads like prose.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee-style stat strip that drifts on scroll */}
        <div
          className="mt-12 overflow-hidden rounded-2xl border border-border/60 glass px-6 py-4"
          style={{ transform: `translate3d(${(p - 0.5) * 60}px, 0, 0)`, transition: "transform 0.1s linear" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
            <span>· building scalable backends</span>
            <span>· real-time pipelines</span>
            <span>· AI-powered products</span>
            <span>· engineering leadership</span>
            <span className="text-primary">· available now</span>
          </div>
        </div>
      </div>
    </section>
  );
};
