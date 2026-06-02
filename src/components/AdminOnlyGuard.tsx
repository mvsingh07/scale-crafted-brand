"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "manvirsinghashat@gmail.com";

export const AdminOnlyGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? "";
      const ok = !!data.session && email === ADMIN_EMAIL;
      setAllowed(ok);
      if (!ok) router.replace("/admin");
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email ?? "";
      const ok = !!session && email === ADMIN_EMAIL;
      setAllowed(ok);
      if (!ok) router.replace("/admin");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(220_18%_6%)]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
};
