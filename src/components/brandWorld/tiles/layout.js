/* Collage layout (2026-10-22). Each tile's SSR start is `sx/sy` (% of the
   stage, peeking in from an edge so the headline reads), width in vw, `z`
   stacks. Where it goes, how fast and when is decided per tile by the
   seeded random in useCollageScroll (owner: every item its own pace and
   distance, and it leaves the way it came). Kinds: `art` (an SVG from
   tiles/concepts, live when tiles/live has a create), `video`, `pixel`,
   `shot` (a real client site in browser chrome), `poster` (the live
   service poster). Duplicates were cut on
   the owner's review: one appearance per concept piece here. */
export const SCROLL_LENGTH = 240; // % of viewport height the stage pins for

export const TILES = [
  { id: 'hatch-mark', art: 'HatchMark', ratio: '1', w: 16, sx: -8, sy: 6, z: 5 },
  { id: 'hatch-word', art: 'HatchWord', ratio: '2/1', w: 32, sx: 70, sy: -16, z: 6 },
  { id: 'lowtide-mark', art: 'LowtideMark', ratio: '1', w: 14, sx: 92, sy: 8, z: 7 },
  { id: 'meridian-mark', art: 'MeridianMark', ratio: '1', w: 15, sx: 86, sy: 78, z: 8 },
  { id: 'meridian-type', art: 'MeridianType', ratio: '3/2', w: 34, sx: 30, sy: 96, z: 3 },
  { id: 'fieldnote-card', art: 'FieldnoteCard', ratio: '7/4', w: 26, sx: 44, sy: -24, z: 9 },
  { id: 'fieldnote-sticker', art: 'FieldnoteSticker', ratio: '9/16', w: 9, sx: 97, sy: 36, z: 10 },
  { id: 'hum-glyph', art: 'HumGlyph', ratio: '1', w: 24, sx: 60, sy: 100, z: 2 },
  { id: 'studio-note', art: 'StudioNote', ratio: '4/3', w: 22, sx: 0, sy: 100, z: 5 },
  { id: 'seal', art: 'SealStar', ratio: '1', w: 12, sx: 78, sy: -2, z: 14 },
  { id: 'scs-logo', art: 'ScsLogo', ratio: '4/3', w: 18, sx: -12, sy: 42, z: 11 },
  { id: 'register', kind: 'poster', slug: 'graphic-design-brand-identity', ratio: '1', w: 19, sx: 100, sy: -6, z: 12 },
  { id: 'shot-sha', kind: 'shot', src: '/projects/sha-design-studio/preview-600.webp', label: 'Sha Design Studio, a site by the studio', caption: 'shadesignstudio.com', ratio: '8/5', w: 22, sx: -14, sy: 18, z: 4 },
  { id: 'shot-prodani', kind: 'shot', src: '/projects/prodani/preview-600.webp', label: 'Prodani, a site by the studio', caption: 'prodani.com', ratio: '8/5', w: 22, sx: 104, sy: 30, z: 4 },
  { id: 'ident-video', kind: 'video', src: '/ident/ident-1x1.mp4', poster: '/ident/ident-1x1-poster.webp', label: 'Switch Case Studio ident', ratio: '1', w: 14, sx: 22, sy: -22, z: 13 },
  { id: 'lowtide-video', kind: 'video', src: '/brand-world/lowtide-sticker.mp4', poster: '/brand-world/lowtide-sticker.jpg', label: 'Lowtide, the sun over the tide', ratio: '9/16', w: 10, sx: -8, sy: 78, z: 13 },
  { id: 'hatch-video', kind: 'video', scrub: true, src: '/brand-world/hatch-scrub.mp4', poster: '/brand-world/hatch-loop.jpg', label: 'Hatch mark, drawn by the scroll', ratio: '16/9', w: 26, sx: 102, sy: 58, z: 12 },
  { id: 'pixel', kind: 'pixel', ratio: '1', w: 13, sx: 40, sy: 104, z: 14 },
];
