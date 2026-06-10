"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { IdentityProfile, NavLink, HubTextState, AboutParagraph, AboutStat } from "@/lib/supabase";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Globe,
  User,
  Link2,
  Layout,
  FileText,
  BookOpen,
  Phone,
} from "lucide-react";

// ── Defaults ──────────────────────────────────────────────────────────────────
const EMPTY: IdentityProfile = {
  id: "",
  username: "mvsingh",
  display_name: "MV Singh",
  tagline: "Igniting Innovation through continuous learning",
  email: null,
  phone: null,
  logo_dark_url: null,
  logo_light_url: null,
  favicon_url: null,
  site_url: "https://mvsingh.in",
  meta_title: "MV Singh — Digital Architect & AI Strategist",
  meta_description: "",
  linkedin_url: null,
  github_url: null,
  twitter_url: null,
  instagram_url: null,
  nav_links: [
    { label: "About",     href: "/about",     order: 1 },
    { label: "Portfolio", href: "/portfolio", order: 2 },
    { label: "Services",  href: "/services",  order: 3 },
    { label: "Blog",      href: "/blog",      order: 4 },
    { label: "Contact",   href: "/contact",   order: 5 },
  ],
  hub_text_states: [
    { title: "MV Singh",          subtitle: "Igniting Innovation through continuous learning" },
    { title: "Digital Architect", subtitle: "Crafting immersive digital experiences that blend creativity and technology." },
    { title: "AI Strategist",     subtitle: "Empowering businesses to harness the transformative potential of AI for growth and innovation." },
  ],
  footer_text: "mvsingh.in · © 2026 · All rights reserved",
  about_eyebrow: "01 — The Engineer",
  about_headline: "The engineer behind\nthe systems.",
  about_paragraphs: [
    { text: "I'm a Senior Software Engineer with 3+ years of experience who treats software like a product, not a task list.", italic: false },
    { text: "The vision needs an architect.", italic: true },
  ],
  about_stats: [
    { value: "3+",   label: "Years Experience" },
    { value: "50K+", label: "Concurrent Users Handled" },
    { value: "10+",  label: "Products Shipped" },
    { value: "AI",   label: "Native Builder" },
  ],
  created_at: "",
  updated_at: "",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const base = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#F8FAFC",
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 13,
    outline: "none",
    resize: "vertical" as const,
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 10,
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "rgba(255,255,255,0.3)",
        marginBottom: 5,
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={base}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  );
}

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, marginTop: 24 }}>
      <Icon size={11} color="#C9A55A" />
      <span style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: "rgba(255,255,255,0.3)",
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Preview panel ─────────────────────────────────────────────────────────────
function Preview({ data }: { data: IdentityProfile }) {
  const [state, setState] = useState(0);

  useEffect(() => {
    if (!data.hub_text_states.length) return;
    const id = setInterval(() => setState(s => (s + 1) % data.hub_text_states.length), 3000);
    return () => clearInterval(id);
  }, [data.hub_text_states.length]);

  const current = data.hub_text_states[state] ?? { title: "", subtitle: "" };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#0A0A0A",
      color: "#F8FAFC",
      fontFamily: "var(--font-inter), Inter, sans-serif",
    }}>
      {/* Mock nav */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid rgba(201,165,90,0.2)",
        background: "rgba(10,10,10,0.9)",
      }}>
        <span style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: 13,
          color: "#C9A55A",
          letterSpacing: "0.08em",
        }}>
          {data.display_name || "—"}
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {data.nav_links.sort((a, b) => a.order - b.order).map(n => (
            <span key={n.order} style={{ fontSize: 10, color: "#C7CDD6", letterSpacing: "0.1em" }}>
              {n.label}
            </span>
          ))}
        </div>
      </div>

      {/* Mock hero */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        textAlign: "center",
        background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,165,90,0.06) 0%, transparent 70%)",
      }}>
        <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "#C9A55A", marginBottom: 12, textTransform: "uppercase" }}>
          {data.tagline ? data.tagline.slice(0, 40) + (data.tagline.length > 40 ? "…" : "") : "—"}
        </p>
        <h1 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600,
          color: "#F8FAFC",
          margin: "0 0 12px",
          lineHeight: 1.2,
          background: "linear-gradient(135deg, #C9A55A 0%, #E0C27A 60%, #C7CDD6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          {current.title || "—"}
        </h1>
        <p style={{ fontSize: 12, color: "#C7CDD6", lineHeight: 1.6, maxWidth: 380 }}>
          {current.subtitle || "—"}
        </p>
        <div style={{
          display: "flex",
          gap: 24,
          marginTop: 20,
          fontSize: 10,
          color: "rgba(201,165,90,0.6)",
          letterSpacing: "0.15em",
        }}>
          {state < data.hub_text_states.length &&
            data.hub_text_states.map((_, i) => (
              <span
                key={i}
                onClick={() => setState(i)}
                style={{
                  cursor: "pointer",
                  color: i === state ? "#C9A55A" : "rgba(199,205,214,0.3)",
                  transition: "color 0.2s",
                }}
              >
                ●
              </span>
            ))
          }
        </div>
      </div>

      {/* Mock footer */}
      <div style={{
        padding: "8px 20px",
        borderTop: "1px solid rgba(156,122,53,0.15)",
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: "rgba(255,255,255,0.3)",
      }}>
        <span>{data.site_url || "—"}</span>
        <span>{data.footer_text || "—"}</span>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function IdentityEditor() {
  const router = useRouter();
  const [data, setData] = useState<IdentityProfile>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("identity_profile")
      .select("*")
      .eq("username", "mvsingh")
      .single()
      .then(({ data: row }) => {
        if (row) setData(row as IdentityProfile);
        setLoaded(true);
      });
  }, []);

  const set = <K extends keyof IdentityProfile>(key: K, val: IdentityProfile[K]) =>
    setData(d => ({ ...d, [key]: val }));

  const setStr = (key: keyof IdentityProfile) => (v: string) =>
    set(key, (v || null) as IdentityProfile[typeof key]);

  const save = async () => {
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = data;
    const { error } = await supabase
      .from("identity_profile")
      .upsert({ ...payload, username: "mvsingh", updated_at: new Date().toISOString() }, { onConflict: "username" });

    if (error) {
      toast.error("Save failed", { description: error.message });
    } else {
      toast.success("Identity saved");
    }
    setSaving(false);
  };

  // Nav links helpers
  const updateNav = (i: number, field: keyof NavLink, val: string | number) =>
    set("nav_links", data.nav_links.map((n, idx) =>
      idx === i ? { ...n, [field]: field === "order" ? Number(val) : val } : n
    ));

  const addNav = () =>
    set("nav_links", [...data.nav_links, { label: "", href: "/", order: data.nav_links.length + 1 }]);

  const removeNav = (i: number) =>
    set("nav_links", data.nav_links.filter((_, idx) => idx !== i));

  // Hub text state helpers
  const updateState = (i: number, field: keyof HubTextState, val: string) =>
    set("hub_text_states", data.hub_text_states.map((s, idx) =>
      idx === i ? { ...s, [field]: val } : s
    ));

  const addState = () =>
    set("hub_text_states", [...data.hub_text_states, { title: "", subtitle: "" }]);

  const removeState = (i: number) =>
    set("hub_text_states", data.hub_text_states.filter((_, idx) => idx !== i));

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "7px 10px",
    color: "#F8FAFC",
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 12,
    outline: "none",
  };

  if (!loaded) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#0A0A0A" }}>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0A0A0A", color: "#F8FAFC" }}>

      {/* ── LEFT: Form ── */}
      <div style={{ width: "50%", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => router.push("/forge/tech")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}
            >
              <ArrowLeft size={16} />
            </button>
            <span style={{ fontFamily: "var(--font-cinzel), Cinzel, serif", fontSize: 13, letterSpacing: "0.08em", color: "#C9A55A" }}>
              Identity Editor
            </span>
          </div>
          <button
            onClick={save}
            disabled={saving}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: saving ? "rgba(201,165,90,0.15)" : "rgba(201,165,90,0.18)",
              border: "1px solid rgba(201,165,90,0.3)",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#C9A55A",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 12,
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            <Save size={12} />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Scrollable form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

          <SectionLabel icon={User} label="Identity" />
          <Field label="Display Name" value={data.display_name} onChange={v => set("display_name", v)} placeholder="MV Singh" />
          <Field label="Tagline" value={data.tagline} onChange={v => set("tagline", v)} placeholder="Igniting Innovation…" />

          <SectionLabel icon={Globe} label="Site Metadata" />
          <Field label="Site URL" value={data.site_url} onChange={v => set("site_url", v)} placeholder="https://mvsingh.in" />
          <Field label="Meta Title" value={data.meta_title} onChange={v => set("meta_title", v)} />
          <Field label="Meta Description" value={data.meta_description ?? ""} onChange={setStr("meta_description")} multiline />

          <SectionLabel icon={Layout} label="Logos" />
          <Field label="Logo — Dark Mode URL" value={data.logo_dark_url ?? ""} onChange={setStr("logo_dark_url")} placeholder="/dark_mode_logo.png" />
          <Field label="Logo — Light Mode URL" value={data.logo_light_url ?? ""} onChange={setStr("logo_light_url")} placeholder="/light_mode_logo.png" />
          <Field label="Favicon URL" value={data.favicon_url ?? ""} onChange={setStr("favicon_url")} placeholder="/light_mode_logo.png" />

          <SectionLabel icon={Phone} label="Contact Info (Identity)" />
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 10, lineHeight: 1.5 }}>
            Used in the brand ecosystem — /contact page, footer, hub. Not shared with the portfolio.
          </p>
          <Field label="Identity Email" value={data.email ?? ""} onChange={setStr("email")} placeholder="hello@mvsingh.in" />
          <Field label="Phone" value={data.phone ?? ""} onChange={setStr("phone")} placeholder="+91 62838 49317" />

          <SectionLabel icon={Link2} label="Social Links" />
          <Field label="LinkedIn" value={data.linkedin_url ?? ""} onChange={setStr("linkedin_url")} placeholder="https://linkedin.com/in/…" />
          <Field label="GitHub" value={data.github_url ?? ""} onChange={setStr("github_url")} placeholder="https://github.com/…" />
          <Field label="Twitter / X" value={data.twitter_url ?? ""} onChange={setStr("twitter_url")} placeholder="https://x.com/…" />
          <Field label="Instagram" value={data.instagram_url ?? ""} onChange={setStr("instagram_url")} placeholder="https://instagram.com/…" />

          <SectionLabel icon={Layout} label="Navigation Links" />
          <div style={{ marginBottom: 14 }}>
            {data.nav_links.sort((a, b) => a.order - b.order).map((nav, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <GripVertical size={12} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
                <input
                  value={nav.label}
                  onChange={e => updateNav(i, "label", e.target.value)}
                  placeholder="Label"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  value={nav.href}
                  onChange={e => updateNav(i, "href", e.target.value)}
                  placeholder="/page"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="number"
                  value={nav.order}
                  onChange={e => updateNav(i, "order", e.target.value)}
                  style={{ ...inputStyle, width: 44 }}
                  min={1}
                />
                <button
                  onClick={() => removeNav(i)}
                  style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", padding: 2 }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={addNav}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "6px 12px",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer", fontSize: 11,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                width: "100%", justifyContent: "center", marginTop: 4,
              }}
            >
              <Plus size={11} /> Add Link
            </button>
          </div>

          <SectionLabel icon={FileText} label="Hub Text States (Hero Slider)" />
          <div style={{ marginBottom: 14 }}>
            {data.hub_text_states.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: "#C9A55A", letterSpacing: "0.12em", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                    State {i + 1}
                  </span>
                  {data.hub_text_states.length > 1 && (
                    <button
                      onClick={() => removeState(i)}
                      style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", padding: 2 }}
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
                <input
                  value={s.title}
                  onChange={e => updateState(i, "title", e.target.value)}
                  placeholder="Title"
                  style={{ ...inputStyle, width: "100%", marginBottom: 6, boxSizing: "border-box" }}
                />
                <input
                  value={s.subtitle}
                  onChange={e => updateState(i, "subtitle", e.target.value)}
                  placeholder="Subtitle"
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                />
              </div>
            ))}
            <button
              onClick={addState}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "6px 12px",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer", fontSize: 11,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                width: "100%", justifyContent: "center",
              }}
            >
              <Plus size={11} /> Add State
            </button>
          </div>

          <SectionLabel icon={BookOpen} label="About Page" />

          <Field label="Eyebrow" value={data.about_eyebrow ?? ""} onChange={v => set("about_eyebrow", v || null)} placeholder="01 — The Engineer" />
          <Field label="Headline (use \\n for line break)" value={data.about_headline ?? ""} onChange={v => set("about_headline", v || null)} placeholder="The engineer behind\nthe systems." multiline />

          {/* Paragraphs */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: "block", fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.3)", marginBottom: 8,
            }}>Paragraphs</label>
            {(data.about_paragraphs ?? []).map((p, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "10px 12px", marginBottom: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <button
                    onClick={() => {
                      const updated = (data.about_paragraphs ?? []).map((x, idx) =>
                        idx === i ? { ...x, italic: !x.italic } : x
                      );
                      set("about_paragraphs", updated);
                    }}
                    style={{
                      background: p.italic ? "rgba(201,165,90,0.1)" : "rgba(255,255,255,0.04)",
                      border: p.italic ? "1px solid rgba(201,165,90,0.25)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 6, padding: "2px 8px",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontSize: 9, letterSpacing: "0.1em",
                      color: p.italic ? "#C9A55A" : "rgba(255,255,255,0.3)",
                      cursor: "pointer", fontStyle: "italic",
                    }}
                  >
                    italic
                  </button>
                  <button
                    onClick={() => set("about_paragraphs", (data.about_paragraphs ?? []).filter((_, idx) => idx !== i))}
                    style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", padding: 2 }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
                <textarea
                  value={p.text}
                  onChange={e => {
                    const updated = (data.about_paragraphs ?? []).map((x, idx) =>
                      idx === i ? { ...x, text: e.target.value } : x
                    );
                    set("about_paragraphs", updated);
                  }}
                  rows={3}
                  placeholder="Paragraph text…"
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                    padding: "7px 9px", color: "#F8FAFC",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 12, outline: "none", resize: "vertical" as const,
                    boxSizing: "border-box" as const,
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => set("about_paragraphs", [...(data.about_paragraphs ?? []), { text: "", italic: false }])}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "6px 12px",
                color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                width: "100%", justifyContent: "center",
              }}
            >
              <Plus size={11} /> Add Paragraph
            </button>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: 14 }}>
            <label style={{
              display: "block", fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.3)", marginBottom: 8,
            }}>Stats</label>
            {(data.about_stats ?? []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                <input
                  value={s.value}
                  onChange={e => {
                    const updated = (data.about_stats ?? []).map((x, idx) =>
                      idx === i ? { ...x, value: e.target.value } : x
                    );
                    set("about_stats", updated);
                  }}
                  placeholder="3+"
                  style={{ ...inputStyle, width: 64 }}
                />
                <input
                  value={s.label}
                  onChange={e => {
                    const updated = (data.about_stats ?? []).map((x, idx) =>
                      idx === i ? { ...x, label: e.target.value } : x
                    );
                    set("about_stats", updated);
                  }}
                  placeholder="Years Experience"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={() => set("about_stats", (data.about_stats ?? []).filter((_, idx) => idx !== i))}
                  style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", padding: 2 }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={() => set("about_stats", [...(data.about_stats ?? []), { value: "", label: "" }])}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "6px 12px",
                color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                width: "100%", justifyContent: "center", marginTop: 4,
              }}
            >
              <Plus size={11} /> Add Stat
            </button>
          </div>

          <SectionLabel icon={FileText} label="Footer" />
          <Field label="Footer Text" value={data.footer_text} onChange={v => set("footer_text", v)} />

        </div>
      </div>

      {/* ── RIGHT: Live preview ── */}
      <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          }}>
            Live Preview
          </span>
          <span style={{
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.2)",
            borderRadius: 100,
            padding: "2px 8px",
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(52,211,153,0.6)",
          }}>
            Live
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Preview data={data} />
        </div>
      </div>
    </div>
  );
}
