import { SectionHeader } from "./SectionHeader";
import { About3DCard } from "./About3DCard";

export const About = () => (
  <section id="about" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader eyebrow="01 — The Engineer" title="The engineer behind the systems." />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div data-reveal="fade-right" className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I'm a Senior Software Engineer with 3+ years of experience who treats software like a product, not a task list.
            My recent work at <span className="text-foreground font-medium">Vusic Technologies</span> and Turtleneck Systems has been deep in the trenches of <span className="text-foreground font-medium">distributed systems</span> —
            designing platforms that hold up under 50K+ concurrent users, handle gigabyte-scale encrypted workloads, and stay responsive in milliseconds, not seconds.
          </p>
          <p>
            My playground is <span className="text-foreground font-medium">system design</span>: choosing the right boundaries between services,
            picking the right consistency model, knowing when to reach for Kafka or RabbitMQ, when Redis is enough, and when the answer is simply a better data structure.
            I obsess over the tradeoffs most teams skip — and that's usually where the real reliability lives.
          </p>
          <p>
            Beyond the code, I lead. I've owned features end-to-end, mentored engineers,
            translated fuzzy product asks into crisp technical roadmaps, shipped demos and walkthroughs for clients, and operated production systems with real observability.
            Ownership isn't a buzzword for me — it's the default mode.
          </p>
          <p className="font-editorial italic text-base text-foreground/60">
            The vision needs an architect.
          </p>
        </div>

        <div data-reveal="fade-left" className="lg:col-span-5">
          <About3DCard />
        </div>
      </div>
    </div>
  </section>
);
