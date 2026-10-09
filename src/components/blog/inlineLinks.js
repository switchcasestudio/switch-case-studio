/* Inline links in blog text (2026-10-09). Before this, a paragraph was plain
   text and the only link a post could carry was the button-style `link`
   block, so 19 of 20 posts cited nothing and no post linked a service or a
   case study. The form is Markdown's, [label](url), inside paragraph and
   list text; the url is root-absolute (stays on the site) or https. Pure
   functions, no React: scripts/add-post.mjs validates with the same code the
   renderer uses, so a post cannot pass the gate and then render differently,
   and node can test it without a build. A link with any other url is left as
   literal text rather than rendered, and add-post rejects it. */
export const INLINE_LINK = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

export const isLinkUrl = (url) => url.startsWith('/') || url.startsWith('https://');

/* Split text into [{ type: 'text', value }, { type: 'link', label, url }, …]. */
export const tokenize = (text) => {
  const s = String(text ?? '');
  const out = [];
  let last = 0;
  for (const m of s.matchAll(INLINE_LINK)) {
    const [whole, label, url] = m;
    if (!isLinkUrl(url)) continue;
    if (m.index > last) out.push({ type: 'text', value: s.slice(last, m.index) });
    out.push({ type: 'link', label, url });
    last = m.index + whole.length;
  }
  if (last < s.length) out.push({ type: 'text', value: s.slice(last) });
  return out;
};

/* The text a reader sees: links reduced to their labels. Word counts and
   reading times use this, so the url never counts as words. */
export const plainText = (text) =>
  tokenize(text)
    .map((t) => (t.type === 'link' ? t.label : t.value))
    .join('');

/* Every [label](url) whose url is neither root-absolute nor https. */
export const badLinks = (text) =>
  [...String(text ?? '').matchAll(INLINE_LINK)].filter((m) => !isLinkUrl(m[2])).map((m) => m[0]);
