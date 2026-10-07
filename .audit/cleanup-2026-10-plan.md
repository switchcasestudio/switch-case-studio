# Codebase Cleanup 2026-10 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove everything September's redesigns left behind (dead JS, SCSS files, selectors, assets, deps, data fields, doc references) with proof that each removal is dead and that the site did not change.

**Architecture:** Same method as the 2026-06 cleanup (`.audit/cleanup-protocol.md`): evidence before deletion, one phase per commit, each phase verified against a baseline build of `main`. Discovery uses `npx knip` (not installed) plus small throwaway scripts in the scratchpad. Anything uncertain goes into a REVIEW table for the owner; only provably dead items are removed.

**Tech Stack:** Vite 7 + vite-react-ssg 0.9.0, React 18, SCSS (`@import`-era, no `additionalData`), Netlify. Output dir is `build/`, not `dist/`. JSX lives in `.js` files.

**Precedes:** the React 19 / Vite 8 / R3F 9 upgrade (separate session, separate branch).

---

## Ground rules (read before any task)

1. **Work in a worktree.** `main` gets a daily push from `scs-scheduler` (14:00 UTC). Never work in the main folder.
2. **Never `git push`.** Commit, stop, report. The owner triggers pushes.
3. **Uncertain = REVIEW, not delete.** Planned-but-unplaced content (covers, stickers, ident cuts, `public/unhurried-pro/`) is the typical case.
4. **Known false positives, keep unless proven otherwise:**
   - `-256.webp` / `-512.webp` siblings (built by `.replace()` in `CaseStudyTiles.js`, `ClientStrip.js`)
   - `preview-600.webp` siblings (built by string replace on `preview.webp`)
   - `Inter-*.woff2` (Sass `#{$w}` interpolation)
   - `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, favicon set + `site.webmanifest`, `_redirects`/`_headers` if present
   - `public/unhurried-pro/` static pages (counted routes)
   - anything referenced from `src/data/*.json`, `content/scheduled/*.json`, `index.html`, `netlify.toml`, `scripts/*`
   - library-injected or JS-constructed class names (template literals, `classList.add`, `is-${x}`, `--${variant}`)
5. **A green build proves nothing about removals.** Every phase passes its own "nothing changed" gate below.
6. **Comments that look like leftovers get read before deletion** (`__SCS_LANDING_PATHNAME__` is load-bearing).
7. **Public repo:** nothing about the VPS in commits, this file, or the protocol.

## File map

- Create: `.audit/cleanup-2026-10-log.md`: findings log + REVIEW table (the owner's decision surface)
- Scratchpad (not committed): `baseline/` (main's build), `scripts/` (discovery scripts below)
- Modify/delete: determined by findings; every deletion is listed in the log with its evidence
- Modify: `CLAUDE.md` (stale Moon/`MoonSlot`/`WelcomeTyped` references, new lessons), `package.json` (postinstall, unused deps), `src/data/projects.json` (dead fields, edited as TEXT, never `json.dump`)

`$S` below = the session scratchpad directory. `$W` = the worktree path.

---

### Task 0: Worktree + baseline

**Files:** Create `.audit/cleanup-2026-10-log.md`

- [ ] **Step 1: Sync main and check covers (standing blog rule)**

```bash
cd ~/Desktop/switch-case-studio && git fetch && git status -sb
git log HEAD..origin/main --oneline   # must be empty; if not: git pull --rebase
node -e 'for (const p of require("./src/data/posts.json")) if (!p.coverImage) console.log(p.slug)'   # must print nothing
```

- [ ] **Step 2: Create the worktree** (use the `using-git-worktrees` skill)

```bash
git worktree add ../scs-cleanup -b chore/cleanup-2026-10
cd ../scs-cleanup && npm ci
```

- [ ] **Step 3: Baseline build of untouched main, saved outside the tree**

```bash
npm run build
rm -rf $S/baseline && cp -R build $S/baseline
find build -name '*.html' | wc -l                       # expect 51
grep -l '__SCS_LANDING_PATHNAME__' build/assets/app-*.js  # must match
(cd build && find . -type f -exec shasum {} + | sort -k2) > $S/baseline.sha
```

- [ ] **Step 4: Write the "compare to baseline" helper** (`$S/scripts/diffbuild.sh`)

```bash
#!/bin/zsh
# usage: diffbuild.sh  -> lists files added/removed/changed vs baseline
cd "$W" && (cd build && find . -type f -exec shasum {} + | sort -k2) > $S/now.sha
diff <(awk '{print $2, $1}' $S/baseline.sha) <(awk '{print $2, $1}' $S/now.sha)
echo "html: $(find build -name '*.html' | wc -l)"
grep -l '__SCS_LANDING_PATHNAME__' build/assets/app-*.js || echo "ENTRY MARKER MISSING"
```

- [ ] **Step 5: Start the log** with the baseline numbers (HTML count, CSS/JS file list, public/ size 26M, 273 files) and the REVIEW table header:

```markdown
| # | Item | Why it looks dead | Why it might not be | Owner decision |
```

- [ ] **Step 6: Commit** `chore(cleanup): start 2026-10 cleanup log`

---

### Task 1: Dead JS files and exports

- [ ] **Step 1: Run knip (no install)**

```bash
npx --yes knip --no-config-hints --reporter json > $S/knip.json 2>/dev/null || true
npx --yes knip --include files,exports,dependencies,unlisted
```

knip auto-detects Vite; if it misses entries, pass a throwaway config in the scratchpad (not committed):

```json
{ "entry": ["src/index.js", "src/routes.js", "scripts/*.{mjs,js}"], "project": ["src/**/*.js"] }
```
`npx knip --config $S/knip.json`

- [ ] **Step 2: Cross-check with an independent import graph** (knip has false negatives on JSX-in-.js). `$S/scripts/reach.mjs`: BFS from `src/index.js` + `src/routes.js` over `import`/`import()`/`lazy(() => import())` specifiers, resolving `.js`, `/index.js`; print unreachable `src/**/*.js`.

- [ ] **Step 3: Suspects from known history, check each by grep**: `WelcomeTyped`, `CursorWave`, `Moon`, `GradientText`, `TextPressure`, `StaggeredMenu` consumers, `motionVariants`, any `*Old*`/`*Legacy*`/`*v1*` file.

```bash
for n in WelcomeTyped CursorWave Moon GradientText motionVariants; do echo "$n: $(grep -rlw "$n" src | wc -l)"; done
```

- [ ] **Step 4: Reachable-but-unrendered check** for every component knip reports as an unused export: is it rendered (`<Name`) or called anywhere? Imported-only = dead symbol.
- [ ] **Step 5: Delete only files both tools agree are unreachable.** Disagreements → REVIEW.
- [ ] **Step 6: Gate:** `npm run build` → `diffbuild.sh`. Expected: HTML count 51, entry marker present, HTML files identical (hashes of JS chunks may change only if a deleted file was in a chunk; a file that was unreachable cannot change output, so ANY diff = stop and investigate).
- [ ] **Step 7: Log + commit** `chore(cleanup): remove unreachable JS (N files)`

---

### Task 2: Dead SCSS files

- [ ] **Step 1: List SCSS files nobody imports.** `$S/scripts/scss-orphans.mjs`: collect every `import '…scss'` in `src/**/*.js` and every `@import`/`@use`/`@forward` in `src/**/*.scss` (resolve partials `_name.scss`, extensionless); print `.scss` files not in the set.
- [ ] **Step 2:** also flag SCSS whose only importer was deleted in Task 1 (rerun after Task 1).
- [ ] **Step 3: Delete orphans.**
- [ ] **Step 4: Gate:** build → `diffbuild.sh` must show **zero** changed files (unimported SCSS emits no CSS).
- [ ] **Step 5: Log + commit** `chore(cleanup): remove orphan SCSS (N files)`

---

### Task 3: Dead selectors inside live SCSS

- [ ] **Step 1: Extract class names from the COMPILED css** (nesting resolved):

```bash
cat build/assets/*.css | grep -oE '\.[a-zA-Z_-][a-zA-Z0-9_-]*' | sort -u | sed 's/^\.//' > $S/classes.txt
```

- [ ] **Step 2: String-check each against src + data + index.html:**

```bash
while read c; do grep -rqF -- "$c" src index.html public/unhurried-pro || echo "$c"; done < $S/classes.txt > $S/class-suspects.txt
```

- [ ] **Step 3: Manual review of suspects** for dynamic construction: grep the prefix (`pg-group__`, `is-`, `has-`, `--`), template literals, GSAP/library classes (`pin-spacer`, `typed-cursor`), `:root`/state classes toggled on `document.documentElement`. Only BEM blocks whose block name appears nowhere in src are "certain". The rest → REVIEW.
- [ ] **Step 4: Remove certain-dead rule blocks** from source SCSS (whole blocks; don't leave empty parents).
- [ ] **Step 5: Gate:** build; compare class sets: `comm -13 new old` = exactly the removed names, `comm -23 new old` = empty. Screenshot `/`, `/about`, `/pricing`, `/projects`, `/blog` at 1440 and `--phone` via `node scripts/headless-probe.mjs <url> 'document.title' --shot` and compare with baseline shots taken from `$S/baseline` served by `npx serve`.
- [ ] **Step 6: Log + commit** `chore(cleanup): remove dead selectors in live SCSS`

---

### Task 4: Unused assets (`public/`, `src/assets/`)

- [ ] **Step 1: Inventory** every file under `public/` and `src/assets/` (path relative to its root, e.g. `/images/journal/x.jpg`).
- [ ] **Step 2: Reference corpus** = `src/**`, `index.html`, `src/data/*.json`, `content/**`, `scripts/**`, `netlify.toml`, `public/**/*.{html,css,webmanifest,xml,txt}`, plus the BUILT `build/**/*.{html,js,css}`.
- [ ] **Step 3: Match** by full path, then by basename, then by basename-minus-suffix (`-256`, `-512`, `-600`, `.webp`→`.jpg` variants). `$S/scripts/assets.mjs` prints three lists: REFERENCED, DERIVED (sibling of a referenced file per rule 4), UNREFERENCED, each with size.
- [ ] **Step 4: Classify UNREFERENCED** into certain (old hero video cuts, ident files no `<source>` names, retired service art, `-v1` fonts replaced by `-v2`) vs REVIEW (stickers, polaroids, covers, anything in `public/brand/`, `public/social/`). Record sizes; target is the 26M.
- [ ] **Step 5: Delete certain items.** Use `git rm` so they stay recoverable.
- [ ] **Step 6: Gate:** build → `diffbuild.sh`: only the deleted public files disappear from `build/`; no other diff. `grep -rF '<basename>' build/` for every deleted file returns nothing. 51 HTML.
- [ ] **Step 7: Log + commit** `chore(cleanup): remove unreferenced assets (N files, X MB)`

---

### Task 5: Dependencies + package.json

- [ ] **Step 1:** knip's `dependencies` / `unlisted` output from Task 1, re-run after deletions.
- [ ] **Step 2: Known item:** the `postinstall` hook patches `@mediapipe/tasks-vision`, which is not in the lockfile (`npm ls` empty, no src reference). Remove the hook.
- [ ] **Step 3: Per-dep import check** for anything knip flags, plus `react-router-hash-link` (1 importer: still needed?), `@fortawesome/free-solid-svg-icons` (v6 next to v7 svg-core: version mismatch to flag, not fix here), `prop-types` (1 importer), `@radix-ui/react-hover-card`, `@emailjs/browser`.
- [ ] **Step 4:** `npm uninstall <dead>` (bare, never `--only=prod`). Judge `package-lock.json` by composition.
- [ ] **Step 5: Gate:** `rm -rf node_modules && npm ci && npm run build` → `diffbuild.sh` identical for removed-unused deps.
- [ ] **Step 6: Log + commit** `chore(cleanup): drop unused deps and dead postinstall`

---

### Task 6: Unused data fields

- [ ] **Step 1: List every key** used across objects in `projects.json`, `services.json`, `pricingData.json`, `testimonials.json`, `posts.json`.
- [ ] **Step 2: Grep each key** in `src/**/*.js` and `scripts/**` (as `.key`, `["key"]`, `{ key` destructuring). Known dead: `panelClass`.
- [ ] **Step 3:** remove dead keys as TEXT edits (hand-formatted JSON, no Prettier). `git diff --numstat` per file: tens of lines, not hundreds.
- [ ] **Step 4: Gate:** build → every HTML identical; `node scripts/add-post.mjs` still validates a sample post if `posts.json` keys changed (it shouldn't: the blog contract is fixed).
- [ ] **Step 5: Log + commit** `chore(cleanup): drop unread data fields`

---

### Task 7: Stale docs and comments

- [ ] **Step 1:** grep CLAUDE.md, `.audit/summary.md`, and src comments for names deleted in Tasks 1–6 and known-gone features: `Moon`, `MoonSlot` (rename to `DepthImage` slot where still live), `WelcomeTyped`, `CursorWave`, `typed.js`, `R3F 9 … Drei 10` (Drei is not a dependency).
- [ ] **Step 2:** fix each reference to describe current code; don't delete historical rules, mark them "(historical since …)" like existing entries.
- [ ] **Step 3:** grep own additions for VPS specifics before commit: `git diff main -- CLAUDE.md .audit/ | grep '^+'`.
- [ ] **Step 4: Commit** `docs: update CLAUDE.md for cleanup 2026-10`

---

### Task 8: Final verification + handoff

- [ ] **Step 1:** clean build; 51 HTML; entry marker; `grep -o '—' build/**/*.html build/assets/*` returns only the `clampAtWord` hit; `grep -c "SCS Display" build/assets/*.css` hits only the app bundle.
- [ ] **Step 2:** `npx vite preview` → every route in a real browser, console clean (no hydration errors #418/#425/#422). Phone check at 390 with `scripts/headless-probe.mjs --phone`, `documentElement.scrollWidth === 390`.
- [ ] **Step 3:** before/after table in the log: files, LOC, SCSS count, `public/` MB, `build/` MB, deps.
- [ ] **Step 4:** generalizable lessons → CLAUDE.md "Review fixes → rules"; re-baseline route count line if it changed (it should not).
- [ ] **Step 5:** `code-review` skill on `main..chore/cleanup-2026-10`.
- [ ] **Step 6:** hand the REVIEW table to the owner. Stop. No push, no merge until the owner says so (`finishing-a-development-branch`).

---

## Self-review notes

- Covers: stale files (T1), unused assets (T4), dead SCSS files (T2) + selectors (T3), removable components (T1 step 4), deps (T5), data (T6), docs (T7).
- Every deletion phase has a build-diff gate; asset and selector phases add reference/class-set proof.
- Out of scope: the React 19 / Vite 8 upgrade, the Font Awesome v6/v7 mismatch fix, DEP-1 (react-router).
