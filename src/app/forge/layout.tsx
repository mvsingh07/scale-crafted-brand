"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  // Login page is public — skip the auth guard entirely
  const isLoginPage = pathname === "/forge/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/forge/login");
      else setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/forge/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router, isLoginPage]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0A0A0A" }}>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return <>{children}</>;
}
