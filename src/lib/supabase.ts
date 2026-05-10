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
export type Profile = {
  id: string;
  user_id: string;
  username: string;
  name: string;
  tagline: string;
  identity_stripe: string;
  hero_description: string;
  about_paragraphs: string[];
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
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
