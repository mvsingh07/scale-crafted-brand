Plan: Personal Digital Ecosystem → Platform
  
  Current State

  Vite + React SPA, /:username is the tech portfolio, /forge is the editor, Supabase backend. Public sign-up/sign-in exists.

  ---
  Phase 1 — Personal Digital Ecosystem (mvsingh.in)

  Architecture Decision: Migrate to Next.js 14+ (App Router)

  Do this now, not in Phase 3. Reasons:
  - /:username SPA routing won't cleanly extend to /tech, /brand, /blogs without hacks
  - Portfolio/identity pages need SSR for SEO and social preview cards — critical for a digital identity product
  - App Router's file-based segments map 1:1 to your section concept
  - Subdomain routing (tech.mvsingh.in) is trivial via Next.js middleware
  - Phase 3 becomes a one-liner structural change (add [username] prefix)

  ---
  Folder Structure

  src/
    app/
      layout.tsx                    # Root layout (fonts, providers)
      page.tsx                      # / → 3D animated hub (links to all sections)

      tech/
        page.tsx                    # /tech → Tech portfolio (current Portfolio.tsx)
        layout.tsx

      brand/
        page.tsx                    # /brand → Brand page (new)
        layout.tsx

      (forge)/                      # Route group — auth-protected editors
        layout.tsx                  # Single auth guard for all editors
        tech/
          page.tsx                  # /forge/tech → Tech portfolio editor
        brand/
          page.tsx                  # /forge/brand → Brand editor

      admin/
        page.tsx                    # /admin → Login (username + password, no signup)
        dashboard/page.tsx
        users/page.tsx
        ...

    components/
      site/
        tech/                       # Move current site/ components here
        brand/                      # New brand components
        shared/                     # Navbar, Footer, PortfolioBackground
      forge/
        tech/                       # Move current forge/editor components here
        brand/
        shared/                     # Shared editor UI
      admin/
      ui/                           # Shadcn primitives — untouched

    lib/
      supabase.ts
      utils.ts

    hooks/
      useProfile.ts                 # Existing
      useBrand.ts                   # New

  Key Changes in Phase 1

  ┌──────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │   What   │                                                       How                                                        │
  ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Default  │ New 3D animated hub page (Three.js / Spline / Framer Motion) with cards linking to each section                  │
  │ /        │                                                                                                                  │
  ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ /tech    │ Current /:username Portfolio.tsx, now hardcoded to Manvir's profile                                              │
  ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ /brand   │ New section, built fresh                                                                                         │
  ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Auth     │ Remove public sign-up. Single admin credential via Supabase RLS or env-var secret. /forge routes are the editor, │
  │          │  protected by auth guard in (forge)/layout.tsx                                                                   │
  ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Domain   │ Deploy to Vercel, point mvsingh.in. Optional: middleware maps tech.mvsingh.in → /tech                            │
  ├──────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ DB       │ Keep profiles table for tech. Add brand_profile table. Drop multi-user sign-up flow from schema                  │
  └──────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ---
  Phase 2 — Extended Sections (blogs, lifestyle, etc.)
  
  No architectural changes. Adding a section is a repeatable pattern:

  1. app/[section]/page.tsx — display page
  2. app/(forge)/[section]/page.tsx — editor
  3. components/site/[section]/ — display components
  4. components/forge/[section]/ — editor components
  5. Supabase table or a unified sections table with type: "blogs" | "lifestyle" | ...

  Each section is fully self-contained. The hub at / automatically gets a new card.

  ---
  Phase 3 — Digital Ecosystem Platform (digitalavatar.ai) — Brief
  
  One structural change: add [username] as the root dynamic segment.

  app/
    [username]/
      page.tsx              # digitalavatar.ai/username — their hub
      tech/page.tsx
      brand/page.tsx
      blogs/page.tsx
      (forge)/
        layout.tsx          # Auth: user can only edit their own sections
        tech/page.tsx
        brand/page.tsx

  The mvsingh.in personal deployment stays as-is (username hardcoded or resolved via domain middleware). The platform at
  digitalavatar.ai simply wraps everything under [username].

  What gets added in Phase 3: public sign-up/onboarding, per-user RLS, billing (already partially built), username reservation, and
  the admin panel scales to manage N users instead of 1.

  ---
  Summary Recommendation

  ┌───────┬─────────────────────────────────┬───────────────────────────────────────────────────────────────┐
  │ Phase │            Framework            │                           Key Work                            │
  Each section is fully self-contained. The hub at / automatically gets a new card.

  ---
  Phase 3 — Digital Ecosystem Platform (digitalavatar.ai) — Brief

  One structural change: add [username] as the root dynamic segment.

  app/
    [username]/
      page.tsx              # digitalavatar.ai/username — their hub
      tech/page.tsx
      brand/page.tsx
      blogs/page.tsx
      (forge)/
        layout.tsx          # Auth: user can only edit their own sections
        tech/page.tsx
        brand/page.tsx

  The mvsingh.in personal deployment stays as-is (username hardcoded or resolved via domain middleware). The platform at
  digitalavatar.ai simply wraps everything under [username].

  What gets added in Phase 3: public sign-up/onboarding, per-user RLS, billing (already partially built), username reservation, and
  the admin panel scales to manage N users instead of 1.

  ---
  Summary Recommendation

  ┌───────┬─────────────────────────────────┬───────────────────────────────────────────────────────────────┐
  │ Phase │            Framework            │                           Key Work                            │
  ├───────┼─────────────────────────────────┼───────────────────────────────────────────────────────────────┤
  │ 1     │ Migrate to Next.js App Router   │ 3D hub, /tech, /brand, remove public auth, personal-only mode │
  ├───────┼─────────────────────────────────┼───────────────────────────────────────────────────────────────┤
  │ 2     │ Next.js (unchanged)             │ Add sections as new app segments — fully formulaic            │
  ├───────┼─────────────────────────────────┼───────────────────────────────────────────────────────────────┤
  │ 3     │ Next.js (add [username] prefix) │ Multi-tenant routing, public onboarding, per-user RLS         │
  └───────┴─────────────────────────────────┴───────────────────────────────────────────────────────────────┘

  The migration cost is front-loaded into Phase 1, but it eliminates all structural rework in Phases 2 and 3. Given the current
  codebase size, the migration is ~1–2 days of work.

  Want me to start implementing Phase 1, or adjust anything in the plan first?

---


## AI Website Creator Prompt — Default Hub Page (/) -- On Hold for checking draftly space

Build a minimalist 3D animated landing page for Mv Singh — a full-stack engineer and brand builder.

The page is a personal hub. It should feel like entering a space, not scrolling a resume. A single bold identity statement ("Mv Singh") anchors the center, surrounded by a subtle 3D environment — floating geometry, particle field, or abstract depth that reacts to cursor movement.

From that center, branching links or cards lead to each domain: Tech, Brand, Blogs, and any future sections. The navigation should feel spatial — cards or nodes that exist in the 3D scene rather than a flat list.

Tone: dark, premium, unhurried. No clutter. Typography-first. Motion should be smooth and purposeful, not decorative.

The page loads fast, works on mobile, and makes someone want to explore every section.



---

