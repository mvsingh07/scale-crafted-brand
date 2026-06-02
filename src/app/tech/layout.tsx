import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Manvir Singh — Portfolio",
  description: "Engineering portfolio — projects, skills, and journey.",
};

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
