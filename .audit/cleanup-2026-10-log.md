# Cleanup 2026-10: findings log

Plan: `.audit/cleanup-2026-10-plan.md`. Method: `.audit/cleanup-protocol.md` (2026-06). Branch `chore/cleanup-2026-10`, worktree `../scs-cleanup`.

## Baseline (main @ 5bbe6ac, 2026-10-06)

- 52 HTML files (51 + the 2026-10-06 scheduled post)
- entry marker `__SCS_LANDING_PATHNAME__` in `build/assets/app-CAKgkGpB.js`
- `build/` 38M, 317 files; `public/` 26M, 270 files; `src/**/*.js` 103 files, 15,689 lines; 56 SCSS files
- Gate: builds are NOT byte-reproducible as emitted. vite-react-ssg writes a per-build random id into loader-data filenames and every HTML, and the loader-data manifest's key order varies per build (parallel render). The gate blanks the id and sorts the manifest keys before hashing; with that, two builds of unchanged source compare IDENTICAL (verified).

## Findings

(one entry per phase: what was removed, the evidence, the gate result, the commit)

### F1 — Task 1: dead JS

Tools: knip (npx, throwaway config: entries `src/index.js`, `src/routes.js`, `src/components/pages/*.js`, `scripts/*`, `netlify/functions/*`; knip cannot follow the `page(() => import(...))` route wrapper, so with default config it called every page dead) and an independent BFS over `import`/`export from`/`import()` specifiers from `src/index.js` + `src/routes.js` (98 of 103 `src/**/*.js` reached).

Removed files (knip AND the walker agree unreachable; each opened and read; 736 lines):

| File | Lines | Last consumer |
|---|---|---|
| `src/components/sections/CaseStudyTiles.js` | 301 | home tile grid, replaced by `CaseStudyIndex` on 2026-09-09; only word hits left are comments |
| `src/components/ui/HoverPeek.js` | 123 | imported only by CaseStudyTiles (lazy) |
| `src/hooks/useBentoParticles.js` | 138 | imported only by CaseStudyTiles |
| `src/hooks/useBentoSpotlight.js` | 130 | imported only by CaseStudyTiles |
| `src/utils/bentoEffects.js` | 44 | imported only by the three above |

Removed symbols (imported or exported, never used; a word-boundary scan of every import binding, spread false positives checked by hand):
- `headerVariants`, `lineVariant` exports in `src/utils/motionVariants.js` (0 importers; `containerVariants`/`cardVariants` stay, ServiceIndexPage uses them)
- `SupportArt` from the import list in `spreads/aiAutomation.js`
- `REVEAL_SAFETY_DELAY` from the import list in `AboutText.js`
- `import ScrollTrigger from 'gsap/ScrollTrigger'` in `AboutHeading.js` (binding unused; the plugin is registered in `src/index.js`)
- default `React` binding in `PricingGuide.js` and `StripeSection.js` (automatic JSX runtime, no `React.` use)

Suspect greps (word match, src + scripts + index.html + vite.config + netlify): `WelcomeTyped` 0, `CursorWave` 0, `GradientText` 0, `Moon` 2 (comments only; `MoonSlot` is live and renders DepthImage), `TextPressure` 9 (live, rendered twice in `CaseStudies.js`), `motionVariants` 1 (live importer). No `*Old*`/`*Legacy*`/`*v1*`/`*Backup*` files in src, scripts or public.

Unused exports left in place (used inside their own file; only the `export` keyword is dead): `GA_MEASUREMENT_ID`, `CONSENT_KEY` (ga.js), `META_PIXEL_ID` (metaPixel.js), `detectMode` (usePosterEngine.js), `GROUPS` (projectGroups.js). See REVIEW for the ones with no use at all.

Knip disagreement: knip calls `src/components/ui/DepthImage.js` unused; the walker reaches it and it is rendered (`About.js` `lazy(() => import('../ui/DepthImage'))`, `<DepthImage`). Kept; knip misses that lazy import, so its `three` / `@react-three/fiber` "unused dependency" findings are false positives for Task 5. `@radix-ui/react-hover-card` is now genuinely unused (only HoverPeek imported it) — Task 5.

Follow-ups for later tasks: `src/styles/components/hoverPeek.scss` is now orphaned (only HoverPeek imported it; it was never compiled since the file was unreachable). The comment in `CaseStudies.js` ("CaseStudyTiles still serves LandingPageProof") was already false before this pass: LandingPageProof imports nothing from it.

Gate: `npm run build` then `diffbuild.sh` → `IDENTICAL to baseline`, html 52, entry marker in `build/assets/app-CAKgkGpB.js` (same entry hash as baseline). The prebuild sitemap regeneration (lastmod dates only) was not committed.

### F2 — Task 2: orphan SCSS

Walker (`scss-orphans.mjs`): every SCSS import in `src/**/*.js` and `index.html`, every `@import`/`@use`/`@forward` in `src/**/*.scss`, transitive reachability. No `#{}` interpolation inside any import line. Two orphans, both with zero importers:

| File | Lines | Evidence |
|---|---|---|
| `src/styles/components/cursorWave.scss` | 23 | `.cursor-wave` hero field; `CursorWave` removed 2026-09-09 with the video hero; no `cursorWave` or `cursor-wave` reference left in src |
| `src/styles/components/hoverPeek.scss` | 72 | only `HoverPeek.js` imported it (deleted in Task 1); one comment mention in `_projects-tiles.scss`, no code |

Gate: `npm run build`, `diffbuild.sh` gives `IDENTICAL to baseline`, html 52, entry `build/assets/app-CAKgkGpB.js`.

### F3 — Task 3: dead selectors

Method: class names extracted from the selector text of the BUILT CSS (comments, strings and `url()` stripped; 838 classes), then a word-boundary search for each in `src/**` non-style files (JS comments stripped), `src/data/*.json`, `index.html` and `public/unhurried-pro/**`. 42 non-Font-Awesome suspects, each reviewed by hand against template literals (`sp-bg-${cfg.bg}`), `classList`, data files and route/state classes. Prose matches make this lenient (`.tile` survived it on the word "tile" in comments and copy), so every rule in the old tile and bento partials was also checked by name.

Removed (35 classes, certain dead: the component or block they styled is gone):

| File | Lines | Classes | Evidence |
|---|---|---|---|
| `src/styles/components/_projects-tiles.scss` (deleted, import dropped from `projects.scss`) | 478 | `row-tiles`, `tile`, `tile-badge`, `tile-media`, `tile-image`, `tile-peek-image`, `tile-title`, `has-peek`, `is-loaded`, `panel-excerpt`, `projects-viewall`, `projects-viewall__link` | old home tile grid; `CaseStudyTiles.js`/`HoverPeek.js` deleted in Task 1, `CaseStudyIndex` renders none of these; `$tile-*` vars used nowhere else; `.cta-arrow` stays live in `work.scss` |
| `src/styles/components/_projects-bento.scss` (deleted, import dropped) | 67 | `tile-bento-glow`, `bento-particle`, `bento-global-spotlight` | only the bento hooks created these; hooks deleted in Task 1 |
| `src/styles/components/blogPostPage.scss` | 157 | `blog-post` (wrapper declarations only; the `&__` block children stay), `blog-post__topbar`, `__back`, `__header`, `__lede`, `__byline`, `__author`, `__author-role`, `__byline-meta`, `__cover`, `__body`, `__tags`, `__tag`, `__next`, `__next-link`, `__next-label`, `__next-title` | old post page; the split reader (2026-09-11) uses only the block classes from `blogBlocks.js` (`__h2`, `__p`, `__list`, `__video*`, `__download*`, `__link`, `__quote`), all kept |
| `src/styles/components/testimonialHeading.scss` | 11 | `gradient-overlay` | its own comment said unused (`showBorder=false`); no `showBorder` or `gradient-overlay` anywhere in JS |
| `src/styles/components/work.scss` | 8 | `squares-bg` | no caller passes it; `Squares` renders `squares-canvas` and About no longer mounts a grid |
| `src/styles/components/landingPageProof.scss` | 10 | `lpp__kicker` | `LandingPageProof.js` renders no kicker |

Mentions left for Task 7 (comments/docs, not code): `journal.scss:394` (".blog-post wrapper"); CLAUDE.md lines 77, 100, 126 (`.row-tiles`, tile badge, `_projects-tiles.scss` remainder rules); `.audit/summary.md` 165, 818, 829, 1234, 1380, 1601, 1644; `.audit/legacy-cleanup.md` 283, 288; `.audit/cleanup-protocol.md` 94; `CaseStudies.js:83` "tile grid" comment.

Gate:
- `npm run build` green. `diffbuild.sh` lists every HTML and most JS chunks as changed, because each embeds the content-hashed CSS file names (`app-*.css`, `JournalReader-*.css`) and the build id. With asset hashes and the build id normalised (`normhash.mjs`), the only differences are `assets/app.css` and `assets/JournalReader.css`, plus `static-loader-data-manifest` key order (same entry set when sorted). All 416 other files identical. HTML 52; entry marker in `build/assets/app-Cv4s0_Cm.js`.
- Class sets: `comm -13 new old` = exactly the 35 names above (`bento-global-spotlight bento-particle blog-post blog-post__author blog-post__author-role blog-post__back blog-post__body blog-post__byline blog-post__byline-meta blog-post__cover blog-post__header blog-post__lede blog-post__next blog-post__next-label blog-post__next-link blog-post__next-title blog-post__tag blog-post__tags blog-post__topbar gradient-overlay has-peek is-loaded lpp__kicker panel-excerpt projects-viewall projects-viewall__link row-tiles squares-bg tile tile-badge tile-bento-glow tile-image tile-media tile-peek-image tile-title`). `comm -23 new old` = empty.
- Screenshots (headless probe, `--reduced-motion`, baseline on :5051 vs new on :5052): `/blog`, `/pricing`, `/projects` desktop + phone and `/` phone pixel-identical. `/` desktop (5 px) and `/about` desktop + phone differ; baseline vs baseline differs in the same regions on reruns (`/about` polaroid/depth-image area, home hero), and a second new-build home shot matched baseline exactly. Non-deterministic pages, not the change.

### F4 — Task 4: unused assets

Method (`assets.mjs`): 277 files inventoried (270 in `public/`, 7 in `src/assets/`). Corpus: `src/**` (js, scss, json), `index.html`, `netlify.toml`, `content/**`, `scripts/**`, `.github/**`, text files in `public/**`, and the built `build/**` (html, js, css, json). A file counts as REFERENCED when its served path (or URL-encoded form) appears anywhere but in its own copy; DERIVED when a sibling rule maps it to a referenced parent (`-256`/`-512`/`-600.webp`, `Inter-#{$w}`, `/polaroids/${p.name}`, `/stickers/${...}`). A second pass (`refwhere.mjs`) listed every public file with no hit in `build/`.

| Class | Files | Size |
|---|---|---|
| REFERENCED | 236 | 26.05 MB |
| DERIVED | 26 | 0.08 MB |
| BASENAME-ONLY | 9 | 0.51 MB |
| UNREFERENCED | 6 | 0.17 MB |

DERIVED was the 26 cover-tile siblings, and their rule no longer holds: the only code that built `${coverTile}-256.webp 256w, …-512.webp 512w` was `CaseStudyTiles.js` (line 93), already unimported on main and deleted in Task 1. No file in `src/`, `scripts/` or `build/` names or builds a `-256`/`-512` path now. The base `*-cover-tile.webp` files stay: `projects.json` names them and `scripts/cut-client-logos.py` reads them.

BASENAME-ONLY, checked by hand: `robots.txt`, `.well-known/security.txt` keep (protocol files). `unhurried-pro/index.html`, `thanks/index.html` keep (static routes). `unhurried-pro/update.json` keep (the theme's update check fetches it from outside the site). `brand/…-logo-square-lilac.png`, `unhurried-pro/img/cart.{avif,webp}`, `free.avif`: no real reference (the hits were the stems "cart", "free" in prose; `artKit.js` names the `.svg` logo, `shop.json` names `free.webp`), so REVIEW below.

Deleted (26 files, 88,982 bytes, all certain: consumer component gone):

| File (`public/projects/<slug>/`) | Bytes |
|---|---|
| `birth-of-venus/birth-of-venus-cover-tile-256.webp`, `-512.webp` | 1,582 + 3,040 |
| `crimson/crimson-cover-tile-256.webp`, `-512.webp` | 1,792 + 4,040 |
| `florida-energy-assistance/florida-energy-assistance-cover-tile-256.webp`, `-512.webp` | 1,104 + 3,030 |
| `florida-green/florida-green-cover-tile-256.webp`, `-512.webp` | 1,778 + 3,302 |
| `jelly-belly-wiki/jelly-belly-wiki-cover-tile-256.webp`, `-512.webp` | 2,696 + 5,874 |
| `jo-marketing-11/jo-marketing-11-cover-tile-256.webp`, `-512.webp` | 1,618 + 3,168 |
| `my-challah-dealer/my-challah-dealer-cover-tile-256.webp`, `-512.webp` | 4,614 + 12,562 |
| `prodani/prodani-cover-tile-256.webp`, `-512.webp` | 1,872 + 3,792 |
| `renewed-bodyworks/renewed-bodyworks-cover-tile-256.webp`, `-512.webp` | 3,992 + 10,110 |
| `scout/scout-cover-tile-256.webp`, `-512.webp` | 1,226 + 2,784 |
| `sha-design-studio/sha-design-studio-cover-tile-256.webp`, `-512.webp` | 998 + 1,822 |
| `unhurried/unhurried-cover-tile-256.webp`, `-512.webp` | 2,444 + 4,658 |
| `zahav/zahav-cover-tile-256.webp`, `-512.webp` | 1,518 + 3,566 |

Totals: 0.08 MB freed. `public/` 270 → 244 files, 26,824 → 26,688 KB on disk (`du -sk`; still 26M). The bulk of `public/` is referenced media; this task found little dead weight.

Gate: control build with the 26 files restored vs build without them, both normalised (`normhash5.mjs`: asset hashes plus the per-build id read from the manifest name). The only difference is the 26 files leaving `build/` (416 → 390 lines); every HTML, JS, CSS and JSON file identical. `grep -rlF <basename> build/` empty for all 26. HTML 52; entry marker in `build/assets/app-Cv4s0_Cm.js`.

REVIEW from F4: rows 5–8, 10 files, 0.65 MB (left in place).

For Task 7 (docs now stale): CLAUDE.md "Adding a project" rule (2) says `coverTile` needs its `-256`/`-512` siblings and the Renewed Bodyworks logo rule says to greyscale them; `scripts/cut-preview-thumbs.py:8` cites "the coverTile -256/-512 siblings" trap. `coverTile` itself is no longer rendered anywhere (only the logo script reads it).

### F5 — Task 5: dependencies

Import-site census of every `package.json` entry (`src`, `scripts`, `vite.config.js`, `index.html`) plus knip (`--include dependencies,unlisted`): no unlisted runtime imports. Only one dependency had zero import sites.

| Removed | Why |
|---|---|
| `@radix-ui/react-hover-card` | Sole importer (`HoverPeek.js`) went in Task 1 |
| `postinstall` script | Wrote a stub `@mediapipe/tasks-vision` source map. Nothing in src, scripts or config names mediapipe and it is not in the lockfile (transitive of a removed dependency); `npm ls` listed the folder as `extraneous`, i.e. the stub itself |

Kept on evidence: `react-router-hash-link` (`Hero.js`), `prop-types` (`ScrollingShot.js`), `@emailjs/browser` (2 sites), `@fortawesome/free-solid-svg-icons` (3 sites), `sass` (Vite compiles `.scss`, no import site by design), `three` and `@react-three/fiber` (knip false positive: `lazy(() => import('../ui/DepthImage'))`).

Lockfile: 384 lines out, 1 in (package.json comma). 23 `node_modules/` entries left: the hover-card, its 15 `@radix-ui/*` dependencies and `@radix-ui/rect`, and 4 `@floating-ui/*` (via `react-popper`). Nothing added. `rm -rf node_modules && npm ci`: clean, 203 packages, no ERESOLVE or peer errors; `npm ls` has no missing/invalid/extraneous.

Gate: `normhash5` before vs after the change: IDENTICAL (390 files). HTML 52; entry marker in `build/assets/app-Cv4s0_Cm.js`.

Noted, not fixed (told not to): `@fortawesome` is mixed, `fontawesome-svg-core` and `free-brands-svg-icons` at ^7 but `free-solid-svg-icons` at ^6.

### F6 — Task 6: data fields

Key-path census of every `src/data/*.json` (nested paths included) against `src`, `scripts`, `public/unhurried-pro`, `index.html` and `vite.config.js`: dot, optional-chain, bracket, quoted and destructuring (with defaults) access. 7 key paths had no reader; `brandKit` and `comparisons` were false alarms (destructured with defaults in `CaseStudyPage.js`). The match is by key NAME, so a dead field sharing a common name (`title`, `slug`) would read as used; only zero-hit keys were judged.

| Removed (projects.json) | Count | Last consumer |
|---|---|---|
| `panelClass` | 13 | `CaseStudyTiles.js` (Task 1); already documented as read by nothing |
| `backLabel` (all "Back to Projects") | 13 | old ProjectPage back link, removed in `df57f04` |
| `productName` (all "Our Work") | 13 | ProjectPage CTA, removed in `2543898` |

Text edits only: 40 lines out, 1 in (Scout's `kicker` lost the comma its trailing `productName` needed). `posts.json` untouched: every key has a reader (contract kept). `shop.json` `_note` is a hand-written comment for editors, kept.

Gate: `normhash5` vs the HEAD build: every HTML (52) and every `static-loader-data` file IDENTICAL; one asset differs, `app.js`, which bundles `projects.json`. Against a control build of HEAD the size delta is 1,074 bytes, exactly the 39 removed `,"key":"value"` strings, and the two chunks are equal once those are stripped and minified identifiers normalised (esbuild re-mangles when string content shifts). Entry marker present.

### F7 — Task 7: docs

Docs and comments now describe the current code. No behaviour change.

CLAUDE.md:
- New rule at the top of "Review fixes → rules": normalised build gates, knip's blind spots, orphans one hop away.
- Marked "(Historical since 2026-10-06 …)": remainder-1 home grid; breakpoint decorations (dead `_projects-tiles.scss` path dropped); scroll-reveal rule (now points at `LandingPageProof.js`); "Adding a project" constraints (1) and (2) (`panelClass` sentence replaced; (2) now names the live `preview-600.webp` case).
- Rewritten in place: client-logo rule (no `-256`/`-512` to greyscale); `React.lazy` rule (slot now loads `DepthImage`); `once:true` rule ("the tile-reveal rule below"); data-driven tiles (`CaseStudyPage.js`, not `ProjectPage`); dep batch (React 19 + Vite 8 + R3F 9, no Drei); mobile-static note (tile particle/spotlight effects gone); route baseline 52.

`.audit/summary.md`: the 2026-09-09 "CaseStudyTiles stays for LandingPageProof" line annotated as wrong; a CLEANUP 2026-10-06 section appended. Other dated entries left as history.

Comments: `About.js` (moon → DepthImage, no drei/990KB claim), `CaseStudies.js` (false LandingPageProof claim), `LandingPageProof.js`, `CaseStudyPage.js` (rule name), `routes.js`, `DecorativeBoundary.js`, `journal.scss`, `scripts/cut-preview-thumbs.py`, `scripts/headless-probe.mjs`.

Remaining hits of `CaseStudyTiles|HoverPeek|useBento|_projects-tiles|_projects-bento|panelClass|backLabel|productName|mediapipe` (all intentional): `src/` and `scripts/` 0. CLAUDE.md 60 (new rule), 78, 101, 104, 127 (historical rules). `.audit/summary.md` 357, 828, 841–862, 1319, 1380, 1392, 1501, 1505, 1577, 1601, 1623, 1626, 1707 (dated entries) and the new cleanup section.

Gate: `npm run build` green; every `build/assets` file name identical to a HEAD build (comments are minifier-stripped); HTML 52; entry marker in `build/assets/app-B1E2DJeN.js` (new entry hash vs F5 comes from F6's `projects.json` edit, same as HEAD).

### F8 — Task 8: final verification

Clean run on HEAD `6cc63e4`: `rm -rf build node_modules && npm ci && npm run build`, green.

| Check | Result |
|---|---|
| HTML files (`find build -name '*.html'`) | 52, PASS |
| Entry marker | only in `build/assets/app-B1E2DJeN.js`, no lazy chunk, PASS |
| Em dash in build | 1 hit, `CaseStudyPage-*.js` (`clampAtWord`); baseline 1, same chunk, PASS |
| `SCS Display` in CSS | 1 file, `app-bQ3CgukU.css`, PASS |
| Hydration, 51 routes (all but 404), headless Chrome over CDP, 4 s per route: exceptions, `console.error`, log errors | 0 errors on all 51, one `h1` each, PASS. Checker proven on a page that throws. No baseline comparison needed. |
| Phone `scrollWidth` at 390 (`/`, `/about`, `/projects`, `/pricing`, `/blog`) | 390 each, PASS |

Routes were served with `npx serve` (clean URLs), not `vite preview`, which answers any path with the fallback shell.

Before / after (main `5bbe6ac` vs HEAD):

| Measure | Before | After | Delta |
|---|---|---|---|
| `src/**/*.js` files | 103 | 98 | −5 |
| `src/**/*.js` lines | 15,689 | 14,936 | −753 |
| SCSS files | 56 | 52 | −4 |
| `public/` tracked files | 270 | 244 | −26 |
| `public/` tracked bytes | 26,873,267 | 26,784,285 | −88,982 |
| `build/` files | 418 | 392 | −26 (the removed cover-tile siblings) |
| `build/` apparent size (`du -skA`) | 32,699 KB | 32,596 KB | −103 KB |
| dependencies + devDependencies | 17 + 2 | 16 + 2 | −1 |
| lockfile `packages` entries | 288 | 265 | −23 |

The baseline's "38M, 317 files" for `build/` is not reproduced by `find build -type f` on the baseline build (418 files); the table counts both sides the same way. `du -sh` reads 33M vs 37M only because the two trees sit on different volumes; apparent size is the fair figure.

Whole-branch review: removed imports (`ScrollTrigger` in `AboutHeading.js`, registered globally in `src/index.js`; `REVEAL_SAFETY_DELAY` in `AboutText.js`; `SupportArt`; default `React`) have no remaining uses. The 35 class names gone from compiled CSS have no class string, `classList` or selector in `src`, `public/unhurried-pro` or `index.html`. `panelClass`, `backLabel`, `productName`: no reader in `src`, `scripts`, `content`, `public`. The 26 deleted assets (all `-256`/`-512` cover-tile siblings) are named nowhere. No VPS specifics in added lines of `CLAUDE.md` or `.audit/`.

## REVIEW: owner decides

| # | Item | Why it looks dead | Why it might not be | Owner decision |
|---|------|-------------------|---------------------|----------------|
| 1 | `SOCIAL_URLS` export, `src/data/social.js` | 0 importers; `check-sameas.mjs` regex-parses the file instead | Documented as "exactly what sameAs must contain"; cheap to keep as the named contract | |
| 2 | `DUR_FAST`, `EASE_BRAND`, `src/animation/motionTokens.js` | 0 JS uses | Header says the file mirrors the SCSS token set (`--dur-fast`, `--ease-brand` are live in CSS); deleting breaks the mirror | |
| 3 | `sp-bg-pink`, `sp-s-pink`, `sp-s-terra` (`servicePoster.scss` palette `@each`) | no poster or end card uses these colour/role pairs | One loop emits every palette × role; trimming means special-casing the map, and a future poster may pick pink | |
| 4 | 68 `fa-*` utilities + `svg-inline--fa` (`@fortawesome/fontawesome-svg-core/styles.css`, imported in `src/index.js`) | almost none appear in src | Library stylesheet: `FontAwesomeIcon` adds `svg-inline--fa`/`fa-*` at runtime; trimming means `autoAddCss` off plus a hand-cut subset | |
| 5 | `public/ident/ident-1x1-poster.webp` (8 KB) | No code has ever named it (`git log -S` empty); `Hero.js` uses the 16x9 poster and swaps to 9x16 below 4/5 aspect | The 1x1 cut it belongs to is live (`<source media="(max-width: 768px)">`); phones between 4/5 and 768px show the 16x9 poster over a 1x1 video. It may be the missing poster rather than dead | |
| 6 | `public/brand/`: `switch-case-studio-star-mark.svg` (10 KB), `switch-case-studio-logo-square-lilac.png` (429 KB) | Nothing in src, content, scripts or build names either; the site uses the `.svg` wordmark (`artKit.js`) | Brand files exported on purpose (star mark from `SCSLogo.js` paths); public URLs may be handed to partners or press | |
| 7 | `public/social/search-console-portrait.jpg` (121 KB) | No reference in src, content or build | 4:5 promo image for the Search Console post; the other portraits are named by `content/` promo files and this one may be used by hand or in a scheduled post | |
| 8 | `public/unhurried-pro/img/`: `cart.avif`, `cart.webp`, `free.avif`, `icon-cart.svg`, `og.avif`, `og.webp` (6 files, 95 KB) | Neither Unhurried Pro page nor any data file names them (pages use `og.jpg`, the shop uses `free.webp`) | Product-page assets; a theme listing, readme or email may link them directly, and the cart section may be planned | |
| 9 | `@fortawesome/free-solid-svg-icons` ^6 next to `fontawesome-svg-core` / `free-brands-svg-icons` ^7 | Looks like a missed upgrade | All three are imported and the build is identical; upgrading changes icon data, so it is a version change outside this cleanup | |
| 10 | `tileVersion`, `src/data/projects.json` (13 projects) | No reader since the home tile grid (`CaseStudyTiles.js`, `HoverPeek.js`) went in Task 1 | Per-project short copy (a one-to-two-line tile excerpt), written by hand; a future index or card may want it | |
