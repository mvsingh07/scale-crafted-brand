import { motion } from "motion/react";
import type { PersonalDetail } from "@/lib/supabase";

interface PersonalProps {
  imageUrl?: string | null;
  headline?: string | null;
  details?: PersonalDetail[] | null;
}

export const Personal = ({ imageUrl, headline, details }: PersonalProps) => {
  if (!imageUrl && !headline && (!details || details.length === 0)) return null;

  return (
    <section id="personal" className="relative py-16 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12"
        >
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0"
            >
              <div className="relative h-40 w-40 rounded-2xl overflow-hidden ring-1 ring-border/40 shadow-elegant">
                <img
                  src={imageUrl}
                  alt={headline ?? "Personal"}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          )}

          <div className="flex-1">
            {headline && (
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-2xl font-semibold text-gradient mb-4"
              >
                {headline}
              </motion.h3>
            )}

            {details && details.length > 0 && (
              <motion.dl
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
              >
                {details.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-2"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 shrink-0">
                      {d.label}
                    </dt>
                    <dd className="text-sm text-foreground truncate">{d.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
