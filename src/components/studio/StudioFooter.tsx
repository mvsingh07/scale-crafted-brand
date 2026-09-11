"use client";

import { motion } from "motion/react";
import { FONT_H, FONT_B, GOLD, SILVER, MUTED } from "./shared";

export function StudioFooter() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: "1px solid color-mix(in srgb, var(--gold-border) 14%, transparent)",
      padding: "32px clamp(18px, 4vw, 32px)",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap",
        alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <span style={{ fontFamily: FONT_H, fontSize: 15, color: SILVER }}>
          MV Singh <span style={{ color: GOLD }}>Tech Studio</span>
        </span>
        <span style={{ fontFamily: FONT_B, fontSize: 12.5, color: MUTED }}>
          © {year} MV Singh Tech Studio · Punjab, India
        </span>
        <motion.a
          href="#studio-contact"
          whileHover={{ x: 3, color: GOLD }}
          transition={{ duration: 0.2 }}
          style={{ fontFamily: FONT_B, fontSize: 12.5, color: SILVER, textDecoration: "none" }}
        >
          Contact & socials ↗
        </motion.a>
      </div>
    </footer>
  );
}
