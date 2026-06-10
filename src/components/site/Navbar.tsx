"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useIdentity } from "@/context/identity";

type Lang = "EN" | "HI" | "PA";

const LANG_LABELS: Record<Lang, string> = { EN: "English", HI: "Hindi", PA: "Panjabi" };

const FALLBACK_LINKS = [
  { label: "Home",    href: "/",        order: 1 },
  { label: "About",   href: "/about",   order: 2 },
  { label: "Work",    href: "/work",    order: 3 },
  { label: "Blogs",   href: "/blog",    order: 4 },
  { label: "Contact", href: "/contact", order: 5 },
];

const PORTFOLIO_SECTIONS = [
  { label: "About",    href: "?section=about",    sectionId: "about",    order: 1 },
  { label: "Services", href: "?section=services", sectionId: "services", order: 2 },
  { label: "Work",     href: "?section=work",     sectionId: "work",     order: 3 },
  { label: "Journey",  href: "?section=journey",  sectionId: "journey",  order: 4 },
  { label: "Skills",   href: "?section=skills",   sectionId: "skills",   order: 5 },
  { label: "Contact",  href: "?section=contact",  sectionId: "contact",  order: 6 },
];

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function useLogoSrc(darkFallback: string, lightFallback: string) {
  const { identity } = useIdentity();
  const dark  = identity?.logo_dark_url  ?? darkFallback;
  const light = identity?.logo_light_url ?? lightFallback;
  const [src, setSrc] = useState(dark);
  useEffect(() => {
    const update = () =>
      setSrc(document.documentElement.getAttribute("data-theme") === "light" ? light : dark);
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [dark, light]);
  return src;
}

function useLiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function useDayDate() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const day  = d.toLocaleDateString("en-IN", { weekday: "short" });
      const date = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      setLabel(`${day}, ${date}`);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  return label;
}

// Decorative themed language dropdown
function LangDropdown({ lang, onLangChange, mobile = false }: { lang: Lang; onLangChange: (l: Lang) => void; mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const triggerStyle: React.CSSProperties = mobile ? {
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 13, letterSpacing: "0.06em",
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid color-mix(in srgb, var(--gold-border) 40%, transparent)",
    background: open
      ? "color-mix(in srgb, var(--gold-primary) 10%, transparent)"
      : "color-mix(in srgb, var(--gold-primary) 5%, transparent)",
    color: "var(--gold-primary)",
    cursor: "pointer",
  } : {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 11, letterSpacing: "0.07em",
    padding: "5px 10px",
    borderRadius: 6,
    border: "1px solid color-mix(in srgb, var(--gold-border) 40%, transparent)",
    background: open
      ? "color-mix(in srgb, var(--gold-primary) 12%, transparent)"
      : "color-mix(in srgb, var(--gold-primary) 6%, transparent)",
    color: "var(--gold-primary)",
    cursor: "pointer",
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={triggerStyle}>
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "var(--gold-primary)", flexShrink: 0,
          boxShadow: "0 0 6px var(--gold-primary)",
        }} />
        {LANG_LABELS[lang]}
        <ChevronDown
          size={mobile ? 13 : 10}
          style={{ transition: "transform 0.18s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              [mobile ? "left" : "right"]: 0,
              minWidth: 130,
              background: "var(--bg-nav)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid color-mix(in srgb, var(--gold-border) 40%, transparent)",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
              zIndex: 300,
            }}
          >
            {/* Gold accent line at top */}
            <div style={{
              height: 1,
              background: "linear-gradient(to right, transparent, var(--gold-primary), transparent)",
              opacity: 0.5,
            }} />
            {(["EN", "HI", "PA"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => { onLangChange(l); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  width: "100%", textAlign: "left",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: mobile ? 13 : 11, letterSpacing: "0.05em",
                  padding: mobile ? "10px 16px" : "8px 12px",
                  border: "none",
                  background: lang === l ? "color-mix(in srgb, var(--gold-primary) 12%, transparent)" : "transparent",
                  color: lang === l ? "var(--gold-primary)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "background 0.12s, color 0.12s",
                }}
                onMouseEnter={e => {
                  if (lang !== l) e.currentTarget.style.background = "color-mix(in srgb, var(--gold-primary) 7%, transparent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = lang === l ? "color-mix(in srgb, var(--gold-primary) 12%, transparent)" : "transparent";
                }}
              >
                {lang === l && (
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold-primary)", flexShrink: 0 }} />
                )}
                {lang !== l && <span style={{ width: 4, flexShrink: 0 }} />}
                {LANG_LABELS[l]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NavbarProps {
  resumeUrl?: string | null;
  resumeVisibility?: "public" | "private" | null;
  ownerEmail?: string | null;
  ownerName?: string | null;
  contained?: boolean;
  mode?: "main" | "portfolio";
  lang?: Lang;
  onLangChange?: (l: Lang) => void;
}

export const Navbar = ({
  ownerName,
  contained = false,
  mode = "main",
  lang,
  onLangChange,
}: NavbarProps = {}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { identity } = useIdentity();
  const logoSrc = useLogoSrc("/dark_mode_logo.png", "/light_mode_logo.png");
  const time = useLiveTime();
  const dayDate = useDayDate();
  const displayName = identity?.display_name ?? ownerName ?? "MV Singh";
  const showLang = lang !== undefined && onLangChange !== undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = mode === "portfolio"
    ? PORTFOLIO_SECTIONS
    : FALLBACK_LINKS;

  const navStyle: React.CSSProperties = {
    position: contained ? "sticky" : "fixed",
    top: 0, left: 0, right: 0, zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scrolled ? "10px 32px" : "14px 32px",
    background: "var(--bg-nav)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid var(--nav-border)",
    transition: "padding 0.3s ease",
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 13,
    letterSpacing: "0.1em",
    color: "var(--text-primary)",
    textDecoration: "none",
    transition: "color 0.2s",
  };

  const mutedStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <nav style={{ position: "relative", ...navStyle }}>
        {/* Scroll shadow */}
        <div style={{
          position: "absolute", inset: "100% 0 auto", height: 32,
          background: "linear-gradient(to bottom, color-mix(in srgb, var(--bg-primary) 40%, transparent), transparent)",
          opacity: scrolled ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none",
        }} aria-hidden />

        {/* Left: Logo + Day/Date */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image src={logoSrc} alt={displayName} width={140} height={48} priority
              style={{ objectFit: "contain", height: 34, width: "auto" }} />
          </Link>
          <span suppressHydrationWarning style={{
            ...mutedStyle,
            fontSize: 11,
            borderLeft: "1px solid color-mix(in srgb, var(--gold-border) 30%, transparent)",
            paddingLeft: 14,
          }}>
            {dayDate}
          </span>
        </div>

        {/* Center: Desktop nav links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 36 }}>
          {links.map((l) =>
            mode === "portfolio" && "sectionId" in l ? (
              <button
                key={l.href}
                onClick={() => scrollToSection((l as typeof PORTFOLIO_SECTIONS[0]).sectionId)}
                style={{ ...linkStyle, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
              >
                {l.label}
              </button>
            ) : (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}>
                {l.label}
              </Link>
            )
          )}
        </div>

        {/* Right: Time+Location | Language (landing only) | Theme */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
          <span suppressHydrationWarning style={mutedStyle}>
            🇮🇳&nbsp;Panjab&nbsp;·&nbsp;{time}
          </span>

          {showLang && <LangDropdown lang={lang} onLangChange={onLangChange} />}

          <ThemeToggle />
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", padding: 4, zIndex: 201 }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "var(--bg-primary)",
              display: "flex", flexDirection: "column",
              padding: "22px 28px 40px",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center" }}>
                <Image src={logoSrc} alt={displayName} width={140} height={48} priority
                  style={{ objectFit: "contain", height: 34, width: "auto" }} />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", padding: 4 }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {mode === "portfolio" && "sectionId" in l ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setTimeout(() => scrollToSection((l as typeof PORTFOLIO_SECTIONS[0]).sectionId), 320);
                      }}
                      style={{
                        fontFamily: "var(--font-cinzel), Cinzel, serif",
                        fontSize: "clamp(22px, 6vw, 30px)",
                        fontWeight: 400,
                        letterSpacing: "0.04em",
                        color: "var(--text-primary)",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid color-mix(in srgb, var(--gold-border) 12%, transparent)",
                        cursor: "pointer",
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 0",
                      }}
                    >
                      {l.label}
                    </button>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontFamily: "var(--font-cinzel), Cinzel, serif",
                        fontSize: "clamp(22px, 6vw, 30px)",
                        fontWeight: 400,
                        letterSpacing: "0.04em",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        display: "block",
                        padding: "10px 0",
                        borderBottom: "1px solid color-mix(in srgb, var(--gold-border) 12%, transparent)",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-primary)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
                    >
                      {l.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Bottom: lang + time + theme */}
            <div style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 20%, transparent)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {showLang && <LangDropdown lang={lang} onLangChange={onLangChange} mobile />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span suppressHydrationWarning style={mutedStyle}>
                  🇮🇳&nbsp;Panjab&nbsp;·&nbsp;{time}
                </span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
