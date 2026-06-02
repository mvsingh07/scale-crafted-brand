"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { EcosystemTheme } from "@/lib/supabase";
import { ArrowLeft, Save, Sun, Moon } from "lucide-react";

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULTS: Omit<EcosystemTheme, "id" | "username" | "created_at" | "updated_at"> = {
  bg_primary: "#0A0A0A",
  bg_secondary: "#111827",
  gold_primary: "#C9A55A",
  gold_highlight: "#E0C27A",
  gold_border: "#9C7A35",
  silver: "#C7CDD6",
  text_primary: "#F8FAFC",
  text_muted: "#D1D5DB",
  font_heading: "Cinzel",
  font_body: "Inter",
  border_radius: "24px",
  default_mode: "dark",
};

type ThemeField = keyof typeof DEFAULTS;

// ── Color groups ──────────────────────────────────────────────────────────────
const COLOR_GROUPS: { label: string; fields: { key: ThemeField; label: string }[] }[] = [
  {
    label: "Background",
    fields: [
      { key: "bg_primary",   label: "Primary" },
      { key: "bg_secondary", label: "Secondary" },
    ],
  },
  {
    label: "Accent — Gold",
    fields: [
      { key: "gold_primary",   label: "Primary" },
      { key: "gold_highlight", label: "Highlight" },
      { key: "gold_border",    label: "Border" },
    ],
  },
  {
    label: "Silver",
    fields: [
      { key: "silver", label: "Silver" },
    ],
  },
  {
    label: "Typography Colors",
    fields: [
      { key: "text_primary", label: "Primary" },
      { key: "text_muted",   label: "Muted" },
    ],
  },
];

// ── CSS var injection ─────────────────────────────────────────────────────────
function applyPreviewVars(theme: typeof DEFAULTS) {
  const root = document.documentElement;
  root.style.setProperty("--bg-primary",      theme.bg_primary);
  root.style.setProperty("--bg-secondary",    theme.bg_secondary);
  root.style.setProperty("--gold-primary",    theme.gold_primary);
  root.style.setProperty("--gold-highlight",  theme.gold_highlight);
  root.style.setProperty("--gold-border",     theme.gold_border);
  root.style.setProperty("--silver",          theme.silver);
  root.style.setProperty("--text-primary",    theme.text_primary);
  root.style.setProperty("--text-muted",      theme.text_muted);
  root.style.setProperty("--font-heading",    `'${theme.font_heading}', serif`);
  root.style.setProperty("--font-body",       `'${theme.font_body}', sans-serif`);
  root.style.setProperty("--border-radius-site", theme.border_radius);
}

// ── Live Preview ──────────────────────────────────────────────────────────────
function ThemePreview({ theme }: { theme: typeof DEFAULTS }) {
  return (
    <div style={{
      height: "100%",
      background: theme.bg_primary,
      color: theme.text_primary,
      display: "flex",
      flexDirection: "column",
      fontFamily: `'${theme.font_body}', sans-serif`,
      overflow: "hidden",
    }}>
      {/* Mock nav */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: `1px solid ${theme.gold_border}44`,
        background: theme.bg_primary + "ee",
      }}>
        <span style={{
          fontFamily: `'${theme.font_heading}', Cinzel, serif`,
          fontSize: 13,
          color: theme.gold_primary,
          letterSpacing: "0.08em",
        }}>
          MV Singh
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {["About", "Portfolio", "Contact"].map(label => (
            <span key={label} style={{ fontSize: 10, color: theme.silver, letterSpacing: "0.1em" }}>
              {label}
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
        background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${theme.gold_primary}0A 0%, transparent 70%)`,
      }}>
        <p style={{
          fontSize: 10, letterSpacing: "0.2em", color: theme.gold_primary,
          marginBottom: 12, textTransform: "uppercase",
        }}>
          Digital Architect · AI Strategist
        </p>

        <h1 style={{
          fontFamily: `'${theme.font_heading}', Cinzel, serif`,
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 600,
          lineHeight: 1.2,
          margin: "0 0 14px",
          background: `linear-gradient(135deg, ${theme.gold_primary} 0%, ${theme.gold_highlight} 60%, ${theme.silver} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          MV Singh
        </h1>

        <p style={{ fontSize: 12, color: theme.silver, lineHeight: 1.7, maxWidth: 360, marginBottom: 24 }}>
          Igniting Innovation through continuous learning
        </p>

        <div style={{
          display: "inline-flex",
          gap: 12,
          padding: "8px 20px",
          border: `1px solid ${theme.gold_border}55`,
          borderRadius: theme.border_radius,
          background: `${theme.gold_primary}08`,
        }}>
          <span style={{ fontSize: 11, color: theme.gold_primary, letterSpacing: "0.1em" }}>
            Get in Touch
          </span>
        </div>
      </div>

      {/* Swatch strip */}
      <div style={{
        display: "flex",
        padding: "12px 20px",
        gap: 8,
        borderTop: `1px solid ${theme.gold_border}22`,
        background: theme.bg_secondary,
        flexWrap: "wrap" as const,
      }}>
        {[theme.bg_primary, theme.bg_secondary, theme.gold_primary, theme.gold_highlight, theme.gold_border, theme.silver, theme.text_primary, theme.text_muted].map((c, i) => (
          <div
            key={i}
            title={c}
            style={{
              width: 20, height: 20,
              borderRadius: 4,
              background: c,
              border: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────
export default function ThemeEditor() {
  const router = useRouter();
  const [theme, setTheme] = useState<typeof DEFAULTS>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const originalRef = useRef<typeof DEFAULTS>(DEFAULTS);

  useEffect(() => {
    supabase
      .from("ecosystem_theme")
      .select("*")
      .eq("username", "mvsingh")
      .single()
      .then(({ data }) => {
        if (data) {
          const vals: typeof DEFAULTS = {
            bg_primary:      data.bg_primary,
            bg_secondary:    data.bg_secondary,
            gold_primary:    data.gold_primary,
            gold_highlight:  data.gold_highlight,
            gold_border:     data.gold_border,
            silver:          data.silver,
            text_primary:    data.text_primary,
            text_muted:      data.text_muted,
            font_heading:    data.font_heading,
            font_body:       data.font_body,
            border_radius:   data.border_radius,
            default_mode:    data.default_mode as "dark" | "light",
          };
          setTheme(vals);
          originalRef.current = vals;
        }
        setLoaded(true);
      });
  }, []);

  // Live inject CSS vars on every theme change
  useEffect(() => {
    if (loaded) applyPreviewVars(theme);
  }, [theme, loaded]);

  // Restore original vars on unmount
  useEffect(() => {
    return () => applyPreviewVars(originalRef.current);
  }, []);

  const set = <K extends keyof typeof DEFAULTS>(key: K, val: (typeof DEFAULTS)[K]) =>
    setTheme(t => ({ ...t, [key]: val }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("ecosystem_theme")
      .upsert({ ...theme, username: "mvsingh", updated_at: new Date().toISOString() }, { onConflict: "username" });

    if (error) {
      toast.error("Save failed", { description: error.message });
    } else {
      originalRef.current = theme;
      toast.success("Theme saved — changes will reflect on next page load");
    }
    setSaving(false);
  };

  const labelStyle = {
    display: "block" as const,
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.3)",
    marginBottom: 6,
  };

  const inputBase = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#F8FAFC",
    fontFamily: "var(--font-inter), Inter, sans-serif",
    fontSize: 12,
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
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

      {/* ── LEFT: Controls ── */}
      <div style={{ width: "46%", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
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
              Theme Editor
            </span>
          </div>
          <button
            onClick={save}
            disabled={saving}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(201,165,90,0.18)",
              border: "1px solid rgba(201,165,90,0.3)",
              borderRadius: 8, padding: "6px 14px",
              color: "#C9A55A", cursor: saving ? "not-allowed" : "pointer",
              fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            <Save size={12} />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Scrollable controls */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>

          {/* Default mode */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Default Mode</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["dark", "light"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => set("default_mode", m)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 16px",
                    borderRadius: 8,
                    border: `1px solid ${theme.default_mode === m ? "rgba(201,165,90,0.4)" : "rgba(255,255,255,0.08)"}`,
                    background: theme.default_mode === m ? "rgba(201,165,90,0.1)" : "transparent",
                    color: theme.default_mode === m ? "#C9A55A" : "rgba(255,255,255,0.4)",
                    cursor: "pointer", fontSize: 12,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                  }}
                >
                  {m === "dark" ? <Moon size={12} /> : <Sun size={12} />}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Color groups */}
          {COLOR_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                color: "#C9A55A", marginBottom: 12,
              }}>
                {group.label}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(group.fields.length, 3)}, 1fr)`, gap: 10 }}>
                {group.fields.map(({ key, label }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="color"
                        value={theme[key] as string}
                        onChange={e => set(key, e.target.value as (typeof DEFAULTS)[typeof key])}
                        style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer", padding: 2 }}
                      />
                      <input
                        type="text"
                        value={theme[key] as string}
                        onChange={e => set(key, e.target.value as (typeof DEFAULTS)[typeof key])}
                        maxLength={7}
                        style={{ ...inputBase, flex: 1, fontFamily: "monospace", fontSize: 11 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Typography */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#C9A55A", marginBottom: 12,
            }}>
              Typography
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={labelStyle}>Heading Font</label>
                <input
                  type="text"
                  value={theme.font_heading}
                  onChange={e => set("font_heading", e.target.value)}
                  placeholder="Cinzel"
                  style={inputBase}
                />
              </div>
              <div>
                <label style={labelStyle}>Body Font</label>
                <input
                  type="text"
                  value={theme.font_body}
                  onChange={e => set("font_body", e.target.value)}
                  placeholder="Inter"
                  style={inputBase}
                />
              </div>
            </div>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              Use any Google Fonts name (e.g. "Playfair Display", "DM Sans")
            </p>
          </div>

          {/* Border radius */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#C9A55A", marginBottom: 12,
            }}>
              Shape
            </div>
            <div>
              <label style={labelStyle}>Border Radius</label>
              <input
                type="text"
                value={theme.border_radius}
                onChange={e => set("border_radius", e.target.value)}
                placeholder="24px"
                style={{ ...inputBase, width: 120 }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── RIGHT: Live preview ── */}
      <div style={{ width: "54%", display: "flex", flexDirection: "column" }}>
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
            Instant
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ThemePreview theme={theme} />
        </div>
      </div>
    </div>
  );
}
