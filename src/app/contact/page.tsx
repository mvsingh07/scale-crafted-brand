"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail, Phone, ArrowRight, Twitter } from "lucide-react";
import { HubPageLayout } from "@/components/hub/HubPageLayout";
import { useIdentity } from "@/context/identity";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const GOLD = "var(--gold-primary)";
const GOLD_LIGHT = "var(--gold-highlight)";
const SILVER = "var(--silver)";
const WHITE = "var(--text-primary)";
const BORDER_GOLD = "var(--gold-border)";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-subtle)",
  border: `1px solid color-mix(in srgb, var(--gold-border) 25%, transparent)`,
  borderRadius: 8,
  padding: "10px 14px",
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 14,
  color: WHITE,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
  color: SILVER, opacity: 0.6, display: "block", marginBottom: 8,
};

function urlDisplay(url: string) {
  return url.replace(/^https?:\/\//, "");
}

export default function ContactPage() {
  const { identity } = useIdentity();
  const [sending, setSending] = useState(false);

  const email    = identity?.email    || null;
  const phone    = identity?.phone    || null;
  const linkedin = identity?.linkedin_url || null;
  const github   = identity?.github_url   || null;
  const twitter  = identity?.twitter_url  || null;

  type Link = { icon: React.ElementType; label: string; href: string };
  const links: Link[] = [
    ...(phone    ? [{ icon: Phone,    label: phone,               href: `tel:${phone.replace(/\s/g, "")}` }] : []),
    ...(email    ? [{ icon: Mail,     label: email,               href: `mailto:${email}` }] : []),
    ...(linkedin ? [{ icon: Linkedin, label: urlDisplay(linkedin), href: linkedin }] : []),
    ...(github   ? [{ icon: Github,   label: urlDisplay(github),   href: github }] : []),
    ...(twitter  ? [{ icon: Twitter,  label: urlDisplay(twitter),  href: twitter }] : []),
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const { error } = await supabase.from("contact_submissions").insert({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      project_role: (fd.get("project_role") as string) || null,
      message: fd.get("message") as string,
      source: "brand",
    });

    setSending(false);
    if (error) {
      toast.error("Failed to send", { description: email ? `Email me directly at ${email}` : "Something went wrong." });
    } else {
      toast.success("Message sent!", { description: "I'll get back to you within 24h." });
      form.reset();
    }
  };

  return (
    <HubPageLayout>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ marginBottom: 64 }}
        >
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
            color: GOLD, marginBottom: 16,
          }}>
            05 — Let&apos;s Build
          </p>
          <h1 style={{
            fontFamily: "var(--font-cinzel), Cinzel, serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 600, lineHeight: 1.15, color: WHITE, margin: 0,
          }}>
            Let&apos;s build something<br />that lasts.
          </h1>
          <p style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: SILVER, marginTop: 16, maxWidth: 540, lineHeight: 1.7,
          }}>
            Whether it&apos;s a system that needs to handle 10× growth, a real-time product on a tight timeline, or AI taken from prototype to production — let&apos;s talk.
          </p>
          <div style={{ marginTop: 24, width: 48, height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
        </motion.div>

        <div style={{ display: "grid", gap: 48 }} className="lg:grid-cols-2">

          {/* Contact links — from identity profile */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {links.length === 0 ? (
              <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13, color: "var(--text-muted)" }}>
                Contact details not configured yet. Add them in the Identity Editor.
              </p>
            ) : links.map((c) => (
              <motion.a
                key={c.href}
                href={c.href}
                target={c.href.startsWith("mailto") || c.href.startsWith("tel") ? "_self" : "_blank"}
                rel="noreferrer"
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px",
                  border: `1px solid color-mix(in srgb, var(--gold-border) 22%, transparent)`,
                  borderRadius: 12,
                  background: "color-mix(in srgb, var(--gold-primary) 3%, transparent)",
                  textDecoration: "none",
                  color: WHITE,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14 }}>
                  <c.icon size={16} style={{ color: GOLD, flexShrink: 0 }} />
                  <span style={{ color: SILVER }}>{c.label}</span>
                </span>
                <ArrowRight size={15} style={{ color: BORDER_GOLD }} />
              </motion.a>
            ))}
          </motion.div>

          {/* Contact form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Name</label>
                <input name="name" required placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" required type="email" placeholder="you@company.com" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Project / Role</label>
              <input name="project_role" placeholder="e.g. Real-time platform · Senior backend role" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about what you're building…"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px 24px",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                border: "none", borderRadius: 8,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 14, fontWeight: 600,
                color: "var(--bg-primary)",
                cursor: sending ? "not-allowed" : "pointer",
                opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? "Sending…" : "Send message"}
              {!sending && <ArrowRight size={16} />}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </HubPageLayout>
  );
}
