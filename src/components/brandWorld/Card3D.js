import Card3D from '../worlds/Card3D';

/* The Hatch Ceramics business card (2026-10-22) on the shared 3D card.
   Front: the Hatch mark on cream; back: ink with the contact lines. This
   file is the lazy chunk's entry, so three + fiber stay out of the page
   bundle until the process stage is near. */
function paintFront(ctx, w, h) {
  ctx.fillStyle = '#fef7ed';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#141414';
  ctx.beginPath();
  ctx.arc(w * 0.26, h * 0.5, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fef7ed';
  const bx = w * 0.26;
  const by = h * 0.5;
  ctx.fillRect(bx - h * 0.17, by - h * 0.18, h * 0.07, h * 0.36);
  ctx.fillRect(bx + h * 0.1, by - h * 0.18, h * 0.07, h * 0.36);
  ctx.lineWidth = h * 0.014;
  ctx.strokeStyle = '#fef7ed';
  for (let i = 0; i < 4; i += 1) {
    const y = by - h * 0.05 + i * h * 0.03;
    ctx.beginPath();
    ctx.moveTo(bx - h * 0.1, y);
    ctx.lineTo(bx + h * 0.1, y);
    ctx.stroke();
  }
  ctx.fillStyle = '#141414';
  ctx.font = `700 ${h * 0.16}px Inter, sans-serif`;
  ctx.fillText('Hatch', w * 0.52, h * 0.48);
  ctx.font = `500 ${h * 0.065}px Inter, sans-serif`;
  ctx.fillText('CERAMICS, PORTLAND', w * 0.52, h * 0.6);
}

function paintBack(ctx, w, h) {
  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff834a';
  ctx.fillRect(0, 0, w, h * 0.12);
  ctx.fillStyle = '#fef7ed';
  ctx.font = `700 ${h * 0.11}px Inter, sans-serif`;
  ctx.fillText('Mara Osei', w * 0.08, h * 0.42);
  ctx.font = `500 ${h * 0.065}px Inter, sans-serif`;
  ctx.fillText('Studio lead', w * 0.08, h * 0.54);
  ctx.fillStyle = '#dab8ff';
  ctx.fillText('hatchceramics.example', w * 0.08, h * 0.78);
  ctx.fillText('503 000 0000', w * 0.08, h * 0.88);
}

const Still = () => (
  <svg viewBox="0 0 700 400" aria-hidden="true" focusable="false" className="bw-card3d__still">
    <rect width="700" height="400" className="bw-f-ink" />
    <rect x="87" y="80" width="525" height="300" rx="10" className="bw-f-cream" transform="rotate(-6 350 230)" />
    <circle cx="230" cy="230" r="80" className="bw-f-ink" transform="rotate(-6 350 230)" />
    <text x="330" y="246" className="bw-f-ink" fontFamily="Inter, sans-serif" fontSize="48" fontWeight="700" transform="rotate(-6 350 230)">
      Hatch
    </text>
  </svg>
);

export default function HatchCard3D() {
  return <Card3D front={paintFront} back={paintBack} Still={Still} label="A Hatch Ceramics business card, front and back" />;
}
