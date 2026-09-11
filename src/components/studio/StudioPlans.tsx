"use client";

import { motion } from "motion/react";
import { Check, HeartHandshake, Compass, Store, Briefcase, Palette, Users, TrendingUp } from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, ChromeOrb, GOLD, GOLD_L, WHITE, MUTED, SILVER, FONT_H, FONT_ED, FONT_B, EASE } from "./shared";

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  const el = document.querySelector(href);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
  }
}

const WHO_WE_HELP = [
  { label: "Local Businesses",   icon: Store },
  { label: "Professionals",      icon: Briefcase },
  { label: "Creators",           icon: Palette },
  { label: "Organizations",      icon: Users },
  { label: "Growing Companies",  icon: TrendingUp },
];

const PLANS = [
  {
    name: "Foundation",
    tagline: "A modern, professional website built around a focused discovery conversation.",
    points: ["Business or portfolio website", "Responsive, fast, SEO-ready", "Built on a scalable foundation for what comes next"],
  },
  {
    name: "Growth",
    tagline: "A website strategically designed around your brand, audience, and goals — built to tell the business story.",
    points: ["Everything in Foundation", "Brand-led design and content strategy", "SEO + GEO foundation for AI-era discoverability"],
    featured: true,
  },
  {
    name: "Transformation",
    tagline: "A custom digital solution or software, built around detailed requirements with ongoing collaboration through development.",
    points: ["Everything in Growth", "Custom systems — CMS, CRM, automation, AI", "Iterative delivery with continuous involvement"],
  },
];

export function StudioPlans() {
  return (
    <div id="studio-plans" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", scrollMarginTop: 76 }}>
      <Reveal style={{ marginBottom: 32, maxWidth: 680 }}>
        <ChapterEyebrow n="11">Choose Your Starting Point</ChapterEyebrow>
        <SectionHeading>Depth of solution, not a page count.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: 13.5, color: MUTED, margin: "14px 0 0" }}>
          Anyone whose work deserves to be discovered, organized, and ready for what&apos;s next.
        </p>
      </Reveal>

      <Reveal delay={0.05} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 44 }}>
        {WHO_WE_HELP.map(({ label, icon: Icon }) => (
          <motion.span
            key={label}
            whileHover={{ y: -3, scale: 1.05, borderColor: `color-mix(in srgb, ${GOLD} 45%, transparent)` }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 100,
              border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
              background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
              fontFamily: FONT_B, fontSize: 12.5, color: SILVER,
            }}>
            <Icon size={13} style={{ color: GOLD }} /> {label}
          </motion.span>
        ))}
      </Reveal>

      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", marginBottom: 56 }}
      >
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: p.featured ? -6 : 0, transition: { duration: 0.6, ease: EASE } } }}
            whileHover={{ y: p.featured ? -10 : -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              position: "relative", overflow: "hidden",
              border: p.featured
                ? `1px solid color-mix(in srgb, ${GOLD} 40%, transparent)`
                : "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
              borderRadius: 18,
              background: p.featured
                ? `linear-gradient(180deg, color-mix(in srgb, ${GOLD} 6%, var(--bg-primary)), var(--bg-primary))`
                : "color-mix(in srgb, var(--text-primary) 3%, transparent)",
              padding: "28px 24px", display: "flex", flexDirection: "column",
            }}
          >
            <span aria-hidden style={{
              position: "absolute", top: 22, right: 22,
              fontFamily: FONT_ED, fontStyle: "italic", fontSize: 16,
              color: p.featured ? GOLD : "#8B93A1", opacity: 0.85,
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <ChromeOrb accent={p.featured ? GOLD : "#8B93A1"} size={40}>
              <span style={{ fontFamily: FONT_H, fontSize: 15, fontWeight: 600 }}>{i + 1}</span>
            </ChromeOrb>
            <h3 style={{ fontFamily: FONT_H, fontSize: 22, fontWeight: 600, color: WHITE, margin: "16px 0 10px", position: "relative" }}>{p.name}</h3>
            <p style={{ fontFamily: FONT_B, fontSize: 13.5, lineHeight: 1.65, color: SILVER, margin: "0 0 20px", minHeight: 66 }}>{p.tagline}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
              {p.points.map(pt => (
                <div key={pt} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <Check size={13} style={{ color: GOLD, flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: FONT_B, fontSize: 13, color: "color-mix(in srgb, var(--text-primary) 80%, transparent)" }}>{pt}</span>
                </div>
              ))}
            </div>
            <a href="#studio-contact" onClick={(e) => scrollTo(e, "#studio-contact")} style={{
              marginTop: "auto", textAlign: "center",
              fontFamily: FONT_B, fontSize: 13.5, fontWeight: 600, textDecoration: "none",
              padding: "11px 18px", borderRadius: 9,
              background: p.featured ? `linear-gradient(135deg, ${GOLD}, ${GOLD_L})` : "color-mix(in srgb, var(--text-primary) 6%, transparent)",
              color: p.featured ? "var(--bg-primary)" : WHITE,
              border: p.featured ? "none" : "1px solid color-mix(in srgb, var(--text-primary) 14%, transparent)",
            }}>
              Discuss this plan
            </a>
          </motion.div>
        ))}
      </motion.div>

      <p style={{ fontFamily: FONT_B, fontSize: 12, color: MUTED, textAlign: "center", marginBottom: 40 }}>
        Every plan starts with a conversation — final scope and pricing depend on what your business actually needs.
      </p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))" }}>
        <Reveal style={{
          display: "flex", gap: 16,
          border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)", borderRadius: 16,
          padding: "24px 22px", background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
        }}>
          <ChromeOrb accent="#34D399" size={44}><HeartHandshake size={19} /></ChromeOrb>
          <div>
            <h3 style={{ fontFamily: FONT_H, fontSize: 18, fontWeight: 600, color: WHITE, margin: "0 0 8px" }}>MV Impact</h3>
            <p style={{ fontFamily: FONT_B, fontSize: 13, lineHeight: 1.65, color: SILVER, margin: 0 }}>
              For NGOs, community organizations, and genuine public-benefit work — free, subsidized,
              or discounted support depending on the case. Details and eligibility are being finalized.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06} style={{
          display: "flex", gap: 16,
          border: "1px solid color-mix(in srgb, var(--text-primary) 9%, transparent)", borderRadius: 16,
          padding: "24px 22px", background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
        }}>
          <ChromeOrb accent="#60A5FA" size={44}><Compass size={19} /></ChromeOrb>
          <div>
            <h3 style={{ fontFamily: FONT_H, fontSize: 18, fontWeight: 600, color: WHITE, margin: "0 0 8px" }}>MV Guidance</h3>
            <p style={{ fontFamily: FONT_B, fontSize: 13, lineHeight: 1.65, color: SILVER, margin: 0 }}>
              Already have a website or system? Sometimes you don&apos;t need a rebuild — just
              someone experienced to help with hosting, domains, SEO, and the right technical calls.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
