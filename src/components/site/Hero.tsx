import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HeroVisionFrame } from "./HeroVisionFrame";
import type { Profile } from "@/lib/supabase";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const DEFAULTS = {
  name: "Clark kent",
  identity_stripe: "Engineer · Creator · Storyteller",
  tagline: "Visionary Mind: Igniting Innovation through continuous learning",
  hero_description:
    "I design the quiet infrastructure behind ambitious products: scalable distributed systems, real-time platforms, AI workflows, and interfaces that feel intentional — from first click to last deploy.",
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const charVariants = {
  hidden: { opacity: 0, y: "110%", rotateX: -30 },
  show: (i: number) => ({
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: 0.55, ease: EASE, delay: 0.28 + i * 0.035 },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE, delay: 0.55 + i * 0.06 },
  }),
};

const descVariants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.4, ease: EASE, delay: 0.9 + i * 0.025 },
  }),
};

function AnimatedChars({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <span style={{ perspective: "600px", ...style }}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden leading-none" style={{ verticalAlign: "bottom" }}>
          <motion.span
            className="inline-block"
            variants={charVariants}
            custom={i}
            initial="hidden"
            animate="show"
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function AnimatedWords({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={wordVariants}
          custom={i}
          initial="hidden"
          animate="show"
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

function AnimatedDesc({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <p className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={descVariants}
          custom={i}
          initial="hidden"
          animate="show"
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

interface HeroProps {
  profile?: Pick<
    Profile,
    | "name"
    | "identity_stripe"
    | "tagline"
    | "hero_description"
    | "hero_title"
    | "hero_subtitle"
    | "font_config"
  >;
}

export const Hero = ({ profile }: HeroProps = {}) => {
  const title       = profile?.hero_title       || profile?.name     || DEFAULTS.name;
  const subtitle    = profile?.hero_subtitle     || profile?.tagline  || DEFAULTS.tagline;
  const stripe      = profile?.identity_stripe   || DEFAULTS.identity_stripe;
  const description = profile?.hero_description  || DEFAULTS.hero_description;

  const fc = profile?.font_config;

  // title → fc.title, fallback fc.heading
  const titleStyle: React.CSSProperties = {
    fontFamily: fc?.title?.family  ?? fc?.heading?.family  ?? undefined,
    color:      fc?.title?.color   ?? fc?.heading?.color   ?? undefined,
    fontSize:   fc?.title?.size    ? `${fc.title.size}px`  : undefined,
  };

  // subtitle → fc.subtitle, fallback fc.subheading
  const subtitleStyle: React.CSSProperties = {
    fontFamily: fc?.subtitle?.family ?? fc?.subheading?.family ?? undefined,
    color:      fc?.subtitle?.color  ?? fc?.subheading?.color  ?? undefined,
    fontSize:   (fc?.subtitle?.size ?? fc?.subheading?.size)
      ? `${fc?.subtitle?.size ?? fc?.subheading?.size}px`
      : undefined,
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: fc?.body?.family ?? undefined,
    color:      fc?.body?.color  ?? undefined,
  };

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,hsl(var(--brand-cyan)/0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_50%_50%_at_80%_10%,hsl(var(--brand-violet)/0.07),transparent_70%)]" />

      <div className="container relative pt-32 md:pt-40 pb-8 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full rounded-2xl border border-white/[0.08] bg-background/50 md:rounded-3xl overflow-hidden"
        >
          {/* identity stripe */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center border-b border-white/[0.06] px-5 py-3 md:px-10 md:py-4"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0 mr-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground"
              style={{ fontFamily: fc?.subheading?.family ?? undefined }}
            >
              {stripe}
            </span>
          </motion.div>

          <div className="grid gap-6 p-5 md:grid-cols-12 md:gap-10 md:p-10 lg:p-12 lg:items-stretch">

            <div className="md:col-span-7 flex flex-col justify-between gap-6">
              <div>
                {/* Title */}
                <p data-font="hero-title" className="font-editorial non-italic leading-[1.15] text-[1.75rem] md:text-[2.75rem] lg:text-[3.25rem]" style={titleStyle}>
                  <AnimatedChars text={title} />
                </p>

                {/* Subtitle */}
                <h2 data-font="hero-subtitle" className="font-editorial italic leading-[1.2] text-primary mt-1 text-[1.75rem] md:text-[2.75rem] lg:text-[3.25rem]" style={subtitleStyle}>
                  <AnimatedWords text={subtitle} />
                </h2>

                {/* Description */}
                <AnimatedDesc
                  text={description}
                  className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:mt-6 md:text-[0.95rem]"
                  style={bodyStyle}
                />
              </div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                transition={{ delay: 1.2 }}
                className="flex flex-wrap items-center gap-2"
              >
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => scrollTo("work")}
                    className="gap-1.5 h-9 text-xs md:h-10 md:text-sm"
                  >
                    Explore work <ArrowRight size={12} />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={SPRING}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollTo("contact")}
                    className="text-muted-foreground hover:text-foreground h-9 text-xs md:h-10 md:text-sm"
                  >
                    Let's talk
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="md:col-span-5 h-[240px] md:h-[380px] lg:h-auto min-h-[240px]"
            >
              <HeroVisionFrame />
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};
