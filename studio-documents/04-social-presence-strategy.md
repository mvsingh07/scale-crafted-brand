# Social Presence Strategy

Manual, account-level task (creating/configuring accounts, not code). Covers brief #21: Instagram identity, plus a platform shortlist.

## Username — evaluated, not assumed available

Checked all three of the brief's suggested handles via web search for an existing indexed account. **None turned up an existing account** for any of the three — but Instagram blocks unauthenticated profile scraping (it serves a JS shell to non-browser requests), so this is "no evidence found," not a guaranteed-available confirmation. A private or low-activity account can exist without being indexed. **Before finalizing, do the 10-second real check**: try each as a new username in the Instagram app's signup/username-change field — it tells you instantly if one's taken.

| Handle | Search result | Read |
|---|---|---|
| `@mvsingh.studio` | No existing account found | **Recommended** — matches the business name used everywhere else (domain `studio.mvsingh.in`, site title, JSON-LD `name`). Strongest recognition/consistency. |
| `@mvsingh.builds` | No existing account found | Strong alternate — reads more personal/behind-the-scenes if you want the account voice to feel less "corporate Studio" and more "founder building in public." |
| `@mvsingh.digital` | No existing account found | Workable third option; weaker than the other two since "digital" doesn't appear elsewhere in the brand's own vocabulary. |

**Recommendation**: `@mvsingh.studio` as primary. It's founder-led in voice regardless of handle — the brief's "not a large anonymous agency" concern is about content and tone, not the exact username.

## Account setup

- **Display name**: `MVSingh Studio` (searchable field — keep it exactly matching the brand name used elsewhere, not a longer tagline; taglines belong in the bio).
- **Bio** (plain language, no invented numbers or claims):
  ```
  Digitalizing Punjab businesses for the AI era
  Websites · Systems · Automation
  Built & run by Manvir Singh (MV Singh)
  ```
- **Profile photo**: a real photo of the founder is worth more trust than a logo mark at this stage — "founder-led" per the brief is a real credibility signal, and there's no team/office to photograph instead. If a founder photo isn't ready, fall back to a simple square crop of the existing gold-on-black mark (`public/dark_mode_logo.png` or a new crop of it) rather than inventing new brand art. Your call — both are legitimate, no photo exists to use without your involvement either way.
- **Account type**: Professional account → **Business** (not Creator — this is a commercial service, and Business unlocks the Contact button and category label).
- **Category**: "Website designer" — same category recommended for Google Business Profile (`03-google-business-profile-setup.md`) for consistency across platforms.
- **Contact button**: email (`hello@mvsingh.in`) or WhatsApp if you're set up to actually answer it there — don't add a contact channel you won't monitor.
- **Link**: single link to `https://studio.mvsingh.in` (once DNS is live). A link-in-bio tool (Linktree, etc.) is unnecessary overhead with one link and one goal — add one later only if you're juggling several links at once.
- **Highlights**: don't pre-build empty highlight categories before there's content to put in them. Start posting, then group the first handful of posts into 1–2 highlights once a natural theme shows up (e.g. "Services" once you've posted about what you build).

## Content pillars — narrowed from the brief's list

The brief lists ten possible pillars. Starting all ten at once produces thin, inconsistent content. Pick a focused subset and let it grow:

1. **What I Build** — real work, real screenshots, real process (not stock imagery).
2. **Business Digitalization** — the actual problem this Studio solves, explained plainly (mirrors the "Problem" chapter already written on the Studio site — reuse that thinking, don't invent new claims).
3. **Behind the Scenes** — the founder actually building, day-to-day. This is the cheapest content to produce and the strongest "founder-led, not a faceless agency" signal.
4. **Punjab/India Digital Transformation** — local relevance, ties to the site's own "Punjab → India → Beyond" framing.
5. **Lessons from Building** — technical/business lessons, positions credibility (matches the Experience section's "4 years, direct hands-on work" framing — don't overstate it here either).

Held back for later, once there's real client work to show: **Case Studies** (blocked on Milestone 6 — no invented results) and **Products being developed** (blocked on Phase 4 — nothing exists yet).

## Launch content (first 5 posts, in order)

1. Founder introduction — who, why this exists, what problem it solves.
2. "Why I started this" — the actual motivation (Studio's own "Shift" narrative already written works well here).
3. One real skill/process breakdown — something genuinely useful, not a sales pitch.
4. A short walkthrough of the Studio site itself once it's live (dogfooding — "here's what I just built for this").
5. A direct invite — "DM me" / "link in bio" — first explicit call-to-action, after four posts of actually giving value.

## Platform shortlist

| Platform | Recommendation | Why |
|---|---|---|
| **Instagram** | Build now | Brief-mandated, and the right primary channel for visual, founder-led content. |
| **LinkedIn** | Use the founder's existing personal profile — don't create a separate Studio Company Page yet | A new, empty Company Page starts with zero audience and needs separate upkeep. Manvir's personal LinkedIn (already listed in the site's own Person JSON-LD) reaches the actual audience — other professionals and business decision-makers — faster. Revisit a dedicated Page once there's enough Studio-specific volume to justify splitting the audience (Phase 2+). |
| **Facebook Page** | Worth creating alongside Instagram | Meta lets you cross-post Instagram content to a linked Facebook Page with near-zero extra effort, and Punjab/India small-business owners — the actual client base — skew toward Facebook more than the founder-content platforms below. Low cost, real audience overlap. |
| **YouTube** | Not now | High production effort for uncertain return before there's a content rhythm elsewhere; revisit once Instagram/Facebook posting is consistent and there's a specific format (e.g. build breakdowns) that genuinely wants video. |
| **X (Twitter)** | Not now | Weak overlap with the actual target audience (local Punjab SMB owners); skip unless the founder has a personal reason to be there already. |

## Status

- `[ ]` Username finalized and account created (do the in-app availability check first)
- `[ ]` Profile fields set (name, bio, photo, category, contact, link)
- `[ ]` Facebook Page created and linked
- `[ ]` First 5 launch posts published
