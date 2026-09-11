"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

export const GOLD   = "var(--gold-primary)";
export const GOLD_L = "var(--gold-highlight)";
export const WHITE  = "var(--text-primary)";
export const MUTED  = "var(--text-muted)";
export const SILVER = "var(--silver)";
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const FONT_H = "var(--font-cinzel), Cinzel, serif";
export const FONT_B = "var(--font-inter), Inter, sans-serif";
// Editorial display serif — loaded only on the Studio route (see studio/layout.tsx),
// used for the large sculptural numerals and italic accent lines that give the
// page its gallery/finance-editorial feel, distinct from the personal hub's Cinzel.
export const FONT_ED = "var(--font-fraunces), Fraunces, Georgia, serif";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
      {children}
    </p>
  );
}

// Chapter-numbered eyebrow — the page reads as a story in numbered chapters,
// bookended by the hero's opening line and the contact section's closing one.
// Bracket format ("( Chapter 01 )") plus a mirrored oversized numeral echo the
// editorial-finance reference direction rather than a plain uppercase label.
export function ChapterEyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
      <p style={{
        fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(15px, 1.8vw, 18px)",
        color: GOLD, margin: 0, letterSpacing: "0.01em",
      }}>
        ( {children} )
      </p>
      <p aria-hidden style={{
        fontFamily: FONT_ED, fontSize: "clamp(20px, 2.4vw, 28px)", color: MUTED,
        margin: 0, letterSpacing: "0.02em", opacity: 0.55, display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ display: "inline-block", width: 22, height: 1, background: "currentColor", opacity: 0.6 }} />
        {n}
      </p>
    </div>
  );
}

// A macro "Part" header — groups several numbered chapters under one of the
// page's seven top-level sections (Indian Business Infrastructure, The Shift
// to Digital & AI Era, What We Do, Our Approach, Plans, Existing Products,
// Contact). Sits above the ChapterEyebrow-numbered chapters it introduces —
// a coarser layer of structure, not a replacement for it.
export function PartHeader({ index, total, title, id }: {
  index: number; total: number; title: string; id?: string;
}) {
  return (
    <div id={id} style={{ maxWidth: 1100, margin: "0 auto", padding: "64px clamp(18px, 4vw, 32px) 0", scrollMarginTop: 76 }}>
      <Reveal style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{
          fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.2em", color: MUTED, whiteSpace: "nowrap",
        }}>
          PART {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div aria-hidden style={{ flex: 1, height: 1, background: "color-mix(in srgb, var(--gold-border) 30%, transparent)" }} />
      </Reveal>
      <Reveal delay={0.05} style={{ marginTop: 14 }}>
        <h2 style={{
          fontFamily: FONT_H, fontWeight: 600, fontSize: "clamp(26px, 4.4vw, 46px)",
          color: WHITE, margin: 0, letterSpacing: "0.01em",
        }}>
          {title}
        </h2>
      </Reveal>
    </div>
  );
}

// A short connecting line between chapters — narrative pacing, not a heading.
export function StoryBeat({ children }: { children: React.ReactNode }) {
  return (
    <Reveal style={{ maxWidth: 640, margin: "0 auto", padding: "36px clamp(18px, 4vw, 32px) 0", textAlign: "center" }}>
      <p style={{ fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(15px, 2vw, 19px)", color: SILVER, lineHeight: 1.6, margin: 0 }}>
        {children}
      </p>
    </Reveal>
  );
}

// The page's one explicit statement of the mission — deliberately the ONLY
// place it's spelled out this directly; everywhere else it's a felt
// undertone in the copy, not a repeated slogan. Two short lines, not a
// section: no ChapterEyebrow, no number, just a quiet close before Contact.
export function MissionBeat({ future, mission }: { future: string; mission: string }) {
  return (
    <Reveal style={{ maxWidth: 680, margin: "0 auto", padding: "48px clamp(18px, 4vw, 32px) 0", textAlign: "center" }}>
      <p style={{ fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(15px, 2vw, 19px)", color: SILVER, lineHeight: 1.6, margin: 0 }}>
        {future}
      </p>
      <p style={{ fontFamily: FONT_H, fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 600, color: WHITE, lineHeight: 1.4, margin: "16px 0 0" }}>
        {mission}
      </p>
    </Reveal>
  );
}

// Fixed vertical thread that fills as the page is scrolled — visually stitches
// the story's chapters into one continuous line. Desktop only (decorative;
// mobile's single-column stack already reads as one continuous story) and
// skipped entirely under reduced-motion.
export function StoryThread() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 22, restDelta: 0.001 });
  const reduce = useReducedMotion();
  // `useReducedMotion()` reads the real media query synchronously on the
  // client but is always false during SSR (no `window`) — branching the
  // rendered tree on it directly causes a hydration mismatch for every real
  // visitor with OS-level reduced motion enabled. Render exactly what the
  // server rendered on the first client pass, then react to the real value
  // only after mount, once hydration is already done.
  const [hideForReducedMotion, setHideForReducedMotion] = useState(false);
  useEffect(() => setHideForReducedMotion(!!reduce), [reduce]);

  if (hideForReducedMotion) return null;

  return (
    <div
      aria-hidden
      className="hidden lg:block"
      style={{
        position: "fixed", left: 28, top: 110, bottom: 110, width: 2, zIndex: 30,
        background: "color-mix(in srgb, var(--text-primary) 7%, transparent)", borderRadius: 2,
        pointerEvents: "none",
      }}
    >
      <motion.div style={{
        transformOrigin: "top", scaleY, position: "absolute", inset: 0,
        background: `linear-gradient(to bottom, ${GOLD}, ${GOLD_L})`, borderRadius: 2,
      }} />
    </div>
  );
}

// Fine vertical rule grid + soft drifting glow + film grain — the page's base
// texture. Fixed, behind everything, ignored by pointer events. This is what
// keeps every section feeling like one designed surface instead of stacked
// plain divs.
export function StudioBackdrop() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(to right, color-mix(in srgb, var(--text-primary) 6%, transparent) 0px, color-mix(in srgb, var(--text-primary) 6%, transparent) 1px, transparent 1px, transparent 120px)",
      }} />
      <motion.div
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-10%", left: "-10%", width: "60%", height: "60%",
          background: `radial-gradient(circle, color-mix(in srgb, ${GOLD} 10%, transparent) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: "0%", right: "-10%", width: "55%", height: "55%",
          background: `radial-gradient(circle, color-mix(in srgb, ${GOLD_L} 8%, transparent) 0%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03 }}>
        <filter id="studio-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#studio-grain)" />
      </svg>
    </div>
  );
}

// Oversized outline numeral used as background decoration behind a card or
// section — the "sculptural corner number" motif. Pure ghost type: stroked,
// not filled, so it reads as texture rather than content.
export function GhostNumeral({ children, size = "clamp(64px, 9vw, 120px)", style }: {
  children: React.ReactNode; size?: string; style?: React.CSSProperties;
}) {
  return (
    <span aria-hidden style={{
      fontFamily: FONT_ED, fontStyle: "italic", fontSize: size, lineHeight: 1,
      color: "transparent", WebkitTextStroke: "1px color-mix(in srgb, var(--text-primary) 18%, transparent)",
      pointerEvents: "none", userSelect: "none", ...style,
    }}>
      {children}
    </span>
  );
}

// Glossy "chrome" sphere — a CSS stand-in for the reference site's rendered
// metallic 3D objects. Layered radial-gradients fake a lit sphere; the icon
// (or numeral) sits on top in a color that reads against the material.
export function ChromeOrb({ accent = GOLD, size = 52, children }: {
  accent?: string; size?: number; children?: React.ReactNode;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      position: "relative", display: "grid", placeItems: "center",
      background: `
        radial-gradient(circle at 32% 26%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 26%),
        radial-gradient(circle at 68% 78%, color-mix(in srgb, ${accent} 55%, black) 0%, transparent 55%),
        radial-gradient(circle at 50% 50%, color-mix(in srgb, ${accent} 85%, white 10%) 0%, color-mix(in srgb, ${accent} 65%, black 35%) 60%, black 100%)
      `,
      boxShadow: `
        inset -${size * 0.12}px -${size * 0.12}px ${size * 0.28}px rgba(0,0,0,0.55),
        inset ${size * 0.08}px ${size * 0.08}px ${size * 0.18}px rgba(255,255,255,0.18),
        0 ${size * 0.16}px ${size * 0.32}px -${size * 0.12}px rgba(0,0,0,0.65)
      `,
    }}>
      <div style={{ position: "relative", zIndex: 1, color: "#fff", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>
        {children}
      </div>
    </div>
  );
}

// Compact placeholder for a section that wants a real photo but doesn't have
// one yet — a lighter-weight sibling to AnnotatedImageReveal's full-bleed
// placeholder fill, for half-width/inline image slots instead of hero blocks.
export function ImagePlaceholder({ caption, style }: { caption?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
      minHeight: 220, borderRadius: 16,
      border: `1px dashed color-mix(in srgb, ${GOLD} 30%, transparent)`,
      background: `linear-gradient(135deg, color-mix(in srgb, ${GOLD} 6%, var(--bg-primary)), var(--bg-primary))`,
      ...style,
    }}>
      <ImagePlus size={22} style={{ color: "color-mix(in srgb, var(--text-primary) 30%, transparent)" }} />
      {caption && (
        <span style={{ fontFamily: FONT_B, fontSize: 11.5, color: MUTED, textAlign: "center", padding: "0 16px" }}>
          {caption} — photography pending
        </span>
      )}
    </div>
  );
}

export function SectionHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: FONT_H, fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 600, lineHeight: 1.2, color: WHITE, margin: 0, ...style }}>
      {children}
    </h2>
  );
}

// Word-by-word entrance — each word blurs/fades/rises in on its own staggered
// delay rather than the line appearing as one block. Used for the hero's
// branding overlay on the video; a one-shot mount animation like the rest of
// the hero's entrance copy, so (consistent with that copy) it isn't gated
// behind a reduced-motion check.
export function WordReveal({ text, style, delay = 0, stagger = 0.09 }: {
  text: string; style?: React.CSSProperties; delay?: number; stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <p style={{ margin: 0, ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: EASE, delay: delay + i * stagger }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

// `once` defaults to false: the block fades back out as it scrolls out of
// view and replays its entrance on the way back, so the page reads as alive
// scrolling in either direction instead of a wall of content that only ever
// animates in once and then sits dead. Pass `once` explicitly for the rare
// spot that should keep its one-shot arrival (the hero, mainly).
export function Reveal({ children, delay = 0, once = false, style, className }: {
  children: React.ReactNode; delay?: number; once?: boolean; style?: React.CSSProperties; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Divider() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(18px, 4vw, 32px)", position: "relative", zIndex: 1 }}>
      <div style={{ height: 1, background: "color-mix(in srgb, var(--gold-border) 12%, transparent)" }} />
    </div>
  );
}
