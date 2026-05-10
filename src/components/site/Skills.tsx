import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import type { SkillGroup } from "@/lib/supabase";

const DEFAULT_GROUPS: SkillGroup[] = [
  { id: "1", profile_id: "", cluster: "Foundation", title: "Backend & Languages", items: ["Node.js", "TypeScript", "NestJS", "Express.js", "Python", "Django", "Flask", "FastAPI"], ord: 0 },
  { id: "2", profile_id: "", cluster: "Foundation", title: "Data & Storage", items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Redis", "Vector DBs", "Event Sourcing", "CQRS"], ord: 1 },
  { id: "3", profile_id: "", cluster: "Infrastructure", title: "Distributed Systems", items: ["Kafka", "RabbitMQ", "BullMQ", "WebSockets", "gRPC", "Docker", "Kubernetes", "AWS ECS"], ord: 2 },
  { id: "4", profile_id: "", cluster: "Infrastructure", title: "Observability & DevOps", items: ["AWS S3", "GitHub Actions", "ELK", "Prometheus", "Grafana", "OpenSearch", "Nginx"], ord: 3 },
  { id: "5", profile_id: "", cluster: "Interface", title: "Frontend", items: ["React.js", "Next.js", "Angular", "Framer Motion", "Tailwind CSS", "Highcharts"], ord: 4 },
  { id: "6", profile_id: "", cluster: "Interface", title: "AI & Security", items: ["OpenAI", "LLaMA", "ElevenLabs", "AES-256", "RSA", "RBAC", "OAuth", "JWT"], ord: 5 },
];

interface SkillsProps {
  skillGroups?: SkillGroup[];
}

export const Skills = ({ skillGroups }: SkillsProps = {}) => {
  const groups = skillGroups && skillGroups.length > 0 ? skillGroups : DEFAULT_GROUPS;
  const clusters = [...new Set(groups.map((g) => g.cluster))];

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="container">
        <SectionHeader
          eyebrow="05 — The Arsenal"
          title="The stack I reach for."
          description="Tools are means to an end. These are the ones I trust to ship serious systems."
        />

        {clusters.map((cluster) => {
          const clusterGroups = groups.filter((g) => g.cluster === cluster);
          return (
            <div key={cluster} className="mt-10 first:mt-14">
              <motion.div
                className="mb-4 flex items-center gap-3"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-editorial italic text-sm text-muted-foreground/50">{cluster}</span>
                <div className="h-px flex-1 bg-border/40" />
              </motion.div>
              <div className="grid gap-5 md:grid-cols-2">
                {clusterGroups.map((g, cardIdx) => (
                  <motion.div
                    key={g.id}
                    className="card-premium p-7"
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: cardIdx * 0.1 }}
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-xl font-semibold text-foreground">{g.title}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{g.items.length} tools</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {g.items.map((it, tagIdx) => (
                        <motion.span
                          key={it}
                          className="group cursor-default rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          viewport={{ once: true, margin: "-8%" }}
                          transition={{ duration: 0.35, delay: tagIdx * 0.03 + cardIdx * 0.1 }}
                        >
                          {it}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
