import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand — Manvir Singh (MV Singh)",
  description: "Brand identity and design system for Manvir Singh (MV Singh).",
};

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return children;
}
