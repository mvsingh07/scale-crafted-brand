# Post-launch checklist: `studio.mvsingh.in`

Run through this once DNS has propagated and Vercel shows the domain as valid (see [01-dns-and-domain-setup.md](01-dns-and-domain-setup.md)). Takes about 10 minutes.

## Basic reachability

- [ ] `https://studio.mvsingh.in` loads over HTTPS with no browser certificate warning
- [ ] `http://studio.mvsingh.in` (no `s`) redirects to `https://`
- [ ] Page shows the Studio content (hero: "Every business has a story. Most of it still lives offline.") — not the personal `mvsingh.in` hub

## Content

- [ ] All 8 chapters scroll in order: The Problem → The Shift → What We Build → The Transformation → How We Work → Who's Behind It → Choose Your Starting Point → The Next Chapter
- [ ] "What We Build" service cards load (they're fetched live from Supabase — if they don't appear, check the `ecosystem_services` table / Supabase connectivity, not this checklist)
- [ ] "Personal Site ↗" link in the nav and footer goes to `https://mvsingh.in`
- [ ] Contact form submits successfully and the message shows up in the `contact_submissions` Supabase table with `source = "studio"`

## Mobile

- [ ] Open on an actual phone (not just a resized desktop browser) — check the hamburger menu opens/closes and no section is clipped or overlapping
- [ ] No horizontal scrollbar on any chapter

## Cross-check with the personal site

- [ ] `https://mvsingh.in` still works exactly as before — the subdomain change shouldn't have touched it
- [ ] `https://mvsingh.in/studio` still works too (it's the same content, just also reachable at the apex-domain path — harmless to leave, but confirms nothing broke)

## If something's wrong

- **Wrong content / still showing personal site:** the DNS record may be pointing somewhere other than this Vercel project, or propagation hasn't fully finished — re-check Step 3 in the DNS guide.
- **Cards under "What We Build" never load:** check the Vercel deployment's environment variables include `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same ones the rest of the site already relies on).
- **Contact form fails:** check the Supabase `contact_submissions` table still exists and RLS policies allow inserts from the anon key (same setup the personal site's contact form already uses).

Once everything above is checked, mark `studio.mvsingh.in` as launched in `../execution_plan.md` (Open Questions → DNS/Vercel domain item).
