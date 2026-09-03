import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Manvir Singh (MV Singh) — Portfolio",
  description: "Portfolio of Manvir Singh (MV Singh) — backend architecture, scalable microservices, real-time systems, and AI-native products.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      <Navbar mode="portfolio" />
      {children}
      <Footer />
    </div>
  );
}
