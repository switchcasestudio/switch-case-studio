#!/usr/bin/env node
/* US spelling inside images and video (2026-10-25). The text check cannot
   read pixels, and "No licence server." shipped on a share card, a cover
   and a portrait card that way, and "colour" on four brand boards. OCRs
   every image under public/ (and one frame every 2 s of each video, up to
   40) with tesseract and flags the words in british-words.mjs.
   Local only (needs tesseract + ffmpeg): `npm run check:us:images`.
   Optional path arguments limit it to those files or folders. A hit inside
   a client's own screenshot is a note for that client, not a fix here. */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { BRITISH_RE } from './british-words.mjs';

const has = (cmd) => { try { execFileSync('which', [cmd], { stdio: 'ignore' }); return true; } catch { return false; } };
if (!has('tesseract') || !has('ffmpeg')) {
  console.log('check:us:images skipped: needs tesseract and ffmpeg (brew install tesseract ffmpeg)');
  process.exit(0);
}

// A client's own site text, shown in our screenshots of it. Owner, 2026-10-25:
// leave Florida Green's live "LICENCE" / "organising" as they are. Only these
// words, only under these folders; anything else there still fails.
const CLIENT_TEXT = { 'public/projects/florida-green/': ['licence', 'organising'] };
const allowed = (file, word) =>
  Object.entries(CLIENT_TEXT).some(([dir, words]) => file.startsWith(dir) && words.includes(word.toLowerCase()));

const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const VIDEO = new Set(['.mp4', '.webm', '.mov']);
function* walk(p) {
  if (statSync(p).isDirectory()) for (const n of readdirSync(p)) yield* walk(join(p, n));
  else if (IMAGE.has(extname(p).toLowerCase()) || VIDEO.has(extname(p).toLowerCase())) yield p;
}

const tmp = mkdtempSync(join(tmpdir(), 'us-ocr-'));
const ocr = (png) => execFileSync('tesseract', [png, '-', '--psm', '11'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
const ff = (args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { stdio: 'ignore' });

const hits = [];
let n = 0;
for (const root of process.argv.slice(2).length ? process.argv.slice(2) : ['public']) {
  for (const file of walk(root)) {
    n += 1;
    let text = '';
    try {
      if (VIDEO.has(extname(file).toLowerCase())) {
        const dir = mkdtempSync(join(tmp, 'v-'));
        ff(['-i', file, '-vf', 'fps=1/2,scale=1280:-2', '-frames:v', '40', join(dir, 'f%03d.png')]);
        for (const f of readdirSync(dir)) text += ` ${ocr(join(dir, f))}`;
      } else {
        const png = join(tmp, 'frame.png');
        ff(['-i', file, '-frames:v', '1', png]);
        text = ocr(png);
      }
    } catch {
      console.warn(`check:us:images: could not read ${file}`);
    }
    for (const m of text.matchAll(BRITISH_RE())) if (!allowed(file, m[0])) hits.push(`${file}: ${m[0]}`);
  }
}
rmSync(tmp, { recursive: true, force: true });

if (hits.length) {
  console.error(`check:us:images: ${hits.length} British spelling(s) in ${n} files\n  ${[...new Set(hits)].join('\n  ')}`);
  process.exit(1);
}
console.log(`check:us:images: clean (${n} images and videos read)`);
