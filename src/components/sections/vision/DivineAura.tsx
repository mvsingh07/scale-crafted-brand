"use client";

import { useEffect, useRef } from "react";

/**
 * DivineAura — a field of golden motes ascending like diya sparks / incense embers.
 * 2D canvas, GPU-light, and silent under prefers-reduced-motion.
 */
export function DivineAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type Mote = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      a: number;
      tw: number;
      ph: number;
    };

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 12,
      r: 0.6 + Math.random() * 1.9,
      vy: 0.12 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.22,
      a: 0.12 + Math.random() * 0.5,
      tw: 0.4 + Math.random() * 1.6,
      ph: Math.random() * Math.PI * 2,
    });

    let motes: Mote[] = [];

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(100, Math.max(28, Math.floor((w * h) / 16000)));
      motes = Array.from({ length: count }, () => spawn(true));
      if (reduce) {
        // Draw a single static frame so the section still feels alive.
        draw(0);
      }
    };

    let t = 0;
    const draw = (dt: number) => {
      t += dt;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of motes) {
        const tw = Math.sin(t * p.tw + p.ph) * 0.5 + 0.5;
        const alpha = p.a * (0.35 + tw * 0.65);
        const rad = p.r * 4.2;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, `rgba(232,205,140,${alpha})`);
        g.addColorStop(0.4, `rgba(201,165,90,${alpha * 0.45})`);
        g.addColorStop(1, "rgba(201,165,90,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const p of motes) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t * 0.5 + p.ph) * 0.12;
        if (p.y < -14 || p.x < -20 || p.x > w + 20) Object.assign(p, spawn(false));
      }
      draw(dt);
      frame = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(init);
    ro.observe(canvas);
    init();
    if (!reduce) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
