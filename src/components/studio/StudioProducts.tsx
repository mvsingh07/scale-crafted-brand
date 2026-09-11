"use client";

import { motion } from "motion/react";
import { Boxes, HeartPulse, CalendarCheck, LayoutTemplate, ArrowRight } from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, ChromeOrb, GOLD, WHITE, MUTED, SILVER, FONT_H, FONT_B, EASE } from "./shared";

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Own products, built by the studio and offered on subscription — distinct
// from client work (Recent Work, above). No public pricing/sign-up yet, so
// each card routes to Contact rather than a live checkout link.
const PRODUCTS = [
  {
    name: "Inventory Management",
    tagline: "Manage inventory, quantity, sales, and purchases — with digital quotations and bill generation for clients.",
    icon: Boxes,
    accent: "#60A5FA",
  },
  {
    name: "Sehat-Saathi",
    tagline: "An AI health companion — hyper-personalized wellness guidance based on medical history, lifestyle, and prakriti, blending modern and ancient research.",
    icon: HeartPulse,
    accent: "#F472B6",
  },
  {
    name: "Appointment Booking System",
    tagline: "Booking and scheduling for professionals of any kind — doctors, psychologists, therapists, salons, and more.",
    icon: CalendarCheck,
    accent: "#34D399",
  },
  {
    name: "Forge Portfolios",
    tagline: "Template-based portfolio websites for professionals of any kind — live fast, without starting from scratch.",
    icon: LayoutTemplate,
    accent: "#C9A55A",
  },
];

export function StudioProducts() {
  return (
    <div id="studio-products" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", scrollMarginTop: 76 }}>
      <Reveal style={{ marginBottom: 48, maxWidth: 680 }}>
        <ChapterEyebrow n="12">Ready to Use, Today</ChapterEyebrow>
        <SectionHeading>Products built by the studio, available on subscription.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.7, margin: "16px 0 0" }}>
          Separate from custom client work — these are our own products, ready to subscribe to and use.
        </p>
      </Reveal>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))" }}
      >
        {PRODUCTS.map((p) => (
          <motion.div
            key={p.name}
            variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
            whileHover={{ y: -6, borderColor: `color-mix(in srgb, ${p.accent} 45%, transparent)` }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: "flex", flexDirection: "column", gap: 14,
              padding: "26px 24px", borderRadius: 18,
              border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
              background: "color-mix(in srgb, var(--gold-primary) 2.5%, var(--bg-primary))",
            }}
          >
            <ChromeOrb accent={p.accent} size={44}><p.icon size={19} /></ChromeOrb>
            <h3 style={{ fontFamily: FONT_H, fontSize: 18, fontWeight: 600, color: WHITE, margin: 0 }}>{p.name}</h3>
            <p style={{ fontFamily: FONT_B, fontSize: 13.5, lineHeight: 1.65, color: SILVER, margin: 0, flex: 1 }}>{p.tagline}</p>
            <a href="#studio-contact" onClick={(e) => scrollTo(e, "#studio-contact")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: FONT_B, fontSize: 13, fontWeight: 600, color: GOLD, textDecoration: "none",
            }}>
              Ask about access <ArrowRight size={13} />
            </a>
          </motion.div>
        ))}
      </motion.div>

      <p style={{ fontFamily: FONT_B, fontSize: 12, color: MUTED, textAlign: "center", marginTop: 36 }}>
        Subscription pricing and public sign-up are being finalized — reach out for early access.
      </p>
    </div>
  );
}
