/**
 * Single source of truth for the primary booking CTA (DESIGN_AUDIT P1-5).
 *
 * Every "book a call" surface imports from here — either the constants
 * (data-driven callsites: Footer link list, SinglePricingCard props) or the
 * <BookCallCta> component (src/components/ui/BookCallCta.js) for plain
 * anchors. Change the label or calendar here and the whole site follows;
 * hardcoding either string in a component is a regression.
 *
 * Deliberately SEPARATE funnels that do NOT use these (each has its own
 * calendar/label so leads stay attributable):
 *   - /partners       → PartnersPage.js INTRO_CALL_URL (wholesale; currently
 *                       falls back to this URL until its own link exists)
 *
 * Analytics needs no wiring: ga.js's delegated listener fires
 * book_call_click on ANY calendar.app.google href.
 */
export const BOOK_CALL_URL = 'https://calendar.app.google/83UCJjis2FHUrr1s6';
export const BOOK_CALL_LABEL = 'Book a strategy call';
