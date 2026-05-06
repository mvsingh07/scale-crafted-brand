import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    year: "2019",
    role: "Software Developer",
    org: "Building the fundamentals",
    body: "Started shipping production code on full-stack web apps. Learned the discipline of clean code, testing, and code review by doing — across React, Node, and SQL.",
  },
  {
    year: "2021",
    role: "Backend Engineer",
    org: "Going deeper into the stack",
    body: "Moved server-side. Owned APIs that real users depended on, picked up Postgres internals, message queues, and the joy (and pain) of debugging production at 2 AM.",
  },
  {
    year: "2023",
    role: "System Engineer",
    org: "Scaling beyond a single box",
    body: "Designed event-driven services on Kafka & Redis, hardened uptime, and started leading small features end-to-end. First real conversations with clients on architecture.",
  },
  {
    year: "2025",
    role: "Senior Software Engineer",
    org: "Architecture mindset",
    body: "Leading 2–3 engineers, owning the architecture for real-time platforms serving 50K+ users, integrating AI into production, and shaping technical roadmaps with stakeholders.",
  },
];

export const Journey = () => (
  <section id="journey" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader
        eyebrow="04 — Journey"
        title="From writing code to designing systems."
        description="Not a job list — the actual progression of how I think about software."
      />

      <div className="relative mt-16">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2" />

        <div className="space-y-12">
          {steps.map((s, i) => (
            <div
              key={s.year}
              className={`relative grid gap-6 md:grid-cols-2 md:gap-12 ${
                i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
              }`}
            >
              <div className={`md:text-right ${i % 2 === 0 ? "" : "md:text-left"}`}>
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
