import { Boxes, Cpu, Gauge, Radio, Sparkles, Layers, Wand2, type LucideIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { CardSwap, Card } from "@/components/ui/CardSwap";

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
  impact: string;
  accent: string;
}

const services: Service[] = [
  {
    icon: Layers,
    title: "Backend & System Architecture",
    desc: "End-to-end backend design from data modeling to NestJS service boundaries and deployment topology.",
    impact: "Foundations that survive 10× growth without a rewrite.",
    accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]",
  },
  {
    icon: Boxes,
    title: "Scalable Microservices",
    desc: "Right-sized services with clear contracts, Kafka/RabbitMQ messaging, BullMQ jobs, and observable interfaces.",
    impact: "Independent teams shipping faster, with fewer outages.",
    accent: "from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-pink))]",
  },
  {
    icon: Gauge,
    title: "Performance & Scaling",
    desc: "Profile, optimize, cache, and shard. From Redis-backed hot paths to query plans and infra cost engineering.",
    impact: "Reduced critical latency from 500ms to 120ms in production systems.",
    accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-pink))]",
  },
  {
    icon: Radio,
    title: "Real-time Systems",
    desc: "Event-driven backbones with Kafka, RabbitMQ, Redis, WebSockets, and resilient async processing.",
    impact: "Live experiences that hold under concurrent load.",
    accent: "from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-cyan))]",
  },
  {
    icon: Sparkles,
    title: "AI Integration",
    desc: "Production-minded LLM, vector search, accessibility, and voice pipelines using LLaMA, OpenAI and ElevenLabs.",
    impact: "Move AI from demo to dependable product feature.",
    accent: "from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-cyan))]",
  },
  {
    icon: Wand2,
    title: "AI-Powered Frontend",
    desc: "Ship pixel-perfect, production-ready web experiences using Claude Code, Framer Motion, and modern UI toolchains.",
    impact: "From idea to live site in days — not months.",
    accent: "from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-violet))]",
  },
  {
    icon: Cpu,
    title: "Tech Leadership",
    desc: "Architecture reviews, PR reviews, client requirement analysis, demos, and roadmap shaping.",
    impact: "Lift the whole team's engineering bar — not just the code.",
    accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]",
  },
];

export const Services = () => (
  <section id="services" className="relative py-24 md:py-32">
    <div className="container">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">

        {/* Left — header + service index */}
        <div>
          <SectionHeader
            eyebrow="02 — The Craft"
            title="What I build for teams that can't afford to break."
            description="A focused set of services designed for companies serious about scale, reliability, and velocity."
          />

          <ul className="mt-10 space-y-3">
            {services.map((s) => (
              <li key={s.title} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${s.accent}`}>
                  <s.icon size={12} className="text-white" />
                </div>
                {s.title}
              </li>
            ))}
          </ul>

          <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            Hover to pause · Auto-cycling
          </p>
        </div>

        {/* Right — CardSwap cycling deck */}
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: 420, height: 360 }}>
            <CardSwap
              width={420}
              height={360}
              cardDistance={28}
              verticalDistance={36}
              delay={3800}
              pauseOnHover
              skewAmount={4}
              easing="elastic"
            >
              {services.map((s) => (
                <Card key={s.title} className="p-7 flex flex-col justify-between overflow-hidden">
                  {/* Accent gradient wash */}
                  <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${s.accent} opacity-[0.05]`} />

                  <div>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} shadow-glow`}>
                      <s.icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-display mt-5 text-xl font-semibold leading-snug text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                    <p className="mt-4 text-sm">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Impact · </span>
                      <span className="text-foreground">{s.impact}</span>
                    </p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>

      </div>
    </div>
  </section>
);
