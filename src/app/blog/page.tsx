"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, FileText } from "lucide-react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";
import { supabase } from "@/lib/supabase";
import type { EcosystemBlog, BlogPlatform } from "@/lib/supabase";

const OWNER = process.env.NEXT_PUBLIC_OWNER_USERNAME ?? "mvsingh";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const WHITE = "var(--text-primary)";
const SILVER = "var(--silver)";

type FilterValue = BlogPlatform | "all";

const PLATFORM_CONFIG: Record<BlogPlatform, { label: string; color: string; bg: string }> = {
  medium:   { label: "Medium",   color: "rgba(255,255,255,0.75)", bg: "rgba(255,255,255,0.06)" },
  reddit:   { label: "Reddit",   color: "rgba(255,100,0,0.85)",   bg: "rgba(255,100,0,0.08)"  },
  linkedin: { label: "LinkedIn", color: "rgba(10,102,194,0.85)",  bg: "rgba(10,102,194,0.12)" },
  other:    { label: "Other",    color: "rgba(201,165,90,0.8)",   bg: "rgba(201,165,90,0.08)" },
};

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All",      value: "all"      },
  { label: "Medium",   value: "medium"   },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Reddit",   value: "reddit"   },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<EcosystemBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    supabase
      .from("ecosystem_blogs")
      .select("*")
      .eq("username", OWNER)
      .eq("is_public", true)
      .order("ord", { ascending: true })
      .then(({ data }) => {
        setBlogs((data as EcosystemBlog[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = blogs.filter(b => filter === "all" || b.platform === filter);

  return (
    <HubPageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 48 }}
        >
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: GOLD, marginBottom: 16,
          }}>
            04 — Writing
          </p>
          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0,
          }}>
            Thoughts on Life,<br />tech, and craft.
          </h1>
          <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: 6, marginBottom: 40, flexWrap: "wrap" }}
        >
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                background: filter === f.value ? `color-mix(in srgb, ${GOLD} 12%, transparent)` : "transparent",
                border: filter === f.value
                  ? `1px solid color-mix(in srgb, var(--gold-border) 45%, transparent)`
                  : "1px solid color-mix(in srgb, var(--gold-border) 15%, transparent)",
                borderRadius: 8, padding: "7px 16px",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12,
                color: filter === f.value ? GOLD : SILVER,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {f.label}
              {f.value !== "all" && (
                <span style={{ marginLeft: 6, opacity: 0.5, fontSize: 10 }}>
                  {blogs.filter(b => b.platform === f.value).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 64 }}>
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white/40" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center", padding: "80px 0",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13, color: "var(--text-muted)",
            }}
          >
            <FileText size={28} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
            {filter === "all" ? "Articles coming soon." : `No ${filter} articles yet.`}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              style={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {filtered.map(blog => (
                <BlogRow key={blog.id} blog={blog} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </HubPageLayout>
  );
}

function BlogRow({ blog: b }: { blog: EcosystemBlog }) {
  const platform = PLATFORM_CONFIG[b.platform];

  return (
    <motion.a
      href={b.url}
      target="_blank"
      rel="noreferrer"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
      }}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        display: "grid",
        gridTemplateColumns: b.image_url ? "88px 1fr auto" : "1fr auto",
        gap: 20,
        alignItems: "center",
        padding: "22px 24px",
        border: "1px solid color-mix(in srgb, var(--gold-border) 18%, transparent)",
        borderRadius: 14,
        background: "color-mix(in srgb, var(--gold-primary) 2%, transparent)",
        textDecoration: "none",
        marginBottom: 10,
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "color-mix(in srgb, var(--gold-border) 40%, transparent)";
        (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--gold-primary) 5%, transparent)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "color-mix(in srgb, var(--gold-border) 18%, transparent)";
        (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--gold-primary) 2%, transparent)";
      }}
    >
      {/* Cover image */}
      {b.image_url && (
        <div style={{
          width: 88, height: 64, borderRadius: 8, overflow: "hidden",
          background: "rgba(255,255,255,0.04)",
          flexShrink: 0,
        }}>
          <img src={b.image_url} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{
            background: platform.bg, borderRadius: 5,
            padding: "2px 8px", fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 9, letterSpacing: "0.1em", color: platform.color,
          }}>
            {platform.label}
          </span>
          {b.published_at && (
            <span style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 10, color: "var(--text-muted)",
            }}>
              {new Date(b.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>
        <h3 style={{
          fontFamily: "var(--font-cinzel), Cinzel, serif",
          fontSize: "clamp(14px, 1.8vw, 18px)",
          fontWeight: 600, color: WHITE, margin: "0 0 4px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {b.title}
        </h3>
        {b.subtitle && (
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 12, color: SILVER, margin: "0 0 4px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {b.subtitle}
          </p>
        )}
        {b.summary && (
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, color: "var(--text-muted)", margin: 0,
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {b.summary}
          </p>
        )}
      </div>

      {/* Arrow */}
      <ExternalLink size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
    </motion.a>
  );
}
