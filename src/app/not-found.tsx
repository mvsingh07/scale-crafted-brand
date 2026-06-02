"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";

function useLogoSrc() {
  const [src, setSrc] = useState("/dark_mode_logo.png");
  useEffect(() => {
    const update = () =>
      setSrc(document.documentElement.getAttribute("data-theme") === "light"
        ? "/light_mode_logo.png"
        : "/dark_mode_logo.png");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return src;
}

export default function NotFound() {
  const router = useRouter();
  const logoSrc = useLogoSrc();

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      textAlign: "center",
    }}>
      <div aria-hidden style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 40%, color-mix(in srgb, var(--gold-primary) 6%, transparent) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}
      >
        <Image src={logoSrc} alt="MV Singh" width={140} height={48}
          style={{ objectFit: "contain", height: 40, width: "auto", opacity: 0.7 }} />

        <div>
          <p style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(72px, 12vw, 120px)",
            fontWeight: 700,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-highlight) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
          }}>
            404
          </p>
          <p style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(16px, 2.5vw, 24px)",
            color: "var(--text-primary)",
            marginTop: 12,
            letterSpacing: "0.08em",
          }}>
            Page Not Found
          </p>
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            color: "var(--silver)",
            marginTop: 10,
            maxWidth: 360,
            lineHeight: 1.6,
          }}>
            This path doesn&apos;t exist in the digital ecosystem.
          </p>
        </div>

        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, var(--gold-border), transparent)` }} />

        <motion.button
          onClick={() => router.push("/")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--gold-primary)",
            background: "transparent",
            border: "1px solid var(--gold-border)",
            borderRadius: 6,
            padding: "10px 28px",
            cursor: "pointer",
          }}
        >
          Return Home
        </motion.button>
      </motion.div>
    </main>
  );
}
