# Studio Documents

Manual, human-only actions needed to take `studio.mvsingh.in` live and keep it running — the parts of this project that require account access (DNS registrar, Vercel dashboard, Google) rather than code changes. Code-side work stays tracked in [`../execution_plan.md`](../execution_plan.md); this folder is only for the steps a person has to click through.

## What's here

1. **[01-dns-and-domain-setup.md](01-dns-and-domain-setup.md)** — the one guide you need right now. Adds `studio.mvsingh.in` in Vercel and points DNS at it. Everything else is blocked until this is done.
2. **[02-post-launch-checklist.md](02-post-launch-checklist.md)** — run through this once the subdomain resolves, before calling it "live."
3. **[03-google-business-profile-setup.md](03-google-business-profile-setup.md)** — read the eligibility section first. A fully-remote practice with no in-person client contact does not currently qualify for a Google Business Profile under Google's own policy; this needs the founder's answer before anything is created.
4. **[04-social-presence-strategy.md](04-social-presence-strategy.md)** — Instagram handle/bio/setup recommendation, narrowed content pillars, launch post sequence, and a platform shortlist (Instagram + Facebook now, LinkedIn via the founder's existing personal profile, YouTube/X deferred).

## Current status

- [ ] `studio.mvsingh.in` added to the Vercel project
- [ ] DNS record created at the registrar
- [ ] DNS propagated and SSL certificate issued
- [ ] Post-launch checklist passed
- `[?]` Google Business Profile eligibility (SAB with in-person contact vs. fully remote) — founder's call, see doc 03
- [ ] Instagram account created and launch posts published — see doc 04

Update the checkboxes here as each step is done — this is the quick-glance status; the guides below have the actual instructions.

## Where the page content lives (for reference)

- The Studio page itself is code: `src/app/studio/page.tsx` and `src/components/studio/*`. Editing hero copy, the problem list, the approach steps, plan names, etc. means editing those files directly — none of it is wired to the `/forge` CMS yet.
- The **service cards** ("What We Build") are the one part that *is* CMS-driven — they're pulled live from the `ecosystem_services` Supabase table, the same data editable at `/forge/services`.
