'use client';

import { useEffect, useRef } from 'react';

interface InfinityMagicProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Lemniscate of Bernoulli parametric form
// t ∈ [0, 2π] traces the full figure-8
function lemniscate(t: number, cx: number, cy: number, a: number) {
  const d = 1 + Math.sin(t) * Math.sin(t);
  return {
    x: cx + (a * Math.cos(t)) / d,
    y: cy + (a * Math.sin(t) * Math.cos(t)) / d,
  };
}

const LOOP_MS   = 2400;  // one full circuit in ms
const TRAIL_LEN = 100;   // comet tail length (history frames)
const SPARKLE_N = 14;    // ambient twinkle points along the path

export function InfinityMagic({ size = 420, className, style }: InfinityMagicProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // HiDPI — crisp on retina
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const W   = size;
    const H   = Math.round(size / 2);
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;
    const a  = W * 0.41; // lemniscate radius — fills ~82% of width

    // Bake sparkle positions — random static t values that twinkle over time
    const sparkles = Array.from({ length: SPARKLE_N }, () => ({
      t:      Math.random() * Math.PI * 2,
      phase:  Math.random() * Math.PI * 2,
      period: 700 + Math.random() * 1100,
      r:      1.2 + Math.random() * 2,
    }));

    const trail: { x: number; y: number }[] = [];
    let rafId: number;
    const t0 = performance.now();

    function frame(now: number) {
      const elapsed = now - t0;
      const tOrb    = ((elapsed % LOOP_MS) / LOOP_MS) * Math.PI * 2;
      const orb     = lemniscate(tOrb, cx, cy, a);

      // --- update trail history ---
      trail.push({ x: orb.x, y: orb.y });
      if (trail.length > TRAIL_LEN) trail.shift();

      // --- clear to fully transparent each frame ---
      ctx.clearRect(0, 0, W, H);

      // --- additive blending for all glow layers ---
      ctx.globalCompositeOperation = 'lighter';

      // 1. COMET TRAIL
      trail.forEach((p, i) => {
        const prog  = i / TRAIL_LEN;          // 0 = tail end, 1 = orb
        const alpha = prog * prog * 0.72;
        const r     = 1.5 + prog * 9;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,   `rgba(255,235,130,${alpha})`);
        g.addColorStop(0.45,`rgba(210,155,40,${alpha * 0.38})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // 2. AMBIENT SPARKLES — static points along path that twinkle
      for (const sp of sparkles) {
        const bright = 0.5 + 0.5 * Math.sin((elapsed / sp.period) * Math.PI * 2 + sp.phase);
        if (bright < 0.15) continue;
        const pos   = lemniscate(sp.t, cx, cy, a);
        const alpha = bright * 0.65;

        // soft halo
        const gh = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, sp.r * 8);
        gh.addColorStop(0,   `rgba(255,245,180,${alpha * 0.7})`);
        gh.addColorStop(0.4, `rgba(220,170,50,${alpha * 0.25})`);
        gh.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sp.r * 8, 0, Math.PI * 2);
        ctx.fillStyle = gh;
        ctx.fill();

        // hot centre
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,220,${alpha * 0.95})`;
        ctx.fill();
      }

      // 3. ORB OUTER HALO
      const pulse = 1 + 0.11 * Math.sin(elapsed * 0.0055);
      {
        const r = 32 * pulse;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        g.addColorStop(0,   'rgba(255,250,200,0.80)');
        g.addColorStop(0.22,'rgba(255,210,60,0.52)');
        g.addColorStop(0.55,'rgba(190,130,20,0.14)');
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.shadowBlur  = 40;
        ctx.shadowColor = 'rgba(255,200,50,0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. ORB MID GLOW
      {
        const r = 13 * pulse;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        g.addColorStop(0,   'rgba(255,255,230,0.95)');
        g.addColorStop(0.5, 'rgba(255,220,80,0.45)');
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.shadowBlur  = 25;
        ctx.shadowColor = 'rgba(255,240,160,1)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. ORB HOT CORE — pure white pinpoint
      {
        const r = 4.5 * pulse;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,230,100,0)');
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.shadowBlur  = 18;
        ctx.shadowColor = 'rgba(255,255,255,1)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalCompositeOperation = 'source-over';

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', ...style }}
      aria-hidden
    />
  );
}

export default InfinityMagic;
