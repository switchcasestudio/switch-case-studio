# Switch Case Studio — running audit + work log (`.audit/summary.md`)

Oldest first; dated `###` entries newest at the BOTTOM. Current state lives in `STATUS.md` (read that first); user-facing changes in `CHANGELOG.md`; rules in `.audit/rules.md`; tickets in `.audit/open-tickets.md`.
Entries from 2026-05 to 2026-10-09 (phases 1–4, design refresh, repositioning, case studies, home/services rebuild, SEO audit fixes 1–14) were moved verbatim to `.audit/history/summary-2026-05-to-2026-10-09.md` on 2026-10-27. Index of the archived sections (grep the heading there):

- PHASE 1 — DISCOVERY ✅ COMPLETE
- PHASE 2 — DIAGNOSIS ✅ COMPLETE
- PHASE 3 — RECOMMENDATIONS ✅ COMPLETE (see chat)
- PHASE 4 — 7-DAY EXECUTION PLAN
- STATUS
- DAY 1 CHANGES — SHIPPED ✅
- BOILERPLATES NEEDING MOSES INPUT
- DAY 2 CHANGES — SHIPPED ✅
- BOILERPLATES NEEDING MOSES INPUT (before Matt pitch)
- DAY 3 CHANGES — SHIPPED ✅
- DAY 6 CHANGES — SHIPPED ✅
- SSG MIGRATION ✅ SHIPPED TO PRODUCTION 2026-06-04 — vite-react-ssg, work order `~/Downloads/CC-handoff-ssg-migration.md`
- FONT SELF-HOST ✅ COMPLETE — SHIPPED TO PRODUCTION 2026-06-04 — branch `perf/self-host-fonts`, merged `main` @ `f61db28`
- JS CRITICAL PATH — WAVE 1 BUILT, **UNMERGED** (branch `perf/js-critical-path` @ `cf44341`), STOP-CONDITION TRIGGERED 2026-06-04
- PAGE-FADE LCP FIX ✅ SHIPPED TO PRODUCTION — branch `perf/js-critical-path` lineage, merged `main` @ `45558bc`
- FONT CRITICAL PATH ✅ SHIPPED TO PRODUCTION 2026-06-08 — branch `perf/font-critical-path`, merged `main` @ `d2559ba`
- NEXT SESSION ENTRY POINT (updated 2026-06-03)
- Legacy cleanup (2026-06-10) ✅ MERGED TO MAIN 2026-06-15 (`e14760a`, `--no-ff`)
- README refresh 2026-06-15
- Accepted dependency residuals 2026-06-15
- security.txt added 2026-06-17
- Stack fact (kills the CRA assumption) 2026-07-03
- Design refresh — Phase 1 audit 2026-07-03 (branch `design-audit-refresh`)
- Design refresh — P0s shipped 2026-07-03 (027c9df hero, a5d0845 contact)
- Visual-elevation pass 2026-07-03 (branch `design-audit-refresh`) ✅ BUILT, verify gate open
- Mobile empty-page fix + tap feedback 2026-07-05 (branch `design-audit-refresh`)
- Legacy cleanup Phase 0 + Phase 1 Batch 1 — 2026-07-21 (branch `fix/dependency-correctness`, UNPUSHED)
- Contact section relayout 2026-07-05 (branch `design-audit-refresh`, `0c5929b`)
- Branch consolidation 2026-07-28 — repo is single-branch (`main` @ `f623d50`)
- Footer socials + wordmark hover + cursor morph — 2026-07-29 (branch `feat/footer-socials-wordmark-cursor`)
- AI-first repositioning — 2026-08-01 (branch `feat/ai-first-repositioning`)
- GA4 "No data received" — 2026-08-03 (root cause: CSP, not tagging)
- Proof surfacing + Organization sameAs — 2026-08-03/04 (`b28195e`, `9a91988`, `d5e7f1a`, UNPUSHED)
- GA-1 partial + GA-2 CLOSED — 2026-08-04 (GA4 admin, no code change)
- Jelly Belly Wiki case study rewritten — 2026-08-04 (action-plan 2.1, UNPUSHED)
- Client-confidential repo was still public — closed 2026-08-04
- Public-repo confidentiality sweep — 2026-08-04 (follow-up to the zahav-audit finding)
- Action-plan 1.4 — half implemented, half needs Moses (2026-08-04)
- Phase 3 — making the AI claims provable (2026-08-05)
- Zahav case study — re-measured and rewritten (2026-08-05)
- Repo + dependency health pass — 2026-08-14
- Dependabot PR #11 merged, broke production, reverted — 2026-08-14
- Prodani Miami case study rebuilt from measured data — 2026-08-23
- Florida Green Improvements case study published — 2026-08-26
- Florida Green case study trimmed to house density — 2026-08-26
- Housekeeping sweep — 2026-08-29
- Shipped batch — 2026-08-29 (evening): hover swap, marquee derivation, FL Green launch, Meta Pixel
- Meta Pixel mission complete — 2026-08-29 (late): domain verified, conversions proven, ingestion confirmed
- Ads-readiness: final state — 2026-08-29
- Scout ships as the 9th case study + the grid learns remainders — 2026-09-02
- Zahav gains its first conversion metric — 2026-09-02
- Em-dash purge: every rendered surface, to exactly zero — 2026-09-02
- Dependency batch: six safe upgrades, one licensing catch, one false alarm — 2026-09-02
- Triple-lens refresh audit: impeccable + mkt-copywriting + gsap-scrolltrigger — 2026-09-02
- Refresh branch opens: /agents page removed — 2026-09-02 (evening)
- REFRESH-1 bugs 1–4 — 2026-09-02 (evening, branch `refresh/remove-agents-page`)
- REFRESH-1 second pass: copy, kickers, pricing rows, testimonials, code hygiene — 2026-09-02
- AI-writing pass against Wikipedia:Signs_of_AI_writing — 2026-09-02 (evening)
- Home grid: rows of three, Scout in row one — 2026-09-02 (late)
- Real client logos in the strip + in-card website peek on /projects — 2026-09-03
- Renewed Bodyworks case study published — 2026-09-08
- Video hero: the ident replaces the cursor field — 2026-09-09 (branch `feat/video-hero`)
- Service menu after the owner's reference: borderless two-column entries — 2026-09-09 (late)
- Case studies: tile grid → typed index with a hover preview — 2026-09-09 (late)
- Header: one row + detached fixed logo; marquee above the case-study title — 2026-09-09 (late)
- Motion pass: reveals + scroll effects on the new home — 2026-09-10 (branch `feat/video-hero`)
- Services: typographic build; the safety nets were killing every reveal — 2026-09-10
- Hero: three words, nothing else over it — 2026-09-10
- Services 7 → 4, tiers 26 → 17; moon error boundary; hero stage on wide screens — 2026-09-10
- Services block: full-screen stage over the interactive grid — 2026-09-10
- Services block: panels, hierarchy, spacing, header offset — 2026-09-10 (design pass)
- Services: pinned horizontal pan, after the owner's reference recording — 2026-09-10
- Services slide, cursor ring, /services retired, pricing footer — 2026-09-10 (late)
- Cursor: a circle everywhere, and the "disappearing" bug — 2026-09-10 (late)
- Owner batch — 2026-09-11: end card, hero tail, header grid, cursor everywhere, index, About, metric
- The Studio Journal becomes a split reader — 2026-09-11
- LIVE SERVICE POSTERS — BUILT 2026-09-11, branch `feat/service-poster-live`, NOT PUSHED
- HOME PAGE PASS — 2026-09-12, on `main` (3c9076a → d647c75)
- TESTIMONIALS PASS — 2026-09-13, on `main` (fd99e8f → next)
- PREVIEWS, ABOUT REDESIGN, TEXTLOOP — 2026-09-13, on `feat/about-redesign` → `main`
- HOME ABOUT + CONTACT PASS — 2026-09-13 (late), on `main`
- ABOUT PAGE MOTION PASS — 2026-09-14, on `main`
- SERVICES & PRICING REDESIGN — 2026-09-14, on `main`
- PRICING TIER CARD FACELIFT — 2026-09-14, on `main`
- NEW HEADER LOGO — 2026-09-22, on `main`
- MOBILE FIXES FROM THE OWNER'S iPHONE — 2026-09-22, on `main` (268c9fb)
- LOCAL-ONLY WORKSPACES IGNORED — 2026-09-22, on `main`
- MY CHALLAH DEALER CASE STUDY — 2026-09-24, on `main`
- OWNER POLISH — 2026-09-24, on `main`
- UNHURRIED THEMES, SHOP, OFFICE HOURS, SCHEDULED POSTS — 2026-09-25, on `main` (through 3a77061)
- UNHURRIED CASE STUDY — 2026-09-26, on `main`
- SERVICE POSTERS + PRICING TIER SPREADS — 2026-09-26
- /PROJECTS REDESIGN — 2026-09-27
- /TESTIMONIALS REDESIGN — 2026-09-27
- JOURNAL COVERS + SCHEDULER SYNC — 2026-09-30
- CLEANUP — 2026-10-06
- SEO AUDIT FIXES 1–5 — 2026-10-09
- SEO AUDIT FIXES 6–7 — 2026-10-09
- SEO AUDIT FIXES 8–9 — 2026-10-09
- CASE-STUDY REPOS + SEO AUDIT FIXES 11 AND 13 — 2026-10-09
- SEO AUDIT FIXES 10, 12, 14 — 2026-10-09 (late)

---

## SESSION HANDOFF — 2026-10-09 (SEO audit + fixes 1–5)

**State:** branch `fix/seo-audit-2026-10`, commit `cdb4efd` on top of `main` `561da2d`, NOT pushed, working tree clean. `main` untouched this session. Scheduler may push to main at 14:00 UTC: fetch and rebase before touching `posts.json`.

**Done this session**
- Full `/seo audit` (9 subagents, lab-only: no Search Console / CrUX / PSI, the claude-seo runtime is not set up and keyless PSI returned quota 0). Health ~66/100.
- Fixes 1–5 (entry above): page bodies back in `<main>` (React 19 outlining), blog inline links `[label](url)`, fonts-post cover, case-study CLS 0.19/0.13 → 0.003/0.001, `/assets/*` immutable cache. Rules in CLAUDE.md.

**Left from the audit (code work, in order)**
6. Unsourced claims: Crimson "Top 3 Google ranking" (`projects.json`), "The data is brutal and consistent" / "Fast sites rank higher" (why-fast-sites-win-more-clients), "Research-backed" (contact-forms post). Delete or link the source (now possible inline). Relabel "100/100 Google SEO score" (Zahav) and "Google performance score 99/100" (CWV post) as Lighthouse.
7. Internal links: each post gets one service link + one case-study link in the text; each case study links its service page; case-study "Back" goes to `/projects`, not `/#projects`. CWV post says "Each of those has a case study on this site" and links none.
8. Titles > 60 chars on 14 URLs (worst 84/78/77, all blog), descriptions > 160 on 15 (up to 200; home 177). Reuse `clampAtWord` for posts, trim at the data.
9. Schema: WebSite `@id: #website`; every page-level `publisher`/`provider`/`creator` → `{"@id": "…/#org"}`; founder "Moses Atia Poston" everywhere with one `@id`; drop Eno (the dog) from Person markup; BlogPosting `author.url`; `ContactPage` on /contact, `CollectionPage` on /projects. No Review/AggregateRating (self-serving).
10. Cost guides, one per service (price searches rank long cost guides, not package tables; our prices sit under the quoted ranges). Sourced market ranges only.
11. Phone: body text 13px on /about and most pages (floor 16px), menu/footer links 37px tall (44px), cookie banner 166px (20% of the fold) with 33px buttons, /blog h1 at y≈5,800 on phone, home lede below the first phone screen.
12. /about phone LCP 8.6s and 3.9MB (one lab run; confirm with 3 runs, then lazy-load the Polaroid media). Case-study LCP element is the `long.webp` band image (782KB on Zahav, lazy): size/compress or serve a smaller first frame.
13. `/llms.txt` 404 while `/pricing/marketing-ads` sells it. Also sitemap `lastmod` is per-file-group, not per page (`generate-sitemap.mjs`); 404 page carries a canonical to `/404`; `index.html` comment contains the text `<title>`.
14. Blog hygiene: posts under 1,500 words (what-a-brand 256, why-fast-sites 275, CWV 409); two speed posts compete (merge + 301); categories overlap (Automation / Automation & Systems / AI & Automation; UX & Web Design / Web Design); no `updated` field in posts.json (CWV post rewritten 09-02, dateModified still 08-13).

**Owner decisions pending (not code)**
- Bluesky `switchcasestudio.bsky.social` says "Development and marketing agency · Phoenix based" (created 2026-07-14, 8 posts, not in `social.js`). Ours? → bio to Portland + add to sameAs; not ours → someone is using the name.
- Name collision: `switchcasestudios.com` (SwitchCase Studios, software/product engineering) is live; brand search returns Nintendo cases. Clutch + Crunchbase + Wikidata profiles and a one-line definition on home/About would separate the entities.
- Portland local page: only if local clients are wanted (most case-study clients are FL/NY/AZ).
- Beau's post pipeline must learn the inline-link form (`[label](url)`) so new posts cite sources; `add-post.mjs` rejects bad urls.

**Next session, first 20 minutes**
1. `git fetch`; if main moved, rebase the branch. Owner pushes + opens PR (`! git push -u origin fix/seo-audit-2026-10`), merges.
2. On the deploy preview, then prod: `curl -s <url>/about | grep -c 'id="S:'` = 0; `curl -sI <url>/assets/<app chunk>` → `max-age=31536000, immutable`; fonts post `og:image` = the jpg; Zahav page body in `<main>`.
3. Then start fix 6 + 7 together (same files, now unblocked by fix 2), then 8, then 9.
4. Optional: `/seo setup` + a PageSpeed API key for field data; `/seo drift baseline https://switchcasestudio.com` so the next audit diffs instead of re-reading.

**Gotchas from this session**
- Local Lighthouse mobile LCP doubles under machine contention (probes running in parallel); CLS is stable. Compare LCP elements with a buffered `PerformanceObserver`, not Lighthouse 13.5's element audit (empty).
- `uniq -w` does not exist on macOS; `grep --include='*.js'` needs quotes in zsh.
- Route baseline unchanged: 53 HTML files.

### 2026-10-22 — Brand Identity world (LIVE on main, merge 4e96dc9)
- **Routes.** `/services/:slug` beside `/pricing/:slug`, same slug both sides. Brand Identity slug is `brand-identity` (`/pricing/design-branding` 301s). Only Brand Identity has a service page; `/services/{web-development,ai-development,marketing-ads}` 301 to pricing. Route baseline 59.
- **Navigation.** Header, mobile menu and footer have separate Services and Pricing menus (`SERVICE_PAGES` / `SERVICE_LINKS` in `navigation.js`: service page where one exists, pricing page otherwise). Explore's "Services & Pricing" is now "Pricing". Both menu triggers still open `/pricing` until a services index exists (owner to decide); the home hero's "Services" link is unchanged.
- **`/services/brand-identity`** (`src/components/brandWorld/`, exempt from the page-head and one-reveal rules by owner decision): pinned scroll collage, 18 tiles each on a seeded random vector/pace/distance that enter and exit (five Portland concepts as live SVG on the poster engine, the SCS star seal in 2.5D, the script logo, two client sites in browser chrome, the ident, a scroll-scrubbed video, a pixel-size test); TextPressure type stage on Roboto Flex; five-state full-bleed process stage with a three.js business card; deliverables grid (Draggable sticker, grounded captions); client bubbles; two circles; pill CTA. No price on the page. Reference analysis: `.audit/brand-identity-reference.md`.
- **Video.** Five Remotion loops from `~/Desktop/scs-remotion-ads/brand-world/` in `public/brand-world/` (h264, yuv420p, BT.709 limited).
- **Rules added** (`.audit/rules.md`): read a reference site's data before its pixels and probe builds on clean URLs; no highlighter plates on headings; US English enforced by `scripts/check-us-english.mjs` on postbuild (a British word in a scheduled post now fails the deploy).
- **Open:** concept row (pinned horizontal pan); more real-life media and loops; services index page or Services-as-dropdown-only (owner); hero "Services" link target (owner); optional US-English check inside `add-post.mjs` so the scheduler catches it before commit.

### 2026-10-22 (later) — AI & Automation world, renames, cards to worlds, Services/Pricing untangled (LIVE on main, merge e10faec)
- **Renames.** "Graphic Design & Brand Identity" and "Web Development & Mobile Apps" everywhere a title is read from `services.json` / `pricingData.json` (cards, menus, footer, pricing pages, sitemap, llms.txt). Slugs unchanged, no new 301s. The pricing page's meta description is now clamped at a word (`clampAtWord`; the new name ran it to 166).
- **Notebook row.** Card titles sit on a reserved number of lines wherever cards are side by side (home pan: 2 lines; `/pricing` grid: 2 / 3 / 2 at 768 / 1024 / 1200), so every subtitle in a row starts on the same line. Verified at 1440 in Chrome (subtitles within 0px of each other on both pages).
- **Cards → worlds.** Home service cards go to `/services/<slug>` where a world exists (`servicePath()` in `navigation.js`; `cta` "See the work →"), to pricing otherwise. The `/pricing` grid keeps pricing links (it is the pricing index).
- **`/services/ai-development`** (`src/components/aiWorld/`): the brand world's sibling from the shared kit `src/components/worlds/` (Collage, ProcessStage, Bubbles, WorldClose, VideoTile, LiveArt, Card3D, all parametrized; the brand world now uses them too). Language from the owner's reference drawing: outlines on black, `currentColor` strokes, lavender accent, bold-led captions. Hero: 18 tiles (13 live outline drawings, the Always-on poster, Scout in browser chrome, three Remotion loops, one scroll-scrubbed). The workbench (`FlowStage`): the reference diagram as a machine; arrows draw on scroll, Run sends a packet through and writes the agent's log. Five-state process stage (NodeGraph, chat, flow loop, night loop, a three.js agent card). Deliverables with real controls: assistant Q&A that types, agent task runner, draggable node with following wires, hosting switch, log loop, envelope. Bubbles (testimonials 4–8), circles, pill.
- **Routing.** Each world is a static route record ahead of `services/:serviceSlug` → `ServiceRedirect`. Route baseline **60**.
- **Video.** Three new loops from `~/Desktop/scs-remotion-ads/brand-world/` (committed there, 4ed9a66, not pushed) in `public/ai-world/`.
- **Services vs Pricing untangled** (owner: "a bit of a mess in pricing and services"). Before: both header menus landed on `/pricing`, whose kicker read "Services & Pricing"; the Services submenu mixed `/services` and `/pricing` targets; no world linked its pricing page and no pricing page its world; breadcrumbs disagreed. Now: `/services` is back as the services index (`ServiceIndexPage` `variant="services"`: "What we do, shown not told.", cards land on the service page where one exists, "See the work" / "See pricing"), `/pricing` is plainly the pricing index ("What it costs, package by package.", every card "See pricing" with "from $X"); Services (the only dropdown of the pair) and Pricing (a plain link, owner) each land on their own index in the header, mobile menu, footer Explore and the home hero, and the home pan's end card reads "All services" → `/services`; each world's close note links "See packages and prices." to its pricing page and each pricing page with a world links "See the work, not just the price" under its lede; breadcrumbs: worlds under Services, prices under Pricing; `llms.txt` lists a service at its page where it has one plus separate Services and Pricing entries; the slug list moved to `src/data/servicePages.json` so `navigation.js` and the build scripts read one file; the `/services` → `/pricing` 301 is removed. Route baseline **61**. Verified on the clean-URL server at 1440 (both indexes, both submenus, footer, pricing head link, world close link); Chrome served a cached copy of a pricing page once during the probe, so bust the cache before concluding a static element is lost at hydration.
- **Open (carried):** concept row on the brand page; worlds for Web Development & Mobile Apps and SEO & AI Search (their Services entries still land on pricing); a mobile pass on the AI hero sheet with a real phone.
- **Done (2026-10-25): link swap with Apogee Watcher.** Their technical director asked for a mention in the Core Web Vitals post; owner agreed to a straight swap, no trial, they link first. Their link went live 2026-10-24 in the References of apogeewatcher.com/blog/how-lighthouse-performance-scores-recorded-calculated (checked with curl: plain `<a href>`, no `rel`, no ref parameter, page not noindex) and points at `/blog/core-web-vitals-and-performance-optimization` (200). Ours: one sentence appended to the first paragraph under "How to check your own site" in that post, linking `https://apogeewatcher.com` (followed; inline links get `noopener noreferrer` only). Wording checked against their homepage (scheduled PSI tests, CrUX field data in every test). No `updated` bump (fix 14).

### 2026-10-23 — Production error on /services: every deploy broke every open tab (fixed, awaiting push)
- Owner saw `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` on /services. Cause: vite-react-ssg's injected route loader fetches a manifest named by a random per-build hash baked into the HTML; a tab opened before a deploy asks for a file the new build no longer ships, gets the HTML 404, and `.json()` throws. With a daily scheduled deploy, this hit any tab kept open across a day. Reproduced on production by faking a stale hash.
- Fix: `scripts/pin-ssg-hash.mjs` (postbuild) pins the hash to `latest` (manifest, 60 data files, inline script in every page) and fails the build if the random hash survives; `src/components/util/RouteError.js` is the router `errorElement` (pathless record under Layout in `routes.js`) that reloads a stale tab once and otherwise shows a reload page. Verified on a served build in Chrome: normal navigation fetches `-latest.json`; a stale hash lands on the wanted page with no error. Route baseline still 62. Rule: `.audit/rules.md`.

### 2026-10-23 (later) — Page heads bolder; AI world hero is the workbench (committed, awaiting push)
- Page heads: the shared title is Inter 800 (was 500) and larger, the worlds' collage title matches; blog untouched (2aa0947).
- AI & Automation world: the scroll collage is gone (it belongs to the brand world). The workbench is the hero at full viewport height: headline and the agent's log beside the drawing, purple agent, packet, aura and current on the arrows. Live: auto-runs four kinds of job while on screen (form lead, missed call, refund kept human, sheet row), Pause stops it. Reacting: the agent leans and glows toward the pointer, parts and captions light on hover, Run, the trigger and the human circle start jobs. Verified in Chrome at 1440 and 820 wide; standing checks clean, 62 routes. Rule: `.audit/rules.md`.

### 2026-10-24 — AI world: readable, thinner, colored; breath sections removed (LIVE on main)
- Owner review of `/services/ai-development` ("strokes too thick", "elements hovering text, impossible to read", "too black-purple", then "I am missing colors", "no glow"). Fixed in five commits on `fix/ai-world-legibility`, merged to main.
- **Legibility.** Hero captions sat on a 11px floor while the drawing shrank, so at 1024-1440 lines ran over them; each caption now owns a line-free zone of the viewBox, copy is cut to one or two lines, floor 12px, with a dark halo. Process-stage cards are filled with their field and the art steps 6% away from them (they overlapped by ~50px). Phone: the chat demo takes its own height instead of clipping its answer.
- **Weight.** Outlines 2px; hero strokes 8/5, tile art 4.5/4, demos 4.5 viewBox units. The three Remotion loops (`public/ai-world/`) still carry their original stroke weight; re-render to match.
- **Color.** Hero: no glow (aura, blurred "a", gradients removed); orange is the only accent, chosen by the owner from four palettes rendered side by side (trigger + Run orange, agent cream, queue cream lines, kept-human outline). Rest of the page: stage orange / mint / cream / blue / pink, demo tiles in studio colors, blue bubbles, orange + blue close circles.
- **Removed.** The "Everything on this page runs" breath on the AI world and the "Five made-up Portland businesses" breath on the brand world; `.bw-breath` styles deleted, the type stage keeps the section gap itself.
- Route baseline **63** (the Directcut post published 2026-10-24). Standing checks clean. Rules: `.audit/rules.md` (text never sits where a drawing can run under it).
- **Open:** hero CTA / kicker / Pause still lavender (owner may want orange); re-render the three AI loops at the thinner weight.

### 2026-10-25 — Web Development & Mobile Apps and SEO & AI Search worlds (LIVE on main, merge 6c35734)
- Owner: "generate two service pages for SEO & AI Search and Web Development & Mobile Apps ... go with this line" (the AI world's vector-animation design). All four services now have a world; route baseline **65**.
- **Shared first.** The AI world's sheet split into `_worldOutline.scss` (the outline worlds' language and demo controls) and `_worldHero.scss` (`@mixin world-hero`); the AI page compiled identically before and after (every selector's declarations compared).
- **Web** (`/services/web-development`): hero "Built to load fast. Kept running.", a live build line (commit, build, preview on desktop and phone, Deploy, uptime monitor) with an orange packet and a deploy log; stage blue / cream / orange / mint / pink; six demos (responsive slider, phone app tabs, store cart, form validation, deploy steps, light/dark theme); pink bubbles.
- **SEO** (`/services/marketing-ads`): hero "Found on Google. Quoted by AI.", the search desk (query, your page read and fixed, index, results where your row climbs, an AI answer citing your page) with a crawl log; stage mint / cream / blue / orange / pink; six demos (title and description editor cut at 60/160, an AI answer that cites or says it cannot, BreadcrumbList on/off, LCP against Google's 2.5 s / 4 s lines, AI-crawler robots.txt switch, report line); mint bubbles. The demo business (Rose City Plumbing) is made up and the demo numbers read as a demo.
- Wiring: static routes ahead of `services/:serviceSlug`, `servicePages.json`, sitemap entries, cards "See the work", the two `/services` → `/pricing` 301s removed.
- **Interrupted session (2026-10-24 night):** the auto-mode permission checker failed every shell command, the SEO fork stopped before writing `seoWorld.scss`, and the session ended unverified. Finished 2026-10-25: the SEO sheet (fields, hero import, `sw-*` demos), demos that grow instead of clipping at 1024 on all three outline worlds, the Web theme demo stacking on narrow cards, the hero log header wrapping by row on phones. Rule: `.audit/rules.md`.
- Verified on the production build (clean-URL server) and the dev server: heroes at 1024 / 1280 / 1512 / 1920, every stage state at 1440, deliverables at 1024 / 1280 / 1440 / 390 with no clipped control, full phone pass at 390 (no horizontal scroll), zero console errors; one h1 inside main, titles 36 and 50, descriptions 153 and 151; standing checks clean.
- **Open:** owner review of both pages on the live site; Chrome pass on a real phone; hero CTA / kicker / Pause are still lavender on all three outline worlds (owner may want orange).

### 2026-10-25 — Service slugs match their titles (LIVE on main, merge df52ea9)
- Owner: "make sure that the permalinks align with the service title ... we only have 4 services so let's keep it consistent" (SEO & AI Search lived at `/services/marketing-ads`).
- New slugs on `/services/<slug>` and `/pricing/<slug>`: `graphic-design-brand-identity`, `web-development-mobile-apps`, `ai-automation`, `seo-ai-search`. `pricingData.json` ids now equal the slugs; the three slug→id tables are deleted.
- **Bug fixed on the way:** `/pricing/brand-identity` had shipped with no package board since 2026-10-22 (the board was keyed `brand-identity`, the pricing id was still `design-branding`). It's back.
- Moved with the slugs: routes, the four world pages and heroes, posters, package boards, `servicePages.json`, 14 case studies' `servicePages`, 31 links in `posts.json` and one in `content/published/`, sitemap, llms.txt. `netlify.toml`: eight new 301s (old → new, both sides), and the five older retired slugs now point straight at the final URLs.
- Verified on the production build: 65 HTML files, only the new names under `build/services` and `build/pricing`, no old slug anywhere in the build, canonical and JSON-LD URLs updated, a board on every pricing page, US English clean, no `id="S:`, in-app clicks to all eight pages in Chrome with zero console errors.
- Live check: new URLs 200, every old URL 301s to its new one with the query string kept, the brand board renders on production.
- Done the same day: Search Console sitemap resubmitted (it had last been read 2026-06-18, 24 pages); the four GBP products now link `/pricing/<new slug>` with their UTM tags (one still pointed at `design-branding`; Google shows them pending review); Beau's `JOURNAL-QUEST.md` on the VPS lists the four service and pricing paths (backup kept). The three GBP posts link a blog guide and two case studies, so they were left alone.
- **Open:** the paused Smart campaign in Google Ads was not checked (it serves nothing while paused; the 301s cover it if revived).

### 2026-10-25 — Journal covers required (LIVE on main)
- Owner: "we are missing hero images for some blog posts... that's an issue". Two of 26 posts had no cover (10-15 onboarding, 10-22 About page), both from Beau, whose instructions said "Leave `coverImage` empty".
- Covers added as 1600x900 WebP (owner: "convert it to web-friendly image format"): name tags and markers by Jon Tyson, a steaming mug by Thomas Park (Unsplash), 95 KB and 47 KB, with `imageAlt`.
- `add-post.mjs` refuses a post with no cover file or no `imageAlt` (dry-run tested on five cases); `check:media` fails the build on an empty cover (tested, then restored).
- Beau's `JOURNAL-QUEST.md`: cover recipe through the Unsplash CDN (crop + WebP in the URL, no local tools), the image committed with `posts.json`, and the 2026-10-09 post rules that had never reached it (categories, excerpt 160, `seoTitle`, inline source links, one service and one case-study link, `updated`). Backup of the old file kept.
- **Open:** the other 24 covers are still JPG (could move to WebP: about half the bytes).
- Same day, owner: "convert them all to webp and remove the old files". All 23 JPG covers re-encoded with cwebp (photos q82, type cards q90; text checked side by side, no visible loss), 4.6 MB to 2.5 MB; every file shrank (worst: the service-area map photo, 615 to 513 KB). The selling-a-theme post had used its 1200x630 share card as the cover (the 10-05 trap: the 16:9 frame clips its left-edge type); it now has a letterboxed 1600x900 WebP on black at `public/images/journal/`. The JPGs are deleted; the `/social/` share images stay (the social kit and IG need JPEG). No redirects for the old image URLs: they are not pages, and social platforms keep their own copy of a shared image.
- Branches pruned the same day (owner: "make sure main is the solely branch"): every branch was merged into main first (`git branch --no-merged main` empty), then deleted locally and on origin. main is the only branch.

### 2026-10-25 — US spelling ONLY: full sweep (LIVE on main)
- Owner: "run a test throughout the entire app to make sure that we are US spelling ONLY", and remake the theme card with "license".
- Sweep: every word of the build and the source (two detectors: a list, and an American-dictionary test for -ise/-our/-re forms), plus OCR of 227 images and 26 videos. The old check had missed attributes, JSON-LD, client-only strings and pixels.
- Fixed: "licence" on three theme images (share card, portrait card, journal cover); "colour" on four My Challah Dealer brand boards, in an alt and in a file name (now `03-color-variants`); "normalise"/"Normalised JSON" on Jelly Belly; three words in the free n8n download; "grey" in a Directcut screenshot; ~150 comment and identifier spellings across 54 files. Image edits are in-place letter edits, each checked before/after.
- `check:us` widened (attributes, JSON-LD, src/public/content, file names; list in `scripts/british-words.mjs`); new `npm run check:us:images` (OCR, local).
- Build: 65 pages, check:us clean, check:media OK; check:us:images clean except Florida Green.
- Florida Green's live rebuild says "LICENCE CGC1529180" and "organising": owner chose to leave it (2026-10-25); `check-us-images.mjs` allows exactly those two words under `public/projects/florida-green/`. Vendor strings (GSAP "initialised", three.js "grey" key) stay. LIVE on main.

### 2026-10-25 — Brand world in the other worlds' order: new hero, type stage into 03 (LIVE on main, merge d9fe508)
- Owner: "I would want to have the 'graphic design' page structure similar to the other services"; the type section's content "can replace the 5th section '03 Type'". Answers to my questions: hero and type in one round, flat-plate look kept, the word as 03's art, the Meridian clock dropped, current hero copy kept.
- Hero (`BrandHero.js`): one mark on six touchpoints (favicon tab, app icon, avatar, card, shop sign, van), switching concept every ~4s with a brand log and Pause; pills, click, hover and pointer drift. The scroll collage and its code are deleted.
- Same day, owner: the other heroes have a frame and a pure black field. The brand hero now has both (it had been an unbordered ink plate).
- 03 Type: the TextPressure word and concept pills are the art, the weight ramp the sticker, the type stage's headline joined the card copy.
- Verified on the production build: 65 pages, standing checks clean, US English clean; headless captures at 1440, 1024 and 390 (hover, Pause, reduced motion, 03 with Hatch and Fieldnote); no console errors with WebGL available.
- **Found, not fixed:** without WebGL the 05 System 3D card throws and takes the whole route to the error page (pre-existing, also likely on the AI world's agent card).
- **Open:** owner review on the live site; a real phone pass.

### 2026-10-25 (later) — 03 Type is a type tester (LIVE on main, merge d9fe508)
- Owner sent a foundry's type tester and asked for "something like this ... interactive, dynamic and responsive", with fewer visuals.
- `TypeTester.js` replaces the TextPressure word and the weight ramp in 03 Type, as a full-stage state: Roboto Flex with five concept presets, sliders for size, weight, width, spacing and height, alignment, Breathe (weight and width cycle while on screen), reset, an editable line, and facts read from the font file (13 axes, 221 glyphs).
- Verified on the production build at 1440 and 1024 (pinned) and 390 (stacked): no clipped control, no horizontal scroll; Breathe runs and stops on any slider; presets and typing work; reduced motion has no Breathe and still axes.
- Owner, same day: "constantly shaking and moving... doing toooo much". Breathe now waits for a press and moves only the weight, slowly; width (which re-wrapped the lines) stays put. Measured: off, nothing changes for 3s; on, weight only, line height constant.
- **Found, not fixed:** stacked (under 1024), the 04 Color sticker cuts off its hex codes at the right edge (pre-existing).
- Merged to main as d9fe508 and pushed (owner: "log commit push to main"); `feat/brand-hero` deleted, main is the only branch again.

### 2026-10-25 (night) — Brand world teaches logo, type, color, rhythm, composition (LIVE on main, merge 5ce0a47)
- Owner: leave the five made-up Portland brands aside; the studio is the authority, so talk about logo, fonts, type, color, rhythm and composition in general. Owner's picks: the stage becomes five lessons, the hero runs the kinds of logo, the tester's presets are jobs, numbers only where data proves them.
- Hero: the five kinds of logo (wordmark, lettermark, symbol, emblem, combination mark) for "Your brand" on the six touchpoints, each drawn the way that kind behaves at that size, with a log of what it does well and where it struggles.
- Stage "What we know": 01 Logo (size and cuts, clear space, pixel test), 02 Type (the tester, presets Headline, Body text, Caption, Signage, Display), 03 Color (60/30/10 with live WCAG contrast), 04 Rhythm (type scale from one ratio, 8 px grid), 05 Composition (thirds, 12 columns, a focal point that snaps). Nothing moves until the visitor acts.
- Deliverables redrawn as "Your brand" pieces; the Portland concept tiles, the 3D card and all eleven `public/brand-world/` videos and posters are gone. The brand page no longer loads three.js, so the WebGL crash cannot happen on it (it can still on the AI page).
- Verified on the production build: 65 pages, standing checks, US English and check:media clean; every lesson driven in headless Chrome at 1440, 1024 and 390, with no tile overflow and no horizontal scroll.
- Owner: "W-O-W !! well done. log, commit push to main". Merged as 5ce0a47 and pushed; `feat/brand-lessons` deleted, main is the only branch.
- **Open:** real phone pass; the AI page's 3D card without WebGL.

### 2026-10-25 (late) — Real iPhone pass in the iOS Simulator (LIVE on main, merge 0dae6b2)
- Owner: "use the Xcode app on 'm3' using ssh key". iPhone 17 simulator, iOS 27, Safari, live site: hero (all five kinds), the logo log, 01 Logo, 02 Type, 03 Color, 04 Rhythm, 05 Composition, stickers and deliverables all render as in Chrome.
- One iOS-only defect, fixed: the 01 Logo clear-space box showed only its top and bottom. It is now painted with gradients and shows all four sides in iOS Safari (checked on a local build served to the simulator).
- Not testable without taps: dragging, sliders, Pause. The cookie banner covered the bottom of every capture.
- Merged as 0dae6b2 and pushed (owner: "push"); `fix/ios-clear-space` deleted.
- **Open:** a pass on a physical phone for touch.

### 2026-10-26 — Full iPhone test (iOS 27 Simulator) and fixes (branch `fix/ios-full-test`, committed, not pushed)
- Owner: "run a full test of the website on Xcode". All 65 routes through a probe on the iPhone 17 simulator: 0 JS errors, 0 failed requests, 0 broken media, no horizontal scroll, one h1 each. 26 pages scrolled top to bottom (292 screens), reviewed in parallel, every finding confirmed on the full-resolution screenshot.
- Fixed: empty pricing thumbnails in iOS Safari; home service titles breaking mid-word; testimonial pager off the screen; "POPU-LAR" badge; case-study Results rows out of line; legal-page link contrast (2.1:1 to 5.6:1); the SEO snippet field clipping its second line; the Web phone mock's tab bar; "Menu −" before the script runs; `/unhurried-pro` copy under the status bar and its sideways-scrolling table; the world heroes' tag over the drawing on phones.
- Verified in Chrome at 1440 and 402 (thumbnails, Results rows, titles); the iOS re-check of the fixes (pass 3) stopped when the MacBook went to sleep mid-run.
- **For the owner:** /30-off still says "Ends June 30, 2026"; "Hover me" does nothing on touch; a few cosmetic items listed in `.audit/rules.md`.
- **Open:** pass 3 on iOS once the MacBook is awake; push. (Done the same day, entry below.)

### 2026-10-26 (later) — iPhone passes 3-4, owner calls A/B, defects 1-8 (LIVE on main, merge 06c5ac9)
- Pass 3 (52 shots, 12s waits) re-checked the 62de030 fixes on iOS 27: thumbnails, Results rows, legal links, SEO snippet, Web tabs, menu "+", world hero tags all hold; 0 JS errors, 0 failed requests. 9 shots were still blank at 12s; pass 4 (20 shots, 20s) shot them and today's fixes.
- Owner call A: `/30-off` taken down. 301 to `/pricing` in `netlify.toml`; route, page, styles, module grid and share image deleted. Route baseline 65 → 64.
- Owner call B: "Hover me" has a tap version. On touch it reads "Tap me"; a press turns the tile orange with a ring under the finger. Desktop hover unchanged.
- Fixed: `/unhurried-pro` diagram gets a stacked phone cut (type ~1:1 instead of 6-7px); the contact ident on phones sits in its own band under the content, not behind the form; case-study sideways scrollers (Prodani before/after, Jelly Belly diagram) get a "Swipe" line and an edge fade; two home stickers no longer run off the right edge; footer icons are two rows of four on phones (Blog no longer alone); SEO snippet fields and the type tester's select are 16px on touch (no focus zoom); the AI page's 3D card is gated on WebGL and wrapped in `DecorativeBoundary` (no error page without WebGL); the brand Color sticker's hex codes moved off the plate's edge.
- Not a defect: copy blurred under the status bar is Safari's own scroll edge (`env(safe-area-inset-top)` is 0 in a Safari tab, same with or without `viewport-fit=cover`); the 62de030 strip only paints where an inset exists. Comments and `.audit/rules.md` corrected.
- Verified: production build 64 pages, standing checks clean (no hidden bodies, h1 in `<main>`, entry marker, em dash only in `clampAtWord`, titles ≤ 60, descriptions ≤ 160, US English, check:media); headless Chrome at 402 (touch) and 1440; pass 4 on the iPhone 17 simulator. Not testable on simctl: the tap itself (driven in Chrome with synthetic touch instead).
- Owner: "push". Merged as 06c5ac9 and pushed; `fix/ios-full-test` deleted, main is the only branch. Live check: `/30-off` 301s to `/pricing`, the phone diagram and the tap tile are served.
- **Open:** a pass on a physical phone for touch (the tap tile, focus zoom).

### 2026-10-26/27 — Web world teaches the build (LIVE on main, 7b18fd7)
- Owner: "you did an amazing job with modifying the 'graphic design' service page. now lets give full focus on 'web development'". Same move as the brand world: teach, no made-up clients.
- Hero: the five kinds of build (landing page, website, store, web app, mobile app) for "Your business" on four screens (inbox, search, phone, laptop); each kind draws itself in, line by line; a build log says what each kind does well and where it stops.
- Stage "What we know": 01 Speed (waterfall on Lighthouse's phone and desk profiles, LCP verdict), 02 Layout (drag one page from 320 to 1440 px), 03 Stability (a late ad and banner, scored like Chrome scores a shift), 04 Response (0.6 s of work, all at once or in pieces, timed on the device), 05 Access (one card, rushed and built right, through a keyboard and a screen reader).
- Deliverables: Content (edit and publish), Mobile apps, Stores, Forms, Deploys (with roll back), Care (break the site, watch it come back). "Cold brew", "Ana R.", "Spring menu" gone.
- Verified: production build 64 pages, standing checks clean, US English clean; headless Chrome at 1440, 1024 and 390 (every lesson driven); frame timing in a visible Chrome (Response: 696 ms frozen vs 31 ms in pieces).
- The hero is one screen at every size (owner: "make sure that the hero is 100VG in both mobile and desktop"): header + hero = viewport on 12 viewports from 375x548 to 1920x1080; on phones the captions go, the kind pills scroll in one row, and the log lines, kicker and lede step out as the screen gets shorter.
- Owner: "WOW !!! WELL DONE!!!! log commit push to main". Merged to main and pushed.
- **Open:** a phone pass for the drag and tap controls; the other three world heroes are still taller than one screen on phones.

### 2026-10-27 — Heroes run under iPhone Safari's glass bar (LIVE on main, 342b38f)
- Owner, with an iPhone screenshot of the home page: "It doesn't look like 100 viewport height for the hero because I can see the next session on the bottom." The hero was exactly `100svh`, which stops at the top of Safari's bottom bar; the bar is glass (iOS 26+), so the next section's orange and purple showed through it. The Web world hero had the same gap (its blue stage).
- Fix: `--bar-tail` on `:root` (app.scss) = `100lvh - 100svh`, at least 7rem on iOS (`@supports (-webkit-touch-callout: none)`); the home phone hero and the Web hero add it to their height and bottom padding, so their black runs under the bar while the copy, the ident and the frame stay above it. 0 on a desktop.
- Verified (production build, headless Chrome): desktop and Chrome phone sizes unchanged (home 5rem tail, Web header + hero = viewport); with an iPhone-like 780px screen and the 112px tail, the home lede ends at 760 and the black runs to 896 (screen bottom 874), the Web frame ends at 768 and the stage starts at 954. The iOS Simulator host was offline, so the real-phone check is the owner's.
- Owner: "log commit push to main". Merged to main and pushed.
- **Open:** look at both pages on the iPhone.

### 2026-10-27 — AI world teaches automation (LIVE on main, f40b042)
- Owner: "lets match the content of 'services/ai-automation' in the same way we did for 'services/graphic-design-brand-identity' and 'services/web-development-mobile-apps'". Same move: teach, no made-up clients.
- Hero: the five kinds of automation (workflow, follow-ups, AI step, assistant, agent) for "Your business" on four screens (inbox, CRM, phone, the flow on a laptop); each kind draws itself in, line by line; a run log says what each kind does well and where it stops. Replaces the workbench. One screen at every size and under iPhone Safari's glass bar, like the Web hero.
- The Web hero's engine, drawing parts and sheet are now shared (`worlds/useKindsHero.js`, `worlds/kindsParts.js`, `_kindsHero.scss`); the Web page's built HTML is byte-identical and its compiled CSS differs only in comments. One visible change there: the laptop's address text was black on black and now shows.
- Stage "What we know": 01 Payback (minutes a time x times a week, hours to build: the week it pays back), 02 Grounding (ask Your business; the notes are scored live and the answer quotes its passage, or hands over), 03 Handoff (move the line; 14 questions with known answers count right, wrong and sent to a person), 04 Retries (20 jobs, the same failures, no retries / retries / retries with a job ID), 05 Privacy (names, cards, phones and emails masked before the text leaves your server).
- Deliverables: the coffee shop, "Ana", the "41 s" and the three lavender videos are gone. Assistant on Your business's notes, Agent (five logged steps), Workflows, Hosting, Monitoring (break the CRM, runs wait, fix it, they go through), Email and lifecycle (follow-ups stop on a reply).
- Deleted as dead: `WorkbenchHero.js`, `AgentCard3D.js`, `aiWorld/tiles/`, `worlds/Card3D.js`, `worlds/VideoTile.js`, `public/ai-world/`, the `.bw-video` and `.bw-card3d` styles. The AI page no longer loads three.js.
- Verified: production build 64 pages, standing checks clean, US English clean; headless Chrome: header + hero = viewport at 11 sizes from 375x548 to 1920x1080 with nothing past the frame and no console errors; every lesson inside its tile and clear of card and sticker at 1440 x 900 and 1024 x 768; 390 stacked with no sideways scroll; every lesson and demo driven.
- Owner: "log commit push". Merged to main and pushed; `feat/ai-lessons` deleted.
- **Open:** a phone pass for the range and text controls.

### 2026-10-27 — SEO world teaches search (LIVE on main, aaa9b90)
- Owner: "last but not least, lets do the SEO & AI search service page". Same move as the AI world: teach, no made-up clients.
- Hero: five ways to be found (web result, map, rich result, AI answer, ad) for "Your business" on four screens (the results page on a laptop, the same search on a phone, your side, the inbox), on the shared kinds engine. Replaces the search desk and its made-up plumber, med spa and rank climbs.
- Stage "What we know", in the hero's order: 01 Crawl (links from Home; an orphan, a sitemap, a noindex), 02 Local (relevance, then distance, as the searcher moves), 03 Rich results (Google's required properties, checked live), 04 Quoted (a page as written and as answers, scored like an answer engine), 05 Cost per lead (click price over conversion rate).
- Deliverables: Rose City Plumbing gone; Share cards, One address per page, Speed in LCP's four parts, AI crawlers (search apart from training) and Key events are new or rebuilt; Titles and descriptions stays.
- Shared: retrieval in `worlds/retrieve.js`, lesson controls in `worlds/lessonUi.js`; the AI lessons render byte-identical. Deleted as dead: `seoWorld/tiles/`, `worlds/LiveArt.js`, `.aw-live`.
- Verified: production build 64 pages, standing checks clean, US English clean, no Sass warnings from the new sheet; headless Chrome: header + hero = viewport at 11 sizes, every lesson inside its tile at 1440 x 900 and 1024 x 768, 390 stacked with no sideways scroll, every lesson and demo driven, no console errors.
- Owner: "log commit push to main". Merged to main and pushed; `feat/seo-lessons` deleted.
- **Open:** owner review; a phone pass for the map slider and the text fields.

### 2026-10-27 — Three heroes, three compositions, thinner strokes (LIVE on main, f1c7222)
- Owner: "All three services, hero, looking pretty much the same ... we need to get a little bit of diversity ... the stroke of the elements are too thick." Brand stays as it is ("working really great").
- Web keeps its devices. AI is a flow canvas: dot grid, the flow in a dashed group, wires to the CRM and inbox that flow while live. SEO is a magnifying glass over a results page: five places top to bottom, the current one in orange, yours up close under the glass.
- Strokes are about half as thick on wide screens (frames 8 to 4, lines 5 to 3 viewBox units), a little thinner on phones (6 and 4).
- A kind switch no longer shows two kinds' words on top of each other.
- Verified: production build, US English clean; header + hero = viewport at 11 sizes on all three pages; every kind shot at 1440; 390 phone shots; no console errors.
- Owner: "log commit push to main". Merged to main and pushed; `feat/hero-variety` deleted.

### 2026-10-27 — SEO audit with real Google data, Portland titles, faster service heroes, Bluesky, Clutch (LIVE on main, #37 53c4595, #38)
- Owner, after a cold "missing schema" spam email: "should we run an audit?". Delta audit after 10-09, first with real Google data: the `claude-seo` plugin now reads Search Console, GA4 (property 539900786, not the client property GA opens on) and PageSpeed through a read-only service account in Google Cloud project `claude-seo-513000`. Report: `.audit/seo-audit-2026-10-27.md`.
- Findings: on-page clean on all 61 sitemap pages; 18 not indexed ("Discovered" / "unknown"); service worlds' mobile LCP 6.8-7.9s; brand not an entity (`switchcasestudios.com` is a different firm); 449 impressions, 9 clicks in 28 days, nearly all Portland web-design queries; no CrUX field data (traffic below threshold).
- Indexing: requested for 11 pages on 10-27 (GSC quota); 8 left (about, onboarding and fonts posts, birth-of-venus, florida-energy-assistance, office-hours post, /shop, /accessibility).
- #37: home and service titles and descriptions say Portland; hero `__title` and `__lede` rise with `wh-rise-solid` (translate only, no fade), so LCP = FCP on all four worlds locally. Rule in CLAUDE.md + rules.md.
- #38: Bluesky (switchcasestudio.bsky.social, bio now Portland) in `social.js`, the footer and `sameAs`; `check:sameas` 8 profiles.
- Clutch: profile submitted (clutch.co/profile/switch-case-studio, under review; address verification 7-10 business days), 4 portfolio items Show All (Florida Green, Zahav, Prodani, My Challah Dealer). Social links on Clutch are paid-only; skipped.
- Wikidata: draft in `.audit/wikidata-draft.md`; create only after Clutch publishes.
- **Open:** the 8 indexing requests; re-inspect the 19; Wikidata after Clutch; Clutch client reviews (owner picks clients); re-run PageSpeed on the live service pages.

### 2026-10-28/29 — SEO follow-up: speed fix confirmed, indexing 11/19, Clutch published (no code change)
- PageSpeed mobile on the live service worlds after #37 (LCP, then performance): brand 7.9s → 3.2s (62 → 81), web 6.8 → 3.9s (62 → 76), SEO 6.8 → 3.9s (65 → 73), AI 6.9 → 4.1s (65 → 67). LCP now equals FCP on brand and web.
- URL Inspection: 11 of the 19 pages are indexed (all 10-27 requests except `/services`, plus the about-page post). Still out: `/services` ("Page with redirect" from the 10-10 crawl), the onboarding, fonts and office-hours posts, birth-of-venus, florida-energy-assistance, `/shop`, `/accessibility`. Request indexing hit "Quota Exceeded" on the first try on 10-28 and 10-29, more than 24 hours after the last accepted batch; daily retries stopped. The sitemap lists all eight; re-inspect around 11-04.
- Clutch profile is Published. Review link (the owner sends it): `https://review.clutch.co/review?provider_id=97ec1900-cead-4b9e-963b-ec240b749e6e`; texts drafted for Scott Hartzell (Renewed Bodyworks), Shiran Hayon (Sha Design Studio), Daniel Basel (Prodani Miami).
- **Open:** owner sends the three review requests; Wikidata is unblocked (owner creates the account, then the item goes in from `.audit/wikidata-draft.md`); re-inspect the 8 around 11-04, and request `/services` by hand if it is still a redirect; the AI world is the slowest service page (67).

### 2026-10-30 — Unhurried: approved on WordPress.org since 10-09 (unnoticed), follow-through done; Pro pages join the visit log
- Owner asked whether anyone uses Unhurried and whether anyone visits Pro. WordPress.org: approved 2026-10-09 (ticket #292908), serving 1.0.0, 50+ active installations, 266 downloads 10-09 to 10-29 (`api.wordpress.org/stats/themes/1.0/downloads.php?slug=unhurried`); GitHub zip 32 downloads, 6 clones in 14 days. Pro: the private release asset was fetched once = the owner's 9/28 test (owner: no Stripe balance), so zero sales. `/unhurried-pro/` had no script tag at all, Netlify Analytics is disabled on the site, GA4 is near-empty (consent); the visit log (since 10-15) shows 3 `/shop` views and 26 `/projects/unhurried` views, 22 of them Azure crawler IPs (Boydton, Des Moines, Dulles; desktop, no referrer) and 2 from chatgpt.com.
- Done: `public/unhurried-pro/visit.js` beacon on both static pages; Shop (`shop.json`), the Pro page button, the thank-you page, `content/SOCIAL-KIT.md` (facts + step 5) and the theme README (`switchcasestudio/unhurried` ac754ad) point at wordpress.org/themes/unhurried; the held post moved to `content/scheduled/2026-10-31-unhurried-is-in-the-wordpress-theme-directory.json` (date, 1600x900 WebP cover cut from `free.webp`, inline links to the case study and the web service, validated with `add-post.mjs` then reverted); `open-tickets.md` item 3 closed; `check:us` clean. The prior session's audit archive went in as `0a30793`.
- 1.0.1 uploaded the same afternoon once the owner logged in to wordpress.org in Chrome (I attached the zip; the consent boxes and Upload were the owner's): ticket #297927, automated scan Pass, "Theme Update for existing Live theme - automatically approved, will be marked live in 6hrs". Push: owner. Beau: inject the held promo packet once the post URL is live (the 10-31 run).
- Declined: a WPAcquire cold email (a marketplace for WordPress businesses: $49.99 to list, $49.99 a year to browse). Nothing to list; Pro has no revenue.
- Backlinks from the theme (owner asked, same day): Search Console lists 184 external links from 30 sites; 10 of those sites run Unhurried with the footer credit "Designed by Switch Case Studio" intact (alaimtiaz-alshamil.com 9, jdnicapps.com 9, revdmattrenyard.fyi 7, zainabriver.com 7, abigailbrennan.com 2, comoxvalleycreative.com, dhanushbhuvan.com, fondlyinink.com, heritagehospitalityhouse.com, missbalance.in 1 each = 39 links), plus wp-themes.com (the wp.org preview, 1). Two more run it with the credit removed (letmeblabber.com, creativesguidebook.com). Verified by fetching each home page (`wp-content/themes/unhurried` + the credit anchor). The wordpress.org theme page itself does not link the site: `Theme URI` is empty, so a 1.0.2 with `Theme URI: https://switchcasestudio.com/projects/unhurried` would add that link.
- Owner spotted a client site on Unhurried (kwa-nyc-construction.com) whose one-screen home page left the page background showing under the footer. Theme fix shipped as Unhurried 1.0.2 (repo `switchcasestudio/unhurried`, 2968cfb, clone now at `../unhurried`): `.wp-site-blocks` is a column flexbox of at least `100svh` minus the admin bar and `main` grows, so the footer sits at the window's bottom; verified in WordPress Playground (`dev/serve.sh free`, Playwright on the installed Chrome) at 1440x2400 and 390x1700: gap under the footer 767px/199px before, 0 after; long pages unchanged; Theme Check passes on the dist zip (the one REQUIRED hit is `dev/serve.sh`, excluded by `.distignore`). Also `Theme URI` = /projects/unhurried for the wordpress.org backlink. Rule: a block theme ships a sticky footer by default, and the dev shoot includes a page shorter than the window. Release zip built from `.distignore` with rsync + zip; wordpress.org upload and the GitHub push/release are the owner's.
- Two more into 1.0.2 before the upload (owner, same afternoon). (1) "Impossible to mark anything": `::selection` painted contrast-on-base, so on Ink sections and dark footers the highlight matched the section's own colors and selected text looked unselected (reproduced on abigailbrennan.com's footer email: selected per `getSelection()`, no visible highlight). Fix: `::selection { background: rgba(212, 75, 25, .4) }`, text color untouched, visible on dark and light (screenshots in the session scratchpad). (2) fondlyinink.com's "How a visit unfolds" panel slid over the sections below it: not the theme, the site owner set Position > Sticky on that group (`is-position-sticky` in their HTML; the theme never sets it); 1.0.2 hides the option via `theme.json` `settings.position.sticky: false` (header capsule is sticky by CSS, unaffected; editor confirms `position.sticky === false`). Rule: a selection highlight is set as a translucent tint, never as a solid color pair that can match a section; and when a theme user reports a layout bug, diff their HTML classes against the pattern before touching the theme.
- 1.0.2 uploaded to WordPress.org the same evening: the open update ticket #297927 was re-titled "Unhurried – 1.0.2" (a second upload folds into the pending ticket), status approved, live after the bot's ~6h hold. Theme repo b0ce997 and site repo pushed by the owner. Gmail draft to Abby Brennan (abigailbrennan.com, a theme user) created, asking what to improve; sending is the owner's.
- Close of day: kwa-nyc-construction.com is a theme user, not a client (I had assumed otherwise from its 36 links), so its footer fixes itself when they take the 1.0.2 update. Owner sent Abby's email and pushed both repos; the GitHub release v1.0.2 (zip asset for the Shop fallback link) is not created yet. Handoff given in chat only, by request.
- GitHub release v1.0.2 published the same evening (owner: "release"). Zip built from `b0ce997` with the `.distignore` rsync recipe (same file list as the 1.0.1 asset minus one empty `assets/css/` folder), notes from the changelog, marked Latest; `releases/latest/download/unhurried.zip` serves 1.0.2 (773,701 bytes, sha256 equal to the built zip), so the theme README and the journal post's download button hand out 1.0.2 with no edit. Two traps: the auto-mode guard refuses to create a public surface, so the owner runs the `gh release create` line by hand; and `--target` takes a branch or a full SHA, a short SHA is "target_commitish is invalid". Open: `readme.txt`'s changelog stops at 1.0.1 (its Stable tag is 1.0.2).
