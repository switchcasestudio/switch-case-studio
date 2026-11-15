/* The lead into a world's stage (2026-11-15). The owner's reference never
   cuts from its hero to its stage: one paragraph sits in a screen of air,
   then an inset plate says what is coming, and the stage rises out from
   under it. Ours went from the hero straight into a pinned field. Both parts
   are static: density breathes, and the stage that follows is the motion.
   `how` tells the visitor the demos answer to scroll and touch; it is left
   out under reduced motion (styles), where nothing answers to scroll. The
   line is a paragraph, not a heading: the stage keeps the section's h2. */
export default function StageLead({ breath, how, line, field, ink }) {
  return (
    <div className="bw-lead">
      <p className="bw-lead__breath">
        {breath} <span className="bw-lead__how">{how}</span>
      </p>
      <div className="bw-lead__board" style={{ '--bw-field': field, '--bw-ink': ink }}>
        <p className="bw-lead__line">{line}</p>
      </div>
    </div>
  );
}

export const LEAD_HOW = 'Scroll and each one shows itself. Touch a demo and it is yours.';
