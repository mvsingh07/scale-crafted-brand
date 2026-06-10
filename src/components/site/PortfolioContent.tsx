"use client";
import { Suspense } from "react";
import type { FullProfile } from "@/lib/server/profile";
import { Hero } from "./Hero";
import { Personal } from "./Personal";
import { About } from "./About";
import { Services } from "./Services";
import { Projects } from "./Projects";
import { Journey } from "./Journey";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { SectionScroller } from "@/components/SectionScroller";
import dynamic from "next/dynamic";

const PortfolioBackground = dynamic(
  () => import("./PortfolioBackground").then((m) => ({ default: m.PortfolioBackground })),
  { ssr: false }
);

interface Props {
  data: FullProfile | null;
  showNavbar?: boolean;
}

// Client boundary for all portfolio sections. The parent server component fetches
// data with unstable_cache and passes it in as a serialisable prop — zero
// client-side waterfall on first load.
export function PortfolioContent({ data, showNavbar }: Props) {
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(220_18%_4%)] text-white/40 font-mono text-xs">
        Profile not found.
      </div>
    );
  }

  const { profile, services, projects, steps, skillGroups } = data;

  return (
    <main id="portfolio-root" className="relative min-h-screen overflow-hidden bg-background">
      <Suspense fallback={null}>
        <SectionScroller />
      </Suspense>
      <PortfolioBackground />
      <div className="relative z-10">
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
      </div>
    </main>
  );
}
