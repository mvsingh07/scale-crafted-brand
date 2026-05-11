# Implementation Plan — Admin Panel + Trial/Subscription System

> **Status**: Pending approval. Nothing below is implemented yet.

---

## Overview

Two parallel workstreams:
1. **Super-admin panel** at `/admin` — OTP login (manvirsinghashat@gmail.com only), users list, transactions, income analytics, payment gateway config
2. **Trial + subscription system** — 30-day free trial on signup, link expires after trial, Razorpay plans (₹99/mo, ₹499/6mo, ₹999/yr), in-Forge upgrade flow

---

## Part 1 — Database Schema Changes

### Migration: `20260510000001_subscriptions.sql`

New columns on `profiles`:
```sql
subscription_status  TEXT  DEFAULT 'trial'  CHECK (subscription_status IN ('trial', 'active', 'expired'))
trial_ends_at        TIMESTAMPTZ            -- auto-set to created_at + 30 days on insert
razorpay_customer_id TEXT                   -- stored after first Razorpay subscription
razorpay_sub_id      TEXT                   -- active Razorpay Subscription ID
current_plan         TEXT                   -- 'monthly' | 'halfyearly' | 'annual' | NULL
plan_ends_at         TIMESTAMPTZ            -- when current paid plan expires
```

Trigger to auto-populate `trial_ends_at` on insert.

New table: `transactions`
```sql
id               UUID   PK
profile_id       UUID   FK → profiles
razorpay_payment_id  TEXT
razorpay_sub_id  TEXT
plan             TEXT   -- 'monthly' | 'halfyearly' | 'annual'
amount_paise     INT    -- amount in paise (₹99 = 9900)
status           TEXT   -- 'captured' | 'failed' | 'refunded'
created_at       TIMESTAMPTZ
```

---

## Part 2 — Trial & Expiry Logic

### `src/lib/supabase.ts`
- Add `SubscriptionStatus` type
- Add `isTrialExpired(profile)` helper — returns true when `subscription_status !== 'active'` AND `trial_ends_at < now()`
- Add `trialDaysLeft(profile)` helper — returns days remaining (negative if expired)
- Add `subscription_status`, `trial_ends_at`, `razorpay_sub_id`, `current_plan`, `plan_ends_at` to `Profile` type

### `src/pages/Portfolio.tsx`
- After profile loads, call `isTrialExpired(profile)` — if true, render `<PortfolioExpired />` instead of the portfolio

### `src/pages/PortfolioExpired.tsx` (new)
- Dark holding page: "This portfolio is currently paused."
- Shows owner name, explanation, back-to-home link
- Forge owner can see a "Upgrade your plan" link if they're logged in (check session)

### `src/pages/forge/Dashboard.tsx`
- Trial status banner below the portfolio URL card:
  - Green: > 14 days remaining → "X days left in your free trial"
  - Amber: 7–14 days → "X days left — upgrade soon"
  - Red: < 7 days or expired → "Trial expired — your portfolio is paused" + Upgrade CTA
- "Upgrade" button → `/forge/upgrade`

---

## Part 3 — Upgrade Flow (User-facing)

### `src/pages/forge/Upgrade.tsx` (new)
Route: `/forge/upgrade` (wrapped in AdminGuard)

Layout:
- Header: The Forge branding + back to Dashboard
- Billing toggle: Monthly / Half-yearly / Annual (with discount badge)
- Single plan card showing price, feature list, CTA button
- CTA calls `create-subscription` Supabase edge function → opens Razorpay modal
- After payment → navigate to dashboard with success toast
- FAQ section: what happens on expiry, cancellation, refund policy

### Razorpay plan IDs in env:
```
VITE_RAZORPAY_KEY_ID
RAZORPAY_PLAN_ID_MONTHLY
RAZORPAY_PLAN_ID_HALFYEARLY
RAZORPAY_PLAN_ID_ANNUAL
```

---

## Part 4 — Supabase Edge Functions

### `supabase/functions/create-subscription/index.ts`
- Input: `{ planId }` (from authenticated user context)
- Creates Razorpay Subscription via REST API
- Returns: `{ subscriptionId, keyId }`

### `supabase/functions/razorpay-webhook/index.ts`
- Verifies HMAC-SHA256 signature
- Handles events:
  - `subscription.activated` → `subscription_status = 'active'`, store `razorpay_sub_id`, `current_plan`, `plan_ends_at`
  - `subscription.charged` → insert row into `transactions`, update `plan_ends_at`
  - `subscription.cancelled` / `subscription.expired` → `subscription_status = 'expired'`
  - `payment.failed` → insert failed transaction row

---

## Part 5 — Super-Admin Panel

### Auth: OTP-only, single email

Route: `/admin` (separate from `/forge`)

Supabase OTP flow:
1. Show email field pre-filled with `manvirsinghashat@gmail.com` (or just a "Send OTP" button)
2. Call `supabase.auth.signInWithOtp({ email: "manvirsinghashat@gmail.com" })`
3. User enters 6-digit code → `supabase.auth.verifyOtp({ email, token, type: "email" })`
4. On success → `/admin/dashboard`

Guard: `AdminOnlyGuard` — checks session AND that `session.user.email === "manvirsinghashat@gmail.com"`. Anyone else is redirected to `/`.

### Files to create

```
src/pages/admin/
  Login.tsx          — OTP send + verify UI
  Dashboard.tsx      — admin home, nav to sub-pages
  Users.tsx          — users list
  Transactions.tsx   — transactions list with filters
  Revenue.tsx        — income analytics
  PaymentConfig.tsx  — Razorpay key configuration
```

### Page: Users List (`/admin/users`)

Table columns:
- Name, Email, Username (link to portfolio), Plan, Status (trial/active/expired), Trial ends / Plan ends, Joined date
- Search by name/email, filter by status
- Click row → see user detail (transactions for that user)
- Action: manually mark as active/expired (for cases like offline payment)

Data source: Supabase query on `profiles` joined with `transactions`

### Page: Transactions (`/admin/transactions`)

Table columns:
- Date, User (name + email), Plan, Amount, Status (captured/failed/refunded), Razorpay Payment ID
- Filters: date range picker, status filter, plan filter
- Pagination (50 per page)

### Page: Revenue Analytics (`/admin/revenue`)

- Total income (all time)
- Time filter: Last 7 days / 30 days / 3 months / 12 months / custom range
- Chart: bar chart of revenue over time (recharts)
- Breakdown: by plan (monthly / half-yearly / annual)
- Active subscribers count, trial users count, expired count

Library: `recharts` (already popular, lightweight)

### Page: Payment Gateway Config (`/admin/payment-config`)

Form fields to save in a `config` table (or Supabase secrets, admin-only):
- Razorpay Key ID (public)
- Razorpay Key Secret (masked input)
- Plan IDs for monthly / half-yearly / annual
- Webhook secret
- Trial duration (days) — default 30, adjustable
- "Test mode / Live mode" toggle

On save: values stored in a `admin_config` table (RLS: only admin email can read/write).

---

## Part 6 — Routing Changes (`src/App.tsx`)

```tsx
// Admin routes — completely separate from /forge
<Route path="/admin" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/transactions" element={<AdminTransactions />} />
<Route path="/admin/revenue" element={<AdminRevenue />} />
<Route path="/admin/payment-config" element={<AdminPaymentConfig />} />

// User forge routes (existing + new)
<Route path="/forge/upgrade" element={<ForgeUpgrade />} />
```

---

## Part 7 — Login.tsx Changes (Signup with plan selection)

At signup, show plan selection:
- Free (30-day trial)
- Monthly Pro — ₹99/mo
- 6-Month Pro — ₹499
- Annual Pro — ₹999/yr

If user selects a paid plan at signup:
1. Create account (existing flow)
2. After email confirmation + first login → redirect to `/forge/upgrade?plan=monthly` (or chosen plan) to complete payment before accessing editor

If Free trial selected: normal signup flow, trial starts from `created_at`.

---

## Implementation Order

1. Migration (`subscriptions` columns + `transactions` table + `admin_config` table)
2. `supabase.ts` type updates + helpers
3. Supabase edge functions (`create-subscription`, `razorpay-webhook`)
4. Portfolio expiry: `PortfolioExpired.tsx` + `Portfolio.tsx` check
5. Dashboard trial banner
6. Upgrade page (`/forge/upgrade`)
7. Admin auth + `AdminOnlyGuard`
8. Admin pages (Users → Transactions → Revenue → PaymentConfig)
9. Login.tsx plan selection on signup
10. End-to-end test with Razorpay test mode

---

## File Count Summary

| New Files | Modified Files |
|-----------|---------------|
| `src/pages/PortfolioExpired.tsx` | `src/lib/supabase.ts` |
| `src/pages/forge/Upgrade.tsx` | `src/pages/Portfolio.tsx` |
| `src/pages/admin/Login.tsx` | `src/pages/forge/Dashboard.tsx` |
| `src/pages/admin/Dashboard.tsx` | `src/pages/forge/Login.tsx` |
| `src/pages/admin/Users.tsx` | `src/App.tsx` |
| `src/pages/admin/Transactions.tsx` | |
| `src/pages/admin/Revenue.tsx` | |
| `src/pages/admin/PaymentConfig.tsx` | |
| `src/components/AdminOnlyGuard.tsx` | |
| `supabase/functions/create-subscription/index.ts` | |
| `supabase/functions/razorpay-webhook/index.ts` | |
| `supabase/migrations/20260510000001_subscriptions.sql` | |
