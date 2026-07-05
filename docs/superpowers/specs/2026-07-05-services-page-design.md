# Unified Services Page — Design Spec

**Date:** 2026-07-05
**Status:** Draft — awaiting owner approval
**Source brief:** `ai-components/init.md` + `docs/services.md`

## Objective

Turn the placeholder `/services` route into a real, premium Services page for the
Hub (MV Singh's personal site). The page presents the service offerings from
`docs/services.md`, **folds the existing Work/projects section into it**, and is
backed by a dedicated **Services Editor** in the Forge admin.

Core message (hero): *Helping Punjab Businesses Grow in the Digital & AI Era.*

> The brief's pitch line reads "Helping Panjab becoming digital active and AI
> powered". This spec uses the more polished `services.md` heading
> ("Helping Punjab Businesses Grow in the Digital & AI Era") as the hero. The
> **Punjab / Panjab** spelling is the owner's call — hero copy is static in code,
> so it is a one-line change. **Open decision — defaults to "Punjab".**

## Scope decisions (recommended defaults, pending confirmation)

1. **Editor scope: service cards only.** The 6 service categories are dynamic
   (DB + editor). Hero copy, "How I Work" steps, "Why Work With Me", tech stack,
   and FAQ are static in the component. This matches the existing
   Projects/Blogs/Vision editors and ships one new table.
2. **Work merges into Services.** The Services page includes a "Featured
   Projects" section that renders the existing `ecosystem_projects`. Nav shows
   **Services** instead of **Work**; `/work` redirects to `/services`. Projects
   remain managed by the existing Projects Editor — no change there.
3. **Fidelity: premium, matching the Hub.** Cinzel/Inter type, gold accents,
   `motion/react` animations, glass cards, hover states — consistent with
   `WorkSection`/`Hero`. The bespoke animated architecture diagram (services.md
   §6) is **deferred**; v1 ships a clean static tech-stack icon grid.

## Architecture

### Page structure — `ServicesSection`

New component `src/components/sections/ServicesSection.tsx`, composed of
sub-sections (each its own small, focused function in the file):

| # | Sub-section        | Content source            | Notes |
|---|--------------------|---------------------------|-------|
| 1 | Intro / hero band  | Static                    | Eyebrow "02 — What I Offer", pitch heading, subheading, key message, 2 CTAs |
| 2 | How I Can Help     | **DB — `ecosystem_services`** | 6 premium interactive cards |
| 3 | Featured Projects  | **DB — `ecosystem_projects`** | Reuses existing project card UI (extracted/shared) |
| 4 | How I Work         | Static                    | 6-step timeline: Understand → Plan → Design → Build → Launch → Support |
| 5 | Why Work With Me   | Static                    | Advantage chips |
| 6 | Technology Stack   | Static                    | Icon grid grouped by Frontend/Backend/AI/etc. (no animated diagram in v1) |
| 7 | FAQ                | Static                    | `@/components/ui/accordion`, SEO-friendly Q&A |
| 8 | Final CTA          | Static                    | "Let's Build Something Meaningful" + 2 buttons |

### Routing / composition

- **`src/app/services/page.tsx`** — replace `ComingSoonPage` with
  `<HubPageLayout><ServicesSection /></HubPageLayout>`.
- **`src/app/page.tsx` (scroll Hub)** — replace the Work entry in `SECTION_MAP`
  with a Services entry (`id: "eco-services"`, `href: "/services"`,
  `Component: ServicesSection`). Update `FALLBACK_NAV_HREFS` to swap `/work` →
  `/services`.
- **`src/app/work/page.tsx`** — redirect to `/services` (Next `redirect()` in a
  server component, or a client redirect). Keeps old links alive.
- **Nav data caveat:** the live navbar is driven by `identity.nav_links` in the
  DB, with `FALLBACK_NAV_HREFS` used only when none are set. If the owner's
  identity record still lists `/work`, the Services section won't appear on the
  scroll hub until nav is updated. **Action:** owner updates nav via the Identity
  Editor (swap the Work link for Services), OR we add a migration that rewrites
  the `/work` nav link to `/services` for `username = 'mvsingh'`. This spec
  includes that migration so it works without manual steps.

### Data model — new table `ecosystem_services`

Mirrors the `ecosystem_projects` conventions (username-scoped, `is_public`,
`ord`). Note: a legacy `Service` type already exists in `supabase.ts` for the
*other* (profile-based) portfolio system — we do **not** reuse it. New type:

```ts
export type EcosystemService = {
  id: string;
  username: string;        // "mvsingh"
  title: string;           // "Digital Presence"
  summary: string;         // intro line under the title
  items: string[];         // ["Business Websites", "Corporate Websites", ...]
  impact: string;          // "Business Impact" line
  icon_name: string;       // lucide icon key, e.g. "Globe"
  accent: string;          // hex/CSS colour for the card accent
  is_public: boolean;
  ord: number;
  created_at: string;
};
```

Migration `supabase/migrations/20260705000000_create_ecosystem_services.sql`:
create table, RLS policies (public read where `is_public`, owner write) matching
the `ecosystem_projects` policy set, plus a seed migration
`20260705000001_seed_ecosystem_services.sql` inserting the 6 categories from
`services.md` (Digital Presence, Search Visibility, AI & Automation, Custom
Business Systems, Digital Business Tools, Mobile Applications).

### Services Editor — `/forge/services`

New view `src/views/forge/ServicesEditor.tsx` + route
`src/app/forge/services/page.tsx`, modelled directly on `ProjectsEditor`:

- List of service cards (title, ord badge, public/hidden indicator).
- Create/Edit modal with `Field` (title, summary, impact), `TagInput` (items /
  services list), an **icon picker** (select from a curated lucide subset),
  accent colour, order, and public toggle.
- Reuses the shared `Field` / `TagInput` / modal styling already established in
  `ProjectsEditor` (extract the shared bits or duplicate the small helpers,
  consistent with current codebase practice — the editors currently duplicate
  these helpers; v1 follows suit to avoid a risky refactor, noted as tech debt).
- Wrapped in `AdminGuard`.

Register in the Forge dashboard `WORKSPACE` array (`src/views/forge/Dashboard.tsx`)
with a new card: label **"Services Editor"**, `href: "/forge/services"`, a
fitting lucide icon (e.g. `LayoutGrid`), and an accent colour.

### Featured Projects reuse

The Featured Projects sub-section should render the same project cards as today.
Extract the `ProjectCard` from `WorkSection.tsx` into a shared component at
`src/components/sections/shared/ProjectCard.tsx`; both `WorkSection` and the new
Services page import it, so cards stay identical. `WorkSection` is no longer in
the nav/scroll hub (Work merged into Services) but remains as a component for the
`/work` redirect path and reuse.

## Error handling & edge cases

- **Empty services table:** show the same graceful "loading soon" empty state
  pattern as `WorkSection`.
- **Supabase fetch failure:** fail soft — render section shell with empty state,
  no thrown error (matches existing sections' fire-and-forget `.then` pattern).
- **`icon_name` not found** in the lucide map: fall back to a default icon
  (`Sparkles`), never crash.
- **Old `/work` links & bookmarks:** preserved via redirect.

## Testing / verification

This is presentational Next.js UI; verification is build + visual, not unit TDD:

1. `npm run build` passes (types + lint clean).
2. `/services` renders all 8 sub-sections; service cards load from DB; featured
   projects match `/work`'s previous output.
3. `/work` redirects to `/services`.
4. Forge → Services Editor: create, edit, reorder, hide, delete a card;
   changes reflect on `/services`.
5. Nav shows Services (not Work) on the scroll hub and standalone pages.
6. Responsive check at mobile / tablet / desktop widths.

## Out of scope (v1)

- Animated tech-stack architecture diagram (services.md §6) — static grid for now.
- Making hero / process / why-me / FAQ / tech-stack content editable.
- Case-study detail pages ("View Case Study" button in services.md §3).
- Any change to the separate `views/Portfolio.tsx` (`components/site/*`) system.

## Build order (for the implementation plan)

1. Migration: create + seed `ecosystem_services`; nav-link migration `/work`→`/services`.
2. Type: add `EcosystemService` to `supabase.ts`.
3. Extract shared `ProjectCard`.
4. Build `ServicesSection` (static sub-sections + DB-driven cards + featured projects).
5. Wire routes: `/services` page, `/work` redirect, Hub `SECTION_MAP` + fallback nav.
6. Build `ServicesEditor` + `/forge/services` route; register in Forge dashboard.
7. Verify (build + visual walkthrough).
