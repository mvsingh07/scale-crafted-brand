import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Layers, Globe, Zap, Lock, Star, ChevronRight } from "lucide-react";

// ── Animated background grid ──────────────────────────────────────────────────
const GridBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(hsl(var(--brand-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand-cyan)) 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(220_18%_6%)]" />
    {/* Glow orbs */}
    <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--brand-cyan))] opacity-[0.06] blur-[120px]" />
    <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[hsl(var(--brand-violet))] opacity-[0.05] blur-[120px]" />
  </div>
);

// ── Feature card ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: Globe,
    title: "Your URL. Your brand.",
    body: "Every portfolio lives at forge.app/yourname — a clean, shareable link that works instantly.",
    accent: "hsl(var(--brand-cyan))",
  },
  {
    icon: Zap,
    title: "Real-time preview.",
    body: "Watch your portfolio update live as you type. No refresh, no lag, no guessing.",
    accent: "hsl(var(--brand-violet))",
  },
  {
    icon: Layers,
    title: "Every section. One editor.",
    body: "Hero, about, services, projects, journey, skills, and contact — all managed in one structured workspace.",
    accent: "hsl(var(--brand-pink))",
  },
  {
    icon: Lock,
    title: "Secure by default.",
    body: "Row-level security on every table. Only you can edit your data. Anyone can view your portfolio.",
    accent: "hsl(var(--brand-cyan))",
  },
];

const steps = [
  { n: "01", label: "Sign up", body: "Create your account in seconds. No credit card required." },
  { n: "02", label: "Fill your story", body: "Use The Forge editor to add your work, experience, and skills." },
  { n: "03", label: "Share the link", body: "Your portfolio is live at your unique URL. Send it. Own it." },
];

const testimonials = [
  { quote: "Went from zero to a live portfolio in under an hour. The editor is genuinely fast.", name: "S. Mehta", role: "Full-stack engineer" },
  { quote: "The real-time preview is what sold me. I could see every change before anyone else did.", name: "P. Liang", role: "Product designer" },
  { quote: "Clean, minimal, and actually looks like a senior engineer built it.", name: "T. Okafor", role: "ML researcher" },
];

// ── Main component ─────────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const el = heroRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => el.classList.add("is-visible"));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[hsl(220_18%_6%)] text-white selection:bg-[hsl(var(--brand-cyan)/0.3)]">
      <GridBackground />

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]">
            <Star size={14} className="text-white" fill="white" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight text-white">The Forge</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/forge")}
            className="rounded-lg px-4 py-2 font-mono text-xs text-white/50 transition-colors hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/forge?mode=signup")}
            className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 font-mono text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            Get started <ArrowRight size={11} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-20 text-center md:px-12 md:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Now in early access</span>
        </div>

        <h1
          ref={heroRef}
          data-reveal
          className="font-editorial mb-6 text-[clamp(2.4rem,6vw,5rem)] font-light leading-[1.08] tracking-tight text-white"
        >
          Your portfolio,
          <br />
          <span className="bg-gradient-to-r from-[hsl(var(--brand-cyan))] via-[hsl(var(--brand-violet))] to-[hsl(var(--brand-pink))] bg-clip-text text-transparent">
            built to be remembered.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-white/50">
          The Forge is a portfolio builder for engineers and creators who want their work to speak clearly —
          structured editor, live preview, and a permanent link that scales with your career.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/forge?mode=signup")}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Build your portfolio <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate("/manvir")}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-6 py-3 text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            See an example <ChevronRight size={14} />
          </button>
        </div>

        {/* Mock portfolio window */}
        <div className="relative mx-auto mt-16 max-w-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-[0_40px_120px_-30px_hsl(211_100%_56%/0.15)] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="mx-auto flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-1">
              <Globe size={10} className="text-white/30" />
              <span className="font-mono text-[10px] text-white/30">forge.app/yourname</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {/* Left: fake editor */}
            <div className="border-r border-white/[0.06] p-5 space-y-3">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20">The Forge · Edit Profile</p>
              {[
                { label: "Name", val: "Your Name" },
                { label: "Tagline", val: "What you do: in one line" },
                { label: "Hero description", val: "The story behind the work…" },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/20">{f.label}</p>
                  <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
                    <p className="text-[10px] text-white/40">{f.val}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 flex justify-end">
                <span className="rounded-md bg-white/90 px-3 py-1 font-mono text-[8px] font-semibold text-black">Save</span>
              </div>
            </div>
            {/* Right: fake portfolio preview */}
            <div className="p-5 space-y-3">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20">Live preview</p>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                <p className="font-mono text-[8px] text-[hsl(var(--brand-cyan))/0.7]">Engineer · Creator · Builder</p>
                <p className="mt-1 text-xs font-light text-white/80">Your Name</p>
                <p className="mt-0.5 text-[10px] italic text-[hsl(var(--brand-violet))]">What you do: in one line</p>
                <p className="mt-2 text-[9px] leading-relaxed text-white/30">The story behind the work…</p>
              </div>
              <div className="flex gap-1.5">
                {["#skill", "#skill", "#skill"].map((t, i) => (
                  <span key={i} className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[8px] text-white/30">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[hsl(220_18%_6%)] to-transparent" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-12">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Why The Forge</p>
          <h2 className="font-editorial text-3xl font-light text-white md:text-4xl">
            Everything you need. Nothing you don't.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              <div
                className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10"
                style={{ background: `${f.accent}18` }}
              >
                <f.icon size={18} style={{ color: f.accent }} />
              </div>
              <p className="mb-2 text-sm font-semibold text-white">{f.title}</p>
              <p className="text-xs leading-relaxed text-white/40">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.015] py-24">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-14 text-center">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">How it works</p>
            <h2 className="font-editorial text-3xl font-light text-white md:text-4xl">Three steps to live.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-5 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-white/10 to-transparent md:block" />
                )}
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <span className="font-mono text-xs text-white/40">{s.n}</span>
                </div>
                <p className="mb-2 text-base font-semibold text-white">{s.label}</p>
                <p className="text-sm leading-relaxed text-white/40">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-12">
        <div className="mb-14 text-center">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">Early feedback</p>
          <h2 className="font-editorial text-3xl font-light text-white md:text-4xl">Built for real careers.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6"
            >
              <p className="mb-5 text-sm leading-relaxed text-white/60 italic">"{t.quote}"</p>
              <div>
                <p className="text-xs font-semibold text-white">{t.name}</p>
                <p className="font-mono text-[10px] text-white/30">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 overflow-hidden border-t border-white/[0.06] py-28 text-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-[hsl(var(--brand-cyan))] opacity-[0.05] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-editorial mb-5 text-4xl font-light text-white md:text-5xl">
            Your work deserves<br />a proper home.
          </h2>
          <p className="mb-8 text-base text-white/40">
            No design skills needed. No templates to wrestle. Just your story, structured and live.
          </p>
          <button
            onClick={() => navigate("/forge?mode=signup")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Start for free <ArrowRight size={14} />
          </button>
          <p className="mt-4 font-mono text-[10px] text-white/20">No credit card. No setup fees.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]">
              <Star size={11} className="text-white" fill="white" />
            </div>
            <span className="font-mono text-xs text-white/30">The Forge</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/forge")} className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/50">Sign in</button>
            <button onClick={() => navigate("/forge?mode=signup")} className="font-mono text-[10px] text-white/20 transition-colors hover:text-white/50">Sign up</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
