import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manvir Singh — Tech",
  description: "Engineering portfolio — projects, skills, and journey.",
};

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
