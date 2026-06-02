# Phase 1 — Personal Digital Ecosystem (mvsingh.in)

Last updated: 2026-05-31 (rev 3)

| # | Task | Area | Status | Notes |
|---|------|------|--------|-------|
| **SETUP** |
| 1 | Migrate from Vite + React SPA to Next.js 14 App Router | Infra | `[x] Done` | In-place migration; Vite removed, Next.js 15 installed |
| 2 | Move Tailwind, Shadcn, Framer Motion config to Next.js | Infra | `[x] Done` | postcss.config.js converted to CJS; tailwind content paths preserved |
| 3 | Migrate Supabase client (`src/lib/supabase.ts`) to Next.js-compatible setup | Infra | `[x] Done` | VITE_ env vars → NEXT_PUBLIC_; @supabase/ssr added |
| 4 | Set up environment variables (`.env.local`) and Vercel project for mvsingh.in | Infra | `[x] Done` | `.env.local` created; Vercel project setup pending |
| **ROUTING** |
| 5 | Create `app/layout.tsx` — root layout with providers (QueryClient, Toaster, etc.) | Routing | `[x] Done` | `src/app/layout.tsx` + `src/app/providers.tsx` |
| 6 | Create `app/tech/page.tsx` — move current `Portfolio.tsx` here (hardcoded to Manvir's profile) | Routing | `[x] Done` | Uses `NEXT_PUBLIC_OWNER_USERNAME` env var |
| 7 | Create `app/brand/page.tsx` — placeholder brand page | Routing | `[x] Done` | Placeholder with "coming soon" UI |
| 8 | Create `app/forge/layout.tsx` — auth guard for all editors | Routing | `[x] Done` | Client-side session check; redirects to /admin |
| 9 | Create `app/forge/tech/page.tsx` — move current Forge dashboard/editor here | Routing | `[x] Done` | Dashboard + edit + queries sub-routes |
| 10 | Create `app/forge/brand/page.tsx` — placeholder brand editor | Routing | `[x] Done` | Placeholder |
| 11 | Create `app/admin/page.tsx` and sub-routes — move current admin pages | Routing | `[x] Done` | All 5 admin sub-pages wired up |
| 12 | Retire old `/:username`, `/forge`, `/` (Landing) SPA routes after migration (keep files, update routing only) | Routing | `[x] Done` | `src/views/` (renamed from pages); `App.tsx` stubbed |
| **AUTH** |
| 13 | Disable public sign-up and sign-in pages via Next.js middleware (do NOT delete them) | Auth | `[x] Done` | `src/middleware.ts` blocks `/forge/login`, `/forge/signup` → redirects to `/` |
| 14 | Implement single-user admin login (username + password via Supabase Auth) | Auth | `[x] Done` | Email + password login at `/admin`; no sign-up exposed |
| 15 | Update Supabase RLS policies — restrict writes to authenticated user only | Auth | `[ ] Todo` | Reads remain public for portfolio display |
| **DEFAULT PAGE** |
| 16 | Create `app/page.tsx` — 3D animated hub page | UI | `[x] Done` | 3-screen hub: portal animation → existence counters → hero with morphing text |
| 17 | Design hub cards/navigation for each section (Tech, Brand) | UI | `[x] Done` | Screen 3 nav bar + word-reveal hero + dot state indicators |
| 17a | Add `Ctrl+Shift+L` keyboard shortcut on default hub page (`/`) to open admin sign-in | Auth/UI | `[x] Done` | `useEffect` keydown listener on hub page only |
| **BRAND PAGE** |
| 18 | Define brand page content scope and data schema | Brand | `[ ] Todo` | Decide what goes on the brand page |
| 19 | Create `brand_profile` Supabase table and types | Brand | `[ ] Todo` | |
| 20 | Build brand display components under `components/site/brand/` | Brand | `[ ] Todo` | |
| 21 | Build brand editor under `components/forge/brand/` | Brand | `[ ] Todo` | |
| **COMPONENT REORGANISATION** |
| 22 | Move `components/site/` → `components/site/tech/` | Refactor | `[ ] Todo` | Keep shared (Navbar, Footer) in `site/shared/` |
| 23 | Move `components/forge/` → `components/forge/tech/` | Refactor | `[ ] Todo` | |
| **DOMAIN & DEPLOYMENT** |
| 24 | Deploy to Vercel, connect mvsingh.in domain | Deploy | `[ ] Todo` | |
| 25 | (Optional) Add Next.js middleware for subdomain routing (`tech.mvsingh.in → /tech`) | Deploy | `[ ] Todo` | Can defer to Phase 2 |
| **QA** |
| 26 | Verify tech portfolio renders correctly at `/tech` (all sections, themes, fonts) | QA | `[ ] Todo` | Regression check against current live |
| 27 | Verify forge editor saves/loads correctly at `/forge/tech` | QA | `[ ] Todo` | |
| 28 | Verify admin panel works at `/admin` | QA | `[ ] Todo` | |
| 29 | Verify default hub page loads and links route correctly | QA | `[ ] Todo` | |
| 30 | Mobile responsiveness check across all new pages | QA | `[ ] Todo` | |

---

### Status Key
| Symbol | Meaning |
|--------|---------|
| `[ ] Todo` | Not started |
| `[~] In Progress` | Active |
| `[x] Done` | Complete |
| `[!] Blocked` | Blocked — see notes |
| `[-] Skipped` | Deferred or dropped |
