import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="glow-orb -top-32 left-1/4 h-[420px] w-[420px] bg-[hsl(var(--brand-violet)/0.45)] animate-pulse-slow" />
      <div className="glow-orb top-20 right-10 h-[360px] w-[360px] bg-[hsl(var(--brand-cyan)/0.35)] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 text-xs font-mono text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for senior engineering roles & consulting
          </div>

          <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-gradient">Manvir Singh.</span>
            <br />
            <span className="text-brand">Engineering systems</span>
            <br />
            <span className="text-gradient">that scale.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Senior Software Engineer crafting <span className="text-foreground">scalable, high-performance distributed systems</span>, real-time platforms and AI-powered products that move the needle for millions of users.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild variant="brand" size="xl">
              <a href="#work" className="group">
                View Projects
                <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={18} />
              </a>
            </Button>
            <Button asChild variant="ghostBrand" size="xl">
              <a href="#contact">
                <Sparkles size={16} />
                Work With Me
              </a>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {[
              { k: "50K+", v: "Concurrent Users" },
              { k: "1GB+", v: "Files Processed" },
              { k: "99.99%", v: "Uptime SLA" },
              { k: "5+ yrs", v: "Building at Scale" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-2xl p-4 text-left">
                <div className="font-display text-2xl font-semibold text-brand">{s.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
