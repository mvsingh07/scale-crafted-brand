import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
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

const Portfolio = () => {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error } = useProfile(username ?? "");

  useEffect(() => {
    if (!data) return;
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (error || !data) {
    return <Navigate to="/" replace />;
  }

  const { profile, services, projects, steps, skillGroups } = data;

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
