"use client";

import { useEffect, useRef } from "react";

type P = {
  x: number; y: number; r: number;
  speed: number; opacity: number;
  tick: number; drift: number; hue: number;
};

function mkp(w: number, h: number): P {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.0 + 0.25,
    speed: Math.random() * 0.32 + 0.1,
    opacity: Math.random() * 0.2 + 0.03,
    tick: Math.random() * Math.PI * 2,
    drift: Math.random() * 0.007 + 0.002,
    hue: Math.random(), // 0 = dark gold, 1 = warm highlight
  };
}

export function HeroParticles({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ready) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let pts: P[] = Array.from({ length: 68 }, () =>
      mkp(canvas.width, canvas.height),
    );

    let raf: number;
    let alpha = 0;

    const draw = () => {
      alpha = Math.min(1, alpha + 0.006);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        // interpolate between dark gold (201,165,90) and highlight (251,240,206)
        const r = Math.round(201 + p.hue * 50);
        const g = Math.round(165 + p.hue * 75);
        const b = Math.round(90  + p.hue * 116);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity * alpha})`;
        ctx.fill();

        p.y -= p.speed;
        p.x += Math.sin(p.tick) * 0.28;
        p.tick += p.drift;

        if (p.y < -4) {
          const fresh = mkp(canvas.width, canvas.height);
          Object.assign(p, fresh, { y: canvas.height + 4 });
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [ready]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}
