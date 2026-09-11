"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { EcosystemProject } from "@/lib/supabase";
import { ProjectCard } from "@/components/sections/shared/ProjectCard";
import { ChapterEyebrow, SectionHeading, Reveal, MUTED, SILVER, FONT_B } from "./shared";

const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

export function StudioProjects() {
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
    <div id="studio-work" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", scrollMarginTop: 76 }}>
      <Reveal style={{ marginBottom: 44, maxWidth: 620 }}>
        <ChapterEyebrow n="07">Recent Work</ChapterEyebrow>
        <SectionHeading>Real projects, built and shipped.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0" }}>
          Proof of the pipeline above, not a promise — this list grows as new work goes live.
        </p>
      </Reveal>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
          <div
            className="h-6 w-6 animate-spin rounded-full"
            style={{
              borderWidth: 2, borderStyle: "solid",
              borderColor: "color-mix(in srgb, var(--text-primary) 10%, transparent)",
              borderTopColor: "color-mix(in srgb, var(--text-primary) 40%, transparent)",
            }}
          />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", fontFamily: FONT_B, fontSize: 13, color: MUTED }}>
          <Zap size={26} style={{ margin: "0 auto 14px", opacity: 0.2 }} />
          Projects loading soon.
        </div>
      ) : (
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}
