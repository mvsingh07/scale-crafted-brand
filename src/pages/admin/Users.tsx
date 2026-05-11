import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import type { SubscriptionStatus, Plan } from "@/lib/supabase";
import { AdminOnlyGuard } from "@/components/AdminOnlyGuard";
import { ArrowLeft, Search, Shield, ExternalLink, ChevronDown } from "lucide-react";

interface UserRow {
  id: string;
  user_id: string;
  name: string;
  email: string;
  username: string | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_plan: Plan | null;
  plan_ends_at: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  trial:   "bg-sky-500/10 text-sky-400 border-sky-500/20",
  active:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PLAN_LABELS: Record<Plan, string> = {
  monthly: "Monthly",
  halfyearly: "6-Month",
  annual: "Annual",
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, user_id, name, email, username, subscription_status, trial_ends_at, current_plan, plan_ends_at, created_at")
      .order("created_at", { ascending: false });
    setUsers((data ?? []) as UserRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (userId: string, current: SubscriptionStatus) => {
    const next: SubscriptionStatus = current === "active" ? "expired" : "active";
    setUpdating(userId);
    await supabase.from("profiles").update({ subscription_status: next }).eq("id", userId);
    setUpdating(null);
    load();
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.username ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || u.subscription_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[hsl(220_18%_4%)] text-white">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <Shield size={14} className="text-white/70" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Admin Panel</p>
            <h1 className="text-sm font-semibold text-white">Users</h1>
          </div>
        </motion.div>
        <motion.button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-white/30 hover:text-white transition-colors" whileHover={{ x: -1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={12} /> Dashboard
        </motion.button>
      </header>

      <main className="px-6 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name, email or username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | "all")}
              className="appearance-none rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-3 pr-8 font-mono text-xs text-white/60 outline-none focus:border-white/20 transition-colors"
            >
              <option value="all">All statuses</option>
              <option value="trial">Trial</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
            <ChevronDown size={11} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          </div>
        </div>

        {/* Count */}
        <p className="mb-4 font-mono text-[10px] text-white/25">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-12 justify-center text-white/30 text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/25">No users found.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Name / Email", "Username", "Status", "Plan", "Trial / Plan ends", "Joined", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-white/25 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white/80">{u.name || "—"}</p>
                      <p className="font-mono text-xs text-white/30">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {u.username ? (
                        <a href={`/${u.username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-xs text-sky-400/70 hover:text-sky-400 transition-colors">
                          {u.username} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${STATUS_COLORS[u.subscription_status]}`}>
                        {u.subscription_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/40">
                      {u.current_plan ? PLAN_LABELS[u.current_plan] : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/40 whitespace-nowrap">
                      {u.subscription_status === "active" ? fmt(u.plan_ends_at) : fmt(u.trial_ends_at)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/30 whitespace-nowrap">
                      {fmt(u.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(u.id, u.subscription_status)}
                        disabled={updating === u.id}
                        className={`rounded-lg border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors disabled:opacity-40 ${
                          u.subscription_status === "active"
                            ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                            : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {updating === u.id ? "…" : u.subscription_status === "active" ? "Expire" : "Activate"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

const AdminUsers = () => (
  <AdminOnlyGuard>
    <UsersPage />
  </AdminOnlyGuard>
);

export default AdminUsers;
