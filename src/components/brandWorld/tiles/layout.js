/* Collage layout (2026-10-22). Positions are % of the stage (100vw × 100svh),
   width in vw. `sx/sy` is the SSR start (peeking in from the edges, the
   headline readable); `ex/ey` is where the scroll takes it. `at` and `dur`
   are timeline seconds on a 1-second scrubbed timeline: `at` is the
   reference's delay_px, `dur` its speed (short = fast). `z` stacks; the live
   poster sits on top. Read with the reference's numbers in mind: tiles
   travel 40–70% of the stage, diagonally, in both directions. */
export const SCROLL_LENGTH = 220; // % of viewport height the stage pins for

export const TILES = [
  { id: 'hatch-mark', art: 'HatchMark', ratio: '1', w: 15, sx: -5, sy: 4, ex: 20, ey: 16, z: 5, at: 0, dur: 0.8 },
  { id: 'hatch-word', art: 'HatchWord', ratio: '2/1', w: 30, sx: 72, sy: -16, ex: 36, ey: 24, z: 6, at: 0.05, dur: 0.75 },
  { id: 'lowtide-mark', art: 'LowtideMark', ratio: '1', w: 13, sx: 90, sy: 10, ex: 60, ey: 58, z: 7, at: 0.1, dur: 0.7 },
  { id: 'lowtide-colour', art: 'LowtideColour', ratio: '4/3', w: 22, sx: -12, sy: 62, ex: 28, ey: 50, z: 4, at: 0, dur: 0.9 },
  { id: 'meridian-mark', art: 'MeridianMark', ratio: '1', w: 14, sx: 84, sy: 76, ex: 54, ey: 4, z: 8, at: 0.15, dur: 0.6, r0: 6, r1: -4 },
  { id: 'meridian-type', art: 'MeridianType', ratio: '3/2', w: 32, sx: 34, sy: 94, ex: 6, ey: 58, z: 3, at: 0.05, dur: 0.85 },
  { id: 'fieldnote-card', art: 'FieldnoteCard', ratio: '7/4', w: 22, sx: 46, sy: -22, ex: 74, ey: 42, z: 9, at: 0.2, dur: 0.7, r0: -3, r1: 2 },
  { id: 'fieldnote-sticker', art: 'FieldnoteSticker', ratio: '9/16', w: 8, sx: 96, sy: 38, ex: 84, ey: 72, z: 10, at: 0.3, dur: 0.6 },
  { id: 'hum-mark', art: 'HumMark', ratio: '1', w: 13, sx: -9, sy: 32, ex: 42, ey: 72, z: 6, at: 0.1, dur: 0.8 },
  { id: 'hum-glyph', art: 'HumGlyph', ratio: '1', w: 24, sx: 62, sy: 98, ex: 66, ey: 6, z: 2, at: 0, dur: 1 },
  { id: 'studio-note', art: 'StudioNote', ratio: '4/3', w: 22, sx: 2, sy: 98, ex: 12, ey: 10, z: 5, at: 0.15, dur: 0.8 },
  { id: 'badge', art: 'Badge', ratio: '1', w: 8, sx: 78, sy: 2, ex: 10, ey: 80, z: 12, at: 0.25, dur: 0.75, r0: 0, r1: 180 },
  { id: 'register', art: 'Register', ratio: '1', w: 17, sx: 98, sy: -8, ex: 30, ey: 66, z: 11, at: 0.1, dur: 0.85 },
];
