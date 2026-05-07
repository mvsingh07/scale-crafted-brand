import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { Atelier } from "@/components/site/Atelier";
import { Journey } from "@/components/site/Journey";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { PortfolioBackground } from "@/components/site/PortfolioBackground";

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <PortfolioBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Atelier />
        <Projects />
        <Journey />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
