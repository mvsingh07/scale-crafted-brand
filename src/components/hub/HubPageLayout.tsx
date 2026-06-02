"use client";

import { useIdentity } from "@/context/identity";
import { Navbar } from "@/components/site/Navbar";

export function HubPageLayout({ children }: { children: React.ReactNode }) {
  const { identity } = useIdentity();
  const footerText = identity?.footer_text ?? "mvsingh.in · All rights reserved";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Page content */}
      <main style={{ flex: 1, paddingTop: 70 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 32px",
        borderTop: `1px solid color-mix(in srgb, var(--gold-border) 18%, transparent)`,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em",
      }}>
        <span>WWW.MVSINGH.IN</span>
        <span>{footerText}</span>
      </footer>
    </div>
  );
}
