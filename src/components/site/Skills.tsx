import { SectionHeader } from "./SectionHeader";

const groups = [
  {
    cluster: "Foundation",
    title: "Backend & Languages",
    items: ["Node.js", "TypeScript", "NestJS", "Express.js", "Python", "Django", "Flask", "FastAPI"],
  },
  {
    cluster: "Foundation",
    title: "Data & Storage",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Redis", "Vector DBs", "Event Sourcing", "CQRS"],
  },
  {
    cluster: "Infrastructure",
    title: "Distributed Systems",
    items: ["Kafka", "RabbitMQ", "BullMQ", "WebSockets", "gRPC", "Docker", "Kubernetes", "AWS ECS"],
  },
  {
    cluster: "Infrastructure",
    title: "Observability & DevOps",
    items: ["AWS S3", "GitHub Actions", "ELK", "Prometheus", "Grafana", "OpenSearch", "Nginx"],
  },
  {
    cluster: "Interface",
    title: "Frontend",
    items: ["React.js", "Next.js", "Angular", "Framer Motion", "Tailwind CSS", "Highcharts"],
  },
  {
    cluster: "Interface",
    title: "AI & Security",
    items: ["OpenAI", "LLaMA", "ElevenLabs", "AES-256", "RSA", "RBAC", "OAuth", "JWT"],
  },
];

const clusters = ["Foundation", "Infrastructure", "Interface"] as const;

export const Skills = () => (
  <section id="skills" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader
        eyebrow="05 — The Arsenal"
        title="The stack I reach for."
        description="Tools are means to an end. These are the ones I trust to ship serious systems."
      />

      {clusters.map((cluster) => (
        <div key={cluster} className="mt-10 first:mt-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-editorial italic text-sm text-muted-foreground/50">{cluster}</span>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {groups.filter((g) => g.cluster === cluster).map((g) => (
              <div key={g.title} data-reveal="zoom" className="card-premium p-7">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-semibold text-foreground">{g.title}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{g.items.length} tools</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="group cursor-default rounded-full border border-border/70 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
