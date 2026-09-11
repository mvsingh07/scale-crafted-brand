"use client";

import { ChapterEyebrow, SectionHeading, Reveal, GhostNumeral, WHITE, SILVER, FONT_B } from "./shared";

// The barest chapter on the page — one paragraph, no visual. Given the same
// oversized ghost-numeral backdrop StudioTransformation uses so it doesn't
// read as flatter than its neighbors.
export function StudioExperience() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px)", position: "relative", overflow: "hidden" }}>
      <GhostNumeral
        size="clamp(140px, 22vw, 300px)"
        style={{ position: "absolute", top: "-6%", right: "-2%", zIndex: 0, opacity: 0.4 }}
      >
        09
      </GhostNumeral>

      <Reveal style={{ maxWidth: 680, position: "relative" }}>
        <ChapterEyebrow n="09">Who&apos;s Behind It</ChapterEyebrow>
        <SectionHeading>Direct, hands-on engineering experience — not a sales layer over someone else&apos;s work.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, lineHeight: 1.8, margin: "20px 0 0" }}>
          MV Singh Tech Studio is built on <span style={{ color: WHITE }}>4 years of professional software
          engineering experience</span> working with companies across India, combined with
          hands-on experience designing and building websites and digital systems end to end.
          You work directly with the person designing and building your solution — not through
          layers of account managers.
        </p>
        <p style={{ fontFamily: FONT_B, fontSize: 13, color: SILVER, opacity: 0.75, lineHeight: 1.7, margin: "18px 0 0" }}>
          For larger engagements, work is supported by trusted collaborators as needed —
          scaled to what the project actually requires.
        </p>
      </Reveal>
    </div>
  );
}
