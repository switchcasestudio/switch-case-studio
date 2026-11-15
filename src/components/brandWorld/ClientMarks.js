import projects from '../../data/projects.json';
import ClientRow from '../worlds/ClientRow';

/* Real marks on the brand page (UX audit P1, 2026-11-10; owner: "you can
   choose"). The page teaches the craft with "Your brand" and showed no brand
   made for a real business. Each card is the client's own cut logo
   (`clientLogo`, the home strip's asset), named, with the brand work the
   case study lists for it, and it links there. The words under a mark are
   read from that project's `services` in projects.json, never typed, so the
   row claims nothing the case study does not. Since 2026-11-15 the marks
   ride the worlds' shared client row (`worlds/ClientRow.js`), and every
   project sold under this page that has a cut logo and brand work is in it. */
const SERVICE = 'graphic-design-brand-identity';

const brandWork = (p) =>
  (p.services || [])
    .map((s) => s.label.replace(/^#/, ''))
    .filter((label) => /brand|logo/i.test(label))
    .join(', ');

const MARKS = projects
  .filter((p) => (p.servicePages || []).includes(SERVICE) && p.clientLogo && brandWork(p))
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    line: brandWork(p),
    img: p.clientLogo,
    alt: p.clientLogoAlt || `${p.title} logo`,
    logo: true,
  }));

export default function ClientMarks() {
  return <ClientRow id="bw-marks-title" title="Brand work for real businesses" items={MARKS} />;
}
