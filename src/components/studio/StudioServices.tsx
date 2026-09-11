"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { Globe, Search, Bot, LayoutDashboard, CreditCard, Smartphone, Sparkles, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { EcosystemService } from "@/lib/supabase";
import { ChapterEyebrow, SectionHeading, Reveal, ChromeOrb, WHITE, MUTED, SILVER, FONT_H, FONT_ED, FONT_B, EASE } from "./shared";

const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Globe, Search, Bot, LayoutDashboard, CreditCard, Smartphone, Sparkles,
};

// A card sitting off-screen at its pre-animation x offset still contributes
// to the page's scrollable width (transforms extend the paint/scroll area
// even below the fold), so on a narrow single-column layout, sliding a
// full-width card in from the side always overflows the viewport by however
// far it slides. The side-slide only makes sense on the multi-column desktop
// grid anyway — below that, fall back to a plain vertical fade, same as
// every other card style on the page.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function ServiceCard({ service: s, index }: { service: EcosystemService; index: number }) {
  const Icon = SERVICE_ICONS[s.icon_name] ?? Sparkles;
  const num = String(index + 1).padStart(2, "0");
  // Alternating sides — each card slides in on its own, from left or right,
  // as it individually crosses into view while scrolling. A flat per-card
  // delay (not index % columns) means cards that happen to share a row
  // still land one after another rather than all at once, and — because
  // each card's whileInView still fires independently — a row further down
  // the page only starts its own cascade once the user actually scrolls it
  // into view, not the moment the section first appears.
  const fromLeft = index % 2 === 0;
  const isDesktop = useIsDesktop();
  const slideX = isDesktop ? (fromLeft ? -70 : 70) : 0;
  const slideY = isDesktop ? 24 : 32;

  // Cursor-tracked spotlight — a soft glow in the card's own accent color
  // that follows the pointer, the one "alive" surface detail standing in
  // for the tilt/float this section used to lean on.
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mx}% ${my}%, color-mix(in srgb, ${s.accent} 20%, transparent), transparent 72%)`;
  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  // A single hidden/visible pair on the card, propagated down to the accent
  // thread and icon as nested variants — rather than giving each of those
  // its own independent whileInView. Three separate IntersectionObservers
  // on elements that move as their ancestor animates in is exactly the kind
  // of setup that can miss its own trigger; inheriting one shared state from
  // the card is the pattern the rest of this page already relies on.
  const cardVariants = {
    hidden: { opacity: 0, x: slideX, y: slideY, scale: 0.95, filter: "blur(8px)" },
    visible: {
      opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 0.75, delay: index * 0.09, ease: EASE },
    },
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }}
      variants={cardVariants}
      whileHover={{ y: -6, borderColor: `color-mix(in srgb, ${s.accent} 45%, transparent)`, transition: { duration: 0.25, ease: EASE } }}
      style={{
        position: "relative", overflow: "hidden",
        border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)", borderRadius: 18,
        background: "color-mix(in srgb, var(--gold-primary) 2.5%, var(--bg-primary))",
        padding: "26px 24px", display: "flex", flexDirection: "column",
      }}
    >
      {/* Spotlight glow, dormant until hovered */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.35 }}
        style={{ position: "absolute", inset: 0, background: spotlight, pointerEvents: "none" }}
      />
      {/* Accent thread across the top — draws in left to right once the
          card has landed, echoing the roadmap line below it. */}
      <motion.span
        aria-hidden
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, delay: index * 0.09 + 0.35, ease: EASE } },
        }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2, transformOrigin: "left",
          background: `linear-gradient(90deg, transparent, ${s.accent}, transparent 90%)`,
        }}
      />

      <span aria-hidden style={{
        position: "absolute", top: 20, right: 22, zIndex: 1,
        color: s.accent, fontFamily: FONT_ED, fontStyle: "italic", fontSize: 15, opacity: 0.85,
      }}>
        {num}
      </span>

      <motion.div
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 16, delay: index * 0.09 + 0.15 } },
        }}
        style={{ position: "relative", zIndex: 1, width: "fit-content" }}
      >
        <ChromeOrb accent={s.accent} size={46}>
          <Icon size={20} />
        </ChromeOrb>
      </motion.div>

      <h3 style={{ fontFamily: FONT_H, fontSize: 20, fontWeight: 600, color: WHITE, margin: "18px 0 8px", position: "relative", zIndex: 1 }}>{s.title}</h3>
      <p style={{ fontFamily: FONT_B, fontSize: 13.5, lineHeight: 1.65, color: SILVER, margin: "0 0 18px", position: "relative", zIndex: 1 }}>{s.summary}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, position: "relative", zIndex: 1 }}>
        {s.items.map(item => (
          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <Check size={13} style={{ color: s.accent, flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontFamily: FONT_B, fontSize: 13, color: "color-mix(in srgb, var(--text-primary) 78%, transparent)", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      {s.impact && (
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: FONT_B, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: MUTED, margin: "0 0 6px" }}>
            Business Impact
          </p>
          <p style={{ fontFamily: FONT_B, fontSize: 13, lineHeight: 1.6, color: "color-mix(in srgb, var(--text-primary) 65%, transparent)", margin: 0 }}>{s.impact}</p>
        </div>
      )}
    </motion.div>
  );
}

export function StudioServices() {
  const [services, setServices] = useState<EcosystemService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("ecosystem_services")
      .select("*")
      .eq("username", OWNER)
      .eq("is_public", true)
      .order("ord", { ascending: true })
      .then(({ data }) => {
        setServices((data as EcosystemService[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div id="studio-services" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", scrollMarginTop: 76, position: "relative" }}>
      <Reveal style={{ marginBottom: 52, maxWidth: 680 }}>
        <ChapterEyebrow n="06">What We Build</ChapterEyebrow>
        <SectionHeading>Every chapter above points to one of these. Nothing here is generic.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: 13.5, color: MUTED, margin: "16px 0 0", lineHeight: 1.7 }}>
          Every engagement moves through the same pipeline — <span style={{ color: SILVER }}>understand, digitize,
          organize, automate, evolve</span> — whether it starts as a website, a system, or something in between.
        </p>
      </Reveal>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
          <div
            className="h-6 w-6 animate-spin rounded-full"
            style={{
              borderWidth: 2, borderStyle: "solid",
              borderColor: "color-mix(in srgb, var(--text-primary) 10%, transparent)",
              borderTopColor: "color-mix(in srgb, var(--text-primary) 40%, transparent)",
            }}
          />
        </div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", fontFamily: FONT_B, fontSize: 13, color: MUTED }}>
          Services loading soon.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", paddingTop: 8 }}>
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>
      )}
    </div>
  );
}
