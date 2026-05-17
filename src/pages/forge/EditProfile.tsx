import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AdminGuard } from "@/components/AdminGuard";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Save,
  ArrowLeft,
  LogOut,
  Image,
  Eye,
  EyeOff,
  BookOpen,
  BookText,
  Palette,
} from "lucide-react";
import type {
  Profile,
  Theme,
  Service,
  Project,
  CareerStep,
  SkillGroup,
  PersonalDetail,
  StoryDetailSection,
  FontConfig,
} from "@/lib/supabase";
import { Hero } from "@/components/site/Hero";
import { Navbar } from "@/components/site/Navbar";
import { Personal } from "@/components/site/Personal";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { Journey } from "@/components/site/Journey";
import { Skills } from "@/components/site/Skills";
import { Contact } from "@/components/site/Contact";

// ── Constants ─────────────────────────────────────────────────────────────────
const THEMES: { key: Theme; label: string; bg: string; dot: string }[] = [
  { key: "dark",      label: "Dark",      bg: "#0d0f14", dot: "#4a9eff" },
  { key: "light",     label: "Light",     bg: "#f4f5f7", dot: "#2563eb" },
  { key: "mono-grey", label: "Grey",      bg: "#121212", dot: "#cccccc" },
  { key: "mono-blue", label: "Blue",      bg: "#080d1a", dot: "#5ba4ff" },
];

const FONT_FAMILIES = [
  { value: "Space Grotesk, sans-serif", label: "Space Grotesk" },
  { value: "Inter, sans-serif",          label: "Inter" },
  { value: "Fraunces, serif",            label: "Fraunces" },
  { value: "JetBrains Mono, monospace",  label: "JetBrains Mono" },
  { value: "system-ui, sans-serif",      label: "System Default" },
];

const DEFAULT_FONT_CONFIG: FontConfig = {
  heading:    { family: "Space Grotesk, sans-serif", size: 48, color: "#ffffff" },
  subheading: { family: "Inter, sans-serif",          size: 18, color: "#94a3b8" },
  body:       { family: "Inter, sans-serif",          size: 16, color: "#94a3b8" },
  title:      { family: "Space Grotesk, sans-serif", size: 52, color: "#ffffff" },
  subtitle:   { family: "Inter, sans-serif",          size: 24, color: "#94a3b8" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const field = (label: string, children: React.ReactNode) => (
  <div className="space-y-1">
    <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors";

const input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={inputCls} />
);

const textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-colors resize-y min-h-[80px]"
  />
);

const sectionToggle = (label: string, open: boolean, toggle: () => void) => (
  <button
    type="button"
    onClick={toggle}
    className="flex w-full items-center justify-between py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
  >
    <span>{label}</span>
    {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
  </button>
);

// ── Section collapse state ────────────────────────────────────────────────────
type Sections =
  | "hero" | "about" | "personal" | "services"
  | "projects" | "journey" | "skills" | "contact" | "settings";

// ── Main editor component ─────────────────────────────────────────────────────
const EditProfilePage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const portraitRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [services, setServices] = useState<Partial<Service>[]>([]);
  const [projects, setProjects] = useState<Partial<Project>[]>([]);
  const [steps, setSteps] = useState<Partial<CareerStep>[]>([]);
  const [skillGroups, setSkillGroups] = useState<Partial<SkillGroup>[]>([]);

  const [aboutText, setAboutText] = useState("");
  const [personalDetails, setPersonalDetails] = useState<PersonalDetail[]>([]);

  const [open, setOpen] = useState<Record<Sections, boolean>>({
    hero: true, about: false, personal: false, services: false,
    projects: false, journey: false, skills: false, contact: false, settings: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPortrait, setUploadingPortrait] = useState(false);

  const toggle = (s: Sections) => setOpen((o) => ({ ...o, [s]: !o[s] }));

  // ── Apply theme live so the preview panel reflects it ─────────────────────
  useEffect(() => {
    const root = document.documentElement;
    const THEME_CLASSES = ["light", "mono-grey", "mono-blue"];
    THEME_CLASSES.forEach((c) => root.classList.remove(c));
    const t = profile.theme;
    if (t && t !== "dark") root.classList.add(t);
    return () => THEME_CLASSES.forEach((c) => root.classList.remove(c));
  }, [profile.theme]);

  // ── Load existing profile ─────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: p, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load profile", { description: error.message });
        return;
      }

      if (p) {
        setProfile(p);
        setProfileId(p.id);
        setAboutText(
          Array.isArray(p.about_paragraphs)
            ? (p.about_paragraphs as string[]).join("\n\n")
            : ""
        );
        setPersonalDetails(
          Array.isArray(p.personal_details) ? (p.personal_details as PersonalDetail[]) : []
        );

        const [{ data: sv }, { data: pr }, { data: cs }, { data: sg }] = await Promise.all([
          supabase.from("services").select("*").eq("profile_id", p.id).order("ord"),
          supabase.from("projects").select("*").eq("profile_id", p.id).order("ord"),
          supabase.from("career_steps").select("*").eq("profile_id", p.id).order("ord"),
          supabase.from("skill_groups").select("*").eq("profile_id", p.id).order("ord"),
        ]);
        setServices(sv ?? []);
        setProjects(pr ?? []);
        setSteps(cs ?? []);
        setSkillGroups(sg ?? []);
      }
    };
    load();
  }, []);

  // ── Save all ──────────────────────────────────────────────────────────────
  const save = async () => {
    if (!userId) return;
    setSaving(true);

    const aboutParagraphs = aboutText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    const payload = {
      ...profile,
      about_paragraphs: aboutParagraphs,
      personal_details: personalDetails,
      user_id: userId,
    };

    let pid = profileId;

    if (!pid) {
      const { data, error } = await supabase.from("profiles").insert(payload).select().single();
      if (error) {
        toast.error("Failed to create profile", { description: error.message });
        setSaving(false);
        return;
      }
      if (data) { pid = data.id; setProfileId(pid); }
    } else {
      const { error } = await supabase.from("profiles").update(payload).eq("id", pid);
      if (error) {
        toast.error("Failed to save profile", { description: error.message });
        setSaving(false);
        return;
      }
    }

    if (!pid) { setSaving(false); return; }

    const results = await Promise.all([
      upsertList("services", services, pid),
      upsertList("projects", projects, pid),
      upsertList("career_steps", steps, pid),
      upsertList("skill_groups", skillGroups, pid),
    ]);

    const failed = results.some(Boolean);
    setSaving(false);

    if (failed) {
      toast.error("Some sections failed to save — please try again.");
    } else {
      toast.success("Profile saved");
    }
  };

  // returns true on error
  const upsertList = async (
    table: string,
    items: Partial<{ id: string; profile_id: string }>[],
    pid: string
  ): Promise<boolean> => {
    for (const item of items) {
      const row = { ...item, profile_id: pid };
      if (row.id) {
        const { error } = await supabase.from(table).update(row).eq("id", row.id);
        if (error) return true;
      } else {
        const { error } = await supabase.from(table).insert(row);
        if (error) return true;
      }
    }
    return false;
  };

  // ── Resume upload ─────────────────────────────────────────────────────────
  const uploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);

    const path = `${userId}/resume.pdf`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });

    if (error) {
      toast.error("Resume upload failed", { description: error.message });
    } else {
      const { data: { publicUrl } } = supabase.storage.from("resumes").getPublicUrl(path);
      setProfile((p) => ({ ...p, resume_url: publicUrl }));
      toast.success("Resume uploaded");
    }
    setUploading(false);
    // reset so same file can be re-uploaded
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Portrait upload ───────────────────────────────────────────────────────
  const uploadPortrait = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Only PNG or JPG images are accepted");
      return;
    }

    setUploadingPortrait(true);
    const ext = file.type === "image/png" ? "png" : "jpg";
    const path = `${userId}/portrait.${ext}`;
    const { error } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      toast.error("Portrait upload failed", { description: error.message });
    } else {
      const { data: { publicUrl } } = supabase.storage.from("resumes").getPublicUrl(path);
      setProfile((p) => ({ ...p, personal_image_url: publicUrl }));
      toast.success("Portrait uploaded");
    }
    setUploadingPortrait(false);
    if (portraitRef.current) portraitRef.current.value = "";
  };

  // ── List helpers ──────────────────────────────────────────────────────────
  const updateItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<Partial<T>[]>>,
    idx: number,
    patch: Partial<T>
  ) => setter((arr) => arr.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const removeItem = async <T extends { id?: string }>(
    table: string,
    setter: React.Dispatch<React.SetStateAction<Partial<T>[]>>,
    idx: number,
    id?: string
  ) => {
    if (id) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        toast.error("Delete failed", { description: error.message });
        return;
      }
    }
    setter((arr) => arr.filter((_, i) => i !== idx));
    toast.success("Deleted");
  };

  // ── Font config helper ────────────────────────────────────────────────────
  const fontConfig = (profile.font_config as FontConfig) ?? DEFAULT_FONT_CONFIG;

  const updateFont = (
    level: keyof FontConfig,
    field: "family" | "size" | "color",
    value: string | number
  ) => {
    const current = (profile.font_config as FontConfig) ?? DEFAULT_FONT_CONFIG;
    setProfile((p) => ({
      ...p,
      font_config: { ...current, [level]: { ...current[level], [field]: value } },
    }));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/forge");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">

      {/* ── LEFT: Editor ── */}
      <div className="flex w-1/2 flex-col border-r border-white/10">
        {/* Header */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/forge/dashboard")}
              className="text-white/30 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
            </button>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">The Forge</p>
              <h1 className="text-sm font-semibold text-white">Edit Profile</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme swatches — quick access stays in header */}
            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
              {THEMES.map((t) => {
                const active = (profile.theme ?? "dark") === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    title={t.label}
                    onClick={() => setProfile((p) => ({ ...p, theme: t.key }))}
                    className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-150"
                    style={{
                      background: t.bg,
                      borderColor: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)",
                      transform: active ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.dot }} />
                  </button>
                );
              })}
            </div>

            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={uploadResume} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              <Upload size={10} />
              {uploading ? "Uploading…" : "Resume"}
            </button>

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Save size={10} />
              {saving ? "Saving…" : "Save"}
            </button>

            <button onClick={signOut} className="text-white/20 hover:text-white transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-0 divide-y divide-white/[0.06]">

          {/* ── Hero ── */}
          <div>
            {sectionToggle("Hero", open.hero, () => toggle("hero"))}
            {open.hero && (
              <div className="space-y-3 pb-4">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30">
                    Username <span className="text-white/20">· your portfolio URL</span>
                  </label>
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-white/5 focus-within:border-white/30 transition-colors">
                    <span className="flex items-center border-r border-white/10 bg-white/[0.04] px-3 font-mono text-[11px] text-white/25 shrink-0">
                      {window.location.origin}/
                    </span>
                    <input
                      value={profile.username ?? ""}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        }))
                      }
                      placeholder="yourname"
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>
                  {profile.username && (
                    <p className="font-mono text-[9px] text-emerald-400/70">
                      /{profile.username} · save to activate
                    </p>
                  )}
                </div>
                {field("Name", input({ value: profile.name ?? "", onChange: (e) => setProfile((p) => ({ ...p, name: e.target.value })), placeholder: "Manvir Singh" }))}
                {field("Identity Stripe", input({ value: profile.identity_stripe ?? "", onChange: (e) => setProfile((p) => ({ ...p, identity_stripe: e.target.value })), placeholder: "Engineer · Creator · Storyteller" }))}
                <div className="h-px bg-white/[0.06] my-1" />
                {field("Hero Title", input({ value: profile.hero_title ?? "", onChange: (e) => setProfile((p) => ({ ...p, hero_title: e.target.value })), placeholder: profile.name || "Manvir Singh" }))}
                {field("Hero Subtitle", input({ value: profile.hero_subtitle ?? "", onChange: (e) => setProfile((p) => ({ ...p, hero_subtitle: e.target.value })), placeholder: profile.tagline || "Visionary Mind: Igniting Innovation…" }))}
                {field("Hero Description", textarea({ value: profile.hero_description ?? "", onChange: (e) => setProfile((p) => ({ ...p, hero_description: e.target.value })), placeholder: "I design the quiet infrastructure behind ambitious products…" }))}
              </div>
            )}
          </div>

          {/* ── About ── */}
          <div>
            {sectionToggle("About", open.about, () => toggle("about"))}
            {open.about && (
              <div className="pb-4">
                {field(
                  "Paragraphs (separate with blank line)",
                  textarea({ value: aboutText, onChange: (e) => setAboutText(e.target.value), rows: 10, placeholder: "First paragraph…\n\nSecond paragraph…" })
                )}
              </div>
            )}
          </div>

          {/* ── Personal ── */}
          <div>
            {sectionToggle("Personal", open.personal, () => toggle("personal"))}
            {open.personal && (
              <div className="space-y-3 pb-4">
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30">
                    Portrait Image <span className="text-white/20">(PNG or JPG)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {profile.personal_image_url && (
                      <img
                        src={profile.personal_image_url}
                        alt="Portrait"
                        className="h-14 w-14 rounded-xl object-cover border border-white/10"
                      />
                    )}
                    <input ref={portraitRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={uploadPortrait} />
                    <button
                      type="button"
                      onClick={() => portraitRef.current?.click()}
                      disabled={uploadingPortrait}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white/50 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
                    >
                      <Image size={10} />
                      {uploadingPortrait ? "Uploading…" : profile.personal_image_url ? "Replace" : "Upload"}
                    </button>
                  </div>
                </div>

                {field("Headline", input({
                  value: profile.personal_headline ?? "",
                  onChange: (e) => setProfile((p) => ({ ...p, personal_headline: e.target.value })),
                  placeholder: "Engineer · Creator · Based in Chandigarh",
                }))}

                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-white/30">Details</label>
                  <div className="space-y-2">
                    {personalDetails.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={d.label}
                          onChange={(e) =>
                            setPersonalDetails((arr) =>
                              arr.map((it, idx) => (idx === i ? { ...it, label: e.target.value } : it))
                            )
                          }
                          placeholder="Location"
                          className="w-32 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-white/30"
                        />
                        <input
                          value={d.value}
                          onChange={(e) =>
                            setPersonalDetails((arr) =>
                              arr.map((it, idx) => (idx === i ? { ...it, value: e.target.value } : it))
                            )
                          }
                          placeholder="Chandigarh, India"
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-white/30"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPersonalDetails((arr) => arr.filter((_, idx) => idx !== i))
                          }
                          className="text-white/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPersonalDetails((arr) => [...arr, { label: "", value: "" }])}
                      className="flex items-center gap-1.5 rounded-xl border border-dashed border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:border-white/20 hover:text-white/60 transition-colors"
                    >
                      <Plus size={10} /> Add Detail
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Services ── */}
          <div>
            {sectionToggle("Services", open.services, () => toggle("services"))}
            {open.services && (
              <div className="space-y-3 pb-4">
                {services.map((s, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-white/30">Service {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem("services", setServices, i, s.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {field("Title", input({ value: s.title ?? "", onChange: (e) => updateItem(setServices, i, { title: e.target.value } as Partial<Service>), placeholder: "Backend & System Architecture" }))}
                    {field("Description", textarea({ value: s.description ?? "", onChange: (e) => updateItem(setServices, i, { description: e.target.value } as Partial<Service>), rows: 2 }))}
                    {field("Impact", input({ value: s.impact ?? "", onChange: (e) => updateItem(setServices, i, { impact: e.target.value } as Partial<Service>) }))}
                    {field("Icon name (Lucide)", input({ value: s.icon_name ?? "", onChange: (e) => updateItem(setServices, i, { icon_name: e.target.value } as Partial<Service>), placeholder: "Layers" }))}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setServices((a) => [
                      ...a,
                      { title: "", description: "", impact: "", icon_name: "Layers", accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]", ord: a.length },
                    ])
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:border-white/20 hover:text-white/60 transition-colors"
                >
                  <Plus size={10} /> Add Service
                </button>
              </div>
            )}
          </div>

          {/* ── Projects ── */}
          <div>
            {sectionToggle("Projects", open.projects, () => toggle("projects"))}
            {open.projects && (
              <div className="space-y-3 pb-4">
                {projects.map((p, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-white/30">Project {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem("projects", setProjects, i, p.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {field("Title", input({ value: p.title ?? "", onChange: (e) => updateItem(setProjects, i, { title: e.target.value } as Partial<Project>) }))}
                    {field("Tagline", input({ value: p.tagline ?? "", onChange: (e) => updateItem(setProjects, i, { tagline: e.target.value } as Partial<Project>) }))}
                    {field("Problem", textarea({ value: p.problem ?? "", onChange: (e) => updateItem(setProjects, i, { problem: e.target.value } as Partial<Project>), rows: 2 }))}
                    {field("Solution", textarea({ value: p.solution ?? "", onChange: (e) => updateItem(setProjects, i, { solution: e.target.value } as Partial<Project>), rows: 2 }))}
                    {field("Impact", textarea({ value: p.impact ?? "", onChange: (e) => updateItem(setProjects, i, { impact: e.target.value } as Partial<Project>), rows: 2 }))}
                    {field(
                      "Stack tags (comma-separated)",
                      input({
                        value: Array.isArray(p.stack_tags) ? (p.stack_tags as string[]).join(", ") : "",
                        onChange: (e) =>
                          updateItem(setProjects, i, {
                            stack_tags: e.target.value.split(",").map((t) => t.trim()),
                          } as Partial<Project>),
                      })
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setProjects((a) => [
                      ...a,
                      { number: `0${a.length + 1}`, title: "", tagline: "", problem: "", solution: "", impact: "", stack_tags: [], accent: "from-[hsl(var(--brand-cyan))] to-[hsl(var(--brand-violet))]", ord: a.length },
                    ])
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:border-white/20 hover:text-white/60 transition-colors"
                >
                  <Plus size={10} /> Add Project
                </button>
              </div>
            )}
          </div>

          {/* ── Journey ── */}
          <div>
            {sectionToggle("Journey", open.journey, () => toggle("journey"))}
            {open.journey && (
              <div className="space-y-3 pb-4">
                {steps.map((s, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-white/30">Chapter {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem("career_steps", setSteps, i, s.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {field("Chapter label", input({ value: s.chapter ?? "", onChange: (e) => updateItem(setSteps, i, { chapter: e.target.value } as Partial<CareerStep>), placeholder: "Chapter I" }))}
                    {field("Year", input({ value: s.year ?? "", onChange: (e) => updateItem(setSteps, i, { year: e.target.value } as Partial<CareerStep>), placeholder: "2023 — 2025" }))}
                    {field("Role", input({ value: s.role ?? "", onChange: (e) => updateItem(setSteps, i, { role: e.target.value } as Partial<CareerStep>) }))}
                    {field("Organisation", input({ value: s.org ?? "", onChange: (e) => updateItem(setSteps, i, { org: e.target.value } as Partial<CareerStep>) }))}
                    {field("Description", textarea({ value: s.body ?? "", onChange: (e) => updateItem(setSteps, i, { body: e.target.value } as Partial<CareerStep>), rows: 3 }))}

                    {/* Story Details — only when story_mode is detailed */}
                    {profile.story_mode === "detailed" && (
                      <div className="mt-3 space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Story Sections</p>
                        {((s.story_details ?? []) as StoryDetailSection[]).map((sec, si) => (
                          <div key={si} className="space-y-2 rounded-lg border border-white/[0.06] p-2">
                            <div className="flex items-center gap-2">
                              <input
                                value={sec.section_name}
                                onChange={(e) => {
                                  const updated = [
                                    ...((s.story_details ?? []) as StoryDetailSection[]),
                                  ];
                                  updated[si] = { ...updated[si], section_name: e.target.value };
                                  updateItem(setSteps, i, { story_details: updated } as Partial<CareerStep>);
                                }}
                                placeholder="Achievements"
                                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder-white/20 outline-none focus:border-white/30"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (
                                    (s.story_details ?? []) as StoryDetailSection[]
                                  ).filter((_, idx) => idx !== si);
                                  updateItem(setSteps, i, { story_details: updated } as Partial<CareerStep>);
                                }}
                                className="text-white/20 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                            {sec.points.map((pt, pi) => (
                              <div key={pi} className="flex items-center gap-1.5 pl-2">
                                <span className="text-white/20 text-xs">·</span>
                                <input
                                  value={pt}
                                  onChange={(e) => {
                                    const updated = (
                                      (s.story_details ?? []) as StoryDetailSection[]
                                    ).map((sec2, idx2) => {
                                      if (idx2 !== si) return sec2;
                                      const pts = [...sec2.points];
                                      pts[pi] = e.target.value;
                                      return { ...sec2, points: pts };
                                    });
                                    updateItem(setSteps, i, { story_details: updated } as Partial<CareerStep>);
                                  }}
                                  placeholder="Describe a key point…"
                                  className="flex-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder-white/20 outline-none focus:border-white/30"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (
                                      (s.story_details ?? []) as StoryDetailSection[]
                                    ).map((sec2, idx2) => {
                                      if (idx2 !== si) return sec2;
                                      return { ...sec2, points: sec2.points.filter((_, idx) => idx !== pi) };
                                    });
                                    updateItem(setSteps, i, { story_details: updated } as Partial<CareerStep>);
                                  }}
                                  className="text-white/15 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={9} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (
                                  (s.story_details ?? []) as StoryDetailSection[]
                                ).map((sec2, idx2) => {
                                  if (idx2 !== si) return sec2;
                                  return { ...sec2, points: [...sec2.points, ""] };
                                });
                                updateItem(setSteps, i, { story_details: updated } as Partial<CareerStep>);
                              }}
                              className="flex items-center gap-1 pl-2 font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
                            >
                              <Plus size={8} /> Add Point
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const current = (s.story_details ?? []) as StoryDetailSection[];
                            const suggestions = ["Achievements", "Key Projects", "Clients", "Milestones", "Tech Used"];
                            const name = suggestions[current.length % suggestions.length] ?? "Section";
                            updateItem(setSteps, i, {
                              story_details: [...current, { section_name: name, points: [""] }],
                            } as Partial<CareerStep>);
                          }}
                          className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-white/10 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/20 hover:border-white/20 hover:text-white/50 transition-colors"
                        >
                          <Plus size={9} /> Add Section
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSteps((a) => [
                      ...a,
                      { chapter: "", year: "", role: "", org: "", body: "", story_details: [], ord: a.length },
                    ])
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:border-white/20 hover:text-white/60 transition-colors"
                >
                  <Plus size={10} /> Add Chapter
                </button>
              </div>
            )}
          </div>

          {/* ── Skills ── */}
          <div>
            {sectionToggle("Skills", open.skills, () => toggle("skills"))}
            {open.skills && (
              <div className="space-y-3 pb-4">
                {skillGroups.map((g, i) => (
                  <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-white/30">Group {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeItem("skill_groups", setSkillGroups, i, g.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {field("Cluster", input({ value: g.cluster ?? "", onChange: (e) => updateItem(setSkillGroups, i, { cluster: e.target.value } as Partial<SkillGroup>), placeholder: "Foundation / Infrastructure / Interface" }))}
                    {field("Title", input({ value: g.title ?? "", onChange: (e) => updateItem(setSkillGroups, i, { title: e.target.value } as Partial<SkillGroup>) }))}
                    {field(
                      "Skills (comma-separated)",
                      input({
                        value: Array.isArray(g.items) ? (g.items as string[]).join(", ") : "",
                        onChange: (e) =>
                          updateItem(setSkillGroups, i, {
                            items: e.target.value.split(",").map((t) => t.trim()),
                          } as Partial<SkillGroup>),
                      })
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setSkillGroups((a) => [
                      ...a,
                      { cluster: "Foundation", title: "", items: [], ord: a.length },
                    ])
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/30 hover:border-white/20 hover:text-white/60 transition-colors"
                >
                  <Plus size={10} /> Add Skill Group
                </button>
              </div>
            )}
          </div>

          {/* ── Contact ── */}
          <div>
            {sectionToggle("Contact Info", open.contact, () => toggle("contact"))}
            {open.contact && (
              <div className="space-y-3 pb-4">
                {field("Email", input({ type: "email", value: profile.email ?? "", onChange: (e) => setProfile((p) => ({ ...p, email: e.target.value })) }))}
                {field("Phone", input({ value: profile.phone ?? "", onChange: (e) => setProfile((p) => ({ ...p, phone: e.target.value })), placeholder: "+91 62838 49317" }))}
                {field("LinkedIn URL", input({ value: profile.linkedin_url ?? "", onChange: (e) => setProfile((p) => ({ ...p, linkedin_url: e.target.value })) }))}
                {field("GitHub URL", input({ value: profile.github_url ?? "", onChange: (e) => setProfile((p) => ({ ...p, github_url: e.target.value })) }))}
                {profile.resume_url && (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="font-mono text-[10px] text-emerald-400/80">Resume uploaded</p>
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate font-mono text-[10px] text-white/30 hover:text-white/60"
                    >
                      {profile.resume_url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Settings ── */}
          <div>
            {sectionToggle("Settings", open.settings, () => toggle("settings"))}
            {open.settings && (
              <div className="space-y-5 pb-5">

                {/* Resume Visibility */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    {(profile.resume_visibility ?? "public") === "public"
                      ? <Eye size={11} className="text-emerald-400" />
                      : <EyeOff size={11} className="text-amber-400" />}
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                      Resume Visibility
                    </label>
                  </div>
                  <p className="text-[11px] text-white/30">
                    {(profile.resume_visibility ?? "public") === "public"
                      ? "Anyone can download your CV directly from the portfolio."
                      : "Visitors see a 'Request CV' button — clicking it opens an email to you."}
                  </p>
                  <div className="flex gap-2">
                    {(["public", "private"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setProfile((p) => ({ ...p, resume_visibility: v }))}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-all ${
                          (profile.resume_visibility ?? "public") === v
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/[0.07] bg-white/[0.03] text-white/40 hover:border-white/15 hover:text-white/60"
                        }`}
                      >
                        {v === "public" ? <Eye size={11} /> : <EyeOff size={11} />}
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Story Mode */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    {(profile.story_mode ?? "brief") === "detailed"
                      ? <BookText size={11} className="text-[hsl(var(--brand-violet))]" />
                      : <BookOpen size={11} className="text-[hsl(var(--brand-cyan))]" />}
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                      Story Mode
                    </label>
                  </div>
                  <p className="text-[11px] text-white/30">
                    {(profile.story_mode ?? "brief") === "brief"
                      ? "Journey shows a concise timeline — chapter, year, role, and description."
                      : "Each chapter can be expanded with detailed sections like achievements and projects."}
                  </p>
                  <div className="flex gap-2">
                    {(["brief", "detailed"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setProfile((p) => ({ ...p, story_mode: v }))}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-all ${
                          (profile.story_mode ?? "brief") === v
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/[0.07] bg-white/[0.03] text-white/40 hover:border-white/15 hover:text-white/60"
                        }`}
                      >
                        {v === "brief" ? <BookOpen size={11} /> : <BookText size={11} />}
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Palette size={11} className="text-[hsl(var(--brand-violet))]" />
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                      Typography
                    </label>
                  </div>

                  {(["title", "subtitle", "heading", "subheading", "body"] as const).map((level) => {
                    const levelCfg = fontConfig[level] ?? DEFAULT_FONT_CONFIG[level]!;
                    const LABELS = {
                      title: "Hero Title",
                      subtitle: "Hero Subtitle",
                      heading: "Heading",
                      subheading: "Subheading",
                      body: "Body Text",
                    };
                    const PREVIEWS = {
                      title: profile.hero_title || profile.name || "Manvir Singh",
                      subtitle: profile.hero_subtitle || profile.tagline || "Visionary Mind",
                      heading: "Section Heading",
                      subheading: "Section Subheading",
                      body: "Building systems at scale, one commit at a time.",
                    };
                    return (
                    <div key={level} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                        {LABELS[level]}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1 col-span-1">
                          <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20">Family</label>
                          <select
                            value={levelCfg.family}
                            onChange={(e) => updateFont(level, "family", e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-2 py-1.5 text-xs text-white outline-none focus:border-white/30"
                          >
                            {FONT_FAMILIES.map((f) => (
                              <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20">Size (px)</label>
                          <input
                            type="number"
                            min={8}
                            max={120}
                            value={levelCfg.size}
                            onChange={(e) => updateFont(level, "size", Number(e.target.value))}
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-white/30"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20">Color</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={levelCfg.color}
                              onChange={(e) => updateFont(level, "color", e.target.value)}
                              className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent p-0.5"
                            />
                            <input
                              type="text"
                              value={levelCfg.color}
                              onChange={(e) => updateFont(level, "color", e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 font-mono text-[10px] text-white outline-none focus:border-white/30"
                              maxLength={7}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Live preview */}
                      <div
                        className="mt-1 rounded-lg border border-white/[0.05] bg-black/20 px-3 py-1.5 truncate"
                        style={{
                          fontFamily: levelCfg.family,
                          fontSize: `${Math.min(levelCfg.size, 20)}px`,
                          color: levelCfg.color,
                        }}
                      >
                        {PREVIEWS[level]}
                      </div>
                    </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── RIGHT: Live portfolio preview ── */}
      <div className="flex w-1/2 flex-col bg-background">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Live Preview</p>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 font-mono text-[9px] text-emerald-400/60">
            Live
          </span>
        </div>

        <div className="flex-1 overflow-y-auto relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_40%_at_50%_0%,hsl(var(--brand-cyan)/0.07),transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_80%_10%,hsl(var(--brand-violet)/0.05),transparent_60%)]" />

          <div className="relative z-10">
            <Navbar
              resumeUrl={profile.resume_url}
              resumeVisibility={profile.resume_visibility ?? "public"}
              ownerEmail={profile.email}
              ownerName={profile.name}
              contained
            />
            <Hero
              profile={profile as Pick<Profile, "name" | "identity_stripe" | "tagline" | "hero_description" | "hero_title" | "hero_subtitle" | "font_config">}
            />
            <Personal
              imageUrl={profile.personal_image_url}
              headline={profile.personal_headline}
              details={personalDetails}
            />
            <About paragraphs={aboutText.split(/\n\n+/).filter(Boolean)} />
            <Services services={services.length > 0 ? (services as Service[]) : undefined} />
            <Projects projects={projects.length > 0 ? (projects as Project[]) : undefined} />
            <Journey
              steps={steps.length > 0 ? (steps as CareerStep[]) : undefined}
              storyMode={profile.story_mode}
            />
            <Skills skillGroups={skillGroups.length > 0 ? (skillGroups as SkillGroup[]) : undefined} />
            <Contact
              profile={profile as Pick<Profile, "email" | "phone" | "linkedin_url" | "github_url">}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ForgeEditProfile = () => (
  <AdminGuard>
    <EditProfilePage />
  </AdminGuard>
);

export default ForgeEditProfile;
