# Open tickets

Live list. Close a ticket by deleting its block and logging the outcome in `summary.md`.
Last reviewed: 2026-09-25.

## LAUNCH-UNHURRIED — themes, shop and office hours follow-through
**Logged 2026-09-25.** Everything below is live; these are the checks and waits that remain. System handoff: `switchcasestudio/unhurried-pro` → `HANDOFF.md`.

**Owner:**
1. **Mon 2026-09-28 10:00 PT: end-to-end purchase test** (Google Calendar reminder). Buy Pro ($49): thank-you page loads, Download returns `unhurried-pro-1.2.0.zip`, copy the licence key into a WordPress site (Appearance > Unhurried Pro) and confirm it saves. Buy an office hour ($95): lands on the Office Hour booking page, book then cancel. Refund both in Stripe. No real purchase has happened yet, so this is the only end-to-end proof.
2. **Approve social drafts** in the SCS Telegram group on 9/29, 10/2, 10/6 after 09:00 PT (Beau injects them). On 10/2 every platform posts ~2 min after approval (the engine's slot times are already past on a Friday inject).

**Waiting on others:**
3. **WordPress.org review, ticket #292908.** When feedback arrives: apply fixes, upload Unhurried **1.0.1+** (1.0.0 in review still says "Moshe"). When approved: move `content/held/wordpress-org-unhurried-approved.json` to `content/scheduled/<date>-unhurried-is-in-the-wordpress-theme-directory.json`, set its date, push, tell Beau (kit step 5), and switch the Shop and README links from the GitHub zip to wordpress.org/themes/unhurried.

**Accepted gaps (revisit if they bite):**
4. The Office Hour booking page URL is public, so someone could book without paying. Cancel and send the Stripe link if it happens.
5. Two react-router v6 Dependabot alerts dismissed (fixed only in v7). Revisit when vite-react-ssg supports react-router 7.

## REFRESH-1 — Triple-lens refresh audit (impeccable + mkt-copywriting + gsap-scrolltrigger)
**Logged 2026-09-02. Bugs 1–4 resolved the same evening (see each item); the rest is open. Full writeup in `summary.md`.**

Owner asked for a site-refresh audit from three skills. Findings, cheapest-first:

**Bugs (no design decision needed):**
1. ~~Footer clips/overflows below a narrow width~~ **FIXED 2026-09-02** on
   `refresh/remove-agents-page`: not a missing breakpoint — bare `1fr` tracks floor at
   min-content (the longest link label), so the 2-col grid ran 13px past its container;
   `minmax(0, 1fr)` at every breakpoint. Verified: columns' right edge 476 of 500.
2. ~~`AboutMarquee.js` dueling tweens~~ **FIXED 2026-09-02**: one owner for `xPercent` — the
   scroll influence is a number a `ScrollTrigger.onUpdate` writes and the drift's `modifiers`
   adds in; dead `marquee-left` keyframe reference deleted. Verified live: drift ~133px/s, a
   400px scroll moved the track a further ~760px.
3. ~~FAQ row washed-out grey~~ **NOT A BUG, closed 2026-09-02**: all six rows measure
   opacity 1 / identical ink once frames are forced — the audit tab froze a mid-stagger
   frame (the documented occluded-window artifact). No change.
4. ~~`CaseStudyPage.js` reveals everything at mount~~ **FIXED 2026-09-02**: hero reveals on
   mount (first-viewport law); every section below it has its own `ScrollTrigger.create`
   (`once`, `top 88%`) with the in-view-at-mount fallback, an idempotent `reveal()`, a
   `scrollEnd` sweep and the timed net — nothing that has ENTERED the viewport can stay
   hidden, and nothing below it reveals early. Timing now reads `motionTokens.js`. Verified
   desktop + 390px, including an instant jump to the bottom.
5. ~~`/contact` placeholders~~ **SKIPPED by owner decision 2026-09-02**: the background video
   is intentional and the owner is happy with it; the audit tab never fired the video request
   (IO/autoplay under automation). Headline left as is with the rest of the page.

**Two pages, hit from both a design and a copy angle:**
- `/contact`: skipped (above).
- ~~`/testimonials`~~ **DONE 2026-09-02**: the animated gradient fill on the HOME testimonials
  heading is now solid white (`GradientText.js` deleted — no importers, asset set byte-identical
  after removal), and the reviews page pairs Sean Dalal's Zahav quote with the sourced
  "1 in 13" booking-click stat + a case-study link (optional `metric` field on a testimonial;
  renders nothing when absent). Headline kept: it is now literally true for one card.

**Bigger, worth-scheduling (register/consistency):**
- ~~Kicker-label pattern~~ **CONSOLIDATED 2026-09-02** to one rule: kickers live on PAGE
  headers only (Portfolio / Field Notes / Pricing / Our Studio / What clients say) plus
  functional labels (the "Trusted by" strip, case-study "In depth on · year", blog category).
  Removed the two decorative in-section ones on the home page ("What we do" above the
  services heading, "Proof, not promises" above the testimonials heading). The About page's
  small-caps `section-label`s are real `<h2>`s, not kickers — kept.
- ~~"X, not Y" + "built from scratch" repetition~~ **TRIMMED 2026-09-02**: kept four signature
  uses ("hype not" on /pricing, "Engineers first, evangelists never", "software that ships,
  not a buzzword on a deck", "not a slide deck" on the AI sprint) and rewrote the rest as
  direct statements across services.json, pricingData.json, team.json, AboutPage, AboutText,
  Faq, BlogPage. "Built from scratch" now appears where it is the point (hero, AboutHeading,
  marquee, the /projects tagline, the FAQ answer to the template question, one feature
  bullet) and nowhere else. The home "Selected Work" intro went from three paragraphs to two,
  each adding a fact the heading above it did not.
- ~~Pricing-page rows repeat the one-liner~~ **DONE 2026-09-02**: `/pricing` rows now preview
  what the ENTRY tier includes (first three deliverables, cut at the first clause break,
  marketing-framing lines like "Perfect for…" filtered out), derived from `pricingData.json`;
  `/services` keeps the one-liner.
- ~~"Most sites ship in under two weeks"~~ **SOFTENED 2026-09-02** in all three prose spots
  (About story, About values, home FAQ) to the shape of the truth without a hard number
  ("landing pages and first automations in days, full sites in a few weeks"). **OWNER
  CHECK:** the About page still shows a `<2wk · Avg. turnaround` STAT TILE (and `19+` clients,
  `0` templates) — those are the owner's own operational numbers, left untouched; confirm or
  drop.

**Smaller code consistency gaps** — **ALL DONE 2026-09-02**: `AboutHeading.js` scoped in
`gsap.context` with a root ref; `CursorWave.js` RAF loop IO-gated (200px rootMargin);
`MagneticButton`/`HoverPeek` use the house `useReducedMotion`; `CaseStudyTiles.js` reads
`motionTokens.js` (y 30→24 to match the token).

**AI-writing pass (Wikipedia:Signs_of_AI_writing), same evening:** site copy scanned clean on
every hard tell; the one outlier, the Core Web Vitals post (textbook "In the fast-paced digital
landscape…" opener, unsourced industry stats, retired FID metric), rewritten around the studio's
own sourced case-study figures; 8 heading-level skips fixed (pricing tier cards h3→h2/h4→h3,
home testimonial name h4→h3); five rhythm triads thinned on marketing prose. Repeatable check:
`scripts/ai-writing-scan.py`.

**REFRESH-1 status: everything actionable is done or owner-skipped. Open only: the owner
check on the About stat tiles above.**

## GA-1 — CLOSED 2026-08-04 (outcome in summary.md)
`generate_lead` starred. `email_click` / `phone_click` deliberately left unstarred by the owner:
they never landed a processed hit (absent from Recent events entirely, not merely unstarred), and
the two lead paths that matter — contact form and book-a-call — are already key events. They
still record as regular events. Reopen only if a conversion metric on mailto:/tel: is wanted;
that needs a hit from outside the filtered IP, then ≤24h before the star is available.

## DEP-1 — react-router 7 (3 moderate advisories) — BLOCKED UPSTREAM, accepted risk
**Decision 2026-08-03: stay on 6.30.4. Do not retry until the watch condition below flips.**

Open: GHSA-wrjc-x8rr-h8h6 (open redirect via backslash in `<Link>`/`useNavigate`),
GHSA-337j-9hxr-rhxg (arbitrary constructor injection via `deserializeErrors()` in SSR
hydration), and a third on `react-router-dom` — "open redirect leading to XSS" (same
open-redirect class, same mitigation reasoning below).

**Count note (2026-08-04):** GitHub's push warning says **3 vulnerabilities**, `npm audit`
says **2** — they count different things. npm counts affected PACKAGES (`react-router`,
`react-router-dom`); GitHub counts ADVISORIES. Neither number is wrong; this ticket previously
recorded only 2 advisories and was incomplete. Don't "reconcile" them again — check
`npm audit --json` and read the `via` arrays. Fixed only in react-router **7.17.1+** — there is **no 6.x backport** (6.30.4 is
the end of the 6 line), so `npm audit fix` can never clear these.

**Why the upgrade is impossible today (tested, not assumed).** Installed
`react-router-dom@7.18.2` and ran a real build — it dies during SSG page rendering:

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server.js' is not defined
by "exports" in node_modules/react-router-dom/package.json
imported from node_modules/vite-react-ssg/dist/shared/vite-react-ssg.*.mjs
```

v7 collapsed `react-router-dom` into a thin re-export of `react-router` whose exports map is
only `"."` and `"./package.json"` — the `/server` subpath is gone. `vite-react-ssg` imports
`react-router-dom/server` for `createStaticHandler`, `createStaticRouter` and
`StaticRouterProvider`, i.e. the entire static-rendering path. And its LATEST release (0.9.2,
the only dist-tag) still declares `peerDependencies: react-router-dom ^6.14.1` — no v7 support
exists in any published version or prerelease. A Vite alias cannot patch it either: the
failing import runs in vite-react-ssg's own Node process at build time, not through Vite's
resolver. The lockfile/build were restored afterwards and verified (36 routes, identical asset
hashes, entry-chunk marker intact).

**Why the accepted risk is genuinely small here** — both advisories need an attack surface
this architecture doesn't have:
- *Open redirect*: requires navigating to an attacker-controlled path. The only `navigate()`
  call is `StaggeredMenu.js` with a `to` from `src/data/navigation.js`; every `<Link to>` is a
  literal or built from our own `projects.json`/`posts.json` slugs. No `?next=`/`?redirect=`
  parameter is read anywhere, and there is no auth flow.
- *`deserializeErrors()`*: requires a per-request SSR response an attacker can influence. This
  site is fully static — `__staticRouterHydrationData` is baked at build time from our own
  data and served as immutable files from Netlify. There is no runtime server to poison.

**Watch condition** (one command, re-check when Dependabot nags):
`npm view vite-react-ssg peerDependencies.react-router-dom` — when it accepts `^7`, do the
coordinated bump: router + SSG together, then re-verify route count, asset hashes, the
`__SCS_LANDING_PATHNAME__` entry-chunk marker, and hydration in a real browser on the
production build.

**Re-check 2026-08-14 — STILL BLOCKED, no action.** Watch condition returns `^6.14.1`;
`vite-react-ssg` latest is still 0.9.2 (only dist-tag), so no v7 support has shipped.
Re-confirmed the hydration reasoning against the actual build rather than assuming it:
`__staticRouterHydrationData` IS emitted into all 40 pages, but `errors` is `null` in every
one — the `deserializeErrors()` path exists yet receives nothing an attacker can influence.
GitHub lists the same 3 open alerts (GHSA-337j-9hxr-rhxg, GHSA-wrjc-x8rr-h8h6 on
`react-router`; GHSA-jjmj-jmhj-qwj2 on `react-router-dom`) — count unchanged, matching the
count note above.

**Dependabot PR #11 is a trap — do not merge, and do not read it as "the fix is available".**
It proposes `6.30.4 → 7.0.0`, which is *inside* the advisories' vulnerable range
(`6.0.0 – 7.17.0`, fixed only in 7.17.1+). It would break the SSG peer contract and still be
vulnerable. Dependabot targets the latest major, not the patched version.

**PR #11 WAS MERGED 2026-08-14 18:23 UTC and broke production. Reverted in `3a946de`.**
What actually happened, and the one correction to this ticket:
- Both deploys failed — the merge (`23f2c07`) and Dependabot's immediate follow-up PR #12
  (`ca20bc7`, `7.0.0 → 7.18.2`, i.e. the genuinely patched version). **Two different versions,
  identical failure: the blocker is v7 itself, not the version chosen.** That is the strongest
  evidence this ticket has.
- **Correction:** this ticket predicted the failure lands during SSG page rendering (the
  missing `react-router-dom/server` subpath). It actually lands EARLIER — Netlify's
  *"Install dependencies"* stage, `npm ci` exiting 1 with `ERESOLVE`: `peerOptional
  react-router-dom@"^6.14.1" from vite-react-ssg@0.9.0` vs the locked 7.0.0. The render-stage
  failure is real but unreachable, because install never completes. Both are the same root
  cause; only the tripwire differs. (The earlier test presumably installed with `--force` or
  `--legacy-peer-deps`, which skips the peer gate and defers the failure to render.)
- **Blast radius was small: the live site never went down.** A failed Netlify build keeps the
  last good deploy, so production simply froze at `0913bc1` (2026-08-13) for ~4h — the cost was
  "no new deploys", not an outage. Check `netlify api listSiteDeploys` before assuming worse.
- **Recurrence is now blocked in `.github/dependabot.yml`** (created in the same fix; the repo
  previously had no Dependabot config at all, which is why the impossible major kept being
  proposed). Delete those ignore rules when the watch condition below flips.
- Revert verified by same-environment asset-hash equality: entry chunk came back as
  `app-CWVtVHOS.js`, byte-identical to the pre-merge verified build. Not merely "builds green".
- **The v7 pin made security STRICTLY WORSE, which is the most counter-intuitive part.** While
  `main` sat at react-router 7.0.0, GitHub opened **11 new alerts (8 high, 3 medium)** — every
  one `created=2026-08-14 / fixed=2026-08-14` with a vulnerable range starting at `>= 7.0.0`,
  because 7.0.0 is ~a year behind and carries its own advisory set. The merge therefore traded
  3 moderate advisories for 14 (8 of them HIGH) *and* broke the deploy. General law: **"upgrade
  to fix a CVE" can raise your exposure if the target version is itself stale — compare the
  advisory counts of BOTH versions, not just the fixed-range boundary of the one you're on.**
- Verification trap seen here: the `git push` banner reported "15 vulnerabilities (10 high, 5
  moderate)" while the alerts API showed 3 open. The banner is computed at push time and lagged
  the rescan. Trust `gh api .../dependabot/alerts --jq 'select(.state=="open")'`, not the banner.
- PR #12 closed 2026-08-14 with the full reasoning in its comment; no open PRs remain.

**2026-09-11 — the 08-14 guard never covered security updates. Fixed; still BLOCKED upstream.**
Dependabot opened **security** PR #16 (`react-router 6.30.4 → 7.18.3`, grouped as
"npm_and_yarn group across 0 directory"; closed unmerged) straight through the ignore rules.
Cause: the rules used `update-types: ["version-update:semver-major"]`, and GitHub's docs say
"`update-types` only affects *version* updates, not *security* updates. Security updates will
always be created regardless of the `update-types` setting." (docs.github.com → Controlling
which dependencies are updated by Dependabot.) With `open-pull-requests-limit: 0` the repo
gets ONLY security updates, so the guard was filtering a PR stream that never existed. The
2026-08-14 line above ("Recurrence is now blocked") was therefore wrong; it held only because
no security run fired in between (#14 on 09-02 bumped other packages). Rules now use
`versions: [">= 7.0.0"]` for `react-router` and `react-router-dom`, which filters candidate
versions for both update kinds. Watch condition re-run 2026-09-11: `vite-react-ssg` 0.9.2,
`peerDependencies.react-router-dom = '^6.14.1'` — unchanged. Still 3 open router alerts
(#81, #82 on `react-router`; #100 on `react-router-dom`). Confirmation after merge: Insights →
Dependency graph → Dependabot → "Check for updates" on the npm entry, then the security run on
the next alert; no react-router PR should appear, and the job log should show the ignore.

## SEC-1 — I leaked a host path into this PUBLIC repo, and it is in pushed history
**Logged 2026-08-06. Fixed forward; the history decision is Moses's.**

While writing up the Studio audit I quoted the offending commit subject *verbatim* into
`CLAUDE.md` and `.audit/summary.md` — naming the absolute path of the VPS's consolidated
secrets file — in the course of a rule that says not to publish exactly that. Both files are
tracked in this repo, which is public, and the commits were pushed before anyone noticed.

**Scrubbed forward** (this commit): both files now describe the CLASS of disclosure
("a consolidated secrets file, named outright in one commit SUBJECT") without the path. The
same pass removed pre-existing container names and a loopback port from the SCS-1 ticket above.

**Still exposed in git history.** Severity is low — it is a filename, not a credential, and it
only has value to someone who already has root — but it is genuinely exposed and will stay so
unless the history is rewritten. Options: (a) accept it, since the path is guessable and the
disclosure enables nothing on its own; (b) `git filter-repo` + force-push, which rewrites shared
history and may not remove what has already been mirrored or scraped. **Recommendation: (a),
plus rotating the contents of that file if it has not been rotated recently** — rotation is the
control that actually matters here, not the path's secrecy.

**Rule that failed and needs to hold:** `.audit/**` and `CLAUDE.md` are PUBLIC. Anything
VPS-specific — paths, container names, bridge/interface names, ports, hostnames, IPs — belongs in
the gitignored private docs, never here. When writing up a security finding, describe the shape
of the problem, never quote the artifact.

## ZAHAV-1 — mobile speed: the remaining bottleneck is document weight
**Logged 2026-08-06.**

Re-measured 2026-08-05: desktop holds at 99 (LCP 1.0s, CLS 0) but mobile medians **69** against
88 in July, LCP ~7.0s vs 3.4s. The July optimisation work is verifiably still in place — hero
preload intact, the heavy addon stylesheet still removed, and **zero** render-blocking
stylesheets in `<head>` (count with `<noscript>` fallbacks EXCLUDED; a naive count says 13 and
is wrong).

Remaining bottleneck is the document itself: a **323KB `<head>`** with 28 inline `<style>`
blocks, ~127KB gzip. That only costs on PSI's throttled mobile test, which is exactly why
desktop is untouched. Fixing it is the one thing standing between the case study and a
defensible mobile claim; today the page deliberately claims desktop only.

Measurement protocol is non-negotiable here and is recorded in the client workspace: warm the
site in a real browser first, run PSI at least twice, and treat a single run as noise — three
runs today spread 65/77/69. Also note Lighthouse moved to 13.4.1 since the July runs, so some of
the gap may be scoring drift rather than the site.

## ZAHAV-2 — bookings and ROAS need source data before they can be republished
**Logged 2026-08-06. Owner action.**

The case study previously published "↑28% appointment bookings" and "3.2× return on Meta ad
spend". Neither has a source in the engagement workspace (which was SEO-only), so both were
retired rather than restated. To put them back:
- **Bookings:** appointment counts from the client's booking system for a period before the work
  and the same-length period after. CSV or dashboard screenshot.
- **ROAS:** Meta Ads Manager over the campaign dates, showing spend and conversion value.

Both come from the client, not from anything the studio holds. The page is strong without them —
three Google-verifiable scores beat five numbers where two invite a challenge — so this is
optional, not blocking.

## LINK-1 — point the site at the now-public Studio repo
**Logged 2026-08-06. Small.**

`scs-studio` is live and public (MIT). `/agents` already says the generation app Sage drives "is
the one we are open-sourcing" — that sentence now has a URL to point at. Also worth a link from
the Studio-related surfaces generally. Two-line data edit in `src/data/agents.json` plus whatever
copy change reads naturally.

## P3-1 — Phase 3 remainder (site assistant, Scout playground, Zahav results)
**Logged 2026-08-05. Three separate pieces of work, none of them small.**

**3.1 Studio assistant on the site.** The riskiest public surface in the plan and the one that
needs a session of its own. Non-negotiables, all from CLAUDE.md or the plan: key never reaches the
browser (proxy via a Netlify function or the VPS); server-side rate limit AND spend cap, because a
public endpoint with a key behind it is an invoice waiting to happen; every answer grounded in
`pricingData.json` / `services.json` / `projects.json` / `posts.json`, since a hallucinated quote
is a commercial promise; labelled as AI, because disclosure is the entire exhibit; new
`connect-src` in `netlify.toml` **exercised on the real post-consent flow**, not just first load
(GA was dead for months on exactly that mistake); user input treated as a prompt-injection surface,
so prefer retrieval over tools. The widget import must be gesture- or IO-gated with a fixed-size
slot — `React.lazy` alone does not defer, and a chat widget on the critical path is what killed
LCP here before.

**B Scout preview playground.** See the SCS-1 correction: the hostname is now public behind basic
auth. Before that gate comes off it needs a spend cap, rate limiting, no real client data, and
isolation from the production Postgres.

**C Zahav before/after SEO.** Moses confirmed 2026-08-05 he has Sean's written consent. That
unblocks publishing but does not change what may be published: derived aggregates only — charts,
deltas, timeframes. Never the raw GSC exports, the page-level dumps, or the competitor-actionable
weakness inventory, which is why `zahav-audit` was made private in the first place. The source
data is in that private repo. This strengthens the Zahav case study; it is not one of 3.1-3.6.

**3.5 is blocked on data that does not exist.** Both agents were asked directly for an hours-saved
or response-time figure and both returned none. Do not invent one to fill the slot.

## SCS-1 — Add Scout to the projects page
**Logged 2026-08-04 at Moses's request. Blocked on product details, not on build work.**

Scout is a web-app service Moses plans to sell as a **monthly retainer** to clients. Details to
come from him; nothing is written yet and nothing should be invented.

What is already verifiable (checked on the VPS 2026-08-04): it runs as a small set of containers —
a web front end bound to loopback, a background worker, and its own Postgres.

**CORRECTION 2026-08-05: Scout now HAS a public route.** `scout.switchcasestudio.com` resolves
and is served by Traefik with a `scout-auth` basic-auth middleware — unauthenticated requests get
`401 www-authenticate: Basic realm="traefik"`. So the "not publicly reachable" line above was true
on 08-04 and is stale now: the hostname is public and discoverable (it is in certificate
transparency logs whether or not anyone links it), and the only thing between a visitor and Scout
is HTTP basic auth. That is fine for a private preview and NOT fine as the playground's only
control — the playground still needs its own spend cap, rate limiting, and isolation from the
production Postgres before the auth gate comes off. Re-check this field before writing anything
public about Scout; it changed within a day.

**Business model (Moses, 2026-08-04):** Scout ships as a **paid** product with a public
**"preview" playground** — a sandboxed environment, NOT the real version. The playground is a
public abusable surface: it needs a spend cap, rate limiting, no real client data, and isolation
from the production Postgres before it goes live. Sibling decision: **Studio** (the video-gen app
at studio.switchcasestudio.com, repo currently PRIVATE with no LICENSE) is going **open source** —
that needs a full-history secret sweep and a licence first, per the zahav-audit lesson.

Before it can ship as a case study / project tile, Moses needs to supply: what it does for a
client, who it's for, the retainer framing, and whether there'll be a public URL or a demo. The
projects page is data-driven (`src/data/projects.json`), so once that exists it's a data edit
plus art — see the Jelly Belly entry for the shape (`repos`, `links`, `diagram`, `metrics` are
all optional and render only when present).

Note it is a PRODUCT, not client work — the "Studio Project" labelling question from dropped
action-plan item 1.4 applies to it too.

## Decisions — do NOT re-raise
- **The two Éclore repos stay public (Moses, 2026-08-04).** The 2026-08-04 sweep flagged
  `eclore-new-swiss-theme` ("Private design prototype" in its own README) and
  `eclore-before-after` ("for partner review", carries the clinic's interior photos +
  floor plan) as the same intent-private/visibility-public pattern as `zahav-audit`. Moses
  reviewed the actual contents and confirmed there is nothing sensitive in either. Closed. The
  README wording is what triggered the flag, so a future sweep will hit them again — this note
  is the answer.
- **Action-plan 1.4 is DROPPED, permanently, with the reason recorded (Moses, 2026-08-04).**
  The partner disclosure under Ori Argaman and Yuli is not happening: "nobody needs to know that
  they are now my business partners." This is the reason the ticket had been missing for four
  sessions. Do not re-open it, do not re-ask. The OTHER half of 1.4 (labelling Jelly Belly Wiki
  and Birth of Venus "Studio project") shipped 2026-08-04 and is unaffected.

- **No per-package pricing pages (Moses, 2026-09-26).** Asked whether each package (tier)
  should get its own URL under `/pricing/<service>/`. Decided no: a package page would be the
  board's column plus its full list, i.e. 17 thin near-duplicate pages to keep in sync with
  `pricingData.json`, and the visitor's next step is a call, not more reading. Instead the
  board carries an anchor per package (`/pricing/design-branding#brand-starter-kit`, column
  lights up, its full list opens) and a "Seen in" row linking a shipped case study whose scope
  matches (Brand System & Launch → My Challah Dealer; the other two have none yet, by the
  owner's call). Revisit only when a tier has 2+ shipped examples and its own questions;
  Unhurried Pro already has a page because it is a product with real content.

## Notes that will bite the next person
- **Canonical personal name is "Moses Atia Poston"** (decided 2026-08-04). It is the byline on
  every blog post (`posts.json` + the `add-post.mjs` default), the rule in Beau's
  `JOURNAL-QUEST.md` on the VPS, and the GitHub profile README. Three spellings were in public at
  once ("Moses Atia", "Moses Poston", "Moses Atia Poston"), which splits the one entity the
  findability plan depends on. Any NEW surface that names him uses the full form.
- **Client footer backlinks (action-plan 1.3) are MOSES'S to finish — do not re-raise.** Verified
  2026-08-04: zahavmedspa, crimsonequities, prodanimiami and sha-design all carry a followed
  link (sha-design's is JS-rendered); jomarketing11 and floridaenergyassistance do not. He is
  handling the two.
- **The internal-traffic data filter is ACTIVE and its "Testing" state is gone for good.**
  Once a GA4 data filter has been Active, GA offers only Active/Inactive — reverting to
  Testing is not possible. To make owner-side test hits visible again you must flip the
  filter to **Inactive**, fire the hits, then flip it back to **Active** (each activation
  re-shows the "destructive and irreversible" confirm). Done twice on 2026-08-03.
- The filter matches the owner's public IP as `/32` CIDR. Residential IPs rotate: if it
  changes, owner visits start counting again AND the old IP (if reassigned) silently excludes
  a stranger's visits. Re-check the rule if the numbers ever look odd.
- Verifying the contact form without emailing anyone: stub `XMLHttpRequest.prototype.send` +
  `window.fetch` for `api.emailjs.com` to fake a 200, then fill and submit. `trackEvent` fires
  synchronously in the submit gesture stack BEFORE EmailJS, so the GA path is unaffected by
  the stub. Used on 2026-08-03; the form's consent control is a `<button
  class="contact-form__checkbox">`, NOT an `input[type=checkbox]`.
