import { useEffect, useState } from "react";
import { Menu, X, Download, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/lib/supabase";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 30 };
const PILL_SPRING = { type: "spring" as const, stiffness: 380, damping: 28 };

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

interface NavbarProps {
  resumeUrl?: string | null;
  resumeVisibility?: "public" | "private" | null;
  ownerEmail?: string | null;
  ownerName?: string | null;
}

export const Navbar = ({
  resumeUrl: resumeUrlProp,
  resumeVisibility = "public",
  ownerEmail,
  ownerName,
}: NavbarProps = {}) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchedResumeUrl, setFetchedResumeUrl] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [hoveredMobileLink, setHoveredMobileLink] = useState<string | null>(null);

  const resumeUrl = resumeUrlProp !== undefined ? resumeUrlProp : fetchedResumeUrl;

  const requestCvHref = ownerEmail
    ? `mailto:${ownerEmail}?subject=CV%20Request${ownerName ? `%20%E2%80%94%20${encodeURIComponent(ownerName)}` : ""}&body=Hi%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20see%20your%20CV.%20Could%20you%20please%20share%20it%3F%0A%0AThanks!`
    : "#contact";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (resumeUrlProp !== undefined) return;
    supabase
      .from("profiles")
      .select("resume_url")
      .not("resume_url", "is", null)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.resume_url) setFetchedResumeUrl(data.resume_url);
      });
  }, [resumeUrlProp]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container">
        <nav
          className={`glass flex items-center justify-between rounded-full px-5 py-3 shadow-elegant transition-all duration-500 ${
            scrolled ? "bg-background/72" : "bg-background/48"
          }`}
        >
          {/* Logo */}
          <motion.a
            href="#top"
            className="flex items-center gap-2 font-display text-lg font-semibold"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand text-primary-foreground font-bold">
              M
            </span>
            <span>Manvir<span className="text-muted-foreground">.dev</span></span>
          </motion.a>

          {/* Desktop nav links */}
          <ul
            className="hidden items-center gap-0.5 md:flex"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {links.map((l) => (
              <li key={l.href} className="relative">
                {/* Sliding gradient pill — shared layoutId makes it glide between items */}
                <AnimatePresence>
                  {hoveredLink === l.href && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="pointer-events-none absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={PILL_SPRING}
                      style={{
                        background:
                          "linear-gradient(120deg, hsl(199 100% 64% / 0.14) 0%, hsl(256 92% 76% / 0.12) 100%)",
                        boxShadow:
                          "inset 0 0 0 1px hsl(199 100% 64% / 0.2), 0 0 20px -5px hsl(199 100% 64% / 0.28)",
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.a
                  href={l.href}
                  className="relative z-10 block rounded-full px-4 py-2 text-sm"
                  onHoverStart={() => setHoveredLink(l.href)}
                  animate={{
                    color:
                      hoveredLink === l.href
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground))",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                >
                  {l.label}
                </motion.a>
              </li>
            ))}
          </ul>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              {resumeUrl && resumeVisibility === "public" ? (
                <Button asChild variant="brand" size="sm">
                  <a href={resumeUrl} target="_blank" rel="noreferrer">
                    <Download size={13} className="mr-1" />
                    Download CV
                  </a>
                </Button>
              ) : resumeUrl && resumeVisibility === "private" ? (
                <Button asChild variant="brand" size="sm">
                  <a href={requestCvHref}>
                    <Mail size={13} className="mr-1" />
                    Request CV
                  </a>
                </Button>
              ) : (
                <Button asChild variant="brand" size="sm">
                  <a href="#contact">Work With Me</a>
                </Button>
              )}
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              className="rounded-md p-2 text-foreground"
              onClick={() => setOpen((s) => !s)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              transition={SPRING}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.97 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ originY: 0 }}
              className="glass mt-2 rounded-2xl p-4 md:hidden"
              onMouseLeave={() => setHoveredMobileLink(null)}
            >
              <ul className="flex flex-col gap-0.5">
                {links.map((l) => (
                  <li key={l.href} className="relative">
                    {/* Mobile gradient highlight */}
                    <AnimatePresence>
                      {hoveredMobileLink === l.href && (
                        <motion.span
                          layoutId="mobile-nav-pill"
                          className="pointer-events-none absolute inset-0 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={PILL_SPRING}
                          style={{
                            background:
                              "linear-gradient(90deg, hsl(199 100% 64% / 0.12) 0%, hsl(256 92% 76% / 0.08) 100%)",
                            boxShadow: "inset 0 0 0 1px hsl(199 100% 64% / 0.15)",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="relative z-10 block rounded-lg px-3 py-2 text-sm"
                      onHoverStart={() => setHoveredMobileLink(l.href)}
                      animate={{
                        color:
                          hoveredMobileLink === l.href
                            ? "hsl(var(--foreground))"
                            : "hsl(var(--muted-foreground))",
                        x: hoveredMobileLink === l.href ? 4 : 0,
                      }}
                      transition={SPRING}
                    >
                      {l.label}
                    </motion.a>
                  </li>
                ))}
                <li className="pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                    {resumeUrl && resumeVisibility === "public" ? (
                      <Button asChild variant="brand" size="sm" className="w-full">
                        <a href={resumeUrl} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                          <Download size={13} className="mr-1" />
                          Download CV
                        </a>
                      </Button>
                    ) : resumeUrl && resumeVisibility === "private" ? (
                      <Button asChild variant="brand" size="sm" className="w-full">
                        <a href={requestCvHref} onClick={() => setOpen(false)}>
                          <Mail size={13} className="mr-1" />
                          Request CV
                        </a>
                      </Button>
                    ) : (
                      <Button asChild variant="brand" size="sm" className="w-full">
                        <a href="#contact" onClick={() => setOpen(false)}>Work With Me</a>
                      </Button>
                    )}
                  </motion.div>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
