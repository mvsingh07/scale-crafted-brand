"use client";

// Recreates the original hero footage's motion language for a static
// image. That clip never moved the camera — it was one fixed shot where
// headline lines, a labeled feature list, and a closing line each fade/slide
// in on their own cue, wired together with small "connector" ticks, building
// up cumulatively until the frame is fully annotated. This gives any image
// the same treatment, driven by scroll (whileInView, once) instead of a
// timeline, so it works as a drop-in hero/section block.
//
// `src` is optional — omit it (with a `placeholderCaption`) to render a
// placeholder fill instead of a broken image while real photography is
// pending, without losing any of the overlay copy/animation.
//
// Usage, once an image is supplied:
//   import photo from "@/assets/whatever.png";
//   <AnnotatedImageReveal
//     src={photo}
//     alt="..."
//     eyebrow="MV Singh Tech Studio"
//     headlineLines={["We design.", "We build.", "We transform."]}
//     subtitle="Optional supporting line under the headline."
//     callouts={[{ icon: Globe, label: "Web Presence", sublabel: "Custom sites" }, ...]}
//     tagline="Optional line anchored to the bottom-right corner."
//   />

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ChromeOrb, GOLD, GOLD_L, WHITE, MUTED, SILVER, FONT_H, FONT_ED, FONT_B, EASE } from "./shared";

export interface ImageCallout {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  accent?: string;
}

export interface AnnotatedImageRevealProps {
  // Omit when no real photo exists yet — renders a placeholder fill instead
  // of a broken image. `placeholderCaption` names what's pending so the gap
  // reads as "photography pending," not "this is broken."
  src?: StaticImageData;
  alt: string;
  placeholderCaption?: string;
  eyebrow?: string;
  headlineLines: string[];
  subtitle?: string;
  callouts?: ImageCallout[];
  tagline?: string;
  // Dims the photo itself (independent of the text-contrast scrim below) —
  // for a shot that reads too bright/saturated against the page's dark
  // palette. 1 (default) leaves the photo at full strength.
  imageOpacity?: number;
  // CSS object-position for the cover-cropped photo. Defaults to the
  // original top-anchored crop; pass e.g. "center center" for a shot whose
  // subject sits lower in the frame and gets cut off anchored to the top.
  imagePosition?: string;
  height?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

function Callout({ item }: { item: ImageCallout }) {
  const Icon = item.icon;
  return (
    <motion.div variants={fadeIn} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontFamily: FONT_B, fontSize: 12.5, fontWeight: 600, color: WHITE, whiteSpace: "nowrap" }}>{item.label}</p>
        {item.sublabel && (
          <p style={{ margin: 0, fontFamily: FONT_B, fontSize: 10.5, color: MUTED, whiteSpace: "nowrap" }}>{item.sublabel}</p>
        )}
      </div>
      {/* the "connector" tick — a short line that draws in just ahead of the
          badge, standing in for the video's line-to-skyline-point effect
          without needing to know where anything is in an arbitrary image */}
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.35, ease: EASE } } }}
        style={{ width: 20, height: 1, background: `color-mix(in srgb, ${item.accent ?? GOLD} 70%, transparent)`, transformOrigin: "right" }}
      />
      <ChromeOrb accent={item.accent ?? GOLD} size={32}><Icon size={14} /></ChromeOrb>
    </motion.div>
  );
}

export function AnnotatedImageReveal({
  src, alt, placeholderCaption, eyebrow, headlineLines, subtitle, callouts = [], tagline,
  height = "clamp(460px, 90vh, 960px)", imageOpacity = 1, imagePosition = "center top",
}: AnnotatedImageRevealProps) {
  const reduce = useReducedMotion();
  // Same SSR/hydration hazard as StoryThread (see shared.tsx): `reduce` is
  // always false on the server but reads the true value synchronously on
  // the client's first render, so using it directly to pick `initial`
  // ("hidden" vs "visible") renders genuinely different opacity/transform
  // styles between server and client for anyone with reduced motion on.
  // Stay on the SSR-safe value until after mount, then switch.
  const [reduceSafe, setReduceSafe] = useState(false);
  useEffect(() => setReduceSafe(!!reduce), [reduce]);

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden" }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          placeholder="blur"
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition, opacity: imageOpacity }}
        />
      ) : (
        <div aria-hidden style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
          background: `linear-gradient(135deg, color-mix(in srgb, ${GOLD} 8%, var(--bg-primary)), var(--bg-primary))`,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, display: "grid", placeItems: "center",
            border: `1px dashed color-mix(in srgb, ${GOLD} 40%, transparent)`,
          }}>
            <ImagePlus size={22} style={{ color: "color-mix(in srgb, var(--text-primary) 35%, transparent)" }} />
          </div>
          {placeholderCaption && (
            <span style={{ fontFamily: FONT_B, fontSize: 12, color: MUTED, letterSpacing: "0.04em" }}>
              {placeholderCaption} — photography pending
            </span>
          )}
        </div>
      )}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 32%, rgba(0,0,0,0.1) 62%, rgba(0,0,0,0.55) 100%)",
      }} />

      <motion.div
        variants={container}
        initial={reduceSafe ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
        style={{
          position: "absolute", inset: 0, padding: "clamp(24px, 4vw, 56px)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 440 }}>
            {eyebrow && (
              <motion.p variants={fadeUp} style={{
                fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                color: GOLD, margin: "0 0 12px",
              }}>
                {eyebrow}
              </motion.p>
            )}

            <div style={{ margin: 0 }}>
              {headlineLines.map((line, i) => (
                <motion.span key={i} variants={fadeUp} style={{
                  display: "block", fontFamily: FONT_H, fontWeight: 700,
                  fontSize: "clamp(22px, 3.6vw, 36px)", lineHeight: 1.15, color: WHITE,
                }}>
                  {line}
                </motion.span>
              ))}
            </div>

            {subtitle && (
              <motion.p variants={fadeUp} style={{
                fontFamily: FONT_B, fontSize: "clamp(13px, 1.4vw, 15px)", lineHeight: 1.65,
                color: SILVER, margin: "16px 0 0", maxWidth: 380,
              }}>
                {subtitle}
              </motion.p>
            )}
          </div>

          {callouts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {callouts.map(c => <Callout key={c.label} item={c} />)}
            </div>
          )}
        </div>

        {tagline && (
          <motion.p variants={fadeUp} style={{
            alignSelf: "flex-end", textAlign: "right", maxWidth: 320,
            fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(15px, 1.8vw, 19px)",
            lineHeight: 1.4, color: WHITE, margin: 0,
            background: `linear-gradient(135deg, ${WHITE} 55%, ${GOLD_L} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {tagline}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
