"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { EcosystemProject } from "@/lib/supabase";
import { ProjectCard } from "@/components/sections/shared/ProjectCard";

const GOLD   = "var(--gold-primary)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

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
          What I&apos; am building.
        </h2>
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, maxWidth: 560, lineHeight: 1.7, margin: "16px 0 0" }}>
          Projects that I&apos; am building — out of current interests and opportunities.
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
