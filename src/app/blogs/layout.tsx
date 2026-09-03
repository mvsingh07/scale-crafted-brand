import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Manvir Singh (MV Singh)",
  description: "Writing on engineering, AI, and building — by Manvir Singh (MV Singh).",
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
