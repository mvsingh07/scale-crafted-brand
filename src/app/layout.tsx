import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import { unstable_cache } from "next/cache";
import "@/index.css";
import { Providers } from "./providers";
import { IdentityProvider } from "@/context/identity-provider";
import { supabase } from "@/lib/supabase";
import type { IdentityProfile } from "@/lib/supabase";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const getEcosystemTheme = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("ecosystem_theme")
      .select("*")
      .eq("username", "mvsingh")
      .single();
    return data ?? null;
  },
  ["ecosystem-theme"],
  { tags: ["ecosystem-theme"], revalidate: 3600 }
);

const getIdentityProfile = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("identity_profile")
      .select("*")
      .eq("username", "mvsingh")
      .single();
    return data ?? null;
  },
  ["identity-profile"],
  { tags: ["identity-profile"], revalidate: 3600 }
);

export const metadata: Metadata = {
  title: "Manvir Singh",
  description: "Personal Digital Ecosystem — Engineer · Builder · Creator",
  icons: {
    icon: "/light_mode_logo.png",
    apple: "/light_mode_logo.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, identity] = await Promise.all([
    getEcosystemTheme(),
    getIdentityProfile(),
  ]);

  const cssVars = theme
    ? `
    --bg-primary: ${theme.bg_primary};
    --bg-secondary: ${theme.bg_secondary};
    --gold-primary: ${theme.gold_primary};
    --gold-highlight: ${theme.gold_highlight};
    --gold-border: ${theme.gold_border};
    --silver: ${theme.silver};
    --text-primary: ${theme.text_primary};
    --text-muted: ${theme.text_muted};
    --font-heading: '${theme.font_heading}', serif;
    --font-body: '${theme.font_body}', sans-serif;
    --border-radius-site: ${theme.border_radius};
  `
    : "";

  return (
    <html
      lang="en"
      data-theme={theme?.default_mode ?? "dark"}
      className={`${cinzel.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {cssVars && <style>{`@layer ecosystem-theme { :root { ${cssVars} } }`}</style>}
        {/* Prevent flash of wrong theme — reads localStorage before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('mv-theme')||localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}else if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}else if(t==='system'||!t){var d=window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}}catch(e){}` }} />
      </head>
      <body>
        <IdentityProvider initial={identity as IdentityProfile | null}>
          <Providers>{children}</Providers>
        </IdentityProvider>
      </body>
    </html>
  );
}
