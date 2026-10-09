// Posts a contact form to the site's own function (netlify/functions/contact.mjs),
// which records the submission server-side and emails it. `consent` is the
// visitor's tick; the function refuses a submission without it.
export default async function sendContact(form, { source, consent }) {
  const fields = Object.fromEntries(new FormData(form));
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...fields, source, consent, page: window.location.pathname }),
  });
  if (!res.ok) throw new Error(`contact ${res.status}`);
}
