"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { EcosystemProject, ProjectStatus } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Github,
  Eye,
  EyeOff,
  GripVertical,
  LogOut,
  FolderKanban,
  X,
} from "lucide-react";

const OWNER = "mvsingh";
const GOLD = "#C9A55A";
const EASE = [0.16, 1, 0.3, 1] as const;

const EMPTY_PROJECT: Omit<EcosystemProject, "id" | "created_at"> = {
  username: OWNER,
  title: "",
  tagline: "",
  description: "",
  status: "active",
  live_url: null,
  code_url: null,
  stack_tags: [],
  seeking: [],
  cover_image_url: null,
  is_public: true,
  ord: 0,
};

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "active",    label: "Active"    },
  { value: "completed", label: "Completed" },
  { value: "paused",    label: "Paused"    },
];

const SEEKING_OPTIONS = ["Contributions", "Investors", "Sharing", "Feedback", "Co-founders"];

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
          rows={4}
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

function TagInput({
  label, tags, onChange, suggestions,
}: {
  label: string; tags: string[]; onChange: (t: string[]) => void; suggestions?: string[];
}) {
  const [input, setInput] = useState("");

  const add = (val: string) => {
    const v = val.trim();
    if (!v || tags.includes(v)) return;
    onChange([...tags, v]);
    setInput("");
  };

  const remove = (t: string) => onChange(tags.filter(x => x !== t));

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {tags.map(t => (
          <span key={t} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(201,165,90,0.1)", border: "1px solid rgba(201,165,90,0.2)",
            borderRadius: 6, padding: "3px 8px",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, color: GOLD,
          }}>
            {t}
            <button onClick={() => remove(t)} style={{ background: "none", border: "none", color: "rgba(201,165,90,0.5)", cursor: "pointer", padding: 0, lineHeight: 1 }}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      {suggestions && (
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
          {suggestions.filter(s => !tags.includes(s)).map(s => (
            <button
              key={s}
              onClick={() => add(s)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "3px 8px",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 10, color: "rgba(255,255,255,0.35)", cursor: "pointer",
              }}
            >
              + {s}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(input); } }}
          placeholder="Type and press Enter"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={() => add(input)}
          style={{
            background: "rgba(201,165,90,0.1)", border: "1px solid rgba(201,165,90,0.2)",
            borderRadius: 8, padding: "8px 14px",
            color: GOLD, cursor: "pointer", fontSize: 12, fontFamily: "monospace",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onSave,
  onDelete,
  onClose,
}: {
  project: EcosystemProject | Omit<EcosystemProject, "id" | "created_at">;
  onSave: (p: EcosystemProject | Omit<EcosystemProject, "id" | "created_at">) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}) {
  const [data, setData] = useState(project);
  const [saving, setSaving] = useState(false);
  const isNew = !("id" in data);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    if (!data.title.trim()) { toast.error("Title is required"); return; }
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
          width: "100%", maxWidth: 580,
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
            {isNew ? "New Project" : "Edit Project"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          <Field label="Title *" value={data.title} onChange={v => set("title", v)} placeholder="Project name" />
          <Field label="Tagline" value={data.tagline} onChange={v => set("tagline", v)} placeholder="One-line pitch" />
          <Field label="Description" value={data.description} onChange={v => set("description", v)} placeholder="What are you building and why?" multiline />
          <Field label="Live URL" value={data.live_url ?? ""} onChange={v => set("live_url", v || null)} placeholder="https://" />
          <Field label="Code / Repo URL" value={data.code_url ?? ""} onChange={v => set("code_url", v || null)} placeholder="https://github.com/..." />
          <Field label="Cover Image URL" value={data.cover_image_url ?? ""} onChange={v => set("cover_image_url", v || null)} placeholder="https://..." />

          {/* Status */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 6 }}>
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => set("status", s.value)}
                  style={{
                    flex: 1,
                    background: data.status === s.value ? "rgba(201,165,90,0.12)" : "rgba(255,255,255,0.03)",
                    border: data.status === s.value ? "1px solid rgba(201,165,90,0.3)" : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8, padding: "7px 0",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 11, color: data.status === s.value ? GOLD : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <TagInput
            label="Tech Stack"
            tags={data.stack_tags}
            onChange={v => set("stack_tags", v)}
          />
          <TagInput
            label="Open To (seeking)"
            tags={data.seeking}
            onChange={v => set("seeking", v)}
            suggestions={SEEKING_OPTIONS}
          />

          {/* Visibility + order */}
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
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", marginBottom: 0 }}>
              <button
                onClick={() => set("is_public", !data.is_public)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: data.is_public ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                  border: data.is_public ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "8px 14px",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 11,
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

        {/* Footer actions */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          {onDelete ? (
            <button
              onClick={onDelete}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8, padding: "8px 14px",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 11, color: "rgba(239,68,68,0.7)", cursor: "pointer",
              }}
            >
              <Trash2 size={12} /> Delete
            </button>
          ) : <div />}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "8px 16px",
              fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12,
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
            }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: saving ? "rgba(201,165,90,0.2)" : "rgba(201,165,90,0.18)",
                border: "1px solid rgba(201,165,90,0.3)",
                borderRadius: 8, padding: "8px 18px",
                fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12,
                color: GOLD, cursor: saving ? "not-allowed" : "pointer",
              }}
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
  const [projects, setProjects] = useState<EcosystemProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EcosystemProject | null>(null);
  const [creating, setCreating] = useState(false);

  const fetch = async () => {
    const { data } = await supabase
      .from("ecosystem_projects")
      .select("*")
      .eq("username", OWNER)
      .order("ord", { ascending: true });
    setProjects((data as EcosystemProject[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const saveNew = async (p: Omit<EcosystemProject, "id" | "created_at">) => {
    const { error } = await supabase.from("ecosystem_projects").insert({ ...p, username: OWNER });
    if (error) { toast.error("Failed to create", { description: error.message }); return; }
    toast.success("Project created");
    setCreating(false);
    fetch();
  };

  const saveEdit = async (p: EcosystemProject) => {
    const { id, created_at, ...payload } = p;
    const { error } = await supabase.from("ecosystem_projects").update(payload).eq("id", id);
    if (error) { toast.error("Failed to save", { description: error.message }); return; }
    toast.success("Project saved");
    setEditing(null);
    fetch();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("ecosystem_projects").delete().eq("id", id);
    toast.success("Deleted");
    setEditing(null);
    fetch();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0E", color: "#F8FAFC" }}>

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(201,165,90,0.12)",
        position: "sticky", top: 0, zIndex: 10,
        background: "rgba(10,11,14,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => router.push("/forge/tech")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
          >
            <ArrowLeft size={13} /> Dashboard
          </button>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FolderKanban size={14} color={GOLD} />
            <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
              Projects Editor
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setCreating(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #C9A55A, #E0C27A)",
              border: "none", borderRadius: 8, padding: "8px 16px",
              fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, fontWeight: 600,
              color: "#0A0B0E", cursor: "pointer",
            }}
          >
            <Plus size={13} /> New Project
          </button>
          <button
            onClick={() => window.open("/work", "_blank")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, padding: "8px 14px",
              fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "monospace",
            }}
          >
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
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", paddingTop: 80 }}
          >
            <FolderKanban size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 14px" }} />
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
              No projects yet.{" "}
              <button onClick={() => setCreating(true)} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", textDecoration: "underline", fontSize: 14 }}>
                Add your first one.
              </button>
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "16px 18px",
                  cursor: "pointer",
                }}
                onClick={() => setEditing(p)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(201,165,90,0.2)" }}
              >
                <GripVertical size={14} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.title}
                    </p>
                    <span style={{
                      background: p.status === "active" ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${p.status === "active" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 5, padding: "1px 7px",
                      fontFamily: "monospace", fontSize: 9,
                      color: p.status === "active" ? "rgba(52,211,153,0.75)" : "rgba(255,255,255,0.3)",
                    }}>
                      {p.status}
                    </span>
                    {!p.is_public && <EyeOff size={11} color="rgba(255,255,255,0.25)" />}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.tagline || "No tagline"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {p.live_url && <ExternalLink size={13} color="rgba(201,165,90,0.5)" />}
                  {p.code_url && <Github size={13} color="rgba(255,255,255,0.25)" />}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {creating && (
          <ProjectForm
            project={{ ...EMPTY_PROJECT, ord: projects.length }}
            onSave={saveNew as (p: EcosystemProject | Omit<EcosystemProject, "id" | "created_at">) => Promise<void>}
            onClose={() => setCreating(false)}
          />
        )}
        {editing && (
          <ProjectForm
            project={editing}
            onSave={saveEdit as (p: EcosystemProject | Omit<EcosystemProject, "id" | "created_at">) => Promise<void>}
            onDelete={() => deleteProject(editing.id)}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProjectsEditor = () => (
  <AdminGuard>
    <EditorPage />
  </AdminGuard>
);

export default ProjectsEditor;
