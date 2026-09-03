# MVSingh Studio — Execution Plan

Single source of truth for the Studio initiative. Update this file whenever work completes, a requirement is discovered, or a decision is made. Do not maintain a parallel plan elsewhere.

Status legend: `[ ]` Not started · `[-]` In progress · `[x]` Completed · `[!]` Blocked · `[?]` Decision required

---

## Vision

MVSingh Studio is the business-facing half of the MVSingh ecosystem: a founder-led digital-building practice that digitalizes and automates businesses, starting in Punjab/India. It should read as "an engineer who understands business and can build the system end-to-end," not as a generic web agency. `mvsingh.in` (personal) and the Studio stay siblings in one ecosystem rather than merging into one agency site.

## Current State (as of repository audit, 2026-09-03)

- **Stack**: Next.js 16 (App Router, Turbopack), React 18, TypeScript, Tailwind + shadcn/Radix primitives, Framer Motion (`motion`), Supabase (Postgres + Auth + Storage) as the only backend, deployed on Vercel. Single repo, git history intact, remote `mvsingh07/scale-crafted-brand`.
- **Live identity**: One CMS-driven "hub" ecosystem for **mvsingh** (`identity_profile`, `ecosystem_theme` tables), rendered at `/` as a single scrolling page (Home → About → Vision → Services → Blogs → Contact) with matching standalone routes (`/about`, `/services`, `/vision`, `/blogs`, `/contact`) for direct linking/SEO. Nav links, hero copy, and theme tokens are DB-driven and editable via `/forge` (password-gated CMS, Ctrl+Alt+L to reach from the hub).
- **Design language already in place**: near-black canvas (`#0A0A0A`), gold accent (`#C9A55A`/`#E0C27A`), Cinzel display serif + Inter body, generous motion (typewriter hero, scroll reveals, a disabled-but-present mandala/"sacred geometry" motif, a "DivineAura" component on the Vision page). This is premium and distinctive, but leans spiritual/mystical in places — fine for the personal site's Vision section, likely too much for a business studio.
- **Services content already written and seeded**: `docs/services.md` (a full "Punjab businesses in the AI era" services script) is already live in the `ecosystem_services` table and rendered at `/services` — Digital Presence, Search Visibility (SEO/GEO), AI & Automation, Custom Business Systems, Digital Business Tools, Mobile Applications. This is Studio-grade content sitting inside the personal site today. **Reuse it — don't rewrite from scratch.**
- **Legacy/parallel surfaces that predate the current CMS** (from an earlier "digital ecosystem platform" pivot documented in `docs/plan.md` / `docs/folder-structure.md`):
  - `/tech`, `/portfolio`, `/portfolio/tech` — three routes, all rendering the same `getProfileData("manvir")` output from the older `profiles` table. Redundant with each other and disconnected from the newer `identity_profile`/`ecosystem_*` tables.
  - `/home` — a second, separately-built full "hub" page, distinct from `/` and `/tech`. Unclear if still linked from anywhere live.
  - `admin/*` (dashboard, users, payment-config, revenue, transactions) + `supabase/functions/{create-subscription,razorpay-webhook}` + `transactions`/`admin_config`/`profiles` tables — scaffolding for a multi-tenant "digitalavatar.ai" SaaS (per-user portfolios with subscriptions) that Phase 3 of the old plan describes. This is **not** the Studio's client-facing business; it looks dormant.
  - `vercel.json` still has a `/(.*) → /index.html` SPA rewrite left over from the pre-Next.js Vite app. Next.js/Vercel doesn't need this — it's dead config, not actively harmful but should be removed when touching deploy config.
- **Working tree is currently dirty**: uncommitted edits to `robots.txt`, `layout.tsx`, `portfolio/layout.tsx`, plus untracked new `layout.tsx` files under about/blogs/brand/contact/home/services and a new `sitemap.ts`. These look like in-progress SEO metadata work — **not Studio-related** and not touched by this plan. Must be committed or stashed by the user before any repo restructuring, so it isn't lost or attributed to the wrong change.
- **SEO baseline exists**: per-route metadata via new `layout.tsx` files (in progress), a `sitemap.ts`, `robots.txt` blocking `/admin` and `/forge`, Person JSON-LD on the root layout. No per-service-page structured data, no business/Organization schema yet — expected, since there's no business entity yet.

## Strategic Decisions

| # | Decision | Reasoning | Status |
|---|---|---|---|
| 1 | Studio lives at **`studio.mvsingh.in`** (subdomain), same Vercel project, same Next.js app, routed via `middleware.ts` on `Host` header — not a path (`/studio`) and not a second Vercel project. | A subdomain is free (just a DNS CNAME + Vercel domain alias) and keeps one codebase/one deploy, which is what "same repository" implies. A path would blur the personal/business separation the brief explicitly wants; a second project would duplicate the design system, Supabase client, and CMS. | `[x]` Decided |
| 2 | The physical move of `scale-crafted-brand`'s contents into a `Studio/` subfolder **inside this same repo** is deferred until the working tree is clean and the user confirms. | It's a large, low-reversibility change (every import path, `tsconfig`/`tailwind` content globs, Vercel "Root Directory" setting, and CI would need updating) happening on top of someone else's in-flight, uncommitted SEO work. Doing it now risks losing or misattributing that work. | `[x]` Decided — see Open Questions |
| 3 | Legacy SaaS scaffolding (`/admin/*`, `profiles`/`transactions`/`admin_config` tables, Razorpay functions, `/tech`+`/portfolio`+`/portfolio/tech`+`/home` duplicate routes) is **archived in place, not deleted**, until confirmed dead. | Section 4 of the brief says don't blindly rebuild or destroy useful infrastructure, and never assume something is safe to delete without checking. Payment/revenue code touching real transactions is exactly the kind of thing that shouldn't be removed on a guess. | `[?]` Needs confirmation |
| 4 | Studio design language = **same palette and type system, less mysticism**: keep the black/gold/Cinzel identity (it already reads premium and technical), drop mandala/"DivineAura"-style motifs from Studio pages specifically. Those stay on the personal Vision page where they fit. | Brief #9 says evolve, don't replace, the existing identity; brief #25 explicitly warns against sounding "overly philosophical or spiritual" for the business message. | `[x]` Decided |
| 5 | Reuse the existing `ecosystem_services` content (already Studio-toned, per `docs/services.md`) as the seed for Studio's service sections, re-grouped under the brief's five pillars (Digital Presence, Business Systems, Automation, AI, Visibility) instead of rewriting. | The content already exists, is honest (no invented claims), and matches the brief's tone. Duplicating effort to rewrite it would be waste. | `[x]` Decided |
| 6 | "Gold / Platinum / Diamond" plan names: flagged for replacement — they read as jewelry/wedding-package tiers, which cuts against brief #16's "avoid looking like a cheap package-based web agency." No replacement chosen yet. | Naming should communicate depth of engagement, not a metal hierarchy. | `[?]` Needs confirmation |
| 7 | Years-of-experience claim: the live About section already says **"3+ years building"** while the brief's draft copy (section 13) says "approximately 4 years." Use whichever is actually true — do not average or guess. | Brief #32: never invent numbers. | `[?]` Needs confirmation |

## Open Questions

- `[?]` **Repo restructuring timing** — recommend: (a) user commits or stashes the current uncommitted SEO changes first, (b) then a dedicated Milestone-1 session does the `Studio/` move as its own PR, verifying build + Vercel Root Directory + import paths before merging. Should this happen now, or after the current SEO work lands?
- `[?]` **Legacy SaaS scaffolding** — keep dormant (do nothing), formally archive (move under `_legacy/` with a README), or delete outright? Any real transactions/users behind `admin_config`/`transactions` that make deletion unsafe?
- `[?]` **`/home`, `/tech`, `/portfolio`, `/portfolio/tech` duplicate routes** — safe to consolidate/redirect into the canonical hub + `/about` now, or is something still linking to them externally (old backlinks, business cards, social bios)?
- `[?]` Plan-tier naming (Gold/Platinum/Diamond replacement) — no strong alternative proposed yet; needs a naming pass once Studio IA is locked.
- `[?]` Actual years of experience for the credibility section (3+ vs ~4) — confirm the true number before writing new copy.
- `[?]` Any existing GST/company registration, or is the Studio operating as a sole proprietorship / unregistered for now? Affects what the Guidance/Impact plan pages can legally claim.

## Decisions Log

- 2026-09-03 — Studio ships as a subdomain (`studio.mvsingh.in`) inside the existing Next.js app via host-based middleware, not a new app or a path segment. (Decision #1)
- 2026-09-03 — Repository restructuring into `Studio/` is scoped as its own Milestone-1 task, gated on a clean working tree and explicit go-ahead, not bundled into this first audit pass. (Decision #2)
- 2026-09-03 — Existing `ecosystem_services` CMS content is the source of truth for Studio's "What We Build" section; not rewritten from scratch. (Decision #5)

## Change Log

- 2026-09-03 — Repository audit completed. This file created. No application code changed yet.

---

# Phase 1 — Foundation & Launch

## Milestone 1 — Repository & Architecture
- [ ] Confirm working tree is clean (current SEO edits committed/stashed by user)
- [ ] Decide final disposition of legacy SaaS scaffolding (Open Question above)
- [ ] Move Studio-owned code into `Studio/` within this repo; preserve git history (`git mv`, not copy+delete)
- [ ] Update `tsconfig.json`, `tailwind.config.ts` content globs, and any absolute imports for the new path
- [ ] Update Vercel project settings (Root Directory / build command) if the move changes where `package.json` lives
- [ ] Add host-based `middleware.ts` routing `studio.mvsingh.in` → Studio routes, `mvsingh.in` → personal routes
- [ ] Verify `npm run build` succeeds and no broken imports remain
- [ ] Remove dead `vercel.json` SPA rewrite left over from the pre-Next.js app

## Milestone 2 — Studio Website
- [ ] Lock information architecture (Hero, Problem, Why Now, What We Build, Transformation, Approach, Experience, Plans, Impact/Guidance teasers, Contact)
- [ ] Build Studio-specific layout/nav (distinct from personal hub nav) reusing existing design tokens minus mystical motifs
- [ ] Port and regroup `ecosystem_services` content into the Studio service pillars
- [ ] Build "Business Transformation" signature section (offline → AI-ready)
- [ ] Build "Our Approach" (Understand → Discover → Design → Build → Automate → Launch)
- [ ] Write Experience/credibility section using confirmed (not estimated) numbers
- [ ] Resolve plan-tier naming and build Plans section
- [ ] Contact / "work with us" flow (can reuse existing `contact_submissions` table + form)

## Milestone 3 — SEO & GEO
- [ ] Organization/ProfessionalService JSON-LD for Studio (separate from the existing Person JSON-LD)
- [ ] Per-page metadata + OG images for Studio routes
- [ ] Extend `sitemap.ts` and `robots.txt` for the `studio.` host
- [ ] Content pass for AI/GEO discoverability (plain-language "what/who/where/why" per brief #19)

## Milestone 4 — Google Business Profile
- [ ] Confirm eligibility (no false physical office) and document setup steps as manual tasks

## Milestone 5 — Social Presence
- [ ] Evaluate Instagram handle options and content pillars; recommend platform shortlist

## Milestone 6 — Portfolio & Proof
- [ ] Select real projects, write Problem→Thinking→Solution→System→Result case studies (no invented results)

## Milestone 7 — Personal Website Refinement
- [ ] Trim `/services`-style business content from the personal site once Studio owns it
- [ ] Add "Studio" as a nav item linking out to `studio.mvsingh.in`
- [ ] Consolidate or redirect the legacy `/home`, `/tech`, `/portfolio`, `/portfolio/tech` duplicates

# Phase 2 — Lead Generation & Automation
*(Not started — do not build ahead of Phase 1.)* WhatsApp, email workflows, CRM/lead management, AI assistant, analytics, follow-up automation.

# Phase 3 — Studio Operations
*(Not started.)* Company registration, GST, contracts/privacy/terms, client systems, scalable delivery process.

# Phase 4 — Products
*(Not started.)* Business management software, gym/yoga/healthcare software, CMS/CRM products, Digital Gurukul, Sehat-Saathi successor.
