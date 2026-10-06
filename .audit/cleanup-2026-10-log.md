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

## REVIEW: owner decides

| # | Item | Why it looks dead | Why it might not be | Owner decision |
|---|------|-------------------|---------------------|----------------|
| 1 | `SOCIAL_URLS` export, `src/data/social.js` | 0 importers; `check-sameas.mjs` regex-parses the file instead | Documented as "exactly what sameAs must contain"; cheap to keep as the named contract | |
| 2 | `DUR_FAST`, `EASE_BRAND`, `src/animation/motionTokens.js` | 0 JS uses | Header says the file mirrors the SCSS token set (`--dur-fast`, `--ease-brand` are live in CSS); deleting breaks the mirror | |
| 3 | `sp-bg-pink`, `sp-s-pink`, `sp-s-terra` (`servicePoster.scss` palette `@each`) | no poster or end card uses these colour/role pairs | One loop emits every palette × role; trimming means special-casing the map, and a future poster may pick pink | |
| 4 | 68 `fa-*` utilities + `svg-inline--fa` (`@fortawesome/fontawesome-svg-core/styles.css`, imported in `src/index.js`) | almost none appear in src | Library stylesheet: `FontAwesomeIcon` adds `svg-inline--fa`/`fa-*` at runtime; trimming means `autoAddCss` off plus a hand-cut subset | |
