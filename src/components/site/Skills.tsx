import { SectionHeader } from "./SectionHeader";

const groups = [
  {
    title: "Distributed Systems",
    items: ["Kafka", "RabbitMQ", "Redis", "BullMQ", "WebSockets", "gRPC", "Event Sourcing", "CQRS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "TypeScript", "NestJS", "Express.js", "Python", "Django", "Flask", "FastAPI"],
  },
  {
    title: "Frontend & Data",
    items: ["React.js", "Next.js", "Angular", "PostgreSQL", "MongoDB", "MySQL", "Supabase", "Highcharts"],
  },
  {
    title: "DevOps & Infra",
    items: ["Docker", "Kubernetes", "AWS S3", "AWS ECS", "GitHub Actions", "ELK", "Prometheus", "Grafana"],
  },
  {
    title: "Security & AI",
    items: ["AES-256", "RSA", "RBAC", "OAuth", "JWT", "OpenAI", "LLaMA", "Vector DBs"],
  },
];

export const Skills = () => (
  <section id="skills" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader
        eyebrow="05 — Toolkit"
        title="The stack I reach for."
        description="Tools are means to an end. These are the ones I trust to ship serious systems."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {groups.map((g) => (
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
  </section>
);
