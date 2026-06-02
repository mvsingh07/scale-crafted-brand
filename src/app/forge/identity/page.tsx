"use client";
import dynamic from "next/dynamic";

const IdentityEditor = dynamic(
  () => import("@/views/forge/identity/IdentityEditor"),
  { ssr: false }
);

export default function ForgeIdentityPage() {
  return <IdentityEditor />;
}
