import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { AdminOnlyGuard } from "@/components/AdminOnlyGuard";
import { ArrowLeft, Shield, Save, Eye, EyeOff, Check } from "lucide-react";

interface Config {
  razorpay_key_id: string;
  plan_id_monthly: string;
  plan_id_halfyearly: string;
  plan_id_annual: string;
  trial_days: number;
  mode: "test" | "live";
}

const EMPTY: Config = {
  razorpay_key_id: "",
  plan_id_monthly: "",
  plan_id_halfyearly: "",
  plan_id_annual: "",
  trial_days: 30,
  mode: "test",
};

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const PaymentConfigPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("admin_config")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setConfig({
            razorpay_key_id: data.razorpay_key_id ?? "",
            plan_id_monthly: data.plan_id_monthly ?? "",
            plan_id_halfyearly: data.plan_id_halfyearly ?? "",
            plan_id_annual: data.plan_id_annual ?? "",
            trial_days: data.trial_days ?? 30,
            mode: (data.mode as "test" | "live") ?? "test",
          });
        }
        setLoading(false);
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { error: err } = await supabase
      .from("admin_config")
      .upsert({ id: 1, ...config, updated_at: new Date().toISOString() });
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const set = (k: keyof Config) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setConfig((c) => ({ ...c, [k]: k === "trial_days" ? Number(e.target.value) : e.target.value }));

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 font-mono text-sm text-white placeholder-white/20 outline-none focus:border-white/25 transition-colors";

  return (
    <div className="min-h-screen bg-[hsl(220_18%_4%)] text-white">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <Shield size={14} className="text-white/70" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Admin Panel</p>
            <h1 className="text-sm font-semibold text-white">Payment Config</h1>
          </div>
        </motion.div>
        <motion.button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-white/30 hover:text-white transition-colors" whileHover={{ x: -1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={12} /> Dashboard
        </motion.button>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-white/30">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
            Loading…
          </div>
        ) : (
          <motion.form
            onSubmit={save}
            className="space-y-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mode */}
            <section>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/25">Mode</p>
              <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-1 w-fit">
                {(["test", "live"] as const).map((m) => (
                  <motion.button
                    key={m}
                    type="button"
                    onClick={() => setConfig(c => ({ ...c, mode: m }))}
                    className={`relative rounded-lg px-5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${config.mode === m ? "text-black" : "text-white/30 hover:text-white/60"}`}
                    whileTap={{ scale: 0.96 }}
                  >
                    {config.mode === m && (
                      <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-lg bg-white" transition={SPRING} />
                    )}
                    <span className="relative z-10">{m}</span>
                  </motion.button>
                ))}
              </div>
              {config.mode === "live" && (
                <p className="mt-2 font-mono text-[10px] text-amber-400/70">
                  Live mode — real payments will be charged.
                </p>
              )}
            </section>

            {/* Razorpay key */}
            <section>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/25">Razorpay</p>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-white/35">Key ID (public)</label>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={config.razorpay_key_id}
                      onChange={set("razorpay_key_id")}
                      placeholder="rzp_test_xxxxxxxxxxxx"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                      {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Plan IDs */}
            <section>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/25">Subscription Plan IDs</p>
              <div className="space-y-3">
                {[
                  { key: "plan_id_monthly" as const,    label: "Monthly (₹99 / mo)",         placeholder: "plan_xxxxxxxxxx" },
                  { key: "plan_id_halfyearly" as const, label: "6-Month (₹499 / 6 mo)",       placeholder: "plan_xxxxxxxxxx" },
                  { key: "plan_id_annual" as const,     label: "Annual (₹999 / yr)",          placeholder: "plan_xxxxxxxxxx" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="space-y-1">
                    <label className="font-mono text-[10px] text-white/35">{label}</label>
                    <input type="text" value={config[key]} onChange={set(key)} placeholder={placeholder} className={inputClass} />
                  </div>
                ))}
              </div>
            </section>

            {/* Trial duration */}
            <section>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/25">Trial Settings</p>
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-white/35">Trial duration (days)</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={config.trial_days}
                  onChange={set("trial_days")}
                  className={`${inputClass} w-32`}
                />
                <p className="font-mono text-[9px] text-white/20">
                  New signups will get this many days free. Changing this won't affect existing accounts.
                </p>
              </div>
            </section>

            {error && <p className="font-mono text-xs text-red-400">{error}</p>}

            <motion.button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
            >
              {saved ? <Check size={14} className="text-emerald-600" /> : <Save size={14} />}
              {saving ? "Saving…" : saved ? "Saved!" : "Save configuration"}
            </motion.button>
          </motion.form>
        )}
      </main>
    </div>
  );
};

const AdminPaymentConfig = () => (
  <AdminOnlyGuard>
    <PaymentConfigPage />
  </AdminOnlyGuard>
);

export default AdminPaymentConfig;
