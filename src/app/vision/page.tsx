"use client";

import { motion } from "motion/react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";
import { VisionSection } from "@/components/sections/VisionSection";

const GOLD   = "var(--gold-primary)";
const WHITE  = "var(--text-primary)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ECOSYSTEM_PILLARS = [
  { num: "01", title: "Ahara",   subtitle: "Nourish the Body" },
  { num: "02", title: "Vihara",  subtitle: "Build Healthy Habits" },
  { num: "03", title: "Sharira", subtitle: "Strengthen the Body" },
  { num: "04", title: "Manas",   subtitle: "Train the Mind" },
  { num: "05", title: "Buddhi",  subtitle: "Expand Understanding" },
  { num: "06", title: "Atma",    subtitle: "Discover Purpose" },
];

function HumanPotentialSection() {
  return (
    <div style={{
      maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px",
      borderBottom: "1px solid color-mix(in srgb, var(--gold-border) 18%, transparent)",
      marginBottom: 0,
    }}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginBottom: 14 }}
      >
        Human Potential Ecosystem
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 600, color: WHITE, margin: "0 0 44px", lineHeight: 1.2 }}
      >
        The Six Dimensions
      </motion.h2>

      <div style={{ position: "relative", maxWidth: 520 }}>
        <div style={{ position: "absolute", left: 7, top: 14, bottom: 14, width: 1, background: `linear-gradient(to bottom, ${GOLD}, color-mix(in srgb, ${GOLD} 10%, transparent))` }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {ECOSYSTEM_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: EASE }}
              style={{ display: "flex", alignItems: "flex-start", gap: 24, paddingBottom: i < ECOSYSTEM_PILLARS.length - 1 ? 34 : 0 }}
            >
              <div style={{
                width: 15, height: 15, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                border: `2px solid ${GOLD}`,
                background: i === ECOSYSTEM_PILLARS.length - 1 ? GOLD : "var(--bg-primary)",
                boxShadow: i === ECOSYSTEM_PILLARS.length - 1 ? `0 0 10px ${GOLD}` : "none",
                position: "relative", zIndex: 1,
              }} />
              <div>
                <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 9, letterSpacing: "0.2em", color: GOLD, opacity: 0.7, display: "block", marginBottom: 3 }}>
                  {pillar.num}
                </span>
                <p style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 600, color: i === ECOSYSTEM_PILLARS.length - 1 ? GOLD : WHITE, margin: "0 0 3px" }}>
                  {pillar.title}
                </p>
                <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(12px, 1.3vw, 14px)", color: SILVER, margin: 0, lineHeight: 1.6 }}>
                  {pillar.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VisionPage() {
  return (
    <HubPageLayout>
      <div style={{ paddingTop: 64 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 72px" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ marginBottom: 72 }}
          >
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
              02 — The Vision
            </p>
            <h1 style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0 }}>
              What I&apos;m building<br />toward.
            </h1>
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0", maxWidth: 520 }}>
              Vision without execution is noise. These are the frameworks and projects that give direction to the work.
            </p>
            <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
          </motion.div>
        </div>
        <HumanPotentialSection />
        <VisionSection />
      </div>
    </HubPageLayout>
  );
}
