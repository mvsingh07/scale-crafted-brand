"use client";

import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/supabase";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DEFAULTS = {
  name:             "Manvir Singh",
  identity_stripe:  "Engineer · Builder · Creator",
  tagline:          "Igniting Innovation through continuous learning",
  hero_description: "I design the quiet infrastructure behind ambitious products — scalable distributed systems, real-time platforms, AI workflows, and interfaces that feel intentional from first click to last deploy.",
};

const STATS = [
  { value: "3+",   label: "Years" },
  { value: "50K+", label: "Users" },
  { value: "10+",  label: "Products" },
  { value: "AI",   label: "Native" },
];

// Per-character clip-from-below reveal — most dramatic for a large name
//
// Gradient is applied directly to each motion.span (not the parent) so it stays
// in the same compositing layer as the text. CSS background-clip:text cannot
// cross compositing-layer boundaries created by CSS transforms on mobile/Safari,
// which would make the text invisible. backgroundSize+backgroundPosition simulate
// a gradient that spans the full name.
function SplitChars({ text, gradient }: { text: string; gradient?: boolean }) {
  const chars = text.split("");
  const nonSpaceCount = chars.filter(c => c !== " ").length;
  let charIdx = 0;

  return (
    <span aria-label={text}>
      {chars.map((char, i) => {
        if (char === " ") {
          return <span key={i} style={{ display: "inline-block", width: "0.3em" }} aria-hidden />;
        }
        const ci = charIdx++;
        const gradStyle: React.CSSProperties = gradient ? {
          background: "linear-gradient(90deg, var(--gold-primary) 0%, var(--gold-highlight) 55%, var(--silver) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          backgroundSize: `${nonSpaceCount * 0.72}em 100%`,
          backgroundPosition: `-${ci * 0.72}em 0`,
        } : {};
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
            <motion.span
              key={i}
              aria-hidden
              style={{ display: "inline-block", ...gradStyle }}
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.58, ease: EASE, delay: 0.06 + i * 0.032 }}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

// Word-by-word blur-fade for tagline/description
function WordFade({ text, delay = 0, style }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <span style={style}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(7px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: delay + i * 0.055 }}
          style={{ display: "inline-block", marginRight: "0.26em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

const fadeIn = (delay: number) => ({
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay } },
});

interface HeroProps {
  profile?: Pick<Profile, "name" | "identity_stripe" | "tagline" | "hero_description" | "hero_title" | "hero_subtitle" | "font_config">;
}

export const Hero = ({ profile }: HeroProps = {}) => {
  const name        = profile?.hero_title    || profile?.name     || DEFAULTS.name;
  const stripe      = profile?.identity_stripe                    || DEFAULTS.identity_stripe;
  const tagline     = profile?.hero_subtitle || profile?.tagline  || DEFAULTS.tagline;
  const description = profile?.hero_description                   || DEFAULTS.hero_description;

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 72,
      }}
    >
      {/* Ambient glows */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 55% at 60% 40%, color-mix(in srgb, var(--gold-primary) var(--hero-glow-opacity), transparent) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 40% 40% at 15% 70%, color-mix(in srgb, var(--gold-border) var(--hero-glow-opacity-2), transparent) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div className="container relative" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ maxWidth: 860 }}>

          {/* Eyebrow — fade up */}
          <motion.div
            variants={fadeIn(0.05)}
            initial="hidden"
            animate="show"
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
                <span style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "var(--gold-primary)", opacity: 0.6,
                  animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, borderRadius: "50%", background: "var(--gold-primary)" }} />
              </span>
              <span style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--gold-primary)",
              }}>
                {stripe}
              </span>
            </span>
          </motion.div>

          {/* Name — per-character clip-up */}
          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(44px, 7.5vw, 100px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            margin: "0 0 20px",
          }}>
            <SplitChars text={name} gradient />
          </h1>

          {/* Tagline — word-by-word blur-fade */}
          <h2 style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(18px, 2.4vw, 28px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "hsl(var(--foreground))",
            lineHeight: 1.4,
            margin: "0 0 24px",
            maxWidth: 680,
          }}>
            <WordFade text={tagline} delay={0.5} />
          </h2>

          {/* Gold divider — scale-in after tagline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
            style={{
              height: 1, width: 64,
              background: "linear-gradient(to right, var(--gold-primary), var(--gold-highlight))",
              transformOrigin: "left", marginBottom: 24,
            }}
          />

          {/* Description — word blur-fade, slightly later */}
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            lineHeight: 1.8, color: "hsl(var(--muted-foreground))",
            maxWidth: 600, margin: "0 0 40px",
          }}>
            <WordFade text={description} delay={0.95} />
          </p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeIn(1.15)}
            initial="hidden"
            animate="show"
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 56 }}
          >
            <Button variant="brand" size="lg" onClick={() => scrollTo("work")} className="gap-2">
              Explore Work <ArrowRight size={14} />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => scrollTo("contact")}
              className="text-muted-foreground hover:text-foreground gap-2">
              <Mail size={14} /> Let&apos;s talk
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeIn(1.3)}
            initial="hidden"
            animate="show"
            className="hero-stats"
            style={{ display: "flex", flexWrap: "wrap", gap: "0 32px" }}
          >
            {STATS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <span className="hero-stat-sep" style={{
                    display: "inline-block", width: 4, height: 4, borderRadius: "50%",
                    background: "var(--gold-border)", marginRight: 32,
                  }} />
                )}
                <div>
                  <p style={{
                    fontFamily: "var(--font-cinzel), Cinzel, serif",
                    fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700,
                    background: "linear-gradient(135deg, var(--gold-primary), var(--gold-highlight))",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    lineHeight: 1, margin: 0,
                  }}>{s.value}</p>
                  <p style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "hsl(var(--muted-foreground))", marginTop: 3,
                  }}>{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @media (max-width: 640px) {
          .hero-stats {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 20px 0 !important;
          }
          .hero-stat-sep {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
