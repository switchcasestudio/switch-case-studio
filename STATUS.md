# STATUS — Switch Case Studio site (switchcasestudio.com, repo switchcasestudio/switch-case-studio, PUBLIC)

updated 2026-10-30 (Unhurried follow-through) · facts as recorded in `.audit/summary.md` entries, not re-verified against production · Read this first; then `CLAUDE.md` (working rules), `.audit/rules.md`, `.audit/open-tickets.md`.
Sources: [S date] = `.audit/summary.md` entry (dated `###` entries, newest at the bottom; older sections in `.audit/history/summary-2026-05-to-2026-10-09.md`); [git] = repo checked 2026-10-27; (unverified) = no later entry confirms it.

## Current state
- 2026-10-30: Unhurried is on WordPress.org since 10-09 (50+ installs); Shop, Pro pages, kit and theme README point there, the directory post is scheduled for 10-31, the Pro pages carry the visit beacon. Local `main` is 2 commits ahead of `origin/main` (`fcfdc8b`), NOT pushed [git]. Pro has zero sales [S 2026-10-30].
- `main` = `da3c879` "Log the hero variety as live" (2026-10-27) = `origin/main`; working tree clean except one untracked file [git]. A git worktree `../scs-seo-titles` on branch `seo/titles-ctr` (`a4a0ae4`) is in active use by another session on 2026-10-27; its STATUS/summary copies are the branch's own [git].
- The four service "worlds" are rebuilt as teaching pages with no invented clients: Brand (2026-10-22/25), Web Development & Mobile Apps (2026-10-26/27, `7b18fd7`), AI & Automation (2026-10-27, `f40b042`), SEO & AI Search (2026-10-27, `aaa9b90`); then three distinct hero compositions with thinner strokes (`f1c7222`, live). Production build 64 pages; standing checks and US-English sweep clean [S 2026-10-25…27].
- Heroes fit one screen under iPhone Safari's glass bar via `--bar-tail` (`342b38f`, live) [S 2026-10-27]. iPhone passes 3–4 done in the iOS 27 Simulator, defects 1–8 fixed (`06c5ac9`) [S 2026-10-26].
- SEO audit (2026-10-09, lab-only, health ~66/100): fixes 1–14 shipped on 2026-10-09 [S "SEO AUDIT FIXES …" sections, archived]. Apogee Watcher link swap live both ways (2026-10-24/25) [S 2026-10-25 note].
- Journal: covers required (2026-10-25); scheduler pushes posts to main at 14:00 UTC — fetch/rebase before touching `posts.json` [S 2026-10-09 handoff; 2026-10-25].

## Next actions (ours)
0. Owner: push `main`; tell Beau the held packet injects after the 10-31 post is live [S 2026-10-30].
1. Phone passes on real/simulated iPhone for the lesson controls: Web drag + tap; AI range + text; SEO map slider + text fields [S 2026-10-26/27, 10-27 ×2] (open).
2. Owner review of the SEO world and of the home + Web heroes on the iPhone [S 2026-10-27].
3. Whether the Brand world hero also fits one screen on phones after the 2026-10-27 hero pass (the pass verified Web/AI/SEO at 11 sizes; Brand "stays as it is") — check, (unverified).
4. Keep `.audit/open-tickets.md` current (last reviewed 2026-09-25; 12 ticket headings incl. DEP-1 accepted risk, SEC-1 leaked host path in pushed history, ZAHAV-1/2, LINK-1).

## Blocked / waiting / owner decisions (from the 2026-10-09 handoff; no later entry resolves them — unverified)
- Bluesky `switchcasestudio.bsky.social` ("Phoenix based", created 2026-07-14): ours or not? If ours, fix bio to Portland and add to `sameAs`.
- Name collision with `switchcasestudios.com`: Clutch/Crunchbase/Wikidata profiles + a one-line definition on home/About would separate the entities.
- Portland local page: only if local clients are wanted.
- Beau's post pipeline must emit inline links `[label](url)`; `add-post.mjs` rejects bad URLs.
- ClientStrip option A (real client logos) was waiting on assets (STATUS 2026-07-05); real logos went live 2026-09-03 [S archived] — treat as closed.

## Constraints (do not revert; details in CLAUDE.md and `.audit/rules.md`)
- NEVER push without explicit owner instruction; the owner's "log commit push to main" is the authorization pattern [S passim].
- Repo is PUBLIC: no client-confidential data, host paths or private notes in tracked files (SEC-1; the 2026-08-04 confidentiality sweep). `switch-case-studio-action-plan.md` (private, git-ignored, Aug 2026, 34 unchecked boxes) stays untracked.
- Teaching pages: no made-up clients, no em dashes on rendered surfaces, US spelling only, titles ≤60 / descriptions ≤160 chars, phones read at 16px and tap at 44px (`.audit/rules.md`).
- Tokens from `_variables.scss` only; single transform owner per property; `useReducedMotion` on new motion; ScrollTrigger cleanup on unmount; protect proof density and the LCP/CLS budget; text never sits where a drawing can run under it.
- Every fix from a review goes back into `CLAUDE.md`/`.audit/rules.md` (Rule 5). Log entries go at the bottom of `.audit/summary.md`; user-facing changes into `CHANGELOG.md` (newest first).
- Dependabot PR #11 broke production once (2026-08-14): upgrade in batches with a build + route-count check.

## Where history lives
- `.audit/summary.md`: dated entries since the 2026-10-09 SEO handoff (bottom = newest); `.audit/history/summary-2026-05-to-2026-10-09.md`: everything earlier, oldest first, with a heading index at the top of the live file.
- `CHANGELOG.md`: user-facing changes, newest first (last entry 2026-09-26). `.audit/cleanup-2026-10-{plan,log}.md`: the Oct 2026 legacy cleanup. `.audit/legacy-cleanup.md`, `ssg-recon.md`, `js-critical-path-recon.md`, `mobile-design-audit.md`: audits. `.audit/sha-metrics-*.json`: measurements.
- Case-study source data for other projects: see each project's own repo; this site only publishes the measured results.
