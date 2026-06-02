"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { useIdentity } from "@/context/identity";

export const Footer = () => {
  const { identity } = useIdentity();

  const footerText = identity?.footer_text ?? `© ${new Date().getFullYear()} Manvir Singh — Engineering at scale.`;
  const socials = [
    identity?.linkedin_url ? { href: identity.linkedin_url, icon: Linkedin, label: "LinkedIn" } : null,
    identity?.github_url   ? { href: identity.github_url,   icon: Github,   label: "GitHub"   } : null,
    identity?.twitter_url  ? { href: identity.twitter_url,  icon: Twitter,  label: "Twitter"  } : null,
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string }[];

  return (
    <footer data-reveal className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-gradient-brand text-[11px] font-bold text-primary-foreground">M</span>
          <span className="font-mono">{footerText}</span>
        </div>
        <div className="flex items-center gap-4">
          {socials.length > 0
            ? socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  <s.icon size={15} />
                </a>
              ))
            : <span className="font-mono text-xs">Designed & built with intent.</span>
          }
        </div>
      </div>
    </footer>
  );
};
