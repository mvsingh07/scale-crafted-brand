"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { GOLD, WHITE, FONT_H, FONT_B } from "./shared";

const LINKS = [
  { label: "What We Build", href: "#studio-services" },
  { label: "Approach",      href: "#studio-approach" },
  { label: "Plans",         href: "#studio-plans" },
  { label: "Products",      href: "#studio-products" },
  { label: "Contact",       href: "#studio-contact" },
];

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function StudioNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "var(--bg-nav)", backdropFilter: "blur(14px)",
      borderBottom: "1px solid var(--nav-border)",
    }}>
      <div style={{
        maxWidth: 1600, margin: "0 auto", padding: "16px clamp(18px, 3vw, 32px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="#top" onClick={(e) => scrollTo(e, "#top")} style={{
          fontFamily: FONT_H, fontSize: 18, fontWeight: 600, color: WHITE, textDecoration: "none",
          letterSpacing: "0.01em",
        }}>
          MV Singh <span style={{ color: GOLD }}>Tech Studio</span>
        </a>

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 32 }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)} style={{
              fontFamily: FONT_B, fontSize: 13.5, color: "color-mix(in srgb, var(--text-primary) 80%, transparent)", textDecoration: "none",
            }}>
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex md:hidden" style={{ alignItems: "center", gap: 8 }}>
          <ThemeToggle />
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(o => !o)}
            style={{ background: "none", border: "none", color: WHITE, cursor: "pointer", padding: 10, margin: -10 }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--nav-border)" }}
          >
            <div style={{ padding: "16px clamp(18px, 4vw, 32px) 24px", display: "flex", flexDirection: "column", gap: 18 }}>
              {LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={(e) => { scrollTo(e, l.href); setOpen(false); }} style={{
                  fontFamily: FONT_B, fontSize: 15, color: WHITE, textDecoration: "none",
                }}>
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
