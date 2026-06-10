import { useState } from "react";
import { ArrowRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SectionHeader } from "./SectionHeader";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

interface ContactProps {
  profile?: Pick<Profile, "email" | "phone" | "linkedin_url" | "github_url">;
}

const DEFAULTS = {
  email: "hello@mvsingh.in",
  phone: "+91 62838 49317",
  linkedin_url: "https://linkedin.com/in/mvsingh02",
  github_url: "https://github.com/mvsingh07",
};

const linkContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const linkItem = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const formContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const formItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export const Contact = ({ profile }: ContactProps = {}) => {
  const [sending, setSending] = useState(false);

  const email = profile?.email || DEFAULTS.email;
  const phone = profile?.phone || DEFAULTS.phone;
  const linkedin = profile?.linkedin_url || DEFAULTS.linkedin_url;
  const github = profile?.github_url || DEFAULTS.github_url;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const { error } = await supabase.from("contact_submissions").insert({
      name: data.get("name") as string,
      email: data.get("email") as string,
      project_role: (data.get("project_role") as string) || null,
      message: data.get("message") as string,
      source: "portfolio",
    });

    setSending(false);

    if (error) {
      toast.error("Failed to send", { description: `Something went wrong. Try emailing me directly at ${email}` });
    } else {
      toast.success("Message sent", { description: "I'll get back to you within 24h." });
      form.reset();
    }
  };

  const contactLinks = [
    ...(phone ? [{ icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` }] : []),
    { icon: Mail, label: email, href: `mailto:${email}` },
    ...(linkedin ? [{ icon: Linkedin, label: linkedin.replace(/^https?:\/\//, ""), href: linkedin }] : []),
    ...(github ? [{ icon: Github, label: github.replace(/^https?:\/\//, ""), href: github }] : []),
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container">
        <motion.div
          className="card-premium relative overflow-hidden p-8 md:p-14"
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glow-orb -top-20 -left-10 h-[280px] w-[280px] bg-[hsl(var(--brand-violet)/0.4)]" />
          <div className="glow-orb -bottom-20 -right-10 h-[280px] w-[280px] bg-[hsl(var(--brand-cyan)/0.35)]" />

          <div className="relative grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeader
                eyebrow="06 — Let's Build"
                title={<>Let's build something<br />scalable.</>}
                description="Whether it's a system that needs to handle 10× growth, a real-time product on a tight timeline, or AI taken from prototype to production — let's talk."
              />

              <motion.div
                className="mt-10 space-y-3"
                variants={linkContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-8%" }}
              >
                {contactLinks.map((c) => (
                  <motion.a
                    key={c.label}
                    variants={linkItem}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 transition-all hover:border-primary/40 hover:bg-muted/40"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <c.icon size={16} className="text-primary" />
                      <span className="font-mono text-foreground">{c.label}</span>
                    </span>
                    <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            <motion.form
              onSubmit={onSubmit}
              className="lg:col-span-6 space-y-4"
              variants={formContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-8%" }}
            >
              <motion.div variants={formItem} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input name="name" required placeholder="Your name" className="mt-2 h-11 bg-muted/30" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
                  <Input name="email" required type="email" placeholder="you@company.com" className="mt-2 h-11 bg-muted/30" />
                </div>
              </motion.div>
              <motion.div variants={formItem}>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Project / Role</label>
                <Input name="project_role" placeholder="e.g. Real-time platform · Senior backend role" className="mt-2 h-11 bg-muted/30" />
              </motion.div>
              <motion.div variants={formItem}>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea name="message" required rows={5} placeholder="Tell me about the system you're building…" className="mt-2 bg-muted/30" />
              </motion.div>
              <motion.div
                variants={formItem}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button type="submit" variant="brand" size="lg" className="w-full" disabled={sending}>
                  {sending ? "Sending…" : "Send message"}
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
