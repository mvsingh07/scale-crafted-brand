import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision — Manvir Singh (MV Singh)",
  description: "The philosophy behind how Manvir Singh (MV Singh) approaches building, learning, and living.",
};

export default function VisionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
