"use client";

import { motion } from "motion/react";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props { ready: boolean; startDelay?: number }

export function DivineBranchWave({ ready, startDelay = 1.5 }: Props) {
  const d = startDelay;

  return (
    <div
      aria-hidden
      style={{
        width: "min(560px, 80vw)",
        margin: "0 auto",
        lineHeight: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 560 20"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      >
        <defs>
          {/* Line: transparent edges → subtle gold → bright centre */}
          <linearGradient id="orb-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#c9a55a" stopOpacity={0} />
            <stop offset="22%"  stopColor="#c9a55a" stopOpacity={0.35} />
            <stop offset="46%"  stopColor="#e8d5a0" stopOpacity={0.7} />
            <stop offset="50%"  stopColor="#ffffff"  stopOpacity={0.9} />
            <stop offset="54%"  stopColor="#e8d5a0" stopOpacity={0.7} />
            <stop offset="78%"  stopColor="#c9a55a" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#c9a55a" stopOpacity={0} />
          </linearGradient>

          {/* Orb corona blur */}
          <filter id="orb-corona" x="-500%" y="-500%" width="1100%" height="1100%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          {/* Orb mid-glow blur */}
          <filter id="orb-mid" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* ── Line — expands from centre ───────────────────────────────────── */}
        <motion.g
          initial={{ scaleX: 0, opacity: 0 }}
          animate={ready ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ delay: d, duration: 0.9, ease: E }}
          style={{ transformOrigin: "280px 10px" }}
        >
          <line x1={0} y1={10} x2={560} y2={10}
            stroke="url(#orb-line)" strokeWidth={0.8} />
        </motion.g>

        {/* ── Orb corona ───────────────────────────────────────────────────── */}
        <motion.g
          filter="url(#orb-corona)"
          initial={{ scale: 0, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: d + 0.5, duration: 0.7, ease: E }}
          style={{ transformOrigin: "280px 10px" }}
        >
          <circle cx={280} cy={10} r={9} fill="#b8860b" opacity={0.55} />
        </motion.g>

        {/* ── Orb mid glow ─────────────────────────────────────────────────── */}
        <motion.g
          filter="url(#orb-mid)"
          initial={{ scale: 0, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: d + 0.52, duration: 0.6, ease: E }}
          style={{ transformOrigin: "280px 10px" }}
        >
          <circle cx={280} cy={10} r={5} fill="#d4a017" opacity={0.85} />
        </motion.g>

        {/* ── Orb core (solid, bright) ──────────────────────────────────────── */}
        <motion.circle
          cx={280} cy={10} r={2.8}
          fill="#f5dfa0"
          initial={{ scale: 0, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: d + 0.55, duration: 0.45, ease: E }}
          style={{ transformOrigin: "280px 10px" }}
        />
      </svg>
    </div>
  );
}
