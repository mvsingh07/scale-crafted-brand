import {
  Boxes, Cpu, Gauge, Radio, Sparkles, Layers, Wand2,
  Code, Database, Globe, Shield, Zap, Star, type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { CardSwap, Card } from "@/components/ui/CardSwap";
import type { Service } from "@/lib/supabase";

const ICON_MAP: Record<string, LucideIcon> = {
  Boxes, Cpu, Gauge, Radio, Sparkles, Layers, Wand2,
  Code, Database, Globe, Shield, Zap, Star,
};

const DEFAULT_SERVICES: Service[] = [
  { id: "1", profile_id: "", icon_name: "Layers", title: "Backend & System Architecture", description: "End-to-end backend design from data modeling to NestJS service boundaries and deployment topology.", impact: "Foundations that survive 10× growth without a rewrite.", accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]", ord: 0 },
  { id: "2", profile_id: "", icon_name: "Boxes", title: "Scalable Microservices", description: "Right-sized services with clear contracts, Kafka/RabbitMQ messaging, BullMQ jobs, and observable interfaces.", impact: "Independent teams shipping faster, with fewer outages.", accent: "from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-pink))]", ord: 1 },
  { id: "3", profile_id: "", icon_name: "Gauge", title: "Performance & Scaling", description: "Profile, optimize, cache, and shard. From Redis-backed hot paths to query plans and infra cost engineering.", impact: "Reduced critical latency from 500ms to 120ms in production systems.", accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-pink))]", ord: 2 },
  { id: "4", profile_id: "", icon_name: "Radio", title: "Real-time Systems", description: "Event-driven backbones with Kafka, RabbitMQ, Redis, WebSockets, and resilient async processing.", impact: "Live experiences that hold under concurrent load.", accent: "from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-cyan))]", ord: 3 },
  { id: "5", profile_id: "", icon_name: "Sparkles", title: "AI Integration", description: "Production-minded LLM, vector search, accessibility, and voice pipelines using LLaMA, OpenAI and ElevenLabs.", impact: "Move AI from demo to dependable product feature.", accent: "from-[hsl(var(--brand-violet))] to-[hsl(var(--brand-cyan))]", ord: 4 },
  { id: "6", profile_id: "", icon_name: "Wand2", title: "AI-Powered Frontend", description: "Ship pixel-perfect, production-ready web experiences using Claude Code, Framer Motion, and modern UI toolchains.", impact: "From idea to live site in days — not months.", accent: "from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-violet))]", ord: 5 },
  { id: "7", profile_id: "", icon_name: "Cpu", title: "Tech Leadership", description: "Architecture reviews, PR reviews, client requirement analysis, demos, and roadmap shaping.", impact: "Lift the whole team's engineering bar — not just the code.", accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]", ord: 6 },
];

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const listItem = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

interface ServicesProps {
  services?: Service[];
}

export const Services = ({ services }: ServicesProps = {}) => {
  const items = services && services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">

          <div>
            <SectionHeader
              eyebrow="02 — The Craft"
              title="What I build for teams that can't afford to break."
              description="A focused set of services designed for companies serious about scale, reliability, and velocity."
            />

            <motion.ul
              className="mt-10 space-y-3"
              variants={listContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-8%" }}
            >
              {items.map((s) => {
                const Icon = ICON_MAP[s.icon_name] ?? Layers;
                return (
                  <motion.li
                    key={s.id}
                    variants={listItem}
                    whileHover={{ x: 6 }}
                    transition={SPRING}
                    className="flex cursor-default items-center gap-3 text-sm text-muted-foreground"
                  >
                    <motion.div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${s.accent}`}
                      whileHover={{ rotate: 12, scale: 1.18 }}
                      transition={SPRING}
                    >
                      <Icon size={12} className="text-white" />
                    </motion.div>
                    {s.title}
                  </motion.li>
                );
              })}
            </motion.ul>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Hover to pause · Auto-cycling
            </p>
          </div>

          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
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
                {items.map((s) => {
                  const Icon = ICON_MAP[s.icon_name] ?? Layers;
                  return (
                    <Card key={s.id} className="p-7 flex flex-col justify-between overflow-hidden">
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${s.accent} opacity-[0.05]`} />
                      <div>
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} shadow-glow`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <h3 className="font-display mt-5 text-xl font-semibold leading-snug text-foreground">
                          {s.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {s.description}
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
                  );
                })}
              </CardSwap>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
