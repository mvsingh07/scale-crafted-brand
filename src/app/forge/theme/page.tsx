"use client";
import dynamic from "next/dynamic";

const ThemeEditor = dynamic(() => import("@/views/forge/theme/ThemeEditor"), {
  ssr: false,
});

export default function ForgeThemePage() {
  return <ThemeEditor />;
}
