"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Palette, ArrowLeft } from "lucide-react";

export default function BrandPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220_18%_4%)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10"
          style={{ background: "hsl(256 92% 76% / 0.12)" }}
        >
          <Palette size={22} style={{ color: "hsl(256 92% 76%)" }} />
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/25">
            Coming soon
          </p>
          <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Brand</h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/40">
            Design, identity, and creative work — being built as part of Phase 1.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 font-mono text-xs text-white/30 transition-colors hover:text-white"
        >
          <ArrowLeft size={12} />
          Back to hub
        </Link>
      </motion.div>
    </main>
  );
}
