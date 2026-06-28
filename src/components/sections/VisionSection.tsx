"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { VisionaryProject, VisionProjectModule, VisionModuleDivision } from "@/lib/supabase";
import { DivineAura } from "./vision/DivineAura";
import { Mandala } from "./vision/SacredGeometry";

const GOLD   = "var(--gold-primary)";
const GOLD_L = "var(--gold-highlight)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

const SHIMMER = "linear-gradient(100deg, #E0C27A 0%, #FBF0CE 22%, #C9A55A 48%, #FBF0CE 74%, #E0C27A 100%)";

type ModuleWithDivisions = VisionProjectModule & { divisions: VisionModuleDivision[] };
type ProjectWithModules = VisionaryProject & { modules: ModuleWithDivisions[] };

export function VisionSection() {
  const [projects, setProjects] = useState<ProjectWithModules[]>([]);
  const [loading, setLoading] = useState(true);
  const reduce = useReducedMotion() ?? false;

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
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* ---- Divine backdrop ---- */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* God-ray radial glows */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 42% at 50% 0%, color-mix(in srgb, var(--gold-primary) 12%, transparent), transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(40% 30% at 80% 30%, color-mix(in srgb, var(--gold-highlight) 7%, transparent), transparent 70%)" }} />
        <DivineAura />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "100px 32px 72px" }}>
        {/* ---- Mandala crest (lightened; text rises into its lower-middle) ---- */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 0, filter: "drop-shadow(0 0 24px color-mix(in srgb, var(--gold-primary) 14%, transparent))" }}
        >
          <Mandala size={620} speed={0.6} reduce={reduce} style={{ width: "min(620px, 78vw)", height: "auto" }} />
        </motion.div>

        {/* ---- Header (pulled up to overlap the mandala) ---- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ marginTop: "calc(-1 * min(260px, 33vw))", marginBottom: 88, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}
        >
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, letterSpacing: "0.34em", textTransform: "uppercase", color: GOLD, marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 22, height: 1, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
            02 — The Digital Gurukul
            <span style={{ width: 22, height: 1, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </p>

          {/* Sanskrit shloka */}
          <p style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: "clamp(18px, 2.6vw, 26px)", color: GOLD_L, margin: "0 0 6px", letterSpacing: "0.04em" }}>
            विद्या ददाति विनयम्
          </p>
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, fontStyle: "italic", letterSpacing: "0.08em", color: MUTED, margin: "0 0 28px" }}>
            “Knowledge bestows humility.”
          </p>

          <h2
            className="animate-shimmer"
            style={{
              fontFamily: "var(--font-cinzel), Cinzel, serif",
              fontSize: "clamp(34px, 5.4vw, 60px)",
              fontWeight: 600,
              lineHeight: 1.12,
              margin: 0,
              backgroundImage: SHIMMER,
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            What I&apos;m building<br />toward.
          </h2>

          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.8, margin: "22px auto 0", maxWidth: 600 }}>
            A digital gurukul — where ideas are tended like sacred fire. These are the visions I am
            pouring heart and soul into: ambitious, long-horizon work, still in early dawn. I am open to
            the right fellow travellers who share the devotion — through craft, capital, or amplification.
          </p>

          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, boxShadow: `0 0 8px ${GOLD}` }} />
            <span style={{ width: 60, height: 1, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </div>
        </motion.div>

        {/* ---- Body ---- */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}>
            <Mandala size={64} reduce={reduce} />
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
            variants={{ visible: { transition: { staggerChildren: 0.16 } } }}
            style={{ display: "flex", flexDirection: "column", gap: 56 }}
          >
            {projects.map((p, i) => <VisionCard key={p.id} project={p} reduce={reduce} index={i} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function VisionCard({ project: p, reduce, index }: { project: ProjectWithModules; reduce: boolean; index: number }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        position: "relative",
        borderRadius: 22,
        padding: "clamp(24px, 3.4vw, 40px)",
        background: "linear-gradient(180deg, color-mix(in srgb, var(--gold-primary) 5%, transparent) 0%, color-mix(in srgb, var(--bg-primary) 70%, transparent) 100%)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid color-mix(in srgb, var(--gold-border) 26%, transparent)",
        boxShadow: "0 24px 70px -42px rgba(0,0,0,0.9), inset 0 1px 0 color-mix(in srgb, var(--gold-highlight) 14%, transparent)",
        overflow: "hidden",
      }}
    >
      {/* Corner seal */}
      <div aria-hidden style={{ position: "absolute", top: -54, right: -54, opacity: 0.16, pointerEvents: "none" }}>
        <Mandala size={200} speed={0.8} reduce={reduce} />
      </div>
      {/* Top hairline glow */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`, opacity: 0.6 }} />

      <div
        style={{
          position: "relative",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: 16, cursor: p.description ? "pointer" : "default",
          paddingBottom: 24,
          borderBottom: "1px solid color-mix(in srgb, var(--gold-border) 22%, transparent)",
        }}
        onClick={() => p.description && setExpanded(e => !e)}
      >
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.3em", color: MUTED, margin: "0 0 10px" }}>
            {String(index + 1).padStart(2, "0")}
          </p>
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
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(13px, 1.5vw, 16px)", color: SILVER, lineHeight: 1.8, margin: "14px 0 0", maxWidth: 680, overflow: "hidden" }}
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
              style={{ display: "flex", alignItems: "center", gap: 6, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, fontWeight: 600, color: "var(--bg-primary)", textDecoration: "none", boxShadow: `0 0 18px -4px ${GOLD}` }}>
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
        <div style={{ position: "relative", marginTop: 34 }}>
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden>✦</span> The Path of Becoming
          </p>
          <div style={{ position: "relative" }}>
            {/* Base track */}
            <div style={{ position: "absolute", left: 8, top: 12, bottom: 12, width: 1, background: "color-mix(in srgb, var(--gold-border) 22%, transparent)" }} />
            {/* Animated luminous fill */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, ease: EASE }}
              style={{ position: "absolute", left: 8, top: 12, bottom: 12, width: 1, transformOrigin: "top", background: `linear-gradient(to bottom, ${GOLD_L}, ${GOLD}, color-mix(in srgb, ${GOLD} 8%, transparent))`, boxShadow: `0 0 8px ${GOLD}` }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {p.modules.map((m, i) => <ModuleRow key={m.id} module={m} index={i} total={p.modules.length} reduce={reduce} />)}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function ModuleRow({ module: m, index: i, total, reduce }: { module: ModuleWithDivisions; index: number; total: number; reduce: boolean }) {
  const [open, setOpen] = useState(false);
  const isLast = i === total - 1;
  const hasDivisions = m.divisions.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
      style={{ display: "flex", alignItems: "flex-start", gap: 24, paddingBottom: isLast ? 0 : 38 }}
    >
      {/* Diya node */}
      <div style={{ position: "relative", width: 17, height: 17, flexShrink: 0, marginTop: 3, zIndex: 1 }}>
        {!reduce && (
          <motion.div
            animate={{ opacity: [0.35, 0.85, 0.35], scale: [1, 1.7, 1] }}
            transition={{ duration: isLast ? 2.2 : 3.2, ease: "easeInOut", repeat: Infinity, delay: i * 0.3 }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", background: GOLD, filter: "blur(5px)" }}
          />
        )}
        <div style={{ position: "relative", width: 15, height: 15, margin: "1px", borderRadius: "50%", border: `2px solid ${GOLD}`, background: isLast ? GOLD : "var(--bg-primary)", boxShadow: isLast ? `0 0 12px ${GOLD}` : `0 0 6px color-mix(in srgb, ${GOLD} 50%, transparent)` }} />
      </div>

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
                <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(13px, 1.4vw, 15px)", color: SILVER, lineHeight: 1.8, margin: "10px 0 0", maxWidth: 520 }}>
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
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, opacity: 0.55, flexShrink: 0, marginTop: 7, boxShadow: `0 0 5px color-mix(in srgb, ${GOLD} 60%, transparent)` }} />
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
