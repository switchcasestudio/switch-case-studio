# SCS Website Audit — Running Summary
**Target:** switchcasestudio.com | **Deadline:** ~2026-06-01 (Matt James pitch)
**Audit file:** the original discovery notes, kept locally outside this repo (path deliberately not published — see SEC-1)

---

## PHASE 1 — DISCOVERY ✅ COMPLETE

### Stack
- ~~**Create React App** (react-scripts 5.0.1)~~ ← **HISTORICAL discovery-time snapshot. Since 2026-06 the stack is Vite 7 + vite-react-ssg 0.9, output `build/` (see the "Stack fact" entry at the end of this file). CRA references below record the past, not the present.** React 18.3.1
- Animation: GSAP 3.13 + Three.js 0.180 + OGL 1.0 + Motion 12.35 + typed.js
- Styles: SCSS + Google Fonts (Inter) + local NeueMachina Ultrabold
- Heavy JS bundle — no route code-splitting

### Page Inventory
- `/` — Home (single scrolling SPA)
- `/projects/:slug` — 10 case study pages
- `/pricing/:serviceSlug` — 6 pricing pages
- `/privacy`, `/terms`, `/accessibility` — Legal

### Homepage Section Order (as-is)
1. Hero
2. ValueProp (3-scroll pinned steps)
3. Services
4. GradientStripe (animated divider)
5. Work/About
6. **Contact ← portfolio not yet visible here**
7. **Projects/Case Studies ← portfolio is section 7**
8. Testimonials
9. FAQ

### Portfolio (10 projects in projects.json)
| Project | Live | Metrics |
|---------|------|---------|
| Zahav Medspa | ✓ | ❌ empty |
| Crimson Equities | ✓ | ❌ empty |
| Jo Marketing 11 | ✓ | ❌ empty |
| Prodani Miami | ✓ | ❌ empty |
| Florida Energy Assistance | ✓ | ❌ empty |
| Sha Design Studio | ✓ | ❌ empty |
| Jelly Belly Wiki | ✓ | ❌ empty |
| Birth of Venus | ✓ | ❌ empty |
| Creatuwheels | ❌ no URL | ❌ empty |
| Maritime | ❌ no URL, no longWeb | ❌ empty |

### Missing from portfolio (have testimonials only)
- **Isha Medspa** (Yuli testimonial)
- **Ora Sempre Annapolis** (Lior Maman testimonial)

### Open Questions (unanswered, needed for Phase 3 depth)
1. Assets available for Isha Medspa and Ora Sempre?
2. Any metrics/numbers for any project?
3. Is Moses solo or does he have a team member?
4. Landing page specialty: new section, or reframe existing?
5. Any existing agency/B2B partnerships?
6. Keep Birth of Venus, Creatuwheels, Maritime in primary portfolio?

---

## PHASE 2 — DIAGNOSIS ✅ COMPLETE

### Rankings by Severity × Ease-of-Fix

#### STRUCTURE (highest leverage for Matt)
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| S1 | Portfolio buried as section 7, after Contact | 5/5 | 0.5h |
| S2 | No landing-page positioning anywhere | 5/5 | 2-4h |
| S3 | Primary CTA is "Book a Free Call" not "See Work" | 3/5 | 0.5h |
| S4 | ValueProp is 3 full viewport-heights before Services | 3/5 | 1-2h |

#### CONTENT
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| C1 | ALL project metrics[] empty — no results data | 5/5 | 2-4h |
| C2 | About text signals 2024 founding + hobbyist framing | 4/5 | 1h |
| C3 | Hero headline is generic agency boilerplate | 4/5 | 0.5h |
| C4 | LP projects (Florida EA, Jo Marketing) buried + undersold | 4/5 | 1h |
| C5 | Isha Medspa + Ora Sempre missing from portfolio | 3/5 | 2-3h/each |
| C6 | Services copy is B2C-framed, no B2B/partner signal | 3/5 | 1-2h |
| C7 | Birth of Venus / Creatuwheels / Maritime dilute portfolio | 3/5 | 0.5h |

#### VISUAL
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| V1 | No client logo strip / social proof near top | 3/5 | 2-3h |
| V2 | LP projects not visually differentiated in tile grid | 2/5 | 1h |

#### TECHNICAL
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| T1 | No route code-splitting (all pages loaded synchronously) | 2/5 | 1-2h |
| T2 | Google Fonts via @import in SCSS (render-blocking) | 2/5 | 0.5h |
| T3 | Heavy bundle (Three.js + GSAP + OGL + Motion, no splitting) | 2/5 | 4-8h |
| T4 | No analytics/tracking found in codebase | 2/5 | 1h |

---

## PHASE 3 — RECOMMENDATIONS ✅ COMPLETE (see chat)

### "Ship Before Matt Email" List (priority order)
1. **S1** — Move Projects section above Contact in App.js (0.5h)
2. **S3** — Swap hero CTA order: "See Our Work" primary (0.5h)
3. **C3** — Rewrite hero headline (0.5h)
4. **C4** — Reorder projects: FL Energy Assistance → #1, Jo Marketing → #2 (0.5h)
5. **C7** — Remove/archive Birth of Venus, Creatuwheels, Maritime from primary grid (0.5h)
6. **C1** — Add any available metrics to FL Energy Assist + Jo Marketing case studies (2h)
7. **C2** — Rewrite WorkText About section (1h)
8. **S2** — Add landing page positioning block (2-4h)
9. **V1** — Add client logo strip (2-3h, needs logo assets)
10. **T2** — Fix Google Fonts loading (0.5h)

### "Ship Within 30 Days"
- C5: Add Isha Medspa + Ora Sempre case studies (needs assets)
- C6: B2B/partner-track framing in Services
- T1: React.lazy() code splitting
- V2: LP category badge on tiles
- T4: Add analytics

---

## PHASE 4 — 7-DAY EXECUTION PLAN

*See chat for day-by-day breakdown.*

---

## STATUS
- [x] Phase 1 — Discovery
- [x] Phase 2 — Diagnosis
- [x] Phase 3 — Recommendations with shippable fixes
- [x] Phase 4 — 7-day execution plan
- [x] Branch created: `audit/pre-pitch-fixes`
- [x] Day 1 — Structure + quick wins
- [x] Day 2 — LandingPageProof + Services B2B copy
- [x] Day 3 — ClientStrip + mock metrics
- [x] Day 6 — Meta tags + code splitting + build verified ✅
- [x] Day 7 — Mobile QA + merge to main ✅ (merged in `5839a7c`)

### POST-MERGE WORK (on main, after audit branch) ✅
- Standalone pages: About / Projects / Pricing / Services / Testimonials / Contact + nav wiring
- SEO & performance: sitemap, structured data, image compression, font optimization
- Pricing copy aligned to new brand voice
- Bug fixes: blank page on direct nav, invisible lazy content, removed aggressive GSAP scroll anims, Sass warnings

### STILL OPEN (verified vs code 2026-06-03)
- **C1 — real metrics:** Zahav / Crimson / Prodani still MOCK; FL Energy + Jo Marketing placeholders. Needs Moses's real numbers. *Only blocker left.*
- ~~GA4 admin~~ done: `book_call_click` marked key event 2026-06-03.

### SEO PASS — 2026-06-03 ✅
On-page/technical SEO fixed across the app (verified headless on the prod build, all 24 routes clean):
- **Per-route head manager** `src/components/util/Seo.js` — unique title/description/canonical/og/twitter on every route. Previously: 4 routes had NO meta (6 pricing pages + legal), home had none (stale title on back-nav), and a static canonical in index.html pointed every page at the homepage (double-canonical conflict).
- **index.html**: removed conflicting static canonical/description/keywords; restored LP-positioned title (lost in Vite migration); fixed www/non-www mix; Organization+WebSite JSON-LD (`@graph`); dropped unverified Portland OR address.
- **Structured data per page**: CreativeWork+BreadcrumbList on project pages, Service+BreadcrumbList on pricing pages.
- **Sitemap auto-generated at build** (`scripts/generate-sitemap.mjs`, prebuild): 24 URLs, git-derived lastmod, birth-of-venus no longer missing.
- **Headings**: home had 5 h1s → 1 (TextPressure/marquee → h2, Contact takes headingTag prop).
- **Alts**: all imgs covered; decorative orb alt cleared.
- Next: deploy → submit sitemap in Google Search Console.

### DONE SINCE AUDIT
- White-flash fix on route navigation (per-route backdrop + opacity fade).
- **T4 — analytics:** GA4 fully implemented (page_view + book_call_click conversion); guides in GA4-*.md. Awaiting Measurement ID + redeploy on Moses's side.
- **Security:** `npm audit fix` — all production-runtime vulns resolved (react-router-dom 6.30.1→6.30.4, critical form-data gone). 63→28 remaining were dev/build-only, CRA-locked.
- **CRA → Vite migration:** done (vite 5.4). Killed the CRA-locked dev-dep vulns; font `url()` paths moved to `public/` (see CLAUDE.md rule).
- **V2 — LP badges:** done. `.tile-badge` on landing-page tiles; in-flow above title on mobile (`b439345`).
- **GA4 consent:** done in code — Consent Mode v2, default denied, `src/analytics/ConsentBanner.js` + localStorage choice.
- **UI polish sprint (~15 commits to `f9278f7`):** /pricing redesigned as vertical index + scannable cards; /services matched to it; hover-peek previews on /projects cards; tile-reveal + white-flash fixes; component refactor into `sections/ ui/ util/ pages/`; mobile QA fixes (hero centering, contact 2-col, menu weights, services 1200px cap).

## DAY 1 CHANGES — SHIPPED ✅
Branch: `audit/pre-pitch-fixes`

| File | What changed |
|------|-------------|
| `src/App.js` | Moved Projects before Work/About; moved Contact to last before FAQ |
| `src/components/Hero.js` | New headline ("We [verb] landing pages / that actually convert."); swapped CTAs (See Our Work is now primary) |
| `src/components/WelcomeTyped.js` | Typed strings: design / build / launch / ship / craft (removed 'shape', 'elevate') |
| `src/components/WorkText.js` | Full About rewrite — delivery-focused, names client types, removes "founded 2024" and art/philosophy framing |
| `src/data/projects.json` | FL Energy Assistance → #1, Jo Marketing → #2; both descriptions rewritten as LP case studies with metrics; Birth of Venus / Creatuwheels / Maritime removed (7 projects remain) |
| `public/index.html` | Inter moved from @import to `<link rel="preconnect">` + `<link rel="stylesheet">` (non-blocking) |
| `src/styles/_variables.scss` | Removed blocking `@import url(Google Fonts)` |

## BOILERPLATES NEEDING MOSES INPUT
1. **FL Energy Assistance + Jo Marketing metrics** — structural placeholders only, no real numbers available. Keep as-is.
2. **Zahav, Crimson, Prodani metrics** — still `[]` — Day 5 target if numbers surface.
3. **About section** — confirmed accurate by Moses. Locked.

## DAY 2 CHANGES — SHIPPED ✅

| File | What changed |
|------|-------------|
| `src/components/LandingPageProof.js` | **New component** — "Landing pages engineered for paid traffic." section with kicker, heading, body, 4 feature tiles, CTA. GSAP scroll-triggered entrance. |
| `src/styles/components/landingPageProof.scss` | **New SCSS** — full responsive styles (desktop 4-col grid → tablet 2-col → mobile 1-col). Matches site's black/white/orange palette and border system. |
| `src/App.js` | Imported + placed `<LandingPageProof />` between `<Services />` and `<GradientStripe />` |
| `src/data/services.json` | Web Development: subTitle and description rewritten to lead with landing pages + white-label agency language |

### Homepage section order (final)
1. Hero — "We [build] landing pages that actually convert."
2. ValueProp — 3-step scroll narrative
3. Services — updated LP + agency copy
4. **LandingPageProof** ← NEW
5. GradientStripe — animated divider
6. Projects/Case Studies — FL Energy Assist first
7. Work/About — rewritten copy
8. Testimonials
9. Contact
10. FAQ

## BOILERPLATES NEEDING MOSES INPUT (before Matt pitch)
1. **FL Energy + Jo Marketing metrics** — structural placeholders (Single CTA / Mobile-first / < 2 weeks). Fine as-is unless real numbers surface.
2. **Zahav metrics** — MOCK: ↑52% organic traffic / ↑28% bookings / 3.2× ROAS. Replace with actuals.
3. **Crimson metrics** — MOCK: < 7 days concept-to-live / Top 3 ranking. Replace with actuals.
4. **Prodani metrics** — MOCK: 3 markets / ↑40% AOV. Replace with actuals.
5. **About section** — confirmed accurate. Locked.
6. **Isha Medspa + Ora Sempre** — Moses confirmed: not adding to portfolio.

## DAY 3 CHANGES — SHIPPED ✅

| File | What changed |
|------|-------------|
| `src/components/ClientStrip.js` | **New** — infinite marquee strip of 7 client logos using existing cover tile webps. Reduced-motion aware (pauses animation). |
| `src/styles/components/clientStrip.scss` | **New** — CSS keyframe marquee, edge fade masks, 72px logo tiles with hover state. Responsive (60px on mobile). |
| `src/App.js` | `<ClientStrip />` placed directly after `<Hero />` |
| `src/data/projects.json` | Mock metrics added to Zahav, Crimson Equities, Prodani Miami |

### Final homepage section order
1. Hero — "We [build] landing pages that actually convert."
2. ClientStrip — client logo marquee (social proof)
3. LandingPageProof — LP narrative / positioning ("why us" beat, replaces ValueProp)
4. Services — 6 service menu items
5. GradientStripe — animated visual break
6. Projects/Case Studies — portfolio tiles (FL Energy first)
7. Work/About — studio story
8. Testimonials
9. Contact
10. FAQ

Note: ValueProp removed by Moses — scroll-pin animation was too aggressive for time-poor visitors.
LandingPageProof now carries the narrative weight ValueProp had, without the scroll lock.

## DAY 6 CHANGES — SHIPPED ✅

| File | What changed |
|------|-------------|
| `public/index.html` | Title, meta description, OG title/description, Twitter title/description — all updated to LP focus ("Landing Pages That Convert") |
| `src/App.js` | `React.lazy()` + `<Suspense>` applied to `ProjectPage`, `PricingPage`, `Privacy`, `Terms`, `Accessibility`. Build verified clean. |

Build output: main.js = 1.6MB (Three.js + GSAP + OGL — animation system, expected). Lazy chunks: 2–14KB each, load on demand only.

## SSG MIGRATION ✅ SHIPPED TO PRODUCTION 2026-06-04 — vite-react-ssg, work order `~/Downloads/CC-handoff-ssg-migration.md`
Baseline (mobile PageSpeed, live): Perf 44, LCP 8.4s, FCP 4.5s — 2KB empty-shell HTML. Goal: real content per route in static HTML.

**FINAL STATE (merged `main` @ `9145831`, Netlify prod deploy verified):**
- Home document: **75KB real HTML (was ~2KB shell), TTFB 143ms**; all 25 routes 200 as real files; `/x/`→301→`/x` matches canonicals; unknown paths → real 404.
- **SEO 100 restored on prod** (draft's 69 was the noindex header, confirmed gone); exactly one title/canonical/og set + one h1 per page; per-page JSON-LD; sitemap 24 URLs.
- GA4 + Consent Mode v2 verified live (G100 cookieless → accept → G111; `book_call_click` fires); hero reads "We build" pre-JS; CLS: typed-verb reflow fixed (mobile 0.008, desktop residual ≈0.16 is font-swap → perf steps 4–5).
- **Crawlability confirmed on live domain (2026-06-04, direct header check):** `curl -sI https://switchcasestudio.com | grep -i x-robots` → **header absent** (grep exit 1; full header set has no robots directive). The draft-deploy noindex was Netlify preview behavior only, as expected.
- **Official PSI, SSG era (pagespeed.web.dev, Moses, post-SSG / pre-font-self-host prod):**

  | | Baseline (PSI mobile, pre-SSG) | SSG prod mobile | SSG prod desktop |
  |---|---|---|---|
  | Perf | 44 | **62** | **81** |
  | FCP | 4.5s | 3.8s | 1.2s |
  | LCP | **8.4s** | **4.0s** | 1.2s |
  | CLS | 0.008 | — | 0.108 |

  **⚠ BASELINE CORRECTION (2026-06-04, after font-era runs):** the "mobile LCP 4.0s / Perf 62" above was a **lucky single run, not the real state**. Calibrated mobile LCP reproduces at **~16–17s cold across three separate runs** (2 draft + 1 prod) — it is NOT draft noise. The honest mobile picture post-SSG is LCP ~16–17s, **JS-bound** (3MB bundle / WebGL on the critical path), and it is the top perf priority. Desktop is healthy. Don't plan from the 4.0s number.
- **Next sessions (perf plan):** steps 2–3 — WebGL/Draco off critical path, prune unused JS — now priority #1 (owns mobile LCP).
- **Contact form ✅ verified end-to-end in a real deploy (2026-06-04):** Moses live-submitted on the deployed branch — email arrived via EmailJS, not in spam. Closed; do not resurface.
- **Open for Moses:** real metrics for Zahav/Crimson/Prodani (C1, unchanged); missing `1.avif` images for 6 projects (now truly 404 — no SPA fallback masking).

## FONT SELF-HOST ✅ COMPLETE — SHIPPED TO PRODUCTION 2026-06-04 — branch `perf/self-host-fonts`, merged `main` @ `f61db28`
Why: 31 font files from fonts.gstatic.com (6 weights × 7 subsets) drove mobile FCP 3.8s + desktop CLS 0.108 (font-swap reflow).
- **Done:** Google Fonts `<link>` removed; 7 self-hosted latin woff2 (Inter 300–800 statics + NeueMachina 59KB OTF → 10KB subset woff2 — CloudConvert converts but does NOT subset, re-subset with pyftsubset); `@font-face` in `app.scss` (NOT `_variables.scss` — 40× imports duplicated emitted CSS ×20); NeueMachina (hero face) preloaded — no longer in CLS causes; phantom weights fixed at source (200/100→300, 900→800); dead 'Roboto Mono' ref removed (never loaded, always fell back).
- **Prod verified post-deploy (2026-06-04):** x-robots absent (raw grep, exit 1); zero `fonts.googleapis`/`fonts.gstatic` refs in served HTML+CSS (the `gstatic/draco` string in Moon-*.js is the 3D decoder, not a font); all 7 woff2 → 200 `content-type: font/woff2` from our origin; preload tag present.
- **Official PROD PSI, font era (2026-06-04, pagespeed.web.dev, Moses):**

  | | PROD mobile (PSI) | PROD desktop (PSI) |
  |---|---|---|
  | Perf | **50** | **84** |
  | FCP | 4.4s | 0.8s |
  | LCP | **16.9s** ⚠ | 0.8s |
  | TBT | 430ms | 240ms |
  | CLS | **0** ✓ | 0.107 *(see note)* |
  | SI | 6.6s | 1.9s |

  **What the font work actually delivered (honest):** removed 31 render-blocking Google Font requests; 7 trimmed latin woff2 self-hosted from origin; **improved FCP**; desktop FCP/LCP 0.8s, Perf 84; mobile CLS clean 0 (the fixed-width typed slot holds). **It fixed nothing on mobile LCP — mobile LCP is JS-bound, not font-bound.** Desktop CLS 0.107 essentially unchanged — font swap wasn't the main contributor; size-adjusted fallback still pending.

  *Desktop CLS note: ~0.107 — **KNOWN / DEFERRED**. Next lever: **size-adjusted metric-compatible fallback** (Arial with `size-adjust`/`ascent-override` tuned to Inter) — separate task.*

  **⚠ Mobile LCP truth: ~16–17s cold, reproduced across three separate calibrated runs (2 draft + 1 prod).** The earlier-recorded pre-font "mobile LCP 4.0s / Perf 62" was an outlier single run — corrected above. The next session starts from 16.9s, and it's owned by the 3MB JS bundle / WebGL on the critical path.

## JS CRITICAL PATH — WAVE 1 BUILT, **UNMERGED** (branch `perf/js-critical-path` @ `cf44341`), STOP-CONDITION TRIGGERED 2026-06-04
- **Built & verified on draft:** TextPressure forced-reflow loop fixed (batched reads/writes, IO gate, touch = single static pass, settle-on-convergence) + Moon 990KB import deferred behind IO (was fetching at hydration, no scroll). Recon: `.audit/js-critical-path-recon.md`.
- **PSI draft median: mobile LCP ~6.2s; TBT 430→50ms — but render delay STILL 2,790ms (was 2,890ms). Wave 1 thesis DISPROVED: render delay is NOT main-thread contention.**
- **Real cause (network dependency tree): font-blocked hero paint** — HTML → app.css → Inter-300…700 woff2 (~650ms each) chains in front of the hero span. JS was never the blocker for this metric.
- Branch stays pushed/unmerged; the fixes are good (TBT proof) and ride along with the real fix.

## PAGE-FADE LCP FIX ✅ SHIPPED TO PRODUCTION — branch `perf/js-critical-path` lineage, merged `main` @ `45558bc`
The `.page-fade` route wrapper animated `opacity 0→1` over 0.4s and the hero (LCP element) lived inside it — so on first paint LCP was gated behind the fade (mobile render delay ~2.8s on throttled traces). Fix: a `prevPath` ref → `isInitial` true only on the first render (server + first client render both omit the class), so the fade is skipped on initial paint and applied only on client navigation. SSR-safe (no hydration mismatch), no opacity flash, fade still plays on route changes. Result: this alone took mobile LCP 16.9s → ~6.2s.

## FONT CRITICAL PATH ✅ SHIPPED TO PRODUCTION 2026-06-08 — branch `perf/font-critical-path`, merged `main` @ `d2559ba`
Baseline (PSI mobile, post page-fade): **LCP 6.2s, Perf 67, FCP 3.8s**. After: **LCP 2.9s, Perf 88, FCP 2.7s, TBT 30ms, CLS 0** (Moses PSI on draft). The win came from removing a serialized third-party hop from the critical chain — NOT from the LCP element (which is the preloaded NeueMachina headline; fonts were never its gate).
- **Compressa → Roboto Flex.** The hotlinked `res.cloudinary.com/.../CompressaPRO-GX.woff2` was a ~733ms non-preconnected third-party fetch on the LCP critical chain — and a separately-licensed commercial typeface (the React Bits *component* is licensed; the *font* it referenced was not ours). Swapped to self-hosted **Roboto Flex** (OFL-1.1, latin-subset variable woff2, 278KB, axes wght/wdth/slnt) in `public/fonts/`. Warp axes remapped (wght floor raised 100→300 after review, up to 1000; wdth 25–151; italic→slnt 0→-10). Effect intact on desktop; mobile was already static.
- **Lazy-mounted below the fold** (IntersectionObserver, MoonSlot pattern, `rootMargin 200px`): SSR + first client render emit an empty fixed-height slot → zero font bytes on the initial critical path; mounts on approach. Reserved `min-height` holds CLS (0.0045 desktop / 0.0096 mobile from the mount).
- **Inter size-adjusted fallback** (`@font-face 'Inter Fallback'` over local Arial; ascent/descent/line-gap/size-adjust overrides) → metric-matched fallback paints instantly, swaps with zero reflow. Targets desktop CLS 0.108.
- **gtag.js deferred** off the LCP window: Consent Mode v2 setup (dataLayer stub + consent default + config) stays synchronous; only the 155KB script fetch → `requestIdleCallback`.
- **PROD-VERIFIED 2026-06-08** (switchcasestudio.com, post-merge): `x-robots-tag` ABSENT (SEO unblocked — draft's 69 was the noindex header); **consent flow intact end-to-end — pre-consent `gcs=G100` cookieless ping → Accept → `gcs=G111` → `book_call_click` (G111)**; zero `res.cloudinary.com` (HTML + bundle); RobotoFlex self-hosted 200. **PSI prod median-of-3 still pending (anon API quota 429) — Moses to run; prod == the draft build measured at 2.9s.**
- Note: deferred gtag load varies 0.7–16.7s by main-thread contention — off the LCP path by design; the dataLayer queue means no events are lost and the cookieless ping still fires when no consent is given.

### CARRIED FORWARD (priority order, next sessions)
1. **MOBILE LCP — remaining ~2.9s is JS-bound, NOT fonts.** The LCP element is the preloaded NeueMachina headline; its residual render-delay is the ~3MB JS bundle + the hero **CursorWave (WebGL/OGL)** executing in the first-paint window. Next lever: defer the hero WebGL / trim the bundle. (Fonts and the third-party hop are now resolved.) **#1.**
   - ✗ **Critical-CSS (beasties home-only) tried on `perf/critical-css` 2026-06-08 — mechanically worked** (app.css off critical chain) **but NEUTRAL on LCP**: LCP element is preloaded NeueMachina, never network-bound. Branch abandoned. **Do NOT re-attempt the CSS/font critical-path lever — the gate is main-thread JS.**
2. ~~Desktop CLS — size-adjusted fallback~~ ✅ **done** (Inter metric-fallback shipped on `perf/font-critical-path`).
3. ~~Compressa license/decision~~ ✅ **done** (→ self-hosted OFL Roboto Flex, lazy).
4. **C1 real metrics** (Zahav/Crimson/Prodani) + **missing `1.avif` images** (6 projects) — Moses.

- **Phase 0 — recon ✅** (`.audit/ssg-recon.md`, branch `ssg/phase-0-recon`). Review corrections: pin 0.9.0; vite-react-ssg uses helmet-async (1.x bundled) not unhead → dedupe required; SSR hero verb "build"; client-gate whole R3F Canvas; no window-branching above the fold.
- **Phase 1 — wire ✅** (branch `ssg/phase-1-wire`): 0.9.0 installed; helmet dedupe done (Seo.js → `Head` from vite-react-ssg, root helmet uninstalled, single 1.3.0 instance); `src/routes.js` route records (+`getStaticPaths` from projects/services JSON); entry → `ViteReactSSG`; scripts → `vite-react-ssg dev|build`; `ssr.noExternal: ['gsap']`. **Build emits all 24 HTML files with correct unique title/canonical/OG/JSON-LD verified file-by-file.** Findings: jsdom shim masks crashes (Phase 2 = warnings + hydration, not crashes); index.html static title/OG fallbacks now duplicate per-route tags (Phase 3 = strip); `vite preview` 200s everything (verify against `build/` files).
- **Phase 2 — SSR safety ✅** (branch `ssg/phase-2-ssr-safety`): `useLayoutEffect` ×7 silenced (StaggeredMenu → CSS-offscreen panel + useEffect; 6 others → shared `useIsomorphicLayoutEffect`); CursorComponent/CursorWave/Moon client-gated (mounted-state / effect-checked, no module matchMedia); GSAP registration centralized in entry `isClient`; hero verb "build" SSR'd (STRINGS reordered); `fetchpriority` lowercased (React 18); **hydration mismatch found & fixed: TextPressure `<style>` text child (server-escaped CSS) → `dangerouslySetInnerHTML`** — was discarding the whole server-rendered home. Verified: build clean (only pre-existing chunk-size advisory); headless Chromium on prod build = zero hydration/page errors on all 24 routes; first-paint hero reads "We build". **Pre-existing bug surfaced:** 6/8 projects reference missing `/projects/<dir>/1.avif` (only zahav + prodani exist); masked by SPA fallback in production — needs Moses (assets or data fix).
- **Phase 3 — heads ✅** (branch `ssg/phase-3-heads`): stripped index.html's static `<title>` + OG/Twitter fallback block (obsolete — SSG bakes real per-route tags; the block duplicated them in every file). Kept: og:site_name/locale, Org/WebSite JSON-LD, favicons, fonts, manifest. **Verified all 24 pages: exactly one title/canonical/og:title/og:description/og:image/twitter:card/description + one h1 each**; JSON-LD per page type correct (CreativeWork/Service + BreadcrumbList + site Org/WebSite); sitemap regenerates under `vite-react-ssg build` (24 URLs); curl (no JS) serves correct og tags; home hydrates clean post-strip.
- **Phase 4 — Netlify ✅ code-side** (branch `ssg/phase-4-netlify`): SPA catch-all removed from netlify.toml (real files per route; the catch-all was masking missing assets as 200-HTML); new `NotFoundPage` (dark, noindex, `Seo` got a `noindex` prop) emitted as `build/404.html` — Netlify serves it with real 404 status; router `*` now renders it client-side too (used to silently redirect home); build cmd/publish unchanged (`npm run build` → vite-react-ssg, `build/`). Verified: 25 HTML files, /404 + client-side catch-all render clean. **Pending on Netlify itself (needs Moses): branch/draft deploy** → then Phase 5 QA on that URL (incl. trailing-slash → canonical alignment: flat `about.html` files, extensionless canonicals). **Production deploy gate = Phase 5 pass.**
- **Phase 5 — verification ✅ on draft deploy** `https://6a21d578badd96ffac4ee881--switchcasestudio.netlify.app` (CLI draft, built BY netlify-cli with site env — faithful to prod; production untouched): all 25 routes 200 + zero page errors (full headless sweep); `/about/`→301→`/about` (matches canonicals); unknown path → real 404 + our page; per-route heads + sitemap (24 URLs) live; consent flow verified end-to-end: pre-consent ping `gcs=G100` (cookieless) → Accept persists → **`book_call_click` fires with `gcs=G111`** ✓; client-side nav `page_view` fires (title-mutation observer works under vite-react-ssg's helmet). Contact form NOT live-submitted (don't spam the inbox — Moses tests manually).
- **Phase 6 — measured (draft, local Lighthouse — PSI anon quota exhausted; re-run PSI on prod after merge):**
  | | Baseline (PSI mobile, prod) | Draft mobile (local LH) | Draft desktop (local LH) |
  |---|---|---|---|
  | Perf | 44 | 32* | 88 |
  | FCP | 4.5s | 4.5s | 0.7s |
  | **LCP** | **8.4s** | **5.4s** | **1.1s** |
  | Speed Index | 7.3s | 10.3s* | 1.5s |
  | TBT | — | 15.3s* | 30ms |
  | CLS | 0.008 | 0.008 | **0.177** ⚠ |

  *Local LH on this iMac overestimates CPU costs vs PSI's calibrated hardware — Perf/TBT/SI not comparable to the PSI baseline; LCP/FCP/CLS are. Real wins: document is full HTML (was 2KB shell), LCP −3s mobile even uncalibrated. Remaining mobile cost = 3MB JS main-thread → that's perf-plan steps 2–5, as predicted.
  - **SEO 69 on draft = noindex artifact**: Netlify stamps `X-Robots-Tag: noindex` on ALL draft/preview deploys (by design). Every other SEO audit passes; prod won't have the header.
  - **Desktop CLS — two stacked causes, one fixed:** (1) typed.js hero verb reflow → **FIXED** (fixed-width slot, `min-width: 6ch` inline on the typed span; verified pixel-stable across cycles on draft `6a21df00ca2f…`); (2) remaining ~0.16 is **web-font swap reflow** (Lighthouse root cause: "Web font loaded") → that's perf-plan **steps 4–5 (font diet / preload), out of scope here** by the work order. Mobile CLS 0.008 throughout.

## NEXT SESSION ENTRY POINT (updated 2026-06-03)
Audit phases + 7-day plan + post-merge polish: all shipped on `main` (clean at `f9278f7`).

**GA4 verified live in production** (headless test 2026-06-03): `G-DWY90CQY6P` in bundle; cookieless `gcs=G100` pre-consent → banner → `gcs=G111` page_view for granted visitors, no re-prompt. Ops doc: `GA4.md` (root).

Tasks for Moses:
1. **Real metrics** (C1) — supply actual numbers for Zahav / Crimson / Prodani; mocks live in `src/data/projects.json`.
2. **GA4 admin** — toggle `book_call_click` to key event (steps in `GA4.md`).

Tasks for Claude (when numbers arrive):
1. Replace mock metrics in `projects.json`; drop the metric tiles for any project with no real numbers (renders conditionally already).
2. Post-deploy smoke check: fonts by content-type, tile reveal on hard reload + throttled network.

## Legacy cleanup (2026-06-10) ✅ MERGED TO MAIN 2026-06-15 (`e14760a`, `--no-ff`)
Full dead-code sweep — protocol + findings: `.audit/cleanup-protocol.md`.
Removed: 17 unimported SCSS files, 19 dead selectors in live files, stock CRA
`public/manifest.json`, `.unimportedrc.json`, NeueMachina woff2, 2.8MB unused
glitch video; source OTF moved out of `public/` (`fonts-src/`). Zero dead JS
files/deps found. Every removal build-verified (CSS content-hash / class-set
diff). CLAUDE.md: 2 stale file refs fixed (App.js→routes.js, ProjectsTiles→
sections/CaseStudyTiles), 2 new rules added. `graphify-out/2026-06-07/` kept
tracked (repo convention). Merged build green (all 25 routes), pushed to origin.

## README refresh 2026-06-15
`README.md` was pre-SSG and pre-cleanup — corrected against current code:
SSG build model (one HTML/route, no SPA catch-all), `App.js`→`routes.js`,
`components/{pages,sections,layout,ui,util}`, self-hosted fonts (SCS Display +
Inter + Roboto Flex woff2; NeueMachina/manifest.json/glitch.mp4 gone; source OTF
in `fonts-src/`), `Seo.js` per-route heads, prebuild sitemap, Moon IO-gate +
~990KB chunk, `npm start` (plain vite) vs `npm run dev` (vite-react-ssg) now
distinct, added `team.json`.

## Accepted dependency residuals 2026-06-15
After the dep-upgrade pass (form-data→4.0.6, vite 5→7.3.5), `npm audit` shows two
residual **esbuild** advisories — both ACCEPTED, documented here so they're not
re-triaged from scratch:
- **GHSA-gv7w-rqvm-qjhr** (high) — missing binary-integrity verification in the
  esbuild **Deno** module → RCE via `NPM_CONFIG_REGISTRY`.
- **GHSA-g7r4-m6w7-qqqr** (low) — arbitrary file read via the esbuild **dev
  server on Windows** (introduced 0.27.3; surfaced only because vite@7 moved
  esbuild 0.21.5→0.27.7).

Why accepted: both are **dev/build-only** (esbuild ships in no `build/assets/`
bundle) and **non-exploitable here** — we don't use Deno, don't run a Windows dev
server, and deploy a static Linux/Netlify build (dev server never exposed). Both
are fixed only in **esbuild 0.28.1**, unreachable on vite@7 (peer-pins esbuild
`^0.27.0`); the only routes to 0.28.1 are vite@8 (breaks vite-react-ssg's
`^2..^7` peer range) or an esbuild `overrides` — declined for build-interop risk
on a pre-1.0 lib past vite's pin. **Revisit when vite ships a release on esbuild
≥0.28.1** (then drop this note and the residuals clear without an override).

**STATUS UPDATE 2026-07-21 (post PR #8, vite 7.3.5→7.3.6 — check only, nothing
changed):** vite 7.3.6 WIDENED its esbuild range to `^0.27.0 || ^0.28.0` — the
0.28.1 fix is now IN-RANGE and reachable without an override or vite@8. The
lockfile still resolves **esbuild 0.27.7** (dependabot bumped vite only; npm
kept the in-range esbuild), so GHSA-gv7w-rqvm-qjhr + GHSA-g7r4-m6w7-qqqr still
apply to the tree today — still dev/build-only and non-exploitable here, so
acceptance holds — but the "fix unreachable" rationale is OBSOLETE. Clearing
them is now a routine `npm update esbuild` (lockfile-only, verify clean build)
— a normal approval-gated dep change, queued rather than executed (tracked as
LC-37 in `.audit/legacy-cleanup.md`, incl. the pre-1.0 hash-comparison gate).

## security.txt added 2026-06-17
RFC 9116 disclosure file at `public/.well-known/security.txt` →
`build/.well-known/security.txt` (Contact `hello@switchcasestudio.com`,
Canonical, `Preferred-Languages: en`, **Expires 2027-06-17** — bump before then,
a past Expires invalidates the file). No build config needed: Vite 7's
`copyDir` (`fs.readdirSync`) copies dotfolders, verified byte-identical in
`build/`. Netlify serves it `text/plain` (no `.txt` override); the SPA catch-all
is gone so the real file resolves. On `chore/security-txt`, unmerged.

## Stack fact (kills the CRA assumption) 2026-07-03
**The project is Vite 7.3.5 + vite-react-ssg 0.9.0. It has NOT been CRA since
the 2026-06 SSG migration** (react-scripts removed; `chore/legacy-cleanup`
merged at e14760a deleted the last fossils: `public/manifest.json`,
`.unimportedrc.json`). Build output is **`build/`** (CRA's dir kept on purpose
— Netlify `publish = "build"`), NOT Vite's default `dist/`. A 2026-07-03 sweep
(`rg` for create-react-app|react-scripts|craco|react-app-env|PUBLIC_URL|
reportWebVitals|\bCRA\b) found zero live-file residue; remaining mentions are
historical narration (this file's discovery header, CLAUDE.md lessons,
vite.config.js migration comments — all now explicitly marked historical) and
generated `graphify-out/*` snapshots (dated artifacts, left as-is by design).

## Design refresh — Phase 1 audit 2026-07-03 (branch `design-audit-refresh`)
Full design/responsiveness/CRO audit committed as `DESIGN_AUDIT.md` (38ad243)
+ `PRODUCT.md` (impeccable-skill context). Scores: 30/40 heuristics, 11/20
technical, AI-slop PASS. Approved for Phase 2 implementation on this branch —
staged: P0s first → user visual verify → P1s → P2s. Never push to main without
explicit instruction.
- **P0 (3):** hero CTA hierarchy inverted ("See Our Work" solid vs "Book a
  Free Call" ghost); mobile hero = 2 empty viewports + typed-slot hole ("We ␣␣
  | websites"); contact form friction (5 required fields, placeholder-only
  labels, 13px mobile inputs → iOS zoom, disabled-looking Submit).
- **P1 (10):** AboutCTA booking moment styled as 13px text link; 7 CTA copy
  variants + 2 calendar URLs (centralize in src/data/cta.js); ClientStrip uses
  project screenshots as "logos"; scrub-tied opacity strands content dim
  (Services/Faq/About/Contact) → onEnter reveals; white-on-orange FAQ ≈2.2:1
  fails AA (ink text like promo page); placeholder-only labels + 5 files with
  outline:none unreplaced; reduced-motion gaps (Squares RAF, cursor tween,
  Moon, Reviews+PricingCard intervals); no h1 on /about /projects
  /testimonials /services + Reviews h2→h4 skip; 13px mobile body floor (8px
  footer meta, 2px carousel dots, <44px targets); 2.2MB long.webp case images.
- **P2 (11):** GradientText (detector hit) → solid spans; marquee clipping
  ("witch Case Studio"); raw "Loading..." Moon fallback; eyebrow-label grammar
  diet; contact video needs poster; stripe band height on mobile; case tiles
  lose screenshots ≤768px; pricing index lacks "from $X" anchors; ~126
  hardcoded hexes + z-index 999/9999/2147483647 + ~20 breakpoints (consolidate
  to 480/768/1024/1280) + no type scale; 4 missing alts; footer socials
  commented out.
- **Protect:** proof density (metrics/testimonials), perf moat (LCP 2.9s
  history, SSG, font pipeline), FAQ-orange + footer-star brand moments,
  "Ready to be next?" beat.

## Design refresh — P0s shipped 2026-07-03 (027c9df hero, a5d0845 contact)
All three P0s implemented + verified (headless 1440×900/390×844 + live-DOM
measurement + live consent-flow test). STOPPED at the owner in-browser gate
before P1s (see STATUS.md for the checklist). Evidence corrections folded
back into DESIGN_AUDIT.md: P0-2's real mechanism was the headline
font-size×container pair overflowing the fold (NOT "two empty mobile
viewports" — a 565×1568 review-window artifact); typed slot was already
SSG-seeded (hole = backspace phase, timing-tuned); "mobile right-shift" =
headless-capture artifact (live centerOffset 0); "white square at 0,0" =
custom cursor pre-mousemove (queued P2). New docs: CHANGELOG.md + STATUS.md.

## Visual-elevation pass 2026-07-03 (branch `design-audit-refresh`) ✅ BUILT, verify gate open
Proposal `VISUAL_ELEVATION.md` (68369bf) → Moses approved freehand → all 13 items
shipped, one commit each (47e8923…643afee), build green (27 routes) per commit,
end-states DOM-probed at 1440+390. Ledger with per-item deviations lives in
VISUAL_ELEVATION.md; owner gate in STATUS.md. Highlights: contact video card →
sticker frame (desktop only); MagneticButton on the 3 booking pills; strip star
separators + pause; footer wordmark scrub drift; link grammar mixins (arrow-nudge
/underline-sweep on :root motion tokens); grain on FAQ+stripe; Ready-to-be-next +
pricing house reveals; orb parallax; reduced-motion complete; FAQ focus parity;
cursor press + hide-until-mousemove.
**Two real bugs found & fixed mid-pass:** (1) pricing h1 shipped `opacity:0` in
static HTML (motion whileInView SSR initial — P1-7 class, conversion page);
(2) stripe orb + cursor dot both lost their CSS -50% centering to the
percentage-transform poison the moment a new-axis tween touched them.
**New environment fact:** occluded automation window freezes CSS transitions AND
the GSAP ticker — only end states are observable agent-side (rule added to
CLAUDE.md).

## Mobile empty-page fix + tap feedback 2026-07-05 (branch `design-audit-refresh`)
Owner reported (phone screenshots) `/testimonials` + `/projects` landing as
header-over-void on mobile. Root cause: motion/react `whileInView`
`viewport.amount:0.1` on the grid — a very tall single-column mobile grid never
clears 10%-in-view on load, so the IO never fires and every card stays at the
SSR-baked opacity:0 (short amount:0.3 headers revealed fine → "heading but no
content"). Fix (`5ec90af`): grids → `animate="visible"` (reveal on mount, keep
cascade, cards keep whileHover). Verified all cards settle opacity 1; About
audited (hero fills first screen, no void). Also owner asked why mobile feels
more static than desktop + whether speed opt caused it — DIAGNOSIS: no, it's the
pointer-only reactive layer (cursor field, magnetic buttons, TextPressure warp,
all hover-lifts) which can't run on touch; only real perf gates are the
IO-deferred Moon + tile particles. Added touch tap feedback (`8c88ea7`): global
`:active` opacity press under `@media (hover:none)+(pointer:coarse)` (opacity-only
to avoid GSAP/motion transform conflicts) + whileTap scale on /projects cards.
Two rules added to CLAUDE.md (whileInView tall-section stranding; mobile-static
is pointer-inherent).

## Legacy cleanup Phase 0 + Phase 1 Batch 1 — 2026-07-21 (branch `fix/dependency-correctness`, UNPUSHED)
Phase 0 recon (read-only, five parallel sweeps) delivered `.audit/legacy-cleanup.md` — 32 line
items LC-01…LC-32, owner-approved with a resequenced 6-slot batch plan. Headlines: zero live CRA
residue (re-verified); all suspected orphan components LIVE (only orphans: 2 projects.json
fields + 5 dead SCSS tokens); CONFIRMED bug LC-26 — five routes (/about /testimonials /projects
/blog /services) ship `<h1 style="opacity:0;clip-path:…">` in static SSG HTML (motion/react
`initial="hidden"` serialized; fix mechanism documented under LC-26, batch 2); one real GSAP/CSS
double-owner (LC-16 `.sm-socials-link` opacity); phantom dep `prop-types`.
**Batch 2 (LC-26-pre + LC-26a + LC-34) ✅ COMMITTED on `fix/ssg-visible-headers`, not pushed**
(2026-07-21, off main @ 522fe94 — batch 1 merged). Pilot route only: /about header → plain
elements + shared `usePageHeaderReveal` (PricingGuide/VE-8 pattern; no manual in-view fallback —
ScrollTrigger fires onEnter at creation, instrumented 3×; isTweening-guarded safety net).
LC-34 (ReviewsPage RM no-op guard) split out as its own commit — a11y fix, zero HTML change.
Verified: /about ships kicker+h1+lede visible in static HTML (path-guarded greps), pricing +
testimonials invariants hold, 31 routes, 75/75 JSX, zero console errors on prod build, reveal
1×@353-1035ms (fires BEFORE first paint locally — no flash at full speed). **PSI baseline
captured (median-of-3 desktop prod /about): Perf 78 / LCP 0.5s / CLS 0.609 — the 0.609 is
deterministic, PRE-EXISTING (header font-swap 0.449 + consent banner 0.150 → LC-35, worst known
CLS on site, all five standalone pages structurally share the causes). Branch gate: CLS ≈ 0.609
unchanged.** OPEN: owner's true-390 throttled device pass → then push + branch-side PSI → then
LC-26b–e (held) in one follow-up commit.
**Batch 1 (LC-19+LC-20) ✅ MERGED to main @ 522fe94** — `prop-types ^15.8.1` declared,
`vite-react-ssg 0.9.0` moved devDeps→deps (specifier untouched). Lockfile diff = dev-flag
cascade + 19-line environmental optional-peer prune (control-tested on HEAD). Verified: clean
`rm -rf node_modules && npm ci && npm run build` → 31 routes (filesystem count), asset hashes
identical to baseline (rendered output unchanged), 74/74 JSX + 6/6 JSON parse. esbuild audit
residuals untouched (still ACCEPTED, see 2026-06-15 note). Next: batch 2 = LC-26 on its own
branch, PSI median-of-3 CLS gate; batch 2 recon must also grep whether the five headers are the
last motion/react consumers (they are not expected to be — report only). Moses holds push/merge.

## Contact section relayout 2026-07-05 (branch `design-audit-refresh`, `0c5929b`)
Owner flagged 3 contact issues (screenshots): desktop form width/balance, mobile
side padding, mobile alignment. Diagnosed live: the ≥1024 two-column (form 736
left + 288 card top-aligned right) left a tall void bottom-right beside
message/submit; mobile `.contact-left` was center-aligned while the form + Send
button were left → button flush-left, info/card centered (the reported clash).
Fix: **form-forward single column at every width ≥769** — form centered (heading,
fields, signature band share one left edge), info + brand card as a signature band
below (info left / card right); the 769-1023 tablet row extended up, the ≥1024
two-column removed. Mobile: `.contact-left` align-items center→flex-start, card
margin auto→0 + fills content width (max 24rem <769), section padding 1.5→1.75rem.
VE-1 sticker tilt (≥1024) preserved. Verified 1440/860/500 + home contact.
Used impeccable skill (register: brand, PRODUCT.md). Supersedes the prior
"Desktop-contact gate v2" two-column note.

## Branch consolidation 2026-07-28 — repo is single-branch (`main` @ `f623d50`)
Audited every branch against `origin/main`: all contained except
`origin/feat/seo-geo-sprint-package` (1 commit, no PR — the $3.5k **SEO + GEO
Optimization Sprint** tier in `pricingData.json` + per-tier `benefits` support in
`PricingGuide.js`: tiers may carry own bullets with named icons, fallback to shared
`BENEFITS`). Merged it `--no-ff` → `main` @ `f623d50`; 0 conflicts (its two files
untouched on main since branch point), full SSG build clean, tier verified rendering
in `build/pricing/marketing-ads.html` (Growth & Performance = id
`marketing-advertisement`). Then deleted 5 local + 6 remote merged branches
(design-audit-refresh, feat/partners-password, feat/service-index-redesign,
fix/heading-font-h1-only, fix/partners-faq; remote also fix/dependency-correctness,
fix/lc26-bcde-adopt-hook, fix/lc42-fa-css, fix/ssg-visible-headers,
feat/seo-geo-sprint-package) — each verified 0 ahead of origin/main first.
Supersedes earlier "UNPUSHED" claims (2026-07-21 entry): that work reached main
before deletion. OPEN: 4 Dependabot alerts on main (2 high, 1 moderate, 1 low) —
untriaged.

## Footer socials + wordmark hover + cursor morph — 2026-07-29 (branch `feat/footer-socials-wordmark-cursor`)
Connect column: FontAwesome brand icons (IG/Threads/X/FB/LinkedIn/Google-Business/Blog-RSS)
from one SOCIALS array — entries render only when href is filled; GBP link derived from the
Maps CID (875109400879972028). Footer wordmark: full-bleed 100vw breakout (was cropped by the
1200px container) at 13.5vw ≈ 85% of viewport at every width, verified with the real SCS
Display loaded; per-letter spans fill with the purple→black gradient on hover via
gradient-clipped ::after overlays (base fill must stay opaque — outline is text-shadow).
Cursor: morphs into the hovered element's border (GSAP quickTo geometry glued per-frame to
getBoundingClientRect; radius matched; returns to 25px square) with no-morph zones
(.site-header, .faq → hollow 35px square), labels removed from the interactive selector
(form highlight = :focus only), data-cursor-morph opt-in hook (lpp tiles use it), and
`cursor: none` on everything behind body.has-custom-cursor (native cursor = fallback for
touch/no-mount). Footer link underline-sweep removed (wrap carries hover). New CLAUDE.md
rule: CSS transitions must not cover JS-per-frame-written properties.

## AI-first repositioning — 2026-08-01 (branch `feat/ai-first-repositioning`)
Full-site repositioning: "cute websites & WooCommerce" → multi-hyphenate AI-first studio
(design × code × AI), calibrated deliberately BELOW mrbright.ai's "Your AI Marketing
Department" over-promise — AI as infrastructure we engineer (named stack: n8n, Zapier, Make,
GoHighLevel, Claude/OpenAI APIs, self-hosted agents on VPS), never autonomy theater.
NEW SERVICE: `ai-development` (AI Development) — 4 tiers ($500 Roadmap Sprint / $1,800
Assistant / $4,500 Custom Agent / $1,500mo AI Partner), slug live at /pricing/ai-development
(sitemap auto-derived; 36 HTML files, was 35). Retitles (slugs UNCHANGED so no URLs break):
automation-integrations → "Automation & AI Workflows" (3rd tier "AI System Builder" →
"Automation Suite", self-hosted-n8n framing), hosting-maintenance → "Hosting &
Infrastructure" (+ new VPS & Self-Hosted $150/mo tier). Copy surfaces rewritten: hero
(h1 line 2 "websites, apps & AI"; typed verbs build/design/deploy/launch/ship — verbs
capped ≤6ch, an 8ch verb widened the slot and left the blinker floating), hero sub, LPP
(heading "One studio. Design, code & AI." + AI feature card), AboutHeading/Text/Marquee,
AboutPage (AI-native title, capabilities, +2 values → 6 = even 2-col grid, "practice what
we sell" story ¶), FAQ (3 new AI Q&As), Seo home/services/pricing/about/blog, index.html
Org JSON-LD (+knowsAbout array), footer tagline. FIX FOUND DURING VERIFY: Footer had its
own hardcoded SERVICES_LINKS copy that silently drifted from navigation.js on rename —
now `SERVICES_LINKS = PRICING_LINKS` (rule added to CLAUDE.md). Verified: JSON parses,
build clean, entry-chunk marker present, no stale labels in build HTML, titles correct,
no hydration errors (prod build, real browser), /pricing/ai-development tiers verified by
DOM textContent (occluded-window GSAP freeze reconfirmed on an UNCHANGED pricing page —
environmental, not a regression; note: `innerText` returns "" for visibility:hidden
reveals — probe with textContent). Prices are DRAFT-honest placeholders — Moses reviews
before merge.

## GA4 "No data received" — 2026-08-03 (root cause: CSP, not tagging)
GA4 Home reported zero data since launch. The tag was correct the whole time: prod bundle
carries `G-DWY90CQY6P`, gtag.js loads 200, consent + `page_view` queue in dataLayer.
ROOT CAUSE: `netlify.toml` `connect-src` allowlisted `https://*.analytics.google.com` — a
CSP wildcard does NOT match the apex `https://analytics.google.com`, which is where gtag
transports every hit once consent is GRANTED on this Ads-linked property. 100% of
post-consent hits were killed by the browser pre-network. Invisible by design: no
`/g/collect` resource-timing entry (blocked before the network → reads identically to "tag
never fired") and violations only surface in a console nobody was watching. The June
Report-Only recon passed because it exercised only the pre-consent path, whose cookieless
ping goes to `www.google-analytics.com` (allowed).
EVIDENCE: on prod, firing a gtag event produced 4 `connect-src` violations and 0 collects;
`fetch(..., {mode:'no-cors'})` per endpoint → `analytics.google.com` + `stats.g.doubleclick.net`
BLOCKED, `www.google-analytics.com` / `region1.` / `googletagmanager.com` OK. Running the
identical init snippet on a CSP-free origin (example.com) registered in GA4 Realtime within
seconds (1 active user, page "diag") — proving GA-side ingestion was always healthy.
FIX (`edb96e3`): apex `https://analytics.google.com` + `https://stats.g.doubleclick.net`
added to BOTH `connect-src` and `img-src`. Header-only change — takes effect on redeploy.
New CLAUDE.md rule: CSP wildcards don't cover apex hosts, and a clean Report-Only run only
proves the flows you exercised (run the post-consent + conversion paths too).
FOLLOW-UP: GA4 admin still needs `book_call_click` toggled as a key event (see GA4.md).

### Follow-up same day — entry page_view was still being lost (`d31380d`)
With the CSP fixed, a real incognito test (Beau) registered `book_call_click` as a key event but
showed 0 views: the landing `page_view` fires pre-consent (cookieless gcs=G100, not counted) and
nothing re-fires on Accept because the route never changes. `setConsent()` now re-sends
`trackPageView` on the deny→grant transition, guarded on the previous stored value against
double-counting. Verified on prod after deploy: cleared consent → reload → Accept produced
collects 1→3 and `page_view` appeared in Realtime's event list. Rule added to CLAUDE.md.

### Same-day continuation — form leads, preview tagging, deps (2026-08-03)
- **`generate_lead` verified end-to-end on prod** (`259c9d2`): submitted the real contact form
  with the EmailJS XHR/fetch stubbed to a fake 200 (no email sent), event reached GA Realtime.
  Bonus finding: `ads_conversion_Contact_Us_1` — an existing KEY event minted by a Google Ads
  event-create rule inside the container — fires on the same submit, so lead conversions were
  already being counted under that name.
- **GA4 "Tag quality: Needs Attention (2 issues)" traced and fixed at the source** (`917fbbc`):
  both items were about Netlify PREVIEW deploys — the single "not tagged" URL was a
  `*.netlify.app` deploy-preview host, and "additional domains detected" was that same host
  loading the production tag (Netlify injects site env into every context). Fix: blank
  `VITE_GA_MEASUREMENT_ID` for `deploy-preview` and `branch-deploy` contexts in netlify.toml.
  Deliberately did NOT accept GA's "Add domain" prompt — that would merge preview sessions
  into production cross-domain measurement.
- **`npm audit fix`** (`36abeb3`): cleared both HIGH advisories + the low (esbuild dev-server
  file read, immutable DoS ×2, postcss sourceMappingURL traversal). package.json unchanged,
  lockfile-only. Gated per LC-37: same-environment rebuild produced an IDENTICAL asset-hash
  set, 36 HTML routes, entry-chunk marker intact. react-router's 2 moderates remain (needs a
  v7 major that vite-react-ssg@0.9.0 doesn't support) — tracked as DEP-1.
- **Open tickets now live in `.audit/open-tickets.md`** (GA-1 key-event starring, blocked on
  GA's ≤24h event-list processing lag; GA-2 report-population check; DEP-1 react-router 7).

## Proof surfacing + Organization sameAs — 2026-08-03/04 (`b28195e`, `9a91988`, `d5e7f1a`, UNPUSHED)
Action-plan items 1.2 (partial) and 2.2. Both UNPUSHED as of writing — the site gains nothing
until `main` is pushed.

**1.2 — link the source repos (`b28195e`).** `projects.json` projects take an optional
`repos: [{label,url}]`; `CaseStudyPage` renders one "View the code" button per entry (multiple
entries labelled by pipeline role), and nothing when the array is absent — two client case
studies have no public repo by design. TRAP FOUND: every `gh` and browser session of the owner's
is authenticated, so a PRIVATE repo looks reachable while rendering a 404 to visitors — verify
link-by-link unauthenticated (`curl -o /dev/null -w '%{http_code}' -H 'Authorization:'`).

**Repo-visibility audit → one link pulled (`9a91988`).** Before flipping repos public, all four
were swept for secrets across 242 commits (clean). The real hazard was confidentiality, not
credentials: `zahav-audit` was assumed to be the client's site source and is actually the live
SEO *engagement workspace* — 668 rows of the client's GSC query data, page-level performance,
unsigned deliverables the README itself gates behind client sign-off, a competitor-actionable
inventory of the client's SEO weaknesses, client emails/phones, internal execution logs. The
link was dropped. Rule: a repo NAME is not its contents, and grep patterns catch keys, not
confidentiality. Case studies link to BUILD SOURCE only; audit/engagement repos are never linked.

**2.2 — Organization `sameAs` (`d5e7f1a`).** The Org JSON-LD shipped ONE profile
(`x.com/s_c_studio`) while the footer linked seven — the entity graph claimed the studio owned an
X account and nothing else. `sameAs` is load-bearing here because the brand name collides with
Nintendo Switch cases and a Portland coffee chain: the studio can't win on string matching, so
resolving the scattered profiles to ONE entity is the findability play. Shipped:
`src/data/social.js` as the single source; Footer derives from it (keeps only the icon map + the
internal `/blog` link, deliberately not a `sameAs` — that's for other domains); `index.html`
hand-mirrors the array (static file, can't import); `scripts/check-sameas.mjs` parses the JSON-LD,
diffs it against social.js and exits non-zero on drift, wired into `prebuild`. The guard exists
because a stale `sameAs` fails SILENTLY — footer links keep working, pages keep rendering, only
the entity graph is wrong. Guard was broken on purpose to confirm it catches drift (exits 1,
names the offending URL).
VERIFIED: 36/36 routes, all 7 profiles in every emitted page, footer row still 8 entries,
`__SCS_LANDING_PATHNAME__` entry-chunk marker intact, 6/7 URLs 200 unauthenticated (Facebook
returns 000 — refuses automated requests, not broken; unchanged URL, worth an eyeball).
Rules for both landed in CLAUDE.md.

**1.2 is NOT fully closed.** Done: case-study repo buttons (the footer icon row predates this,
2026-07-29). Still open in the action plan: GitHub profile README as a studio landing page,
deliberate re-pin of the 6 slots, and putting the repo count on the site.

## GA-1 partial + GA-2 CLOSED — 2026-08-04 (GA4 admin, no code change)
Driven through the owner's own Chrome session (a cloud/cron agent cannot authenticate to GA).

**GA-2 — CLOSED.** The Home "No data received" card is gone and standard reports have
populated: Active users 4, Event count 32, Key events 3 (last 7 days); "Views by page title"
lists Switch Case Studio 8, Zahav Medspa 2, plus `Example Domain` 1 and `diag` 1 — the two
latter being the 08-03 CSP diagnostic hits fired from a CSP-free origin, expected pollution,
not a tagging fault. Traffic acquisition populated (Direct 3, Unassigned 2, Referral 1). The
CSP fix is therefore confirmed end to end in PROCESSED data, not just Realtime.

**GA-1 — partial.** `generate_lead` was present in Recent events (the ≤24h processing lag had
cleared) and is now a key event — toast confirmed. Key events: `ads_conversion_Contact_Us_1`,
`book_call_click`, `generate_lead`; `purchase` still deliberately off.
`email_click` / `phone_click` were absent from Recent events entirely (11 names, neither
present), so their blocker was never the lag — no processed hit exists for either name, and
GA4's UI offers no create-key-event-by-name. Probable cause: fired while the internal-traffic
filter was ACTIVE (filtered hits are dropped from processing permanently) whereas
`generate_lead` was fired during an Inactive window — unproven. Closing them needs a filter
Inactive → click a mailto: and a tel: on prod → filter Active → ≤24h wait. Deferred to the
owner; both lead paths that matter are already counted.
NEW OPERATIONAL RULE: a GA4 event name absent from **Recent events** is not the same failure as
one that is present but unstarred. Present-but-unstarred = processing lag, wait. Absent =
no processed hit ever landed (commonly a data filter swallowing it) — waiting will never fix it.

## Jelly Belly Wiki case study rewritten — 2026-08-04 (action-plan 2.1, UNPUSHED)
The page sold a solo four-stage data pipeline as "a full-stack product with branding and a
developer-ready API" — website framing for the strongest engineering exhibit on the site.

**Grounded, not asserted.** Every claim was pulled from the running system before it was
written: the three repo READMEs (unauthenticated), the live Swagger spec (`/swagger/v1/swagger.json`
→ 11 paths / 10 API endpoints / 10 schemas) and live `totalCount` per resource
(Beans 114, Combinations 54, Facts 99, MileStones 23, Recipes 27 = **317 records**). The API root
302s to a working Swagger UI (200). No number on the page is from memory.

**Copy.** Lede is now the pipeline itself (`Python scraper → MySQL → C# / .NET API → React
client`); Overview opens "a data pipeline, not a website"; Scope is restructured from six generic
bullets into the five numbered pipeline stages plus "Deployed, not demoed" (Netlify / Render /
TiDB); `metrics` went from empty to 317 records · 10 endpoints · 3 languages · Solo; badge
`Web App` → `Full-Stack + API`; `year` set to 2024; services now name Python/Selenium/
BeautifulSoup and EF Core, which the old list omitted entirely.

**Architecture diagram** (`public/projects/jelly-belly-wiki/architecture.svg`) — hand-authored,
dark-theme, using the page's own tokens. Rendered in a NEW `project-page__diagram` band, not a
gallery tile: gallery tiles are `aspect-ratio: 4/3` + `object-fit: cover`, which crops a wide
diagram into uselessness. The band is `object-fit: contain` inside an `overflow-x: auto` frame
with `min-width: 720px` on the image, so narrow screens scroll it instead of shrinking labels to
nothing. Verified at a 500px viewport: frame scrollWidth 752 > clientWidth 458 (scrolls), and
`documentElement.scrollWidth === clientWidth` (the PAGE does not overflow).

**New optional data fields, same conditional-tile law as `repos`:** `diagram`/`diagramAlt`
(own band) and `links[{label,url}]` (live non-code links rendered as secondary buttons — used
for "Live API docs" → the hosted Swagger UI). Absent → the element doesn't exist.

**Bug found and fixed while verifying (all 8 case studies, not just this one).** The meta
description was `description.slice(0, 155)` — a blind cut that severed every case study
mid-word and shipped that to SERPs and social cards ("…from the official Jelly Belly site; the ").
Replaced with `clampAtWord()`: prefer a clause break (`. ` / `; `) past 50% of the budget, else
the last word boundary past 60%, then strip trailing stopwords ("…site; the" → "…site…") and
punctuation. All 8 now end on a complete thought.

VERIFIED: 36 routes, entry-chunk marker present in `app-*.js` and absent from every lazy chunk,
JSON valid, SVG well-formed, real-pixel checks at desktop and 500px. Note for the next
verifier: the first screenshot after load showed a blank hero — that is the documented
occluded-window GSAP-ticker freeze, not a reveal bug; screenshots force frames and it resolves.

## Client-confidential repo was still public — closed 2026-08-04
**The 2026-08-03 audit found `zahav-audit` carries client-confidential material and the action
taken was to remove its LINK from the site (`9a91988`). Its VISIBILITY was never changed.** It
stayed publicly readable for another day and was found again by accident, while listing public
repos for an unrelated task — it appears in `GET /users/Object-ions/repos` unauthenticated.

Exposed to anyone, no login: `Zahav_Baseline_Report.pdf` and
`reports/Zahav_Results_Report_Interim.docx/.pdf` (the deliverables the repo's own README gates
behind "READ-ONLY until the client (Sean) signs off"), `data/gsc_july16/` (the client's Search
Console exports) plus five crawl datasets, `docs/05_Execution_Log.md` (170KB internal log),
`docs/03_Master_Plan.md` (39KB, the competitor-actionable weakness inventory), and
`docs/11_SiteGround_SSH_Setup.md` (access setup for the client's hosting). The README names the
client, the city and the contact.

Checked for live credentials before deciding urgency: `11_SiteGround_SSH_Setup.md` has NO
private-key block, no password assignment, no IP, no token — port numbers only. So this was a
confidentiality exposure, not a credential breach; no rotation needed.

FIXED: repo set to private via the owner's browser (0 stars, 0 watchers at the time, so nothing
was being tracked). Verified unauthenticated afterwards — repo API 404, deliverable 404, absent
from the public repo list, public count 183 → 182. NOTE: `raw.githubusercontent.com` kept
serving the README 200 for a few minutes after the flip; headers showed `x-cache: HIT`,
`source-age: 272`, `max-age=300` — a Fastly cache of an earlier fetch, and it 404'd once the TTL
expired. Do not read that as a failed remediation, and do not warm the cache while verifying.
GitHub also warns that any existing FORK stays public and gets detached; there were none here.

## Public-repo confidentiality sweep — 2026-08-04 (follow-up to the zahav-audit finding)
Ran the sweep that was deferred when `zahav-audit` was closed. Method, so the coverage claim is
honest: enumerated all **182 public repos**, split them into **130 own / 52 forks**, pulled the
full recursive git tree of every one (**33,443 files**) and pattern-matched PATHS for deliverable
documents (.docx/.xlsx/.pptx/.pdf), data exports, analytics dumps (GSC/GA4/semrush/crawl),
engagement words (audit/proposal/invoice/handoff/execution-log/retainer/SOW), contact-PII words
and credential-shaped files — then separately fetched and content-scanned all **130 own READMEs**
for confidentiality language. Filename+README scanning is the honest limit: it would not catch
client data hidden inside an innocuously named source file.

**Result: 2 genuine findings, both Éclore Aesthetics, same class as zahav — intent private,
visibility public.**
- `eclore-new-swiss-theme` — its own README opens "**Private** design prototype for a new Éclore
  Aesthetics Swiss/editorial website direction." An unreleased brand direction for a live client.
- `eclore-before-after` — "for Éclore Aesthetics **partner review**": a client review artifact
  holding interior photography of the clinic (reception, recovery room, restroom, back-of-house)
  and `floor-plan.jpg`. Checked specifically for patient before/after photos — there are none;
  this is a renovation presentation, so it is commercially sensitive, not health data.

Everything else that scored was a FALSE POSITIVE and worth recording so the next sweep doesn't
re-chase it: the top scorers were forks of upstream projects (AspNetCore.Docs, ollama, react_2.0),
and the own-repo hits were `ContactPage.js`, `ClientsController.cs`, a phone-number coding
exercise, `DESIGN_AUDIT.md` (our own), and sha-design-studio's `Proprietary` LICENSE line. No
credentials anywhere; `.env`-shaped hits were all `.env.example`.

**NOT YET REMEDIATED.** Flipping those two to private was blocked by the tool-permission
classifier on both the `gh repo edit` path and the browser path, so it needs Moses to do it or to
grant permission. The sweep itself is complete; only the two-click fix is outstanding.

## Action-plan 1.4 — half implemented, half needs Moses (2026-08-04)
1.4 had been marked "dropped" with no reason recorded, four sessions running. Split it:
- **Done:** Jelly Belly Wiki and Birth of Venus now carry a "Studio project" disclosure. New
  optional `studioProject: true` in `projects.json` (same conditional law as `repos`/`diagram`),
  rendered IN FLOW — on the case-study kicker line ("In depth on · 2024 · Studio project") and in
  the list card's meta row. Deliberately not a second corner chip: the absolutely-positioned
  `.tile-badge` already broke at the mobile breakpoint once. Verified both carry it and all six
  client projects carry none.
- **Blocked on Moses:** "Client since [year], now a business partner" under Ori Argaman and Yuli.
  That is a factual claim about two real people's business relationships — the years, the
  partner status, and whether they consent to it being published are all his to supply. Not
  written, deliberately.

### Homepage tiles: 4 → 6 (2026-08-04)
`sha-design-studio` and `jo-marketing-11` added to the home "Selected work" grid. The grid is
`projectsData.filter(p => p.featured)` in `CaseStudies.js`, so this was a one-flag data edit.
Checked before touching layout: `panelClass` (panel-hero / panel-card-N) has **no CSS rules
anywhere** — it is a vestigial field. `.row-tiles` is a plain `repeat(2, 1fr)` with 16/9 tiles,
so 6 tiles is simply 3 uniform rows; no bento slotting was needed. Both had all three srcset
cover sizes already present.
Verified with real pixels at desktop (3×2, every image loaded, badges correct) and at 634px
(single column, compact image|text layout, badge in flow, no overlap on any of the 6, no page
x-overflow). Order follows the data file, so Jo Marketing leads the grid.
GOTCHA for the next scripted edit of `projects.json`: a naive "does this project already have
`featured`?" check using a fixed character window bled into the NEXT project's object and
reported a false positive for `sha-design-studio`. Scope such checks to the object boundary
(next `"id":`), and always re-read the parsed result rather than trusting the edit.

### Homepage tiles get the /projects hover peek (2026-08-04)
`CaseStudyTiles` now wraps each tile in the same `HoverPeek` the /projects grid uses, so the
home "Selected work" tiles float the site screenshot (`longWeb`) on hover. All 6 featured
projects have a `longWeb` and all 6 files exist.

**Perf gate, measured not guessed.** Imported statically, HoverPeek (@radix-ui/react-hover-card
+ motion/react) cost the ENTRY chunk **+41.7KB** — on the LCP-critical path, for an affordance
attached to a below-fold grid. Re-done as `lazy()` behind an IntersectionObserver (rootMargin
200px), the same MoonSlot/TextPressure pattern: entry grew **+659 bytes**, HoverPeek became its
own chunk. `peekReady` is false on the server and on the first client render, so the bare Link
hydrates and the Suspense fallback is that same Link — no environment-dependent output, and the
tile is never missing while the chunk loads.

**Gate is on POINTER CAPABILITY, not `isMobile`.** First cut gated on the existing
`disabled = reduced || isMobile` flag, which is width-based — a narrow DESKTOP window would have
silently lost the peek on the home page while /projects still had it. Now
`(hover: hover) and (pointer: fine)`, so touch never downloads it and a small desktop window
still works. Reduced motion deliberately still gets the peek; HoverPeek already downgrades its
flip to a fade.

**VERIFICATION GAP — CLOSED 2026-08-04: owner confirmed the hover works on a real screen.**
(Original note kept below, because the automation limitation it documents is permanent.) Build is clean (36 routes, entry marker present
and not leaked, sameAs guard passing, 6 tiles in the static HTML) and HoverPeek was confirmed
live on /projects in a real browser (cards carry Radix's `data-state`). The home hover itself
could NOT be verified here: **IntersectionObserver does not fire in the occluded automation
window** — proved it directly by creating a fresh IO on an in-view element and watching it never
fire in 3s — so `peekReady` never flips and the chunk never loads under automation. Add that to
the known occluded-window failure set alongside the frozen GSAP ticker and CSS transitions.

### GitHub pins re-done + two decisions closed (2026-08-04)
Pinned set is now: `Jelly-Belly-Wiki`, `charm-avenue`, `switch-case-studio`, `SST.Solution`,
`casual-human-voice-skill`, `clean-skills` — verified via the GraphQL `pinnedItems` API after
saving. Four of the plan's named targets were already pinned; the two swapped out were
`portfolio2024` and `birth-of-venus`, freeing the slots the plan reserved for AI/automation.
Those two AI slots were filled from the only genuinely AI/automation repos Moses OWNS (the
higher-scoring candidates in a name/description scan — ollama, awesome-claude-skills,
agentic-readiness-guide etc. — are all forks and were excluded).

Closes action-plan 1.2 except for the repo-count item, which is deliberately still open because a
hardcoded count rots (was 183, now 182 after zahav-audit went private).

Two owner decisions recorded in `open-tickets.md` under "Decisions — do NOT re-raise": the Éclore
repos stay public (contents reviewed, nothing sensitive), and 1.4's partner disclosure is dropped
for good — which finally supplies the reason that had been missing from that ticket for four
sessions.

STILL OPEN, small and cheap: `switch-case-studio` and `clean-skills` have NO GitHub description,
so two of the six pinned cards render blank under the title — the pins are now the profile's main
proof surface, and a blank card wastes one of six slots.

### GitHub profile surface finished (2026-08-04)
Two follow-ups from the pinning pass:
- **Descriptions added** to `switch-case-studio` and `clean-skills` — both were pinned with NO
  description, so two of the six cards rendered blank under the title. Written to match the
  register of his own existing description on `casual-human-voice-skill` (lowercase, plain), and
  grounded: "36 routes" and "115 claude code skills" are both counted, not estimated (115 =
  `SKILL.md` files in that repo's tree). All six pins now carry a description.
- **Profile display name → "Moses Atia Poston."** It still read "Moses Poston" while the README
  directly above it said the full form — the fifth surface, and the one GitHub's API and search
  return as the account's name. Now consistent with the blog byline, the VPS rule and the README.
  Confirmed nothing else on that settings form changed (bio, location, blog URL all intact).

GOTCHA worth keeping: on this display, `window.innerHeight` reports **1596** while the automation
screenshot is **1051** tall (devicePixelRatio 2 plus browser scaling), so coordinates derived from
`getBoundingClientRect()` do NOT map to screenshot pixels — a click computed that way lands
hundreds of pixels off and silently hits nothing. Click from the SCREENSHOT's coordinate space,
or verify the action's effect afterwards rather than assuming the click landed. Two "Update
profile" clicks appeared to succeed and changed nothing before this was spotted.

## Phase 3 — making the AI claims provable (2026-08-05)

Four items shipped or staged; three are genuinely blocked and say so rather than being faked.

### 3.3 Status page — BUILT, waiting on one DNS record
Uptime Kuma deployed and provisioned end to end: admin account, five monitors, a published
status page, and the entry page set so visitors land on it instead of a login screen. Public
page carries exactly three monitors — Website, Studio, Contract signing — all reading `sendUrl: 0`,
so it shows names and never URLs. Two further monitors (the automation platform, Scout) exist in
the dashboard and are deliberately absent from the public group list, which is a positive
allowlist rather than a filter. Verified over the real edge with a Host header: HTTP 301 → HTTPS
200, page title correct, and a grep of the served HTML for hostnames/ports/container names returns
nothing.

**Outstanding, and it is Moses's:** `status.switchcasestudio.com` has no DNS record (nameservers
are Namecheap; there is no wildcard). Traefik's ACME run fails with exactly `NXDOMAIN looking up A
for status.switchcasestudio.com`. Add an A record → the VPS IP and Traefik issues the certificate
on its own retry; nothing else is needed. The container binds only to loopback, so until then the
only way in is a forged Host header.

### 3.6 n8n workflow giveaway — SHIPPED
`/blog/the-social-content-engine-we-run-has-no-ai-in-it` + `public/downloads/`. Derived from the
live SCS Social Engine v3. The angle that makes it worth publishing: an AI studio giving away the
workflow it runs to draft its own social posts, which contains **no LLM call at all** — which is
also why it cannot hallucinate a metric about the business.

Sanitising was the work, not the writing. Stripped instance metadata, webhook id and path, and
every SCS string; swapped our 18-topic content bank and brand voice for six marked templates;
made the QA node read the domain from Brand Config instead of hardcoding ours. **Verified by
executing it** — all seven Code nodes through the real connection graph, 12 posts across 4
simulated weeks, every one passing QA. Three template captions had to be lengthened because they
tripped the engine's own "hashtags inside the truncation window" rule; a first run would have
looked broken. A test import into the live n8n was removed afterwards (the CLI has no
`delete:workflow`; the row was deleted through n8n's own sqlite driver, verified gone).

New `download` block type in the blog contract, added to BOTH `add-post.mjs` and `BlogPostPage`.
Its `download` attribute is load-bearing: `ga.js`'s delegated listener matches on it to fire
`file_download`, so future downloads anywhere on the site are measured with no analytics edit.

### 3.2 /agents — SHIPPED
Sage and Beau only. Kandy runs a client's account and Elios has no entry in the running config,
so neither is on a public page.

The plan was out of date on every structural point, and the running system settled all of them
without escalating: **Sage is the `main` agent**, not a missing workspace — three independent
IDENTITY.md files name him "Sage (main agent, general ops)". Pronouns he/him (Moses).

**Agent self-reports turned out to be unusable, which is itself the finding.** Asked directly,
Sage claimed outputs the n8n engine actually produces, and stated Beau does *not* write the blog —
contradicted by Beau's own JOURNAL-QUEST.md and by his topic ledger, whose 7 entries match 7
published slugs exactly. Beau's own counts were hedged estimates ("130+", "50+"). Nothing either
agent said about itself was published verbatim; the only number on the page is that verified 7.

No hours-saved figure anywhere, because neither could evidence one — the page states that plainly
instead of leaving a gap. Topology stays off entirely. The pipeline diagram is DOM nodes rather
than an SVG so it reflows on a phone instead of cropping.

### A. Open-source Studio — STAGED, needs one decision from Moses
Full history swept, all 17 commits. **Zero credentials.** The application source (`server/`,
`web/`) is completely clean.

**The blockers are entirely in prose**, and they are real: `STATUS.md`/`DEPLOY.md`/`CHANGELOG.md`
and the commit subjects carry a working map of the host — a firewall rule naming the internal
bridge interface, the subnet, the machine's hostname, absolute host paths, the location of a
consolidated secrets file — named outright in one commit SUBJECT — and the other services sharing
the same edge. Publishing the existing repo publishes all of it.

So the mechanism changed from what Moses approved ("full repo, MIT"): a public repo with a **fresh
single-commit history containing the whole application**, with `switchcasestudio/studio` staying private
as the ops record. Same give-away, none of the map. Staged and verified at `~/Desktop/studio-oss`
(MIT LICENSE, a stranger-facing README, genericised env example, web app still builds). **Not
pushed** — creating the public repo is Moses's call since the mechanism differs from what he okayed.

### Blocked, and not faked
- **3.1 site assistant** — the flagship and the riskiest public surface (spend cap, rate limiting,
  key never in the browser, CSP `connect-src`, prompt-injection surface). Needs its own session.
- **B Scout playground** — Scout's route went public between sessions (see the SCS-1 correction);
  the playground still needs spend cap, rate limiting and production-DB isolation first.
- **C Zahav results** — consent is in hand, but the source data lives in the now-private
  `zahav-audit` repo and must be reduced to aggregates before anything is published.
- **3.4 recordings / 3.5 AI case study with numbers** — 3.5 is blocked on data that does not exist:
  both agents were asked and neither could evidence an hours-saved or response-time figure. The
  plan says not to fabricate metrics, so nothing was written.

## Zahav case study — re-measured and rewritten (2026-08-05)

Moses confirmed Sean's written consent, so the deeper results work (action-plan item C)
was unblocked. Re-measuring first turned up a problem bigger than the opportunity.

**The three published headline numbers had no source.** ↑52% organic traffic / ↑28%
bookings / 3.2× ROAS: none of them appear anywhere in the engagement workspace. The only
`28%` in that repo is *image uploads reduced 28%*; the only `3.2` hits are 3.2GB of
backups and a 3.2KB stylesheet — coincidences, not sources.

**And the organic claim is contradicted by measurement.** Pulled live from GSC, 28-day
windows: clicks 196 (pre-fix) → 191 → **168**, i.e. DOWN ~14%; impressions 7,460 → 8,010
→ 7,200; CTR 2.6% → 2.3%. The one clean monotonic win is average position, **25 → 23.3 →
21.3**. Structurally, the property was only verified ~Jun 10 2026 while the engagement ran
Jun–Jul, so *there is no pre-engagement organic baseline and there never can be* — a
"traffic up X% since we started" claim cannot be derived from GSC for this client at all.
Fair caveat recorded: July–August is Arizona low season for a Scottsdale med spa.

**Speed: desktop held, mobile regressed.** Desktop re-verified at 99 (FCP 0.4s, LCP 1.0s,
CLS 0) — unchanged from July. Mobile ran 65 / 77 / 69 (median **69**, LCP ~7.0s) against
July's 88 / LCP 3.4s. Checked and ruled out: the hero preload is intact, royal
`frontend.min.css` is still gone, the mu-plugin is live, and there are **zero**
render-blocking stylesheets in `<head>` — a naive count says 13 and is wrong, because it
counts the `<noscript>` fallbacks of the async-CSS pattern. The July optimisation work was
NOT reverted. Remaining bottleneck is document weight: a 323KB `<head>` with 28 inline
`<style>` blocks (~127KB gzip), which only costs on PSI's throttled mobile test — exactly
why desktop is untouched. Run-to-run spread was 12 points, and Lighthouse moved from an
earlier major to 13.4.1, so some of the gap is method, not site.

**Technical SEO: stable.** Fresh crawl is identical to the July interim (6 missing alts, 2
missing H1s, 49 pages). Do NOT compare those to the Screaming Frog figures — different
tool, not comparable (the Python crawler reported 22 missing alts three days *before* SF
reported 0). The 37 "404s" are all `wp-content` asset URLs, not pages; the 6 alt gaps are
screenshots on two noindex promo pages.

**Rewrite shipped.** The case study now leads with three Google-scored figures a prospect
can re-run against the live site in about thirty seconds — 100/100 SEO, 99/100 desktop
performance, average position 25 → 21 — and the prose states that verifiability is the
point. Owner asked to "empower it a little"; the framing was sharpened and the strongest
true facts led with, but the unsourced figures were retired rather than restated. Full
working: `~/Desktop/zahav-remeasure-2026-08-05.md` (kept out of this public repo).

**Caught during the rewrite, worth keeping:** the first draft paired "1.0s load" with
"down from 13.5s" — mixing a DESKTOP result with a MOBILE baseline. Both numbers were
real and the sentence was still false. When a project has per-form-factor metrics, state
the form factor on every one.

Also a latent layout bug surfaced: `project-page__metric-value` renders at 44px with
`overflow: visible` and only wraps at spaces, so a long UNBREAKABLE token overflows its
tile (`100/100` bled 9px past a 169px narrow tile) while longer values *with* spaces
("Website + LP") wrap fine. Fixed by ordering — the wide first tile takes the long token —
not by touching CSS shared with seven other projects. Real fix if it recurs: shrink the
value font when the token can't break.

### 3.3 CLOSED — status.switchcasestudio.com is live (2026-08-06)
Owner added the A record; the rest completed on its own. Let's Encrypt issued at 04:37 UTC
(valid to Nov 4, auto-renewing), page serves HTTPS 200 with a verified chain, and all three
public monitors read 100% uptime. Published payload confirms `sendUrl: 0` on every monitor —
names only, no URLs — and the two internal monitors stay off the public group list.

Two diagnostic notes worth keeping:
- **`dig` resolving while `curl` says "Could not resolve host" is a LOCAL macOS resolver
  cache, not a DNS failure.** `dig` queries DNS directly; curl goes through
  `getaddrinfo`/mDNSResponder, which caches the NXDOMAIN from any lookup made *before* the
  record existed. Verify past it with `--resolve <host>:443:<ip>` rather than concluding the
  record is broken — the cert was already issued and serving while curl still claimed the
  host did not exist.
- Traefik was restarted to force an immediate ACME retry instead of waiting on its backoff.
  That is a shared production edge: the restart briefly drops in-flight connections for every
  routed service, not just the new one. It is a ~2-5s self-healing blip, but it is not a
  free action — prefer waiting for the natural retry unless there is a reason to hurry.

### Action-plan item A CLOSED — Studio is open source (2026-08-06)
Live at **https://github.com/switchcasestudio/scs-studio** — public, MIT, default branch `main`,
28 files, ONE commit. `switchcasestudio/studio` stays PRIVATE as the ops record (verified 404
unauthenticated).

Owner chose the clean-history mechanism over flipping the existing repo once the exposure was
laid out. Verified UNAUTHENTICATED after publishing, per the zahav-audit lesson that an
authenticated session hides the truth: repo reads `private: false` with `spdx_id: MIT`;
`LICENSE`, `README.md` and `server/.env.example` return 200; and every ops doc —
`STATUS.md`, `DEPLOY.md`, `CHANGELOG.md`, `CLAUDE.md`, `CHEATSHEET.md`, `deploy.sh`,
`tools/studio-backup.sh` — returns **404**. The public `.env.example` carries placeholders
only (`change-me-…`, empty key fields, `example.com` origins).

Naming: the good name `studio` was NOT taken for the public repo, because renaming the private
one would touch the VPS git remote. Public repo is `scs-studio`; renaming later is one command
if wanted.

Rule reinforced: **publishing is one-way.** The pre-publish sweep was re-run against the staged
tree immediately before `gh repo create`, not trusted from the earlier audit — the tree had been
edited in between (genericised env example, rewritten README). Sweep the artifact you are
actually about to publish, at the moment you publish it.

### Session close 2026-08-06 — Phase 3 status
**Shipped:** 3.3 status page (live, valid cert, 100% uptime), 3.6 n8n giveaway (blog post +
download), 3.2 `/agents`, action-plan item A (Studio open-sourced as `scs-studio`, MIT), and the
Zahav case-study re-measurement + rewrite.

**Open and ticketed:** SEC-1 (host path leaked into this public repo — scrubbed forward, history
decision outstanding), ZAHAV-1 (mobile speed / 323KB head), ZAHAV-2 (bookings + ROAS need source
data), LINK-1 (point the site at the public repo), P3-1 (3.1 assistant, Scout playground, Zahav
aggregates, 3.5 blocked on non-existent data), SCS-1 (Scout as a project tile).

**Owner-side:** Kuma admin password rotated by Moses. Convention agreed for where credentials
live — a secret a SERVICE reads at runtime goes in the server env file; a password a HUMAN types
into a login form goes in the password manager only, never on the box. Keeps the backup blast
radius small. Recovery for the status page admin is `npm run reset-password` in its container, so
losing that password locks nobody out.

**Worth a separate look:** whatever off-box backup destination holds the consolidated secrets
file is effectively a copy of the studio's service credentials. Auditing who can reach that
destination is its own task and was not done here.

## Repo + dependency health pass — 2026-08-14

**Branch cleanup.** Deleted 6 merged branches (local + `origin` mirrors): `feat/ai-first-repositioning`,
`fix/mobile-batch-{a,b,c,d,e}`. All were ancestors of `origin/main`; `git branch -d` (safe mode)
succeeded on every one, which is git's own independent merge confirmation. SHAs recorded in the
session log for recovery (`git branch <name> <sha>`, objects live ~90 days). Remaining remote branch
is Dependabot's, left alone. `main` fast-forwarded 2 commits (blog posts 9 + 10).

**nanoid HIGH — FIXED.** GHSA-2v37-7h3g-55p8 (`nanoid <3.3.18`, transitive via `vite → postcss`).
Bumped 3.3.17 → 3.3.18: a 3-line lockfile diff, `package.json` untouched, no other package moved.
Not shipped to the browser (build-time only), so exposure was build tooling, not visitors.
Caveat learned: `npm audit fix --only=prod` PRUNES devDependencies from `node_modules` and the next
build dies on a missing `@vitejs/plugin-react` with a trace that points at the Vite config, not the
install — plain `npm install` restores it. Use bare `npm audit fix`.

**react-router (3 moderate) — still accepted risk, see DEP-1.** Watch condition re-run, still
`^6.14.1`. Dependabot PR #11 (`→ 7.0.0`) is inside the vulnerable range and must not be merged.

**Build verified** on the final artifact: 40 routes emitted, `__SCS_LANDING_PATHNAME__` present in
the entry chunk and absent from every lazy chunk, `check:sameas` OK (7 profiles). Route count
re-baselined 37 → 40 in `CLAUDE.md` (`/agents` had shipped without bumping it, so the stale number
read as a regression and cost an investigation).

**SEC-1 follow-up:** scrubbed the last absolute host path from this file's header (a local
`/Users/<name>/…` audit-file path published since Phase 1). Public-doc path sweep now returns clean.

## Dependabot PR #11 merged, broke production, reverted — 2026-08-14

**Timeline.** 18:23 PR #11 (`react-router-dom 6.30.4 → 7.0.0`) merged to `main` → deploy `23f2c07`
**failed**. 18:25 Dependabot opened PR #12 (`→ 7.18.2`, the genuinely patched version) → its deploy
`ca20bc7` **failed identically**. Two versions, one failure: the blocker is v7, not the version.

**Failure mechanism** (reproduced locally, not inferred): Netlify's *Install dependencies* stage,
`npm ci` exit 1 — `ERESOLVE`, `peerOptional react-router-dom@"^6.14.1" from vite-react-ssg@0.9.0`
against the locked 7.0.0. Deeper cause behind it: v7's exports map is only `.` and `./package.json`,
and `vite-react-ssg` imports `react-router-dom/server` for the whole static-rendering path.

**Live site never went down.** A failed Netlify build keeps the last good deploy, so production
froze at `0913bc1` (2026-08-13) and kept serving 200s. The cost was ~4h of no deploys, not an
outage — but it is invisible from the front end, which is the dangerous part.

**Fix.** Reverted `react-router-dom` to `^6.30.1`, regenerated the lockfile (router 6.30.4, nanoid
3.3.18 fix retained). Verified: `npm ci` exit 0 (the exact gate that failed), 40 routes,
`check:sameas` OK, and the entry chunk rebuilt as `app-CWVtVHOS.js` — **byte-identical to the
pre-merge verified build**, so this is a proven restoration rather than merely a green build.

**Recurrence blocked.** Added `.github/dependabot.yml` (the repo had none — that absence is why the
impossible major kept being proposed). `open-pull-requests-limit: 0` preserves security-only
behaviour; two `ignore` rules suppress react-router majors. Delete them when DEP-1's watch
condition flips.

**Post-fix finding — the v7 pin made security strictly worse.** While `main` sat at react-router
7.0.0, GitHub opened 11 new alerts (8 high, 3 medium), every one `created`/`fixed` 2026-08-14 with
a vulnerable range starting `>= 7.0.0` — 7.0.0 is ~a year behind and carries its own advisory set.
Net effect of PR #11: 3 moderate advisories traded for 14, 8 of them HIGH, plus a broken deploy.
All 11 closed on the revert; 3 open remain (the documented DEP-1 set). Deploy `09a5992` is `ready`,
live routes verified 200 with real SSG head tags (title/canonical/og, `data-rh`). PR #12 closed with
the reasoning; no open PRs. Recurrence blocked by the new `.github/dependabot.yml`.

## Prodani Miami case study rebuilt from measured data — 2026-08-23

The client's storefront relaunched on a bespoke Dawn 16 theme (launched 2026-08-23), with a full
before/after measurement suite behind it. The site's `/projects/prodani-miami` entry was rewritten
against that evidence.

**Unsourced claims removed.** The live page had carried `↑ 40% average order value` and `3 markets`
in `metrics[]` since launch — neither traceable to any source, and the engagement's own handoff
forbids commercial-outcome claims outright. Replaced with the four instrumented figures (−74%
homepage weight, −54% LCP, −84% product CLS, −66% server response), each measured as the median of
five interleaved runs at a pinned 1150×1000 viewport, post-launch, against the live storefront.
Rule fed back into CLAUDE.md: a case-study metric needs a traceable source; "it was already on the
site" is not one.

**New `comparisons[]` band in CaseStudyPage.** Four labelled before/after pairs (home, product,
Meet Your Baker, contact), each in a contain-fit scroll frame — same law as `diagram`, because a
labelled side-by-side must be read, not cover-cropped. Verified at a narrow viewport: frame scrolls
(498 < 932), page does not. Order per owner: live view → overview/scope/results → result quote →
comparisons.

**Hero assets were showing the OLD site.** `imageSrc`/`longWeb` still pointed at June screenshots of
the pre-rebuild design — a rebuild case study illustrated with the thing it replaced. Swapped for
post-launch captures (`long-v2.webp` 288KB vs the old 715KB; net ~700KB lighter after deleting the
two orphans). Copy rewritten: measurement method, the 5.6MB→375KB video, fonts in-house, computed
WCAG contrast, and a "what got worse, on purpose" highlight. Result line: 89 checks, 0 failures.

**Verified:** 41 routes (re-baselined in CLAUDE.md — 40→41; the accessibility-overlays post had
shipped without the bump), entry-chunk marker present + absent from lazy chunks, meta description
clamps to two whole sentences, old claims absent from built HTML. Handoff §9 respected: no
per-product review claims; no imagery framing the client's footer-artwork typo.

## Florida Green Improvements case study published — 2026-08-26

New route `/projects/florida-green-improvements` (route count 41 → 42, re-baselined in CLAUDE.md).
Licensed general contractor, North Miami Beach — fifteen WordPress pages rebuilt as ten statically
generated Next.js 16 routes. Published **pre-launch**, per owner decision: the build is complete and
staged behind `noindex`, awaiting DNS cutover, and the copy says so in the description and the
result line rather than implying a live relaunch.

**Every figure is measured, none estimated.** `metrics[]` and the comparison notes come only from
the engagement's Lighthouse 12.8.2 summary (six runs, both form factors, same machine, 25 Aug):
−94% homepage weight (29,834 → 1,839 KiB mobile), −70% homepage LCP (11.62s → 3.46s mobile),
SEO 77 → 100 on every page, and 0 → 10 pages carrying structured data and analytics. No commercial
figures — the DEP/Prodani rule holds: a `metrics[]` tile is a published claim about a client's
business and needs a source you can point at. Server response time is excluded and said to be
excluded, because a hosted site and a local server are not comparable. The "what got worse, on
purpose" scope item publishes the three TBT regressions (94→106ms, 14→112ms, 14→94ms) rather than
omitting them, and "what is not done" publishes the four open items including the still-missing
Open Graph share image.

**Assets captured first-hand, not reused from the engagement.** All before/after pairs re-captured
by one script against both live origins — old WordPress at its production domain, the rebuild at its
Netlify staging URL — at a pinned 1150×1000 desktop viewport and 390px mobile, consent banner
dismissed, scroll reveals driven before capture. Independently reproduced the engagement's headline
mobile finding: the old homepage reports a **435px document inside a 390px viewport**, the rebuild
390px. The old kitchen page reproduced the same overflow at desktop (1350px document in a 1150px
viewport). Five `comparisons[]` plates built in the prodani house style (BEFORE/AFTER pills, brand
amber for AFTER, right-aligned capture meta); cover tile rendered as the client's own wordmark in
Archivo 500 — the face the rebuilt site actually uses — white on black at 1034×1446 with its
256/512 srcset siblings. Total new assets 1.2MB WebP.

**Client-repo safety cleared before linking.** `switchcasestudio/florida-green-improvements` is public and
linked as "View the code". Swept all 29 commits before linking: no `.env` ever committed, `internal/`
(the audit workspace, Lighthouse runs, baseline crawl) gitignored and never tracked, and no
credential pattern in any diff. This is build source, not an engagement workspace — the zahav-audit
distinction holds. Scratch capture scripts written into the client repo during this work were
deleted; `git status` clean afterwards.

**Second project promoted to keep the grid even.** `.row-tiles` is a 2-column grid with no span
rules, so 7 featured projects would orphan a half-width tile. `florida-energy-assistance` promoted
to `featured` alongside the new entry — 8 tiles, 4 clean rows.

**Verified:** 42 emitted HTML files; `/projects/florida-green-improvements.html` present; entry-chunk
`__SCS_LANDING_PATHNAME__` marker present in `app-*.js` and absent from every lazy chunk; sitemap
carries the new URL; meta description clamps to one whole sentence with no severed word; all nine
referenced assets resolve inside `build/`; real-browser pass at 1440px and 390px — one `<h1>`, zero
console errors, zero 4xx, no stranded `.reveal` at `opacity:0`, no page overflow at either width, and
all five comparison frames scroll internally on mobile while the page does not.

**Pre-existing defect found and fixed — every case study had a broken social card.** Six projects
carried an `imageSrc` pointing at a `1.avif` that had never existed in their asset folder:
`jo-marketing-11`, `crimson-equities`, `sha-design-studio`, `jelly-belly-wiki`, `birth-of-venus`,
`florida-energy-assistance`. The bento "Hero detail" tile is gated behind `useImagePreload`, so it
silently rendered nothing and the page looked perfect — but `<Seo image={publicImageSrc}>` still
emitted the dead path as an absolute `og:image`, so six case studies shipped a 404 social card for
months. A seventh, `zahav-medspa`, was the same defect wearing a 200: its path resolved, but to a
**1MB AVIF**, a format no major social scraper decodes (Facebook, X and LinkedIn all handle
JPEG/PNG/WebP; none handle AVIF) — a blank card by another route, plus 1MB in every deploy.

**Fixed by capture, not by guesswork.** All seven live sites screenshotted at the house 1150×1000
desktop viewport by one script — consent banners and promo overlays dismissed, scroll reveals driven,
then converted to WebP (46–151KB each). `imageSrc` repointed to a real `hero.webp` in each folder;
`jelly-belly-wiki`'s `imageAlt` rewritten, because it described the Swagger docs while the image is
the front end's homepage. The orphaned 1MB `zahav/1.avif` was proved dead (zero references in `src`,
`scripts` or `public`) and deleted — `public/` ships everything in it, so an unreferenced megabyte
there is a megabyte in every deploy.

One capture was investigated rather than assumed: the Zahav hero renders a "New Client Special"
panel with an × glyph that reads as a dismissible modal. A DOM probe showed it sits inside `<main>`
at `position: relative`, with no popup/dialog class, no close control and no scroll lock — it is the
site's actual hero section and the × is artwork. Captured as-is.

**Verified after:** all 9 case-study `og:image` tags resolve inside `build/` (0 broken, 46–151KB,
all WebP); all 9 pages render a loaded Hero detail tile in a real browser at 1440px — one `<h1>`
each, zero console errors, zero 4xx, no stranded `.reveal`, no page overflow; route count still 42.
Rule recorded in CLAUDE.md: `imageSrc` resolving is necessary but not sufficient — it must also be a
format scrapers decode.

## Florida Green case study trimmed to house density — 2026-08-26

Shipped too long. The Overview was 1,175 chars and `highlights[]` carried NINE scope items averaging
439 chars — 5,404 chars of prose against 1,783 for the site's next-heaviest case study (prodani).
Rendered, the summary block was 2,297px tall and read as a wall of grey in the bento's narrow left
column. Owner's verdict on sight: "way too long and daunting."

Cut against measured targets rather than by feel: description 1,175 → 564, nine scope items → six
averaging 186, page prose 5,404 → 1,853 — in line with prodani's 1,783. Rendered summary block
2,297px → **1,035px**, every scope item now 2–3 lines instead of 6–8.

Dropped: the Remotion hero build, the photography-licensing decision, and the Consent Mode v2
detail (already implied by the `0 → 10 pages carrying analytics` metric). All three remain in the
client-facing case-study document; the site page is the trailer, not the film. Kept the two
differentiators — "what got worse, on purpose" and "what is not done".

**Verified:** meta description unchanged and still clamps to one whole sentence; desktop and mobile
both — one `<h1>`, 6 scope items, 4 metrics, 5 comparisons, zero stranded reveals, no overflow, zero
console errors, zero 4xx. Rule recorded in CLAUDE.md with the working numbers.

## Housekeeping sweep — 2026-08-29

Full standing-check pass at HEAD `5825abd` (featured-projects reorder). Since the last entry:
`chore/gitignore-agent-skills` merged via PR #13 and deleted (local + remote — only `main` remains),
the 12th blog post shipped (`pricing-pages-that-qualify-better-leads` + sitemap), and the home grid
order changed (jo-marketing-11 after zahav-medspa).

**All green:** tree clean and in sync; `projects.json` assets — every `coverTile`/`imageSrc`/`longWeb`/
`diagram`/`comparisons[].src` resolves against `public/`, all `imageSrc` in scraper-decodable formats,
all `-256`/`-512` siblings present; `featured=8` (2+3n ✓); build passes; **route count 43** (baseline
re-set in CLAUDE.md — the pricing post had shipped without the bump, same failure mode as `/agents`);
`__SCS_LANDING_PATHNAME__` pinned in the entry chunk only; pricing post in the emitted sitemap;
`check:sameas` OK (7 profiles); `security.txt` valid to 2027-06-17; all 8 `repos[]` links return 200
unauthenticated; Netlify deploys flowing (last 4 `ready`, newest = the reorder commit).

**Standing, unchanged:** 3 moderate Dependabot alerts, all react-router — DEP-1 (`.audit/open-tickets.md`)
still blocked: `vite-react-ssg` peer is still `^6.14.1` (re-checked this pass). No action; watch
condition unchanged.

## Shipped batch — 2026-08-29 (evening): hover swap, marquee derivation, FL Green launch, Meta Pixel

Four features, each verified before push, all live:

1. **Case-study tile hover inverted** (`8c2c029`): the tile now shows the client site's
   long.webp ON the tile at hover (mounted on first hover — never eager, ~4MB across 8 tiles),
   and the copy moved to a compact 300px floating text card (HoverPeek gained a `content` mode;
   /projects' image peek untouched). Headless-verified: peek opacity 1, overlay/excerpt
   suppressed, zero console errors.
2. **Trusted-by marquee derived from projects.json** (`caa384d`): second offender of the
   component-local-copy law — the hardcoded list had silently missed Florida Green for three
   days. Now `featured`-filtered (keeps Birth of Venus out of "Trusted by"); verified in built
   HTML (8 names × 2 track sets).
3. **FL Green case study updated for launch** (`1e76ee2`): the client site went live — verified
   the running artifact (index,follow; og.jpg 200 image/jpeg; /artaficial-turf 308s to the
   corrected URL; 10 routes in live sitemap; privacy/terms still 404) and fixed the three
   launch-dependent claims. 3-line diff.
4. **Meta Pixel live end-to-end** (`cc300e6` + env): load-on-consent architecture (decliners
   load zero Meta bytes), one banner governs GA+pixel, CSP extended, privacy policy rewritten
   (the "no advertising trackers" claim is gone), previews blanked. Meta side driven by browser:
   ad account 179749008 → "Switch Case Studio" portfolio (owner-confirmed, irreversible step),
   dataset "Switch Case Studio Website" = pixel 1013127598442503, advanced matching OFF.
   Receiver-side proof: `/tr?id=…&ev=PageView` → HTTP 200 from Meta. Full trap notes in
   CLAUDE.md (headless UA suppression, ad-blocker vs CSP failure signatures).

Also: route baseline 42→43 re-set (pricing post had shipped without the bump), stale
`GA4-SETUP.md` pointer in ga.js corrected (file never existed in this repo — doc-rot rule).
Standing: DEP-1 unchanged (3 moderate react-router alerts, watch condition still blocked).

## Meta Pixel mission complete — 2026-08-29 (late): domain verified, conversions proven, ingestion confirmed

Closing items on the pixel (see the shipped-batch entry above for the integration itself):
- **Domain verified**: switchcasestudio.com added to the "Switch Case Studio" portfolio and
  verified on first click via the `facebook-domain-verification` meta tag in index.html
  (`4105325` — present in all 43 emitted routes; prerequisite for conversion campaigns).
- **Conversion events proven live post-consent**: one headless pass clicked the booking CTA
  and a mailto — `/tr` fired PageView, Schedule, Contact (+ Meta's automatic
  SubscribedButtonClick), all accepted. Navigation suppressed bubble-phase so the
  capture-phase analytics listener still ran — reusable trick for click-event testing.
- **Receiver-side ingestion confirmed in Events Manager UI**: PageView row Active,
  "Last received 1 hour ago" — the UI lags hits ~30–60 min; the dataset event table is
  the signal, not the overview counter (which lags longer).
- No clashes with the owner's contact-section commits (`07f8d64`, `953826c`) — disjoint
  files; their IO-gated video implementation independently follows the MoonSlot law
  (preload="none", reduced-motion skip, identical fallback). 2.7MB mp4 flagged for a
  future web-friendly re-encode, owner's call to keep as-is for now.

**Still owner's court to run ads**: only a payment method on ad account 179749008.
CORRECTION (same evening): the Facebook Page was NEVER missing — the "Switch Case Studio"
Page (1222851924240748) already sits in the portfolio with two full-access users; the
wizard's "no profiles available to add" meant nothing was LEFT to add, not that access was
lacking. Lesson: that wizard message is ambiguous — check Settings → Pages before
concluding a Page needs linking.

## Ads-readiness: final state — 2026-08-29

Owner decision: payment method (CC) will be added to ad account 179749008 when ready to run
campaigns — deliberately deferred, not forgotten. Everything else in the ads chain is live and
verified: pixel 1013127598442503 (consent-gated, events flowing), domain verified, SCS Facebook
Page (1222851924240748) in the portfolio with full access. Adding the card is the single
remaining step between here and a first campaign.

## Scout ships as the 9th case study + the grid learns remainders — 2026-09-02

Three changes, one session, all verified on the built artifact:

1. **The home case-study grid now accepts any featured count.** The `2 + 3n` constraint is
   retired: `_projects-tiles.scss` restyles incomplete last rows via `:nth-last-child` math —
   a lone trailing tile becomes a centered wide finale (`grid-column: 2/6`), a trailing pair
   mirrors the half-width hero row. The remainder selectors are re-reset in BOTH breakpoints
   (their specificity beats the plain span resets). Measured on the built home page: 532/532,
   346×3, 346×3, then a centered 717px finale. CLAUDE.md rule rewritten.
2. **Scout — the studio's commercial-real-estate scouting product — is live at
   `/projects/scout`**, featured as that finale tile. Studio project, retainer model (no price
   published, owner's call), metrics sourced from the running app the same day (6 sources ×
   4 polls/day, 8 weighted scoring factors, 0–100 evidence-backed fit score, 10 pipeline
   stages). House density respected: description 540 chars, 6 highlights averaging 147.
   Art: wordmark cover tile (+256/512 siblings) and a 1150×1000 hero of the client listings
   board with all addresses and city names blurred — client searches are confidential, and
   the alt text says so. No `longWeb` yet (HoverPeek degrades safely); to be captured once
   the app's guest access ships. No repo links: the product is closed source.
3. **The "Trusted by" marquee now filters `featured && !studioProject`** — a strip claiming
   client trust should not list our own products. Side effect: Jelly Belly Wiki left the
   marquee too (it was there since the 2026-08-29 derivation). Built HTML verified: 7 client
   names × 2 tracks.

Also verified: route count **44** (baseline re-set in CLAUDE.md — Scout adds one), scout in
the emitted sitemap, every `projects.json` asset resolves with `-256`/`-512` siblings, meta
description clamps at a word, one `<h1>`, no page overflow at desktop or mobile widths,
`__SCS_LANDING_PATHNAME__` pinned in the entry chunk. Earlier the same day: `/agents` Sage
proof linked to the public `scs-studio` repo (LINK-1 closed), and the react-router watch
condition re-checked (still `^6.14.1`, DEP-1 unchanged).

## Zahav gains its first conversion metric — 2026-09-02

Owner approved publishing the booking-side aggregate (ZAHAV-2 partially closed): a fourth
metric tile, `1 in 13 visits end in a book-appointment click (GA4, Jul–Aug 2026)` —
133 booking clicks across 1,726 sessions, from the GA4 property's July-vs-August report in
the engagement workspace. Deliberately worded as *clicks*, not appointments, and the page's
"every figure is a Google score you can re-run" sentence was amended in the same edit so the
verifiability claim stays true ("nearly every… the one that isn't comes from the site's own
analytics and is labelled as such"). The +41% Aug traffic headline stays UNPUBLISHED on
purpose: it is Direct-driven with engagement down 24% and a mobile→desktop device flip — the
fingerprint of bot/internal traffic, indefensible under challenge. Route count 44, meta
clamps clean.

## Em-dash purge: every rendered surface, to exactly zero — 2026-09-02

Owner rule: no em dashes across the application. Sweep executed against the BUILT artifact
(comments never ship, so source comments were left alone): 1,037 em-dash hits across the 44
built pages + JS/CSS assets reduced to ONE intentional survivor, the `clampAtWord` regex whose
job is stripping trailing dashes from meta descriptions. ~200 source instances rewritten with
contextual punctuation, never blind substitution: page titles moved to `X | Switch Case
Studio`, the About marquee and footer tagline to the house `·`, alt templates to `:`,
blockquote cites dropped the attribution dash, prose got comma/colon/semicolon by clause, and
client testimonial quotes took `–` so their words changed least. Three source forms were
hunted: literal `—`, `&mdash;` (one, in Hero.js), and `—` JSON escapes (Faq.js). Two JSX
traps mattered: leading newline+indent whitespace strips ENTIRELY (so a text node starting
`: n8n…` renders flush against the preceding span, no space), and multi-line text nodes
collapse internal newlines to one space. All data JSONs re-validated, 44 routes, entry-chunk
marker pinned, spot-checks read clean in the built HTML. Rule recorded in CLAUDE.md.

## Dependency batch: six safe upgrades, one licensing catch, one false alarm — 2026-09-02

Shipped: three 0.180→0.185 (Moon verified rendering on the IO-gated chunk), gsap 3.13→3.15,
sass 1.77→1.103, FA core 7.2→7.3, FA react wrapper 0.2→3.5 (a compat fix — 0.2 never
officially supported the core 7 already installed; 9 icons render), motion 12.35→13.2 (grids
+ blog cards animate to opacity 1, MotionLink pattern intact). package.json 6 lines, lockfile
~114 — composition sane.

NOT shipped, two reasons worth keeping:
1. **typed.js 2→3 REFUSED on license**: v3.0 moved MIT → GPL-3.0 + paid commercial tiers.
   Pinned at 2.x; rule recorded (check `npm view <pkg> license` on majors).
2. **react-router 7 still impossible**: latest vite-react-ssg (0.9.2) pins `^6.14.1`; the
   three moderate advisories need 7.18.0 and have no 6.x patch. DEP-1 stands.

Method scar re-earned: motion 13 was nearly convicted of stranding every card at opacity 0 —
two installs and rebuilds later the real culprit was the documented occluded-window rAF
suspension; screenshot-forced frames animated everything. The CLAUDE.md occlusion rule now
names motion entrances explicitly.

Parked for a dedicated session: React 19 + Vite 8 + plugin-react 6 + R3F 9 + Drei 10 +
vite-react-ssg 0.9.0→0.9.2 — one coupled jump (R3F 9 requires React 19), riskiest surface is
the SSG head/hydration path (vite-react-ssg still bundles react-helmet-async 1.x against our
3.0.0). Verified this batch: build green, 44 routes, entry-chunk marker, hero + typed intact,
consent banner present.

## Triple-lens refresh audit: impeccable + mkt-copywriting + gsap-scrolltrigger — 2026-09-02

Owner asked for a site refresh assessment "from the eyes" of three skills. Three parallel
agents, each invoking its skill, then verifying against the LIVE site (desktop + narrow
viewport, real screenshots) and/or the animation source directly — no fixes applied, findings
only. Full transcripts (screenshots, line numbers) live in the agent task outputs; this is the
synthesis.

**Cross-cutting root cause, caught independently by two lenses:** the site defaults every
section to the same formula — an uppercase kicker label (impeccable's finding) and a "built
from scratch / not templates / real engineers" restatement (copywriting's finding) — same
repetition, design register and copy register. The homepage "Selected Work" section re-argues
this point across four consecutive paragraphs before reaching a single case-study number.

**Two pages got hit from two angles each — one job, not two, when addressed:**
- `/contact`: flat "Contact us" h1 (copy) + an empty decorative photo frame with no image
  source + a black band where a video apparently belongs per commit `953826c` but never loads
  (design) — on the highest-intent page on the site.
- `/testimonials`: `background-clip:text` gradient fill on the heading, an explicit AI-slop
  tell (design) + the headline "Real words. Real results." over six quotes that are pure
  sentiment with zero numbers, when Zahav's sourced "1 in 13 visits" stat sits one page away
  and could pair with its own quote (copy).

**Verified bugs, cheap to fix, independent of any broader refresh decision:**
1. Footer clips/overflows below a narrow width, site-wide — no stacking breakpoint (impeccable,
   DOM-measured: `scrollWidth 505 > clientWidth 485`).
2. `AboutMarquee.js` runs two GSAP tweens on the same property (`xPercent`) at once — the
   infinite drift tween (created second) overwrites the scroll-scrub tween's contribution every
   frame while both are live, so the "intro scrub on scroll" almost certainly never plays.
   `marquee.scss` also still references a `marquee-left` keyframe that doesn't exist anywhere in
   `src/styles/` — dead CSS, safe to delete same pass (gsap-scrolltrigger).
3. One FAQ accordion row (home page) renders in washed-out grey next to normal-contrast
   siblings — reads as disabled (impeccable, confirmed static after settle, not mid-animation).
4. Case-study pages (`CaseStudyPage.js`) reveal every section — hero through gallery — in one
   `gsap.to(..., stagger)` at MOUNT, not on scroll. By the time a visitor reaches the gallery or
   before/after band, it's already fully visible; the reveal pattern proven everywhere else in
   this codebase (per-section `ScrollTrigger.create`) isn't used here (gsap-scrolltrigger).
5. Contact page placeholders above (design half of the `/contact` finding).

**Smaller consistency gaps (gsap-scrolltrigger):** `AboutHeading.js` has no `gsap.context()`
scope (harmless today, `.word` is grep-confirmed unique, but the one file diverging from house
pattern); reveal timing/easing hardcoded in `CaseStudyTiles.js`/`CaseStudyPage.js` instead of
`motionTokens.js`, drifted slightly from the token values; `CursorWave.js`'s RAF loop has no
IO-gate (fine at its current above-the-fold-only usage, risk only if reused below the fold);
reduced-motion detection has two independent implementations (house `useReducedMotion` hook vs.
motion/react's own, used in `MagneticButton`/`HoverPeek`).

**Copy systemic findings (mkt-copywriting):** "X, not Y" antithesis construction used 9+ times
across 6 pages (own hardware not a vendor's platform ×2, engineered not improvised, built from
scratch not templates, hype not, etc.) — reads as formula past 2-3 uses. "Built from scratch"
repeated as verbatim slogan 8+ times instead of let the case studies prove it once. Service-card
one-liners pasted unchanged Home → `/services` → `/pricing`, so the pricing page — whose job is
answering "what's included" — never does. "Most sites ship in under two weeks" (About + home
FAQ) is the one specific-sounding claim with no case study backing it, unlike every other
number on the site.

**Not flagged, checked and cleared:** the reworked home grid (rendered correctly at both
viewports), hover-gated desktop interactivity (confirmed intentional, not tested as a bug), dark
theme default, bento tile aspect ratios, Zahav/Scout page density and contrast. One inconclusive
item noted by impeccable: `/agents` appeared to redirect to home twice mid-session but did not
reproduce on 3 clean isolated navigations — attributed to automation-tooling noise per this
repo's own documented "occluded window" artifacts, not reported as a finding.

**Nothing fixed yet — assessment only, tracked as REFRESH-1 in open-tickets.md.**

## Refresh branch opens: /agents page removed — 2026-09-02 (evening)

Branch `refresh/remove-agents-page`. Owner decision: drop the `/agents` page and its nav entry.
Removed the route record, the desktop nav item (Header.js), the mobile menu item
(StaggeredMenu.js's own hardcoded copy), the `EXPLORE_LINKS` entry (navigation.js, which feeds
the footer), the sitemap entry, and the three owned files (`AgentsPage.js`, `agents.json`,
`agentsPage.scss`). Because the page was live, indexed and in the sitemap, it now **301s to `/`**
via a `[[redirects]]` block in netlify.toml rather than 404ing. Verified on the build: 43 routes
(baseline re-set in CLAUDE.md), no `build/agents.html`, zero `href="/agents"` in any emitted
page, sitemap clean, entry-chunk marker pinned, nav renders About / Services / Pricing / Case
Studies / Reviews / Blog / Contact. Word-level mentions of "agents" (AI agents as a service) in
copy and JSON-LD are untouched — they describe the offering, not the page.

## REFRESH-1 bugs 1–4 — 2026-09-02 (evening, branch `refresh/remove-agents-page`)

Three fixes and one closed-as-non-bug, each verified in a real browser with screenshot-forced
frames (the occluded-window law):
- **Footer overflow** was a `1fr`-floor problem, not a breakpoint: bare `1fr` = `minmax(auto,1fr)`
  whose floor is min-content, so the 2-col link grid ran 13px past the container between 480 and
  767px. `minmax(0, 1fr)` at every breakpoint; columns now end at 476 of 500. The remaining
  `scrollWidth` delta is the full-bleed wordmark's `100vw` including the desktop scrollbar
  gutter, clipped by the footer's `overflow: hidden` — cosmetic.
- **Marquee**: two tweens on `xPercent` collapsed to one owner; scroll influence is a number the
  drift's modifier adds. Dead `marquee-left` keyframe reference removed. Measured: drift ≈133px/s,
  a 400px scroll shifted the track ≈760px on top — the intro finally reads.
- **Case-study reveals**: hero on mount, every other section on its own `ScrollTrigger` with the
  full house safety pattern; timing from `motionTokens.js`. Zahav (desktop): below-fold section
  held at opacity 0 until scrolled, then 1. Florida Green (390px): instant jump to the bottom
  reveals everything via the `scrollEnd` sweep. Zero console errors.
- **FAQ "washed-out row"**: not a bug — six rows, identical computed color, opacity 1 with frames
  forced. The audit tab froze a mid-stagger frame. Two rules recorded in CLAUDE.md (same-property
  tween collision; `minmax(0,1fr)` for text grids).

## REFRESH-1 second pass: copy, kickers, pricing rows, testimonials, code hygiene — 2026-09-02

Everything left on the audit except `/contact` (owner: the background video is intentional).
Verified in a real browser at 1440 and narrow widths, zero console errors, 43 routes, one
em dash in the artifacts (the clamp regex), entry-chunk marker pinned.
- **Home testimonials heading**: animated gradient fill → solid white; the decorative
  "Proof, not promises" kicker and the "What we do" kicker above the services heading are
  gone. `GradientText.js` had no importers left and was deleted (asset set byte-identical).
- **Kicker rule** settled: page headers + functional labels only.
- **Reviews page**: optional per-testimonial `metric`; Sean Dalal's Zahav quote now carries
  the sourced "1 in 13 visits end in a book-appointment click (GA4, Jul–Aug 2026)" with a
  link to the case study. The headline "Real results" is now backed by one checkable number.
- **/pricing rows** preview the entry tier's first three deliverables instead of the
  one-liner already read twice upstream (derived from `pricingData.json`; "Perfect for…"
  framing lines filtered out after one read as nonsense).
- **Copy trims**: "X, not Y" reduced to four signature uses; "built from scratch" kept only
  where it is the point; the home "Selected Work" intro cut from three paragraphs to two;
  "under two weeks" softened in prose (the About stat tile is the owner's call, flagged).
- **Code hygiene**: AboutHeading scoped, CursorWave IO-gated, one reduced-motion hook,
  CaseStudyTiles on motionTokens.

## AI-writing pass against Wikipedia:Signs_of_AI_writing — 2026-09-02 (evening)

Owner asked whether the copy skill had "passed" the language, then to compare the site to the
Wikipedia list of AI-writing signs. Honest answer recorded: the skill ran as an audit, not a
certification, and the rewrites were never re-checked, so the comparison was done as a scan of
the BUILT pages (what visitors read), site vs blog. Result: the 28 site pages (11k words) show
zero of the hard tells (no "delve/tapestry/testament" vocabulary, 0 "not only…but" / "it's not
X, it's Y", 0 participial "…, ensuring" tails, 0 vague attribution, 0 chat phrasing, 0 em
dashes; the 19 vocabulary hits are inside client quotes, the accessibility statement's legal
register, and pricing bullets). The one genuine stylistic pattern is rule-of-three density
(~14/1k words), which is mostly the service menu and price lists; the five rhythm triads on
marketing prose were rewritten. The blog was cleaner than the site on vocabulary except one
post, `core-web-vitals-and-performance-optimization`: a textbook AI opener, three unsourced
industry statistics, and a metric Google retired in 2024, under the owner's byline. Rewritten
(409 words) around the studio's own sourced numbers from three case studies; slug, date and
byline unchanged. Structural side-finding fixed: 8 heading-level skips (pricing tier cards,
home testimonial names). Scanner committed as `scripts/ai-writing-scan.py` with baselines;
three rules in CLAUDE.md. Build: 43 routes, marker pinned, 1 em dash (the clamp regex).

## Home grid: rows of three, Scout in row one — 2026-09-02 (late)

Owner call after seeing the refresh live: the 2-tile hero row goes, the first row is three
tiles and Scout is one of them. `_projects-tiles.scss` now spans every tile 2 of 6 columns
(rows of three; 9 featured = three clean rows) and the remainder math was re-based to rows of
three (remainder 1 → last child at 3n+1 becomes the centered finale; remainder 2 → 3n+1 and
3n+2 become a half-width pair), with the breakpoint resets updated to the new selectors.
Scout's object moved to third position in `projects.json` (63/63-line diff, hand format
kept). Array order drives more than the home grid, so this also moved Scout to third on
`/projects`, into the footer's first four case-study links (replacing Crimson Equities
there) and into the next-project chain after Zahav — recorded as a rule. Measured on the
build: 3 × 384px per row at 1440, order Florida Green · Zahav · Scout; single column on
mobile in the same order. 43 routes, marker pinned.

## Real client logos in the strip + in-card website peek on /projects — 2026-09-03

Branch `refresh/logos-and-tile-peek` (owner asked for a branch, not main). Two owner requests:
1. **"Trusted by" shows the marks, not the names.** Seven logos cut out of the projects' own
   cover tiles by `scripts/cut-client-logos.py`: background black flood-filled to alpha from
   the corners (interior black ink survives, which is why the JO-11 disc keeps its text),
   tight crop, 96px-tall 2x WebPs in `public/clients/`, wired via the `clientLogo` field
   ClientStrip.js already supported. CSS contain-fits each into a 40px × 240px box (30 × 170
   on phones) so a wide wordmark and a square mark carry similar weight. Provenance: the
   tiles are the owner's own artwork of clients already shown on the site. 14 `<img>` in the
   built strip (7 × 2 tracks), all resolve.
2. **/projects hover previews the site in the tile.** The floating HoverPeek window next to
   each card is gone; the card now behaves like the home grid: the tall `long.webp` mounts on
   first hover (never eagerly, ten of them would be ~5MB), fades over the cover once painted,
   top of the page showing. `ProjectCard` extracted in CaseStudiesPage.js; HoverPeek stays for
   the home tiles' text-card mode. Verified: one peek mounted after one hover, opacity 1, zero
   floating peek elements in the DOM.
Build: 43 routes, marker pinned, 1 em dash (clamp regex).

## Renewed Bodyworks case study published — 2026-09-08

Tenth case study live on every surface. The page itself is data: the `projects.json` entry
(id 10, first in the array, `featured`) plus the WebP set in `public/projects/renewed-bodyworks/`
carries `/projects/renewed-bodyworks`, the `/projects` index, the header and mobile-menu
dropdowns, the footer's first four case-study links, the home grid and the sitemap, since all
six derive from that file. The raw evidence (36 Lighthouse runs, capture scripts, METHOD.md)
stays out of this repo, gitignored, with the client project.

Two things did NOT come for free:
1. **The home grid.** Ten featured tiles left one orphan, and the remainder-1 rule blew that
   lone tile up to 779 × 442 against the others' 378 × 214 — handing the biggest slot on the
   page to Florida Energy Assistance, the oldest entry, purely because it sits last in the
   array. `.row-tiles` is now a 12-column grid (tiles span 4) and remainder 1 restyles the
   last FOUR into a row of four at span 3. Measured on the build at 1440: 378 · 378 · 378 /
   378 · 378 · 378 / 277 · 277 · 277 · 277, no page overflow; ≤1024 and ≤768 still reset every
   remainder selector to one column.
2. **The marquee logo.** It had shipped as the only opaque asset in `public/clients/` — a white
   square around a round badge, in a strip of transparent wordmarks on black. Recut with the
   house script (`scripts/cut-client-logos.py`); the other seven logos came back byte-identical.
   All eight now report `hasAlpha: yes`. Then, on the owner's call, the mark went B&W: this was
   the only colour logo on the site (mean chroma 39 against ~0 for all ten other cover tiles),
   so the cover tile and its `-256`/`-512` siblings were greyscaled at the asset and the marquee
   mark recut from them. The case study's before/after screenshots stay in colour.

Build: 44 routes (43 + this case study), entry-chunk marker pinned, 1 em dash (clamp regex),
every `coverTile`/`imageSrc`/`longWeb`/`comparisons[].src` path resolved against `public/`.

## Video hero: the ident replaces the cursor field — 2026-09-09 (branch `feat/video-hero`)

The home hero is now the studio ident: 4.5s of hard-cut plates (leet alternates like `$w1tcH (as3`,
`Sw!c# Cq$e`, width-glitch cuts of the wordmark, a lavender inverted band, `default:`) settling on
`switch case`. Built in Remotion at `~/Desktop/scs-ident` (private: licensed SCS Display + Pangram
Pangram faces), reference analysis in `~/Downloads/monstro-ident-analysis/`. Only the encodes ship:
`public/ident/` carries 16:9 and 1:1 in WebM (VP9) + MP4 (H.264, faststart) and WebP posters cut
from the final frame, 160–190KB each. Layout follows the reference's four-corner structure: the h1
runs "we build" up the left edge (vertical-rl, rotated) and "websites, stores, apps & AI" along the
top, intro under it, two notes and a Scroll cue at the bottom, the video full-bleed behind. The
header's own booking pill is the top-right slot on desktop; phones get a pill in the hero. Removed
with it: `CursorWave.js`, `WelcomeTyped.js`, the typed.js dependency (no other consumers).

Three things measured, not assumed, and now rules in CLAUDE.md: the VP9 encodes inherited the
master's full-range tags and failed in Chrome's decoder at 0.9s (fixed by normalising to limited
BT.709, verified by 136/136 decoded frames on each source); Chrome's 500px minimum window width faked
a phone overflow (verified at a real 390 via iframe: no overflow, 1:1 source chosen); the header is
110px not 5rem, so the hero overshot the fold by 30px (now `--header-h`, hero bottom = viewport
bottom at 1440×900). Standing checks: 44 routes, entry-chunk marker pinned, 1 em dash (clamp regex),
AI-writing scan site 1.6/1k vocabulary, all zero counters still zero.

Same day, second pass on the owner's notes: the video loops (2s on the wordmark, then the plates
again), and on "/" the header is `display:none` while `#hero` is on screen, returning fixed once it
has scrolled past, so the hero is a plain `100svh` and the `--header-h` token from the first pass
is gone. The hero carries the booking link top-right again (the only nav on the first screen).

## Service menu after the owner's reference: borderless two-column entries — 2026-09-09 (late)

The home service menu dropped its cell borders, divider and bottom rule. Each entry is now the
reference's four-part structure: a kicker row (studio taxonomy `AI · Code · Design · Growth`, new
`kicker` field in `services.json`, "See pricing" on the right) over its own hairline, the light
uppercase title, the subtitle at 500, and a muted line of the pricing page's included items joined
with the house `·`. `columns: 2` (not grid) from 1024px so entries flow down the left column and
continue in the right, the way the reference reads; the menu's side padding now mirrors
`.lpp__inner` so the columns sit flush with "One studio." (heading x = first title x at 1920, 1440,
1024 and 390, measured). Title clamp trimmed to 1.9vw so the 25-character titles hold one line in
the 456px columns at 1440. `scripts/headless-probe.mjs` gained `--size WxH` and a 60s hard stop.

## Case studies: tile grid → typed index with a hover preview — 2026-09-09 (late)

The home case-study grid (badge + logo tiles) is now `CaseStudyIndex`: an intro column ("Selected
work", count + year range, the "View all" pill) and three headed columns grouped by `type`,
Rebuilds + SEO (2) · Business websites (5) · Products + stores (3), every entry a link with
`title` over `type · year`. A preview slot under the two right-hand columns shows the hovered
project's `imageSrc` (the 1150×1000 house-frame site screenshot), starting on the newest project
(first in `projects.json`); all ten previews are stacked in the DOM and crossfade on CSS opacity.
Unmapped types fall into a trailing "More work" column rather than vanishing. Phones drop the slot
(no hover) and stack the columns. The "CASE STUDIES" TextPressure heading is untouched;
`CaseStudyTiles` stays for LandingPageProof (wrong at the time: LandingPageProof never imported it; the file was deleted in the 2026-10 cleanup). Verified headless at 1440 / 1024 / 390: 10 entries,
hover swaps the active preview, gutters 36 / 26 / 24, no horizontal overflow.

Follow-up on the owner's note: the preview moved into the intro column under the "View all" pill,
column width (299×187 at 1440; 300px beside the intro at 1024; hidden on phones). Found while
probing, NOT fixed (out of scope, pre-existing): headless Chrome without a GPU cannot create a
WebGL context, the About moon (`MoonSlot`, Three.js) throws on mount, and the route error boundary
replaces the ENTIRE home page with "Unexpected Application Error". A visitor whose browser blocks
WebGL gets the same. Candidate ticket: wrap MoonSlot in its own error boundary (or probe
`canvas.getContext('webgl2')` before mounting) so a decorative failure stays decorative. The probe
script now runs WebGL on SwiftShader so it can scroll past that section.

## Header: one row + detached fixed logo; marquee above the case-study title — 2026-09-09 (late)

Owner's notes, all on `feat/video-hero`: (1) the header is one row, nav links then the booking pill
beside them, right-aligned; (2) the logo left the header and is `.site-brand`, `position: fixed`
top-left on every route at z-index 100000 (only the cursor is higher), 85px / 56px on phones; the
hero headline block starts at 7rem so it clears it; (3) the "Trusted by" marquee moved from after
the hero to right above the "CASE STUDIES" title; (4) the case-study index lists ALL projects (11,
Birth of Venus included, group renamed "Products + experiments"; the `featured` flag was why it was
missing, it still governs the strip and tiles) and the "View all" pill is now a small tracked text
link in the services-CTA register. Measured at 1440: header 106px, one nav row (y=40), pill at
x=1074 right after the last link (1046), logo fixed at (16,10), hero headline y=112; marquee y=2806
above the title at 2966; /about header identical; phone logo 56px, headline clears it.

## Motion pass: reveals + scroll effects on the new home — 2026-09-10 (branch `feat/video-hero`)

Added, all GSAP/ScrollTrigger in the house pattern (runtime-only hide, idempotent reveal, in-view
fallback + timed net, reduced motion gets the end state, one tween per property): hero copy
entrance (four corner blocks, stagger, 0.5s after mount, `yPercent`) and a scroll-out drift
(`y`, scrubbed) that never touches the video; fixed logo scales 1 → 0.78 across the hero,
scrubbed; the header's return after the hero slides in (CSS keyframes, `both`, so no transform
lingers on the bar); "One studio." words brighten 35% → 100% white on a scrub; case-study index
reveals intro → entries (grid stagger) → preview slot, one trigger on the index; preview swaps
settle from 98% (scale is GSAP's, the crossfade stays CSS); the right service column trails the
left by 0.12s. Verified headless: end states in normal AND reduced-motion modes, scrub values at
half-hero (`hero-top` y −30, notes +30, logo scale 0.89), header `animationName: header-return`,
index revealed exactly once. NOT machine-verified: tween timing at a real frame rate (headless
rAF ran at 3 fps; the fast-flag and visible-tab routes both stall, documented in CLAUDE.md).
Owner's visible pass is the timing check.

## Services: typographic build; the safety nets were killing every reveal — 2026-09-10

Owner: "I don't feel much of change. We must animate the services section." Two things shipped.
(1) The service entries got a real build, each on its own trigger: the hairline draws left → right
(now an element, not a border), the title rises out of an overflow mask, kicker + pricing link fade
in, subtitle and includes follow; rows and the right column stagger; on desktop the two columns
drift at different speeds (parallax on the item's `y`, scrubbed). (2) The root cause of "feel
nothing": every section's safety net was a 3s timer from MOUNT, and the ident holds visitors on the
hero for 4.5s, so all nets had fired before the first scroll and nothing below ever animated. New
`armSafetyNet` forces visibility only for on-screen elements; wired into Services, the case-study
index, "One studio.", About text, the About CTA, Reviews, Contact and the FAQ. Linger probe (5.5s
idle, then scroll): every section still hidden before, revealed on arrival, at 1440 and 390, normal
and reduced motion. Headless caveat unchanged: rAF at 3 fps (≈1 fps past the software moon), so
timing is the owner's visible pass.

## Hero: three words, nothing else over it — 2026-09-10

Owner's edit. The hero shows only its own copy and the ident: the fixed logo and the booking link
are hidden while `#hero` is on screen (logo carries `is-home is-hero` like the header and fades in
with it after the hero; the hero's own link is gone). The top-left corner is now the h1
"Creative, / Design, / Development", one word per line, Inter 800 at display size (137px at 1440,
47px at 390, each word one line at both), replacing the vertical "we build" lockup and the intro
paragraph. The logo's scroll-scale scrub went with it (nothing visible to shrink). Verified
headless at 1440 and 390: logo `display: none` over the hero, `block` with `brand-return` after.

Revised the same hour: the headline is a crossword lockup. "DESIGN & CREATIVE" runs across the
top and "DEVELOPMENT" runs down from the shared D, every letter in a square cell of
`--cell: clamp(2.25rem, min(7vh, 5.2vw), 5rem)` (grid-auto-columns = grid-auto-rows, so the
horizontal and vertical steps are identical: 63px at 1440×900, 51px at 1440×723, 48px at
1280×680, measured). The h1 carries `aria-label="Design and creative development"` and the letter
cells are aria-hidden. The column clears the bottom-left note at every size probed. Phones drop the
crossword for three tracked lines of 30px cells ("DESIGN &", "CREATIVE", "DEVELOPMENT"), which
needs a second D cell shown only there.

Second revision of the lockup (owner's DevTools mock): "DEVELOPMENT" across, "DESIGN" down from
the shared D, Inter 300 at 8.75vh (79px at 1440×900). Equal gaps, properly this time: square cells
gave equal STEPS, but glyph widths differ, so the ink gaps did not match (24–30px across vs 20 down
at 63px). Now letters sit at natural widths, each box trimmed to Inter's cap height (line-height
0.73em, so the box bounds the ink), the column hangs off the D itself (centred, no measuring), and
Hero.js ink-fits the row after `document.fonts.ready`: canvas `measureText` gives each glyph's side
bearings and a per-letter em margin makes every ink gap exactly `--gap`. Measured: horizontal
25.2px ×10, vertical 24.4–25.4 (round-glyph overshoot) at 1440×900; 20.2 / 19.6–20.4 at 723; 8.3 /
8.0–8.4 on the phone. Column clears the bottom note everywhere. Weight 300 because 100 is not
shipped (the DevTools mock's 100 was already rendering as 300).

Third revision, owner picked the "spine" from three impeccable-guided options: the crossword read as
tracked label type scaled up, with no lead between the words. Now "DESIGN" is ONE word in Inter 800,
rotated to read bottom-to-top up the left edge, sized so it spans gutter to gutter
(`(100svh - 2 gutters) / 3.6`, its measured length 3.56em); "DEVELOPMENT" is Inter 300 across the
top, flush right of the spine. The bottom-left note moved right of the spine. The ink-fit script is
gone (words set as words need no per-letter spacing). Measured spine 24→866 at 1440×900, 24→648 at
1280×680. Phones stack DESIGN (800) over DEVELOPMENT (300). Known clash: the ident's "edge tail"
plate (a giant clipped letter at the left edge, frames 61–66) overlaps the spine for 0.2s per loop.

Hero copy + colour + phone video (2026-09-10): notes rewritten with the copywriting skill, both now
concrete: left says who it's for and what they get ("Websites, online stores and AI assistants for
businesses that need them to bring in work. We design it, build it and keep it running after
launch."), right points at the proof below ("Each case study below puts the old site beside ours,
with page weight and load time measured on the live pages."). All hero text #fff. The phone video
was a 300px square; portrait screens now get a 9:16 web cut (limited-range BT.709, 266KB WebM /
209KB MP4, poster swapped to the 9:16 end frame by media query) full-bleed behind the copy.
Measured: video 390×848 = hero at 390, 1440×900 = hero at 1440; headline back on the 20px gutter.
Two positioning traps on the way: a `position: relative` frame boxed the absolute video inside the
hero padding, and a relative `.hero-top` inherited the desktop top/left as an offset.

## Services 7 → 4, tiers 26 → 17; moon error boundary; hero stage on wide screens — 2026-09-10

Owner's consolidation, so the service cards match the hero (Design, Code, AI, Growth; one kicker
each). Brand Identity unchanged apart from items (Wireframing and Infographics dropped: that left 3
items, the brief said "trim to 4"; flagged). Web Development absorbed hosting: Build (Landing Page,
Simple Website, Business Bundle, Growth Suite) and Care (Starter Care, Growth Care, VPS &
Self-Hosted), Enterprise Care cut. AI & Automation: AI Roadmap Sprint, AI Assistant, Custom AI
Agent, Automation Retainer (was Growth Integrator), AI Partner (now includes self-hosted n8n);
Workflow Starter and Automation Suite cut; email lifecycle flows became an item. SEO & AI Search:
SEO + GEO Sprint (flagship, first) and Growth Retainer (was Momentum Builder, rewritten
standalone); all social-media and email-retention tiers cut. Redirects (301): automation-integrations
→ ai-development, email-marketing → marketing-ads, hosting-maintenance → web-development. Routes
44 → 41. /pricing entry prices read Brand $750, Web $800, AI $500, SEO $3,000 (the monthly
retainer undercuts the one-time Sprint; the owner may want the Sprint as the displayed entry).

The About moon now has `DecorativeBoundary` plus a WebGL pre-check: with WebGL disabled the home
page renders in full (moon slot stays empty at 500px, FAQ present); with WebGL the moon mounts.
Previously a context failure blanked the whole page. Hero on wider screens: the ident plays on the
stage right of the spine with `object-fit: contain`, the spine caps at 16vw; phones keep full-bleed
cover. Measured at 975×950: spine 115px wide, stage from x=179, wordmark whole.

## Services block: full-screen stage over the interactive grid — 2026-09-10

Owner: the services section read "too clustered". "One studio." and the service menu now share one
`.services-block` over the same `Squares` grid About uses, with black linear fades (28vh) at the top
and bottom so it meets the hero and the stripe on pure black; both sections are transparent and the
pointer reaches the grid through empty wrappers. The menu is `min-height: 100vh` with its cards
centred (padding equalised: measured 177px above / 178px below at 1440×900) and 5rem between rows.
Grid lines dimmed to #3d3d3d in this block so they don't cut through the muted "includes" copy.
`Squares` is now visibility-gated (it ran full-canvas strokes every frame forever, even off screen;
a second instance made that visible as probe stalls). Routes 41, entry marker pinned.

## Services block: panels, hierarchy, spacing, header offset — 2026-09-10 (design pass)

Owner: the header cut the titles, the gap between intro and cards was odd, cards needed a backing
against the grid, and the three card texts had no hierarchy. Applied with impeccable + taste
guidance (hierarchy by size AND weight, ≥1.25 steps; fill not glass for legibility): each service
sits on an 88%-black panel with a hairline border and 12px radius; title is Inter 600 title case
(28.8px at 1440), subtitle Inter 400 at 80% (16.8px), includes line 300 (14.4px), kicker unchanged.
The 100vh moved from the menu to the whole block (`min-height: 100dvh`), so the intro flows into
the cards (65px gap, was about a screen). Section anchors get `scroll-margin-top: 120px` so nav jumps
stop below the fixed header. Two follow-on fixes: the phone link rule still bled 1.25rem outward
(text flush to the panel edge under overflow: hidden), and the column parallax sliced the first
card's top edge against `#services`' clip (menu top padding 2rem; clearance ≥8px measured).

Services cards trimmed (owner: "too much text; the services are the main thing"): the included-items
line is gone from the home cards (the detail lives on each pricing page), the service name is the
dominant element (Inter 600, 49px at 1440, 33px at 390, one line everywhere), and the "One studio."
paragraph went from four sentences to two. Cards dropped from ~280-350px to 200px tall at 1440. The
menu keeps 2rem padding on both ends so the ±24px column parallax stays inside `#services`' clip (the
last right-column card had lost its bottom edge once the block took over the bottom padding).

Service cards go portrait with layered parallax (owner, 2026-09-10, stickers to follow): four 3:4
cards in one row from 1024px (324×432 at 1440), two from 768px, one column on phones. Kicker row at
the top, name + line at the bottom, the middle left open as the sticker slot. Desktop parallax: each
card travels upward at its own speed (34 / 60 / 22 / 48px either side of rest) and its name block a
further 40% inside the card, one tween owner per element per property (card `y`, body-wrapper `y`,
the entrance build on the children). Menu padding raised to 5rem so no card edge reaches the clip:
min clearance 30px measured across three scroll offsets. Tablet and phone run no parallax.

## Services: pinned horizontal pan, after the owner's reference recording — 2026-09-10

The reference (a Readymag gallery section) pins its heading band and slides a card row sideways as
the visitor scrolls down, ending on a solid "Explore more" card. Rebuilt in the house theme: on
desktop (≥1024px, motion allowed) the whole `.services-block` pins (heading, grid, fades), vertical
scroll slides the four portrait cards left under "One studio.", and the row ends on a lavender "All
services & pricing →" card linking /pricing. Layer: each card's name block drifts on x as the card
crosses the screen (`containerAnimation`). The per-card vertical parallax was removed (it fought the
pin). Measured: pinned at top 0 throughout; travel 753px at 1440×900 (cards 405×540), 378px at
1440×800 (330×440), card always fits under the heading; the block releases into the next section.
Reduced motion at 1440 and phones keep the static grid with no pin and no end card.

## Services slide, cursor ring, /services retired, pricing footer — 2026-09-10 (late)

Owner's batch. (1) The pan now ends with "All services & pricing" in the second-from-right slot: a
trailing empty slot (`::after`, one card width) after the end card; measured 443px from the end
card to the right edge at 1440 (one slot + gap + gutter), travel 1860px. (2) Cursor ring: it copied
the hovered element's raw radius while sitting MORPH_PAD/2 outside it, and the services card's
inner link had no radius at all (3px fallback). Now the ring radius is element radius + MORPH_PAD/2
(concentric) and `.services__link` inherits the panel's 12px. Probe: { "pointerDevice": true, "card": { "radius": "12px", "w": 380 }, "ring": { "radius": "17px", "hovering": true, "w": 390 }}. (3) Card links verified in
the built HTML: /pricing/design-branding, /web-development, /ai-development, /marketing-ads; the end
card to /pricing. (4) /services deleted (route, ServicesPage.js, its copy variant, sitemap entry);
301 /services → /pricing; the header dropdown and phone menu read "Services & Pricing", the /pricing
kicker too. Routes 41 → 40. (5) Pricing pages: the dotted `.pg-sep` rule and its styles are gone,
the disclaimer is quiet grey body text, and the two actions are pill buttons (lavender "Book a Free
Strategy Call", outline "Email the studio"), both 48px tall.

## Cursor: a circle everywhere, and the "disappearing" bug — 2026-09-10 (late)

Owner noticed the cursor was sometimes a circle (and preferred it) and sometimes vanished. Both were
one bug: a missed `pointerout`. When the wrapped element vanished under the pointer (header hiding
over the hero, a dropdown closing, the services pin re-parenting the row) no exit event fired, so the
cursor either kept a pill button's ~105px radius at its 25px rest size (the accidental circle) or
stayed glued to a zero-size box at 0,0 (it "disappeared"). Now: the rest shape is a circle (CSS
`border-radius: 50%`, every reset tweens to 50%, the header/FAQ no-morph hover is a hollow circle),
and both hover kinds release on their own when their element is detached, collapses to zero size, or
the pointer leaves its box, with no exit event needed. Probed: rest 25px circle; header hover 35px
hollow circle; wrap on a 30px-radius element gives a concentric 35px ring; deleting the wrapped
element mid-hover returns a 25px circle at the pointer; leaving a no-morph hover with no exit event,
and hiding the header mid-hover, both return a 25px circle.

## Owner batch — 2026-09-11: end card, hero tail, header grid, cursor everywhere, index, About, metric

1. "All services & pricing" never navigated: `.services-block > section` is `pointer-events: none`
   (so the grid gets the pointer in the gaps) and only `.lpp__header` / `.services__item` were
   re-enabled; the end card was missing, so clicks and hovers fell through to the canvas. Added.
   Probed: hit-test lands on the card, the cursor wraps it (17px ring), a click goes to /pricing.
2. Hero: one screen plus a 5rem black tail before the next section (bottom row lifted by the same
   amount, so it still sits at the bottom of the first screen); "Scroll" hides via `[hidden]` once
   the page scrolls past 40px and returns at the top.
3. Case-study index: years removed from every entry and from the intro count.
4. About on the home page: the Squares grid removed, plain black.
5. Cursor: NO_MORPH_ZONES emptied, so the wrap works in the header and the FAQ (probed: header link,
   FAQ row 695px ring around a 685px row).
6. Testimonials: Prodani's quote now carries a metric like Zahav's (−74% homepage weight, 6.95MB
   to 1.83MB, the figure already published in its case study, linked).
7. Header: three columns, nav on the true centre (720 of 1440), "Book a Free Strategy Call" alone
   on the right, the logo still fixed left; ≤960px the menu button is pinned to the right column.

## The Studio Journal becomes a split reader — 2026-09-11

After the owner's "selected works" index reference: /blog and every /blog/:slug render one layout,
`JournalReader`. Left third (sticky under the fixed header): the journal name, the post list (title +
short date, the open post in lavender) and the open post's details as label/value rows (category,
published, reading time, author, topics). Right two-thirds: the article itself, capped at a ~70ch
measure, then a booking prompt and "Next article". /blog opens the newest post (journal name = h1,
article title = h2); a post page makes the article title the h1; heading-skip scan 0. Phones stack
the article first, the list and details after. The body-block renderer moved verbatim into
`src/components/blog/blogBlocks.js` (the `download` attribute survives: the n8n post still emits it);
`blogPage.scss` deleted (dead). Both pages keep their `<Seo>` and JSON-LD; routes 40. Tradeoff to
watch: /blog now shows the newest post's full text, which duplicates /blog/<newest>; the canonical
tags are unchanged.

Journal follow-up (2026-09-11): dates sit right beside each title (12px gap), not pushed to the
column edge; the list paginates at 11 per page (12 posts → page 1 holds 11, page 2 the oldest),
with a pager at the bottom of the left third that opens on the page holding the open post, in the
static HTML too; the article's 44rem (~70ch) reading cap is removed by owner request, so it spans the
full two-thirds (864px at 1440, ~110 characters a line).

## LIVE SERVICE POSTERS — BUILT 2026-09-11, branch `feat/service-poster-live`, NOT PUSHED
Four live SVG posters in the home service cards (`src/components/servicePoster/`): 01 "In register." (Brand Identity), 02 "Every page is a door." (Web Development), 03 "Always on." (AI & Automation), 04 "Be the answer." (SEO & AI Search). Owner decisions at Gate 0: existing tokens only (terra/pink $g4/mint/ink/cream), site fonts only (Inter; SCS Display for the face swap; system mono for labels, zero new font bytes), lilac hover wipe removed (the poster is the hover response, title letter-hop kept), phones get a square poster above the text.
- Modes: static (SSR / no JS / reduced motion / error), pointer (fine pointer), ambient (touch). One shared gsap.ticker; a poster runs only at >= 15% visible.
- Verified (headless, built site): SSR HTML carries all 4 full posters, no `style=""`, nothing at opacity 0; reduced motion leaves every poster at its SSR attributes, no ring element, no listeners; an off-screen poster writes nothing; a forced throw in Poster 01 remounted it as the untouched hero frame while 02-04 kept running; pointer events opened the door to ~0.93 and faded the drawn cursor; pointerenter replay dropped your bar to slot 4 (y 264 = 3 × 88).
- Size: entry chunk 261,555 → 266,055 B gzip (+4.5 KB, target < 8 KB). Route count unchanged at 40.
- OPEN (owner's visible-window pass): perf trace at 6× throttle (headless runs rAF at ~3 fps, so tween timing and ms/frame can't be measured here, see the headless rule in CLAUDE.md); Safari mix-blend + transform check; Firefox. Desktop pan cards leave the poster a wide, short zone (about 250 × 130 at 1440×900), so the square art letterboxes on its own background colour. If it reads too small, the lever is card proportions, not the SVG.

## HOME PAGE PASS — 2026-09-12, on `main` (3c9076a → d647c75)
Owner-directed layout session, one commit per change, each built and measured headless at 1440 and 390.
- **Case studies:** CASE STUDIES wordmark in its own row top-left; index is 3 centred columns with a third line per entry (new optional `indexLine` in projects.json, sourced from subtitle/services; 5 projects carry no platform because none is on record). Hover preview rises into the title row on the right (grid row 1, negative top margin = its own height), with a spinning `CircularText` "seal*of*quality*" stamp on its top-left corner (hidden ≤1024).
- **About:** the 3D moon, `Moon.js`, `moon.glb` and `@react-three/drei` are gone. `DepthImage` (relit photo shader, three + fiber, local SCSS, same IO-gated lazy import; chunk 990 → 879 KB) is the full-bleed 100vh background of the text block, with the owner's tuned values. Two columns over it: studio text (fixed: left-aligned, highlights inline, missing JSX spaces restored, title added, Hermes + OpenClaw named) and `AboutJournal` (newest post from posts.json, updates on every publish). Booking CTA moved inside the statue. Top-edge fade added.
- **Contact:** background video removed (2.7 MB asset deleted); form and animated card side by side ≥769, stacked on phones.
- **Chrome:** header "Book a strategy call" is square, border on black, fills on hover (every route); statue CTA square.
- **Spacing:** logos strip 214 → 46 px above, 0 → 115 px below at 1440.
- **OPEN:** visible-window pass for motion (DepthImage light follow, seal spin, reveals); statue CTA vs text column clearance on short laptops (~40 px at 1440×813, may overlap at 1366×768); phone scrollWidth 404-410 comes from the off-screen mobile menu panel, pre-existing. Route count unchanged at 41.

## TESTIMONIALS PASS — 2026-09-13, on `main` (fd99e8f → next)
- **Git housekeeping:** the logos-strip move (`routes.js`, strip below case studies) sat uncommitted under the two 09-12 spacing commits that assumed it; committed as fd99e8f.
- **Title:** "They trusted us. Here's what happened." → "Our clients, on the record."
- **Blink on entry, fixed:** the global cursor wrapped the carousel (it is `role="button"`), flashed a carousel-sized ring, then faded; `CursorComponent.js` now skips `OWN_CURSOR_ZONES` (`.testimonial-carousel`). The pill also stays mounted and its springs `jump()` to the entry point instead of flying in from a stale position.
- **Prev/Next:** pointer half decides label and click (left = Previous, right = Next); arrow keys both ways.
- **CTAs:** "Read all reviews" (ghost, → /testimonials) + "Book a strategy call" (solid), square, no arrow.
- **Shay Asaraf (Florida Green Improvements) added, first in order:** `shay.avif` 800², greyscale, head-and-shoulders crop matched to the set; new optional `url` on testimonials links the role line (carousel + /testimonials).
- **OPEN:** visible-window hover check; the pill still shows over the role link (link works); dependency alerts (5) deferred to the React upgrade + cleanup pass. Route count unchanged at 41.

## PREVIEWS, ABOUT REDESIGN, TEXTLOOP — 2026-09-13, on `feat/about-redesign` → `main`
- **Case-study previews:** 11 designed 1200×750 posters (`public/projects/<folder>/preview.webp`, new `preview` field; the index hover uses it, `imageSrc` stays for the case page and og:image). Desktop browser frame plus the iPhone view on black; desktop-only for Scout (private app, existing screenshot) and Jelly Belly Wiki (no mobile viewport). 29–71 KB each. Captured with Playwright + system Chrome: popups and cookie banners dismissed, Zahav's Elementor call bubble hidden by injected CSS, any section starting in the bottom 20% of the fold hidden so each hero ends clean.
- **Testimonial:** Shay Asaraf → Shay Assraf (his Google review spelling).
- **About page rebuilt:** opens on the crew (polaroid table + bios, h1 "The people behind the work."), 4 rules, 5-step process with timings read from projects.json, stack, 4 sourced metrics read from projects.json, journal + square CTAs. Cut on review: statue hero, service posters, places, client strip. Unsourced "19+ clients / <2wk" stats deleted. team.json titles: Moses = Brand Strategist · Design & Development, Adi = Social Media Director, Christian (was "Xtian") Gillespie = Content Manager. 4,942 px of content at 1440.
- **TextLoop band** (React Bits) after About on home: owner's settings, "Design ✦ Development ✦ Marketing ✦ AI" on a #5227FF wave ribbon, 688 px tall at 1440 (owner kept it). Iso layout effect, IntersectionObserver-gated tween, local SCSS.
- **Checks:** build green, 41 routes, landing marker in the entry chunk, one h1 on /about, no em dashes, no console or hydration errors, nothing hidden after a full scroll, TextLoop moving at ~91 px/s (speed 90).
- **OPEN:** owner's visible-window pass (TextLoop motion, About reveals); Google Business Profile work parked by owner (a same-name competitor in the profile's web results; NAP-matched LocalBusiness schema proposed); Jelly Belly Wiki not responsive; dependency alerts deferred to the React upgrade.

## HOME ABOUT + CONTACT PASS — 2026-09-13 (late), on `main`
- **Swap:** the TextLoop ribbon now sits inside #about (where the marquee was, above the statue); the "Switch Case Studio" marquee now runs after About, before the reviews (on the route backdrop's black). The ribbon claims `pointer-events: auto` inside `.work-wrapper`.
- **Ribbon:** no pause on hover (owner); new `trim` prop crops the viewBox to the wave's own height, computed from the path numbers so SSR and client agree: band 688 → 435 px at 1440, 201 → 129 px on phones, 7 px clearance at the peaks.
- **About doors:** four quiet square links on the home polaroid table into /about sections (`#ap-principles`, `#ap-process`, `#ap-stack`, `#ap-proof`; ScrollToTop already handles hashes). `Polaroids` takes `children` in its own box; `aria-hidden` moved from the table to each print and sticker so the links stay in the accessibility tree. ≤768 they sit in a row under the table.
- **Contact background:** the InkFill ident, re-framed: a 1920×1080 cut (logo centred, padded with the video's own #141414, `cover`) and a 720×1280 cut for ≤768 shown whole (`contain` on #141414). Re-encoded from full-range bt470bg to limited BT.709 yuv420p, no audio; WebM + MP4 each; wide 345/247 KB, tall 135/109 KB, poster 55 KB. IO-gated mount (300 px), reduced motion = poster only, scrim 62% with black edge fades. Verified in Chrome: right cut per width, playing and looping, no errors, on home and /contact.
- **Checks:** build green, 41 routes, landing marker in the entry chunk, no console errors.
- **OPEN:** owner's visible-window pass (ribbon, door float, contact loop); the ident's loop restart (finished logo → empty) may want a hold or play-once.

## ABOUT PAGE MOTION PASS — 2026-09-14, on `main`
- Owner: "besides the first section [Crew/Polaroids] everything else is very static." Scope agreed via options: signature moment per section, reusing house patterns rather than inventing new ones.
- **New hook** `src/hooks/useBuildReveal.js`: generalizes the Services.js `ServiceItem` typographic build (hairline draw, masked title rise, meta/body fade) into a reusable per-item reveal — hairline/title/meta/body are CSS selectors queried from the item's own root ref, one ScrollTrigger + armSafetyNet per item. Used by Principles, Process steps, Proof metrics, and the closing CTA title.
- **Principles:** each rule (`PrincipleItem`) gets the build (hairline + masked title + number/body fade), staggered `index * 0.06`.
- **Process:** pinned horizontal scrub on desktop (`ProcessTrack`, same gate as Services: `(min-width:1024px) and (prefers-reduced-motion:no-preference)`, JS matchMedia + CSS media query kept identical). One parent effect owns pin + pan + a progress-fill hairline + each step's depth parallax (`containerAnimation`); each `StepItem` owns its own build reveal independently — same division of ownership as Services.js (parent never touches child transforms the child's own effect owns, and vice versa). Below 1024px/reduced motion: static grid, no pin, steps still get their build.
- **Stack:** `We build with` chips wrapped in `MagneticButton` (already proven on AboutCTA/Reviews/CaseStudyPage) + hover fill-invert.
- **Proof:** metric values get the same hairline+mask build instead of a digit count-up — the four sourced values are heterogeneous strings (`−94%`, `61 → 100`, `1 in 13`), and a count-up would have to reformat them, which risks misrepresenting a sourced case-study claim. Tiles lift 4px on hover (CSS only, on the `<a>`, which owns no GSAP transform — no collision with the build's transforms on its children).
- **Closing CTA:** masked title reveal + both buttons wrapped in `MagneticButton` (AboutCTA pattern).
- **Verified headless** (`scripts/headless-probe.mjs`, real Chrome frames — see the occluded-window rule): reveal end-states reach opacity 1 / scaleX 1 given enough wait after the scroll jump (mid-flight reads are the staggered timeline in progress, not a bug — confirmed by re-checking the same state after a longer wait); reduced-motion renders everything visible with zero transform and the static grid; ≤1024px has no pin, no horizontal overflow (`document.documentElement.scrollWidth === clientWidth`), and the pin/pan/progress-fill stay in sync at 1024px+. No console errors. Build green, 41 routes.
- **OPEN:** owner's visible-window pass for tween feel (per the standing rule, only the owner's real-window pass judges motion feel, not headless).

## SERVICES & PRICING REDESIGN — 2026-09-14, on `main`
- Owner: "we need to match the design of 'services and pricing' page with the rest of the website." Investigated before touching code: `git log -1` on `serviceIndexPage.scss` showed it last touched 2026-07-21, two months before the September redesign wave (About, hero, pricingGuide, header) — real staleness, not a false alarm. But the page's orange kicker + bubble "SCS Display" h1 turned out to still be the CURRENT shared convention with `/projects` and `/testimonials` (same header CSS, both touched September, both still orange) — so the header was correctly left alone. The actual mismatch was the BODY: a flat plain-text list (`ServiceRow`) with a pill CTA + box-shadow glow, while the Home Services teaser it visitors arrive from (illustrated `ServicePoster` art, panel + hairline cards, lavender "SEE PRICING") had already moved on. Confirmed by screenshot comparison across `/`, `/about`, `/projects`, `/testimonials`, `/pricing`, not by reading CSS alone.
- **Fix:** rebuilt the 4-service grid as the same card system as Home's `#services` (`services.scss` `.services__item`, reused as `.svi-card`): live poster art, kicker+"See pricing" row, Inter title, subtitle, and a new price line (`from $X`, this page's actual job — the home teaser has no price). Same responsive breaks as home (1 col phone, 2 from 768px, 4 from 1024px). Bottom CTA squared off to match the nav button (every CTA since 2026-09-12) — was a pill with a lilac glow, the one CTA on the page still out of step. Deleted the now-dead `ServiceRow` component + its stylesheet.
- **Bug caught during the build, not after:** the grid was first laid out at `max-width: $max-width` + `6rem` padding (narrower than home's edge-to-edge `$edge-pad` gutter), and the added price line pushed body content to exactly fill the 3:4 card height — the poster rendered at **0px height**, invisible, no error, page looked "done" until measured (`getBoundingClientRect()` on `.service-poster`). Root cause was the narrower column: home's cards are ~324px wide and wrap the subtitle to fewer lines; mine were 234px and wrapped more, leaving nothing for the poster to flex into. Fixed by matching home's actual gutter (`$edge-pad`, full width, not `$max-width`-capped) instead of guessing at card proportions. **Lesson:** when copying a card layout from elsewhere, copy its CONTAINER WIDTH too, not just the card's own CSS — a flex-fill child (`flex: 1 1 auto`) can silently collapse to zero when a narrower column makes its siblings wrap onto extra lines; verify with a rect measurement, not a screenshot glance (this one still "looked plausible" cut off at the fold).
- **Checks:** build green, 41 routes, no console errors, no horizontal overflow at desktop or 390px, cards verified by rect (poster height 165px, not 0) after the fix.

## PRICING TIER CARD FACELIFT — 2026-09-14, on `main`
- Owner: "also the 'http://localhost:3000/pricing/{item}' need some serious facelift." Screenshotted `/pricing/web-development` before touching anything: page header (kicker/h1) already matched the site fine, but `SinglePricingCard` (the tier card) was a light cream rounded panel — pill badge, circular purple check-icon chips, star ratings, and solid-lavender PILL CTA buttons. A generic SaaS-template look with no match anywhere else on the black/hairline/square-CTA site, including the just-rebuilt `/pricing` overview cards one click away.
- **Fix:** `singlePricingCard.scss` rewritten as a dark hairline panel (same family as `.svi-card` and About's hairline lists) — no rounded corners, no box-shadow, no icon chips, no star graphic. Badge → plain kicker text. Feature/benefit lists → hairline-separated plain text (`border-top` between items, first item exempt). CTA buttons now match the NAV's own primary button exactly (`header.scss` `.headingCTA`: black bg, 2px lavender border, fills lavender on hover) rather than inventing a third button style; secondary buttons are the site's ghost square. Testimonial avatar grayscaled to match the About crew photos. Squared `pricingGuide.scss`'s page-bottom CTA pair the same way (was also a lavender pill).
- **Cleanup:** dropped the now-dead FontAwesome plumbing this enabled — `BENEFIT_ICONS`/icon imports in `PricingGuide.js`, `faCheck`/`faStar`/`faArrowRight`/`faArrowUpRightFromSquare` in `SinglePricingCard.js` (arrows are now the site's plain "→"/"↗" text convention, matching Services.js/About/the pricing overview). Side effect: pages ship noticeably lighter (`web-development.html` 117KB → 68KB, `ai-development.html` 96KB → 62KB) since each FontAwesome icon was inline SVG markup repeated per bullet.
- **Checks:** build green, 41 routes, no console errors, no horizontal overflow at desktop or 390px, "Care" tier group (Web Development) renders correctly, testimonial rotator and dots still functional.

## NEW HEADER LOGO — 2026-09-22, on `main`
- Owner supplied the new mark (lilac square SVG + PNG). Copied to `public/brand/` (C2PA metadata stripped, viewBox and PNG cropped to the ink: 1726×990), recoloured to `#DAA9E0` on owner request.
- Header bar slimmed to the logo: 106 → 78px desktop, 81 → 59px phone (`.site-header_inner` min-height = logo height).
- Logo is now inline (`src/components/ui/HeaderLogo.js`): hover / tap plays a left-to-right jelly wave over its 16 letter shapes (GSAP, one run at a time, off under reduced motion). Each letter sits in an outer `<g>` in viewBox units because the potrace paths live in a flipped 0.1 space.
- Checks: build green; headless probe confirms letters transform on pointerover (a synthetic `pointerenter` does NOT reach React's `onPointerEnter`, which listens to `pointerover`). Feel is the owner's visible-window pass. Footer still carries the old `SCSLogo`.

## MOBILE FIXES FROM THE OWNER'S iPHONE — 2026-09-22, on `main` (268c9fb)
- **White bars top/bottom + white sideways gap:** iOS Safari tints its status-bar and home-indicator strips, and paints every overscroll, from the html/body background, which was `$grey-color`. html + body are `#000` now (`<main>` and `.route-backdrop` unchanged, legal pages still light). Two Polaroid stickers widened home to 407px on a 390 phone; html + body carry `overflow-x: clip` (iOS ignores `hidden` on html alone). Home now 390.
- **Play button on the hero / contact videos:** the phone was in Low Power Mode, which blocks even muted autoplay. `src/utils/playMuted.js` retries on the first tap; app.scss hides the native start button so the poster stands. Used by Hero, Contact (both videos), Polaroids.
- **Statue (DepthImage) trapped the scroll:** `touch-action: none` → `pan-y`, plus `pointercancel` handling.
- Checks: build green, 42 HTML files, landing marker in the entry chunk, `--phone` probe scrollWidth 390 on /, /projects, /about, /privacy. Owed: owner's iPhone pass with Low Power Mode on and off.

## LOCAL-ONLY WORKSPACES IGNORED — 2026-09-22, on `main`
- `ADS/` (ad/commercial production: a standalone Remotion project, storyboard frames, VO + music renders) and `linkedin-posts/` are local only; both in `.gitignore`. Nothing under either path is tracked (`git ls-files ADS` empty).
- `.env` is now ignored repo-wide. Before this only `.env.example` existed and no rule covered a real `.env`; API keys for the ad tooling live in `ADS/.env` (covered twice).
- `public/sitemap.xml` regenerated to include the 2026-09-17 post (`brand-guidelines-small-teams-actually-use`), which had shipped without its committed sitemap entry (the generator runs on `prebuild`, so production was already correct).

## MY CHALLAH DEALER CASE STUDY — 2026-09-24, on `main`
- New `projects.json` entry (id 11, first in the array, so it leads the index preview and the next-project chain). Type `Business Website`. Featured, so it joins the Trusted-by strip; logo cut by `scripts/cut-client-logos.py` from a greyscaled cover tile (the kit's 1-color badge PNG renders solid, so the tile is built from `badge-on-black`). The other seven logos came back byte-identical.
- Every figure is from Lighthouse 12.8.2 on the live site, 2026-09-24: A11y/BP/SEO 100 on all five runs, CLS 0, 18 requests; desktop Performance 99 (median of 3). Mobile Performance is NOT published: this machine read 44 and 99 on two runs (TBT 3.8s vs 0.1s), and one run errored. PSI quota was exhausted.
- Owner follow-up the same day: the first-build comparison was removed (a temporary phase, not the story), and the copy now leads with the logo system, print files, web design and the order automation (a confirmation email to the customer and an alert to the owner, per the owner; the repo export of the workflow shows only the owner alert, so it is likely stale).
- Kosher wording follows the client's guideline: "kosher ingredients, home kitchen" exactly, no certification implied.
- Checks: build green, 43 HTML files, landing marker in the entry chunk, every asset path resolves, 0 em dashes, rendered case page and home index eyeballed at 1440 with no console errors or failed requests.
- Brand kit + motion (same day, owner request): two new optional `projects.json` fields render two new case-page sections. `brandKit[]` (+ `brandKitNote`) is a stack of full-width 16:10 boards (2000 × 1250 WebP, width/height attrs set, lightbox zoom). MCD has 8 boards rendered from the delivered SVGs in the brand's own fonts (source HTML kept in scratch, not the repo). `motion` ({mp4, webm, poster, caption, note, alt}) renders `src/components/ui/MotionReel.js`: muted autoplay only while ≥35% on screen (via `playMuted`), paused off screen, opt-in sound button, native controls and no autoplay under reduced motion. Static HTML is the poster and a paused video, the same on server and client. The reel (Remotion master, 1080 × 1920, 21s) is encoded at 720 × 1280 limited-range BT.709: MP4 1.7 MB, WebM 1.4 MB. Verified in Chrome: WebM plays on desktop and phone, pauses off screen; MP4 decodes all 630 frames and its first frame is ink black. No console errors, no sideways scroll at 390.
- Asset weight pass (same day): brand boards gained explicit `srcSmall` 1200w siblings (1000w lost to 3x phones, which need ~1050), so the kit costs 299 KB instead of 568 KB at 1x/3x-phone; retina desktops still take 2000w and the lightbox always opens the 2000w file. The reel poster is WebP now (18 KB, was a 43 KB JPG). Every MCD image is WebP; no AVIF, matching the house (no AVIF encoder here, and AVIF breaks og:image scrapers). Videos load only when played (`preload="none"`).
- Shipped 2026-09-24: owner asked to push; `main` pushed to origin (Netlify deploys from `main`). Sitemap lastmod regenerated in the same commit.

## OWNER POLISH — 2026-09-24, on `main`
- **Door links on the polaroid table had no entrance.** They ride the table's own pop-in switch now (`has-pop` runtime-only, `is-in` on scroll, armSafetyNet): a left-to-right clip-path wipe plus fade, 180ms apart, starting 1.1s in as the last pieces land. clip-path + opacity only (`translate` is the float's); the wipe ends 8px outside the box so the 3px-offset focus ring isn't clipped. Verified: 0 opacity before the scroll, 1 after; reduced motion never hides them.
- **Round marks side by side in the Trusted-by strip** (MCD next to Renewed Bodyworks). Circular marks carry `clientLogoRound` in projects.json; ClientStrip spreads them into evenly spaced slots around the loop (wrap included), wordmarks fill the rest in array order. Now 2–3 wordmarks between badges.
- **Pinned services block top-heavy on tall screens.** Desktop pan layout centres heading + card row as one group (`justify-content: center`, `#services` no longer `flex: 1`). Cards cap at 680px, so the spare height used to sit under the row. Measured: 1800×1860 now splits the space about evenly above and below (~436px below); 1280×800, 1440×900 and 1920×1080 unchanged, card bottom = clip bottom.

## UNHURRIED THEMES, SHOP, OFFICE HOURS, SCHEDULED POSTS — 2026-09-25, on `main` (through 3a77061)
Full system handoff (how every piece connects, secrets, release routine): private repo `switchcasestudio/unhurried-pro` → `HANDOFF.md`. Summary:
- **Products.** Unhurried (free WordPress block theme, public repo `switchcasestudio/unhurried`, v1.0.1, submitted to WordPress.org ticket #292908, v1.0.0 in review) and Unhurried Pro ($49 child theme, private repo `switchcasestudio/unhurried-pro`, v1.2.0: WooCommerce templates, Coming soon page, Shop shelf, lead-story pattern, licence-key auto-updates). Author credit "Switch Case Studio"; canonical name **Moses Atia Poston** everywhere.
- **Pages.** `/unhurried-pro/` (static sales page, self-hosted fonts because CSP is `font-src 'self'`), `/unhurried-pro/thanks/` (noindex; shows licence key), `/unhurried-pro/update.json` (WordPress update check), `/shop` (React route, data in `src/data/shop.json`; Shop is in header + mobile menu).
- **Payments.** Stripe Payment Links: Pro $49 `buy.stripe.com/7sYcN57oi4EM9gb1et33W03` → thanks page with `?session_id=`; Office hour $95 `buy.stripe.com/cNifZh9wq7QYboj2ix33W04` → Google Calendar "Office Hour" booking page. Student Hour (free, Wed + Fri 18:00–19:00 PT) books directly. Oregon: no sales tax.
- **Paid download.** `netlify/functions/unhurried-pro-download.mjs` checks the Checkout Session is paid via the Pro payment link, then streams the zip from the private GitHub release. **This repo is PUBLIC, so the zip never lives here.** Netlify env: `STRIPE_SECRET_KEY` (restricted, Checkout Sessions: Read), `GITHUB_TOKEN` (fine-grained, unhurried-pro, Contents: Read).
- **Blog.** New `link` block (both `add-post.mjs` and `blogBlocks.js`). Daily GitHub Action `.github/workflows/scheduled-posts.yml` publishes `content/scheduled/YYYY-MM-DD-*.json` at 07:00 PT. Queued: 9/29 Unhurried, 10/2 office hours, 10/6 Stripe build notes. Held: WordPress.org announcement (`content/held/`).
- **Social.** Beau (OpenClaw, VPS) injects `content/promo/*.json` into the n8n SCS Social Engine at 09:00 PT on each date (one-off crons, verified). The engine now drafts **X, Instagram, Threads, Bluesky and Facebook** (Facebook added 2026-09-25); nothing posts without Moses's `/approve`. Brief: `content/SOCIAL-KIT.md`.
- **Security.** npm audit fix (browserslist high, baseline-browser-mapping, react-router-dom 6.30.6). Two react-router v6 alerts dismissed as tolerable risk (fix only in v7; vite-react-ssg needs ^6; not reachable here). 0 open alerts.
- Open items: `open-tickets.md` → LAUNCH-UNHURRIED.

## UNHURRIED CASE STUDY — 2026-09-26, on `main`

- `/projects/unhurried` added as the FIRST entry in `projects.json` (id 12, `studioProject: true`, `featured: true`, no `clientLogo` so it stays out of "Trusted by"). Free theme + Pro in one page; CTA `/shop`, link `/unhurried-pro/`, repo `switchcasestudio/unhurried` (verified public, unauthenticated 200).
- Images in `public/projects/unhurried/`: long/hero captured from the free theme's Playground demo (`dev/serve.sh free`), preview/gallery cut from the Pro sales mockups, monochrome cover tile + `-256`/`-512`.
- Metrics sourced from the theme repos only; no sales figures (no purchase yet; the owner's test buy is 2026-09-28).
- `CaseStudyIndex.js` GROUPS: `WordPress Theme` → Products + experiments (it had fallen into a lone "More work" column). Prodani Miami `type` E-Commerce → Rebuild + SEO (owner request).
- Checks: build green, 48 HTML files, meta description clean, AI-writing scan no hits on the page, em-dash gate only the known regex, entry-chunk marker present, no overflow at 1440/390.


## SERVICE POSTERS + PRICING TIER SPREADS — 2026-09-26

- On `main` (7a5661c, deployed): Poster 02 is now "Built to convert." (landing page rebuilds, CTA click, Booked toast) and Poster 03 a workflow graph (trigger → AI → three outcomes, packets always in flight); the home pan's end card carries all four posters as a CSS-only contact sheet (`EndDeck`, Services.js).
- On `feat/pricing-tier-spreads`: `/pricing/design-branding` now compares its three packages on ONE cream board (`src/components/pricing/PackageBoard.js`, art in `spreads/brandIdentity.js`, styles `packageBoard.scss`): rows = deliverables with a thumbnail, columns = packages with price, terra dots in a staircase, graded cells ("Basic / Expanded / Custom"), a "How we get there" row and a native `<details>` "Full list" per package holding the tier's `includes` verbatim. Round one (a band of big tiles on top of each stacked card) was built, rejected by the owner as "too much going on", and replaced the same session. The rotating quote is extracted to `ui/RotatingProof.js` and shown once under the board; `SinglePricingCard` uses the same component (other pricing pages unchanged). Spec: `docs/superpowers/specs/2026-09-26-pricing-tier-spreads-design.md`.
- Checks: build green, 48 HTML files, em-dash gate only the known regex, entry-chunk marker present, site AI-writing zeros hold, no horizontal scroll at 390 (board 358px wide in a 390 viewport), 12 rows + 3 `<details>` in the static HTML.
- Decision (owner): no per-package pages; the board gets anchors per package (column highlight + full list open on `#<package>`) and a "Seen in" row (Brand System & Launch → My Challah Dealer). Logged in open-tickets.md under Decisions.
- Open: `/pricing` overview posters render 258×100 (thin strips); `about.html` reports one h1→h3 skip in the scan (pre-existing, not touched here). Other three services still have no spread.
- Page heads normalised (owner, same day): every page hero now uses the About head pattern through `src/styles/_page-head.scss` (`page-kicker` / `page-title` / `page-lede` mixins): /pricing, /pricing/:slug, /testimonials, /projects, /projects/:slug, /shop, legal, /partners + gate. SCS Display left every page h1; it remains on the footer wordmark, About marquee and About scrub heading only. Verified: `grep -c "SCS Display" build/assets/*.css` hits the app bundle alone; headless computed font on 11 routes = Inter; heads screenshotted at 1440. Dead `.blog-post__kicker/__title` rules removed. /contact keeps the section's 80px Inter 800 h1 (shared with home); tier pages' head sits ~85px higher than the other heads (pre-existing spacing, untouched).
- Web Development boards (owner: "remove the weird Build"): `/pricing/web-development` now shows two boards, the four builds and the three care plans, from `spreads/webDevelopment.js` (SECTIONS with explicit cells; PackageBoard derives the groups). "Seen in": Landing Page → My Challah Dealer, Simple Website → Jo Marketing 11, Business Bundle → Renewed Bodyworks, Growth Suite → Prodani Miami + Zahav Medspa (owner's picks; `examples` is a list). Four data gaps the board exposed were fixed in pricingData.json with the owner's OK: Simple Website + fast load; Business Bundle + gallery, responsive/fast; Growth Suite + analytics, gallery, responsive/fast; Growth Care + domain/SSL. The stray `.pg-group__title` also got the cards' max-width for the day a grouped service still uses cards. Shared art helpers: `spreads/artKit.js`.
- AI & Automation boards: `/pricing/ai-development` shows "What's in each project" (Roadmap Sprint, AI Assistant, Custom AI Agent) and "Month to month" (Automation Retainer, AI Partner) from `spreads/aiAutomation.js`. These tiers are not a ladder, so `PackageBoard.groupRows` now labels a one-tier row "Only in <tier>" and a mixed set by name, keeping "In every" / "From" for the ladder cases. "Seen in": Custom AI Agent → Scout, Automation Retainer → My Challah Dealer (owner: "whatever you think"). Verified at 1440 and 390, no overflow; build green, 48 routes.
- SEO & AI Search board: `/pricing/marketing-ads` (service id `marketing-advertisement`) shows one board, the one-time Sprint against the monthly Growth Retainer, from `spreads/seoSearch.js`; 12 rows, "Only in" groups because the two are different animals. "Seen in": Sprint → Renewed Bodyworks + Florida Green Improvements, Growth Retainer → Zahav Medspa (owner: "whatever you think"). Group-label order is now all → single ("Only in", including the top of a ladder) → suffix ("From") → named mix, so every board's top tier reads "Only in <tier>". All four services now have boards; the stacked tier cards render for no service (kept for a service without a board).
- Session close (2026-09-26, evening): `feat/pricing-tier-spreads` merged to `main` and pushed. Route baseline unchanged at 48 HTML files. Open after this session: `/pricing` overview posters still render as 258×100 strips; `/about` h1→h3 skip in the scan (pre-existing); the tier pages' head sits higher than the other page heads (spacing only); AI Assistant, AI Partner and Simple Website's "Seen in" have no case study yet.

## /PROJECTS REDESIGN — 2026-09-27

- `/projects` rebuilt as the home case-study index grown into a page: `src/data/projectGroups.js` (one groups definition for home + page), numbered rows per group with `indexMetric` (value verbatim from `metrics[]`, label shortened; 11 of 13 projects carry one), sticky real-site stage with caption + "Open case study" on desktop, `preview-600.webp` thumbnails per row on phones. Old cards/badges/tags and `motion/react` gone from the page. Built while this session was locked out of `~/Desktop` (macOS Desktop Folder grant revoked mid-session), verified after access returned.
- Checks: build green, 48 HTML files, em-dash gate only the known regex, entry-chunk marker present, every indexMetric value found in its metrics[], home index still three headings, page outline h1 → h2, phone 390 no overflow, hover swaps the stage in a visible browser.
- Colour pass (owner: "a little depressing and not as fun as the rest of the website"): groups carry `color` (terra / lilac / mint) in `projectGroups.js`; headings, figures and the stage wear it. The stage is now a colour plate (poster grain) with a tilted Polaroid print of the site, a type sticker and a year burst. Verified in a visible browser across all three groups and at 390 (no overflow); build green, 48 routes.
- Third pass (owner: "let's try something else"): poster tiles. Every project is a card with a square plate in its group colour (corner meta, site shot on a cream mount, the figure as headline; type as a one-line headline when there is no figure), three across, groups kept as h2 sections. Rect sweep: 0 overlaps across 13 plates; phone 390 clean; build green, 48 routes. `44aec95` holds the list + Polaroid stage version.
- Fourth pass (owner: "it still looks weird"): the plate is the whole tile. Group name appears once (section heading), title band fixed-height so rows align, figure bottom-left, site shot bleeding off the bottom-right. Rect sweep: 0 figure/shot collisions, every value one line; phone 390 clean; build green, 48 routes.
- Fifth pass (owner: "something is not working for me with the colors"): site-first tiles. Black hairline tiles, the site shot full-bleed on top, type + year, title, index line, figure in lavender pinned to the tile bottom. No group colour on the page. Rows level (measured), 13 shots load, phone 390 clean; build green, 48 routes. Previous versions in git: `44aec95` list + Polaroid stage, `09c4727` colour plates with cards, `424870c` plate-as-tile.
- Sixth pass (owner: "a different grid, this is a little boring"): feature + stack per group. 12-column grid: newest project = feature (span 8, two rows, blurb, ~4:3 shot), two tiles stacked beside it, the rest in thirds/halves. Tablet 2-up, phone 1-up. Feature shots measured 662×460 (1.44) at 1200; phone 390 clean; build green, 48 routes.
- UI/UX pass on /projects (impeccable critique + UI/UX Pro Max checklist): detector 0 findings; contrast measured on every text style (lowest 5.3:1); Tab reaches every card with a 2px lavender ring; h1 → h2; alt on every image; reduced-motion covered. Fixed: card meta 11px → 12px (text floor), group h2 was a 12px tracked eyebrow (third one on the page) → a real heading between h1 and card titles, section `aria-labelledby` its h2, and each card link got an `aria-label` (title, type, figure) because its visible spans ran together for a screen reader ("Rebuild + Local SEO2026Renewed Bodyworks…").

## /TESTIMONIALS REDESIGN — 2026-09-27

- One voice at a time: stage (pull-quote large, person, full review, site shot + sourced figure where a case study exists) plus a sticky name list (`<button aria-pressed>`) that switches it; static HTML stacks all seven, `is-live` collapses them from 900px up; phones read the stack. `project` slugs added to five testimonials. Old cards, side-stripe quote and `motion/react` gone from the page. Verified in a visible browser (Shay, Sean, Lior), phone 390 (7 panels, no overflow), contrast lowest 5.3:1, h1 → h2; build green, 48 routes. Also restored the SEC-1 rule's opening sentence in CLAUDE.md, severed by an earlier docs edit.
- Auto-advance added (owner: "like a carousel, every 20 sec"): 20s interval, wide screens only, off under reduced motion, paused on hover/focus, skipped when the tab is hidden, stops for good on a pick; progress line under the active name. Verified headless: Shay → Ori → Shiran at 20s steps; in the browser a pick drops `is-auto`.
- Session close (2026-09-27, midday): pushed `main` (projects grid + a11y pass, testimonials stage + auto-advance). Route baseline unchanged at 48. Open: `/pricing` overview posters as thin strips; `/about` h1→h3 scan note; tier-page head spacing; "Seen in" gaps (AI Assistant, AI Partner, Simple Website).


## JOURNAL COVERS + SCHEDULER SYNC — 2026-09-30

- Local `main` rebased onto the scheduler's 2026-09-29 commit (Unhurried theme post, `scs-scheduler`); no conflicts, the local star-mark SVG commit sits on top. Route baseline 48 → 49.
- The two posts the scheduler shipped without a cover (09-17 brand guidelines, 09-24 Search Console) now carry 1600×900 Unsplash covers (an illuminated tachometer by Chris Liverani; Pantone chips on dry grass by Taylor Heery) plus `imageAlt`. Verified on the build: `<img>` in `.journal__cover`, `og:image` + `og:image:alt`, BlogPosting `image`; headless screenshots at 1440 and 390, no horizontal overflow; em-dash gate 1 (the known regex), entry-chunk marker present, SCS Display in the app bundle only. No post is without a cover now.
- Session close (2026-09-30): pushed `main` (star-mark SVG + the two covers + regenerated sitemap). Route baseline 49. Open: `/pricing` overview posters as thin strips; `/about` h1→h3 scan note; tier-page head spacing; "Seen in" gaps (AI Assistant, AI Partner, Simple Website).

## CLEANUP — 2026-10-06

- Branch `chore/cleanup-2026-10` (log: `.audit/cleanup-2026-10-log.md`). Removed unreachable JS (`CaseStudyTiles.js`, `HoverPeek.js`, `useBentoParticles.js`, `useBentoSpotlight.js`, `bentoEffects.js`), orphan SCSS (`cursorWave.scss`, `hoverPeek.scss`, `_projects-tiles.scss`, `_projects-bento.scss`) and dead selectors, the 26 cover-tile `-256`/`-512` siblings, `@radix-ui/react-hover-card` and the mediapipe `postinstall`, and the unread `panelClass` / `backLabel` / `productName` fields. Every step gated on a normalised build diff (see the CLAUDE.md rule).
- Entries above that cite these files describe the site at their date; they are not current. Route baseline 52 HTML files. Open: the REVIEW table in the log (owner decides).

## SEO AUDIT FIXES 1–5 — 2026-10-09

- Full `/seo audit` (9 subagents, no GSC/PSI data: the claude-seo runtime is not set up). Health ~66/100. The findings and the rest of the fix list live in the session memory (`seo-audit-2026-10-09`); fixes 1–5 landed on `fix/seo-audit-2026-10`:
  1. React 19 + the route-level Suspense shipped every page body in `<div hidden id="S:0">` after the footer since the 10-07 upgrade (non-JS crawlers and extractors saw an empty `<main>`). Suspense removed from `routes.js`. 0 hidden divs on 53 pages, h1 inside `<main>` everywhere, hydration console clean on six routes, four client navigations clean.
  2. Blog paragraphs and list items take inline links `[label](url)` (`inlineLinks.js`, rendered by `blogBlocks.js`, validated by `add-post.mjs`, word counts strip the url). Parser unit-tested in node; markup proven through Vite SSR. No existing post changed.
  3. The 10-08 fonts post had no cover (lavender plate, generic og:image). In-house type-specimen cover at `public/images/journal/how-to-choose-fonts-for-a-small-business-website.jpg` (1600×900, 148KB) + `imageAlt`; og:image, og:image:alt and BlogPosting `image` carry it. No post is without a cover.
  4. Case-study media tiles render statically and drop out only on image error (`useImageFailed`). Zahav CLS 0.194/0.135 (desktop/phone, live) → 0.003/0.001 (3 Lighthouse runs each, local build); LCP element unchanged (the band image, before and after). All 13 case studies carry the band in HTML.
  5. `netlify.toml`: `/assets/*` → `Cache-Control: public, max-age=31536000, immutable` (bundles re-validated on every repeat visit before). Verify on prod after deploy with `curl -sI`.
- Standing gates: 53 HTML files, em-dash gate 1 (the regex), entry-chunk marker in `app-*.js` only, SCS Display in the app CSS only, home index 3 headings. Merged as PR #30 (main `14e0be4`) and verified on prod the same day.

## SEO AUDIT FIXES 6–7 — 2026-10-09

- PR #30 (fixes 1–5) merged and live; verified on prod: 0 `id="S:"` divs on five routes, h1 inside `<main>` on /about, app chunk `cache-control: public,max-age=31536000,immutable`, fonts post `og:image` = the jpg. Merged branches pruned locally and on origin; only `main` remained before this work started on `fix/seo-audit-2026-10-b`.
- **Fix 6, unsourced claims.** `projects.json`: Crimson's "Top 3 · Google ranking for core search terms" metric deleted (marked MOCK in the 2026-08 audit; "< 7 days" stays as a delivery placeholder, like Jo Marketing's and FL Energy's "< 2 weeks"; About's TIMINGS still read it; `/projects`' indexMetric still valid; the results grid holds the one metric plus the hero-detail tile, no empty cell). Zahav: "Google SEO score" → "Lighthouse SEO score", "Google scores the site 100/100" → "Lighthouse scores". `posts.json`: fast-sites intro rewritten around Florida Green's 11.62s → 3.46s (the industry bounce statistic went; the Google pages carrying the research render by JS and could not be read), "Fast sites rank higher…" cut, "ranking factor" linked to Google's page-experience doc; CWV post's Zahav item says Lighthouse; contact-forms post names and links Baymard's checkout research. Built pages carry none of: "Top 3", "Google SEO score", "Google performance score", "brutal", "Research-backed".
- **Fix 7, internal links.** Every post now has ≥ 1 `/pricing/<service>` link and ≥ 1 `/projects/<slug>` link in its text (47 edits in `posts.json`, format byte-stable through `JSON.stringify(…, null, 2)`); the CWV post links all three case studies in its figures list. Anchors state only what the case study says (RB: noindex, no prices, a page per city; MCD: order form → Sheet + two emails, Lighthouse 100 a11y; Scout: six sources, ten stages, evidence per score; Zahav: two 28-day windows, page two → one; Unhurried; FG). The navigation-labels post has no honest case hook and links `/projects` instead. Three external sources (Google page experience, Google helpful content, Baymard) render `target="_blank" rel="noopener noreferrer"`. Case studies: `servicePages` on all 13 projects (slugs validated against `services.json`), rendered as "Service(s): …" links in `CaseStudyPage`'s top bar; the back link is "All case studies" → `/projects` (was "Back to Selected Work" → `/#projects`). Top bar is flex: desktop one row (back left, services right-aligned to the 1296 edge at 1440), phone wraps under the back link, 44px rows, no horizontal overflow (headless, 1440 and 390).
- Gates on the build: 53 HTML files, 0 hidden divs, em-dash 1 (the regex), entry marker in `app-*.js` only, SCS Display in the app CSS only, home index 3 headings, `ai-writing-scan.py` blog 2.0/1k vocabulary (all pre-existing hits), 1 vague-attribution hit ("many businesses", graph-engineering post, pre-existing).
- Verification one-liner (run after any post or project edit): `node --input-type=module -e 'import {tokenize,badLinks} from "./src/components/blog/inlineLinks.js"; …'` tokenizing every paragraph and list item, counting `/pricing/` and `/projects/` links per post, asserting every root-absolute url is a known route and every `servicePages` slug exists in `services.json` (script kept in this session's scratchpad; rebuild it from the CLAUDE.md rule).

## SEO AUDIT FIXES 8–9 — 2026-10-09

- Fixes 6–7 merged as PR #31 (main `5367090`) and verified on prod: case-study service links and "All case studies" → `/projects`, flagged strings gone, the fast-sites post's three links live. Work for 8–9 on `fix/seo-audit-2026-10-c`.
- **Fix 8, titles and descriptions.** Before: 15 titles over 60 (14 blog + home, worst 84), 17 descriptions over 160 (16 blog + home, worst 200). New `src/utils/seoText.js` holds `brandTitle` (keeps " | Switch Case Studio" only when it fits in 60), `clampAtWord` (moved from `CaseStudyPage.js`; a whole sentence ending past half the budget now keeps its period and no ellipsis, so Zahav's description reads "…runs the same ads." instead of "…ads…") and the two budgets. Blog posts and case studies use `brandTitle`; posts take an optional `seoTitle` (Unhurried: "Unhurried: A Free WordPress Theme for Spas and Studios", the h1 unchanged). The 16 long excerpts were trimmed at the data to 139–154 characters (they are the visible lede too, so no second description field); two "not X, it is Y" constructions left with them (scan: blog "not just" 8 → 7, ", not X" 22 → 21). Home: "Switch Case Studio | Web Design, Development & AI Automation" (60) and a 148-character description. `add-post.mjs` warns, never rejects, on either budget (the scheduler runs it unattended), passes `seoTitle` through, and was dry-run both ways (a 77-character title and a 200-character excerpt print both warnings, exit 0; a clean post prints none; `posts.json` untouched). After: 53 of 53 pages ≤ 60 / ≤ 160, measured on the build after unescaping `&amp;`.
- **Fix 9, schema `@id`s.** New `src/utils/schemaIds.js` (`ORG_ID`, `WEBSITE_ID`, `ORG_REF`, `personId`, `authorNode`). index.html: WebSite `@id` `…/#website`; founder `Moses Atia Poston` with `@id` `…/#moses-atia-poston` and `url` `/about` (was "Moses", no id). BlogPosting and Blog `publisher`, Service `provider`, CreativeWork `creator` → `{"@id": "…/#org"}`; blog `author` → the founder's Person node with the shared id and `url`; Blog gets `@id` `…/blog#blog`. About's members carry `@id`s; Eno stays on the page and leaves the markup through `"structuredData": false` in `team.json`. New: `ContactPage` on `/contact` (`mainEntity` = org), `CollectionPage` + `ItemList` (13 case studies, page order) on `/projects`. Checked by parsing every `application/ld+json` block in the build: 53 pages, 0 parse errors, every bare `{"@id"}` reference defined on its page, no inline Organization copy, no Eno, no short founder name; the founder id appears on index, About, the blog index (21) and each post. `check:sameas` still OK (7 profiles).
- Gates: 53 HTML files, 0 hidden divs, h1 inside `<main>` on every page, em-dash 1 (the clamp regex, now in the `seoText-*.js` chunk; CLAUDE.md updated), entry marker in `app-*.js` only, SCS Display in the app CSS only, home index 3 headings.
- Not yet done from the audit: 10 cost guides, 11 phone text/tap targets/cookie banner, 12 /about phone LCP, 13 small items (`/llms.txt` 404, sitemap `lastmod`, 404 canonical, the `<title>` text inside an index.html comment), 14 blog hygiene, and the owner decisions (Bluesky profile, name collision, Portland page, Beau's pipeline learning `[label](url)` and the 160-character excerpt).

## CASE-STUDY REPOS + SEO AUDIT FIXES 11 AND 13 — 2026-10-09

- Fixes 8–9 merged as PR #32 (main `10981a2`) and verified on prod (Unhurried title tag, home title, Codex description, ContactPage, CollectionPage with 13 items, founder id, no Eno).
- **Repo links (owner request: Renewed Bodyworks, My Challah Dealer, Zahav, Prodani), on their own branch `feat/case-study-repos`, gated.** All candidates cloned and swept over full history (diffs and messages) for keys, `.env` values, emails, phones, sheet ids, webhooks, admin URLs, analytics exports, IPs. Renewed Bodyworks (`renewedbodyworks-website`, PRIVATE): clean, only the business's public phone and GA id; linked, but it 404s until the owner makes it public. Prodani (`prodani-miami`, PUBLIC, README says public by design): no credentials; one internal doc carries a private-looking postal address (in HEAD and history) that the live site does not show; linked, owner to decide before merge (details in the private handoff, not here). My Challah Dealer (PRIVATE): NOT linked; history holds the orders CRM sheet id, two personal inboxes (one in the n8n workflow), the client's marketing plan and a 558-line worklog; the live site already exposes the order webhook. Remedy if wanted: a fresh single-commit public repo of the app only (CLAUDE.md rule), with the client's OK. Zahav: NOT linked; `zahavmedspa` is an empty Vite starter (1 commit, renders "Welcome"), `zahav-audit` is the client workspace (never linked), `zahav-newsletter-preview` is a public draft newsletter, not site source. All other linked repos re-checked unauthenticated: 200.
- **Fix 11 (phones), branch `fix/seo-audit-2026-10-d`.** Root cause of the 13px text: `app.scss` set `body` to 13px at ≤768 (14px to 1024); removed. Reading paragraphs 1rem on phones (FAQ answers were 0.9rem on phones only). 44px touch targets under coarse pointers: menu rows 37 → 44, footer links ~35 → 44, socials 36 → 44, footer email hit area, consent buttons 33 → 44 with the banner kept under its old 166px. /blog h1 lifted to the top on ≤900px (was ~5,800px down). Pricing boards: cell text 12px (was 8.8–10.9), micro-labels 10px, `hyphens: auto`, no forced breaks; overflowing cells 15 → 13, page overflow 0. Home intro: already inside the first screen at 390×844 and 375×667 (hero is 100svh); no change. Measured with touch emulation at 390×844.
- **Fix 13 (small items).** Sitemap lastmod per page (24 URLs had shared one date). `/llms.txt` generated on prebuild (served 200 text/plain; 4 services, 13 case studies, 20 posts). No canonical on the four noindex pages; every indexable page keeps one. index.html comment no longer contains title-tag text: 1 title match per page on all 53.
- Gates (final build): 53 HTML, 0 hidden divs, em-dash 1, entry marker in `app-*.js` only, SCS Display in the app CSS only, home index 3 headings, check:sameas OK, hydration console clean on the routes probed.
- Still open: smaller standalone tap targets outside menu/footer (home carousel progress tracks 3px tall, pricing proof dots 6px, hero nav 20px, About jump links 32px, journal list rows 30px); 10 cost guides; 12 /about phone LCP; 14 blog hygiene; owner decisions above plus Bluesky, name collision, Portland page, Beau's pipeline (inline links, 160-character excerpt, `seoTitle`).

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
