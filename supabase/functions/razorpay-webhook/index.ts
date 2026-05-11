import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function verifySignature(body: string, signature: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(WEBHOOK_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === signature;
}

serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!(await verifySignature(body, signature))) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const subId: string =
    event.payload?.subscription?.entity?.id ??
    event.payload?.payment?.entity?.subscription_id ?? "";
  const notes = event.payload?.subscription?.entity?.notes ?? {};
  const userId: string = notes.user_id ?? "";
  const plan: string = notes.plan ?? "";

  switch (event.event) {
    case "subscription.activated": {
      if (!userId) break;
      const planEnds = new Date();
      if (plan === "monthly") planEnds.setMonth(planEnds.getMonth() + 1);
      else if (plan === "halfyearly") planEnds.setMonth(planEnds.getMonth() + 6);
      else if (plan === "annual") planEnds.setFullYear(planEnds.getFullYear() + 1);

      await supabase
        .from("profiles")
        .update({
          subscription_status: "active",
          razorpay_sub_id: subId,
          current_plan: plan,
          plan_ends_at: planEnds.toISOString(),
        })
        .eq("user_id", userId);
      break;
    }

    case "subscription.charged": {
      const payment = event.payload?.payment?.entity;
      if (!payment || !userId) break;

      // Extend plan_ends_at
      const profileRes = await supabase
        .from("profiles")
        .select("plan_ends_at, current_plan")
        .eq("user_id", userId)
        .maybeSingle();

      const base = profileRes.data?.plan_ends_at
        ? new Date(profileRes.data.plan_ends_at)
        : new Date();
      const planKey = profileRes.data?.current_plan ?? plan;
      if (planKey === "monthly") base.setMonth(base.getMonth() + 1);
      else if (planKey === "halfyearly") base.setMonth(base.getMonth() + 6);
      else if (planKey === "annual") base.setFullYear(base.getFullYear() + 1);

      await Promise.all([
        supabase
          .from("profiles")
          .update({ plan_ends_at: base.toISOString(), subscription_status: "active" })
          .eq("user_id", userId),
        supabase.from("transactions").insert({
          profile_id: profileRes.data
            ? (
                await supabase
                  .from("profiles")
                  .select("id")
                  .eq("user_id", userId)
                  .maybeSingle()
              ).data?.id
            : null,
          razorpay_payment_id: payment.id,
          razorpay_sub_id: subId,
          plan: planKey,
          amount_paise: payment.amount,
          status: "captured",
        }),
      ]);
      break;
    }

    case "subscription.cancelled":
    case "subscription.expired": {
      if (!userId) break;
      await supabase
        .from("profiles")
        .update({ subscription_status: "expired" })
        .eq("user_id", userId);
      break;
    }

    case "payment.failed": {
      const payment = event.payload?.payment?.entity;
      if (!payment || !userId) break;
      const profile = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      if (profile.data?.id) {
        await supabase.from("transactions").insert({
          profile_id: profile.data.id,
          razorpay_payment_id: payment.id,
          razorpay_sub_id: subId,
          plan: plan || "monthly",
          amount_paise: payment.amount ?? 0,
          status: "failed",
        });
      }
      break;
    }
  }

  return new Response("ok", { status: 200 });
});
