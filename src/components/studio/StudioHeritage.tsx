"use client";

import { motion } from "motion/react";
import {
  Store, Hammer, Stethoscope, GraduationCap, Sprout, Users, Palette,
} from "lucide-react";
import { ChapterEyebrow, SectionHeading, Reveal, GOLD, SILVER, WHITE, FONT_B, FONT_ED, EASE } from "./shared";
import { AnnotatedImageReveal } from "./AnnotatedImageReveal";
import heritageImage from "@/assets/heritage-business2.png";

const WHO = [
  { icon: Store,          label: "Shopkeepers" },
  { icon: Hammer,         label: "Manufacturers" },
  { icon: Stethoscope,    label: "Doctors" },
  { icon: GraduationCap,  label: "Teachers" },
  { icon: Sprout,         label: "Farmers" },
  { icon: Users,          label: "Family businesses" },
  { icon: Palette,        label: "Creators" },
];

export function StudioHeritage() {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px) 0" }}>
        <Reveal style={{ marginBottom: 32, maxWidth: 680 }}>
          <ChapterEyebrow n="01">India, Built by People</ChapterEyebrow>
          <SectionHeading>India isn&apos;t built by corporations alone. It&apos;s built by people.</SectionHeading>
        </Reveal>
      </div>

      <AnnotatedImageReveal
        src={heritageImage}
        alt="A local Indian business — a heritage market scene"
        headlineLines={["Generations of knowledge.", "Identity that can't be manufactured."]}
        height="clamp(360px, 60vh, 640px)"
        imageOpacity={0.5}
        imagePosition="center 50%"
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px clamp(18px, 4vw, 32px) 72px" }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}
        >
          {WHO.map(({ icon: Icon, label }) => (
            <motion.span
              key={label}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
              whileHover={{ y: -3, scale: 1.04, borderColor: `color-mix(in srgb, ${GOLD} 45%, transparent)` }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 14px", borderRadius: 100,
                border: "1px solid color-mix(in srgb, var(--text-primary) 10%, transparent)",
                background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                fontFamily: FONT_B, fontSize: 12.5, color: SILVER,
              }}
            >
              <Icon size={13} style={{ color: GOLD }} /> {label}
            </motion.span>
          ))}
        </motion.div>

        <Reveal delay={0.1} style={{ maxWidth: 720 }}>
          <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 16px)", color: SILVER, lineHeight: 1.8, margin: 0 }}>
            These businesses carry something large platforms cannot manufacture:{" "}
            <span style={{ color: WHITE }}>identity, trust, relationships, and local understanding.</span>
          </p>
          <p style={{ fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(15px, 1.9vw, 19px)", color: SILVER, lineHeight: 1.7, margin: "24px 0 0" }}>
            We&apos;re starting close to home — Punjab has deeply rooted businesses, family
            enterprises, manufacturing, agriculture, and crafts. The goal is to help them
            become digitally stronger while remaining themselves.
          </p>
          <p style={{ fontFamily: FONT_B, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: GOLD, margin: "20px 0 0" }}>
            Punjab → India → the world
          </p>
        </Reveal>
      </div>
    </div>
  );
}
