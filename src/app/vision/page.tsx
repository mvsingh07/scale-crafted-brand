"use client";

import { motion } from "motion/react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";
import { VisionSection } from "@/components/sections/VisionSection";

const GOLD   = "var(--gold-primary)";
const WHITE  = "var(--text-primary)";
const SILVER = "var(--silver)";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const ECOSYSTEM_PILLARS = [
  { num: "01", title: "Ahara",   subtitle: "Nourish the Body" },
  { num: "02", title: "Vihara",  subtitle: "Build Healthy Habits" },
  { num: "03", title: "Sharira", subtitle: "Strengthen the Body" },
  { num: "04", title: "Manas",   subtitle: "Train the Mind" },
  { num: "05", title: "Buddhi",  subtitle: "Expand Understanding" },
  { num: "06", title: "Atma",    subtitle: "Discover Purpose" },
];



export default function VisionPage() {
  return (
    <HubPageLayout>
      <div style={{ paddingTop: 64 }}>
       
        
        <VisionSection />
      </div>
    </HubPageLayout>
  );
}
