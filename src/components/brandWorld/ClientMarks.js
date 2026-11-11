import { Link } from 'react-router-dom';
import projects from '../../data/projects.json';

/* Three real marks on the brand page (UX audit P1, 2026-11-10; owner:
   "you can choose"). The page teaches the craft with "Your brand" and showed
   no brand made for a real business. Each mark is the client's own cut logo
   (`clientLogo`, the home strip's asset), named, with the brand work the
   case study lists for it, and it links there. The words under a mark are
   read from that project's `services` in projects.json, never typed, so the
   strip claims nothing the case study does not. */
const PICKS = ['my-challah-dealer', 'zahav-medspa', 'sha-design-studio'];

const brandWork = (p) =>
  (p.services || [])
    .map((s) => s.label.replace(/^#/, ''))
    .filter((label) => /brand|logo/i.test(label))
    .join(', ');

const MARKS = PICKS.map((slug) => projects.find((p) => p.slug === slug)).filter(
  (p) => p && p.clientLogo && brandWork(p),
);

export default function ClientMarks() {
  if (!MARKS.length) return null;
  return (
    <section className="bw-marks" aria-labelledby="bw-marks-title">
      <h2 id="bw-marks-title" className="bw-marks__title">
        Brand work for real businesses
      </h2>
      <ul className="bw-marks__row">
        {MARKS.map((p) => (
          <li key={p.slug}>
            <Link to={`/projects/${p.slug}`} className="bw-marks__item" aria-label={`${p.title} case study`}>
              <img
                className="bw-marks__logo"
                src={p.clientLogo}
                alt={p.clientLogoAlt || `${p.title} logo`}
                loading="lazy"
                decoding="async"
                height="96"
              />
              <span className="bw-marks__name">{p.title}</span>
              <span className="bw-marks__work">{brandWork(p)}</span>
              <span className="bw-marks__more" aria-hidden="true">
                See the case study →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
