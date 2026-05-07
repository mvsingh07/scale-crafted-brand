import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  project_role: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
};
