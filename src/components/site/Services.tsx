import { Boxes, Cpu, Gauge, Radio, Sparkles, Layers, Wand2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const services = [
  {
    icon: Layers,
    title: "Backend & System Architecture",
    desc: "End-to-end backend design from data modeling to NestJS service boundaries and deployment topology.",
    impact: "Foundations that survive 10× growth without a rewrite.",
  },
  {
    icon: Boxes,
    title: "Scalable Microservices",
    desc: "Right-sized services with clear contracts, Kafka/RabbitMQ messaging, BullMQ jobs, and observable interfaces.",
    impact: "Independent teams shipping faster, with fewer outages.",
  },
  {
    icon: Gauge,
    title: "Performance & Scaling",
    desc: "Profile, optimize, cache, and shard. From Redis-backed hot paths to query plans and infra cost engineering.",
    impact: "Reduced critical latency from 500ms to 120ms in production systems.",
  },
  {
    icon: Radio,
    title: "Real-time Systems",
    desc: "Event-driven backbones with Kafka, RabbitMQ, Redis, WebSockets, and resilient async processing.",
    impact: "Live experiences that hold under concurrent load.",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    desc: "Production-minded LLM, vector search, accessibility, and voice pipelines using LLaMA, OpenAI and ElevenLabs.",
    impact: "Move AI from demo to dependable product feature.",
  },
  {
    icon: Wand2,
    title: "AI-Powered Frontend Websites",
    desc: "Ship pixel-perfect, production-ready web experiences using Claude Code, Stitch UI, Emergent, Lovable, Framer Motion, and UI UX Pro Max.",
    impact: "From idea to live site in days — not months.",
  },
  {
    icon: Cpu,
    title: "Tech Leadership",
    desc: "Architecture reviews, PR reviews, client requirement analysis, demos, and roadmap shaping.",
    impact: "Lift the whole team's engineering bar — not just the code.",
  },
];

export const Services = () => (
  <section id="services" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader
        eyebrow="02 — Services"
        title="What I build for teams that can't afford to break."
        description="A focused set of services designed for companies serious about scale, reliability, and velocity."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <article
            key={s.title}
            data-reveal="zoom"
            className="card-premium group p-7"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <s.icon size={22} />
            </div>
            <h3 className="font-display mt-6 text-xl font-semibold text-foreground">{s.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            <div className="divider-gradient my-5" />
            <p className="text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Impact · </span>
              <span className="text-foreground">{s.impact}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
