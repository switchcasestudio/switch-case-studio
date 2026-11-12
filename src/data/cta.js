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
export const BOOK_CALL_LABEL = 'Book a free discovery call';

/* The call's terms (owner, 2026-11-11: "30 min, Book a free discovery call").
   The length is the slot on the booking calendar; when that slot changes,
   change it here and every sentence follows. A sentence that names the call
   reads these, it never types the number. */
export const BOOK_CALL_MINUTES = 30;
// "The call is free and takes 30 minutes."
export const BOOK_CALL_LENGTH = `${BOOK_CALL_MINUTES} minutes`;
// "Every build starts with a free 30-minute discovery call."
export const BOOK_CALL_KIND = `free ${BOOK_CALL_MINUTES}-minute discovery call`;
