import useReducedMotion from '../../hooks/useReducedMotion';
import projects from '../../data/projects.json';
import { starPoints } from '../pricing/spreads/artKit';
import '../../styles/components/clientStrip.scss';

/* ------------------------------------------------------------------ *
 * "Trusted by" marquee — TEXT wordmarks (2026-07, DESIGN_AUDIT P1-6,
 * Moses's pick: option B now, real logos later).
 *
 * The old version marqueed the case-study COVER-TILE images as 96px
 * squares — screenshots posing as logos, and the darkest covers read
 * as empty black squares on the #000 page. Client names as styled text
 * are honest proof and can't vanish.
 *
 * DERIVED from projects.json (2026-08-29) — same law as PRICING_LINKS/
 * PROJECT_LINKS: a component-local copy WILL drift, and this one did
 * (Florida Green shipped 2026-08-26 and never made it here). `featured`
 * AND not `studioProject`: a strip labelled "Trusted by" lists clients,
 * not our own products (Scout, Jelly Belly Wiki) or non-client work
 * (Birth of Venus). Adding a featured client updates the marquee
 * automatically. The loop is
 * count-agnostic (translateX(-50%) over a duplicated track), so length
 * changes need no CSS edit.
 *
 * LOGO-READY: a project may carry `clientLogo` (path to a real wordmark
 * asset) + `clientLogoAlt` in projects.json. When present it renders
 * instead of the text — upgrading to option A is a data edit, not a
 * refactor. Before adding a logo, verify its provenance/permission
 * (CLAUDE.md rule).
 * ------------------------------------------------------------------ */
// Studio products join the strip only when they carry a cut mark (owner,
// 2026-09-11: Scout and Birth of Venus in the marquee). Their marks are cut
// by hand, not by scripts/cut-client-logos.py, which skips studio projects.
const LISTED = projects
  .filter((p) => (p.featured && !p.studioProject) || (p.studioProject && p.clientLogo))
  .map((p) => ({
    name: p.title,
    logo: p.clientLogo || null,
    logoAlt: p.clientLogoAlt,
    round: !!p.clientLogoRound,
  }));

/* Round badges spread evenly (owner, 2026-09-24: two badges side by side
   "looks like a mistake"). Projects flag a circular mark with
   `clientLogoRound`; those take evenly spaced slots around the LOOP (the
   gap across the wrap counts too), the wordmarks fill the rest in
   projects.json order. Deterministic, so SSG and hydration agree. */
const spreadRound = (list) => {
  const round = list.filter((c) => c.round);
  const rest = list.filter((c) => !c.round);
  if (round.length < 2) return list;
  const slots = new Set(round.map((_, i) => Math.round((i * list.length) / round.length)));
  const out = [];
  for (let i = 0, r = 0, w = 0; i < list.length; i++) {
    out.push(slots.has(i) && r < round.length ? round[r++] : rest[w++] ?? round[r++]);
  }
  return out;
};

const CLIENTS = spreadRound(LISTED);

/* One rendered cell — text wordmark now, image later when `logo` lands.
 * Each mark is followed by the brand's eight-point star (VE-2026-07
 * elevation): decorative rhythm only, hidden from AT, fixed-size so the
 * loop geometry is unchanged. */
const ClientMark = ({ client }) =>
  client.logo ? (
    <img
      src={client.logo}
      alt={client.logoAlt || client.name}
      className="client-strip__logo-img"
      loading="lazy"
      draggable="false"
    />
  ) : (
    <span className="client-strip__name">{client.name}</span>
  );

// An SVG burst, not a glyph: U+2733 drew as an emoji on Apple devices
// (owner, 2026-10-14). Same star as the sticker sheet, sharper inner radius.
const SEP_POINTS = starPoints(10, 4.5);

const StarSep = () => (
  <svg className="client-strip__sep" viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">
    <polygon points={SEP_POINTS} />
  </svg>
);

const ClientStrip = () => {
  const reduced = useReducedMotion();

  return (
    <section className="client-strip" aria-label="Clients we've worked with">
      <p className="client-strip__label">Trusted by</p>

      <div className="client-strip__track-wrap">
        <ul
          className={`client-strip__track ${reduced ? 'client-strip__track--paused' : ''}`}
        >
          {/* First set is REAL content: client names are legitimate proof
              and belong in the accessibility tree (the old all-hidden track
              made sense for decorative image squares, not for names). */}
          {CLIENTS.map((c) => (
            <li key={c.name} className="client-strip__item">
              <ClientMark client={c} />
              <StarSep />
            </li>
          ))}
          {/* Second set exists only for the seamless CSS loop — hidden from
              AT so nobody hears the client list twice. */}
          {CLIENTS.map((c) => (
            <li
              key={`${c.name}-dup`}
              className="client-strip__item"
              aria-hidden="true"
            >
              <ClientMark client={c} />
              <StarSep />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ClientStrip;
