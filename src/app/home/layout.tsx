import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manvir Singh (MV Singh) — Home",
  description: "Personal hub for Manvir Singh (MV Singh): building, learning, thinking, and living.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
