"use client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AdminOnlyGuard } from "@/components/AdminOnlyGuard";
import { supabase } from "@/lib/supabase";
import { Shield, Users, CreditCard, BarChart2, Settings, LogOut } from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

const navCards = [
  { icon: Users,     label: "Users",              description: "View all registered users, subscription status, and trial info.", href: "/admin/users",          accent: "hsl(199 100% 64%)" },
  { icon: CreditCard,label: "Transactions",        description: "Browse payment history, filter by status, plan, or date.",       href: "/admin/transactions",   accent: "hsl(256 92% 76%)" },
  { icon: BarChart2, label: "Revenue",             description: "Track total income and revenue trends over time.",               href: "/admin/revenue",        accent: "hsl(142 76% 56%)" },
  { icon: Settings,  label: "Payment Config",      description: "Configure Razorpay keys, plan IDs, and trial duration.",        href: "/admin/payment-config", accent: "hsl(38 96% 64%)" },
];

const AdminDashboardPage = () => {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[hsl(220_18%_4%)] text-white">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <motion.div
          className="flex items-center gap-3 cursor-default select-none"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
            <Shield size={14} className="text-white/70" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Admin Panel</p>
            <h1 className="text-sm font-semibold text-white">Scale Crafted</h1>
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
        <motion.p
          className="mb-6 font-mono text-[10px] uppercase tracking-widest text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          Management
        </motion.p>

        <div className="grid gap-4 sm:grid-cols-2">
          {navCards.map((c, i) => (
            <motion.button
              key={c.href}
              onClick={() => router.push(c.href)}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.04)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10"
                style={{ background: `color-mix(in srgb, ${c.accent} 8%, transparent)` }}
                whileHover={{ scale: 1.12, rotate: 4 }}
                transition={SPRING}
              >
                <c.icon size={18} style={{ color: c.accent }} />
              </motion.div>
              <p className="text-sm font-semibold text-white">{c.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/35">{c.description}</p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

const AdminDashboard = () => (
  <AdminOnlyGuard>
    <AdminDashboardPage />
  </AdminOnlyGuard>
);

export default AdminDashboard;
