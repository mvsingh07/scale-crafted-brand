import { useState } from "react";
import { ArrowRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SectionHeader } from "./SectionHeader";
import { supabase } from "@/lib/supabase";

export const Contact = () => {
  const [sending, setSending] = useState(false);

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
    });

    setSending(false);

    if (error) {
      toast.error("Failed to send", { description: "Something went wrong. Try emailing me directly at manvirsinghashat@gmail.com" });
    } else {
      toast.success("Message sent", { description: "I'll get back to you within 24h." });
      form.reset();
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container">
        <div data-reveal className="card-premium relative overflow-hidden p-8 md:p-14">
          <div className="glow-orb -top-20 -left-10 h-[280px] w-[280px] bg-[hsl(var(--brand-violet)/0.4)]" />
          <div className="glow-orb -bottom-20 -right-10 h-[280px] w-[280px] bg-[hsl(var(--brand-cyan)/0.35)]" />

          <div className="relative grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeader
                eyebrow="06 — Contact"
                title={<>Let's build something<br />scalable.</>}
                description="Whether it's a system that needs to handle 10× growth, a real-time product on a tight timeline, or AI taken from prototype to production — let's talk."
              />

              <div className="mt-10 space-y-3">
                {[
                  { icon: Phone, label: "+91 62838 49317", href: "tel:+916283849317" },
                  { icon: Mail, label: "manvirsinghashat@gmail.com", href: "mailto:manvirsinghashat@gmail.com" },
                  { icon: Linkedin, label: "linkedin.com/mvsingh02", href: "https://linkedin.com/in/mvsingh02" },
                  { icon: Github, label: "github.com/mvsingh07", href: "https://github.com/mvsingh07" },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 transition-all hover:border-primary/40 hover:bg-muted/40"
                  >
                    <span className="flex items-center gap-3 text-sm">
                      <c.icon size={16} className="text-primary" />
                      <span className="font-mono text-foreground">{c.label}</span>
                    </span>
                    <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="lg:col-span-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input name="name" required placeholder="Your name" className="mt-2 h-11 bg-muted/30" />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
                  <Input name="email" required type="email" placeholder="you@company.com" className="mt-2 h-11 bg-muted/30" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Project / Role</label>
                <Input name="project_role" placeholder="e.g. Real-time platform · Senior backend role" className="mt-2 h-11 bg-muted/30" />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea name="message" required rows={5} placeholder="Tell me about the system you're building…" className="mt-2 bg-muted/30" />
              </div>

              <Button type="submit" variant="brand" size="lg" className="w-full" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
                <ArrowRight size={16} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
