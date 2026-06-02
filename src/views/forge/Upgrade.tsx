import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import type { Plan } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import { Check, Star, ArrowLeft, Zap, Globe, Palette, Lock, LifeBuoy } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const FEATURES = [
  { icon: Globe, label: "Permanent public portfolio URL — never expires" },
  { icon: Palette, label: "All 4 themes — dark, light, mono-grey, mono-blue" },
  { icon: Zap, label: "Unlimited content edits and resume uploads" },
  { icon: Lock, label: "Contact form with spam protection" },
  { icon: LifeBuoy, label: "Priority email support" },
];

type Billing = "monthly" | "halfyearly" | "annual";

const PLANS: Record<Billing, { label: string; price: number; note: string; badge?: string }> = {
  monthly:    { label: "Monthly",  price: 99,  note: "₹99 / month" },
  halfyearly: { label: "6-Month",  price: 499, note: "₹499 every 6 months", badge: "Save 16%" },
  annual:     { label: "Annual",   price: 999, note: "₹999 / year",          badge: "Best value" },
};

const UpgradePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const defaultPlan = (params.get("plan") as Billing) ?? "monthly";
  const [billing, setBilling] = useState<Billing>(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/forge"); return; }

      const { data, error: fnErr } = await supabase.functions.invoke("create-subscription", {
        body: { plan: billing },
      });

      if (fnErr || !data?.subscriptionId) {
        setError(fnErr?.message ?? "Could not start checkout. Check your Razorpay configuration.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "Scale Crafted",
        description: `${PLANS[billing].label} Pro Plan`,
        prefill: { email: session.user.email },
        theme: { color: "#38bdf8" },
        handler: () => {
          navigate("/forge/dashboard?upgraded=1");
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      setError("Unexpected error. Please try again.");
    }
    setLoading(false);
  };

  const plan = PLANS[billing];

  return (
    <div className="min-h-screen bg-[hsl(220_18%_6%)] text-white">
      {/* Razorpay checkout.js */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]">
            <Star size={15} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">The Forge</p>
            <h1 className="text-sm font-semibold text-white">Upgrade to Pro</h1>
          </div>
        </motion.div>

        <motion.button
          onClick={() => navigate("/forge/dashboard")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-white/30 transition-colors hover:text-white"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, x: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={12} />
          Dashboard
        </motion.button>
      </header>

      <main className="mx-auto max-w-lg px-6 py-16">
        <motion.div
          className="mb-10 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Simple pricing</p>
          <h2 className="text-3xl font-semibold tracking-tight">Keep your portfolio live.</h2>
          <p className="text-sm leading-relaxed text-white/40">
            Free trial gives you 30 days. Go Pro to remove the limit and unlock everything.
          </p>

          {/* Billing toggle */}
          <div className="mt-3 flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
            {(Object.entries(PLANS) as [Billing, typeof PLANS[Billing]][]).map(([key, p]) => (
              <motion.button
                key={key}
                type="button"
                onClick={() => setBilling(key)}
                className={`relative rounded-lg px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 ${
                  billing === key ? "text-black" : "text-white/30 hover:text-white/60"
                }`}
                whileTap={{ scale: 0.96 }}
              >
                {billing === key && (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-lg bg-white"
                    transition={SPRING}
                  />
                )}
                <span className="relative z-10">{p.label}</span>
                {p.badge && (
                  <span className={`relative z-10 ml-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                    billing === key ? "bg-emerald-500/20 text-emerald-700" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {p.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Plan card */}
        <motion.div
          className="rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 flex items-end gap-2">
            <motion.span
              key={billing}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-semibold tracking-tight"
            >
              ₹{plan.price}
            </motion.span>
            <p className="mb-1.5 text-sm text-white/40">{plan.note}</p>
          </div>

          <ul className="mb-8 space-y-3.5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5">
                  <Icon size={12} className="text-[hsl(var(--brand-cyan))]" />
                </span>
                <span className="text-sm text-white/70">{label}</span>
                <Check size={12} className="ml-auto shrink-0 text-emerald-400" />
              </li>
            ))}
          </ul>

          {error && (
            <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 font-mono text-xs text-red-400">
              {error}
            </p>
          )}

          <motion.button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
            whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
          >
            {loading ? "Opening checkout…" : `Get Pro — ₹${plan.price}`}
          </motion.button>

          <p className="mt-4 text-center font-mono text-[10px] text-white/20">
            Secure payment via Razorpay · Cancel anytime · No hidden fees
          </p>
        </motion.div>

        <motion.div
          className="mt-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            ["What happens when my trial ends?", "Your portfolio URL is paused — visitors see a holding page. Your data stays safe. Upgrade anytime to restore access instantly."],
            ["Can I cancel?", "Yes. Cancel anytime from Razorpay billing portal. Your portfolio stays live until the end of the paid period."],
            ["Do you offer refunds?", "Contact us within 7 days of any charge and we'll sort it out."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-1 text-sm font-medium text-white/70">{q}</p>
              <p className="text-xs leading-relaxed text-white/35">{a}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

const ForgeUpgrade = () => (
  <AdminGuard>
    <UpgradePage />
  </AdminGuard>
);

export default ForgeUpgrade;
