"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  MessageSquare,
  UserPen,
  LogOut,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Fingerprint,
  Palette,
  FolderKanban,
  BookOpen,
  Lightbulb,
} from "lucide-react";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };
const EASE = [0.16, 1, 0.3, 1] as const;

const WORKSPACE = [
  {
    icon: UserPen,
    label: "Portfolio Editor",
    description: "Update content, upload resume, manage every section of your portfolio.",
    href: "/forge/tech/edit",
    accent: "hsl(var(--brand-cyan))",
  },
  {
    icon: FolderKanban,
    label: "Projects Editor",
    description: "Manage ecosystem projects — add live links, code repos, and seeking tags.",
    href: "/forge/projects",
    accent: "#C9A55A",
  },
  {
    icon: BookOpen,
    label: "Blogs Editor",
    description: "Curate your writing across Medium, Reddit, and LinkedIn.",
    href: "/forge/blogs",
    accent: "hsl(var(--brand-violet))",
  },
  {
    icon: Lightbulb,
    label: "Vision Editor",
    description: "Manage vision projects and their journey modules displayed on /vision.",
    href: "/forge/vision",
    accent: "#F59E0B",
  },
  {
    icon: MessageSquare,
    label: "Contact Queries",
    description: "Review and filter messages sent through portfolio and brand.",
    href: "/forge/tech/queries",
    accent: "hsl(var(--brand-pink))",
  },
  {
    icon: Fingerprint,
    label: "Identity Editor",
    description: "Edit display name, nav links, hub text states, logos, and social links.",
    href: "/forge/identity",
    accent: "#A78BFA",
  },
  {
    icon: Palette,
    label: "Theme Editor",
    description: "Customise colours, fonts, and border radius with a live preview.",
    href: "/forge/theme",
    accent: "#34D399",
  },
];

const DashboardPage = () => {
  const router = useRouter();
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

  const portfolioUrl = username ? `${window.location.origin}/portfolio/tech` : null;

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
    router.push("/admin");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0E", color: "#F8FAFC" }}>

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(201,165,90,0.12)",
        background: "rgba(10,11,14,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "default", userSelect: "none" }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <motion.div
            style={{
              display: "grid", placeItems: "center",
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #C9A55A 0%, #E0C27A 100%)",
            }}
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={SPRING}
          >
            <Sparkles size={15} color="#0A0B0E" />
          </motion.div>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,165,90,0.6)", margin: 0 }}>
              The Forge
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>
              {name ? `Welcome back, ${name.split(" ")[0]}.` : "Dashboard"}
            </p>
          </div>
        </motion.div>

        <motion.button
          onClick={signOut}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "7px 14px",
            fontFamily: "monospace", fontSize: 11,
            color: "rgba(255,255,255,0.35)", cursor: "pointer",
            transition: "all 0.2s",
          }}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)" }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={12} />
          Sign out
        </motion.button>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 28px 80px" }}>

        {/* Portfolio URL card */}
        <motion.div
          style={{
            marginBottom: 40,
            borderRadius: 16,
            border: "1px solid rgba(201,165,90,0.18)",
            background: "linear-gradient(135deg, rgba(201,165,90,0.06) 0%, rgba(10,11,14,0) 60%)",
            padding: "24px 28px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,165,90,0.7)", margin: 0 }}>
              Live Portfolio
            </p>
            <span style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.25)",
              borderRadius: 100, padding: "2px 10px",
              fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em",
              color: "rgba(52,211,153,0.7)",
            }}>
              ● Live
            </span>
          </div>
          {loadingProfile ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Loading…</span>
            </div>
          ) : portfolioUrl ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{
                flex: 1, minWidth: 0,
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "9px 14px",
              }}>
                <ExternalLink size={11} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {portfolioUrl}
                </a>
              </div>
              <motion.button
                onClick={copyUrl}
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "9px 16px",
                  fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em",
                  color: copied ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "Copied" : "Copy"}
              </motion.button>
              <motion.a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                  background: "linear-gradient(135deg, #C9A55A, #E0C27A)",
                  borderRadius: 10, padding: "9px 16px",
                  fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em",
                  color: "#0A0B0E", fontWeight: 600, textDecoration: "none",
                }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
              >
                <ExternalLink size={11} />
                View
              </motion.a>
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              background: "rgba(251,191,36,0.05)",
              border: "1px solid rgba(251,191,36,0.15)",
              borderRadius: 10, padding: 14,
            }}>
              <AlertCircle size={14} color="rgba(251,191,36,0.7)" style={{ marginTop: 1, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0 }}>No username set yet.</p>
                <p style={{ marginTop: 4, fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "4px 0 0" }}>
                  Go to{" "}
                  <button
                    onClick={() => router.push("/forge/tech/edit")}
                    style={{ background: "none", border: "none", color: "rgba(201,165,90,0.8)", cursor: "pointer", padding: 0, textDecoration: "underline", fontSize: 11 }}
                  >
                    Portfolio Editor
                  </button>{" "}
                  and set a username first.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Workspace section label */}
        <motion.p
          style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          Workspace
        </motion.p>

        {/* Editor cards grid */}
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {WORKSPACE.map((c, i) => (
            <motion.button
              key={c.href}
              onClick={() => router.push(c.href)}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                padding: "22px 22px 20px",
                textAlign: "left",
                cursor: "pointer",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 + i * 0.06, ease: EASE }}
              whileHover={{ y: -4, borderColor: `color-mix(in srgb, ${c.accent} 25%, transparent)`, backgroundColor: "rgba(255,255,255,0.04)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                style={{
                  display: "grid", placeItems: "center",
                  width: 40, height: 40, borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: `color-mix(in srgb, ${c.accent} 8%, transparent)`,
                  marginBottom: 16,
                }}
                whileHover={{ scale: 1.1, rotate: 4 }}
                transition={SPRING}
              >
                <c.icon size={18} style={{ color: c.accent }} />
              </motion.div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>{c.label}</p>
              <p style={{ marginTop: 6, fontSize: 11, lineHeight: 1.6, color: "rgba(255,255,255,0.38)" }}>{c.description}</p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
