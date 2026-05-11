import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Star } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[hsl(220_18%_6%)] px-4 text-white">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--brand-cyan)/0.06)] blur-3xl" />
        <div className="absolute left-2/3 top-2/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--brand-violet)/0.05)] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]"
        >
          <Star size={18} className="text-white" fill="white" />
        </motion.div>

        {/* 404 number */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl font-semibold tracking-tight md:text-8xl"
          style={{
            background: "linear-gradient(180deg, hsl(210 20% 96%) 0%, hsl(215 14% 44%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Not found.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-sm text-sm leading-relaxed text-white/40"
        >
          {`The page at `}
          <span className="font-mono text-white/60">{location.pathname}</span>
          {` doesn't exist or was moved.`}
        </motion.p>

        <motion.a
          href="/"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.5, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-mono text-xs text-white/60 backdrop-blur transition-colors hover:border-white/20 hover:text-white"
        >
          <ArrowLeft size={13} />
          Back to home
        </motion.a>
      </div>
    </div>
  );
};

export default NotFound;
