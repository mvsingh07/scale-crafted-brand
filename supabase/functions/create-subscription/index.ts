import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PLAN_IDS: Record<string, string> = {
  monthly: Deno.env.get("RAZORPAY_PLAN_ID_MONTHLY") ?? "",
  halfyearly: Deno.env.get("RAZORPAY_PLAN_ID_HALFYEARLY") ?? "",
  annual: Deno.env.get("RAZORPAY_PLAN_ID_ANNUAL") ?? "",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authErr || !user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const { plan } = await req.json();
    const planId = PLAN_IDS[plan as string];
    if (!planId) return new Response("Invalid plan", { status: 400, headers: corsHeaders });

    // Create Razorpay subscription
    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        total_count: plan === "monthly" ? 120 : plan === "halfyearly" ? 20 : 10,
        quantity: 1,
        customer_notify: 1,
        notes: { user_id: user.id, plan },
      }),
    });

    if (!rzpRes.ok) {
      const err = await rzpRes.text();
      return new Response(err, { status: 502, headers: corsHeaders });
    }

    const subscription = await rzpRes.json();

    return new Response(
      JSON.stringify({ subscriptionId: subscription.id, keyId: RAZORPAY_KEY_ID }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(String(e), { status: 500, headers: corsHeaders });
  }
});
