import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Star, Check } from "lucide-react";
import { motion } from "motion/react";

type PlanOption = "trial" | "monthly" | "halfyearly" | "annual";

const PLANS: { id: PlanOption; label: string; price: string; note: string }[] = [
  { id: "trial",      label: "Free Trial",  price: "₹0",   note: "30 days free, then upgrade" },
  { id: "monthly",    label: "Monthly",     price: "₹99",  note: "per month" },
  { id: "halfyearly", label: "6-Month",     price: "₹499", note: "every 6 months · save 16%" },
  { id: "annual",     label: "Annual",      price: "₹999", note: "per year · best value" },
];

const SPRING = { type: "spring" as const, stiffness: 380, damping: 26 };

const ForgeLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>("trial");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { data: signUpData, error: authError } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else if (signUpData.user?.identities?.length === 0) {
        setError("An account with this email already exists. Sign in instead.");
      } else {
        // Store plan preference so after first login we redirect to upgrade
        if (selectedPlan !== "trial") {
          localStorage.setItem("forge_pending_plan", selectedPlan);
        }
        setSignupDone(true);
      }
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("Invalid credentials.");
      return;
    }

    // If user had picked a paid plan at signup, send them to upgrade
    const pendingPlan = localStorage.getItem("forge_pending_plan");
    if (pendingPlan) {
      localStorage.removeItem("forge_pending_plan");
      navigate(`/forge/upgrade?plan=${pendingPlan}`);
    } else {
      navigate("/forge/dashboard");
    }
  };

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    setError("");
    setSignupDone(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220_18%_6%)] px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]">
          <Star size={15} className="text-white" fill="white" />
        </div>
        <span className="font-mono text-sm font-semibold tracking-tight text-white">The Forge</span>
      </div>

      {signupDone ? (
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10">
            <span className="text-lg text-emerald-400">✓</span>
          </div>
          <h2 className="mb-2 text-base font-semibold text-white">Check your email</h2>
          <p className="text-sm leading-relaxed text-white/40">
            We sent a confirmation link to <span className="text-white/70">{email}</span>.
            Click it to activate your account, then sign in.
          </p>
          {selectedPlan !== "trial" && (
            <p className="mt-3 rounded-lg border border-[hsl(var(--brand-cyan)/0.2)] bg-[hsl(var(--brand-cyan)/0.06)] px-3 py-2 font-mono text-[10px] text-[hsl(var(--brand-cyan))]">
              Your {PLANS.find(p => p.id === selectedPlan)?.label} plan will be activated after sign-in.
            </p>
          )}
          <button
            onClick={() => switchMode("signin")}
            className="mt-6 font-mono text-xs text-white/40 underline underline-offset-4 hover:text-white transition-colors"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          {/* Mode toggle */}
          <div className="mb-6 flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-lg py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 ${
                  mode === m ? "bg-white text-black shadow-sm" : "text-white/30 hover:text-white/60"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <div>
            <h1 className="text-lg font-semibold text-white">
              {mode === "signin" ? "Welcome back." : "Create your account."}
            </h1>
            <p className="mt-0.5 text-xs text-white/30">
              {mode === "signin"
                ? "Sign in to manage your portfolio."
                : "Start building your portfolio today."}
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors"
              placeholder="••••••••"
            />
            {mode === "signup" && (
              <p className="font-mono text-[9px] text-white/20">Minimum 6 characters.</p>
            )}
          </div>

          {/* Plan selection — signup only */}
          {mode === "signup" && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Select plan</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PLANS.map((p) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative rounded-xl border p-3 text-left transition-colors ${
                      selectedPlan === p.id
                        ? "border-[hsl(var(--brand-cyan)/0.5)] bg-[hsl(var(--brand-cyan)/0.08)]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    transition={SPRING}
                  >
                    {selectedPlan === p.id && (
                      <span className="absolute right-2 top-2">
                        <Check size={10} className="text-[hsl(var(--brand-cyan))]" />
                      </span>
                    )}
                    <p className={`text-[11px] font-semibold ${selectedPlan === p.id ? "text-white" : "text-white/60"}`}>
                      {p.label}
                    </p>
                    <p className={`mt-0.5 font-mono text-sm font-bold ${selectedPlan === p.id ? "text-[hsl(var(--brand-cyan))]" : "text-white/40"}`}>
                      {p.price}
                    </p>
                    <p className="mt-0.5 text-[9px] leading-tight text-white/25">{p.note}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="font-mono text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? mode === "signin" ? "Signing in…" : "Creating account…"
              : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <p className="text-center font-mono text-[10px] text-white/20">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
              className="text-white/40 underline underline-offset-2 hover:text-white transition-colors"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgeLogin;
