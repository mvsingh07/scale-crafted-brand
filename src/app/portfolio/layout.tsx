import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      <Navbar mode="portfolio" />
      {children}
      <Footer />
    </div>
  );
}
