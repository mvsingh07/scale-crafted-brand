"use client";

import { motion } from "motion/react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const SILVER = "var(--silver)";
const WHITE = "var(--text-primary)";
const BORDER_GOLD = "var(--gold-border)";

const PARAGRAPHS = [
  { text: "I'm a Senior Software Engineer with 3+ years of experience who treats software like a product, not a task list. My recent work at <b>Vusic Technologies</b> and Turtleneck Systems has been deep in the trenches of <b>distributed systems</b> — designing platforms that hold up under 50K+ concurrent users, handle gigabyte-scale encrypted workloads, and stay responsive in milliseconds, not seconds.", italic: false },
  { text: "My playground is <b>system design</b>: choosing the right boundaries between services, picking the right consistency model, knowing when to reach for Kafka or RabbitMQ, when Redis is enough, and when the answer is simply a better data structure. I obsess over the tradeoffs most teams skip — and that's usually where the real reliability lives.", italic: false },
  { text: "Beyond the code, I lead. I've owned features end-to-end, mentored engineers, translated fuzzy product asks into crisp technical roadmaps, shipped demos and walkthroughs for clients, and operated production systems with real observability. Ownership isn't a buzzword for me — it's the default mode.", italic: false },
  { text: "The vision needs an architect.", italic: true },
];

const STATS = [
  { value: "3+",    label: "Years Experience" },
  { value: "50K+",  label: "Concurrent Users Handled" },
  { value: "10+",   label: "Products Shipped" },
  { value: "AI",    label: "Native Builder" },
];

export default function AboutPage() {
  return (
    <HubPageLayout>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "64px 32px 80px",
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: GOLD, marginBottom: 16,
          }}>
            01 — The Engineer
          </p>
          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0,
          }}>
            The engineer behind<br />the systems.
          </h1>
          {/* Gold divider */}
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
            {PARAGRAPHS.map((p, i) => (
              <motion.p
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginTop: 48 }}
            className="lg:mt-0"
          >
            <div style={{
              border: `1px solid color-mix(in srgb, var(--gold-border) 45%, transparent)`,
              borderRadius: 16,
              padding: "32px 24px",
              background: "color-mix(in srgb, var(--gold-primary) 6%, var(--bg-primary))",
              boxShadow: "0 2px 24px color-mix(in srgb, var(--gold-border) 12%, transparent)",
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}>
              {STATS.map((s, i) => (
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
                  {i < STATS.length - 1 && (
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
