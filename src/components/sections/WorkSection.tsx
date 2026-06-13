"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Users, TrendingUp, Code2, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { EcosystemProject, ProjectStatus } from "@/lib/supabase";

const GOLD   = "var(--gold-primary)";
const GOLD_L = "var(--gold-highlight)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  active:    { label: "Active",    color: "rgba(52,211,153,0.85)", bg: "rgba(52,211,153,0.08)" },
  completed: { label: "Completed", color: "rgba(201,165,90,0.85)", bg: "rgba(201,165,90,0.08)" },
  paused:    { label: "Paused",    color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.05)" },
};

const SEEKING_ICONS: Record<string, React.ElementType> = {
  contributions: Code2,
  investors: TrendingUp,
  sharing: Users,
};

export function WorkSection() {
  const [projects, setProjects] = useState<EcosystemProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ecosystem_projects")
      .select("*")
      .eq("username", OWNER)
      .eq("is_public", true)
      .order("ord", { ascending: true })
      .then(({ data }) => {
        setProjects((data as EcosystemProject[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: 64 }}
      >
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
          03 — Active Work
        </p>
        <h2 style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0 }}>
          What I&apos; have build.
        </h2>
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, maxWidth: 560, lineHeight: 1.7, margin: "16px 0 0" }}>
          Kind of projects that I&apos; have built — open to the right collaborators, whether that&apos;s technical help, investment, or amplification.
        </p>
        <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
      </motion.div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: "center", padding: "80px 0", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13, color: MUTED }}
        >
          <Zap size={28} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
          Projects loading soon.
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}

function ProjectCard({ project: p }: { project: EcosystemProject; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[p.status];

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
      <div style={{ padding: "28px 32px 24px", cursor: "pointer" }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ background: status.bg, borderRadius: 6, padding: "3px 10px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.1em", color: status.color }}>
                {status.label}
              </span>
              {p.stack_tags.slice(0, 4).map(tag => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "2px 8px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, color: MUTED }}>
                  {tag}
                </span>
              ))}
            </div>
            <h3 style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 600, color: WHITE, margin: "0 0 8px" }}>
              {p.title}
            </h3>
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: SILVER, margin: 0, lineHeight: 1.6 }}>
              {p.tagline}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--bg-primary)", textDecoration: "none" }}>
                <ExternalLink size={12} />Live
              </a>
            )}
            {p.code_url && (
              <a href={p.code_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: SILVER, textDecoration: "none" }}>
                <Github size={12} />Code
              </a>
            )}
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
            <div style={{ padding: "20px 32px 28px", borderTop: "1px solid color-mix(in srgb, var(--gold-border) 15%, transparent)" }}>
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
