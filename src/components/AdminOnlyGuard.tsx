import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "manvirsinghashat@gmail.com";

export const AdminOnlyGuard = ({ children }: { children: ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? "";
      setAllowed(!!data.session && email === ADMIN_EMAIL);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email ?? "";
      setAllowed(!!session && email === ADMIN_EMAIL);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(220_18%_6%)]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!allowed) return <Navigate to="/admin" replace />;

  return <>{children}</>;
};
