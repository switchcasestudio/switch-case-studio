/* The AI & Automation world's drawings (2026-10-22). One language, from the
   owner's reference (a "Portfolio Workbench" diagram): thick outlines on a
   dark field, an outlined letter, a striped box, a pill button, a circle
   with a slash, long open arrows, short captions that open in bold. No
   fills except the one accent (lavender) and the dark field itself.
   Every stroke is `currentColor`, so the same drawing is cream on the
   black tiles and ink on the process stage's light fields. Pure SVG,
   SSR-safe, presentation attributes only; `data-p` hooks mark the parts
   tiles/live.js moves. The tile box provides the plate (aiWorld.scss),
   so these draw no background. */
import { ScsLogo } from '../../brandWorld/tiles/concepts';

export { ScsLogo };

const INTER = "Inter, 'Inter Fallback', sans-serif";
const LAVENDER = '#dab8ff';
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 16, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 12 };

export const Label = ({ x, y, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fill="currentColor" fontFamily={INTER} fontSize="14" fontWeight="500" letterSpacing="2">
    {children}
  </text>
);

/* The agent: the reference's outlined "a", with the dot that precedes it. */
export function AgentA() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="64" cy="306" r="22" {...THIN} />
      <text
        data-p="a"
        x="120"
        y="334"
        fontFamily={INTER}
        fontSize="360"
        fontWeight="700"
        letterSpacing="-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        a
      </text>
      <Label x={28} y={48}>AGENT</Label>
    </svg>
  );
}

/* The queue: the reference's striped box. The lines are a log that keeps
   coming; the box clips them. */
export function QueueBox() {
  const rows = [0, 1, 2, 3, 4, 5, 6];
  const step = 352 / 7;
  return (
    <svg viewBox="0 0 800 400" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="aw-queue-clip">
          <rect x="24" y="24" width="752" height="352" rx="48" />
        </clipPath>
      </defs>
      <g clipPath="url(#aw-queue-clip)">
        <g data-p="lines" {...THIN}>
          {rows.map((r) => (
            <path key={r} d={`M24 ${24 + step * (r + 1)}H776`} />
          ))}
        </g>
      </g>
      <rect x="24" y="24" width="752" height="352" rx="48" {...S} />
    </svg>
  );
}

/* The button: the reference's "Publish" pill, here it runs the job. */
export function RunPill() {
  return (
    <svg viewBox="0 0 800 320" aria-hidden="true" focusable="false">
      <rect data-p="pill" x="24" y="24" width="752" height="272" rx="136" {...S} />
      <rect data-p="runner" x="24" y="24" width="752" height="272" rx="136" fill="none" stroke={LAVENDER} strokeWidth="16" strokeDasharray="90 1800" strokeLinecap="round" />
      <text data-p="txt" x="400" y="212" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="150" fontWeight="500" letterSpacing="-4">
        Run
      </text>
    </svg>
  );
}

/* The circle with a slash: what stays human. */
export function NoCircle() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="200" r="150" {...S} />
      <path data-p="slash" d="M94 94L306 306" {...S} />
      <Label x={200} y={388} anchor="middle">KEPT HUMAN</Label>
    </svg>
  );
}

/* A long open arrow: the reference's connector. */
export function LongArrow() {
  return (
    <svg viewBox="0 0 900 300" aria-hidden="true" focusable="false">
      <path data-p="line" d="M60 150H790" {...S} strokeDasharray="730" strokeDashoffset="0" />
      <path data-p="head" d="M690 86L800 150L690 214" {...S} />
    </svg>
  );
}

/* The clock: it runs at 3 am. */
export function Clock() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="200" cy="190" r="150" {...S} />
      <path data-p="hour" d="M200 190V120" {...S} transform="rotate(90 200 190)" />
      <path data-p="min" d="M200 190V76" {...THIN} />
      <circle cx="200" cy="190" r="12" fill="currentColor" />
      <Label x={200} y={388} anchor="middle">3:00 AM, STILL ON</Label>
    </svg>
  );
}

/* The workflow: a trigger, the agent, three places the work goes. */
export const GRAPH = {
  win: 'M100 200H200',
  wires: ['M340 200C400 200 400 90 470 90', 'M340 200H470', 'M340 200C400 200 400 310 470 310'],
};
export function NodeGraph() {
  return (
    <svg viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <circle cx="70" cy="200" r="30" {...THIN} />
      <path data-p="win" d={GRAPH.win} {...THIN} />
      <rect data-p="agent" x="200" y="150" width="140" height="100" rx="22" {...S} />
      <text x="270" y="226" textAnchor="middle" fill="currentColor" fontFamily={INTER} fontSize="64" fontWeight="700" letterSpacing="-2">
        a
      </text>
      {GRAPH.wires.map((d, i) => (
        <path key={d} data-p={`w${i}`} d={d} {...THIN} />
      ))}
      {[90, 200, 310].map((y) => (
        <rect key={y} x="470" y={y - 30} width="90" height="60" rx="14" {...THIN} />
      ))}
      <circle data-p="pkt" cx="100" cy="200" r="13" fill={LAVENDER} />
    </svg>
  );
}

/* The assistant: a question, and an answer being typed. */
export function ChatCard() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <path d="M30 40h220a30 30 0 0 1 30 30v20a30 30 0 0 1-30 30H90l-40 28v-28h-20a30 30 0 0 1-30-30V70a30 30 0 0 1 30-30z" {...THIN} />
      <g data-p="b2">
        <path d="M150 160h190a30 30 0 0 1 30 30v30a30 30 0 0 1-30 30h-20v28l-40-28H150a30 30 0 0 1-30-30v-30a30 30 0 0 1 30-30z" {...THIN} />
        <g data-p="dots" fill="currentColor">
          <circle cx="210" cy="205" r="10" />
          <circle cx="245" cy="205" r="10" />
          <circle cx="280" cy="205" r="10" />
        </g>
      </g>
    </svg>
  );
}

/* The stack in two and a half dimensions: the hosting layers, lavender on
   top. The hand slides them apart. */
export function Stack() {
  const depth = [4, 3, 2, 1];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      {depth.map((d) => (
        <rect key={d} data-p="layer" x="90" y="110" width="220" height="220" rx="36" {...THIN} transform={`translate(${d * 14} ${-d * 14})`} />
      ))}
      <rect data-p="top" x="90" y="110" width="220" height="220" rx="36" fill={LAVENDER} stroke="currentColor" strokeWidth="12" />
      <Label x={28} y={380}>YOUR VPS, FOUR LAYERS</Label>
    </svg>
  );
}

/* The terminal: the log an agent writes, one line at a time. */
export const LOG = [420, 300, 520, 260, 380];
export function Terminal() {
  return (
    <svg viewBox="0 0 800 450" aria-hidden="true" focusable="false">
      <rect x="24" y="24" width="752" height="402" rx="28" {...THIN} />
      <path d="M24 100H776" {...THIN} />
      {[70, 110, 150].map((x) => (
        <circle key={x} cx={x} cy="62" r="10" fill="currentColor" />
      ))}
      <g data-p="log" {...THIN}>
        {LOG.map((w, i) => (
          <path key={w} d={`M70 ${150 + i * 50}H${70 + w}`} />
        ))}
      </g>
      <rect data-p="cur" x="470" y="332" width="26" height="36" rx="4" fill={LAVENDER} />
    </svg>
  );
}

/* The switch: self-hosted or not. */
export function Switch() {
  return (
    <svg viewBox="0 0 800 400" aria-hidden="true" focusable="false">
      <rect data-p="track" x="100" y="110" width="600" height="160" rx="80" {...S} />
      <circle data-p="knob" cx="180" cy="190" r="54" fill="currentColor" />
      <Label x={100} y={340}>SELF-HOSTED</Label>
      <text data-p="state" x="700" y="340" textAnchor="end" fill="currentColor" fontFamily={INTER} fontSize="14" fontWeight="500" letterSpacing="2">
        OFF
      </text>
    </svg>
  );
}

/* The trigger: a bolt, what starts the run. */
export function Trigger() {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <path data-p="bolt" d="M232 36L104 226H200L168 364L296 174H200z" {...S} />
      <Label x={200} y={396} anchor="middle">TRIGGER</Label>
    </svg>
  );
}

/* The envelope: lifecycle mail. The flap lifts for the hand. */
export function Envelope() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect x="40" y="80" width="320" height="180" rx="24" {...THIN} />
      <path data-p="flap" d="M40 92L200 206L360 92" {...THIN} />
    </svg>
  );
}
