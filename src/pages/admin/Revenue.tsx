import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { AdminOnlyGuard } from "@/components/AdminOnlyGuard";
import { ArrowLeft, Shield, TrendingUp, Users, IndianRupee, UserX } from "lucide-react";

type Range = "7d" | "30d" | "3m" | "12m";

const RANGES: { id: Range; label: string; days: number }[] = [
  { id: "7d",  label: "7 days",   days: 7   },
  { id: "30d", label: "30 days",  days: 30  },
  { id: "3m",  label: "3 months", days: 90  },
  { id: "12m", label: "12 months",days: 365 },
];

interface ChartPoint { label: string; revenue: number }

const RevenuePage = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>("30d");
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [trialCount, setTrialCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  const load = async (r: Range) => {
    setLoading(true);
    const days = RANGES.find(x => x.id === r)!.days;
    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    const [txRes, profileRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("amount_paise, created_at, status")
        .eq("status", "captured")
        .gte("created_at", since)
        .order("created_at"),
      supabase
        .from("profiles")
        .select("subscription_status"),
    ]);

    const txs = txRes.data ?? [];
    const profiles = profileRes.data ?? [];

    // Total revenue
    const total = txs.reduce((s, t) => s + (t.amount_paise ?? 0), 0);
    setTotalRevenue(total);

    // Status counts
    setActiveCount(profiles.filter(p => p.subscription_status === "active").length);
    setTrialCount(profiles.filter(p => p.subscription_status === "trial").length);
    setExpiredCount(profiles.filter(p => p.subscription_status === "expired").length);

    // Build chart points
    const points = buildChartPoints(txs, days);
    setChartData(points);
    setLoading(false);
  };

  useEffect(() => { load(range); }, [range]);

  return (
    <div className="min-h-screen bg-[hsl(220_18%_4%)] text-white">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <Shield size={14} className="text-white/70" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Admin Panel</p>
            <h1 className="text-sm font-semibold text-white">Revenue</h1>
          </div>
        </motion.div>
        <motion.button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs text-white/30 hover:text-white transition-colors" whileHover={{ x: -1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={12} /> Dashboard
        </motion.button>
      </header>

      <main className="px-6 py-8 max-w-4xl">
        {/* Range toggle */}
        <div className="mb-8 flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 w-fit">
          {RANGES.map(({ id, label }) => (
            <motion.button
              key={id}
              onClick={() => setRange(id)}
              className={`relative rounded-lg px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                range === id ? "text-black" : "text-white/30 hover:text-white/60"
              }`}
              whileTap={{ scale: 0.96 }}
            >
              {range === id && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-lg bg-white"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-white/30">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
            Loading…
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: IndianRupee, label: "Total revenue", value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`, color: "hsl(142 76% 56%)" },
                { icon: Users,       label: "Active subscribers", value: activeCount.toString(), color: "hsl(199 100% 64%)" },
                { icon: TrendingUp,  label: "In trial", value: trialCount.toString(), color: "hsl(256 92% 76%)" },
                { icon: UserX,       label: "Expired", value: expiredCount.toString(), color: "hsl(0 84% 60%)" },
              ].map(({ icon: Icon, label, value, color }, i) => (
                <motion.div
                  key={label}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                >
                  <div className="mb-3 grid h-8 w-8 place-items-center rounded-lg border border-white/10" style={{ background: `${color}14` }}>
                    <Icon size={14} style={{ color }} />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">{label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Bar chart */}
            <motion.div
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-white/25">Revenue over time</p>
              {chartData.length === 0 ? (
                <p className="py-16 text-center text-sm text-white/20">No revenue data for this period.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} barSize={range === "7d" ? 32 : range === "30d" ? 12 : 8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `₹${(v / 100).toLocaleString("en-IN")}`} tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220 18% 8%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff", fontFamily: "monospace", fontSize: 11 }}
                      formatter={(v: number) => [`₹${(v / 100).toLocaleString("en-IN")}`, "Revenue"]}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar dataKey="revenue" fill="hsl(199 100% 64%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

function buildChartPoints(
  txs: { created_at: string; amount_paise: number }[],
  days: number
): ChartPoint[] {
  const map = new Map<string, number>();
  const now = new Date();

  if (days <= 30) {
    // Daily buckets
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      map.set(key, 0);
    }
    for (const t of txs) {
      const key = new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      map.set(key, (map.get(key) ?? 0) + t.amount_paise);
    }
  } else if (days <= 90) {
    // Weekly buckets
    for (let i = 12; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = `W${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
      map.set(key, 0);
    }
    for (const t of txs) {
      const d = new Date(t.created_at);
      const weekAgo = new Date(d);
      weekAgo.setDate(d.getDate() - d.getDay());
      const key = `W${weekAgo.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
      map.set(key, (map.get(key) ?? 0) + t.amount_paise);
    }
  } else {
    // Monthly buckets
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      map.set(key, 0);
    }
    for (const t of txs) {
      const key = new Date(t.created_at).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      map.set(key, (map.get(key) ?? 0) + t.amount_paise);
    }
  }

  return Array.from(map.entries()).map(([label, revenue]) => ({ label, revenue }));
}

const AdminRevenue = () => (
  <AdminOnlyGuard>
    <RevenuePage />
  </AdminOnlyGuard>
);

export default AdminRevenue;
