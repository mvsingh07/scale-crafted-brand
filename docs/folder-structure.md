# Folder Structure — All Phases
### mvsingh.in → digitalavatar.ai

---

## Current State

> Next.js App Router in place. `views/` and `app/` co-exist. `components/site/` is flat.

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                        ← / (hub placeholder)
│   ├── not-found.tsx
│   ├── providers.tsx
│   ├── tech/
│   │   ├── layout.tsx
│   │   └── page.tsx                    ← /tech
│   ├── brand/
│   │   └── page.tsx                    ← /brand (stub)
│   ├── forge/
│   │   ├── layout.tsx                  ← auth guard
│   │   ├── login/page.tsx
│   │   ├── tech/
│   │   │   ├── page.tsx                ← /forge/tech
│   │   │   ├── edit/page.tsx
│   │   │   └── queries/page.tsx
│   │   └── brand/
│   │       └── page.tsx                ← /forge/brand (stub)
│   └── admin/
│       ├── page.tsx                    ← /admin login
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── payment-config/page.tsx
│       ├── revenue/page.tsx
│       └── transactions/page.tsx
│
├── components/
│   ├── site/                           ← flat, all tech components together
│   │   ├── Hero.tsx
│   │   ├── HeroVisionFrame.tsx
│   │   ├── About.tsx
│   │   ├── About3DCard.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Journey.tsx
│   │   ├── Navbar.tsx
│   │   ├── Personal.tsx
│   │   ├── PortfolioBackground.tsx
│   │   ├── PrismaticBurst.tsx
│   │   ├── Projects.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Services.tsx
│   │   ├── Skills.tsx
│   │   └── ThemeToggle.tsx
│   ├── ui/                             ← shadcn primitives + custom atoms
│   │   ├── gooey-text-morphing.tsx
│   │   ├── spline-scene.tsx
│   │   ├── spotlight.tsx
│   │   ├── CardSwap.tsx
│   │   └── ... (all shadcn)
│   ├── AdminGuard.tsx
│   ├── AdminOnlyGuard.tsx
│   └── NavLink.tsx
│
├── views/                              ← legacy wrappers (removed in Phase 1)
│   ├── forge/
│   │   ├── Dashboard.tsx
│   │   ├── EditProfile.tsx
│   │   ├── Login.tsx
│   │   ├── Queries.tsx
│   │   └── Upgrade.tsx
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── PaymentConfig.tsx
│   │   ├── Revenue.tsx
│   │   ├── Transactions.tsx
│   │   └── Users.tsx
│   ├── Portfolio.tsx
│   ├── Landing.tsx
│   └── ...
│
├── hooks/
│   ├── useProfile.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/
│   ├── supabase.ts
│   └── utils.ts
│
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
│
├── middleware.ts
├── index.css
└── assets/
    ├── engineer-architecture.jpg
    ├── engineer-keyboard.jpg
    └── engineer-working.jpg
```

---

## Phase 1 — Personal Digital Ecosystem (mvsingh.in)

> Remove `views/`. Convert `forge/` → `(forge)/` route group. Split `components/site/` by section. Build the 3D hub page at `/`.

```
src/
├── app/
│   ├── layout.tsx                      ← fonts (Cinzel, Inter), providers
│   ├── page.tsx                        ← / → 3D hub (Portal → Counters → Hero)
│   ├── not-found.tsx
│   ├── providers.tsx
│   │
│   ├── tech/
│   │   ├── layout.tsx
│   │   └── page.tsx                    ← /tech
│   │
│   ├── brand/
│   │   ├── layout.tsx
│   │   └── page.tsx                    ← /brand
│   │
│   ├── (forge)/                        ← route group, no URL segment
│   │   ├── layout.tsx                  ← single auth guard for all editors
│   │   ├── tech/
│   │   │   ├── page.tsx                ← /forge/tech
│   │   │   ├── edit/page.tsx
│   │   │   └── queries/page.tsx
│   │   └── brand/
│   │       └── page.tsx                ← /forge/brand
│   │
│   └── admin/
│       ├── page.tsx                    ← /admin (no public sign-up)
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── payment-config/page.tsx
│       ├── revenue/page.tsx
│       └── transactions/page.tsx
│
├── components/
│   ├── site/
│   │   ├── shared/                     ← across all sections
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PortfolioBackground.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── tech/                       ← tech portfolio display
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroVisionFrame.tsx
│   │   │   ├── About.tsx
│   │   │   ├── About3DCard.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Journey.tsx
│   │   │   ├── Personal.tsx
│   │   │   ├── PrismaticBurst.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Services.tsx
│   │   │   └── Skills.tsx
│   │   ├── brand/                      ← brand page display (new)
│   │   │   ├── BrandHero.tsx
│   │   │   ├── BrandServices.tsx
│   │   │   └── BrandContact.tsx
│   │   └── hub/                        ← / hub page components (new)
│   │       ├── PortalEntry.tsx         ← Screen 1: portal open animation
│   │       ├── ExistenceCounters.tsx   ← Screen 2: live age + digital-world counters
│   │       └── HeroSlider.tsx          ← Screen 3: Apple word-reveal, click-to-advance
│   │
│   ├── forge/
│   │   ├── shared/
│   │   │   └── ForgeNavbar.tsx
│   │   ├── tech/                       ← moved from views/forge/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EditProfile.tsx
│   │   │   ├── Queries.tsx
│   │   │   └── Upgrade.tsx
│   │   └── brand/                      ← new
│   │       └── BrandEditor.tsx
│   │
│   ├── admin/                          ← moved from views/admin/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── PaymentConfig.tsx
│   │   ├── Revenue.tsx
│   │   ├── Transactions.tsx
│   │   └── Users.tsx
│   │
│   └── ui/                             ← shadcn primitives, untouched
│       ├── gooey-text-morphing.tsx
│       ├── spline-scene.tsx
│       ├── spotlight.tsx
│       ├── CardSwap.tsx
│       └── ... (all shadcn)
│
├── hooks/
│   ├── useProfile.ts
│   ├── useBrand.ts                     ← new
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/
│   ├── supabase.ts
│   └── utils.ts
│
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
│
├── middleware.ts
├── index.css
└── assets/
```

**DB changes**

| Action | Detail |
|--------|--------|
| Keep | `profiles` table (tech portfolio data) |
| Add | `brand_profile` table |
| Remove | Public sign-up from schema / RLS |
| Auth | Single admin credential via env-var or Supabase service role |

---

## Phase 2 — Extended Sections (blogs, lifestyle, …)

> No structural changes to Phase 1. Adding a section is a repeatable 4-file pattern. The hub at `/` gains a new card automatically.

**Pattern — adding `blogs` as an example:**

```
src/
├── app/
│   ├── blogs/
│   │   ├── layout.tsx
│   │   └── page.tsx                    ← /blogs
│   └── (forge)/
│       └── blogs/
│           └── page.tsx                ← /forge/blogs
│
└── components/
    ├── site/
    │   ├── blogs/
    │   │   ├── BlogsList.tsx
    │   │   └── BlogPost.tsx
    │   └── hub/
    │       └── HeroSlider.tsx          ← add Blogs card here
    └── forge/
        └── blogs/
            └── BlogsEditor.tsx
```

**DB:** Add a `blogs` table — or extend a unified `sections` table with `type: "blogs" | "lifestyle" | ...`

Repeat identically for every future section.

---

## Phase 3 — Digital Ecosystem Platform (digitalavatar.ai)

> One structural change: wrap everything under `[username]/`. `mvsingh.in` stays as-is — middleware maps the domain to `/manvir`. `digitalavatar.ai/manvir` hits the same tree.

```
src/
├── app/
│   ├── [username]/                     ← root dynamic segment
│   │   ├── layout.tsx                  ← resolve username, pass to children
│   │   ├── page.tsx                    ← /username → personalised hub
│   │   ├── tech/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                ← /username/tech
│   │   ├── brand/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                ← /username/brand
│   │   ├── blogs/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                ← /username/blogs
│   │   └── (forge)/
│   │       ├── layout.tsx              ← auth: user edits own sections only
│   │       ├── tech/page.tsx           ← /username/forge/tech
│   │       ├── brand/page.tsx
│   │       └── blogs/page.tsx
│   │
│   └── admin/                          ← platform-level, outside [username]
│       ├── page.tsx
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── payment-config/page.tsx
│       ├── revenue/page.tsx
│       └── transactions/page.tsx
│
├── components/                         ← identical structure to Phase 2
│   ├── site/
│   │   ├── shared/
│   │   ├── tech/
│   │   ├── brand/
│   │   ├── blogs/
│   │   └── hub/
│   ├── forge/
│   │   ├── shared/
│   │   ├── tech/
│   │   ├── brand/
│   │   └── blogs/
│   ├── admin/
│   └── ui/
│
├── hooks/
│   ├── useProfile.ts
│   ├── useBrand.ts
│   ├── useUsername.ts                  ← new: resolves from params or domain
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/
│   ├── supabase.ts
│   └── utils.ts
│
├── integrations/
│   └── supabase/
│       ├── client.ts
│       └── types.ts
│
├── middleware.ts                       ← mvsingh.in → /manvir
│                                          tech.mvsingh.in → /manvir/tech
├── index.css
└── assets/
```

**Added in Phase 3**

| Area | Detail |
|------|--------|
| Auth | Public sign-up / onboarding flow |
| DB | Per-user RLS on all tables |
| Users | Username reservation |
| Billing | Wire up existing billing (partially built) |
| Admin | Manages N users instead of 1 |
| Routing | Domain middleware (`mvsingh.in` → `/manvir`) |
