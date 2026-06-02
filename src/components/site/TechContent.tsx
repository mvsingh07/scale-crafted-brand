"use client";
import { Suspense } from "react";
import { isTrialExpired } from "@/lib/supabase";
import type { FullProfile } from "@/lib/server/profile";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Personal } from "./Personal";
import { About } from "./About";
import { Services } from "./Services";
import { Projects } from "./Projects";
import { Journey } from "./Journey";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { PortfolioBackground } from "./PortfolioBackground";
import { SectionScroller } from "@/components/SectionScroller";
import PortfolioExpired from "@/views/PortfolioExpired";

interface Props {
  data: FullProfile | null;
}

// Client boundary for the /tech route, which owns its own Navbar + Footer
// (not nested inside the portfolio layout).
export function TechContent({ data }: Props) {
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground font-mono text-xs">
        Profile not found.
      </div>
    );
  }

  const { profile, services, projects, steps, skillGroups } = data;

  if (isTrialExpired(profile)) return <PortfolioExpired ownerName={profile.name} />;

  return (
    <main id="portfolio-root" className="relative min-h-screen overflow-hidden bg-background">
      <Suspense fallback={null}>
        <SectionScroller />
      </Suspense>
      <PortfolioBackground />
      <div className="relative z-10">
        <Navbar
          mode="portfolio"
          resumeUrl={profile.resume_url}
          resumeVisibility={profile.resume_visibility ?? "public"}
          ownerEmail={profile.email}
          ownerName={profile.name}
        />
        <Hero profile={profile} />
        <Personal
          imageUrl={profile.personal_image_url}
          headline={profile.personal_headline}
          details={profile.personal_details}
        />
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
}
