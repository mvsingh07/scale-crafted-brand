import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, type ContactSubmission } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const Dashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setSubmissions((data as ContactSubmission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, is_read: true } : s)));
    setSelected((prev) => (prev?.id === id ? { ...prev, is_read: true } : prev));
  };

  const onRowClick = (s: ContactSubmission) => {
    setSelected(s);
    if (!s.is_read) markRead(s.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/wishmebest");
  };

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Control Panel</p>
          <h1 className="text-base font-semibold text-white">
            Contact Queries
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 font-mono text-[10px] text-black">
                {unreadCount} new
              </span>
            )}
          </h1>
        </div>
        <button
          onClick={signOut}
          className="font-mono text-xs text-white/30 transition-colors hover:text-white"
        >
          Sign out
        </button>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* List */}
        <div className="w-full max-w-sm flex-shrink-0 overflow-y-auto border-r border-white/10">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white" />
            </div>
          ) : submissions.length === 0 ? (
            <p className="p-6 font-mono text-xs text-white/30">No submissions yet.</p>
          ) : (
            submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => onRowClick(s)}
                className={`w-full border-b border-white/5 px-5 py-4 text-left transition-colors hover:bg-white/5 ${
                  selected?.id === s.id ? "bg-white/8" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!s.is_read && (
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      )}
                      <p className="truncate text-sm font-medium text-white">{s.name}</p>
                    </div>
                    <p className="truncate font-mono text-xs text-white/40">{s.email}</p>
                    {s.project_role && (
                      <p className="mt-1 truncate font-mono text-[10px] text-white/30">{s.project_role}</p>
                    )}
                  </div>
                  <p className="flex-shrink-0 font-mono text-[10px] text-white/20">
                    {formatDate(s.created_at)}
                  </p>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-white/50">{s.message}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto p-8">
          {selected ? (
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">From</p>
                <p className="text-2xl font-semibold text-white">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="font-mono text-sm text-blue-400 hover:underline">
                  {selected.email}
                </a>
              </div>

              {selected.project_role && (
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Project / Role</p>
                  <p className="text-sm text-white/70">{selected.project_role}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Message</p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{selected.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-white/20">{formatDate(selected.created_at)}</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                >
                  Reply via email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="font-mono text-xs text-white/20">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <AdminGuard>
    <Dashboard />
  </AdminGuard>
);

export default AdminDashboard;
