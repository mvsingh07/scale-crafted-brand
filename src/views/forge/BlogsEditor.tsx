"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { EcosystemBlog, BlogPlatform } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  LogOut,
  BookOpen,
  X,
} from "lucide-react";

const OWNER = "mvsingh";
const GOLD = "#C9A55A";
const EASE = [0.16, 1, 0.3, 1] as const;

const EMPTY_BLOG: Omit<EcosystemBlog, "id" | "created_at"> = {
  username: OWNER,
  title: "",
  subtitle: null,
  summary: null,
  image_url: null,
  platform: "medium",
  url: "",
  published_at: null,
  ord: 0,
  is_public: true,
};

const PLATFORM_OPTIONS: { value: BlogPlatform; label: string }[] = [
  { value: "medium",   label: "Medium"   },
  { value: "linkedin", label: "LinkedIn" },
  { value: "reddit",   label: "Reddit"   },
  { value: "other",    label: "Other"    },
];

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  padding: "8px 10px",
  color: "#F8FAFC",
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block",
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "rgba(255,255,255,0.3)",
  marginBottom: 5,
};

function Field({
  label, value, onChange, placeholder, multiline, type,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; type?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type ?? "text"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function BlogForm({
  blog,
  onSave,
  onDelete,
  onClose,
}: {
  blog: EcosystemBlog | Omit<EcosystemBlog, "id" | "created_at">;
  onSave: (b: EcosystemBlog | Omit<EcosystemBlog, "id" | "created_at">) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}) {
  const [data, setData] = useState(blog);
  const [saving, setSaving] = useState(false);
  const isNew = !("id" in data);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    if (!data.title.trim()) { toast.error("Title is required"); return; }
    if (!data.url.trim()) { toast.error("URL is required"); return; }
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          background: "#0E0F12",
          border: "1px solid rgba(201,165,90,0.2)",
          borderRadius: 16,
          width: "100%", maxWidth: 560,
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
            {isNew ? "New Article" : "Edit Article"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          <Field label="Title *" value={data.title} onChange={v => set("title", v)} placeholder="Article title" />
          <Field label="Subtitle" value={data.subtitle ?? ""} onChange={v => set("subtitle", v || null)} placeholder="Short subtitle" />
          <Field label="Summary" value={data.summary ?? ""} onChange={v => set("summary", v || null)} placeholder="Brief description shown in the list" multiline />
          <Field label="Article URL *" value={data.url} onChange={v => set("url", v)} placeholder="https://medium.com/..." />
          <Field label="Cover Image URL" value={data.image_url ?? ""} onChange={v => set("image_url", v || null)} placeholder="https://..." />
          <Field label="Published Date" value={data.published_at ?? ""} onChange={v => set("published_at", v || null)} type="date" />

          {/* Platform */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Platform</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PLATFORM_OPTIONS.map(p => (
                <button
                  key={p.value}
                  onClick={() => set("platform", p.value)}
                  style={{
                    background: data.platform === p.value ? "rgba(201,165,90,0.12)" : "rgba(255,255,255,0.03)",
                    border: data.platform === p.value ? "1px solid rgba(201,165,90,0.3)" : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8, padding: "7px 14px",
                    fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11,
                    color: data.platform === p.value ? GOLD : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order + visibility */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Order</label>
              <input
                type="number"
                value={data.ord}
                onChange={e => set("ord", Number(e.target.value))}
                style={inputStyle}
                min={0}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button
                onClick={() => set("is_public", !data.is_public)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: data.is_public ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                  border: data.is_public ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "8px 14px",
                  fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11,
                  color: data.is_public ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.35)",
                  cursor: "pointer", marginTop: 21,
                }}
              >
                {data.is_public ? <Eye size={12} /> : <EyeOff size={12} />}
                {data.is_public ? "Public" : "Hidden"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          {onDelete ? (
            <button
              onClick={onDelete}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: "rgba(239,68,68,0.7)", cursor: "pointer" }}
            >
              <Trash2 size={12} /> Delete
            </button>
          ) : <div />}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 16px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 6, background: saving ? "rgba(201,165,90,0.2)" : "rgba(201,165,90,0.18)", border: "1px solid rgba(201,165,90,0.3)", borderRadius: 8, padding: "8px 18px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: GOLD, cursor: saving ? "not-allowed" : "pointer" }}
            >
              <Save size={12} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const EditorPage = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<EcosystemBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EcosystemBlog | null>(null);
  const [creating, setCreating] = useState(false);

  const fetch = async () => {
    const { data } = await supabase
      .from("ecosystem_blogs")
      .select("*")
      .eq("username", OWNER)
      .order("ord", { ascending: true });
    setBlogs((data as EcosystemBlog[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const saveNew = async (b: Omit<EcosystemBlog, "id" | "created_at">) => {
    const { error } = await supabase.from("ecosystem_blogs").insert({ ...b, username: OWNER });
    if (error) { toast.error("Failed to create", { description: error.message }); return; }
    toast.success("Article added");
    setCreating(false);
    fetch();
  };

  const saveEdit = async (b: EcosystemBlog) => {
    const { id, created_at, ...payload } = b;
    const { error } = await supabase.from("ecosystem_blogs").update(payload).eq("id", id);
    if (error) { toast.error("Failed to save", { description: error.message }); return; }
    toast.success("Article saved");
    setEditing(null);
    fetch();
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("ecosystem_blogs").delete().eq("id", id);
    toast.success("Deleted");
    setEditing(null);
    fetch();
  };

  const PLATFORM_COLOR: Record<BlogPlatform, string> = {
    medium: "rgba(255,255,255,0.5)",
    linkedin: "rgba(10,102,194,0.8)",
    reddit: "rgba(255,100,0,0.8)",
    other: GOLD,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0E", color: "#F8FAFC" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: "1px solid rgba(201,165,90,0.12)", position: "sticky", top: 0, zIndex: 10, background: "rgba(10,11,14,0.95)", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/forge/tech")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
            <ArrowLeft size={13} /> Dashboard
          </button>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={14} color={GOLD} />
            <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>Blogs Editor</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setCreating(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #C9A55A, #E0C27A)", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#0A0B0E", cursor: "pointer" }}
          >
            <Plus size={13} /> Add Article
          </button>
          <button onClick={() => window.open("/blog", "_blank")} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 14px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "monospace" }}>
            <ExternalLink size={11} /> Preview
          </button>
          <button onClick={signOut} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 14px", fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 28px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
          </div>
        ) : blogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80 }}>
            <BookOpen size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 14px" }} />
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
              No articles yet.{" "}
              <button onClick={() => setCreating(true)} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", textDecoration: "underline", fontSize: 14 }}>
                Add your first one.
              </button>
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {blogs.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}
                onClick={() => setEditing(b)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(201,165,90,0.2)" }}
              >
                <GripVertical size={13} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
                {b.image_url && (
                  <div style={{ width: 48, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <img src={b.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.title}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: PLATFORM_COLOR[b.platform] }}>{b.platform}</span>
                    {b.published_at && <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{new Date(b.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>}
                    {!b.is_public && <EyeOff size={10} color="rgba(255,255,255,0.2)" />}
                  </div>
                </div>
                <ExternalLink size={12} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {creating && (
          <BlogForm
            blog={{ ...EMPTY_BLOG, ord: blogs.length }}
            onSave={saveNew as (b: EcosystemBlog | Omit<EcosystemBlog, "id" | "created_at">) => Promise<void>}
            onClose={() => setCreating(false)}
          />
        )}
        {editing && (
          <BlogForm
            blog={editing}
            onSave={saveEdit as (b: EcosystemBlog | Omit<EcosystemBlog, "id" | "created_at">) => Promise<void>}
            onDelete={() => deleteBlog(editing.id)}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const BlogsEditor = () => (
  <AdminGuard>
    <EditorPage />
  </AdminGuard>
);

export default BlogsEditor;
