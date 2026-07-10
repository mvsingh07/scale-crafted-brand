"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe, Search, Bot, LayoutDashboard, CreditCard, Smartphone, Sparkles,
  Code2, Database, Cloud, GitBranch, Cpu, Mail, Map, BarChart3, HardDrive,
  ArrowRight, Zap, Check, ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { EcosystemService, EcosystemProject } from "@/lib/supabase";
import { ProjectCard } from "@/components/sections/shared/ProjectCard";

const GOLD   = "var(--gold-primary)";
const GOLD_L = "var(--gold-highlight)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

const FONT_H = "var(--font-cinzel), Cinzel, serif";
const FONT_B = "var(--font-inter), Inter, sans-serif";

// Lucide icons available to service cards (icon_name column).
const SERVICE_ICONS: Record<string, React.ElementType> = {
  Globe, Search, Bot, LayoutDashboard, CreditCard, Smartphone, Sparkles,
};

// Scroll to the Contact section on the same page (hub). Falls back to the
// /contact route only when no contact section is present (e.g. standalone view).
function goToContact(e: React.MouseEvent<HTMLAnchorElement>) {
  const el = typeof document !== "undefined" ? document.getElementById("eco-contact") : null;
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// ── Shared bits ───────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT_B, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
      {children}
    </p>
  );
}

function SectionHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontFamily: FONT_H, fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 600, lineHeight: 1.2, color: WHITE, margin: 0, ...style }}>
      {children}
    </h2>
  );
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── 1 · Hero band ─────────────────────────────────────────────────────────────
function HeroBand() {
  return (
    <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px) 40px" }}>
      <Reveal style={{ position: "relative", maxWidth: 760 }}>
        <Eyebrow>02 — What I Offer</Eyebrow>
        <h1 style={{ fontFamily: FONT_H, fontSize: "clamp(30px, 4.4vw, 52px)", fontWeight: 600, lineHeight: 1.12, margin: 0,
          background: `linear-gradient(135deg, ${WHITE} 55%, ${GOLD_L} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Helping Panjab Businesses Grow in the Digital &amp; AI Era
        </h1>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(15px, 1.8vw, 19px)", color: SILVER, lineHeight: 1.75, margin: "28px 0 0", maxWidth: 640 }}>
          I build modern websites, business systems, AI-powered solutions, and digital
          tools that help businesses work smarter, build trust, and grow online — practical
          solutions designed around your business, not unnecessary complexity.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
          <a href="#services-work" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, borderRadius: 10,
            padding: "12px 22px", fontFamily: FONT_B, fontSize: 14, fontWeight: 600,
            color: "var(--bg-primary)", textDecoration: "none",
          }}>
            View My Work <ArrowRight size={15} />
          </a>
          <a href="/contact" onClick={goToContact} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
            borderRadius: 10, padding: "12px 22px", fontFamily: FONT_B, fontSize: 14,
            color: WHITE, textDecoration: "none",
          }}>
            Let&apos;s Build Something Together
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1} style={{
        position: "relative", marginTop: 44, padding: "24px 26px", maxWidth: 720,
        border: `1px solid color-mix(in srgb, var(--gold-border) 25%, transparent)`,
        borderRadius: 16, background: `color-mix(in srgb, ${GOLD} 3%, var(--bg-primary))`,
      }}>
        <p style={{ fontFamily: FONT_B, fontSize: 14, lineHeight: 1.8, color: SILVER, margin: 0 }}>
          The way software is built has changed. In today&apos;s AI era, many businesses no
          longer need a large software company for medium-sized projects — they need someone
          who understands both business and technology, and can design, build, and continuously
          improve solutions using modern tools. <span style={{ color: GOLD }}>That&apos;s exactly where I help.</span>
        </p>
      </Reveal>
    </div>
  );
}

// ── 2 · How I Can Help — dynamic service cards ────────────────────────────────
function ServiceCard({ service: s, index }: { service: EcosystemService; index: number }) {
  const Icon = SERVICE_ICONS[s.icon_name] ?? Sparkles;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
      whileHover={{ y: -4, borderColor: `color-mix(in srgb, ${s.accent} 45%, transparent)` }}
      style={{
        border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)", borderRadius: 18,
        background: "color-mix(in srgb, var(--gold-primary) 2.5%, var(--bg-primary))",
        padding: "26px 24px", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{
        display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 13,
        border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)", background: `color-mix(in srgb, ${s.accent} 12%, transparent)`,
        marginBottom: 18,
      }}>
        <Icon size={20} style={{ color: s.accent }} />
      </div>
      <h3 style={{ fontFamily: FONT_H, fontSize: 21, fontWeight: 600, color: WHITE, margin: "0 0 8px" }}>{s.title}</h3>
      <p style={{ fontFamily: FONT_B, fontSize: 13.5, lineHeight: 1.65, color: SILVER, margin: "0 0 18px" }}>{s.summary}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {s.items.map(item => (
          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <Check size={13} style={{ color: s.accent, flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontFamily: FONT_B, fontSize: 13, color: "color-mix(in srgb, var(--text-primary) 78%, transparent)", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      {s.impact && (
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)" }}>
          <p style={{ fontFamily: FONT_B, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, margin: "0 0 6px" }}>
            Business Impact
          </p>
          <p style={{ fontFamily: FONT_B, fontSize: 13, lineHeight: 1.6, color: "color-mix(in srgb, var(--text-primary) 65%, transparent)", margin: 0 }}>{s.impact}</p>
        </div>
      )}
    </motion.div>
  );
}

function HowICanHelp({ services, loading }: { services: EcosystemService[]; loading: boolean }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 44, maxWidth: 620 }}>
        <Eyebrow>How I Can Help</Eyebrow>
        <SectionHeading>Real solutions for real business problems.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0" }}>
          Instead of generic development services, I focus on solving real business problems
          through practical digital solutions.
        </p>
      </Reveal>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
        </div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", fontFamily: FONT_B, fontSize: 13, color: MUTED }}>
          <Sparkles size={26} style={{ margin: "0 auto 14px", opacity: 0.2 }} />
          Services loading soon.
        </div>
      ) : (
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}
        >
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}

// ── 3 · Featured Projects (existing ecosystem_projects) ───────────────────────
function FeaturedProjects({ projects, loading }: { projects: EcosystemProject[]; loading: boolean }) {
  return (
    <div id="services-work" style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px)", scrollMarginTop: 80 }}>
      <Reveal style={{ marginBottom: 44, maxWidth: 620 }}>
        <Eyebrow>Featured Projects</Eyebrow>
        <SectionHeading>Recent work.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0" }}>
          Real projects, built and shipped. This list grows as new work goes live.
        </p>
      </Reveal>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", fontFamily: FONT_B, fontSize: 13, color: MUTED }}>
          <Zap size={26} style={{ margin: "0 auto 14px", opacity: 0.2 }} />
          Projects loading soon.
        </div>
      ) : (
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </motion.div>
      )}
    </div>
  );
}

// ── 4 · How I Work — process timeline (static) ────────────────────────────────
const PROCESS = [
  { step: "Understand", body: "Learn your business, goals, and the real problem worth solving." },
  { step: "Plan",       body: "Map a practical scope — no unnecessary complexity or oversized teams." },
  { step: "Design",     body: "Shape clean, intuitive experiences around how your business actually works." },
  { step: "Build",      body: "Engineer scalable solutions with modern tools and AI-assisted development." },
  { step: "Launch",     body: "Ship carefully, test thoroughly, and get you live with confidence." },
  { step: "Support",    body: "Improve continuously — every project is a partnership, not a hand-off." },
];

function HowIWork() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 44, maxWidth: 620 }}>
        <Eyebrow>How I Work</Eyebrow>
        <SectionHeading>A transparent, collaborative process.</SectionHeading>
      </Reveal>
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}
      >
        {PROCESS.map((p, i) => (
          <motion.div
            key={p.step}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
            style={{ border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)", borderRadius: 14, padding: "20px 20px 22px", background: "color-mix(in srgb, var(--text-primary) 3%, transparent)" }}
          >
            <span style={{ fontFamily: FONT_H, fontSize: 13, color: GOLD, letterSpacing: "0.08em" }}>{String(i + 1).padStart(2, "0")}</span>
            <h3 style={{ fontFamily: FONT_H, fontSize: 19, fontWeight: 600, color: WHITE, margin: "8px 0 8px" }}>{p.step}</h3>
            <p style={{ fontFamily: FONT_B, fontSize: 13, lineHeight: 1.65, color: SILVER, margin: 0 }}>{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ── 5 · Why Work With Me (static) ─────────────────────────────────────────────
const ADVANTAGES = [
  "Direct Communication", "Personalized Solutions", "Modern Technologies", "AI-First Development",
  "Scalable Architecture", "Long-Term Support", "Transparent Pricing", "Business-Oriented Thinking",
  "Continuous Improvements",
];

function WhyMe() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 34, maxWidth: 640 }}>
        <Eyebrow>Why Work With Me</Eyebrow>
        <SectionHeading>Work directly with the person building your solution.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0" }}>
          No layers of communication. Every project is approached as a partnership rather than a one-time delivery.
        </p>
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {ADVANTAGES.map(a => (
          <span key={a} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: `1px solid color-mix(in srgb, var(--gold-border) 30%, transparent)`,
            background: `color-mix(in srgb, ${GOLD} 5%, transparent)`, borderRadius: 100,
            padding: "9px 16px", fontFamily: FONT_B, fontSize: 13, color: "color-mix(in srgb, var(--text-primary) 82%, transparent)",
          }}>
            <Check size={13} style={{ color: GOLD }} />{a}
          </span>
        ))}
      </Reveal>
    </div>
  );
}

// ── 6 · Technology Stack (static icon grid) ───────────────────────────────────
const TECH_GROUPS: { group: string; items: { label: string; Icon: React.ElementType }[] }[] = [
  { group: "Frontend",     items: [{ label: "Next.js", Icon: Code2 }, { label: "React", Icon: Code2 }, { label: "TypeScript", Icon: Code2 }] },
  { group: "Backend",      items: [{ label: "Supabase", Icon: Database }, { label: "PostgreSQL", Icon: Database }, { label: "Auth", Icon: HardDrive }] },
  { group: "AI",           items: [{ label: "OpenAI", Icon: Cpu }, { label: "Google AI", Icon: Cpu }, { label: "Automation", Icon: Bot }] },
  { group: "Deployment",   items: [{ label: "Vercel", Icon: Cloud }, { label: "Cloudflare", Icon: Cloud }] },
  { group: "Development",  items: [{ label: "Git", Icon: GitBranch }, { label: "GitHub", Icon: GitBranch }] },
  { group: "Integrations", items: [{ label: "Payments", Icon: CreditCard }, { label: "Email", Icon: Mail }, { label: "Maps", Icon: Map }, { label: "Analytics", Icon: BarChart3 }] },
];

function TechStack() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 40, maxWidth: 620 }}>
        <Eyebrow>Technology Stack</Eyebrow>
        <SectionHeading>Modern, scalable, AI-ready tools.</SectionHeading>
      </Reveal>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))" }}>
        {TECH_GROUPS.map((g, gi) => (
          <Reveal key={g.group} delay={gi * 0.05} style={{
            border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)", borderRadius: 14,
            padding: "18px 18px 20px", background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
          }}>
            <p style={{ fontFamily: FONT_B, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, margin: "0 0 14px" }}>{g.group}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {g.items.map(({ label, Icon }) => (
                <span key={label} style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                  borderRadius: 9, padding: "7px 11px", fontFamily: FONT_B, fontSize: 12.5, color: "color-mix(in srgb, var(--text-primary) 78%, transparent)",
                }}>
                  <Icon size={13} style={{ color: SILVER }} />{label}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ── 7 · FAQ (static accordion) ────────────────────────────────────────────────
const FAQS = [
  { q: "What industries do you work with?", a: "Any business ready to grow online — retail, services, manufacturing, professional practices, and more. The approach adapts to your industry." },
  { q: "How long does a website take?", a: "Most business websites take a few weeks depending on scope. I share a clear timeline before starting, with no surprises." },
  { q: "Can you redesign an existing website?", a: "Yes. I modernize existing sites — improving design, speed, structure, and search visibility — without losing what already works." },
  { q: "Do you build custom dashboards?", a: "Yes — admin panels, client portals, and internal tools tailored to how your business actually operates." },
  { q: "What is a CMS?", a: "A Content Management System lets you update your website content yourself, without needing a developer for every change." },
  { q: "What is a CRM?", a: "A Customer Relationship Management system helps you track customers, quotations, and follow-ups from one organized place." },
  { q: "What is SEO?", a: "Search Engine Optimization improves your visibility on Google through technical optimization and quality website structure." },
  { q: "What is GEO?", a: "Generative Engine Optimization prepares your business to be discovered through AI platforms like ChatGPT, Gemini, Claude, and Perplexity." },
  { q: "Can you integrate AI?", a: "Yes — chatbots, workflow automation, content assistance, and internal AI tools that reduce repetitive work." },
  { q: "Do you provide maintenance?", a: "Yes. Long-term support and continuous improvement are part of how I work — projects are partnerships, not one-time deliveries." },
  { q: "Who owns the website after completion?", a: "You do. You own your website, content, and data — completely." },
  { q: "Can my business grow without changing platforms later?", a: "Yes. I build on scalable architecture so your solution can grow with your business instead of being replaced." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)", borderRadius: 12, background: "color-mix(in srgb, var(--text-primary) 3%, transparent)", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ fontFamily: FONT_B, fontSize: 14, fontWeight: 500, color: WHITE }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ lineHeight: 1, color: GOLD, flexShrink: 0 }}>
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }} style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: FONT_B, fontSize: 13.5, lineHeight: 1.7, color: SILVER, margin: 0, padding: "0 18px 18px" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Faq() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px)" }}>
      <Reveal style={{ marginBottom: 34 }}>
        <Eyebrow>FAQ</Eyebrow>
        <SectionHeading>Questions, answered.</SectionHeading>
      </Reveal>
      <Reveal delay={0.05} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
      </Reveal>
    </div>
  );
}

// ── 8 · Final CTA (static) ────────────────────────────────────────────────────
function FinalCta() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px clamp(18px, 4vw, 32px) 88px" }}>
      <Reveal style={{
        position: "relative", overflow: "hidden", borderRadius: 22,
        border: `1px solid color-mix(in srgb, var(--gold-border) 30%, transparent)`,
        background: `color-mix(in srgb, ${GOLD} 4%, var(--bg-primary))`,
        padding: "clamp(36px, 6vw, 64px) clamp(28px, 5vw, 56px)", textAlign: "center",
      }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, ${GOLD} 10%, transparent) 0%, transparent 60%)`,
        }} />
        <div style={{ position: "relative" }}>
          <SectionHeading style={{ maxWidth: 640, margin: "0 auto" }}>Let&apos;s build something meaningful.</SectionHeading>
          <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.7vw, 17px)", color: SILVER, lineHeight: 1.75, margin: "18px auto 0", maxWidth: 560 }}>
            Whether you need your first website, a custom business system, AI automation, or a
            modern digital presence, I&apos;d be happy to understand your business and recommend
            the right solution. No unnecessary complexity. No oversized teams.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
            <a href="/contact" onClick={goToContact} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, borderRadius: 10,
              padding: "13px 26px", fontFamily: FONT_B, fontSize: 14, fontWeight: 600,
              color: "var(--bg-primary)", textDecoration: "none",
            }}>
              Start Your Project <ArrowRight size={15} />
            </a>
            <a href="/contact" onClick={goToContact} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "color-mix(in srgb, var(--text-primary) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
              borderRadius: 10, padding: "13px 26px", fontFamily: FONT_B, fontSize: 14,
              color: WHITE, textDecoration: "none",
            }}>
              Schedule a Free Discussion
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ── Divider between sub-sections ──────────────────────────────────────────────
function Divider() {
  return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(18px, 4vw, 32px)" }}>
    <div style={{ height: 1, background: "color-mix(in srgb, var(--gold-border) 12%, transparent)" }} />
  </div>;
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function ServicesSection() {
  const [services, setServices] = useState<EcosystemService[]>([]);
  const [projects, setProjects] = useState<EcosystemProject[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ecosystem_services")
      .select("*")
      .eq("username", OWNER)
      .eq("is_public", true)
      .order("ord", { ascending: true })
      .then(({ data }) => {
        setServices((data as EcosystemService[]) ?? []);
        setServicesLoading(false);
      });

    supabase
      .from("ecosystem_projects")
      .select("*")
      .eq("username", OWNER)
      .eq("is_public", true)
      .order("ord", { ascending: true })
      .then(({ data }) => {
        setProjects((data as EcosystemProject[]) ?? []);
        setProjectsLoading(false);
      });
  }, []);

  return (
    <div>
      <HeroBand />
      <Divider />
      <HowICanHelp services={services} loading={servicesLoading} />
      <Divider />
      <FeaturedProjects projects={projects} loading={projectsLoading} />
      {/* How I Work / Why Work With Me / Technology Stack sections commented out
      <Divider />
      <HowIWork />
      <Divider />
      <WhyMe />
      <Divider />
      <TechStack />
      */}
      {/* FAQ section commented out
      <Divider />
      <Faq />
      */}
      {/* <FinalCta /> */}
    </div>
  );
}
