import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Profile, Service, Project, CareerStep, SkillGroup } from "@/lib/supabase";

export interface FullProfile {
  profile: Profile;
  services: Service[];
  projects: Project[];
  steps: CareerStep[];
  skillGroups: SkillGroup[];
}

// Cached for 5 minutes; tagged so on-demand revalidation works via
// `revalidateTag("profile-<username>")` in a server action or route handler.
const _getCachedProfile = unstable_cache(
  async (username: string): Promise<FullProfile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        services ( * ),
        projects ( * ),
        career_steps ( * ),
        skill_groups ( * )
      `)
      .eq("username", username)
      .maybeSingle();

    if (error || !data) return null;

    return {
      profile: data as Profile,
      services: ((data as any).services ?? []).sort(
        (a: Service, b: Service) => a.ord - b.ord
      ),
      projects: ((data as any).projects ?? []).sort(
        (a: Project, b: Project) => a.ord - b.ord
      ),
      steps: ((data as any).career_steps ?? []).sort(
        (a: CareerStep, b: CareerStep) => a.ord - b.ord
      ),
      skillGroups: ((data as any).skill_groups ?? []).sort(
        (a: SkillGroup, b: SkillGroup) => a.ord - b.ord
      ),
    };
  },
  ["profile-data"],
  { revalidate: 300, tags: ["profile-data"] }
);

// Wrapper so the username argument becomes part of the cache key.
export function getProfileData(username: string) {
  return _getCachedProfile(username);
}
