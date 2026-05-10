import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/lib/supabase";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 30 };

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
}

export const Navbar = ({ resumeUrl: resumeUrlProp }: NavbarProps = {}) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchedResumeUrl, setFetchedResumeUrl] = useState<string | null>(null);

  const resumeUrl = resumeUrlProp !== undefined ? resumeUrlProp : fetchedResumeUrl;

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

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <motion.a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0, scale: 0.95 }}
                  transition={SPRING}
                >
                  {l.label}
                </motion.a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            {resumeUrl && (
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
              >
                <Download size={11} />
                Resume
              </motion.a>
            )}
            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Button asChild variant="brand" size="sm">
                <a href="#contact">Work With Me</a>
              </Button>
            </motion.div>
          </div>

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

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleY: 0.97 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -8, scaleY: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ originY: 0 }}
              className="glass mt-2 rounded-2xl p-4 md:hidden"
            >
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <motion.a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      whileHover={{ x: 4 }}
                      transition={SPRING}
                    >
                      {l.label}
                    </motion.a>
                  </li>
                ))}
                {resumeUrl && (
                  <li>
                    <motion.a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      whileHover={{ x: 4 }}
                      transition={SPRING}
                    >
                      <Download size={13} />
                      Resume
                    </motion.a>
                  </li>
                )}
                <li className="pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={SPRING}>
                    <Button asChild variant="brand" size="sm" className="w-full">
                      <a href="#contact" onClick={() => setOpen(false)}>Work With Me</a>
                    </Button>
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
