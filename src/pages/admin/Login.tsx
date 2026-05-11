import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Shield, ArrowRight, Mail } from "lucide-react";

const ADMIN_EMAIL = "manvirsinghashat@gmail.com";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle the magic link redirect — Supabase puts tokens in the URL hash
  // and fires SIGNED_IN via onAuthStateChange once the session is established.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        navigate("/admin/dashboard", { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const sendLink = async () => {
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(220_18%_4%)] px-4">
      <motion.div
        className="mb-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]">
          <Shield size={18} className="text-white/70" />
        </div>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">Scale Crafted</p>
          <p className="text-sm font-semibold text-white">Admin Panel</p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-xs rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10">
              <Mail size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Check your inbox</p>
              <p className="mt-1 text-xs leading-relaxed text-white/35">
                A sign-in link was sent to{" "}
                <span className="font-mono text-white/60">{ADMIN_EMAIL}</span>.
                Click it to access the admin panel.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setError(""); }}
              className="font-mono text-[10px] text-white/25 underline underline-offset-4 hover:text-white/50 transition-colors"
            >
              Resend link
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-base font-semibold text-white">Sign in</h1>
              <p className="mt-1 text-xs leading-relaxed text-white/35">
                A magic link will be sent to{" "}
                <span className="font-mono text-white/55 break-all">{ADMIN_EMAIL}</span>
              </p>
            </div>

            {error && (
              <p className="font-mono text-xs text-red-400">{error}</p>
            )}

            <motion.button
              onClick={sendLink}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-black disabled:opacity-50"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {loading ? "Sending…" : "Send sign-in link"}
              {!loading && <ArrowRight size={14} />}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
