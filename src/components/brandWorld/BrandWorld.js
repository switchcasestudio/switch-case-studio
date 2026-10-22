import { Link } from 'react-router-dom';
import Collage from './Collage';
import TypeStage from './TypeStage';
import ProcessStage from './ProcessStage';
import Deliverables from './Deliverables';
import Bubbles from './Bubbles';
import '../../styles/components/brandWorld.scss';

/* The Brand Identity world (2026-10-22). Principles from the reference
   analysis (.audit/brand-identity-reference.md): everything is a flat plate,
   scroll is the clock, density breathes, hover flips color, media lives in
   tiles. Palette stays SCS: ink, cream, lavender, blue, orange, plus the
   poster flats (terra, mint, pink). Order: collage, breath, type stage,
   process stage, deliverables, client bubbles, circles, pill. */
export default function BrandWorld() {
  return (
    <div className="bw">
      <Collage />

      <section className="bw-breath" aria-label="About the concepts">
        <p>
          Five made-up Portland businesses live on this page. Scroll and their pieces come apart; every one is a vector
          you can push around. An identity has to survive being moved.
        </p>
      </section>

      <TypeStage />
      <ProcessStage />
      <Deliverables />
      <Bubbles />

      <section className="bw-circles" aria-label="Next step">
        <h2 className="bw-circles__title">
          Your mark is next.
        </h2>
        <div className="bw-circles__row">
          <Link to="/contact" className="bw-circle bw-circle--orange">
            Start a brand
          </Link>
          <Link to="/projects" className="bw-circle bw-circle--blue">
            See client work
          </Link>
        </div>
        <p className="bw-circles__note">
          Every identity starts with a free call. What each package includes is on the pricing page; this page is the
          work.
        </p>
      </section>

      <Link to="/contact" className="bw-pill">
        Book a free call
      </Link>
    </div>
  );
}
