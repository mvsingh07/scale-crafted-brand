'use client';

import React, { useId } from 'react';

interface InfinityLoaderProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Lemniscate traced as a closed cubic-bezier path.
// ViewBox: 200×100. Center crossing at (100,50).
// Left loop apex ~x=14, right loop apex ~x=186.
const PATH =
  'M 100,50 C 95,33 73,22 52,24 C 20,28 12,48 14,60 C 16,74 32,82 52,80 C 73,78 95,67 100,50 C 105,33 127,22 148,24 C 180,28 188,48 186,60 C 184,74 168,82 148,80 C 127,78 105,67 100,50 Z';

// Total animation cycle: slow, regal, continuous.
const DUR = '8s';

export function InfinityLoader({ size = 200, className, style }: InfinityLoaderProps) {
  // Stable unique IDs so multiple instances don't conflict.
  const uid = useId().replace(/:/g, '');
  const ids = {
    silver:    `${uid}s`,
    glow:      `${uid}g`,
    glowTight: `${uid}t`,
  };

  return (
    <svg
      width={size}
      height={Math.round(size / 2)}
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      role="img"
      aria-label="Loading"
    >
      <defs>
        {/* Vertical gradient → cylindrical tube depth */}
        <linearGradient id={ids.silver} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F2F2F2" />
          <stop offset="18%"  stopColor="#E0E0E0" />
          <stop offset="48%"  stopColor="#F8F8F8" />
          <stop offset="74%"  stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#8C8C8C" />
        </linearGradient>

        {/* Wide soft bloom for the outer gold aura */}
        <filter id={ids.glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tighter bloom for the mid-core */}
        <filter id={ids.glowTight} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Layer 1: dark outer shadow creates raised-metal illusion ── */}
      <path
        d={PATH}
        fill="none"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* ── Layer 2: base silver metallic body ── */}
      <path
        d={PATH}
        fill="none"
        stroke={`url(#${ids.silver})`}
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* ── Layer 3: travelling gold bloom (wide halo) ── */}
      <path
        d={PATH}
        fill="none"
        stroke="#FFD700"
        strokeWidth="13"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="190 810"
        filter={`url(#${ids.glow})`}
        opacity="0.88"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-1000"
          dur={DUR}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>

      {/* ── Layer 4: travelling gold core (medium) ── */}
      <path
        d={PATH}
        fill="none"
        stroke="#FFE55C"
        strokeWidth="11"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="90 910"
        filter={`url(#${ids.glowTight})`}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-1000"
          dur={DUR}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>

      {/* ── Layer 5: travelling bright-white hot-spot ── */}
      <path
        d={PATH}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="35 965"
        opacity="0.95"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-1000"
          dur={DUR}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>

      {/* ── Layer 6: permanent top-edge highlight → rounds the tube ── */}
      <path
        d={PATH}
        fill="none"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default InfinityLoader;
