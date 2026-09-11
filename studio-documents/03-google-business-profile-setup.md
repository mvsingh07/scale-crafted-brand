# Google Business Profile — Eligibility & Setup

Manual, account-level task (needs a Google account, not code). Read the eligibility section before creating anything — creating a listing that doesn't actually qualify risks suspension, and a suspended profile is harder to recover than one never created.

## Eligibility — read this first

Google's Business Profile guidelines exclude **businesses that only serve customers virtually and have no staffed physical location and never meet customers in person**. This is a real, current policy (tightened in 2021 specifically to stop web/marketing agencies from gaming local search rankings without a genuine local presence) — not a formality to work around.

MVSingh Studio today is a solo, remote-first practice with no office (Decision #8: no registered company, no address to list). Whether it qualifies depends on one fact only the founder can confirm:

- **If client work sometimes happens in person** (traveling to a Punjab business's premises to onboard them, do discovery, hand off a system, etc.) → the Studio qualifies as a **Service-Area Business (SAB)**. SABs don't display a public address — you hide it and instead list the areas you serve (e.g. specific Punjab districts/cities).
- **If all client work is 100% remote** (calls, screen-shares, async delivery, no in-person contact ever) → **the Studio does not currently qualify**, per Google's own stated policy. Creating a listing anyway risks it being flagged and suspended, which can also complicate creating a legitimate one later under the same name/phone number.

**Recommendation**: don't create the listing until this is confirmed. If the founder is open to occasional in-person meetings with local clients (even rarely), that's enough to legitimately qualify as an SAB — worth doing, since local search visibility is genuinely valuable for Punjab-based clients. If the practice will stay fully remote, skip GBP for now; revisit once there's a registered office (Phase 3) or the founder's plans change. This is recorded as an open decision in `execution_plan.md` rather than assumed either way.

## Setup steps (only once eligibility above is confirmed as "yes, SAB")

1. Go to [google.com/business](https://www.google.com/business/) and sign in with the account that should own the listing (recommend a dedicated Google account for the business, not a personal Gmail, so access can be shared/transferred later without handing over personal email access).
2. **Business name**: `MVSingh Studio` — matches the site's branding exactly. Don't add unregistered suffixes like "LLC," "Pvt Ltd," or a trademark symbol (Decision #8).
3. **Category**: primary category something close to "Website designer" or "Software company" — pick whichever Google's autocomplete offers that's closest; secondary categories can add "Web design," "Internet marketing service," etc. as they fit.
4. When asked "Do you want to add a location customers can visit?" → **No**. This triggers the Service-Area Business flow and hides the address field entirely — don't skip this step or enter a home address publicly.
5. **Service area**: list Punjab districts/cities actually served, not an invented national radius. Keep it honest and specific (matches the site's own "Punjab → India → Beyond" framing — expand the listed area only as the business actually reaches further).
6. **Phone number**: a number that's actually answered — a listing with an unanswered number is worse than no listing.
7. **Website**: `https://studio.mvsingh.in` (once DNS is live — see [01-dns-and-domain-setup.md](01-dns-and-domain-setup.md)). Don't submit this step until the subdomain actually resolves.
8. **Verification**: Google will offer phone/email/video verification for SABs without a mailing address (postcard verification isn't available without an address). Follow whichever option Google presents — this varies by account and can't be predicted here.
9. Once verified, fill in business hours (or mark "by appointment"), a short business description (reuse the site's own description — don't write new claims), and add a few real photos (a workspace photo, a screenshot of actual work — not stock imagery).

## What not to do

- Don't list a home address publicly, even if Google allows entering one.
- Don't invent a founding date, employee count, or reviews.
- Don't select "storefront" categories that imply walk-in retail.
- Don't create the listing at all if the honest answer to the eligibility question above is "fully remote, no in-person contact."

## Status

- `[?]` Eligibility path (SAB vs. skip) — **needs the founder's answer**, tracked as an open question in `execution_plan.md`.
- `[ ]` Listing created (only after the above is resolved and DNS/domain setup is complete)
- `[ ]` Verified
- `[ ]` Profile filled in (hours, description, photos)
