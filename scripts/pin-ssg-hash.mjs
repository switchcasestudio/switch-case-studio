#!/usr/bin/env node
/**
 * Pin vite-react-ssg's per-build hash to the word "latest" (postbuild).
 *
 * vite-react-ssg 0.9 names its loader-data files with a Math.random() hash
 * per build and bakes that hash into every page's HTML
 * (`window.__VITE_REACT_SSG_HASH__`). Its injected client loader fetches
 * `/static-loader-data-manifest-<hash>.json` on the first in-app navigation.
 * After ANY deploy, a tab opened before it asks for the old manifest, Netlify
 * answers with the HTML 404 page, and `.json()` throws
 * `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
 * (seen live on /services, 2026-10-23). The site deploys daily (scheduler),
 * so every open tab broke every day.
 *
 * Renaming the files and the inline hash to a constant makes every build
 * answer every tab: the old tab fetches the current manifest, which lists
 * files that exist. The data is `{"0":null}` per page (no route declares a
 * loader), so the content of the manifest never matters, only its presence.
 *
 * Usage: node scripts/pin-ssg-hash.mjs [build]
 */
import { readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PIN = 'latest';
const out = process.argv[2] || 'build';

const manifests = readdirSync(out).filter((f) => /^static-loader-data-manifest-[a-z0-9]+\.json$/.test(f));
const manifestName = manifests.find((f) => f !== `static-loader-data-manifest-${PIN}.json`);
if (!manifestName) {
  if (manifests.length) {
    console.log('pin-ssg-hash: already pinned');
    process.exit(0);
  }
  console.error(`pin-ssg-hash: no static-loader-data-manifest-*.json in ${out}/`);
  process.exit(1);
}
const hash = manifestName.slice('static-loader-data-manifest-'.length, -'.json'.length);

const walk = (dir, acc = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};

const files = walk(out);
let renamed = 0;
let rewritten = 0;
const suffix = `.${hash}.json`;

for (const p of files) {
  if (p.includes(`${out}/static-loader-data/`) && p.endsWith(suffix)) {
    renameSync(p, p.slice(0, -suffix.length) + `.${PIN}.json`);
    renamed++;
  } else if (p.endsWith('.html')) {
    const html = readFileSync(p, 'utf8');
    const next = html.replaceAll(`__VITE_REACT_SSG_HASH__ = '${hash}'`, `__VITE_REACT_SSG_HASH__ = '${PIN}'`);
    if (next !== html) {
      writeFileSync(p, next);
      rewritten++;
    }
  }
}

const manifestPath = join(out, manifestName);
const manifest = readFileSync(manifestPath, 'utf8').replaceAll(suffix, `.${PIN}.json`);
writeFileSync(join(out, `static-loader-data-manifest-${PIN}.json`), manifest);
unlinkSync(manifestPath);

const leftovers = walk(out).filter((p) => !p.startsWith(`${out}/assets/`) && readFileSync(p).includes(hash));
if (leftovers.length) {
  console.error(`pin-ssg-hash: hash ${hash} still present in:\n  ${leftovers.join('\n  ')}`);
  process.exit(1);
}
console.log(`pin-ssg-hash: ${hash} → ${PIN} (${renamed} data files, ${rewritten} pages)`);
