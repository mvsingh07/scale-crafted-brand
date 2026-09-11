"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Users, TrendingUp, Code2, Zap } from "lucide-react";
import type { EcosystemProject, ProjectStatus } from "@/lib/supabase";

const GOLD   = "var(--gold-primary)";
const GOLD_L = "var(--gold-highlight)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active:    { label: "Active",    color: "rgba(52,211,153,0.85)", bg: "rgba(52,211,153,0.08)" },
  completed: { label: "Completed", color: "rgba(201,165,90,0.85)", bg: "rgba(201,165,90,0.08)" },
  paused:    { label: "Paused",    color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.05)" },
};

const SEEKING_ICONS: Record<string, React.ElementType> = {
  contributions: Code2,
  investors: TrendingUp,
  sharing: Users,
};

export function ProjectCard({ project: p }: { project: EcosystemProject; index?: number }) {
  const [expanded, setExpanded] = useState(false);
  const status = PROJECT_STATUS_CONFIG[p.status];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
      style={{
        border: "1px solid color-mix(in srgb, var(--gold-border) 25%, transparent)",
        borderRadius: 16,
        background: "color-mix(in srgb, var(--gold-primary) 3%, var(--bg-primary))",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "20px 20px 16px", cursor: "pointer" }} onClick={() => setExpanded(e => !e)}>
        {/* Row 1: status badge + tags | buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: status.bg, borderRadius: 6, padding: "3px 10px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.1em", color: status.color, flexShrink: 0 }}>
              {status.label}
            </span>
            {p.stack_tags.slice(0, 4).map(tag => (
              <span key={tag} style={{ background: "color-mix(in srgb, var(--text-primary) 4%, transparent)", border: "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)", borderRadius: 6, padding: "2px 8px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, color: MUTED }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, borderRadius: 8, padding: "7px 13px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--bg-primary)", textDecoration: "none" }}>
                <ExternalLink size={12} />Live
              </a>
            )}
            {p.code_url && (
              <a href={p.code_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)", borderRadius: 8, padding: "7px 13px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: SILVER, textDecoration: "none" }}>
                <Github size={12} />Code
              </a>
            )}
          </div>
        </div>

        {/* Row 2: cover image | title + tagline — always side-by-side */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {p.cover_image_url && (
            <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", background: "color-mix(in srgb, var(--text-primary) 4%, transparent)", flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.cover_image_url} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 600, color: WHITE, margin: "0 0 6px" }}>
              {p.title}
            </h3>
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: SILVER, margin: 0, lineHeight: 1.6 }}>
              {p.tagline}
            </p>
          </div>
        </div>
        {p.description && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
            <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: MUTED, letterSpacing: "0.06em" }}>
              {expanded ? "Show less" : "Read more"}
            </span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ lineHeight: 1, color: MUTED, fontSize: 12 }}>↓</motion.span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && p.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "20px 24px 28px", borderTop: "1px solid color-mix(in srgb, var(--gold-border) 15%, transparent)" }}>
              <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, lineHeight: 1.8, color: SILVER, margin: "0 0 20px", maxWidth: 700 }}>
                {p.description}
              </p>
              {p.seeking.length > 0 && (
                <div>
                  <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 10 }}>
                    Open to
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {p.seeking.map(s => {
                      const Icon = SEEKING_ICONS[s.toLowerCase()] ?? Zap;
                      return (
                        <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, background: `color-mix(in srgb, ${GOLD} 8%, transparent)`, border: `1px solid color-mix(in srgb, var(--gold-border) 30%, transparent)`, borderRadius: 8, padding: "6px 12px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: GOLD }}>
                          <Icon size={11} />{s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
