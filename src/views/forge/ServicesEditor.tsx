"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { EcosystemService } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  ArrowLeft, Plus, Trash2, Save, ExternalLink, Eye, EyeOff, GripVertical,
  LogOut, LayoutGrid, X,
  Globe, Search, Bot, LayoutDashboard, CreditCard, Smartphone, Sparkles,
} from "lucide-react";

const OWNER = "mvsingh";
const GOLD = "#C9A55A";
const EASE = [0.16, 1, 0.3, 1] as const;

const ICON_OPTIONS: Record<string, React.ElementType> = {
  Globe, Search, Bot, LayoutDashboard, CreditCard, Smartphone, Sparkles,
};

const ACCENT_OPTIONS = ["#C9A55A", "#34D399", "#A78BFA", "#60A5FA", "#F59E0B", "#F472B6"];

const EMPTY_SERVICE: Omit<EcosystemService, "id" | "created_at"> = {
  username: OWNER,
  title: "",
  summary: "",
  items: [],
  impact: "",
  icon_name: "Sparkles",
  accent: "#C9A55A",
  is_public: true,
  ord: 0,
};

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
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </div>
  );
}

function TagInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
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
            borderRadius: 6, padding: "3px 8px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: GOLD,
          }}>
            {t}
            <button onClick={() => remove(t)} style={{ background: "none", border: "none", color: "rgba(201,165,90,0.5)", cursor: "pointer", padding: 0, lineHeight: 1 }}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(input); } }}
          placeholder="Type and press Enter"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={() => add(input)} style={{
          background: "rgba(201,165,90,0.1)", border: "1px solid rgba(201,165,90,0.2)",
          borderRadius: 8, padding: "8px 14px", color: GOLD, cursor: "pointer", fontSize: 12, fontFamily: "monospace",
        }}>
          Add
        </button>
      </div>
    </div>
  );
}

function ServiceForm({ service, onSave, onDelete, onClose }: {
  service: EcosystemService | Omit<EcosystemService, "id" | "created_at">;
  onSave: (s: EcosystemService | Omit<EcosystemService, "id" | "created_at">) => Promise<void>;
  onDelete?: () => Promise<void>;
  onClose: () => void;
}) {
  const [data, setData] = useState(service);
  const [saving, setSaving] = useState(false);
  const isNew = !("id" in data);

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) => setData(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    if (!data.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ background: "#0E0F12", border: "1px solid rgba(201,165,90,0.2)", borderRadius: 16, width: "100%", maxWidth: 580, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
            {isNew ? "New Service" : "Edit Service"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
          <Field label="Title *" value={data.title} onChange={v => set("title", v)} placeholder="e.g. Digital Presence" />
          <Field label="Summary" value={data.summary} onChange={v => set("summary", v)} placeholder="One-line description of this service area" multiline />
          <TagInput label="Services / Items" tags={data.items} onChange={v => set("items", v)} />
          <Field label="Business Impact" value={data.impact} onChange={v => set("impact", v)} placeholder="What this achieves for the business" multiline />

          {/* Icon picker */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Icon</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(ICON_OPTIONS).map(([name, Icon]) => (
                <button key={name} onClick={() => set("icon_name", name)} title={name} style={{
                  display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 10, cursor: "pointer",
                  background: data.icon_name === name ? "rgba(201,165,90,0.14)" : "rgba(255,255,255,0.03)",
                  border: data.icon_name === name ? "1px solid rgba(201,165,90,0.4)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                  <Icon size={17} style={{ color: data.icon_name === name ? GOLD : "rgba(255,255,255,0.5)" }} />
                </button>
              ))}
            </div>
          </div>

          {/* Accent picker */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Accent</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ACCENT_OPTIONS.map(c => (
                <button key={c} onClick={() => set("accent", c)} style={{
                  width: 30, height: 30, borderRadius: 8, cursor: "pointer", background: c,
                  border: data.accent === c ? "2px solid #fff" : "2px solid transparent",
                  boxShadow: data.accent === c ? `0 0 0 2px ${c}` : "none",
                }} />
              ))}
            </div>
          </div>

          {/* Order + visibility */}
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Order</label>
              <input type="number" value={data.ord} onChange={e => set("ord", Number(e.target.value))} style={inputStyle} min={0} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <button onClick={() => set("is_public", !data.is_public)} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: data.is_public ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                border: data.is_public ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11,
                color: data.is_public ? "rgba(52,211,153,0.8)" : "rgba(255,255,255,0.35)", cursor: "pointer", marginTop: 21,
              }}>
                {data.is_public ? <Eye size={12} /> : <EyeOff size={12} />}
                {data.is_public ? "Public" : "Hidden"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          {onDelete ? (
            <button onClick={onDelete} style={{
              display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8, padding: "8px 14px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 11, color: "rgba(239,68,68,0.7)", cursor: "pointer",
            }}>
              <Trash2 size={12} /> Delete
            </button>
          ) : <div />}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 16px",
              fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", cursor: "pointer",
            }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} style={{
              display: "flex", alignItems: "center", gap: 6, background: "rgba(201,165,90,0.18)", border: "1px solid rgba(201,165,90,0.3)",
              borderRadius: 8, padding: "8px 18px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, color: GOLD, cursor: saving ? "not-allowed" : "pointer",
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

const EditorPage = () => {
  const router = useRouter();
  const [services, setServices] = useState<EcosystemService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EcosystemService | null>(null);
  const [creating, setCreating] = useState(false);

  const fetch = async () => {
    const { data } = await supabase
      .from("ecosystem_services")
      .select("*")
      .eq("username", OWNER)
      .order("ord", { ascending: true });
    setServices((data as EcosystemService[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  const saveNew = async (s: Omit<EcosystemService, "id" | "created_at">) => {
    const { error } = await supabase.from("ecosystem_services").insert({ ...s, username: OWNER });
    if (error) { toast.error("Failed to create", { description: error.message }); return; }
    toast.success("Service created");
    setCreating(false);
    fetch();
  };

  const saveEdit = async (s: EcosystemService) => {
    const { id, created_at, ...payload } = s;
    const { error } = await supabase.from("ecosystem_services").update(payload).eq("id", id);
    if (error) { toast.error("Failed to save", { description: error.message }); return; }
    toast.success("Service saved");
    setEditing(null);
    fetch();
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await supabase.from("ecosystem_services").delete().eq("id", id);
    toast.success("Deleted");
    setEditing(null);
    fetch();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0B0E", color: "#F8FAFC" }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px",
        borderBottom: "1px solid rgba(201,165,90,0.12)", position: "sticky", top: 0, zIndex: 10,
        background: "rgba(10,11,14,0.95)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push("/forge/tech")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>
            <ArrowLeft size={13} /> Dashboard
          </button>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LayoutGrid size={14} color={GOLD} />
            <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, color: GOLD, letterSpacing: "0.06em" }}>
              Services Editor
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setCreating(true)} style={{
            display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #C9A55A, #E0C27A)", border: "none",
            borderRadius: 8, padding: "8px 16px", fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 12, fontWeight: 600, color: "#0A0B0E", cursor: "pointer",
          }}>
            <Plus size={13} /> New Service
          </button>
          <button onClick={() => window.open("/services", "_blank")} style={{
            display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "8px 14px", fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "monospace",
          }}>
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
        ) : services.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", paddingTop: 80 }}>
            <LayoutGrid size={32} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 14px" }} />
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
              No services yet.{" "}
              <button onClick={() => setCreating(true)} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", textDecoration: "underline", fontSize: 14 }}>
                Add your first one.
              </button>
            </p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {services.map((s, i) => {
              const Icon = ICON_OPTIONS[s.icon_name] ?? Sparkles;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 18px", cursor: "pointer" }}
                  onClick={() => setEditing(s)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(201,165,90,0.2)" }}
                >
                  <GripVertical size={14} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
                  <div style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 9, background: `color-mix(in srgb, ${s.accent} 14%, transparent)`, flexShrink: 0 }}>
                    <Icon size={16} style={{ color: s.accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                      {!s.is_public && <EyeOff size={11} color="rgba(255,255,255,0.25)" />}
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.items.length} item{s.items.length === 1 ? "" : "s"}{s.summary ? ` · ${s.summary}` : ""}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {creating && (
          <ServiceForm
            service={{ ...EMPTY_SERVICE, ord: services.length }}
            onSave={saveNew as (s: EcosystemService | Omit<EcosystemService, "id" | "created_at">) => Promise<void>}
            onClose={() => setCreating(false)}
          />
        )}
        {editing && (
          <ServiceForm
            service={editing}
            onSave={saveEdit as (s: EcosystemService | Omit<EcosystemService, "id" | "created_at">) => Promise<void>}
            onDelete={() => deleteService(editing.id)}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ServicesEditor = () => (
  <AdminGuard>
    <EditorPage />
  </AdminGuard>
);

export default ServicesEditor;
