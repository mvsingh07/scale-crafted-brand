"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Link from "next/link";
import { HubPageLayout } from "@/components/hub/HubPageLayout";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD      = "var(--gold-primary)";
const GOLD_L    = "var(--gold-highlight)";
const WHITE     = "var(--text-primary)";
const MUTED     = "var(--text-muted)";
const SILVER    = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ── Section reveal wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Section label / eyebrow ───────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-inter), Inter, sans-serif",
      fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
      color: GOLD, margin: "0 0 18px",
    }}>
      {children}
    </p>
  );
}

// ── Gold divider line ─────────────────────────────────────────────────────────
function GoldLine({ width = 48 }: { width?: number }) {
  return (
    <div style={{
      marginTop: 24, width, height: 1,
      background: `linear-gradient(to right, ${GOLD}, transparent)`,
    }} />
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  children,
  id,
  style,
}: {
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "100px 32px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — HERO
// ─────────────────────────────────────────────────────────────────────────────
const ROTATING_WORDS = ["Engineer.", "Thinker.", "Builder.", "Lifelong Student."];

function HeroSection() {
  const [idx, setIdx]   = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => setIdx(i => (i + 1) % ROTATING_WORDS.length), 2600);
    return () => clearInterval(id);
  }, [ready]);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 32px 80px", position: "relative", overflow: "hidden",
      background: "var(--bg-primary)",
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 72% 58% at 50% 48%, color-mix(in srgb, ${GOLD} 7%, transparent) 0%, transparent 65%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 1, textAlign: "center",
        width: "100%", maxWidth: 860,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase",
            color: GOLD, margin: "0 0 28px",
          }}
        >
          Hello, curious mind.
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
          animate={ready ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.28, ease: EASE }}
          style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(52px, 9vw, 100px)",
            fontWeight: 600, lineHeight: 1.08, margin: 0,
            background: `linear-gradient(135deg, ${WHITE} 55%, ${GOLD_L} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          MV Singh
        </motion.h1>

        {/* Rotating text */}
        <div style={{ height: 52, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{
                fontFamily: "var(--font-cinzel), Cinzel, serif",
                fontSize: "clamp(18px, 2.8vw, 32px)",
                fontWeight: 400,
                color: GOLD,
                letterSpacing: "0.04em",
              }}
            >
              {ROTATING_WORDS[idx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={ready ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.65, delay: 0.9, ease: EASE }}
          style={{
            margin: "32px auto 0", height: 1, width: 80,
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            transformOrigin: "center",
          }}
        />

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 1.0, ease: EASE }}
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(15px, 1.7vw, 18px)",
            color: SILVER, margin: "28px 0 0", lineHeight: 1.7, maxWidth: 520,
          }}
        >
          Building systems, exploring ideas, and documenting the journey.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.2, ease: EASE }}
          style={{ display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap", justifyContent: "center" }}
        >
          <Link
            href="#coordinates"
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13, letterSpacing: "0.1em", textDecoration: "none",
              padding: "12px 28px", borderRadius: 8,
              background: GOLD, color: "#0A0A0A", fontWeight: 600,
              transition: "opacity 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Explore My World
          </Link>
          <Link
            href="#coordinates"
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13, letterSpacing: "0.1em", textDecoration: "none",
              padding: "12px 28px", borderRadius: 8,
              border: `1px solid color-mix(in srgb, ${GOLD} 45%, transparent)`,
              color: GOLD, background: "transparent",
              transition: "border-color 0.2s, transform 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `color-mix(in srgb, ${GOLD} 45%, transparent)`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Current Coordinates
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 0.45 } : {}}
        transition={{ duration: 0.8, delay: 1.6 }}
        style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — DEFINE MY WORLD
// ─────────────────────────────────────────────────────────────────────────────
const WORLD_CARDS = [
  {
    title: "Building",
    body: "Products, systems, technology, and ideas brought to life.",
    icon: "◈",
  },
  {
    title: "Learning",
    body: "Books, experiments, questions, and mental models.",
    icon: "◉",
  },
  {
    title: "Thinking",
    body: "Observations, essays, reflections, and philosophy.",
    icon: "◎",
  },
  {
    title: "Living",
    body: "Fitness, travel, experiences, and personal growth.",
    icon: "◌",
  },
];

function WorldSection() {
  return (
    <Section id="world" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>01 — Define My World</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.2,
        }}>
          A Few Things That<br />Define My World
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 20, marginTop: 56,
      }}>
        {WORLD_CARDS.map((card, i) => (
          <Reveal key={card.title} delay={i * 0.1}>
            <WorldCard {...card} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function WorldCard({ title, body, icon }: { title: string; body: string; icon: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "36px 28px",
        borderRadius: 14,
        border: `1px solid ${hovered ? `color-mix(in srgb, ${GOLD} 30%, transparent)` : "color-mix(in srgb, var(--gold-border) 14%, transparent)"}`,
        background: hovered
          ? `color-mix(in srgb, ${GOLD} 4%, var(--bg-primary))`
          : "color-mix(in srgb, var(--bg-secondary) 40%, var(--bg-primary))",
        cursor: "default",
        transition: "border-color 0.3s, background 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div style={{
        fontFamily: "var(--font-cinzel), Cinzel, serif",
        fontSize: 28, color: GOLD, marginBottom: 16,
        opacity: hovered ? 1 : 0.65,
        transition: "opacity 0.3s",
      }}>
        {icon}
      </div>
      <h3 style={{
        fontFamily: "var(--font-cinzel), Cinzel, serif",
        fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 600,
        color: WHITE, margin: "0 0 10px",
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: "clamp(13px, 1.4vw, 15px)",
        color: SILVER, margin: 0, lineHeight: 1.75,
      }}>
        {body}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — CURRENT COORDINATES
// ─────────────────────────────────────────────────────────────────────────────
const COORDINATES = [
  {
    label: "Professionally",
    items: ["AI Systems", "Cybersecurity", "Product Engineering"],
  },
  {
    label: "Personally",
    items: ["Strength Training", "Writing", "Learning Urdu"],
  },
  {
    label: "Exploring",
    items: ["Human Potential", "Systems Thinking", "Ancient Knowledge"],
  },
];

function CoordinatesSection() {
  return (
    <Section id="coordinates" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>02 — Current Coordinates</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.2,
        }}>
          Current Coordinates
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 40, marginTop: 56,
      }}>
        {COORDINATES.map((col, i) => (
          <Reveal key={col.label} delay={i * 0.12}>
            <div>
              <p style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                color: GOLD, marginBottom: 20,
              }}>
                {col.label}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {col.items.map((item, j) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.1 + j * 0.1, ease: EASE }}
                    style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontSize: "clamp(14px, 1.5vw, 16px)",
                      color: SILVER, display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, flexShrink: 0, boxShadow: `0 0 5px ${GOLD}` }} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — JOURNEY
// ─────────────────────────────────────────────────────────────────────────────
const JOURNEY_STEPS = [
  { label: "Punjab", note: "Where it began." },
  { label: "Delhi NCR", note: "The next horizon." },
  { label: "Software Engineering", note: "The craft." },
  { label: "Cybersecurity", note: "Understanding systems at their limits." },
  { label: "Artificial Intelligence", note: "The frontier." },
  { label: "Building Products", note: "Where everything converges." },
];

function JourneySection() {
  return (
    <Section id="journey" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>03 — The Journey</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.2,
        }}>
          The Journey So Far
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{ marginTop: 64, maxWidth: 480, position: "relative" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: 7, top: 12, bottom: 12, width: 1,
          background: `linear-gradient(to bottom, ${GOLD}, color-mix(in srgb, ${GOLD} 10%, transparent))`,
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {JOURNEY_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 24,
                paddingBottom: i < JOURNEY_STEPS.length - 1 ? 36 : 0,
              }}
            >
              {/* Dot */}
              <div style={{
                width: 15, height: 15, borderRadius: "50%", flexShrink: 0, marginTop: 3,
                border: `2px solid ${GOLD}`,
                background: i === JOURNEY_STEPS.length - 1
                  ? GOLD
                  : "var(--bg-primary)",
                boxShadow: i === JOURNEY_STEPS.length - 1 ? `0 0 10px ${GOLD}` : "none",
                position: "relative", zIndex: 1,
              }} />

              <div>
                <p style={{
                  fontFamily: "var(--font-cinzel), Cinzel, serif",
                  fontSize: "clamp(16px, 1.9vw, 21px)", fontWeight: 600,
                  color: i === JOURNEY_STEPS.length - 1 ? GOLD : WHITE,
                  margin: "0 0 4px",
                }}>
                  {step.label}
                </p>
                <p style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "clamp(12px, 1.3vw, 14px)",
                  color: MUTED, margin: 0, lineHeight: 1.6,
                }}>
                  {step.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — DIGITAL GARDEN
// ─────────────────────────────────────────────────────────────────────────────
const NOTES = [
  { title: "Why Curiosity Is A Competitive Advantage", tag: "Mind" },
  { title: "Building Systems vs Building Features", tag: "Engineering" },
  { title: "Lessons From Strength Training", tag: "Body" },
  { title: "What I'm Learning About Human Potential", tag: "Growth" },
  { title: "The Future of Human–AI Collaboration", tag: "AI" },
];

function GardenSection() {
  return (
    <Section id="garden" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>04 — Digital Garden</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.2,
        }}>
          Notes From The Journey
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 18, marginTop: 56,
      }}>
        {NOTES.map((note, i) => (
          <Reveal key={note.title} delay={i * 0.08}>
            <NoteCard {...note} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function NoteCard({ title, tag }: { title: string; tag: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 24px",
        borderRadius: 12,
        border: `1px solid ${hovered ? `color-mix(in srgb, ${GOLD} 28%, transparent)` : "color-mix(in srgb, var(--gold-border) 14%, transparent)"}`,
        background: hovered
          ? `color-mix(in srgb, ${GOLD} 3%, var(--bg-primary))`
          : "var(--bg-primary)",
        cursor: "pointer",
        transition: "all 0.28s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <span style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
        color: GOLD, padding: "3px 9px",
        border: `1px solid color-mix(in srgb, ${GOLD} 30%, transparent)`,
        borderRadius: 4, display: "inline-block", marginBottom: 14,
      }}>
        {tag}
      </span>
      <h3 style={{
        fontFamily: "var(--font-cinzel), Cinzel, serif",
        fontSize: "clamp(14px, 1.5vw, 17px)", fontWeight: 500,
        color: WHITE, margin: "0 0 0",
        lineHeight: 1.45,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 11, letterSpacing: "0.08em",
        color: hovered ? GOLD : MUTED,
        margin: "16px 0 0",
        transition: "color 0.28s",
      }}>
        Read →
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — THINGS I'M BUILDING
// ─────────────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    name: "Ahara",
    tagline: "AI-powered health guidance platform inspired by Ayurvedic principles.",
    status: "Active",
  },
  {
    name: "Beguile",
    tagline: "Advanced malware analysis and cybersecurity research platform.",
    status: "Active",
  },
  {
    name: "Digital Ecosystem",
    tagline: "A living experiment in documenting learning, growth, and creation.",
    status: "Ongoing",
  },
];

function BuildingSection() {
  return (
    <Section id="building" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>05 — Things I&apos;m Building</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.2,
        }}>
          Things I&apos;m Building
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 56 }}>
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.12}>
            <ProjectCard {...p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ name, tagline, status }: { name: string; tagline: string; status: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 20,
        padding: "32px 36px",
        borderRadius: 14,
        border: `1px solid ${hovered ? `color-mix(in srgb, ${GOLD} 30%, transparent)` : "color-mix(in srgb, var(--gold-border) 14%, transparent)"}`,
        background: hovered
          ? `color-mix(in srgb, ${GOLD} 4%, var(--bg-primary))`
          : "color-mix(in srgb, var(--bg-secondary) 35%, var(--bg-primary))",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 600,
            color: WHITE, margin: 0,
          }}>
            {name}
          </h3>
          <span style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
            color: GOLD, padding: "3px 9px",
            border: `1px solid color-mix(in srgb, ${GOLD} 30%, transparent)`,
            borderRadius: 4,
          }}>
            {status}
          </span>
        </div>
        <p style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: "clamp(13px, 1.5vw, 16px)",
          color: SILVER, margin: 0, lineHeight: 1.7, maxWidth: 520,
        }}>
          {tagline}
        </p>
      </div>

      <button
        style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 12, letterSpacing: "0.12em",
          padding: "10px 22px", borderRadius: 7,
          border: `1px solid color-mix(in srgb, ${GOLD} ${hovered ? "60%" : "35%"}, transparent)`,
          background: hovered ? `color-mix(in srgb, ${GOLD} 12%, transparent)` : "transparent",
          color: GOLD, cursor: "pointer",
          transition: "all 0.25s ease", flexShrink: 0,
        }}
      >
        Explore →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — PRINCIPLES
// ─────────────────────────────────────────────────────────────────────────────
const PRINCIPLES = [
  "Stay Curious.",
  "Think Independently.",
  "Build In Public.",
  "Learn Relentlessly.",
  "Question Assumptions.",
  "Play The Long Game.",
];

function PrinciplesSection() {
  return (
    <Section id="principles" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>06 — Principles</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.2,
        }}>
          Principles
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            style={{
              padding: "22px 0",
              borderBottom: i < PRINCIPLES.length - 1
                ? "1px solid color-mix(in srgb, var(--gold-border) 12%, transparent)"
                : "none",
            }}
          >
            <p style={{
              fontFamily: "var(--font-cinzel), Cinzel, serif",
              fontSize: "clamp(22px, 3.5vw, 40px)", fontWeight: 400,
              color: WHITE, margin: 0,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = GOLD; }}
              onMouseLeave={e => { e.currentTarget.style.color = WHITE; }}
            >
              {p}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — CONNECT
// ─────────────────────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/",   note: "Code & experiments" },
  { label: "LinkedIn", href: "https://linkedin.com/", note: "Professional context" },
  { label: "X",        href: "https://x.com/",        note: "Thoughts in the open" },
  { label: "Email",    href: "mailto:hello@mvsingh.in", note: "The slow channel" },
];

function ConnectSection() {
  return (
    <Section id="connect" style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)" }}>
      <Reveal>
        <Eyebrow>07 — Connect</Eyebrow>
        <h2 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(22px, 3.5vw, 40px)", fontWeight: 600,
          color: WHITE, margin: 0, lineHeight: 1.35, maxWidth: 560,
        }}>
          If any of these ideas resonate with you, let&apos;s connect.
        </h2>
        <GoldLine />
      </Reveal>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16, marginTop: 56,
      }}>
        {SOCIALS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <SocialCard {...s} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SocialCard({ label, href, note }: { label: string; href: string; note: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        padding: "24px 22px",
        borderRadius: 12,
        border: `1px solid ${hovered ? `color-mix(in srgb, ${GOLD} 32%, transparent)` : "color-mix(in srgb, var(--gold-border) 14%, transparent)"}`,
        background: hovered
          ? `color-mix(in srgb, ${GOLD} 4%, var(--bg-primary))`
          : "var(--bg-primary)",
        textDecoration: "none",
        transition: "all 0.28s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <h3 style={{
        fontFamily: "var(--font-cinzel), Cinzel, serif",
        fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 600,
        color: hovered ? GOLD : WHITE,
        margin: "0 0 8px",
        transition: "color 0.28s",
      }}>
        {label}
      </h3>
      <p style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.5,
      }}>
        {note}
      </p>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <HubPageLayout>
      <HeroSection />
      <WorldSection />
      <CoordinatesSection />
      <JourneySection />
      <GardenSection />
      <BuildingSection />
      <PrinciplesSection />
      <ConnectSection />

      {/* Bottom breathing room */}
      <div style={{ height: 60 }} />
    </HubPageLayout>
  );
}
