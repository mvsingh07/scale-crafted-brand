# Going live: `studio.mvsingh.in`

**Who can do this:** only someone with access to (a) the Vercel account this project is deployed under, and (b) the DNS settings for the `mvsingh.in` domain (registrar or DNS provider login). Neither of these is something that can be done from the codebase — this is the one manual gate blocking the Studio site from being publicly reachable.

**Time:** 5–10 minutes of clicking, plus 5 minutes to a few hours of waiting for DNS to propagate (usually much faster in practice).

The app already handles the routing on the code side — `src/proxy.ts` rewrites any request that arrives with `Host: studio.mvsingh.in` to the Studio page. You can already preview the page today at `https://mvsingh.in/studio` (or your Vercel preview URL) — that content is what will appear once the subdomain resolves. This guide is purely about making `studio.mvsingh.in` point at that same deployment.

---

## Step 1 — Add the domain in Vercel

1. Log in to [vercel.com](https://vercel.com) and open the project this repo deploys to (the one connected to the `mvsingh07/scale-crafted-brand` GitHub repo).
2. Go to **Settings → Domains**.
3. In the "Add" field, type `studio.mvsingh.in` and click **Add**.
4. Vercel will show a status like "Invalid Configuration" with a **DNS record it wants you to create** — usually one of:
   - A **CNAME** record: `studio` → `cname.vercel-dns.com`
   - Or, less commonly, an **A** record pointing at a Vercel IP.

   Leave this Vercel tab open — you'll need the exact value it shows you in Step 2. (Vercel sometimes shows a slightly different target per account, so use what your dashboard actually displays, not just the example above.)

## Step 2 — Add the DNS record at your registrar/DNS provider

Where `mvsingh.in`'s DNS is managed depends on where the domain was purchased/configured. If you're not sure which of these applies, check the "Nameservers" section of your domain registrar's dashboard for the domain.

### If DNS is managed at your domain registrar directly (GoDaddy, Namecheap, etc.)

1. Log in to the registrar and find **DNS Management** / **DNS Settings** for `mvsingh.in`.
2. Add a new record:
   - **Type:** `CNAME`
   - **Host / Name:** `studio`
   - **Value / Points to:** the target Vercel showed you (e.g. `cname.vercel-dns.com`)
   - **TTL:** leave default, or set to 1 hour if asked
3. Save.

### If DNS is managed through Cloudflare

1. Log in to Cloudflare, select the `mvsingh.in` zone.
2. Go to **DNS → Records → Add record**.
3. Type: `CNAME`, Name: `studio`, Target: the value Vercel gave you.
4. **Important:** set the proxy status to **DNS only** (grey cloud, not orange) for this record. If Cloudflare proxies it (orange cloud), Vercel's SSL certificate issuance can fail or behave inconsistently.
5. Save.

### If DNS is managed somewhere else entirely

The pattern is always the same regardless of provider: create a `CNAME` record where the **name/host is `studio`** and the **value is whatever Vercel's Domains page told you to point it at**. If your provider only supports an A record for subdomains, use the A record Vercel's dashboard offers instead of the CNAME.

## Step 3 — Wait for propagation and verification

1. Go back to the Vercel Domains tab and click **Refresh** (or reload the page) after a few minutes.
2. Vercel will show a green "Valid Configuration" once it detects the DNS record, and will automatically issue an SSL certificate (Let's Encrypt) shortly after — no separate action needed for HTTPS.
3. DNS propagation is usually fast (minutes), but can occasionally take a few hours depending on the provider and your ISP's DNS caching. If it's still failing after an hour, double check:
   - The record's **Name/Host** is exactly `studio` (not `studio.mvsingh.in` — some providers auto-append the domain, others need the full name; follow whatever your provider's other subdomain records already look like).
   - There isn't a conflicting existing record for `studio.mvsingh.in` (e.g. an old A record) — delete it if so.

## Step 4 — Confirm it's live

Once Vercel shows the domain as valid:

```
curl -sI https://studio.mvsingh.in/
```

should return a `200` (or a redirect Next.js issues, e.g. for trailing slashes) rather than a DNS or SSL error. Visiting `https://studio.mvsingh.in` in a browser should show the same page currently live at `https://mvsingh.in/studio`.

Then go through **[02-post-launch-checklist.md](02-post-launch-checklist.md)** before treating it as fully live.

---

## Notes / things this does *not* do yet

- **`robots.txt` and `sitemap.xml`** are currently written for `mvsingh.in` only — the Studio subdomain doesn't have its own yet. That's tracked as Milestone 3 (SEO & GEO) in `../execution_plan.md`, not part of this DNS step.
- **Google Search Console / Google Business Profile** for the Studio subdomain are separate, later manual tasks (Milestone 3 and 4) — not needed to simply make the page reachable.
- This only wires up `studio.mvsingh.in`. It does not touch `mvsingh.in` (the personal site), which keeps working exactly as it does today.
