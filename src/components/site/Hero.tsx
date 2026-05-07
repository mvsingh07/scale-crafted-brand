import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisionFrame } from "./HeroVisionFrame";

export const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-x-0 top-24 mx-auto h-64 max-w-4xl rounded-full bg-primary/15 blur-[110px]" />

      <div className="container relative">
           <HeroVisionFrame />
 
      </div>
    </section>
  );
};
