"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { IdentityProfile } from "@/lib/supabase";

export const IdentityCtx = createContext<IdentityProfile | null>(null);

let _cache: IdentityProfile | null = null;

export function IdentityProvider({
  initial,
  children,
}: {
  initial: IdentityProfile | null;
  children: React.ReactNode;
}) {
  const [data, setData] = useState<IdentityProfile | null>(initial ?? _cache);

  useEffect(() => {
    if (initial) {
      _cache = initial;
      setData(initial);
      return;
    }
    if (_cache) {
      setData(_cache);
      return;
    }
    supabase
      .from("identity_profile")
      .select("*")
      .eq("username", "mvsingh")
      .single()
      .then(({ data: row }) => {
        if (row) {
          _cache = row as IdentityProfile;
          setData(_cache);
        }
      });
  }, [initial]);

  return <IdentityCtx.Provider value={data}>{children}</IdentityCtx.Provider>;
}
