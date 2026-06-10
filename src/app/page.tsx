"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { HubFooter } from "@/components/hub/HubFooter";

type Lang = "EN" | "HI" | "PA";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const SILVER = "var(--silver)";
const WHITE = "var(--text-primary)";
const MUTED_WHITE = "var(--text-muted)";
const BLACK = "var(--bg-primary)";
const BORDER_GOLD = "var(--gold-border)";

const DIGITAL_DATE = new Date("2023-01-02");

const T = {
  EN: {
    counterLabel: "Creating Impact in the Digital World Since",
    hero: [
      { title: "MV Singh",          subtitle: "Igniting Innovation through continuous learning" },
      { title: "Digital Architect", subtitle: "Crafting immersive digital experiences that blend creativity and technology." },
      { title: "AI Strategist",     subtitle: "Empowering businesses to harness the transformative potential of AI for growth and innovation." },
    ],
    footerRight: "All Rights Reserved",
  },
  HI: {
    counterLabel: "डिजिटल दुनिया में प्रभाव बनाते हुए",
    hero: [
      { title: "एमवी सिंह",          subtitle: "निरंतर सीखने के माध्यम से नवाचार को प्रज्वलित करना" },
      { title: "डिजिटल आर्किटेक्ट", subtitle: "रचनात्मकता और प्रौद्योगिकी को मिलाकर इमर्सिव डिजिटल अनुभव बनाना।" },
      { title: "AI रणनीतिकार",       subtitle: "विकास के लिए AI की संभावनाओं का उपयोग कर व्यवसायों को सशक्त बनाना।" },
    ],
    footerRight: "सर्वाधिकार सुरक्षित",
  },
  PA: {
    counterLabel: "ਡਿਜੀਟਲ ਦੁਨੀਆ ਵਿੱਚ ਪ੍ਰਭਾਵ ਬਣਾਉਂਦੇ ਹੋਏ",
    hero: [
      { title: "ਐੱਮ ਵੀ ਸਿੰਘ",       subtitle: "ਨਿਰੰਤਰ ਸਿੱਖਣ ਰਾਹੀਂ ਨਵੀਨਤਾ ਨੂੰ ਜਗਾਉਣਾ" },
      { title: "ਡਿਜੀਟਲ ਆਰਕੀਟੈਕਟ", subtitle: "ਰਚਨਾਤਮਕਤਾ ਅਤੇ ਤਕਨਾਲੋਜੀ ਨੂੰ ਜੋੜ ਕੇ ਡਿਜੀਟਲ ਅਨੁਭਵ ਬਣਾਉਣਾ।" },
      { title: "AI ਰਣਨੀਤੀਕਾਰ",      subtitle: "ਵਿਕਾਸ ਲਈ AI ਦੀ ਸੰਭਾਵਨਾ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ।" },
    ],
    footerRight: "ਸਾਰੇ ਹੱਕ ਸੁਰੱਖਿਅਤ",
  },
} as const;

function elapsedStr(from: Date): string {
  const diff = Date.now() - from.getTime();
  const totalS = Math.floor(diff / 1000);
  const s = totalS % 60;
  const m = Math.floor(totalS / 60) % 60;
  const h = Math.floor(totalS / 3600) % 24;
  const d = Math.floor(totalS / 86400) % 365;
  const y = Math.floor(totalS / (365 * 86400));
  return `${y}y · ${d}d · ${h}h · ${m}m · ${s}s`;
}

// ── Wall opening intro ────────────────────────────────────────────────────────
function WallScreen({ onDone }: { onDone: () => void }) {
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

// ── Existence counter ─────────────────────────────────────────────────────────
function ExistenceCounter({ from, delay, lang }: { from: Date; delay: number; lang: Lang }) {
  const [curr, setCurr] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const initial = elapsedStr(from);
    setCurr(initial);
    setSnapshot(initial);
    const id = setInterval(() => setCurr(elapsedStr(from)), 1000);
    return () => clearInterval(id);
  }, [from]);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), (delay + 1.6) * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  const segStyle: React.CSSProperties = {
    fontFamily: "var(--font-cinzel), Cinzel, system-ui, serif",
    fontSize: "clamp(18px, 2.4vw, 28px)",
    letterSpacing: "0.14em",
    color: WHITE,
  };

  const segments = snapshot ? snapshot.split(" · ") : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: "center" }}
    >
      <p style={{
        color: SILVER,
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
        fontSize: "clamp(11px, 1.2vw, 14px)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        marginBottom: 18,
      }}>
        {T[lang].counterLabel}
      </p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", flexWrap: "wrap", minHeight: "1.4em" }}>
        {revealed ? (
          <span suppressHydrationWarning style={segStyle}>{curr}</span>
        ) : (
          segments.map((seg, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "baseline" }}>
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)", y: 14 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.65, delay: delay + 0.15 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                style={segStyle}
              >
                {seg}
              </motion.span>
              {i < segments.length - 1 && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                  transition={{ duration: 0.4, delay: delay + 0.35 + i * 0.13 }}
                  style={{ ...segStyle, color: BORDER_GOLD, margin: "0 0.5em" }}
                >·</motion.span>
              )}
            </span>
          ))
        )}
      </div>
    </motion.div>
  );
}

function Screen2({ lang }: { lang: Lang }) {
  return (
    <section style={{
      height: "100vh", scrollSnapAlign: "start",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 32px", background: BLACK, position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 50%, color-mix(in srgb, var(--gold-primary) 7%, transparent) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      <motion.div
        style={{ position: "relative", zIndex: 1 }}
        initial={{ scale: 1.22, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <ExistenceCounter from={DIGITAL_DATE} delay={0.4} lang={lang} />
      </motion.div>
    </section>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function WordReveal({ text, gold = false, wordStyles = [], baseDelay = 0 }: {
  text: string; gold?: boolean; wordStyles?: React.CSSProperties[]; baseDelay?: number;
}) {
  const goldStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };
  return (
    <span>
      {text.split(" ").map((word, i) => {
        const style: React.CSSProperties = wordStyles[i] ?? (gold ? goldStyle : {});
        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.75, delay: baseDelay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "inline-block", marginRight: "0.28em", ...style }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

type HeroState = 0 | 1 | 2;
const HERO_GOLD = [false, true, true] as const;

function getWordStyles(stateIndex: number, title: string): React.CSSProperties[] {
  if (stateIndex !== 0) return [];
  const words = title.split(" ");
  return words.map((_, i) => i < words.length - 1 ? { color: GOLD } : { color: SILVER });
}

function Screen3({
  heroState, setHeroState, autoPlay, lang,
}: {
  heroState: HeroState;
  setHeroState: React.Dispatch<React.SetStateAction<HeroState>>;
  autoPlay: boolean;
  lang: Lang;
}) {
  const [autoDone, setAutoDone] = useState(true);
  const heroText = T[lang].hero[heroState];
  const isGold = HERO_GOLD[heroState];

  useEffect(() => {
    if (!autoPlay) return;
    setAutoDone(false);
    const ts = [
      setTimeout(() => setHeroState(1), 3000),
      setTimeout(() => setHeroState(2), 6000),
      setTimeout(() => { setHeroState(0); setAutoDone(true); }, 9000),
    ];
    return () => ts.forEach(clearTimeout);
  }, [autoPlay, setHeroState]);

  const handleClick = useCallback(() => {
    if (!autoDone) return;
    setHeroState((s) => ((s + 1) % 3) as HeroState);
  }, [autoDone, setHeroState]);

  return (
    <section
      onClick={handleClick}
      style={{
        height: "100vh", scrollSnapAlign: "start",
        position: "relative", background: BLACK,
        cursor: autoDone ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 40%, color-mix(in srgb, var(--gold-primary) 5%, transparent) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "90px 24px 120px", textAlign: "center",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${heroState}-${lang}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
          >
            <h1 style={{
              fontFamily: "var(--font-cinzel), Cinzel, system-ui, serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600, lineHeight: 1.15, margin: 0, color: WHITE,
            }}>
              <WordReveal
                text={heroText.title}
                gold={isGold}
                wordStyles={getWordStyles(heroState, heroText.title)}
                baseDelay={0}
              />
            </h1>
            <p style={{
              fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
              fontSize: "clamp(15px, 2vw, 22px)",
              color: SILVER, maxWidth: 620, lineHeight: 1.65, margin: 0,
            }}>
              <WordReveal text={heroText.subtitle} baseDelay={0.35} />
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute", bottom: 80,
            left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 12, alignItems: "center",
          }}
        >
          {([0, 1, 2] as HeroState[]).map((i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); if (autoDone) setHeroState(i); }}
              aria-label={`State ${i + 1}`}
              style={{
                width: 24, height: 8, borderRadius: 4,
                border: "none", cursor: autoDone ? "pointer" : "default",
                background: "color-mix(in srgb, var(--silver) 25%, transparent)",
                padding: 0, position: "relative", overflow: "hidden", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", inset: 0, borderRadius: 4,
                background: GOLD, transformOrigin: "left",
                transform: heroState === i ? "scaleX(1)" : "scaleX(0)",
                opacity: heroState === i ? 1 : 0,
                transition: "transform 0.3s ease, opacity 0.3s ease",
              }} />
            </button>
          ))}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <HubFooter lang={lang} style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function HubPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<Lang>("EN");
  const [portalDone, setPortalDone] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [heroAutoPlay, setHeroAutoPlay] = useState(false);
  const [heroState, setHeroState] = useState<HeroState>(0);

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

  const scrollToHero = useCallback(() => {
    scrollRef.current?.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!portalDone || !loaderVisible) return;
    const t = setTimeout(() => {
      scrollToHero();
      setTimeout(() => {
        setLoaderVisible(false);
        setHeroAutoPlay(true);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
        });
      }, 900);
    }, 1500);
    return () => clearTimeout(t);
  }, [portalDone, loaderVisible, scrollToHero]);

  return (
    <main style={{ background: BLACK, width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Navbar lang={lang} onLangChange={setLang} />
      <div
        ref={scrollRef}
        className="hub-scroller"
        style={{ position: "fixed", inset: 0, overflowY: "scroll", scrollSnapType: "y mandatory" }}
      >
        {loaderVisible && <Screen2 lang={lang} />}
        <Screen3
          heroState={heroState}
          setHeroState={setHeroState}
          autoPlay={heroAutoPlay}
          lang={lang}
        />
      </div>

      <AnimatePresence>
        {!portalDone && <WallScreen onDone={() => setPortalDone(true)} />}
      </AnimatePresence>
    </main>
  );
}
