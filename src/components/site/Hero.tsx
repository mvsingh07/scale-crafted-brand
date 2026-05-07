import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisionFrame } from "./HeroVisionFrame";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const stats = [
  { label: "Experience", value: "3+ yrs" },
  { label: "Scale", value: "50K+ users" },
  { label: "Craft", value: "Full-Stack · AI" },
];

export const Hero = () => (
  <section id="top" className="relative overflow-hidden">
    {/* Ambient background glow */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,hsl(var(--brand-cyan)/0.10),transparent_70%)]" />
    <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_80%_10%,hsl(var(--brand-violet)/0.07),transparent_70%)]" />

    <div className="container relative pt-28 md:pt-32 pb-5 md:pb-8">
      <div className="w-full rounded-2xl border border-white/[0.08] bg-background/50 md:rounded-3xl overflow-hidden">

        {/* Top bar — identity stripe */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 md:px-8 md:py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground">
              Engineer · Creator · Storyteller
            </span>
          </div>
        </div>

        {/* Main body */}
        <div className="grid gap-5 p-4 md:grid-cols-12 md:gap-8 md:p-8 lg:items-stretch">

          {/* Left — name + thesis + description + CTAs + stats */}
          <div className="md:col-span-8 flex flex-col justify-between gap-4">
            <div>
              <p className="font-editorial non-italic leading-[1.22] text-lg md:text-[1.65rem]">
                Manvir Singh
              </p>
              <h2 className="font-editorial italic leading-[1.22] text-lg md:text-[1.65rem]">
                <span className="text-primary">Visionary Mind: </span>
                <span className="text-secondary">Igniting Innovation through continuous learning</span>
              </h2>

              <p className="mt-2.5 max-w-lg text-xs leading-relaxed text-muted-foreground md:mt-4 md:text-[0.9rem]">
                I design the quiet infrastructure behind ambitious products: scalable distributed
                systems, real-time platforms, AI workflows, and interfaces that feel intentional
                — from first click to last deploy.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() => scrollTo("work")}
                  className="gap-1.5 h-8 text-xs md:h-9 md:text-sm"
                >
                  Explore work <ArrowRight size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollTo("contact")}
                  className="text-muted-foreground hover:text-foreground h-8 text-xs md:h-9 md:text-sm"
                >
                  Let's talk
                </Button>
              </div>

              {/* Stats row */}
              {/* <div className="mt-4 hidden md:flex flex-row gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2"
                  >
                    <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
                      {s.label}
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          {/* Right — HeroVisionFrame canvas */}
          <div className="md:col-span-4 h-[200px] md:h-[300px] lg:h-auto min-h-[200px]">
            <HeroVisionFrame />
          </div>

        </div>
      </div>
    </div>
  </section>
);
