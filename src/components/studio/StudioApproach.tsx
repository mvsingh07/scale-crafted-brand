"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Eye, Compass, PenTool, Hammer, FolderKanban, Zap, Rocket } from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, ChromeOrb, WHITE, SILVER, MUTED, FONT_H, FONT_ED, FONT_B, EASE } from "./shared";

const ACCENTS = ["#C9A55A", "#60A5FA", "#A78BFA", "#34D399", "#22C55E", "#F59E0B", "#F472B6"];

const STEPS = [
  { step: "Understand", icon: Eye,         body: "Understand the business, its customers, its goals, and the problems it actually faces today." },
  { step: "Discover",   icon: Compass,     body: "Identify what's actually needed — sometimes a website, sometimes a CMS, CRM, automation, e-commerce, custom software, AI, or a combination." },
  { step: "Design",     icon: PenTool,     body: "Build a digital experience that communicates the business story, not a template with a new logo." },
  { step: "Build",      icon: Hammer,      body: "Develop the system using modern, scalable technology — engineered to be maintained, not just shipped." },
  { step: "Organize",   icon: FolderKanban, body: "Structure the business's own information — customers, records, transactions — so it's usable, not just stored." },
  { step: "Automate",   icon: Zap,         body: "Remove unnecessary repetitive work wherever it makes sense to." },
  { step: "Launch & Improve", icon: Rocket, body: "Deploy, measure, and keep improving. Every project is a partnership, not a hand-off." },
];

// One checkpoint on the route. The node's ring, glow and index numeral are
// all driven off the same 0→1 slice of the road's overall scroll progress —
// dormant (muted, unlit) until the traveled line reaches it, then lit in its
// own accent color — rather than a single global on/off state.
function RoadmapStep({ s, index, total, accent, progress }: {
  s: (typeof STEPS)[number]; index: number; total: number; accent: string;
  progress: MotionValue<number>;
}) {
  const t = index / (total - 1);
  const lit = useTransform(progress, [Math.max(0, t - 0.1), t + 0.015], [0, 1]);
  const ringColor = useTransform(lit, [0, 1], ["color-mix(in srgb, var(--text-primary) 16%, transparent)", accent]);
  const nodeScale = useTransform(lit, [0, 1], [0.86, 1]);
  const glowOpacity = useTransform(lit, [0, 1], [0, 0.55]);
  const numColor = useTransform(lit, [0, 1], [MUTED, accent]);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ position: "relative", width: 56, flexShrink: 0, display: "flex", justifyContent: "center" }}>
        {/* Soft halo behind the node, only visible once the route reaches it */}
        <motion.div aria-hidden style={{
          position: "absolute", top: -10, left: -10, right: -10, bottom: -10, borderRadius: "50%",
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, filter: "blur(10px)",
          opacity: glowOpacity, pointerEvents: "none",
        }} />
        <motion.div style={{
          position: "relative", width: 56, height: 56, borderRadius: "50%", zIndex: 1,
          display: "grid", placeItems: "center", scale: nodeScale,
          border: "2px solid", borderColor: ringColor,
          background: "var(--bg-primary)",
        }}>
          <ChromeOrb accent={accent} size={38}>
            <s.icon size={17} />
          </ChromeOrb>
        </motion.div>
      </div>

      <Reveal style={{ flex: 1, paddingBottom: index === total - 1 ? 0 : 44, minWidth: 0 }}>
        <motion.span aria-hidden style={{
          display: "block", fontFamily: FONT_ED, fontStyle: "italic", fontSize: 13, marginBottom: 6, color: numColor,
        }}>
          Checkpoint {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </motion.span>
        <h3 style={{ fontFamily: FONT_H, fontSize: 20, fontWeight: 600, color: WHITE, margin: "0 0 8px" }}>{s.step}</h3>
        <p style={{ fontFamily: FONT_B, fontSize: 14, lineHeight: 1.7, color: SILVER, margin: 0, maxWidth: 560 }}>{s.body}</p>
      </Reveal>
    </div>
  );
}

export function StudioApproach() {
  const roadRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: roadRef, offset: ["start 0.7", "end 0.5"] });
  const markerTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const markerOpacity = useTransform(scrollYProgress, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);

  return (
    <div id="studio-approach" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", scrollMarginTop: 76, position: "relative" }}>
      <Reveal style={{ marginBottom: 52, maxWidth: 680 }}>
        <ChapterEyebrow n="08">How We Work</ChapterEyebrow>
        <SectionHeading>We don&apos;t start with technology. We start with the problem.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 16px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0", maxWidth: 620 }}>
          Not &ldquo;tell us what website you want and we&apos;ll make it.&rdquo; The right answer isn&apos;t always a website.
          Seven checkpoints, one route — scroll to walk it.
        </p>
      </Reveal>

      <div ref={roadRef} style={{ position: "relative", paddingTop: 6 }}>
        {/* The route itself — a dormant hairline the full height of the
            checkpoint stack, with a gold line drawing over it in step as the
            section scrolls, plus a small marker riding at its leading edge. */}
        <div aria-hidden style={{
          position: "absolute", top: 28, bottom: 28, left: 27, width: 2,
          background: "color-mix(in srgb, var(--text-primary) 10%, transparent)",
        }}>
          <motion.div style={{
            position: "absolute", inset: 0, transformOrigin: "top", scaleY: scrollYProgress,
            background: "linear-gradient(to bottom, #C9A55A, #F59E0B)",
          }} />
        </div>
        <motion.div aria-hidden style={{
          position: "absolute", left: 27, top: 28, width: 10, height: 10, borderRadius: "50%",
          x: -4, y: markerTop, opacity: markerOpacity,
          background: "#F59E0B", boxShadow: "0 0 0 4px color-mix(in srgb, #F59E0B 25%, transparent), 0 0 16px 4px color-mix(in srgb, #F59E0B 55%, transparent)",
        }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {STEPS.map((s, i) => (
            <RoadmapStep key={s.step} s={s} index={i} total={STEPS.length} accent={ACCENTS[i % ACCENTS.length]} progress={scrollYProgress} />
          ))}
        </div>
      </div>

      <Reveal delay={0.1} style={{
        marginTop: 40, padding: "26px clamp(20px, 4vw, 28px)", maxWidth: 640, marginLeft: "auto", marginRight: "auto",
        textAlign: "center", border: "1px solid color-mix(in srgb, var(--gold-border) 20%, transparent)",
        borderRadius: 16, background: "color-mix(in srgb, var(--gold-primary) 3%, var(--bg-primary))",
      }}>
        <p style={{ fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(16px, 2vw, 20px)", color: WHITE, margin: 0, lineHeight: 1.5 }}>
          Technology should give time back to people.
        </p>
        <p style={{ fontFamily: FONT_B, fontSize: 13.5, color: SILVER, margin: "10px 0 0", lineHeight: 1.7 }}>
          Less time on repetitive work means more time for thinking, creating, and the people
          and things that actually need a human being.
        </p>
      </Reveal>
    </div>
  );
}
