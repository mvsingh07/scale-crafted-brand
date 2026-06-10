"use client";

import { Mail } from "lucide-react";
import { useIdentity } from "@/context/identity";

type Lang = "EN" | "HI" | "PA";

const RIGHTS: Record<Lang, string> = {
  EN: "All Rights Reserved",
  HI: "सर्वाधिकार सुरक्षित",
  PA: "ਸਾਰੇ ਹੱਕ ਸੁਰੱਖਿਅਤ",
};

const IDENTITY_EMAIL = "hello@mvsingh.in";

interface HubFooterProps {
  lang?: Lang;
  style?: React.CSSProperties;
}

export function HubFooter({ lang = "EN", style }: HubFooterProps) {
  const { identity } = useIdentity();
  const email = identity?.email || IDENTITY_EMAIL;

  return (
    <footer style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 32px",
      fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em",
      borderTop: "1px solid color-mix(in srgb, var(--gold-border) 18%, transparent)",
      ...style,
    }}>
      <a
        href={`mailto:${email}`}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          color: "var(--text-muted)", textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        <Mail size={11} />
        {email}
      </a>
      <span suppressHydrationWarning>{RIGHTS[lang]}, {new Date().getFullYear()}</span>
    </footer>
  );
}
