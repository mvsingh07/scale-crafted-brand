import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#journey", label: "Journey" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
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
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand text-primary-foreground font-bold">
              M
            </span>
            <span>Manvir<span className="text-muted-foreground">.dev</span></span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            {/* <ThemeToggle /> */}
            <Button asChild variant="brand" size="sm">
              <a href="#contact">Work With Me</a>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="rounded-md p-2 text-foreground"
              onClick={() => setOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </nav>

        {open && (
          <div className="glass mt-2 rounded-2xl p-4 md:hidden animate-fade-in">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <Button asChild variant="brand" size="sm" className="w-full">
                  <a href="#contact" onClick={() => setOpen(false)}>Work With Me</a>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
