import { Link } from 'react-router-dom';
import Collage from './Collage';
import '../../styles/components/brandWorld.scss';

/* The Brand Identity world (2026-10-22). Principles from the reference
   analysis (.audit/brand-identity-reference.md): everything is a flat plate,
   scroll is the clock, density breathes, hover flips colour, media lives in
   tiles. Palette stays SCS: ink, cream, lavender, blue, orange, plus the
   poster flats (terra, mint, pink). Sections land in order; the collage
   hero is first. */
export default function BrandWorld() {
  return (
    <div className="bw">
      <Collage />

      <section className="bw-breath" aria-label="About the concepts">
        <p>
          Five studio concepts live on this page. Scroll and they come apart; every piece is a vector you can push
          around. That is the test of an identity: it survives being moved.
        </p>
      </section>

      <section className="bw-circles" aria-label="Next step">
        <h2 className="bw-circles__title">
          <span className="bw-plate bw-plate--lavender">Your mark</span> is next.
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
          Every identity starts with a free call. The packages and what they include are on the pricing page; this page
          is the work.
        </p>
      </section>

      <Link to="/contact" className="bw-pill">
        Book a free call
      </Link>
    </div>
  );
}
