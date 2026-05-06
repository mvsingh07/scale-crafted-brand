import { SectionHeader } from "./SectionHeader";

export const About = () => (
  <section id="about" className="relative py-24 md:py-32">
    <div className="container">
      <SectionHeader eyebrow="01 — About" title="The engineer behind the systems." />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            I'm a Senior Software Engineer who treats software like a product, not a task list.
            For the last several years I've been deep in the trenches of <span className="text-foreground font-medium">distributed systems</span> —
            designing platforms that hold up under tens of thousands of concurrent users, handle gigabyte-scale workloads, and stay responsive in milliseconds, not seconds.
          </p>
          <p>
            My playground is <span className="text-foreground font-medium">system design</span>: choosing the right boundaries between services,
            picking the right consistency model, knowing when to reach for Kafka, when Redis is enough, and when the answer is simply a better data structure.
            I obsess over the tradeoffs most teams skip — and that's usually where the real reliability lives.
          </p>
          <p>
            Beyond the code, I lead. I've owned features end-to-end, mentored engineers,
            translated fuzzy product asks into crisp technical roadmaps, and shipped real outcomes alongside clients.
            Ownership isn't a buzzword for me — it's the default mode.
          </p>
        </div>

        <div className="lg:col-span-5">
          <div className="card-premium p-7">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Currently focused on
            </div>
            <ul className="mt-5 space-y-4">
              {[
                { t: "Distributed Architecture", d: "Designing fault-tolerant, horizontally scalable backends." },
                { t: "Real-Time Systems", d: "Sub-second pipelines on Kafka, Redis, WebSockets." },
                { t: "AI Integration", d: "Production LLM, voice & RAG systems for real users." },
                { t: "Engineering Leadership", d: "Leading small, high-output teams of 2–3 engineers." },
              ].map((i) => (
                <li key={i.t} className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-brand shadow-glow" />
                  <div>
                    <div className="font-medium text-foreground">{i.t}</div>
                    <div className="text-sm text-muted-foreground">{i.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);
