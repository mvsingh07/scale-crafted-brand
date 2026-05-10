import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";

const ForgeLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { error: authError } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (authError) {
        setError(authError.message);
      } else {
        setSignupDone(true);
      }
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("Invalid credentials.");
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220_18%_6%)] px-4">
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
                  mode === m
                    ? "bg-white text-black shadow-sm"
                    : "text-white/30 hover:text-white/60"
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
