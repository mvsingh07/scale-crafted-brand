"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { HubFooter } from "@/components/hub/HubFooter";
import { useIdentity } from "@/context/identity";
import { AboutSection } from "@/components/sections/AboutSection";
import { VisionSection } from "@/components/sections/VisionSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DivineBranchWave } from "@/components/site/DivineBranchWave";
import { HeroParticles } from "@/components/site/HeroParticles";
import { Mandala } from "@/components/sections/vision/SacredGeometry";

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
function TypeWriter({ text, delay = 0, charDelay = 0.05, onComplete }: {
  text: string; delay?: number; charDelay?: number; onComplete?: () => void;
}) {
  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: charDelay, delayChildren: delay } } }}
      onAnimationComplete={() => onComplete?.()}
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

// Hero always renders on its dark cinematic palette, independent of the site-wide
// light/dark toggle — the background video and gold typography need a black stage.
const HERO_BG      = "#000000";
const HERO_GOLD    = "#C9A55A";
const HERO_GOLD_L  = "#E0C27A";
const HERO_WHITE   = "#F8FAFC";
const HERO_MUTED   = "#D1D5DB";
const HERO_SILVER  = "#C7CDD6";

// ── Hero section — Display Name · Three Motion Texts · Tagline · Scroll ───────
function HeroSection({ lang, ready }: { lang: Lang; ready: boolean }) {
  const { identity } = useIdentity();
  const [titleIdx, setTitleIdx] = useState(1);

  // Sequential reveal gates — top to bottom: name → cycling title → tagline.
  // Each line only starts animating once the line above it has finished,
  // instead of relying on hand-tuned absolute delays that fall out of sync
  // once display_name/tagline length varies.
  const [nameDone, setNameDone]   = useState(false);
  const [titleDone, setTitleDone] = useState(false);

  const slides = identity?.hub_text_states?.length
    ? identity.hub_text_states.slice(0, 3)
    : T[lang].hero;

  const displayName = identity?.display_name || T[lang].hero[0].title;
  const tagline     = identity?.tagline       || T[lang].hero[0].subtitle;
  const titles      = slides.map(s => s.title);

  useEffect(() => { setTitleIdx(1); }, [lang]);

  useEffect(() => { setNameDone(false); setTitleDone(false); }, [ready, displayName]);

  useEffect(() => {
    if (!nameDone) return;
    const id = setInterval(() => setTitleIdx(i => (i + 1) % titles.length), 2600);
    return () => clearInterval(id);
  }, [nameDone, titles.length]);

  // ── Mouse parallax ────────────────────────────────────────────────────────
  const reduce = useReducedMotion() ?? false;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 48, damping: 22 });
  const sy = useSpring(my, { stiffness: 48, damping: 22 });
  const textX = useTransform(sx, v => reduce ? 0 : v * 9);
  const textY = useTransform(sy, v => reduce ? 0 : v * 6);
  const mandX = useTransform(sx, v => reduce ? 0 : -v * 24);
  const mandY = useTransform(sy, v => reduce ? 0 : -v * 18);

  return (
    <section
      id="eco-home"
      onMouseMove={() => { /* mouse hold / parallax effect disabled */ }}
      style={{
        minHeight: "100svh", display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
        padding: "80px clamp(18px, 4vw, 32px) 80px clamp(24px, 7vw, 96px)", position: "relative", overflow: "hidden",
        background: HERO_BG,
      }}
    >
      {/* Mandala backdrop — counter-parallax, very slow rotation — DISABLED
      <div aria-hidden style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none", zIndex: 0,
      }}>
        <motion.div style={{ x: mandX, y: mandY }}>
          <Mandala
            size={1080} speed={0.18} reduce={reduce} innerPetals={false}
            style={{ opacity: 0.052, filter: "blur(0.5px)" }}
          />
        </motion.div>
      </div>
      */}

      {/* Background illustration — looping video, layered above the jet-black
          backdrop with a "screen" blend so its black pixels stay invisible
          against HERO_BG and only the bright content shows through; the
          section background itself stays pure black underneath. */}
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="object-cover sm:object-contain"
        style={{
          position: "absolute", inset: 0, zIndex: 1,
          width: "100%", height: "100%",
          mixBlendMode: "screen",
        }}
      >
        <source src="/video/final-bg-animation.mp4" type="video/mp4" />
      </video>

      {/* Floating gold particles — above the video */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <HeroParticles ready={ready} />
      </div>

      {/* Film grain — cinematic texture — DISABLED (light blink / flicker effect removed)
      <svg aria-hidden style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        zIndex: 2, pointerEvents: "none", opacity: 0.042,
        animation: "grain 8s steps(10) infinite",
      }}>
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="200%" height="200%" x="-50%" y="-50%" filter="url(#hero-grain)" />
      </svg>
      */}

      <motion.div style={{
        position: "relative", zIndex: 4, textAlign: "left",
        width: "100%", maxWidth: 640,
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        x: textX, y: textY,
      }}>
        {/* ① Display Name — typed character by character, top line, first to appear */}
        <h1 style={{
          fontFamily: "var(--font-cinzel), Cinzel, system-ui, serif",
          fontSize: "clamp(40px, 9.5vw, 100px)",
          fontWeight: 600, lineHeight: 1.08, margin: 0,
          color: HERO_WHITE,
        }}>
          {ready && <TypeWriter text={displayName} delay={0.5} charDelay={0.08} onComplete={() => setNameDone(true)} />}
        </h1>

        {/* ② Three Motion Texts — cycling hero slider titles, starts only once the name has finished typing */}
        <div style={{ height: 52, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          {nameDone && (
            <AnimatePresence mode="wait">
              <motion.span
                key={`${lang}-${titleIdx}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: EASE }}
                onAnimationComplete={() => setTitleDone(true)}
                style={{
                  fontFamily: "var(--font-cinzel), Cinzel, serif",
                  fontSize: "clamp(18px, 2.8vw, 32px)",
                  fontWeight: 400, color: HERO_GOLD, letterSpacing: "0.04em",
                }}
              >
                {titles[titleIdx]}
              </motion.span>
            </AnimatePresence>
          )}
        </div>

        {/* Gold divider — draws in once the title line above it has appeared */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={titleDone ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            margin: "32px 0 0", height: 1, width: 80,
            background: `linear-gradient(to right, ${HERO_GOLD}, transparent)`,
            transformOrigin: "left",
          }}
        />

        {/* ③ Tagline — typed in last, bottom line */}
        <p style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: "clamp(15px, 1.7vw, 18px)",
          color: HERO_SILVER, margin: "28px 0 0", lineHeight: 1.7, maxWidth: 480,
          minHeight: "1.7em",
        }}>
          {ready && titleDone && <TypeWriter text={tagline} delay={0.15} charDelay={0.018} />}
        </p>
      </motion.div>

      {/* Orb line — anchored near the bottom, above cinematic overlays */}
      <div style={{ position: "absolute", bottom: 88, left: 0, right: 0, zIndex: 4 }}>
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
          zIndex: 4,
        }}
      >
        <span style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: HERO_MUTED }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${HERO_GOLD}, transparent)` }}
        />
      </motion.div>

      {/* Dark scrim — sits above everything else in the hero, including copy */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 5,
        background: "#000000", opacity: 0.25,
        pointerEvents: "none",
      }} />
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
  { id: "eco-services", href: "/services", Component: ServicesSection },
  { id: "eco-blogs",   href: "/blogs",   Component: BlogsSection },
  { id: "eco-contact", href: "/contact", Component: ContactSection },
];

// Hrefs always shown on the hub even when no identity nav_links are configured.
const FALLBACK_NAV_HREFS = ["/", "/about", "/services", "/blogs", "/contact"];

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
  // Work merged into Services: a legacy "/work" nav entry still surfaces the Services section.
  const visibleSections = SECTION_MAP.filter(
    s => s.Component && (navHrefs.has(s.href) || (s.href === "/services" && navHrefs.has("/work"))),
  );
  // null = not yet checked, false = showing wall, true = wall done/skipped
  const [wallDone, setWallDone]     = useState<boolean | null>(null);
  const [heroReady, setHeroReady]   = useState(false);
  const [activeHref, setActiveHref] = useState("/");

  // On mount: decide whether to show wall or skip it. Both flags flip together
  // in the same render when skipping, so the hero renders once, fully ready —
  // no intermediate empty-then-filled frame.
  useEffect(() => {
    if (sessionStorage.getItem(WALL_KEY)) {
      setWallDone(true);
      setHeroReady(true);
    } else {
      setWallDone(false);
    }
  }, []);

  // Scroll lock only while wall is open — block scroll input directly instead
  // of toggling `overflow: hidden`, which hides/reshows the native scrollbar
  // and reflows the layout (causing the hero text to visibly shift once the
  // wall finishes). This keeps the scrollbar — and page width — constant
  // from the first frame.
  useEffect(() => {
    if (wallDone !== false) return;
    const preventScroll = (e: Event) => e.preventDefault();
    const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
    const preventKeyScroll = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll);
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
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
            setHeroReady(true);
          }} />
        )}
      </AnimatePresence>
    </div>
  );
}
