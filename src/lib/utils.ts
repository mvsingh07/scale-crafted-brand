import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// In production, the Studio site lives on its own subdomain (proxy.ts
// rewrites studio.mvsingh.in transparently to /studio). Locally there's no
// such subdomain, so cross-links there would leave localhost entirely and
// hit the real production site instead of the Studio route running right
// here — point at the in-app route in dev instead.
export const STUDIO_URL = process.env.NODE_ENV === "development" ? "/studio" : "https://studio.mvsingh.in";
