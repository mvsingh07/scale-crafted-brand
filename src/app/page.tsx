"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { HubFooter } from "@/components/hub/HubFooter";
import { useIdentity } from "@/context/identity";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DivineBranchWave } from "@/components/site/DivineBranchWave";

type Lang = "EN" | "HI" | "PA";

const GOLD   = "var(--gold-primary)";
const GOLD_L = "var(--gold-highlight)";
const WHITE  = "var(--text-primary)";
const MUTED  = "var(--text-muted)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const WALL_KEY = "mvs-wall-shown";

const T = {
  EN: {
    hero: [
      { title: "MV Singh",          subtitle: "Igniting Innovation through continuous learning" },
      { title: "Digital Architect",  subtitle: "Crafting immersive digital experiences that blend creativity and technology." },
      { title: "AI Strategist",      subtitle: "Empowering businesses to harness the transformative potential of AI for growth and innovation." },
    ],
  },
  HI: {
    hero: [
      { title: "एमवी सिंह",           subtitle: "निरंतर सीखने के माध्यम से नवाचार को प्रज्वलित करना" },
      { title: "डिजिटल आर्किटेक्ट",   subtitle: "रचनात्मकता और प्रौद्योगिकी को मिलाकर इमर्सिव डिजिटल अनुभव बनाना।" },
      { title: "AI रणनीतिकार",         subtitle: "विकास के लिए AI की संभावनाओं का उपयोग कर व्यवसायों को सशक्त बनाना।" },
    ],
  },
  PA: {
    hero: [
      { title: "ਐੱਮ ਵੀ ਸਿੰਘ",         subtitle: "ਨਿਰੰਤਰ ਸਿੱਖਣ ਰਾਹੀਂ ਨਵੀਨਤਾ ਨੂੰ ਜਗਾਉਣਾ" },
      { title: "ਡਿਜੀਟਲ ਆਰਕੀਟੈਕਟ",     subtitle: "ਰਚਨਾਤਮਕਤਾ ਅਤੇ ਤਕਨਾਲੋਜੀ ਨੂੰ ਜੋੜ ਕੇ ਡਿਜੀਟਲ ਅਨੁਭਵ ਬਣਾਉਣਾ।" },
      { title: "AI ਰਣਨੀਤੀਕਾਰ",         subtitle: "ਵਿਕਾਸ ਲਈ AI ਦੀ ਸੰਭਾਵਨਾ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ।" },
    ],
  },
} as const;

// ── Wall opening intro — one-time per session ─────────────────────────────────
function WallScreen({ onDone }: { onDone: () => void }) {
  const BLACK = "var(--bg-primary)";

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <motion.div
      className="fixed inset-0 z-[200]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "50%", background: BLACK, zIndex: 2 }}
        initial={{ x: 0 }} animate={{ x: "-100%" }}
        transition={{ duration: 1.8, delay: 0.5, ease }}
      />
      <motion.div
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", background: BLACK, zIndex: 2 }}
        initial={{ x: 0 }} animate={{ x: "100%" }}
        transition={{ duration: 1.8, delay: 0.5, ease }}
      />
      <motion.div aria-hidden style={{
        position: "absolute", top: 0, bottom: 0,
        left: "calc(50% - 0.5px)", width: 1,
        background: `linear-gradient(to bottom, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)`,
        zIndex: 3,
      }}
        initial={{ opacity: 0.8, scaleY: 1 }}
        animate={{ opacity: 0, scaleY: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// ── TypeWriter — character-by-character reveal ───────────────────────────────
function TypeWriter({ text, delay = 0, charDelay = 0.05 }: {
  text: string; delay?: number; charDelay?: number;
}) {
  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: charDelay, delayChildren: delay } } }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.07 }}
          style={{ display: "inline" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── Hero section — Display Name · Three Motion Texts · Tagline · Scroll ───────
function HeroSection({ lang, ready }: { lang: Lang; ready: boolean }) {
  const { identity } = useIdentity();
  const [titleIdx, setTitleIdx] = useState(1);
  const titleFirstShown = useRef(false);

  const slides = identity?.hub_text_states?.length
    ? identity.hub_text_states.slice(0, 3)
    : T[lang].hero;

  const displayName = identity?.display_name || T[lang].hero[0].title;
  const tagline     = identity?.tagline       || T[lang].hero[0].subtitle;
  const titles      = slides.map(s => s.title);

  useEffect(() => { setTitleIdx(1); }, [lang]);

  useEffect(() => {
    if (!ready) return;
    const id = setInterval(() => setTitleIdx(i => (i + 1) % titles.length), 2600);
    return () => clearInterval(id);
  }, [ready, titles.length]);

  return (
    <section id="eco-home" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 32px", position: "relative", overflow: "hidden",
      background: "var(--bg-primary)",
    }}>
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 72% 58% at 50% 48%, color-mix(in srgb, ${GOLD} 7%, transparent) 0%, transparent 65%)`,
      }} />

      <div style={{
        position: "relative", zIndex: 1, textAlign: "center",
        width: "100%", maxWidth: 860,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* ① Display Name — gradient text, typed character by character */}
        <h1 style={{
          fontFamily: "var(--font-cinzel), Cinzel, system-ui, serif",
          fontSize: "clamp(52px, 9vw, 100px)",
          fontWeight: 600, lineHeight: 1.08, margin: 0,
          background: `linear-gradient(135deg, ${WHITE} 55%, ${GOLD_L} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {ready && <TypeWriter text={displayName} delay={0.5} charDelay={0.08} />}
        </h1>

        {/* ② Three Motion Texts — cycling hero slider titles */}
        <div style={{ height: 52, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${lang}-${titleIdx}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, delay: titleFirstShown.current ? 0 : 0.5, ease: EASE }}
              onAnimationStart={() => { titleFirstShown.current = true; }}
              style={{
                fontFamily: "var(--font-cinzel), Cinzel, serif",
                fontSize: "clamp(18px, 2.8vw, 32px)",
                fontWeight: 400, color: GOLD, letterSpacing: "0.04em",
              }}
            >
              {titles[titleIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={ready ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.65, delay: 1.3, ease: EASE }}
          style={{
            margin: "32px auto 0", height: 1, width: 80,
            background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
            transformOrigin: "center",
          }}
        />

        {/* ③ Tagline — typed in */}
        <p style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: "clamp(15px, 1.7vw, 18px)",
          color: SILVER, margin: "28px 0 0", lineHeight: 1.7, maxWidth: 520,
          minHeight: "1.7em",
        }}>
          {ready && <TypeWriter text={tagline} delay={1.4} charDelay={0.018} />}
        </p>
      </div>

      {/* Orb line — anchored near the bottom, above the scroll indicator */}
      <div style={{ position: "absolute", bottom: 88, left: 0, right: 0 }}>
        <DivineBranchWave ready={ready} startDelay={1.5} />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 0.45 } : {}}
        transition={{ duration: 0.8, delay: 2.2 }}
        style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: MUTED }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${GOLD}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}

// ── Ecosystem section wrapper ─────────────────────────────────────────────────
function EcoSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      style={{
        borderTop: "1px solid color-mix(in srgb, var(--gold-border) 12%, transparent)",
        scrollMarginTop: "70px",
      }}
    >
      {children}
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
// Each scrollable section on the hub, mapped to the nav href that targets it.
const SECTION_MAP = [
  { id: "eco-home",    href: "/",        Component: null },
  { id: "eco-about",   href: "/about",   Component: AboutSection },
  { id: "eco-vision",  href: "/vision",  Component: VisionSection },
  { id: "eco-work",    href: "/work",    Component: WorkSection },
  { id: "eco-blogs",   href: "/blogs",   Component: BlogsSection },
  { id: "eco-contact", href: "/contact", Component: ContactSection },
];

// Hrefs always shown on the hub even when no identity nav_links are configured.
const FALLBACK_NAV_HREFS = ["/", "/about", "/work", "/blogs", "/contact"];

export default function HubPage() {
  const router = useRouter();
  const { identity } = useIdentity();
  const [lang, setLang]             = useState<Lang>("EN");

  // Only render the hub sections whose href is present in the navbar.
  const navHrefs = new Set(
    identity?.nav_links?.length
      ? identity.nav_links.map(l => l.href)
      : FALLBACK_NAV_HREFS,
  );
  const visibleSections = SECTION_MAP.filter(s => s.Component && navHrefs.has(s.href));
  // null = not yet checked, false = showing wall, true = wall done/skipped
  const [wallDone, setWallDone]     = useState<boolean | null>(null);
  const [heroReady, setHeroReady]   = useState(false);
  const [activeHref, setActiveHref] = useState("/");

  // On mount: decide whether to show wall or skip it
  useEffect(() => {
    if (sessionStorage.getItem(WALL_KEY)) {
      setWallDone(true);
      setTimeout(() => setHeroReady(true), 50);
    } else {
      setWallDone(false);
    }
  }, []);

  // Scroll lock only while wall is open
  useEffect(() => {
    document.body.style.overflow = wallDone === false ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [wallDone]);

  // Keyboard shortcut to forge
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.code === "KeyL" || e.key.toLowerCase() === "l")) {
        e.preventDefault();
        router.push("/forge/login");
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [router]);

  // Auto-switch active nav tab based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const mid = window.innerHeight / 2;
      let bestHref = "/";
      let bestDist = Infinity;

      SECTION_MAP.forEach(({ id, href }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= mid) {
          const dist = mid - top;
          if (dist < bestDist) { bestDist = dist; bestHref = href; }
        }
      });

      setActiveHref(bestHref);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar lang={lang} onLangChange={setLang} activeSectionHref={activeHref} />

      <main>
        <HeroSection lang={lang} ready={heroReady} />
        {visibleSections.map(({ id, Component }) =>
          Component ? (
            <EcoSection key={id} id={id}>
              <Component />
            </EcoSection>
          ) : null,
        )}
      </main>

      <HubFooter lang={lang} />

      <AnimatePresence>
        {wallDone === false && (
          <WallScreen onDone={() => {
            sessionStorage.setItem(WALL_KEY, "1");
            setWallDone(true);
            setTimeout(() => setHeroReady(true), 200);
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}
