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

## REVIEW: owner decides

| # | Item | Why it looks dead | Why it might not be | Owner decision |
|---|------|-------------------|---------------------|----------------|
| 1 | `SOCIAL_URLS` export, `src/data/social.js` | 0 importers; `check-sameas.mjs` regex-parses the file instead | Documented as "exactly what sameAs must contain"; cheap to keep as the named contract | |
| 2 | `DUR_FAST`, `EASE_BRAND`, `src/animation/motionTokens.js` | 0 JS uses | Header says the file mirrors the SCSS token set (`--dur-fast`, `--ease-brand` are live in CSS); deleting breaks the mirror | |
