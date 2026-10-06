# Cleanup 2026-10: findings log

Plan: `.audit/cleanup-2026-10-plan.md`. Method: `.audit/cleanup-protocol.md` (2026-06). Branch `chore/cleanup-2026-10`, worktree `../scs-cleanup`.

## Baseline (main @ 5bbe6ac, 2026-10-06)

- 52 HTML files (51 + the 2026-10-06 scheduled post)
- entry marker `__SCS_LANDING_PATHNAME__` in `build/assets/app-CAKgkGpB.js`
- `build/` 38M, 317 files; `public/` 26M, 270 files; `src/**/*.js` 103 files, 15,689 lines; 56 SCSS files
- Gate: builds are NOT byte-reproducible as emitted. vite-react-ssg writes a per-build random id into loader-data filenames and every HTML, and the loader-data manifest's key order varies per build (parallel render). The gate blanks the id and sorts the manifest keys before hashing; with that, two builds of unchanged source compare IDENTICAL (verified).

## Findings

(one entry per phase: what was removed, the evidence, the gate result, the commit)

## REVIEW: owner decides

| # | Item | Why it looks dead | Why it might not be | Owner decision |
|---|------|-------------------|---------------------|----------------|
