"use client";

import Image from "next/image";
import { ChapterEyebrow, SectionHeading, Reveal, SILVER, WHITE, FONT_B, FONT_ED, GOLD } from "./shared";
import automationImage from "@/assets/automation.png";

export function StudioCultureTech() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)" }}>
      <div style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", alignItems: "center" }}>
        <Reveal>
          <ChapterEyebrow n="10">Culture + Technology</ChapterEyebrow>
          <SectionHeading>Old values. New tools.</SectionHeading>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontFamily: FONT_B, fontSize: 14, color: SILVER, lineHeight: 1.75, margin: 0 }}>
              A century-old craft can have a modern website.
            </p>
            <p style={{ fontFamily: FONT_B, fontSize: 14, color: SILVER, lineHeight: 1.75, margin: 0 }}>
              A family restaurant can have an online ordering system.
            </p>
            <p style={{ fontFamily: FONT_B, fontSize: 14, color: SILVER, lineHeight: 1.75, margin: 0 }}>
              A neighbourhood business can have a CRM.
            </p>
          </div>
          <p style={{ fontFamily: FONT_ED, fontStyle: "italic", fontSize: "clamp(16px, 2vw, 20px)", color: WHITE, lineHeight: 1.5, margin: "24px 0 0" }}>
            Digitalization shouldn&apos;t erase identity.{" "}
            <span style={{ color: GOLD }}>It should help identity travel further.</span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{
            position: "relative", minHeight: 280, borderRadius: 16, overflow: "hidden",
            border: "1px solid color-mix(in srgb, var(--gold-border) 20%, transparent)",
          }}>
            <Image
              src={automationImage}
              alt="Traditional craft and business practice paired with modern automation tools"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 500px, 100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
