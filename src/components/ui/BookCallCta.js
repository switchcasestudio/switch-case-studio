import { BOOK_CALL_URL, BOOK_CALL_LABEL } from '../../data/cta';

/**
 * The primary booking CTA as a plain anchor — canonical label + calendar URL
 * from src/data/cta.js, presentation owned entirely by the CALLSITE's
 * className (hero pill, footer link, menu item… all keep their existing
 * treatments; this is consolidation, not a restyle).
 *
 * `children` renders AFTER the label (arrow spans / icons); `prefix` renders
 * before it (AboutCTA's "& "). The label itself is not overridable — that's
 * the point.
 */
const BookCallCta = ({ className, prefix, children }) => (
  <a
    href={BOOK_CALL_URL}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    {prefix}
    {BOOK_CALL_LABEL}
    {children}
    {/* The link leaves the site for Google Calendar in a new tab; say so to
        screen readers (UX audit, 2026-11-10). */}
    <span className="sr-only"> (opens the booking calendar in a new tab)</span>
  </a>
);

export default BookCallCta;
