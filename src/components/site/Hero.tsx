import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HeroVisionFrame } from "./HeroVisionFrame";
import type { Profile } from "@/lib/supabase";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const DEFAULTS = {
  name: "Manvir Singh",
  identity_stripe: "Engineer · Creator · Storyteller",
  tagline: "Visionary Mind: Igniting Innovation through continuous learning",
  hero_description:
    "I design the quiet infrastructure behind ambitious products: scalable distributed systems, real-time platforms, AI workflows, and interfaces that feel intentional — from first click to last deploy.",
};

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

interface HeroProps {
  profile?: Pick<Profile, "name" | "identity_stripe" | "tagline" | "hero_description">;
}

export const Hero = ({ profile }: HeroProps = {}) => {
  const name = profile?.name || DEFAULTS.name;
  const stripe = profile?.identity_stripe || DEFAULTS.identity_stripe;
  const tagline = profile?.tagline || DEFAULTS.tagline;
  const description = profile?.hero_description || DEFAULTS.hero_description;

  const [primary, secondary] = tagline.includes(":")
    ? [tagline.split(":")[0] + ":", tagline.split(":").slice(1).join(":").trim()]
    : [tagline, ""];

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,hsl(var(--brand-cyan)/0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_80%_10%,hsl(var(--brand-violet)/0.07),transparent_70%)]" />

      <div className="container relative pt-28 md:pt-32 pb-5 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-2xl border border-white/[0.08] bg-background/50 md:rounded-3xl overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 md:px-8 md:py-4"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground">
                {stripe}
              </span>
            </div>
          </motion.div>

          <div className="grid gap-5 p-4 md:grid-cols-12 md:gap-8 md:p-8 lg:items-stretch">

            <motion.div
              className="md:col-span-8 flex flex-col justify-between gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <div>
                <motion.p variants={itemVariants} className="font-editorial non-italic leading-[1.22] text-lg md:text-[1.65rem]">
                  {name}
                </motion.p>
                <motion.h2 variants={itemVariants} className="font-editorial italic leading-[1.22] text-lg md:text-[1.65rem]">
                  {secondary ? (
                    <>
                      <span className="text-primary">{primary} </span>
                      <span className="text-secondary">{secondary}</span>
                    </>
                  ) : (
                    <span className="text-primary">{tagline}</span>
                  )}
                </motion.h2>
                <motion.p variants={itemVariants} className="mt-2.5 max-w-lg text-xs leading-relaxed text-muted-foreground md:mt-4 md:text-[0.9rem]">
                  {description}
                </motion.p>
              </div>

              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => scrollTo("work")}
                    className="gap-1.5 h-8 text-xs md:h-9 md:text-sm"
                  >
                    Explore work <ArrowRight size={12} />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollTo("contact")}
                    className="text-muted-foreground hover:text-foreground h-8 text-xs md:h-9 md:text-sm"
                  >
                    Let's talk
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-4 h-[200px] md:h-[300px] lg:h-auto min-h-[200px]"
            >
              <HeroVisionFrame />
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
