/* The AI world's collage layout (2026-10-22). Same contract as the brand
   world's (brandWorld/tiles/layout.js): `sx/sy` is the SSR start in % of
   the stage, `w` in vw, `z` stacks; where a tile goes, how fast and when is
   the seeded random in worlds/useCollageScroll. `plain` tiles are free
   shapes with no plate (the reference's letter, pill, circle and arrows
   sit straight on the field); the rest are outlined boxes. */
export const SCROLL_LENGTH = 240;

export const TILES = [
  { id: 'agent-a', art: 'AgentA', ratio: '1', w: 17, sx: -8, sy: 6, z: 5, plain: true },
  { id: 'queue', art: 'QueueBox', ratio: '2/1', w: 32, sx: 70, sy: -16, z: 6, plain: true },
  { id: 'run', art: 'RunPill', ratio: '5/2', w: 19, sx: 92, sy: 8, z: 7, plain: true },
  { id: 'no', art: 'NoCircle', ratio: '1', w: 13, sx: 86, sy: 78, z: 8, plain: true },
  { id: 'arrow', art: 'LongArrow', ratio: '3/1', w: 30, sx: 30, sy: 96, z: 3, plain: true },
  { id: 'graph', art: 'NodeGraph', ratio: '3/2', w: 26, sx: 44, sy: -24, z: 9 },
  { id: 'trigger', art: 'Trigger', ratio: '1', w: 9, sx: 97, sy: 36, z: 10, plain: true },
  { id: 'clock', art: 'Clock', ratio: '1', w: 14, sx: 60, sy: 100, z: 2, plain: true },
  { id: 'chat', art: 'ChatCard', ratio: '4/3', w: 22, sx: 0, sy: 100, z: 5 },
  { id: 'stack', art: 'Stack', ratio: '1', w: 13, sx: 78, sy: -2, z: 14, plain: true },
  { id: 'scs-logo', art: 'ScsLogo', ratio: '4/3', w: 18, sx: -12, sy: 42, z: 11 },
  { id: 'poster', kind: 'poster', slug: 'ai-development', ratio: '1', w: 19, sx: 100, sy: -6, z: 12 },
  { id: 'shot-scout', kind: 'shot', src: '/projects/scout/preview-600.webp', label: 'Scout, an AI product by the studio', caption: 'scout, a studio product', ratio: '8/5', w: 22, sx: -14, sy: 18, z: 4 },
  { id: 'terminal', art: 'Terminal', ratio: '16/9', w: 24, sx: 104, sy: 30, z: 4, plain: true },
  { id: 'flow-video', kind: 'video', src: '/ai-world/flow-loop.mp4', poster: '/ai-world/flow-loop.jpg', label: 'A packet through the workflow', ratio: '1', w: 14, sx: 22, sy: -22, z: 13 },
  { id: 'switch', art: 'Switch', ratio: '2/1', w: 16, sx: -8, sy: 78, z: 13, plain: true },
  { id: 'log-video', kind: 'video', scrub: true, src: '/ai-world/log-scrub.mp4', poster: '/ai-world/log-loop.jpg', label: 'The agent log, written by the scroll', ratio: '16/9', w: 26, sx: 102, sy: 58, z: 12 },
  { id: 'night-video', kind: 'video', src: '/ai-world/night-loop.mp4', poster: '/ai-world/night-loop.jpg', label: 'Three in the morning, a reply in forty seconds', ratio: '16/9', w: 20, sx: 40, sy: 104, z: 14 },
];
