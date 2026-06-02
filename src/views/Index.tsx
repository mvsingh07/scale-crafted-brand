import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { Journey } from "@/components/site/Journey";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { PortfolioBackground } from "@/components/site/PortfolioBackground";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const { data } = useProfile("manvir");

  // If DB has data, use it; otherwise all components fall back to their hardcoded defaults.
  const profile = data?.profile;
  const services = data?.services;
  const projects = data?.projects;
  const steps = data?.steps;
  const skillGroups = data?.skillGroups;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <PortfolioBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero profile={profile} />
        <About paragraphs={profile?.about_paragraphs} />
        <Services services={services} />
        <Projects projects={projects} />
        <Journey steps={steps} />
        <Skills skillGroups={skillGroups} />
        <Contact profile={profile} />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
