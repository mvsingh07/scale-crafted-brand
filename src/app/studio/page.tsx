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

const TOTAL_PARTS = 7;

export default function StudioPage() {
  return (
    <>
      <StudioBackdrop />
      <StoryThread />
      <div style={{ position: "relative", zIndex: 1 }}>
        <StudioNav />
        <main>
          <StudioHero />
          <Divider />

          <PartHeader index={1} total={TOTAL_PARTS} title="Indian Business Infrastructure" />
          <StudioHeritage />
          <Divider />
          <StudioProblem />
          <Divider />

          <PartHeader index={2} total={TOTAL_PARTS} title="The Shift to Digital & AI Era" />
          <StudioTransformation />
          <Divider />
          <StudioDigitalFuture />
          <Divider />

          <PartHeader index={3} total={TOTAL_PARTS} title="What We Do" />
          <StudioServices />
          <Divider />
          <StudioProjects />
          <StoryBeat>None of this happens by accident. Here&apos;s how we actually work.</StoryBeat>
          <Divider />

          <PartHeader index={4} total={TOTAL_PARTS} title="Our Approach" />
          <StudioApproach />
          <Divider />
          <StudioExperience />
          <Divider />
          <StudioCultureTech />
          <StoryBeat>Every story needs a place to start.</StoryBeat>
          <Divider />

          <PartHeader index={5} total={TOTAL_PARTS} title="Plans" />
          <StudioPlans />
          <Divider />

          <PartHeader index={6} total={TOTAL_PARTS} title="Existing Products" />
          <StudioProducts />
          <MissionBeat
            future="The future is arriving quietly. We don't know exactly how it unfolds — but preparation starts before it arrives."
            mission="This is how India becomes AI-ready — one business, one system at a time."
          />
          <Divider />

          <PartHeader index={7} total={TOTAL_PARTS} title="Contact" />
          <StudioContact />
        </main>
        <StudioFooter />
      </div>
    </>
  );
}
