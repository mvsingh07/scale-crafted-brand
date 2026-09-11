"use client";

import { motion } from "motion/react";
import {
  Globe, Search, FileText, MapPin, BadgeCheck, LayoutGrid, ShoppingCart,
  Users, BarChart3, MessageCircle, ArrowDown, Bot, ArrowRight,
} from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, ChromeOrb, GOLD, MUTED, SILVER, WHITE, FONT_H, FONT_B, FONT_ED, EASE } from "./shared";

const PRESENCE_ITEMS = [
  { icon: Globe,          label: "Owned website" },
  { icon: Search,         label: "Searchable business info" },
  { icon: FileText,       label: "Structured product/service info" },
  { icon: MapPin,         label: "Location information" },
  { icon: BadgeCheck,     label: "Google presence" },
  { icon: LayoutGrid,     label: "Digital catalogue" },
  { icon: ShoppingCart,   label: "E-commerce" },
  { icon: Users,          label: "Customer information" },
  { icon: BarChart3,      label: "Analytics" },
  { icon: MessageCircle,  label: "Automated communication" },
];

// Deliberately worded as a direction, never a fact — brief's own rule: never
// state speculative AI-agent scenarios as guaranteed outcomes.
const LADDER = [
  "Be online",
  "Be searchable",
  "Be understandable",
  "Be discoverable by AI",
  "Be ready for agents",
];

export function StudioDigitalFuture() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 44, maxWidth: 680 }}>
        <ChapterEyebrow n="05">Becoming Understandable</ChapterEyebrow>
        <SectionHeading>A social media page is no longer the whole presence.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 16px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0", maxWidth: 620 }}>
          A social page is useful. It isn&apos;t the entire digital identity of a business.
        </p>
      </Reveal>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
      >
        {PRESENCE_ITEMS.map(({ icon: Icon, label }) => (
          <motion.span
            key={label}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } } }}
            whileHover={{ y: -3, scale: 1.05, borderColor: `color-mix(in srgb, ${GOLD} 45%, transparent)` }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 12px", borderRadius: 100,
              border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)",
              background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
              fontFamily: FONT_B, fontSize: 12, color: SILVER,
            }}
          >
            <Icon size={12} style={{ color: GOLD }} /> {label}
          </motion.span>
        ))}
      </motion.div>

      <Reveal delay={0.1} style={{ marginBottom: 64, maxWidth: 640 }}>
        <p style={{ fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(18px, 2.4vw, 26px)", color: WHITE, lineHeight: 1.4, margin: 0 }}>
          Don&apos;t just be present online. Become understandable to the digital world.
        </p>
      </Reveal>

      {/* Beat 2 — the next customer may not be a person. Hedged throughout. */}
      <Reveal style={{ marginBottom: 28, maxWidth: 680 }}>
        <p style={{ fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 10px" }}>
          The Next Customer
        </p>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 16px)", color: SILVER, lineHeight: 1.75, margin: 0 }}>
          The web is moving toward a world where AI systems increasingly search, compare, and
          act on behalf of people. We don&apos;t know exactly how this unfolds — but businesses
          that structure their information today will be better positioned for it.
        </p>
      </Reveal>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", marginBottom: 64 }}>
        <motion.div
          whileHover={{ y: -4, borderColor: "color-mix(in srgb, var(--text-primary) 22%, transparent)" }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
          padding: "20px 22px", borderRadius: 16,
          border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)",
          background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
        }}>
          <p style={{ fontFamily: FONT_B, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED, margin: "0 0 12px" }}>Today</p>
          <p style={{ fontFamily: FONT_B, fontSize: 13.5, color: SILVER, margin: 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            Person <ArrowRight size={12} /> Search <ArrowRight size={12} /> Website <ArrowRight size={12} /> Business
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4, borderColor: `color-mix(in srgb, ${GOLD} 55%, transparent)` }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
          padding: "20px 22px", borderRadius: 16,
          border: `1px solid color-mix(in srgb, ${GOLD} 30%, transparent)`,
          background: `color-mix(in srgb, ${GOLD} 4%, var(--bg-primary))`,
        }}>
          <p style={{ fontFamily: FONT_B, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, margin: "0 0 12px" }}>Imagine a World Where</p>
          <p style={{ fontFamily: FONT_B, fontSize: 13.5, color: WHITE, margin: 0, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            Person <ArrowRight size={12} /> AI Agent <ArrowRight size={12} /> Web <ArrowRight size={12} /> Business <ArrowRight size={12} /> Action
          </p>
        </motion.div>
      </div>

      {/* Beat 3 — SEO isn't enough, framed as a ladder (reuses Transformation's stepper grammar). */}
      <Reveal style={{ marginBottom: 32, maxWidth: 680 }}>
        <p style={{ fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 10px" }}>
          SEO Is Not Enough
        </p>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 16px)", color: SILVER, lineHeight: 1.7, margin: 0 }}>
          Traditional SEO helps a business become understandable to search engines. GEO — AI
          visibility — aims to make information easier for generative systems to understand
          and surface. We don&apos;t promise rankings or AI recommendations; we build the
          foundation that gives a business a chance at both.
        </p>
      </Reveal>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, maxWidth: 420 }}
      >
        {LADDER.map((step, i) => {
          const isLast = i === LADDER.length - 1;
          return (
            <motion.div key={step} style={{ display: "flex", flexDirection: "column", width: "100%" }}
              variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } } }}
            >
              <motion.div
                whileHover={{ x: 4, scale: 1.02 }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "9px clamp(14px, 4vw, 18px) 9px 9px", borderRadius: 100, width: "fit-content",
                border: isLast ? `1px solid color-mix(in srgb, ${GOLD} 45%, transparent)` : "1px solid color-mix(in srgb, var(--text-primary) 12%, transparent)",
                background: isLast ? `color-mix(in srgb, ${GOLD} 12%, transparent)` : "color-mix(in srgb, var(--text-primary) 4%, transparent)",
              }}>
                <ChromeOrb accent={isLast ? GOLD : "#8B93A1"} size={28}>
                  {isLast ? <Bot size={13} /> : <span style={{ fontFamily: FONT_H, fontSize: 11, fontWeight: 600 }}>{i + 1}</span>}
                </ChromeOrb>
                <span style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: isLast ? 600 : 400, color: isLast ? WHITE : SILVER }}>{step}</span>
              </motion.div>
              {!isLast && <ArrowDown size={14} style={{ color: "color-mix(in srgb, var(--gold-border) 50%, transparent)", margin: "4px 0 4px 13px" }} />}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
