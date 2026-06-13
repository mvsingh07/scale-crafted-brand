'use client';

import React, { useId } from 'react';

interface InfinityFlashProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const PATH =
  'M 100,50 C 95,33 73,22 52,24 C 20,28 12,48 14,60 C 16,74 32,82 52,80 C 73,78 95,67 100,50 C 105,33 127,22 148,24 C 180,28 188,48 186,60 C 184,74 168,82 148,80 C 127,78 105,67 100,50 Z';

// Fast: one full loop every 2 seconds.
const DUR = '2s';

export function InfinityFlash({ size = 200, className, style }: InfinityFlashProps) {
  const uid = useId().replace(/:/g, '');
  const ids = { bloom: `${uid}b`, core: `${uid}c` };

  return (
    <svg
      width={size}
      height={Math.round(size / 2)}
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden
    >
      <defs>
        {/* Wide outer bloom */}
        <filter id={ids.bloom} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tight inner core glow */}
        <filter id={ids.core} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Layer 1: wide gold aura — largest, softest */}
      <path
        d={PATH}
        fill="none"
        stroke="#C9A550"
        strokeWidth="18"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="160 840"
        filter={`url(#${ids.bloom})`}
        opacity="0.7"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0" to="-1000"
          dur={DUR}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>

      {/* Layer 2: gold mid-core */}
      <path
        d={PATH}
        fill="none"
        stroke="#FFD700"
        strokeWidth="10"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="80 920"
        filter={`url(#${ids.core})`}
        opacity="0.95"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0" to="-1000"
          dur={DUR}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>

      {/* Layer 3: white-hot leading tip */}
      <path
        d={PATH}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="1000"
        strokeDasharray="28 972"
        opacity="1"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0" to="-1000"
          dur={DUR}
          repeatCount="indefinite"
          calcMode="linear"
        />
      </path>
    </svg>
  );
}

export default InfinityFlash;
