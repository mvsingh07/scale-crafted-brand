"use client";

import { motion } from "motion/react";
import {
  FileWarning, Globe2, FolderKanban, ClipboardList, Users, ReceiptText,
  Repeat, WifiOff, SearchX, TrendingUp, ChevronRight,
  Store, Monitor, Search, Share2, CreditCard, Bot, Network,
} from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, GOLD, MUTED, WHITE, SILVER, FONT_B, EASE } from "./shared";

const PROBLEMS = [
  { icon: WifiOff,       label: "Dependence on offline processes" },
  { icon: Globe2,        label: "Poor or outdated digital presence" },
  { icon: FolderKanban,  label: "Scattered information across tools" },
  { icon: ClipboardList, label: "Manual record keeping" },
  { icon: Users,         label: "Unorganized customer data" },
  { icon: ReceiptText,   label: "Poor transaction visibility" },
  { icon: Repeat,        label: "Repetitive work, every day" },
  { icon: FileWarning,   label: "Little to no automation" },
  { icon: SearchX,       label: "Weak online discoverability" },
  { icon: TrendingUp,    label: "Growing competition from online-first businesses" },
];

// How customers actually find and evaluate a business today — and where
// that path is heading next. Hedged deliberately ("Agents" is framed as a
// direction, not a claim, in the surrounding copy) — never state the AI-agent
// step as an arrived fact.
const PROGRESSION = [
  { icon: Store,       label: "Storefront" },
  { icon: Monitor,     label: "Website" },
  { icon: Search,      label: "Search" },
  { icon: Share2,      label: "Social" },
  { icon: CreditCard,  label: "Digital Payments" },
  { icon: Bot,         label: "AI" },
  { icon: Network,     label: "Agents" },
];

export function StudioProblem() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 44, maxWidth: 680 }}>
        <ChapterEyebrow n="02">The Problem</ChapterEyebrow>
        <SectionHeading>Most small and medium businesses aren&apos;t losing to bad products. They&apos;re losing to bad systems.</SectionHeading>
      </Reveal>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))" }}
      >
        {PROBLEMS.map(({ icon: Icon, label }) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
            whileHover={{ y: -4, borderColor: `color-mix(in srgb, ${GOLD} 40%, transparent)`, background: "color-mix(in srgb, var(--text-primary) 5%, transparent)" }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)", borderRadius: 12,
              background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
            }}
          >
            <Icon size={16} style={{ color: GOLD, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT_B, fontSize: 13.5, color: SILVER }}>{label}</span>
          </motion.div>
        ))}
      </motion.div>

      <Reveal delay={0.1} style={{ marginTop: 64, maxWidth: 760 }}>
        <ChapterEyebrow n="03">The Shift</ChapterEyebrow>
        <SectionHeading>The world our customers live in is changing.</SectionHeading>
      </Reveal>

      <Reveal delay={0.15} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 24, maxWidth: 820 }}>
        {PROGRESSION.map((p, i) => (
          <span key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <motion.span
              whileHover={{ y: -3, scale: 1.05, borderColor: `color-mix(in srgb, ${GOLD} 45%, transparent)` }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "7px 12px", borderRadius: 100,
                border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                fontFamily: FONT_B, fontSize: 12.5, color: SILVER,
              }}>
              <p.icon size={13} style={{ color: GOLD }} /> {p.label}
            </motion.span>
            {i < PROGRESSION.length - 1 && <ChevronRight size={13} style={{ color: MUTED }} />}
          </span>
        ))}
      </Reveal>

      <Reveal delay={0.2} style={{
        marginTop: 28, padding: "26px clamp(20px, 4vw, 28px)", maxWidth: 760,
        border: "1px solid color-mix(in srgb, var(--gold-border) 25%, transparent)",
        borderRadius: 16, background: "color-mix(in srgb, var(--gold-primary) 3%, var(--bg-primary))",
      }}>
        <p style={{ fontFamily: FONT_B, fontSize: 14.5, lineHeight: 1.85, color: SILVER, margin: 0 }}>
          Customers increasingly discover and evaluate a business online before they ever
          interact with it physically. A strong storefront still matters — but its digital
          representation is becoming part of the business itself. AI is not only about
          chatbots, either: it becomes genuinely useful only once the business underneath it
          is digitally organized — structured data, working digital systems, automation, a
          real online presence, and information that can actually be searched.{" "}
          <span style={{ color: WHITE }}>Build the foundation first, and AI has something to work with.</span>
        </p>
      </Reveal>
    </div>
  );
}
