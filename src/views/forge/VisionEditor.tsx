"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { VisionaryProject, VisionProjectModule, VisionModuleDivision } from "@/lib/supabase";
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
  Lightbulb,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const OWNER = "mvsingh";
const GOLD = "#C9A55A";
const EASE = [0.16, 1, 0.3, 1] as const;

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

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

// ── Division editor row inside a module ───────────────────────────────────────
type DraftDivision = Partial<VisionModuleDivision>;

function DivisionRow({
  division: d, index: i,
  onChange, onDelete,
}: {
  division: DraftDivision; index: number;
  onChange: (d: DraftDivision) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "rgba(201,165,90,0.03)",
      border: "1px solid rgba(201,165,90,0.1)",
      borderRadius: 8, marginBottom: 6,
    }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(201,165,90,0.45)", flexShrink: 0, minWidth: 16 }}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 11, color: "#F8FAFC", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {d.title || "Untitled division"}
        </span>
        <button onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", color: "rgba(255,100,100,0.4)", cursor: "pointer", padding: 2, flexShrink: 0 }}>
          <Trash2 size={10} />
        </button>
        {open ? <ChevronDown size={10} color="rgba(255,255,255,0.2)" /> : <ChevronRight size={10} color="rgba(255,255,255,0.2)" />}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 10px 10px" }}>
              <Field label="Title *" value={d.title ?? ""} onChange={v => onChange({ ...d, title: v })} placeholder="Division name" />
              <Field label="Subtitle" value={d.subtitle ?? ""} onChange={v => onChange({ ...d, subtitle: v || undefined })} placeholder="Short tagline" />
              <Field label="Description" value={d.description ?? ""} onChange={v => onChange({ ...d, description: v })} placeholder="What this covers…" multiline />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Module form inside the project modal ──────────────────────────────────────
type DraftModule = Partial<VisionProjectModule> & { divisions: DraftDivision[] };

function ModuleRow({
  module: m, index: i, total,
  onChange, onDelete,
}: {
  module: DraftModule; index: number; total: number;
  onChange: (m: DraftModule) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(i === 0);

  const addDivision = () =>
    onChange({ ...m, divisions: [...m.divisions, { title: "", subtitle: undefined, description: "", ord: m.divisions.length }] });

  const updateDivision = (di: number, d: DraftDivision) =>
    onChange({ ...m, divisions: m.divisions.map((x, idx) => idx === di ? d : x) });

  const removeDivision = (di: number) =>
    onChange({ ...m, divisions: m.divisions.filter((_, idx) => idx !== di) });

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, marginBottom: 8,
    }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
      >
        <GripVertical size={12} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 11, color: GOLD, flexShrink: 0 }}>
          {String(i + 1).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 12, color: "#F8FAFC", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {m.title || "Untitled module"}
        </span>
        {m.divisions.length > 0 && (
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(201,165,90,0.45)", flexShrink: 0 }}>
            {m.divisions.length}÷
          </span>
        )}
        <button onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", color: "rgba(255,100,100,0.45)", cursor: "pointer", padding: 2, flexShrink: 0 }}>
          <Trash2 size={11} />
        </button>
        {open ? <ChevronDown size={11} color="rgba(255,255,255,0.25)" /> : <ChevronRight size={11} color="rgba(255,255,255,0.25)" />}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 12px 12px" }}>
              <Field label="Title *" value={m.title ?? ""} onChange={v => onChange({ ...m, title: v })} placeholder="Module name" />
              <Field label="Subtitle" value={m.subtitle ?? ""} onChange={v => onChange({ ...m, subtitle: v || undefined })} placeholder="Short tagline" />
              <Field label="Description" value={m.description ?? ""} onChange={v => onChange({ ...m, description: v })} placeholder="What this module covers…" multiline />

              {/* Divisions */}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0, fontSize: 9 }}>Divisions</label>
                  <button
                    onClick={addDivision}
                    style={{
                      display: "flex", alignItems: "center", gap: 3,
                      background: "rgba(201,165,90,0.06)", border: "1px solid rgba(201,165,90,0.15)",
                      borderRadius: 5, padding: "3px 8px",
                      fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 9,
                      color: "rgba(201,165,90,0.6)", cursor: "pointer",
                    }}
                  >
                    <Plus size={9} /> Add
                  </button>
                </div>
                {m.divisions.map((d, di) => (
                  <DivisionRow
                    key={di}
                    division={d}
                    index={di}
                    onChange={updated => updateDivision(di, updated)}
                    onDelete={() => removeDivision(di)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Project form modal ────────────────────────────────────────────────────────
type DraftProject = Omit<VisionaryProject, "id" | "created_at"> & {
  modules: DraftModule[];
};

function ProjectForm({
  project, onSave, onDelete, onClose,
}: {
  project: (VisionaryProject & { modules: (VisionProjectModule & { divisions: VisionModuleDivision[] })[] }) | null;
  onSave: (d: DraftProject, id?: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}) {
  const isNew = project === null;
  const [data, setData] = useState<DraftProject>({
    username: OWNER,
    title: project?.title ?? "",
    subtitle: project?.subtitle ?? null,
    live_url: project?.live_url ?? null,
    description: project?.description ?? "",
    ord: project?.ord ?? 0,
    is_public: project?.is_public ?? true,
    modules: (project?.modules ?? []).map(m => ({ ...m, divisions: m.divisions ?? [] })),
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof DraftProject>(k: K, v: DraftProject[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const addModule = () =>
    set("modules", [...data.modules, { title: "", subtitle: undefined, description: "", ord: data.modules.length, divisions: [] }]);

  const updateModule = (i: number, m: DraftModule) =>
    set("modules", data.modules.map((x, idx) => idx === i ? m : x));

  const removeModule = (i: number) =>
    set("modules", data.modules.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!data.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    await onSave(data, project?.id);
    setSaving(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
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
          width: "100%", maxWidth: 640,
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
            {isNew ? "New Vision Project" : "Edit Vision Project"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          <Field label="Title *" value={data.title} onChange={v => set("title", v)} placeholder="Project name" />
          <Field label="Subtitle (optional)" value={data.subtitle ?? ""} onChange={v => set("subtitle", v || null)} placeholder="Short descriptor" />
          <Field label="Description" value={data.description} onChange={v => set("description", v)} placeholder="What is this project about?" multiline />
          <Field label="Live Link (optional)" value={data.live_url ?? ""} onChange={v => set("live_url", v || null)} placeholder="https://" />

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Order</label>
              <input type="number" value={data.ord} onChange={e => set("ord", Number(e.target.value))}
                style={inputStyle} min={0} />
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

          {/* Modules */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ ...labelStyle, marginBottom: 12 }}>Journey Modules</label>
            {data.modules.map((m, i) => (
              <ModuleRow
                key={i}
                module={m}
                index={i}
                total={data.modules.length}
                onChange={updated => updateModule(i, updated)}
                onDelete={() => removeModule(i)}
              />
            ))}
            <button
              onClick={addModule}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "8px 12px",
                color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                width: "100%", justifyContent: "center", marginTop: 4,
              }}
            >
              <Plus size={11} /> Add Module
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}>
          {onDelete ? (
            <button onClick={onDelete} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8, padding: "8px 14px",
              fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11,
              color: "rgba(239,68,68,0.7)", cursor: "pointer",
            }}>
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
            <button onClick={handleSave} disabled={saving} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(201,165,90,0.18)", border: "1px solid rgba(201,165,90,0.3)",
              borderRadius: 8, padding: "8px 18px",
              fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12,
              color: GOLD, cursor: saving ? "not-allowed" : "pointer",
            }}>
              <Save size={12} />
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
type ModuleWithDivisions = VisionProjectModule & { divisions: VisionModuleDivision[] };
type ProjectWithModules = VisionaryProject & { modules: ModuleWithDivisions[] };

const EditorPage = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectWithModules[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectWithModules | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchAll = async () => {
    const { data: projs } = await supabase
      .from("visionary_projects")
      .select("*")
      .eq("username", OWNER)
      .order("ord", { ascending: true });

    if (!projs?.length) { setProjects([]); setLoading(false); return; }

    const projectIds = projs.map(p => p.id);
    const { data: mods } = await supabase
      .from("vision_project_modules")
      .select("*")
      .in("project_id", projectIds)
      .order("ord", { ascending: true });

    const allMods = mods ?? [];
    const moduleIds = allMods.map(m => m.id);

    const { data: divs } = moduleIds.length
      ? await supabase
          .from("vision_module_divisions")
          .select("*")
          .in("module_id", moduleIds)
          .order("ord", { ascending: true })
      : { data: [] };

    const divsByModule = (divs ?? []).reduce<Record<string, VisionModuleDivision[]>>((acc, d) => {
      (acc[d.module_id] ??= []).push(d);
      return acc;
    }, {});

    const byProject = allMods.reduce<Record<string, ModuleWithDivisions[]>>((acc, m) => {
      (acc[m.project_id] ??= []).push({ ...m, divisions: divsByModule[m.id] ?? [] });
      return acc;
    }, {});

    setProjects(projs.map(p => ({ ...p, modules: byProject[p.id] ?? [] })));
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const saveProject = async (draft: DraftProject, id?: string) => {
    const { modules, ...projectData } = draft;

    if (id) {
      const { error } = await supabase
        .from("visionary_projects")
        .update({ ...projectData, username: OWNER })
        .eq("id", id);
      if (error) { toast.error("Failed to save", { description: error.message }); return; }

      // Delete all modules (cascades to divisions), then re-insert
      await supabase.from("vision_project_modules").delete().eq("project_id", id);

      if (modules.length) {
        const modInserts = modules.map((m, i) => ({
          project_id: id,
          title: m.title ?? "",
          subtitle: m.subtitle ?? null,
          description: m.description ?? "",
          ord: i,
        }));
        const { data: newMods, error: me } = await supabase
          .from("vision_project_modules")
          .insert(modInserts)
          .select();
        if (me) { toast.error("Modules save failed", { description: me.message }); return; }

        // Insert divisions with the new module IDs
        const divInserts = (newMods ?? []).flatMap((newMod, mi) =>
          (modules[mi]?.divisions ?? []).map((d, di) => ({
            module_id: newMod.id,
            title: d.title ?? "",
            subtitle: d.subtitle ?? null,
            description: d.description ?? "",
            ord: di,
          }))
        );
        if (divInserts.length) {
          const { error: de } = await supabase.from("vision_module_divisions").insert(divInserts);
          if (de) { toast.error("Divisions save failed", { description: de.message }); return; }
        }
      }

      toast.success("Project saved");
      setEditing(null);
    } else {
      const { data: newProj, error } = await supabase
        .from("visionary_projects")
        .insert({ ...projectData, username: OWNER })
        .select()
        .single();
      if (error || !newProj) { toast.error("Failed to create", { description: error?.message }); return; }

      if (modules.length) {
        const modInserts = modules.map((m, i) => ({
          project_id: newProj.id,
          title: m.title ?? "",
          subtitle: m.subtitle ?? null,
          description: m.description ?? "",
          ord: i,
        }));
        const { data: newMods } = await supabase
          .from("vision_project_modules")
          .insert(modInserts)
          .select();

        const divInserts = (newMods ?? []).flatMap((newMod, mi) =>
          (modules[mi]?.divisions ?? []).map((d, di) => ({
            module_id: newMod.id,
            title: d.title ?? "",
            subtitle: d.subtitle ?? null,
            description: d.description ?? "",
            ord: di,
          }))
        );
        if (divInserts.length) {
          await supabase.from("vision_module_divisions").insert(divInserts);
        }
      }

      toast.success("Project created");
      setCreating(false);
    }

    fetchAll();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this vision project and all its modules?")) return;
    await supabase.from("visionary_projects").delete().eq("id", id);
    toast.success("Deleted");
    setEditing(null);
    fetchAll();
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
            <Lightbulb size={14} color={GOLD} />
            <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
              Vision Editor
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
            onClick={() => window.open("/vision", "_blank")}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80 }}>
            <Lightbulb size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 14px" }} />
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
              No vision projects yet.{" "}
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
                  borderRadius: 12, padding: "16px 18px", cursor: "pointer",
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
                      background: "rgba(201,165,90,0.07)", border: "1px solid rgba(201,165,90,0.18)",
                      borderRadius: 5, padding: "1px 7px", fontFamily: "monospace", fontSize: 9,
                      color: "rgba(201,165,90,0.6)",
                    }}>
                      {p.modules.length} module{p.modules.length !== 1 ? "s" : ""}
                    </span>
                    {p.modules.some(m => m.divisions.length > 0) && (
                      <span style={{
                        background: "rgba(201,165,90,0.04)", border: "1px solid rgba(201,165,90,0.12)",
                        borderRadius: 5, padding: "1px 7px", fontFamily: "monospace", fontSize: 9,
                        color: "rgba(201,165,90,0.4)",
                      }}>
                        {p.modules.reduce((s, m) => s + m.divisions.length, 0)} div
                      </span>
                    )}
                    {!p.is_public && <EyeOff size={11} color="rgba(255,255,255,0.25)" />}
                  </div>
                  {p.subtitle && (
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.subtitle}
                    </p>
                  )}
                </div>
                {p.live_url && <ExternalLink size={13} color="rgba(201,165,90,0.5)" />}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {creating && (
          <ProjectForm
            project={null}
            onSave={saveProject}
            onClose={() => setCreating(false)}
          />
        )}
        {editing && (
          <ProjectForm
            project={editing}
            onSave={saveProject}
            onDelete={() => deleteProject(editing.id)}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const VisionEditor = () => (
  <AdminGuard>
    <EditorPage />
  </AdminGuard>
);

export default VisionEditor;
