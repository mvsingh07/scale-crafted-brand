import type { MetadataRoute } from "next";

// Nested under app/studio/ so this generates at /studio/sitemap.xml, which is
// exactly what studio.mvsingh.in/sitemap.xml resolves to once proxy.ts's
// host-based rewrite maps the studio subdomain onto /studio/*. Only one entry
// for now — the Studio site is a single scrolling page (see execution_plan.md
// Milestone 3 note on not building pages ahead of search-intent justification).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://studio.mvsingh.in", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];
}
