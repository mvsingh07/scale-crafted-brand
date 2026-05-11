import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { isTrialExpired } from "@/lib/supabase";
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
import NotFound from "@/pages/NotFound";
import PortfolioExpired from "@/pages/PortfolioExpired";

const THEME_CLASSES = ["light", "mono-grey", "mono-blue"] as const;

const Portfolio = () => {
  const { username } = useParams<{ username: string }>();
  const { data, loading } = useProfile(username ?? "");

  // Apply theme class to <html> and clean up on unmount
  useEffect(() => {
    const root = document.documentElement;
    THEME_CLASSES.forEach((c) => root.classList.remove(c));
    const theme = data?.profile?.theme;
    if (theme && theme !== "dark") root.classList.add(theme);
    return () => THEME_CLASSES.forEach((c) => root.classList.remove(c));
  }, [data?.profile?.theme]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!data) return <NotFound />;

  const { profile, services, projects, steps, skillGroups } = data;

  if (isTrialExpired(profile)) return <PortfolioExpired ownerName={profile.name} />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <PortfolioBackground />
      <div className="relative z-10">
        <Navbar resumeUrl={profile.resume_url} />
        <Hero profile={profile} />
        <About paragraphs={profile.about_paragraphs} />
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

export default Portfolio;
