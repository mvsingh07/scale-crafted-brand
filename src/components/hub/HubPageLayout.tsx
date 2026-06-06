"use client";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export function HubPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: 70 }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
