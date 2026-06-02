"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Reads ?section=<id> from the URL and scrolls to that element after mount.
// Must be a client component because it reads search params at runtime.
export function SectionScroller() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    document.getElementById(section)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [searchParams]);
  return null;
}
