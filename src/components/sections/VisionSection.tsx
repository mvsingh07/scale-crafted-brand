"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { VisionaryProject, VisionProjectModule, VisionModuleDivision } from "@/lib/supabase";

const GOLD   = "var(--gold-primary)";
const GOLD_L = "var(--gold-highlight)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

type ModuleWithDivisions = VisionProjectModule & { divisions: VisionModuleDivision[] };
type ProjectWithModules = VisionaryProject & { modules: ModuleWithDivisions[] };

export function VisionSection() {
  const [projects, setProjects] = useState<ProjectWithModules[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: projs } = await supabase
        .from("visionary_projects")
        .select("*")
        .eq("username", OWNER)
        .eq("is_public", true)
        .order("ord", { ascending: true });

      if (!projs?.length) { setLoading(false); return; }

      const projectIds = projs.map(p => p.id);
      const { data: mods } = await supabase
        .from("vision_project_modules")
        .select("*")
        .in("project_id", projectIds)
        .order("ord", { ascending: true });

      const allMods = mods ?? [];
      const moduleIds = allMods.map(m => m.id);

      const { data: divs } = moduleIds.length
        ? await supabase
            .from("vision_module_divisions")
            .select("*")
            .in("module_id", moduleIds)
            .order("ord", { ascending: true })
        : { data: [] };

      const divsByModule = (divs ?? []).reduce<Record<string, VisionModuleDivision[]>>((acc, d) => {
        (acc[d.module_id] ??= []).push(d);
        return acc;
      }, {});

      const modsByProject = allMods.reduce<Record<string, ModuleWithDivisions[]>>((acc, m) => {
        (acc[m.project_id] ??= []).push({ ...m, divisions: divsByModule[m.id] ?? [] });
        return acc;
      }, {});

      setProjects(projs.map(p => ({ ...p, modules: modsByProject[p.id] ?? [] })));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ marginBottom: 72 }}
      >
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
          02 — The Vision
        </p>
        <h2 style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0 }}>
          What I&apos;m building<br />toward.
        </h2>
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0", maxWidth: 520 }}>
          These projects are where I am putting my heart and soul into — ambitious, long-term visions that I hope to bring to life in the coming years. They are all in early stages, and I&apos;m open to the right collaborators who share the passion for these problems, whether that&apos;s technical help, investment, or amplification.
        </p>
        <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
      </motion.div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
        </div>
      ) : projects.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: MUTED, textAlign: "center", paddingTop: 80 }}
        >
          Coming soon.
        </motion.p>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
          style={{ display: "flex", flexDirection: "column", gap: 48 }}
        >
          {projects.map(p => <VisionCard key={p.id} project={p} />)}
        </motion.div>
      )}
    </div>
  );
}

function VisionCard({ project: p }: { project: ProjectWithModules }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: 16, cursor: p.description ? "pointer" : "default",
          paddingBottom: 24,
          borderBottom: "1px solid color-mix(in srgb, var(--gold-border) 22%, transparent)",
        }}
        onClick={() => p.description && setExpanded(e => !e)}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 600, color: WHITE, margin: "0 0 6px", lineHeight: 1.2 }}>
            {p.title}
          </h3>
          {p.subtitle && (
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(13px, 1.4vw, 15px)", color: GOLD, margin: 0, letterSpacing: "0.06em" }}>
              {p.subtitle}
            </p>
          )}
          {p.description && (
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(13px, 1.5vw, 16px)", color: SILVER, lineHeight: 1.75, margin: "14px 0 0", maxWidth: 680, overflow: "hidden" }}
                >
                  {p.description}
                </motion.p>
              )}
            </AnimatePresence>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, paddingTop: 4 }}>
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--bg-primary)", textDecoration: "none" }}>
              <ExternalLink size={12} />Visit
            </a>
          )}
          {p.description && (
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.22 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </motion.div>
          )}
        </div>
      </div>

      {p.modules.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>
            The Journey
          </p>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 7, top: 12, bottom: 12, width: 1, background: `linear-gradient(to bottom, ${GOLD}, color-mix(in srgb, ${GOLD} 10%, transparent))` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {p.modules.map((m, i) => <ModuleRow key={m.id} module={m} index={i} total={p.modules.length} />)}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ModuleRow({ module: m, index: i, total }: { module: ModuleWithDivisions; index: number; total: number }) {
  const [open, setOpen] = useState(false);
  const isLast = i === total - 1;
  const hasDivisions = m.divisions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
      style={{ display: "flex", alignItems: "flex-start", gap: 24, paddingBottom: isLast ? 0 : 36 }}
    >
      <div style={{ width: 15, height: 15, borderRadius: "50%", flexShrink: 0, marginTop: 4, border: `2px solid ${GOLD}`, background: isLast ? GOLD : "var(--bg-primary)", boxShadow: isLast ? `0 0 10px ${GOLD}` : "none", position: "relative", zIndex: 1 }} />
      <div style={{ flex: 1 }}>
        {/* Module header */}
        <div
          style={{ cursor: (m.description || hasDivisions) ? "pointer" : "default", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}
          onClick={() => (m.description || hasDivisions) && setOpen(o => !o)}
        >
          <div>
            <p style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(16px, 1.9vw, 21px)", fontWeight: 600, color: isLast ? GOLD : WHITE, margin: "0 0 4px" }}>
              {m.title}
            </p>
            {m.subtitle && (
              <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(12px, 1.3vw, 14px)", color: MUTED, margin: 0, lineHeight: 1.6 }}>
                {m.subtitle}
              </p>
            )}
          </div>
          {(m.description || hasDivisions) && (
            <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0, marginTop: 3 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.div>
          )}
        </div>

        {/* Module description + divisions */}
        <AnimatePresence>
          {open && (m.description || hasDivisions) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              {m.description && (
                <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(13px, 1.4vw, 15px)", color: SILVER, lineHeight: 1.75, margin: "10px 0 0", maxWidth: 520 }}>
                  {m.description}
                </p>
              )}

              {hasDivisions && (
                <div style={{ marginTop: 16, paddingLeft: 12, borderLeft: `1px solid color-mix(in srgb, ${GOLD} 20%, transparent)` }}>
                  {m.divisions.map((d, di) => (
                    <DivisionItem key={d.id} division={d} index={di} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DivisionItem({ division: d, index: di }: { division: VisionModuleDivision; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: di * 0.07, ease: EASE }}
      style={{ paddingBottom: 14 }}
    >
      <div
        style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: d.description ? "pointer" : "default" }}
        onClick={() => d.description && setOpen(o => !o)}
      >
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, opacity: 0.55, flexShrink: 0, marginTop: 7 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 600, color: WHITE, margin: 0, lineHeight: 1.3 }}>
              {d.title}
            </p>
            {d.description && (
              <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }} style={{ lineHeight: 1 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.span>
            )}
          </div>
          {d.subtitle && (
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(11px, 1.2vw, 13px)", color: MUTED, margin: "2px 0 0", lineHeight: 1.5 }}>
              {d.subtitle}
            </p>
          )}
          <AnimatePresence>
            {open && d.description && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(12px, 1.3vw, 14px)", color: SILVER, lineHeight: 1.7, margin: "6px 0 0", maxWidth: 460, overflow: "hidden" }}
              >
                {d.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
