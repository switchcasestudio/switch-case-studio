// One source for the legal-page versions and the consent wording. The pages
// print these dates, the contact forms print the wording, and the contact
// function (netlify/functions/contact.mjs) stores all three in every
// submission record, so a record always names the exact policy text the
// sender agreed to. Bump a date in the same commit that changes its page.
export const PRIVACY_UPDATED = 'October 8, 2026';
export const TERMS_UPDATED = 'January 8, 2026';
export const CONSENT_TEXT = 'I agree to the Terms of Use and the Privacy Policy';
