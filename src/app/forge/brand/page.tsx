"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Palette } from "lucide-react";

export default function ForgeBrandPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220_18%_6%)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div
          className="grid h-12 w-12 place-items-center rounded-xl border border-white/10"
          style={{ background: "hsl(256 92% 76% / 0.1)" }}
        >
          <Palette size={20} style={{ color: "hsl(256 92% 76%)" }} />
        </div>
        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-white/25">Coming soon</p>
          <h1 className="text-lg font-semibold text-white">Brand Editor</h1>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/35">
            The brand editor is being built as part of Phase 1. Check back soon.
          </p>
        </div>
        <Link
          href="/forge/tech"
          className="flex items-center gap-1.5 font-mono text-xs text-white/30 hover:text-white transition-colors"
        >
          <ArrowLeft size={11} />
          Back to forge
        </Link>
      </motion.div>
    </div>
  );
}
