import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Manvir Singh (MV Singh)",
  description: "The story, principles, and journey behind Manvir Singh (MV Singh) — engineer, builder, and lifelong learner.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
