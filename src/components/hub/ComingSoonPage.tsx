"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { HubPageLayout } from "./HubPageLayout";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const SILVER = "var(--silver)";
const WHITE = "var(--text-primary)";
const BORDER_GOLD = "var(--gold-border)";

interface ComingSoonPageProps {
  title: string;
  eyebrow: string;
  description: string;
}

export function ComingSoonPage({ title, eyebrow, description }: ComingSoonPageProps) {
  return (
    <HubPageLayout>
      <div style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Ambient */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, color-mix(in srgb, var(--gold-primary) 4%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 1, maxWidth: 560 }}
        >
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: GOLD, marginBottom: 20,
          }}>
            {eyebrow}
          </p>

          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(40px, 6vw, 64px)",
            fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: "0 0 24px",
          }}>
            {title}
          </h1>

          {/* Animated gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 1,
              background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
              marginBottom: 28,
              transformOrigin: "center",
            }}
          />

          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: SILVER, lineHeight: 1.7, marginBottom: 40,
          }}>
            {description}
          </p>

          {/* Coming soon badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid color-mix(in srgb, var(--gold-border) 35%, transparent)`,
            borderRadius: 100,
            padding: "8px 20px",
            background: "color-mix(in srgb, var(--gold-primary) 5%, transparent)",
            marginBottom: 40,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 8px ${GOLD}`,
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
              color: GOLD,
            }}>
              Coming Soon
            </span>
          </div>

          <div>
            <Link href="/contact" style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13, letterSpacing: "0.1em",
              color: SILVER, textDecoration: "none",
              borderBottom: `1px solid color-mix(in srgb, var(--gold-border) 40%, transparent)`,
              paddingBottom: 2,
            }}>
              Get notified — reach out →
            </Link>
          </div>
        </motion.div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
      </div>
    </HubPageLayout>
  );
}
