import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import type { CareerStep, StoryMode } from "@/lib/supabase";

const DEFAULT_STEPS: CareerStep[] = [
  { id: "1", profile_id: "", chapter: "Chapter I", year: "2020-2023", role: "BCA, Computer Applications", org: "Guru Nanak Dev University", body: "Built the engineering foundation across programming, databases, and full-stack web development before moving into production software roles.", story_details: [], ord: 0 },
  { id: "2", profile_id: "", chapter: "Chapter II", year: "2023-2025", role: "Software Engineer", org: "Turtleneck Systems & Solutions", body: "Built JavaScript and Python web applications, secure REST APIs, dashboards, NiFi data pipelines, Docker/Kubernetes deployments, and ELK/OpenSearch monitoring.", story_details: [], ord: 1 },
  { id: "3", profile_id: "", chapter: "Chapter III", year: "2024-2026", role: "MCA, AI & ML", org: "Chandigarh University", body: "Continuing formal work in AI and ML while applying LLMs, vector databases, and voice AI systems in product-facing projects.", story_details: [], ord: 2 },
  { id: "4", profile_id: "", chapter: "Chapter IV", year: "2025-Present", role: "Senior Software Engineer", org: "Vusic Technologies", body: "Leading 2-3 engineers, owning architecture for real-time auction and secure file systems, deploying on AWS ECS/Kubernetes, and aligning delivery with client milestones.", story_details: [], ord: 3 },
];

interface JourneyProps {
  steps?: CareerStep[];
  storyMode?: StoryMode | null;
}

export const Journey = ({ steps, storyMode = "brief" }: JourneyProps = {}) => {
  const items = steps && steps.length > 0 ? steps : DEFAULT_STEPS;
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section id="journey" className="relative py-24 md:py-32">
      <div className="container">
        <SectionHeader
          eyebrow="04 — The Story"
          title="From writing code to designing systems."
          description="Not a job list — the actual progression of how I think about software."
        />

        <div className="relative mt-16">
          <motion.div
            className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            style={{ originY: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          <div className="space-y-12">
            {items.map((s, i) => {
              const hasDetails = storyMode === "detailed" && Array.isArray(s.story_details) && s.story_details.length > 0;
              const isExpanded = expanded.has(s.id);

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                  className={`relative grid gap-6 md:grid-cols-2 md:gap-12 ${
                    i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  <div className={`md:text-right ${i % 2 === 0 ? "" : "md:text-left"}`}>
                    <div className="font-editorial italic text-xs text-muted-foreground/50 mb-0.5">{s.chapter}</div>
                    <div className="font-mono text-sm text-primary">{s.year}</div>
                    <div className="font-display mt-1 text-2xl font-semibold text-gradient">{s.role}</div>
                    <div className="text-sm text-muted-foreground">{s.org}</div>
                  </div>

                  <div className="relative pl-12 md:pl-12">
                    <motion.div
                      className="absolute left-4 top-1.5 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-background ring-2 ring-primary md:left-0 md:-translate-x-1/2"
                      whileHover={{ scale: 1.5, boxShadow: "0 0 0 3px hsl(var(--primary)/0.25)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                    </motion.div>

                    <p className="text-base leading-relaxed text-muted-foreground">{s.body}</p>

                    {hasDetails && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => toggle(s.id)}
                          className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                        >
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <ChevronDown size={11} />
                          </motion.span>
                          {isExpanded ? "Less" : "Read More"}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 space-y-4 rounded-xl border border-border/40 bg-card/30 p-4">
                                {s.story_details.map((section, si) => (
                                  <div key={si}>
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-primary/70 mb-2">
                                      {section.section_name}
                                    </p>
                                    <ul className="space-y-1">
                                      {section.points.map((pt, pi) => (
                                        <li key={pi} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                                          {pt}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
