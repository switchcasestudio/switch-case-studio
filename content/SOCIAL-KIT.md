# Launch posts: brief for Beau (2026-09-25)

Moses asked for four blog posts about new studio products, published on a schedule, with social promotion through the SCS Social Engine to X, Instagram, Threads, Bluesky and the Facebook Page.

**The blog side is automatic.** A GitHub Action (`.github/workflows/scheduled-posts.yml`) publishes each file in `content/scheduled/` at **07:00 Pacific** on its date, through `scripts/add-post.mjs`, and pushes `main`. Netlify deploys a few minutes later. You do not write or publish these posts.

**Your part is the social promotion**, through the same route as Step 4b of your JOURNAL-QUEST: one promo packet per post, POSTed to the engine on the publish day. Nothing auto-posts; every packet lands in Moses's `/approve` flow.

## Schedule

| Publish date (PT) | Post URL | Promo packet |
|---|---|---|
| Tue 2026-09-29 | https://switchcasestudio.com/blog/unhurried-free-wordpress-theme | `content/promo/2026-09-29-unhurried-free-wordpress-theme.json` |
| Fri 2026-10-02 | https://switchcasestudio.com/blog/office-hours-and-free-student-hours | `content/promo/2026-10-02-office-hours-and-free-student-hours.json` |
| Tue 2026-10-06 | https://switchcasestudio.com/blog/selling-a-wordpress-theme-with-a-stripe-payment-link | `content/promo/2026-10-06-selling-a-wordpress-theme-with-a-stripe-payment-link.json` |
| When WordPress.org approves Unhurried | https://switchcasestudio.com/blog/unhurried-is-in-the-wordpress-theme-directory | `content/promo/held-unhurried-is-in-the-wordpress-theme-directory.json` |

## What to do

1. `git pull` the site repo so you have `content/`.
2. **Log the topics now** in `journal-topics-log.md` so your Thursday articles do not overlap them (cooldown = date + 6 months):
   - `2026-09-29 | T-20260929 | unhurried-free-wordpress-theme | Unhurried: A Free WordPress Theme for Businesses That Sell Care | 2027-03-29`
   - `2026-10-02 | T-20261002 | office-hours-and-free-student-hours | Office Hours With the Studio, and Free Hours for Students | 2027-04-02`
   - `2026-10-06 | T-20261006 | selling-a-wordpress-theme-with-a-stripe-payment-link | How We Sell a WordPress Theme With a Stripe Payment Link | 2027-04-06`
3. **On each publish date, at or after 09:00 PT:** confirm the post URL returns 200, then inject its packet:
   `curl -sS -X POST https://n8n.switchcasestudio.com/webhook/scs-generate -H 'Content-Type: application/json' -d @content/promo/<file>.json`
   Set up one-off crons for the three dates if that is easier. If the URL is not live yet, wait and retry; do not inject before the post exists.
4. If `pillar` "Studio News" is not one of the engine's pillars, change it to the closest valid one before injecting. You may sharpen the wording; keep every fact exactly as in "Facts you can use" below.
5. **The held post:** when Moses says Unhurried is approved on WordPress.org, move `content/held/wordpress-org-unhurried-approved.json` to `content/scheduled/<YYYY-MM-DD>-unhurried-is-in-the-wordpress-theme-directory.json` (the next day's date), set its `"date"` to that day, commit, push, and inject the held packet after it is live.
6. **Facebook:** added to the engine on 2026-09-25. Every packet (weekly and promo injects) now includes a Facebook Page post automatically: the IG caption body plus a clickable link to the article. Nothing extra to do.
7. Report each injection in the SCS Telegram group, and log it in the SCS WORKLOG.
8. **Git:** the scheduler pushes to `main` at 07:00 PT on those dates. Always `git pull --rebase` before your own Thursday push.

## Facts you can use (verified 2026-09-25)

- **Unhurried** is a free WordPress block theme by Switch Case Studio. Download: https://github.com/switchcasestudio/unhurried/releases/latest/download/unhurried.zip . Submitted to WordPress.org (review pending, ticket 292908). Do not say it is "in the directory" until Moses confirms approval.
- **Unhurried Pro** costs **$49, one payment**: https://switchcasestudio.com/unhurried-pro/ . Adds WooCommerce shop, product, cart and checkout pages, a Coming soon page, a Shop shelf pattern and a lead-story blog layout. Installs on top of the free theme.
- **Office hour**: **$95**, one hour, one to one, over Google Meet, on SEO, design, code or WordPress. Pay first, then book. A recap follows by email.
- **Student hour**: **free**, Wednesday and Friday, 18:00 to 19:00 Pacific time. Students give their school or course and their question when booking.
- Everything is listed at https://switchcasestudio.com/shop .
- Byline and name: **Moses Atia Poston**, Founder.
- Do not invent numbers (downloads, sales, bookings, reviews). There are none to report yet.

## Images (all public)

- Unhurried: https://switchcasestudio.com/unhurried-pro/img/hero.webp (landscape), https://switchcasestudio.com/social/unhurried-portrait.jpg (4:5)
- Office hours: https://switchcasestudio.com/social/office-hours-og.jpg (landscape), https://switchcasestudio.com/social/office-hours-portrait.jpg (4:5)
- Selling a theme: https://switchcasestudio.com/social/selling-a-theme-og.jpg , https://switchcasestudio.com/social/selling-a-theme-portrait.jpg
- Search Console post: https://switchcasestudio.com/images/journal/how-to-read-google-search-console-without-chasing-noise.jpg (landscape), https://switchcasestudio.com/social/search-console-portrait.jpg (4:5)
- WordPress.org post: https://switchcasestudio.com/unhurried-pro/img/og.jpg
