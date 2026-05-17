import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Existing ──────────────────────────────────────────────────────────────────
export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  project_role: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
};

// ── Portfolio schema ──────────────────────────────────────────────────────────
export type Theme = "dark" | "light" | "mono-grey" | "mono-blue";
export type SubscriptionStatus = "trial" | "active" | "expired";
export type Plan = "monthly" | "halfyearly" | "annual";
export type ResumeVisibility = "public" | "private";
export type StoryMode = "brief" | "detailed";

export type FontSetting = { family: string; size: number; color: string };
export type FontConfig = {
  heading: FontSetting;
  subheading: FontSetting;
  body: FontSetting;
  title?: FontSetting;
  subtitle?: FontSetting;
};

export type PersonalDetail = { label: string; value: string };
export type StoryDetailSection = { section_name: string; points: string[] };

export type Profile = {
  id: string;
  user_id: string;
  username: string;
  name: string;
  tagline: string;
  identity_stripe: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string;
  about_paragraphs: string[];
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  resume_url: string | null;
  theme: Theme | null;
  dashboard_theme: Theme | null;
  resume_visibility: ResumeVisibility | null;
  story_mode: StoryMode | null;
  font_config: FontConfig | null;
  personal_image_url: string | null;
  personal_headline: string | null;
  personal_details: PersonalDetail[] | null;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  razorpay_sub_id: string | null;
  current_plan: Plan | null;
  plan_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  profile_id: string;
  razorpay_payment_id: string | null;
  razorpay_sub_id: string | null;
  plan: Plan;
  amount_paise: number;
  status: "captured" | "failed" | "refunded";
  created_at: string;
};

export function isTrialExpired(
  profile: Pick<Profile, "subscription_status" | "trial_ends_at">
): boolean {
  if (profile.subscription_status === "active") return false;
  if (profile.subscription_status === "expired") return true;
  if (!profile.trial_ends_at) return false;
  return new Date(profile.trial_ends_at) < new Date();
}

export function trialDaysLeft(profile: Pick<Profile, "trial_ends_at">): number {
  if (!profile.trial_ends_at) return 30;
  const ms = new Date(profile.trial_ends_at).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export const PLAN_LABELS: Record<Plan, string> = {
  monthly: "Monthly",
  halfyearly: "6-Month",
  annual: "Annual",
};

export const PLAN_PRICES: Record<Plan, number> = {
  monthly: 9900,   // ₹99 in paise
  halfyearly: 49900,
  annual: 99900,
};

export type Service = {
  id: string;
  profile_id: string;
  icon_name: string;
  title: string;
  description: string;
  impact: string;
  accent: string;
  ord: number;
};

export type Project = {
  id: string;
  profile_id: string;
  number: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  impact: string;
  stack_tags: string[];
  accent: string;
  ord: number;
};

export type CareerStep = {
  id: string;
  profile_id: string;
  chapter: string;
  year: string;
  role: string;
  org: string;
  body: string;
  story_details: StoryDetailSection[];
  ord: number;
};

export type SkillGroup = {
  id: string;
  profile_id: string;
  cluster: string;
  title: string;
  items: string[];
  ord: number;
};
