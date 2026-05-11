import { motion } from "motion/react";
import { Lock, ArrowLeft } from "lucide-react";

interface Props { ownerName?: string }

const PortfolioExpired = ({ ownerName }: Props) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(220_18%_6%)] px-4 text-white">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--brand-violet)/0.07)] blur-3xl" />
      <div className="absolute left-1/3 top-2/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--brand-cyan)/0.04)] blur-3xl" />
    </div>

    <div className="relative z-10 flex flex-col items-center gap-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]"
      >
        <Lock size={20} className="text-white/50" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25"
      >
        Portfolio unavailable
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xs text-4xl font-semibold tracking-tight md:text-5xl"
        style={{
          background: "linear-gradient(180deg, hsl(210 20% 90%) 0%, hsl(215 14% 42%) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {ownerName ? `${ownerName}'s portfolio` : "This portfolio"} is currently paused.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-sm text-sm leading-relaxed text-white/35"
      >
        The free trial for this portfolio has ended. If you're the owner, upgrade your plan to
        restore public access.
      </motion.p>

      <motion.a
        href="/"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-xs text-white/50 backdrop-blur transition-colors hover:border-white/20 hover:text-white"
      >
        <ArrowLeft size={13} />
        Back to home
      </motion.a>
    </div>
  </div>
);

export default PortfolioExpired;
