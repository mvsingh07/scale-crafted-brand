import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase, trialDaysLeft, isTrialExpired } from "@/lib/supabase";
import type { SubscriptionStatus, Plan } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  MessageSquare,
  UserPen,
  LogOut,
  Star,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Zap,
  Clock,
  ShieldCheck,
} from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const navCards = [
  {
    icon: UserPen,
    label: "Edit Portfolio",
    description: "Update content, upload resume, manage every section of your portfolio.",
    href: "/forge/edit-profile",
    accent: "hsl(var(--brand-cyan))",
  },
  {
    icon: MessageSquare,
    label: "Contact Queries",
    description: "Review messages sent through your portfolio contact form.",
    href: "/forge/queries",
    accent: "hsl(var(--brand-violet))",
  },
];

const PLAN_LABEL: Record<Plan, string> = {
  monthly: "Monthly Pro",
  halfyearly: "6-Month Pro",
  annual: "Annual Pro",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { username: urlUsername } = useParams<{ username?: string }>();
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>("trial");
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [planEndsAt, setPlanEndsAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, name, subscription_status, trial_ends_at, current_plan, plan_ends_at")
        .eq("user_id", user.id)
        .maybeSingle();
      const un = data?.username ?? null;
      setUsername(un);
      setName(data?.name ?? "");
      setSubStatus((data?.subscription_status as SubscriptionStatus) ?? "trial");
      setTrialEndsAt(data?.trial_ends_at ?? null);
      setCurrentPlan((data?.current_plan as Plan) ?? null);
      setPlanEndsAt(data?.plan_ends_at ?? null);
      setLoadingProfile(false);
      if (un && !urlUsername) navigate(`/forge/dashboard/${un}`, { replace: true });
    };
    load();
  }, [navigate, urlUsername]);

  const portfolioUrl = username ? `${window.location.origin}/${username}` : null;

  const copyUrl = () => {
    if (!portfolioUrl) return;
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast.success("Portfolio URL copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/forge");
  };

  const daysLeft = trialDaysLeft({ trial_ends_at: trialEndsAt });
  const expired = isTrialExpired({ subscription_status: subStatus, trial_ends_at: trialEndsAt });

  const trialBannerColor =
    subStatus === "active"
      ? null
      : expired
      ? "red"
      : daysLeft <= 7
      ? "red"
      : daysLeft <= 14
      ? "amber"
      : "green";

  return (
    <div className="min-h-screen bg-[hsl(220_18%_6%)] text-white">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
        <motion.div
          className="flex items-center gap-3 cursor-default select-none"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={SPRING}
          >
            <Star size={15} className="text-white" fill="white" />
          </motion.div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">The Forge</p>
            <h1 className="text-sm font-semibold text-white">
              {name ? `Welcome back, ${name.split(" ")[0]}.` : "Dashboard"}
            </h1>
          </div>
        </motion.div>

        <motion.button
          onClick={signOut}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-white/30 transition-colors hover:text-white"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, x: -1 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={12} />
          Sign out
        </motion.button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">

        {/* Trial / subscription banner */}
        {!loadingProfile && trialBannerColor !== null && (
          <motion.div
            className={`mb-6 flex items-center justify-between gap-4 rounded-2xl border p-4 ${
              trialBannerColor === "red"
                ? "border-red-500/20 bg-red-500/[0.06]"
                : trialBannerColor === "amber"
                ? "border-amber-500/20 bg-amber-500/[0.06]"
                : "border-emerald-500/20 bg-emerald-500/[0.05]"
            }`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3">
              <Clock
                size={14}
                className={
                  trialBannerColor === "red"
                    ? "text-red-400"
                    : trialBannerColor === "amber"
                    ? "text-amber-400"
                    : "text-emerald-400"
                }
              />
              <div>
                {expired ? (
                  <>
                    <p className="text-sm font-medium text-white/80">Trial expired — your portfolio is paused.</p>
                    <p className="text-xs text-white/35">Upgrade to restore public access.</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-white/80">
                      {daysLeft} day{daysLeft !== 1 ? "s" : ""} left in your free trial.
                    </p>
                    <p className="text-xs text-white/35">
                      {daysLeft <= 7
                        ? "Upgrade soon to keep your portfolio live."
                        : "Upgrade anytime to go Pro."}
                    </p>
                  </>
                )}
              </div>
            </div>
            <motion.button
              onClick={() => navigate("/forge/upgrade")}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white"
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <Zap size={10} />
              Upgrade
            </motion.button>
          </motion.div>
        )}

        {/* Active plan badge */}
        {!loadingProfile && subStatus === "active" && currentPlan && (
          <motion.div
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white/80">
                {PLAN_LABEL[currentPlan]} — active
              </p>
              {planEndsAt && (
                <p className="text-xs text-white/35">
                  Renews {new Date(planEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Portfolio URL card */}
        <motion.div
          className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/30">Your portfolio</p>
          {loadingProfile ? (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
              <span className="text-sm text-white/30">Loading…</span>
            </div>
          ) : portfolioUrl ? (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5">
                <ExternalLink size={12} className="shrink-0 text-white/30" />
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-mono text-xs text-white/60 hover:text-white transition-colors"
                >
                  {portfolioUrl}
                </a>
              </div>
              <motion.button
                onClick={copyUrl}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/40 transition-all hover:border-white/20 hover:text-white"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </motion.button>
              <motion.a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-black transition-opacity hover:opacity-90"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
              >
                <ExternalLink size={11} />
                View
              </motion.a>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm text-white/70">No username set yet.</p>
                <p className="mt-0.5 text-xs text-white/30">
                  Go to{" "}
                  <button
                    onClick={() => navigate("/forge/edit-profile")}
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Edit Portfolio
                  </button>{" "}
                  and set a username to activate your portfolio URL.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Nav cards */}
        <motion.p
          className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Workspace
        </motion.p>
        <div className="grid gap-4 sm:grid-cols-2">
          {navCards.map((c, i) => (
            <motion.button
              key={c.href}
              onClick={() => navigate(c.href)}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.06)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10"
                style={{ background: `${c.accent}18` }}
                whileHover={{ scale: 1.12, rotate: 4 }}
                transition={SPRING}
              >
                <c.icon size={18} style={{ color: c.accent }} />
              </motion.div>
              <p className="text-sm font-semibold text-white">{c.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/40">{c.description}</p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

const ForgeDashboard = () => (
  <AdminGuard>
    <DashboardPage />
  </AdminGuard>
);

export default ForgeDashboard;
