"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, ChromeOrb, GhostNumeral, GOLD, GOLD_L, WHITE, SILVER, MUTED, FONT_H, FONT_B, EASE } from "./shared";

// The brief's 5-layer model — each layer is a real capability bundle, not a
// vague milestone name. Deliberately fewer, denser stages than the previous
// flat 7-item version.
const LAYERS = [
  { name: "Digital Presence",      items: ["Website", "Google", "Social", "E-commerce"] },
  { name: "Business Organization", items: ["CMS", "CRM", "Customer records", "Inventory", "Transactions"] },
  { name: "Automation",            items: ["Notifications", "Follow-ups", "Reports", "Workflows", "Data sync"] },
  { name: "Intelligence",          items: ["Analytics", "AI assistants", "AI workflows", "Business insights"] },
  { name: "Future Readiness",      items: ["AI agents", "Machine-readable information", "Connected systems", "Automated operations"] },
];

// A gentle left/right drift per stage — turns a plain vertical list into a
// meandering path, echoing the reference direction's asymmetric compositions.
const OFFSETS = [-18, 14, -14, 16, 0];

export function StudioTransformation() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", position: "relative", overflow: "hidden" }}>
      <GhostNumeral
        size="clamp(160px, 26vw, 340px)"
        style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", zIndex: 0, opacity: 0.5 }}
      >
        04
      </GhostNumeral>

      <Reveal style={{ marginBottom: 48, maxWidth: 680, marginLeft: "auto", marginRight: "auto", textAlign: "center", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ChapterEyebrow n="04">The Transformation</ChapterEyebrow>
        </div>
        <SectionHeading style={{ textAlign: "center" }}>Digitalization is more than a website.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: 13.5, color: MUTED, margin: "14px 0 0" }}>
          It happens in layers — each one built on the one before it.
        </p>
      </Reveal>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative" }}
      >
        {LAYERS.map((layer, i) => {
          const isLast = i === LAYERS.length - 1;
          const num = String(i + 1).padStart(2, "0");
          return (
            <motion.div key={layer.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 480 }}
              variants={{ hidden: { opacity: 0, y: 14, x: 0 }, visible: { opacity: 1, y: 0, x: OFFSETS[i], transition: { duration: 0.55, ease: EASE } } }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.015, borderColor: `color-mix(in srgb, ${GOLD} 55%, transparent)` }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                display: "flex", flexDirection: "column", gap: 10, width: "100%",
                padding: "16px 20px", borderRadius: 18,
                border: isLast
                  ? `1px solid color-mix(in srgb, ${GOLD} 45%, transparent)`
                  : "1px solid color-mix(in srgb, var(--text-primary) 12%, transparent)",
                background: isLast
                  ? `linear-gradient(135deg, color-mix(in srgb, ${GOLD} 14%, transparent), color-mix(in srgb, ${GOLD_L} 8%, transparent))`
                  : "color-mix(in srgb, var(--text-primary) 4%, transparent)",
                boxShadow: "0 16px 32px -22px rgba(0,0,0,0.6)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ChromeOrb accent={isLast ? GOLD : "#8B93A1"} size={32}>
                    <span style={{ fontFamily: FONT_H, fontSize: 12, fontWeight: 600 }}>{num}</span>
                  </ChromeOrb>
                  <span style={{
                    fontFamily: FONT_H, fontSize: "clamp(15px, 1.8vw, 18px)", fontWeight: 600,
                    color: isLast ? WHITE : SILVER,
                  }}>{layer.name}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 44 }}>
                  {layer.items.map(item => (
                    <span key={item} style={{
                      fontFamily: FONT_B, fontSize: 11.5, color: MUTED,
                      padding: "3px 10px", borderRadius: 100,
                      border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
              {!isLast && (
                <ArrowDown size={16} style={{ color: "color-mix(in srgb, var(--gold-border) 50%, transparent)", margin: "8px 0" }} />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
