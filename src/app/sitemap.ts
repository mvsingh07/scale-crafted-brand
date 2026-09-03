import type { MetadataRoute } from "next";

const SITE_URL = "https://mvsingh.in";

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/",              priority: 1,   changeFrequency: "weekly" },
  { path: "/home",          priority: 0.8, changeFrequency: "weekly" },
  { path: "/portfolio",     priority: 0.9, changeFrequency: "weekly" },
  { path: "/portfolio/tech",priority: 0.7, changeFrequency: "monthly" },
  { path: "/tech",          priority: 0.7, changeFrequency: "monthly" },
  { path: "/about",         priority: 0.7, changeFrequency: "monthly" },
  { path: "/services",      priority: 0.7, changeFrequency: "monthly" },
  { path: "/blogs",         priority: 0.6, changeFrequency: "weekly" },
  { path: "/vision",        priority: 0.5, changeFrequency: "monthly" },
  { path: "/brand",         priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact",       priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
