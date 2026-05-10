import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile, Service, Project, CareerStep, SkillGroup } from "@/lib/supabase";

export interface FullProfile {
  profile: Profile;
  services: Service[];
  projects: Project[];
  steps: CareerStep[];
  skillGroups: SkillGroup[];
}

interface UseProfileResult {
  data: FullProfile | null;
  loading: boolean;
  error: string | null;
}

export function useProfile(username: string): UseProfileResult {
  const [data, setData] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    supabase
      .from("profiles")
      .select(`
        *,
        services ( * ),
        projects ( * ),
        career_steps ( * ),
        skill_groups ( * )
      `)
      .eq("username", username)
      .maybeSingle()
      .then(({ data: raw, error: err }) => {
        if (err || !raw) {
          setError(err?.message ?? "Profile not found");
          setData(null);
        } else {
          setData({
            profile: raw as Profile,
            services: ((raw as any).services ?? []).sort((a: Service, b: Service) => a.ord - b.ord),
            projects: ((raw as any).projects ?? []).sort((a: Project, b: Project) => a.ord - b.ord),
            steps: ((raw as any).career_steps ?? []).sort((a: CareerStep, b: CareerStep) => a.ord - b.ord),
            skillGroups: ((raw as any).skill_groups ?? []).sort((a: SkillGroup, b: SkillGroup) => a.ord - b.ord),
          });
        }
        setLoading(false);
      });
  }, [username]);

  return { data, loading, error };
}
