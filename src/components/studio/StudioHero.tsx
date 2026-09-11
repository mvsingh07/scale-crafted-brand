"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { FONT_H, FONT_B, EASE } from "./shared";
import heroImage from "@/assets/studio-bg2.png";

// Hero always renders on its dark cinematic palette, independent of the
// site-wide light/dark toggle — the photo and gold typography need a dark
// stage, same as the personal hub's own hero (see src/app/page.tsx).
const HERO_BG      = "#0A0A0A";
const HERO_GOLD    = "#C9A55A";
const HERO_GOLD_L  = "#E0C27A";
const HERO_WHITE   = "#F8FAFC";
const HERO_MUTED   = "#D1D5DB";
const HERO_SILVER  = "#C7CDD6";

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
}

const EYEBROW_WORDS = ["Ideas", "Systems", "Impact"];
const STATS = [
  { value: "50+", label: "Projects" },
  { value: "100%", label: "Client Focus" },
  { value: "End-to-End", label: "From Idea to Impact" },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

export function StudioHero() {
  const reduce = useReducedMotion();
  // `useReducedMotion()` is always false during SSR (no `window`) but reads
  // the real value synchronously on the client's very first render — using
  // it directly to switch an `animate` prop (or a style value) on or off
  // makes that first client render diverge from what the server sent,
  // which is a genuine hydration mismatch for any visitor with OS-level
  // reduced motion on, not just a test artifact. Match SSR on mount, then
  // react to the real value only after hydration is already done.
  const [reduceSafe, setReduceSafe] = useState(false);
  useEffect(() => setReduceSafe(!!reduce), [reduce]);
  const frameRef = useRef<HTMLDivElement>(null);

  // Same scroll-linked "immersion" cue the old background video used: as
  // the frame scrolls past, the photo drifts and the scrim deepens toward
  // the next chapter. The image sits inside taller-than-frame bounds so the
  // drift never exposes a bare edge.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 1], [0.62, 0.92]);

  return (
    <section id="top">
      <div ref={frameRef} style={{ position: "relative", width: "100%", minHeight: "clamp(680px, 96svh, 1120px)", overflow: "hidden" }}>
        {/* Full-bleed background photo — replaces the old looping video with
            one still frame, given the same slow "living photograph" Ken
            Burns zoom plus scroll parallax so the section doesn't sit
            completely static. Both skipped under reduced motion. Framed a
            touch left-of-center: that side of the shot is the dim room
            interior, which keeps the text column sitting on naturally dark
            ground rather than the sunset's bright half. */}
        <motion.div
          aria-hidden
          animate={reduceSafe ? undefined : { scale: [1, 1.045, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-8%", left: 0, right: 0, height: "116%", width: "100%",
            y: reduceSafe ? undefined : imageY,
          }}
        >
          <Image
            src={heroImage}
            alt="MV Singh Tech Studio workspace — ideas becoming real solutions"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "32% 45%" }}
          />
        </motion.div>

        {/* Base tint scrim — fixed dark, same as HERO_BG, so the frame stays
            on its own cinematic palette regardless of the site-wide
            light/dark toggle. */}
        <motion.div aria-hidden style={{
          position: "absolute", inset: 0,
          background: HERO_BG,
          opacity: reduceSafe ? 0.6 : scrimOpacity,
        }} />
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 70% at 28% 48%, rgba(0,0,0,0.5) 0%, transparent 72%)",
        }} />
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, transparent 62%, rgba(10,10,10,0.92) 100%)`,
        }} />

        {/* Copy — headline, subtext, CTAs and the stat row, overlaid
            directly on the frame and staggering in on load. */}
        <div style={{
          position: "relative", zIndex: 1, height: "100%", display: "flex", alignItems: "center",
          maxWidth: 1600, margin: "0 auto", padding: "clamp(140px, 20vw, 220px) clamp(18px, 4vw, 32px) clamp(48px, 8vw, 80px) clamp(18px, 3vw, 32px)",
        }}>
          <motion.div
            variants={container}
            initial={reduceSafe ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            style={{ maxWidth: 620 }}
          >
            <motion.div variants={fadeUp} style={{ display: "flex", gap: "clamp(16px, 3vw, 28px)", flexWrap: "wrap", marginBottom: 24 }}>
              {EYEBROW_WORDS.map((w) => (
                <span key={w} style={{ fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: HERO_GOLD }}>
                  {w}
                </span>
              ))}
            </motion.div>

            <h1 style={{ margin: 0 }}>
              <motion.span
                variants={fadeUp}
                style={{ display: "block", fontFamily: FONT_H, fontWeight: 600, fontSize: "clamp(38px, 5.6vw, 68px)", lineHeight: 1.08, color: HERO_WHITE }}
              >
                Building
              </motion.span>
              <motion.span variants={fadeUp} style={{ display: "block" }}>
                {/* The one accent line — a slow gold sheen sweeps across it
                    on loop, the hero's single "alive" gesture rather than
                    motion everywhere at once. Falls back to a static gold
                    fill under reduced motion. */}
                <motion.span
                  animate={reduceSafe ? undefined : { backgroundPositionX: ["140%", "-140%"] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "linear", delay: 1.2 }}
                  style={{
                    display: "inline-block",
                    fontFamily: FONT_H, fontWeight: 600, fontSize: "clamp(38px, 5.6vw, 68px)", lineHeight: 1.08,
                    backgroundImage: `linear-gradient(100deg, ${HERO_GOLD} 40%, ${HERO_GOLD_L} 50%, ${HERO_GOLD} 60%)`,
                    backgroundSize: "260% 100%",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    filter: `drop-shadow(0 0 24px rgba(201,165,90,0.3))`,
                  }}
                >
                  Digital Systems
                </motion.span>
              </motion.span>
              <motion.span
                variants={fadeUp}
                style={{ display: "block", fontFamily: FONT_H, fontWeight: 600, fontSize: "clamp(38px, 5.6vw, 68px)", lineHeight: 1.08, color: HERO_WHITE }}
              >
                for the AI Era.
              </motion.span>
            </h1>

            <motion.p
              variants={fadeUp}
              style={{ fontFamily: FONT_B, fontSize: "clamp(15px, 1.6vw, 18px)", color: HERO_SILVER, lineHeight: 1.7, margin: "24px 0 0", maxWidth: 460 }}
            >
              Modern web presence, custom software and automation for businesses and professionals.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
              <a href="#studio-contact" onClick={(e) => scrollTo(e, "#studio-contact")} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${HERO_GOLD}, ${HERO_GOLD_L})`, borderRadius: 10,
                padding: "13px 26px", fontFamily: FONT_B, fontSize: 14, fontWeight: 600,
                color: HERO_BG, textDecoration: "none",
              }}>
                Start a Project <ArrowRight size={15} />
              </a>
              <a href="#studio-work" onClick={(e) => scrollTo(e, "#studio-work")} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(248,250,252,0.05)",
                border: "1px solid rgba(248,250,252,0.14)",
                borderRadius: 10, padding: "13px 26px", fontFamily: FONT_B, fontSize: 14,
                color: HERO_WHITE, textDecoration: "none",
              }}>
                Explore Work
              </a>
            </motion.div>

            <motion.div variants={fadeUp} style={{ display: "flex", gap: "clamp(24px, 4vw, 40px)", flexWrap: "wrap", marginTop: 44 }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  paddingLeft: i > 0 ? "clamp(24px, 4vw, 40px)" : 0,
                  borderLeft: i > 0 ? "1px solid rgba(248,250,252,0.14)" : "none",
                }}>
                  <p style={{ margin: 0, fontFamily: FONT_H, fontWeight: 700, fontSize: "clamp(20px, 2.4vw, 26px)", color: HERO_GOLD }}>{s.value}</p>
                  <p style={{ margin: "4px 0 0", fontFamily: FONT_B, fontSize: 12.5, color: HERO_MUTED }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
