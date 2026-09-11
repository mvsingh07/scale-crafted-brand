import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

// Editorial display serif, scoped to the Studio route only — gives the story's
// big numerals and italic accent lines a distinct gallery/finance-editorial
// feel without changing the personal hub's Cinzel identity.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://studio.mvsingh.in";
const TITLE = "MV Singh Tech Studio — Digitalizing Businesses for the AI Era";
const DESCRIPTION =
  "MV Singh Tech Studio builds websites, business systems, and automation for businesses in Punjab and India — practical, scalable digital solutions built around your business, not unnecessary complexity.";

export const metadata: Metadata = {
  // Scoped to the production Studio domain rather than inherited from the
  // root layout's mvsingh.in — otherwise auto-derived asset URLs (the
  // opengraph-image route below, icons) would resolve against the wrong host.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "MV Singh Tech Studio", "website development Punjab", "business automation India",
    "custom software Punjab", "AI integration for small business", "SEO GEO Punjab",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "MV Singh Tech Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Structured data for the Studio as a service entity — separate from the
// root layout's Person JSON-LD (which identifies Manvir Singh individually).
// Deliberately omits anything implying a registered legal entity, a physical
// office, or a team (Decision #8: no company registration, no GST, no
// trademark yet) — no `legalName`, no `address`, no `employee`/`numberOfEmployees`,
// no invented `aggregateRating` or `priceRange`. `founder` links back to the
// same Person already described on mvsingh.in.
const STUDIO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "MV Singh Tech Studio",
  url: SITE_URL,
  description: DESCRIPTION,
  slogan: "Punjab → India → Beyond",
  areaServed: [
    { "@type": "AdministrativeArea", name: "Punjab, India" },
    { "@type": "Country", name: "India" },
  ],
  serviceType: [
    "Website Development",
    "Business Systems (CMS/CRM)",
    "Business Process Automation",
    "AI Integration",
    "SEO & GEO Visibility",
  ],
  founder: {
    "@type": "Person",
    name: "Manvir Singh",
    alternateName: ["MV Singh"],
    sameAs: ["https://linkedin.com/in/mvsingh02", "https://github.com/mvsingh07"],
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={fraunces.variable} style={{ background: "var(--bg-primary)", minHeight: "100vh", position: "relative" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STUDIO_JSON_LD) }}
      />
      {children}
    </div>
  );
}
