import { StudioNav } from "@/components/studio/StudioNav";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioHeritage } from "@/components/studio/StudioHeritage";
import { StudioProblem } from "@/components/studio/StudioProblem";
import { StudioTransformation } from "@/components/studio/StudioTransformation";
import { StudioDigitalFuture } from "@/components/studio/StudioDigitalFuture";
import { StudioServices } from "@/components/studio/StudioServices";
import { StudioProjects } from "@/components/studio/StudioProjects";
import { StudioApproach } from "@/components/studio/StudioApproach";
import { StudioExperience } from "@/components/studio/StudioExperience";
import { StudioCultureTech } from "@/components/studio/StudioCultureTech";
import { StudioPlans } from "@/components/studio/StudioPlans";
import { StudioProducts } from "@/components/studio/StudioProducts";
import { StudioContact } from "@/components/studio/StudioContact";
import { StudioFooter } from "@/components/studio/StudioFooter";
import { Divider, StoryThread, StoryBeat, MissionBeat, StudioBackdrop, PartHeader } from "@/components/studio/shared";
import { notFound } from "next/navigation";

const TOTAL_PARTS = 7;

export default function StudioPage() {
  // Treat `/studio` as a non-existent path — render the Next.js 404 page
  notFound();
}
