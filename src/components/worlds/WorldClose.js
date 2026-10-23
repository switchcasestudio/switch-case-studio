import { Link } from 'react-router-dom';

/* A world's last two sections (2026-10-22): two circles (the reference's
   "two circles" close) and the pill that is the whole page's last word.
   Shared by the worlds; the colors come from the page's modifier class.
   `pricing` is the way to the service's packages: a service page is the
   work, its pricing page the number, and each links the other. */
export default function WorldClose({ title, note, pricing, primary, secondary, pill }) {
  return (
    <>
      <section className="bw-circles" aria-label="Next step">
        <h2 className="bw-circles__title">{title}</h2>
        <div className="bw-circles__row">
          <Link to={primary.to} className="bw-circle bw-circle--a">
            {primary.label}
          </Link>
          <Link to={secondary.to} className="bw-circle bw-circle--b">
            {secondary.label}
          </Link>
        </div>
        <p className="bw-circles__note">
          {note}
          {pricing && (
            <>
              {' '}
              <Link to={pricing.to} className="bw-circles__link">
                {pricing.label}
              </Link>
            </>
          )}
        </p>
      </section>

      <Link to={pill.to} className="bw-pill">
        {pill.label}
      </Link>
    </>
  );
}
