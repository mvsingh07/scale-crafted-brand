"use client";

import { motion } from "motion/react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";
import { useIdentity } from "@/context/identity";
import type { AboutParagraph, AboutStat } from "@/lib/supabase";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const SILVER = "var(--silver)";
const WHITE = "var(--text-primary)";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Brand About defaults — separate from portfolio's technical About section.
// These are shown until the user sets content via the Identity Editor.
const DEFAULT_EYEBROW = "01 — The Person";
const DEFAULT_HEADLINE = "Builder, engineer,\nand craftsman.";

const DEFAULT_PARAGRAPHS: AboutParagraph[] = [
  { text: "I'm <b>MV Singh</b> — a software engineer who builds products, not just systems. I care about the craft as much as the output: writing code that lasts, designing for real users, and thinking across the full stack from infrastructure to experience.", italic: false },
  { text: "Outside the terminal, I'm driven by curiosity. I read widely, think in systems, and believe the best engineers are also good writers, good communicators, and people who ask why before how.", italic: false },
  { text: "I'm based in <b>Punjab, India</b>. Currently building in the AI/infrastructure space, always open to interesting conversations with people who care about the work.", italic: false },
  { text: "If you're building something that matters — reach out.", italic: true },
];

const DEFAULT_STATS: AboutStat[] = [
  { value: "3+",    label: "Years Building" },
  { value: "Punjab", label: "India" },
  { value: "AI",    label: "Current Focus" },
  { value: "∞",     label: "Curiosity" },
];

export default function AboutPage() {
  const { identity } = useIdentity();

  // Treat both null and undefined as "not set" — DB columns may not exist yet
  const eyebrow    = identity?.about_eyebrow  || DEFAULT_EYEBROW;
  const headline   = identity?.about_headline  || DEFAULT_HEADLINE;
  const paragraphs: AboutParagraph[] =
    identity?.about_paragraphs?.length ? identity.about_paragraphs : DEFAULT_PARAGRAPHS;
  const stats: AboutStat[] =
    identity?.about_stats?.length ? identity.about_stats : DEFAULT_STATS;

  const headlineLines = headline.split("\n");

  return (
    <HubPageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: GOLD, marginBottom: 16,
          }}>
            {eyebrow}
          </p>
          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0,
          }}>
            {headlineLines.map((line, i) => (
              <span key={i}>{line}{i < headlineLines.length - 1 && <br />}</span>
            ))}
          </h1>
          <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }} className="lg:grid-cols-[1fr_280px] lg:gap-16">

          {/* Paragraphs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            style={{ display: "flex", flexDirection: "column", gap: 28 }}
          >
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "clamp(15px, 1.7vw, 18px)",
                  lineHeight: 1.85,
                  color: p.italic ? "var(--text-muted)" : SILVER,
                  fontStyle: p.italic ? "italic" : "normal",
                  margin: 0,
                }}
                dangerouslySetInnerHTML={{
                  __html: p.text.replace(/<b>(.*?)<\/b>/g, `<span style="color:${WHITE};font-weight:500">$1</span>`),
                }}
              />
            ))}
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{ marginTop: 48 }}
            className="lg:mt-0"
          >
            <div style={{
              border: `1px solid color-mix(in srgb, var(--gold-border) 45%, transparent)`,
              borderRadius: 16,
              padding: "32px 24px",
              background: "color-mix(in srgb, var(--gold-primary) 6%, var(--bg-primary))",
              boxShadow: "0 2px 24px color-mix(in srgb, var(--gold-border) 12%, transparent)",
              display: "flex", flexDirection: "column", gap: 28,
            }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <p style={{
                    fontFamily: "var(--font-cinzel), Cinzel, serif",
                    fontSize: "clamp(28px, 3.5vw, 40px)",
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    margin: 0, lineHeight: 1.1,
                  }}>{s.value}</p>
                  <p style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 12, letterSpacing: "0.1em",
                    color: "var(--text-muted)", marginTop: 4,
                  }}>{s.label}</p>
                  {i < stats.length - 1 && (
                    <div style={{ marginTop: 28, height: 1, background: `color-mix(in srgb, var(--gold-border) 25%, transparent)` }} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </HubPageLayout>
  );
}
