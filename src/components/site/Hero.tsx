import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisionFrame } from "./HeroVisionFrame";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-x-0 top-24 mx-auto h-64 max-w-4xl rounded-full bg-primary/15 blur-[110px]" />

      <div className="container relative">
        <div className="grid min-h-[700px] items-center gap-12 py-10 md:grid-cols-[0.86fr_1.14fr] md:gap-10 lg:min-h-[760px]">
          <div className="relative z-10 max-w-xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/35 px-3.5 py-1.5 text-[11px] font-medium text-muted-foreground shadow-card backdrop-blur-2xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Senior Software Engineer for teams building at scale
            </div>

            <h1 className="font-display mt-7 max-w-[560px] text-balance text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Manvir Singh</span>
              <span className="block text-gradient">builds software</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                with product-grade polish.
              </span>
            </h1>

            <p className="mt-6 max-w-[500px] text-sm leading-7 text-muted-foreground md:text-base">
              I design the quiet infrastructure behind ambitious products: scalable distributed systems,
              real-time platforms, AI workflows, and interfaces that feel intentional from first click to last deploy.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="brand" size="lg">
                <a href="#work" className="group">
                  See selected work
                  <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={16} />
                </a>
              </Button>
              <Button asChild variant="ghostBrand" size="lg">
                <a href="#contact">
                  <Sparkles size={15} />
                  Start a conversation
                </a>
              </Button>
            </div>

            <div className="mt-10 flex max-w-lg flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span>Distributed systems</span>
              <span className="h-1 w-1 self-center rounded-full bg-muted-foreground/50" />
              <span>AI products</span>
              <span className="h-1 w-1 self-center rounded-full bg-muted-foreground/50" />
              <span>Real-time infrastructure</span>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.12s" }}>
            <HeroVisionFrame />
          </div>
        </div>
      </div>
    </section>
  );
};
