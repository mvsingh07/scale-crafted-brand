"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Shield, ArrowRight, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/admin/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("Invalid credentials.");
    } else {
      router.replace("/admin/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220_18%_4%)] px-4">
      <motion.div
        className="mb-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
          <Shield size={18} className="text-white/70" />
        </div>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">mvsingh.in</p>
          <p className="text-sm font-semibold text-white">Sign in</p>
        </div>
      </motion.div>

      <motion.form
        onSubmit={onSubmit}
        className="w-full max-w-xs space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="space-y-1">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {error && <p className="font-mono text-xs text-red-400">{error}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black disabled:opacity-50"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight size={14} />}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AdminLogin;
