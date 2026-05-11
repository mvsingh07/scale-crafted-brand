# Payment Gateway Guide — Razorpay (India)

## Why Razorpay

Razorpay is the recommended choice for this project:
- Indian entity (Razorpay Software Pvt Ltd, Bengaluru)
- Supports UPI, credit/debit cards, net banking, wallets, EMI — all major Indian payment methods
- Native **Subscriptions API** — handles recurring billing, plan management, and webhooks
- Competitive fees: 2% per transaction (no setup fee on the free plan)
- Excellent developer docs, official Node.js + React SDKs

---

## Step 1 — Create a Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com) → click **Sign Up**
2. Complete KYC: business PAN, GST (if applicable), bank account for settlements
3. Approval typically takes 1–2 business days
4. Once approved, you get access to the **Dashboard** at [https://dashboard.razorpay.com](https://dashboard.razorpay.com)

---

## Step 2 — Get API Keys

1. Dashboard → Settings → **API Keys**
2. Generate keys for **Test mode** first
3. Note down:
   - `Key ID` (public — goes in the frontend)
   - `Key Secret` (private — goes only in backend / Supabase edge functions)
4. When ready to go live, generate **Live mode** keys separately

---

## Step 3 — Create Subscription Plans

In the Razorpay Dashboard → **Subscriptions → Plans → Create Plan**:

| Plan Name    | Amount      | Period   | Interval | Notes                       |
|--------------|-------------|----------|----------|-----------------------------|
| Monthly Pro  | ₹99         | monthly  | 1        |                             |
| 6-Month Pro  | ₹499        | monthly  | 6        | charged every 6 months      |
| Annual Pro   | ₹999        | yearly   | 1        |                             |

After creation, copy each **Plan ID** (e.g. `plan_XXXXXXXXXX`).

Add Plan IDs to environment variables:
```
RAZORPAY_PLAN_ID_MONTHLY=plan_xxxxx
RAZORPAY_PLAN_ID_HALFYEARLY=plan_xxxxx
RAZORPAY_PLAN_ID_ANNUAL=plan_xxxxx
```

---

## Step 4 — Add Environment Variables

In your project root `.env` (and Supabase Edge Function secrets):

```env
# Public (frontend)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Private (backend/edge functions only — never expose in frontend)
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_PLAN_ID_MONTHLY=plan_xxxxx
RAZORPAY_PLAN_ID_HALFYEARLY=plan_xxxxx
RAZORPAY_PLAN_ID_ANNUAL=plan_xxxxx
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

In Supabase: Dashboard → Edge Functions → Secrets → add all private keys.

---

## Step 5 — Install Razorpay SDK (backend)

In the **Supabase Edge Function** (Deno):
```ts
import Razorpay from "npm:razorpay";
const razorpay = new Razorpay({ key_id: Deno.env.get("RAZORPAY_KEY_ID"), key_secret: Deno.env.get("RAZORPAY_KEY_SECRET") });
```

In the **frontend**:
```bash
# Load via CDN script tag (no npm install needed for Razorpay Checkout)
# Add to index.html: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

## Step 6 — Set Up Webhook

1. Dashboard → Settings → **Webhooks** → Add New Webhook
2. URL: `https://<your-supabase-project>.supabase.co/functions/v1/razorpay-webhook`
3. Secret: generate a random string, save as `RAZORPAY_WEBHOOK_SECRET`
4. Enable events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.expired`
   - `payment.failed`

---

## Step 7 — Create Supabase Edge Functions

Two functions are needed:

### `create-subscription`
- Receives: `{ planId, userId }`
- Creates a Razorpay Subscription via API
- Returns: `{ subscriptionId, keyId }` for the frontend checkout

### `razorpay-webhook`
- Receives Razorpay POST events
- Verifies HMAC signature using `RAZORPAY_WEBHOOK_SECRET`
- On `subscription.activated` → update `profiles.subscription_status = 'active'`, store `subscription_id`
- On `subscription.expired` / `subscription.cancelled` → update `profiles.subscription_status = 'expired'`

---

## Step 8 — Frontend Checkout Integration

```tsx
const openRazorpay = (subscriptionId: string) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    subscription_id: subscriptionId,
    name: "Scale Crafted",
    description: "Pro Portfolio Plan",
    handler: (response: any) => {
      // Payment captured — wait for webhook to update DB
      navigate("/forge/dashboard?upgraded=1");
    },
  };
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
```

---

## Step 9 — Test the Full Flow

Use Razorpay test cards:
- Success: `4111 1111 1111 1111`, any future date, any CVV
- Failure: `4000 0000 0000 0002`
- UPI (test): `success@razorpay`

Sequence:
1. User clicks Upgrade → call `create-subscription` edge function
2. Open Razorpay modal with `subscription_id`
3. User pays → Razorpay fires webhook → `razorpay-webhook` updates DB
4. User sees their portfolio active again

---

## Step 10 — Go Live Checklist

- [ ] KYC approved by Razorpay
- [ ] Swap test keys for live keys in all env vars
- [ ] Update webhook URL to production domain
- [ ] Test one real payment in live mode (₹1 plan for verification)
- [ ] Enable GST invoicing in Razorpay Dashboard if required
