import Card3D from '../worlds/Card3D';

/* The agent's access card (2026-10-22) on the shared 3D card, in the AI
   world's outline language. Front: black, the outlined "a" and its number;
   back: lavender, what it is allowed to do. This file is the lazy chunk's
   entry, so three + fiber stay out of the page bundle until the stage is
   near. */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function paintFront(ctx, w, h) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#fef7ed';
  ctx.lineWidth = h * 0.012;
  roundRect(ctx, h * 0.06, h * 0.06, w - h * 0.12, h - h * 0.12, h * 0.08);
  ctx.stroke();
  ctx.lineWidth = h * 0.02;
  ctx.lineJoin = 'round';
  ctx.font = `700 ${h * 0.62}px Inter, sans-serif`;
  ctx.strokeText('a', w * 0.1, h * 0.74);
  ctx.fillStyle = '#dab8ff';
  ctx.beginPath();
  ctx.arc(w * 0.08, h * 0.68, h * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef7ed';
  ctx.font = `500 ${h * 0.065}px Inter, sans-serif`;
  ctx.fillText('AGENT 01', w * 0.52, h * 0.3);
  ctx.fillText('RUNS 24/7', w * 0.52, h * 0.42);
  ctx.fillText('KEEPS A LOG', w * 0.52, h * 0.54);
}

function paintBack(ctx, w, h) {
  ctx.fillStyle = '#dab8ff';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#141414';
  ctx.lineWidth = h * 0.012;
  ctx.lineCap = 'round';
  ctx.fillStyle = '#141414';
  ctx.font = `700 ${h * 0.11}px Inter, sans-serif`;
  ctx.fillText('Allowed to', w * 0.08, h * 0.26);
  ctx.font = `500 ${h * 0.07}px Inter, sans-serif`;
  const rows = ['Read the inbox', 'Draft, never send alone', 'Book the calendar', 'Write every step down'];
  rows.forEach((r, i) => {
    const y = h * (0.42 + i * 0.13);
    ctx.beginPath();
    ctx.arc(w * 0.1, y - h * 0.025, h * 0.02, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText(r, w * 0.15, y);
  });
}

const Still = () => (
  <svg viewBox="0 0 700 400" aria-hidden="true" focusable="false" className="bw-card3d__still">
    <rect width="700" height="400" fill="#000" />
    <g transform="rotate(-6 350 230)">
      <rect x="87" y="80" width="525" height="300" rx="20" fill="#000" stroke="#fef7ed" strokeWidth="6" />
      <text x="130" y="330" fontFamily="Inter, sans-serif" fontSize="240" fontWeight="700" fill="none" stroke="#fef7ed" strokeWidth="8">
        a
      </text>
      <text x="400" y="180" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="500" letterSpacing="2" fill="#fef7ed">
        AGENT 01
      </text>
    </g>
  </svg>
);

export default function AgentCard3D() {
  return <Card3D front={paintFront} back={paintBack} edge="#3a3a3a" Still={Still} label="The agent's access card, front and back" />;
}
