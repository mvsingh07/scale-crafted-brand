"use client";
import { useProfile } from "@/hooks/useProfile";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Personal } from "@/components/site/Personal";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { Journey } from "@/components/site/Journey";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { PortfolioBackground } from "@/components/site/PortfolioBackground";

// Theme and fonts come from ecosystem_theme CSS vars — no per-profile overrides

interface PortfolioProps {
  username?: string;
}

const Portfolio = ({ username = "" }: PortfolioProps) => {
  const { data, loading } = useProfile(username);
  const profile = data?.profile;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!data || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground font-mono text-xs">
        Profile not found.
      </div>
    );
  }

  const { services, projects, steps, skillGroups } = data;

  return (
    <main id="portfolio-root" className="relative min-h-screen overflow-hidden bg-background">
      <PortfolioBackground />
      <div className="relative z-10">
        <Navbar
          resumeUrl={profile.resume_url}
          resumeVisibility={profile.resume_visibility ?? "public"}
          ownerEmail={profile.email}
          ownerName={profile.name}
        />
        <Hero profile={profile} />
        <Personal imageUrl={profile.personal_image_url} headline={profile.personal_headline} details={profile.personal_details} />
        <About paragraphs={profile.about_paragraphs} />
        <Services services={services} />
        <Projects projects={projects} />
        <Journey steps={steps} storyMode={profile.story_mode} />
        <Skills skillGroups={skillGroups} />
        <Contact profile={profile} />
        <Footer />
      </div>
    </main>
  );
};

export default Portfolio;
