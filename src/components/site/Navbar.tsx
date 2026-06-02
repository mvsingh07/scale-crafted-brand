"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";
import { useIdentity } from "@/context/identity";

type Lang = "EN" | "HI" | "PA";

const LANG_LABELS: Record<Lang, string> = { EN: "EN", HI: "हिंदी", PA: "ਪੰਜਾਬੀ" };

const FALLBACK_LINKS = [
  { label: "About",     href: "/about",     order: 1 },
  { label: "Portfolio", href: "/portfolio", order: 2 },
  { label: "Services",  href: "/services",  order: 3 },
  { label: "Blog",      href: "/blog",      order: 4 },
  { label: "Contact",   href: "/contact",   order: 5 },
];

const PORTFOLIO_SECTIONS = [
  { label: "About",    href: "?section=about",    order: 1 },
  { label: "Services", href: "?section=services", order: 2 },
  { label: "Work",     href: "?section=work",     order: 3 },
  { label: "Journey",  href: "?section=journey",  order: 4 },
  { label: "Skills",   href: "?section=skills",   order: 5 },
  { label: "Contact",  href: "?section=contact",  order: 6 },
];

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = mode === "portfolio"
    ? PORTFOLIO_SECTIONS
    : (identity?.nav_links
        ? [...identity.nav_links].sort((a, b) => a.order - b.order)
        : FALLBACK_LINKS);

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
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: Time+Location | Language (landing only) | Theme */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
          {/* Time + country */}
          <span suppressHydrationWarning style={mutedStyle}>
            🇮🇳&nbsp;India&nbsp;·&nbsp;{time}
          </span>

          {/* Language toggle — landing page only */}
          {showLang && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px", border: "1px solid color-mix(in srgb, var(--gold-border) 30%, transparent)", borderRadius: 8 }}>
              {(["EN", "HI", "PA"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onLangChange(l)}
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background: lang === l
                      ? "color-mix(in srgb, var(--gold-primary) 18%, transparent)"
                      : "transparent",
                    color: lang === l ? "var(--gold-primary)" : "var(--text-muted)",
                    transition: "background 0.15s, color 0.15s",
                    fontWeight: lang === l ? 500 : 400,
                  }}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          )}

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

      {/* Full-screen mobile menu — slides down from top */}
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

            {/* Nav links — large */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
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
                </motion.div>
              ))}
            </div>

            {/* Bottom: lang + time + theme */}
            <div style={{ borderTop: "1px solid color-mix(in srgb, var(--gold-border) 20%, transparent)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Language toggle (landing only) */}
              {showLang && (
                <div style={{ display: "flex", gap: 6 }}>
                  {(["EN", "HI", "PA"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => onLangChange(l)}
                      style={{
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        fontSize: 12,
                        padding: "5px 14px",
                        borderRadius: 8,
                        border: `1px solid ${lang === l ? "var(--gold-primary)" : "color-mix(in srgb, var(--gold-border) 30%, transparent)"}`,
                        background: lang === l ? "color-mix(in srgb, var(--gold-primary) 12%, transparent)" : "transparent",
                        color: lang === l ? "var(--gold-primary)" : "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span suppressHydrationWarning style={mutedStyle}>
                  🇮🇳&nbsp;India&nbsp;·&nbsp;{time}
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
