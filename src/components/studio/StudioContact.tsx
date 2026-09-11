"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, Linkedin, Github, Twitter, Instagram, ArrowRight, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useIdentity } from "@/context/identity";
import { ChapterEyebrow, SectionHeading, GOLD, GOLD_L, WHITE, SILVER, MUTED, FONT_B, EASE } from "./shared";

const STUDIO_EMAIL = "hello@mvsingh.in";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-subtle)",
  border: "1px solid color-mix(in srgb, var(--gold-border) 25%, transparent)",
  borderRadius: 8, padding: "10px 14px", fontFamily: FONT_B, fontSize: 14,
  color: WHITE, outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  fontFamily: FONT_B, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
  color: SILVER, opacity: 0.6, display: "block", marginBottom: 8,
};

// Contact + "elsewhere" merged into one chapter — every way to reach the
// studio (form, email, phone, social) sits alongside the form itself,
// pulled from the same identity record the rest of the site already uses
// rather than duplicated hardcoded links.
export function StudioContact() {
  const [sending, setSending] = useState(false);
  const { identity } = useIdentity();

  const links = [
    identity?.phone
      ? { label: identity.phone, href: `tel:${identity.phone.replace(/\s/g, "")}`, icon: Phone }
      : null,
    { label: STUDIO_EMAIL, href: `mailto:${STUDIO_EMAIL}`, icon: Mail },
    identity?.linkedin_url ? { label: "LinkedIn", href: identity.linkedin_url, icon: Linkedin } : null,
    identity?.github_url ? { label: "GitHub", href: identity.github_url, icon: Github } : null,
    identity?.twitter_url ? { label: "Twitter / X", href: identity.twitter_url, icon: Twitter } : null,
    identity?.instagram_url ? { label: "Instagram", href: identity.instagram_url, icon: Instagram } : null,
  ].filter(Boolean) as { label: string; href: string; icon: React.ElementType }[];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const { error } = await supabase.from("contact_submissions").insert({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      project_role: (fd.get("business_type") as string) || null,
      message: fd.get("message") as string,
      source: "studio",
    });
    setSending(false);
    if (error) {
      toast.error("Failed to send", { description: `Email us directly at ${STUDIO_EMAIL}` });
    } else {
      toast.success("Message sent!", { description: "We'll get back to you within 24h." });
      form.reset();
    }
  };

  return (
    <div id="studio-contact" style={{ maxWidth: 1100, margin: "0 auto", padding: "72px clamp(18px, 4vw, 32px) 96px", scrollMarginTop: 76 }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }} transition={{ duration: 0.8, ease: EASE }}
        style={{ marginBottom: 48 }}
      >
        <ChapterEyebrow n="13">The Next Chapter</ChapterEyebrow>
        <SectionHeading>Every business has a story. Let&apos;s write yours.</SectionHeading>
        <p style={{ fontFamily: FONT_B, fontSize: "clamp(14px, 1.6vw, 17px)", color: SILVER, margin: "16px 0 0", maxWidth: 560, lineHeight: 1.7 }}>
          Whether it&apos;s a first website, a custom system, AI automation, or a stronger
          digital presence — tell us what you&apos;re working with, and we&apos;ll recommend
          the right starting point.
        </p>
      </motion.div>

      <div style={{ display: "grid", gap: 48 }} className="lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-60px" }} transition={{ duration: 0.7, ease: EASE }}
        >
          <p style={{
            fontFamily: FONT_B, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: SILVER, opacity: 0.6, margin: "0 0 16px",
          }}>
            Reach Us Directly
          </p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
          >
            {links.map((l) => (
              <motion.a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                whileHover={{ y: -3, borderColor: `color-mix(in srgb, ${GOLD} 45%, transparent)` }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "12px 18px", borderRadius: 100,
                  border: "1px solid color-mix(in srgb, var(--text-primary) 12%, transparent)",
                  background: "color-mix(in srgb, var(--text-primary) 3%, transparent)",
                  fontFamily: FONT_B, fontSize: 13.5, color: SILVER, textDecoration: "none",
                }}
              >
                <l.icon size={15} style={{ color: GOLD }} />
                {l.label}
                <ArrowUpRight size={13} style={{ color: MUTED }} />
              </motion.a>
            ))}
          </motion.div>

          <p style={{ fontFamily: FONT_B, fontSize: 13, color: MUTED, margin: "20px 0 0", lineHeight: 1.7, maxWidth: 380 }}>
            Reach out directly, or follow the work as it happens.
          </p>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div style={{ display: "grid", gap: 16 }} className="sm:grid-cols-2">
            <div><label style={labelStyle}>Name</label><input name="name" required placeholder="Your name" style={inputStyle} /></div>
            <div><label style={labelStyle}>Email</label><input name="email" required type="email" placeholder="you@business.com" style={inputStyle} /></div>
          </div>
          <div>
            <label style={labelStyle}>Business / Project</label>
            <input name="business_type" placeholder="e.g. Retail store · Yoga studio · Existing website" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Message</label>
            <textarea name="message" required rows={5} placeholder="What are you trying to solve?" style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <motion.button
            type="submit" disabled={sending}
            whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px 24px", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`,
              border: "none", borderRadius: 8, fontFamily: FONT_B, fontSize: 14, fontWeight: 600,
              color: "var(--bg-primary)", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1,
            }}
          >
            {sending ? "Sending…" : "Send message"}
            {!sending && <ArrowRight size={16} />}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
