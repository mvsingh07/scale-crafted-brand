"use client";

import { motion } from "motion/react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const WHITE = "var(--text-primary)";
const SILVER = "var(--silver)";

const PILLARS = [
  {
    number: "01",
    title: "As a Human",
    body: "To live deliberately — with clarity of purpose, depth in relationships, and the discipline to build something that outlasts any single role or title.",
  },
  {
    number: "02",
    title: "As an Engineer",
    body: "To design systems that hold. Not just systems that work in demos — systems that scale under pressure, stay maintainable, and respect the people who run them.",
  },
  {
    number: "03",
    title: "As a Craftsman",
    body: "To treat software as a medium, not a commodity. To care about the interface between ideas and execution, and to keep closing that gap.",
  },
];

export default function VisionPage() {
  return (
    <HubPageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 72 }}
        >
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: GOLD, marginBottom: 16,
          }}>
            02 — The Vision
          </p>
          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0,
          }}>
            What I&apos;m building<br />toward.
          </h1>
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: SILVER, marginTop: 16, maxWidth: 520, lineHeight: 1.7, margin: "16px 0 0",
          }}>
            Vision without execution is noise. This is where I try to make mine legible — to myself and to anyone building alongside me.
          </p>
          <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
        </motion.div>

        {/* Three pillars */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
          style={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.number}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: 32,
                padding: "36px 0",
                borderBottom: "1px solid color-mix(in srgb, var(--gold-border) 18%, transparent)",
              }}
              className="md:grid-cols-[64px_1fr]"
            >
              <div>
                <p style={{
                  fontFamily: "var(--font-cinzel), Cinzel, serif",
                  fontSize: "clamp(24px, 3vw, 40px)",
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0, lineHeight: 1,
                }}>
                  {p.number}
                </p>
              </div>
              <div>
                <h2 style={{
                  fontFamily: "var(--font-cinzel), Cinzel, serif",
                  fontSize: "clamp(18px, 2.2vw, 26px)",
                  fontWeight: 600, color: WHITE, margin: "0 0 14px",
                }}>
                  {p.title}
                </h2>
                <p style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 17px)",
                  lineHeight: 1.85, color: SILVER, margin: 0, maxWidth: 640,
                }}>
                  {p.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing statement */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: 56,
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(16px, 2vw, 22px)",
            fontStyle: "italic",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: 520,
          }}
        >
          The only way to build something real is to be honest about what you&apos;re actually trying to do.
        </motion.p>
      </div>
    </HubPageLayout>
  );
}
