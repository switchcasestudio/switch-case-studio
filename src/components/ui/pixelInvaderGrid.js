/* The 👾 as two 11×8 frames: the body holds still, the legs swap. Our own
   drawing: angled antennae, a solid two-row body, tentacle legs. */
export const FRAME_A = [
  '.X.......X.',
  '..X.....X..',
  '..XXXXXXX..',
  '.XX.XXX.XX.',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
  'X.X.X.X.X.X',
  '.X.......X.',
];

export const FRAME_B = [
  '.X.......X.',
  '..X.....X..',
  '..XXXXXXX..',
  '.XX.XXX.XX.',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
  '.X.X.X.X.X.',
  'X.........X',
];

// [x, y] of every filled cell, y down from the top.
export const cellsOf = (rows) =>
  rows.flatMap((row, y) => [...row].flatMap((c, x) => (c === 'X' ? [[x, y]] : [])));
