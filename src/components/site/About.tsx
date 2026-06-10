import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import dynamic from "next/dynamic";
// Lazy-load Spline-heavy 3D card
const About3DCard = dynamic(() => import("./About3DCard").then(m => ({ default: m.About3DCard })), {
  ssr: false,
  loading: () => <div className="w-full h-64 animate-pulse rounded-2xl bg-white/5" />,
});

const DEFAULT_PARAGRAPHS = [
  "I'm a Senior Software Engineer with 3+ years of experience who treats software like a product, not a task list. My recent work at <b>Vusic Technologies</b> and Turtleneck Systems has been deep in the trenches of <b>distributed systems</b> — designing platforms that hold up under 50K+ concurrent users, handle gigabyte-scale encrypted workloads, and stay responsive in milliseconds, not seconds.",
  "My playground is <b>system design</b>: choosing the right boundaries between services, picking the right consistency model, knowing when to reach for Kafka or RabbitMQ, when Redis is enough, and when the answer is simply a better data structure. I obsess over the tradeoffs most teams skip — and that's usually where the real reliability lives.",
  "Beyond the code, I lead. I've owned features end-to-end, mentored engineers, translated fuzzy product asks into crisp technical roadmaps, shipped demos and walkthroughs for clients, and operated production systems with real observability. Ownership isn't a buzzword for me — it's the default mode.",
  "italic:The vision needs an architect.",
];

const paraContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const paraItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface AboutProps {
  paragraphs?: string[];
}

export const About = ({ paragraphs }: AboutProps = {}) => {
  const lines = paragraphs && paragraphs.length > 0 ? paragraphs : DEFAULT_PARAGRAPHS;

  return (
    <section id="about" className="relative py-16 md:py-20">
      <div className="container">
        <SectionHeader eyebrow="01 — The Engineer" title="The engineer behind the systems." />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-muted-foreground"
            variants={paraContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8%" }}
          >
            {lines.map((p, i) => {
              if (p.startsWith("italic:")) {
                return (
                  <motion.p key={i} variants={paraItem} className="font-editorial italic text-base text-foreground/60">
                    {p.replace("italic:", "")}
                  </motion.p>
                );
              }
              if (p.includes("<b>")) {
                return (
                  <motion.p
                    key={i}
                    variants={paraItem}
                    dangerouslySetInnerHTML={{ __html: p.replace(/<b>(.*?)<\/b>/g, '<span class="text-foreground font-medium">$1</span>') }}
                  />
                );
              }
              return <motion.p key={i} variants={paraItem}>{p}</motion.p>;
            })}
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <About3DCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
