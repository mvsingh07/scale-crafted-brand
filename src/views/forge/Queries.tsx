"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { supabase, type ContactSubmission } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  ArrowLeft,
  LogOut,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

type Filter = "all" | "portfolio" | "brand";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Portfolio", value: "portfolio" },
  { label: "Brand", value: "brand" },
];

const SOURCE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  portfolio: { label: "Portfolio", color: "rgba(56,189,248,0.8)", bg: "rgba(56,189,248,0.08)" },
  brand:     { label: "Brand",     color: "rgba(201,165,90,0.9)", bg: "rgba(201,165,90,0.08)" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const EASE = [0.16, 1, 0.3, 1] as const;

const QueriesPage = () => {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions((data as ContactSubmission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const markRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: true })
      .eq("id", id);
    if (error) { toast.error("Failed to mark as read"); return; }
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true } : s));
    setSelected(prev => prev?.id === id ? { ...prev, is_read: true } : prev);
  };

  const onRowClick = (s: ContactSubmission) => {
    setSelected(s);
    if (!s.is_read) markRead(s.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/admin");
  };

  const filtered = submissions.filter(s =>
    filter === "all" ? true : s.source === filter
  );

  const unreadCount = submissions.filter(s => !s.is_read).length;
  const filteredUnread = filtered.filter(s => !s.is_read).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0E", color: "#F8FAFC", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(201,165,90,0.12)",
        background: "rgba(10,11,14,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 10, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => router.push("/forge/tech")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none",
              fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)", cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            <ArrowLeft size={13} />
            Dashboard
          </button>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          <div>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,165,90,0.6)", margin: 0 }}>
              The Forge
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", margin: 0 }}>Contact Queries</p>
              {unreadCount > 0 && (
                <span style={{
                  background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)",
                  borderRadius: 100, padding: "2px 8px",
                  fontFamily: "monospace", fontSize: 9, color: "rgba(56,189,248,0.8)",
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={signOut}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "7px 14px",
            fontFamily: "monospace", fontSize: 11,
            color: "rgba(255,255,255,0.35)", cursor: "pointer",
          }}
        >
          <LogOut size={12} />
          Sign out
        </button>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 57px)" }}>

        {/* Left panel */}
        <div style={{
          width: 320, flexShrink: 0,
          display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}>

          {/* Filter tabs */}
          <div style={{
            display: "flex", gap: 4, padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  flex: 1,
                  background: filter === f.value ? "rgba(201,165,90,0.12)" : "transparent",
                  border: filter === f.value ? "1px solid rgba(201,165,90,0.25)" : "1px solid transparent",
                  borderRadius: 8, padding: "6px 0",
                  fontFamily: "monospace", fontSize: 10, letterSpacing: "0.06em",
                  color: filter === f.value ? "rgba(201,165,90,0.9)" : "rgba(255,255,255,0.3)",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {f.label}
                {f.value !== "all" && (
                  <span style={{ marginLeft: 5, opacity: 0.6 }}>
                    ({submissions.filter(s => s.source === f.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 0,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}>
            <div style={{ flex: 1, padding: "10px 16px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", margin: "0 0 2px" }}>TOTAL</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>{filtered.length}</p>
            </div>
            <div style={{ flex: 1, padding: "10px 16px" }}>
              <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(56,189,248,0.5)", letterSpacing: "0.1em", margin: "0 0 2px" }}>UNREAD</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: filteredUnread > 0 ? "rgba(56,189,248,0.85)" : "rgba(255,255,255,0.2)", margin: 0 }}>{filteredUnread}</p>
            </div>
          </div>

          {/* Message list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/50" />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 120, gap: 8 }}>
                <MessageSquare size={20} color="rgba(255,255,255,0.1)" />
                <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>No messages</p>
              </div>
            ) : (
              filtered.map(s => {
                const badge = SOURCE_BADGE[s.source] ?? SOURCE_BADGE.portfolio;
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => onRowClick(s)}
                    style={{
                      width: "100%",
                      background: selected?.id === s.id ? "rgba(201,165,90,0.06)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      padding: "14px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      borderLeft: selected?.id === s.id ? "2px solid rgba(201,165,90,0.5)" : "2px solid transparent",
                    }}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                    transition={{ duration: 0.1 }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          {!s.is_read && (
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(56,189,248,0.8)", flexShrink: 0 }} />
                          )}
                          <p style={{ fontSize: 13, fontWeight: s.is_read ? 400 : 600, color: s.is_read ? "rgba(255,255,255,0.6)" : "#F8FAFC", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {s.name}
                          </p>
                        </div>
                        <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {s.email}
                        </p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {s.message}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                        <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", margin: 0, whiteSpace: "nowrap" }}>
                          {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                        <span style={{
                          background: badge.bg, borderRadius: 6,
                          padding: "2px 7px", fontFamily: "monospace",
                          fontSize: 9, color: badge.color,
                        }}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Right detail panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ maxWidth: 640 }}
              >
                {/* Source + date row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  {(() => {
                    const badge = SOURCE_BADGE[selected.source] ?? SOURCE_BADGE.portfolio;
                    return (
                      <span style={{
                        background: badge.bg,
                        border: `1px solid ${badge.color}40`,
                        borderRadius: 8, padding: "4px 10px",
                        fontFamily: "monospace", fontSize: 10, color: badge.color,
                      }}>
                        {badge.label}
                      </span>
                    );
                  })()}
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                    {formatDate(selected.created_at)}
                  </span>
                  {selected.is_read && (
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(52,211,153,0.5)", marginLeft: "auto" }}>
                      ✓ Read
                    </span>
                  )}
                </div>

                {/* Sender */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 8px" }}>From</p>
                  <p style={{ fontSize: 26, fontWeight: 700, color: "#F8FAFC", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{selected.name}</p>
                  <a
                    href={`mailto:${selected.email}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontFamily: "monospace", fontSize: 12,
                      color: "rgba(201,165,90,0.8)", textDecoration: "none",
                    }}
                  >
                    <Mail size={12} />
                    {selected.email}
                  </a>
                </div>

                {/* Project / Role */}
                {selected.project_role && (
                  <div style={{
                    marginBottom: 24, padding: "12px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                  }}>
                    <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 6px" }}>Project / Role</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>{selected.project_role}</p>
                  </div>
                )}

                {/* Message */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 10px" }}>Message</p>
                  <div style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12, padding: "20px 22px",
                  }}>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", margin: 0, whiteSpace: "pre-wrap" }}>
                      {selected.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <a
                    href={`mailto:${selected.email}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "linear-gradient(135deg, #C9A55A, #E0C27A)",
                      borderRadius: 10, padding: "10px 20px",
                      fontSize: 13, fontWeight: 600, color: "#0A0B0E",
                      textDecoration: "none",
                    }}
                  >
                    <Mail size={14} />
                    Reply via email
                  </a>
                  <a
                    href={`mailto:${selected.email}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, padding: "10px 16px",
                      fontSize: 12, color: "rgba(255,255,255,0.4)",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={13} />
                    Open email client
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, minHeight: 300 }}
              >
                <MessageSquare size={28} color="rgba(255,255,255,0.08)" />
                <p style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                  Select a message to view
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ForgeQueries = () => (
  <AdminGuard>
    <QueriesPage />
  </AdminGuard>
);

export default ForgeQueries;
