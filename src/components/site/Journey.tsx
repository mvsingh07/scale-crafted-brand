import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    chapter: "Chapter I",
    year: "2020-2023",
    role: "BCA, Computer Applications",
    org: "Guru Nanak Dev University",
    body: "Built the engineering foundation across programming, databases, and full-stack web development before moving into production software roles.",
  },
  {
    chapter: "Chapter II",
    year: "2023-2025",
    role: "Software Engineer",
    org: "Turtleneck Systems & Solutions",
    body: "Built JavaScript and Python web applications, secure REST APIs, dashboards, NiFi data pipelines, Docker/Kubernetes deployments, and ELK/OpenSearch monitoring.",
  },
  {
    chapter: "Chapter III",
    year: "2024-2026",
    role: "MCA, AI & ML",
    org: "Chandigarh University",
    body: "Continuing formal work in AI and ML while applying LLMs, vector databases, and voice AI systems in product-facing projects.",
  },
  {
    chapter: "Chapter IV",
    year: "2025-Present",
    role: "Senior Software Engineer",
    org: "Vusic Technologies",
    body: "Leading 2-3 engineers, owning architecture for real-time auction and secure file systems, deploying on AWS ECS/Kubernetes, and aligning delivery with client milestones.",
  },
];

export const Journey = () => (
  <section id="journey" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader
        eyebrow="04 — The Story"
        title="From writing code to designing systems."
        description="Not a job list — the actual progression of how I think about software."
      />

      <div className="relative mt-16">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2" />

        <div className="space-y-12">
          {steps.map((s, i) => (
            <div
              key={s.year}
              data-reveal={i % 2 === 0 ? "fade-right" : "fade-left"}
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
                <div className="absolute left-4 top-1.5 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-background ring-2 ring-primary md:left-0 md:-translate-x-1/2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
