"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import type { Plan } from "@/lib/supabase";
import { AdminOnlyGuard } from "@/components/AdminOnlyGuard";
import { ArrowLeft, Shield, ChevronDown, Search } from "lucide-react";

type TxStatus = "captured" | "failed" | "refunded";

interface TxRow {
  id: string;
  razorpay_payment_id: string | null;
  razorpay_sub_id: string | null;
  plan: Plan;
  amount_paise: number;
  status: TxStatus;
  created_at: string;
  profiles: { name: string; email: string } | null;
}

const STATUS_COLORS: Record<TxStatus, string> = {
  captured: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  failed:   "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const PLAN_LABELS: Record<Plan, string> = { monthly: "Monthly", halfyearly: "6-Month", annual: "Annual" };
const PAGE_SIZE = 50;
const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const TransactionsPage = () => {
  const router = useRouter();
  const [rows, setRows] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TxStatus | "all">("all");
  const [planFilter, setPlanFilter] = useState<Plan | "all">("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("transactions")
      .select("*, profiles(name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    if (planFilter !== "all") q = q.eq("plan", planFilter);

    const { data, count } = await q;
    setRows((data ?? []) as TxRow[]);
    setTotal(count ?? 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page, statusFilter, planFilter]);

  const filtered = search
    ? rows.filter((r) => {
        const q = search.toLowerCase();
        return (
          (r.razorpay_payment_id ?? "").toLowerCase().includes(q) ||
          (r.profiles?.name ?? "").toLowerCase().includes(q) ||
          (r.profiles?.email ?? "").toLowerCase().includes(q)
        );
      })
    : rows;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[hsl(220_18%_4%)] text-white">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <Shield size={14} className="text-white/70" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Admin Panel</p>
            <h1 className="text-sm font-semibold text-white">Transactions</h1>
          </div>
        </motion.div>
        <motion.button onClick={() => router.push("/admin/dashboard")} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-white/30 hover:text-white transition-colors" whileHover={{ x: -1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={12} /> Dashboard
        </motion.button>
      </header>

      <main className="px-6 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search name, email, payment ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/20"
            />
          </div>
          {[
            { value: statusFilter, setter: setStatusFilter, options: [["all","All statuses"],["captured","Captured"],["failed","Failed"],["refunded","Refunded"]] },
            { value: planFilter, setter: setPlanFilter, options: [["all","All plans"],["monthly","Monthly"],["halfyearly","6-Month"],["annual","Annual"]] },
          ].map(({ value, setter, options }, idx) => (
            <div key={idx} className="relative">
              <select
                value={value}
                onChange={(e) => { setter(e.target.value as any); setPage(0); }}
                className="appearance-none rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-3 pr-8 font-mono text-xs text-white/60 outline-none"
              >
                {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={11} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
          ))}
        </div>

        <p className="mb-4 font-mono text-[10px] text-white/25">{total} transaction{total !== 1 ? "s" : ""}</p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-white/30">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-white/25">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Date", "User", "Plan", "Amount", "Status", "Payment ID"].map((h) => (
                    <th key={h} className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-white/25 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-white/40 whitespace-nowrap">{fmt(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white/80">{r.profiles?.name || "—"}</p>
                      <p className="font-mono text-xs text-white/30">{r.profiles?.email || "—"}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/50">{PLAN_LABELS[r.plan]}</td>
                    <td className="px-4 py-3 font-mono text-sm font-medium text-white/70">
                      ₹{(r.amount_paise / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${STATUS_COLORS[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-white/25">
                      {r.razorpay_payment_id ?? "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="font-mono text-[10px] text-white/25">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] text-white/40 disabled:opacity-30 hover:text-white transition-colors">
                Prev
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] text-white/40 disabled:opacity-30 hover:text-white transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const AdminTransactions = () => (
  <AdminOnlyGuard>
    <TransactionsPage />
  </AdminOnlyGuard>
);

export default AdminTransactions;
