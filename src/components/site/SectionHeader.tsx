import { ReactNode } from "react";
import { motion } from "motion/react";

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-8%" }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
  >
    <div className="chip">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {eyebrow}
    </div>
    <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-5xl">
      <span className="text-gradient">{title}</span>
    </h2>
    {description && (
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
    )}
  </motion.div>
);
