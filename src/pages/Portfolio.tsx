import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { isTrialExpired } from "@/lib/supabase";
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
import NotFound from "@/pages/NotFound";
import PortfolioExpired from "@/pages/PortfolioExpired";

const THEME_CLASSES = ["light", "mono-grey", "mono-blue"] as const;

const Portfolio = () => {
  const { username } = useParams<{ username: string }>();
  const { data, loading } = useProfile(username ?? "");

  const profile = data?.profile;

  // Apply portfolio theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    THEME_CLASSES.forEach((c) => root.classList.remove(c));
    const theme = profile?.theme;
    if (theme && theme !== "dark") root.classList.add(theme);
    return () => THEME_CLASSES.forEach((c) => root.classList.remove(c));
  }, [profile?.theme]);

  // Inject font config as a scoped <style> tag
  useEffect(() => {
    const fontConfig = profile?.font_config;
    const styleId = "portfolio-font-override";
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();
    if (!fontConfig) return;

    const titleCfg    = (fontConfig as typeof fontConfig & { title?: { family: string; size: number; color: string }; subtitle?: { family: string; size: number; color: string } }).title    ?? fontConfig.heading;
    const subtitleCfg = (fontConfig as typeof fontConfig & { title?: { family: string; size: number; color: string }; subtitle?: { family: string; size: number; color: string } }).subtitle ?? fontConfig.subheading;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #portfolio-root [data-font="hero-title"] {
        font-family: ${titleCfg.family} !important;
        color: ${titleCfg.color} !important;
      }
      #portfolio-root [data-font="hero-subtitle"] {
        font-family: ${subtitleCfg.family} !important;
        color: ${subtitleCfg.color} !important;
      }
      #portfolio-root h1:not([data-font]), #portfolio-root h2:not([data-font]) {
        font-family: ${fontConfig.heading.family} !important;
        font-size: ${fontConfig.heading.size}px !important;
        color: ${fontConfig.heading.color} !important;
      }
      #portfolio-root h3 {
        font-family: ${fontConfig.subheading.family} !important;
        font-size: ${fontConfig.subheading.size}px !important;
        color: ${fontConfig.subheading.color} !important;
      }
      #portfolio-root p:not([data-font]) {
        font-family: ${fontConfig.body.family} !important;
        font-size: ${fontConfig.body.size}px !important;
        color: ${fontConfig.body.color} !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, [profile?.font_config]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!data || !profile) return <NotFound />;

  const { services, projects, steps, skillGroups } = data;

  if (isTrialExpired(profile)) return <PortfolioExpired ownerName={profile.name} />;

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
};

export default Portfolio;
