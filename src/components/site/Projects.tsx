import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const projects = [
  {
    n: "01",
    title: "Real-Time Auction Platform",
    tagline: "Live bidding for 50K+ concurrent users.",
    problem: "Auctions where every millisecond matters — bids must be globally consistent, fair, and instantly reflected for every viewer.",
    solution: "Event-driven core on Kafka and RabbitMQ with Redis-backed bid state, WebSocket fan-out, and idempotent write paths to guarantee correctness under bursty load.",
    impact: "Supported 50K+ concurrent users while reducing end-to-end latency from 500ms to 120ms.",
    stack: ["NestJS", "Kafka", "RabbitMQ", "Redis", "Next.js", "Supabase", "AWS S3"],
    accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]",
    mock: (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Lot #2418 · Live</span>
          <span className="flex items-center gap-1.5 text-xs text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> 12,438 watching
          </span>
        </div>
        <div className="font-display text-3xl font-semibold text-gradient">$48,250</div>
        <div className="space-y-1.5">
          {[{ u: "manvir.s", b: "$48,250", t: "now" }, { u: "luna_42", b: "$47,000", t: "2s" }, { u: "rhys", b: "$45,500", t: "5s" }].map((b) => (
            <div key={b.t} className="flex justify-between rounded-md bg-muted/40 px-3 py-1.5 text-xs">
              <span className="text-muted-foreground">{b.u}</span>
              <span className="font-mono text-foreground">{b.b}</span>
              <span className="text-muted-foreground">{b.t}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: "02",
    title: "File Processing Microservice",
    tagline: "Encrypted streaming for 1GB+ payloads.",
    problem: "Single-shot uploads of large files were failing, blocking memory, and leaking sensitive data on retries.",
    solution: "Chunked, resumable uploads with AES-256 and RSA encryption, BullMQ background jobs, parallel worker processing, RBAC, and signed URL delivery.",
    impact: "Reliable processing of 1GB+ encrypted files with constant memory footprint and secure access controls.",
    stack: ["NestJS", "AES-256", "RSA", "BullMQ", "AWS S3", "RBAC", "Postgres"],
    accent: "from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-pink))]",
    mock: (
      <div className="space-y-4">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Uploading · medical-scan-batch.zip</div>
        <div className="space-y-2">
          {[{ n: "chunk_001", p: 100 }, { n: "chunk_002", p: 100 }, { n: "chunk_003", p: 78 }, { n: "chunk_004", p: 34 }].map((c) => (
            <div key={c.n}>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-muted-foreground">{c.n}</span>
                <span className="text-foreground">{c.p}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted/50">
                <div className="h-full rounded-full bg-gradient-brand transition-all" style={{ width: `${c.p}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-[11px] font-mono text-muted-foreground">
          AES-256-GCM · resumable · parallel x 8
        </div>
      </div>
    ),
  },
  {
    n: "03",
    title: "AI Health Engine",
    tagline: "Voice-first AI for clinical workflows.",
    problem: "Care teams needed instant, contextual answers from health data without typing or navigating dashboards.",
    solution: "RAG pipeline blending LLaMA and OpenAI with Supabase vector search and ElevenLabs voice interaction behind a hardened API.",
    impact: "Reduced query-to-insight time from minutes to seconds with conversational, multi-modal access.",
    stack: ["Python", "LLaMA", "OpenAI", "ElevenLabs", "Supabase", "FastAPI", "Vector DB"],
    accent: "from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-cyan))]",
    mock: (
      <div className="space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">AI Session · voice</div>
        <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          "Summarize the patient's last lab report."
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs text-foreground">
          Hemoglobin trending down 8% over 3 months. Iron levels flagged.
          Recommend follow-up panel within 2 weeks.
        </div>
        <div className="flex items-center gap-2">
          {[3, 7, 4, 9, 6, 8, 5, 7, 4, 6].map((h, i) => (
            <div key={i} className="w-1 rounded-full bg-gradient-brand" style={{ height: `${h * 3}px` }} />
          ))}
          <span className="ml-2 font-mono text-[10px] text-muted-foreground">speaking…</span>
        </div>
      </div>
    ),
  },
];

export const Projects = () => (
  <section id="work" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader
        eyebrow="03 — Selected Work"
        title="Real systems. Real scale. Real impact."
        description="A handful of projects that show how I think about complex problems."
      />

      <div className="mt-16 space-y-10">
        {projects.map((p, i) => (
          <article
            key={p.title}
            data-reveal={i % 2 === 0 ? "fade-right" : "fade-left"}
            className="card-premium grid gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                <span className="h-px flex-1 bg-border" />
                <span className="chip">Case study</span>
              </div>

              <h3 className="font-display mt-5 text-3xl font-semibold leading-tight md:text-4xl">
                <span className={`animate-gradient-shift bg-gradient-to-r ${p.accent} bg-clip-text text-transparent`}>
                  {p.title}
                </span>
              </h3>
              <p className="mt-2 text-lg text-muted-foreground">{p.tagline}</p>

              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                {[
                  { l: "Problem", v: p.problem },
                  { l: "Solution", v: p.solution },
                  { l: "Impact", v: p.impact },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-primary">{b.l}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <span key={t} className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="animate-mock-float relative h-full overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--surface-2))] p-1 transition-all duration-500 group-hover:shadow-[0_0_48px_-8px_hsl(var(--brand-cyan)/0.35)] group-hover:border-border">
                {/* Title bar */}
                <div className="flex items-center gap-1.5 border-b border-border/70 px-3 py-2 transition-colors duration-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-3 font-mono text-[10px] text-muted-foreground">{p.title.toLowerCase().replace(/\s+/g, "-")}.app</span>
                </div>
                <div className="p-5">{p.mock}</div>
                {/* Accent gradient wash — brightens on hover */}
                <div className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${p.accent} opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]`} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
