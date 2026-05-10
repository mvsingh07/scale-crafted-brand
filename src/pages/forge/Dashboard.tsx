import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
} from "lucide-react";

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

const DashboardPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("username, name")
        .eq("user_id", user.id)
        .maybeSingle();
      setUsername(data?.username ?? null);
      setName(data?.name ?? "");
      setLoadingProfile(false);
    };
    load();
  }, []);

  const portfolioUrl = username ? `${window.location.origin}/${username}` : null;

  const copyUrl = () => {
    if (!portfolioUrl) return;
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/forge");
  };

  return (
    <div className="min-h-screen bg-[hsl(220_18%_6%)] text-white">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]">
            <Star size={15} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">The Forge</p>
            <h1 className="text-sm font-semibold text-white">
              {name ? `Welcome back, ${name.split(" ")[0]}.` : "Dashboard"}
            </h1>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 font-mono text-xs text-white/30 transition-colors hover:text-white"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">

        {/* Portfolio URL card */}
        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
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
              <button
                onClick={copyUrl}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/40 transition-all hover:border-white/20 hover:text-white"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 font-mono text-[10px] uppercase tracking-widest text-black transition-opacity hover:opacity-90"
              >
                <ExternalLink size={11} />
                View
              </a>
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
        </div>

        {/* Nav cards */}
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/20">Workspace</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {navCards.map((c) => (
            <button
              key={c.href}
              onClick={() => navigate(c.href)}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.06]"
            >
              <div
                className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 transition-colors group-hover:border-white/20"
                style={{ background: `${c.accent}18` }}
              >
                <c.icon size={18} style={{ color: c.accent }} />
              </div>
              <p className="text-sm font-semibold text-white">{c.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/40">{c.description}</p>
            </button>
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
