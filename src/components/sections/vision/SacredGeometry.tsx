"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import type { CSSProperties } from "react";

const PETAL = "M100,100 C92,72 92,50 100,36 C108,50 108,72 100,100 Z";

function ring(count: number, render: (i: number, angle: number) => JSX.Element) {
  return Array.from({ length: count }, (_, i) => render(i, (360 / count) * i));
}

type MandalaProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Slow the whole thing down for large ambient halos. */
  speed?: number;
  reduce?: boolean;
  /** Set false to hide the 8-petal inner ring (e.g. for the hero backdrop). */
  innerPetals?: boolean;
};

/**
 * Mandala — a counter-rotating lotus / Sri-Yantra seal (petal rings, shatkona, bindu).
 * Used as a large ambient halo behind the header and as a small seal on each shrine card.
 *
 * Rotation runs as CSS animations (not JS-driven frames) and is paused whenever the
 * mandala is out of the viewport, so idle mandalas cost nothing.
 */
export function Mandala({ size = 420, className, style, speed = 1, reduce = false, innerPetals = true }: MandalaProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  const running = !reduce && inView;

  const spin = (duration: number, dir: 1 | -1): CSSProperties =>
    reduce
      ? {}
      : {
          transformOrigin: "100px 100px",
          transformBox: "view-box",
          animation: `mandala-spin ${duration / speed}s linear infinite ${dir === -1 ? "reverse" : "normal"}`,
          animationPlayState: running ? "running" : "paused",
        };

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
      fill="none"
    >
      <defs>
        <linearGradient id="mandala-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-highlight)" />
          <stop offset="55%" stopColor="color-mix(in srgb, var(--gold-highlight) 65%, var(--gold-primary))" />
          <stop offset="100%" stopColor="var(--gold-primary)" />
        </linearGradient>
        <radialGradient id="mandala-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--gold-highlight)" />
          <stop offset="100%" stopColor="var(--gold-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer tick ring */}
      <g style={spin(160, 1)}>
        {ring(48, (i, a) => (
          <line
            key={i}
            x1="100"
            y1="14"
            x2="100"
            y2={i % 4 === 0 ? "9" : "11.5"}
            stroke="url(#mandala-gold)"
            strokeWidth={i % 4 === 0 ? 1 : 0.5}
            strokeLinecap="round"
            transform={`rotate(${a} 100 100)`}
            opacity={0.7}
          />
        ))}
        <circle cx="100" cy="100" r="84" stroke="url(#mandala-gold)" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Large lotus petals */}
      <g style={spin(120, -1)}>
        {ring(12, (i, a) => (
          <path
            key={i}
            d={PETAL}
            stroke="url(#mandala-gold)"
            strokeWidth="0.7"
            transform={`rotate(${a} 100 100)`}
            opacity={0.65}
          />
        ))}
        <circle cx="100" cy="100" r="62" stroke="url(#mandala-gold)" strokeWidth="0.5" opacity="0.35" />
      </g>

      {/* Inner petals — hidden for hero backdrop via innerPetals=false */}
      {innerPetals && (
        <g style={spin(90, 1)}>
          {ring(8, (i, a) => (
            <path
              key={i}
              d={PETAL}
              stroke="url(#mandala-gold)"
              strokeWidth="0.8"
              transform={`rotate(${a} 100 100) translate(100 100) scale(0.55) translate(-100 -100)`}
              opacity={0.8}
            />
          ))}
        </g>
      )}

      {/* Shatkona — interlocked triangles of divine union */}
      <g style={spin(70, -1)}>
        <polygon points="100,78 119,111 81,111" stroke="url(#mandala-gold)" strokeWidth="0.9" opacity="0.85" />
        <polygon points="100,122 119,89 81,89" stroke="url(#mandala-gold)" strokeWidth="0.9" opacity="0.85" />
        <circle cx="100" cy="100" r="34" stroke="url(#mandala-gold)" strokeWidth="0.5" opacity="0.45" />
      </g>

      {/* Bindu — the still center */}
      <circle cx="100" cy="100" r="14" fill="url(#mandala-core)" />
      <circle
        cx="100"
        cy="100"
        r="3.4"
        fill="var(--gold-highlight)"
        style={
          reduce
            ? { transformOrigin: "100px 100px", transformBox: "view-box" }
            : {
                transformOrigin: "100px 100px",
                transformBox: "view-box",
                animation: "bindu-pulse 3.4s ease-in-out infinite",
                animationPlayState: running ? "running" : "paused",
              }
        }
      />
    </svg>
  );
}
