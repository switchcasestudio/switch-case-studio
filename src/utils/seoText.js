/* Title and description lengths for search results (SEO audit fix 8,
   2026-10-09). Pure functions, no React: the pages, scripts/add-post.mjs and
   node one-liners share them, so the gate and the page agree.

   Budgets: a title over ~60 characters and a description over ~160 get cut
   by Google with an ellipsis it chooses. 14 blog titles ran past 60 because
   " | Switch Case Studio" (21 characters) was appended to every post title;
   Google shows the site name on its own line above the result, so a long
   title drops the suffix instead of losing its own last words. */
export const TITLE_MAX = 60;
export const DESC_MAX = 160;
export const BRAND = 'Switch Case Studio';

/* "Post title | Switch Case Studio" when it fits, else the bare title. */
export const brandTitle = (title, max = TITLE_MAX) => {
  const branded = `${title} | ${BRAND}`;
  return branded.length <= max ? branded : title;
};

const TRAILING_STOPWORDS =
  /\s+(a|an|the|and|or|but|of|to|in|on|for|with|from|that|this|its|it|as|at|by|is|are|was|were)$/i;

/* Clamp prose to a meta-description budget.
   A blind .slice() cut every case study mid-word ("…Jelly Belly site; the "),
   which is what ships to search results and social cards. In order:
   1. a whole sentence that ends past half the budget, kept with its period
      and no ellipsis (it reads as finished, because it is);
   2. a clause break ("; ") past half the budget, with an ellipsis;
   3. the last word boundary past 60% of the budget, trailing stopwords
      dropped ("…site; the" → "…site"), with an ellipsis. */
export const clampAtWord = (text, max = DESC_MAX) => {
  if (!text || text.length <= max) return text;
  const sentence = text.slice(0, max + 1).lastIndexOf('. ');
  if (sentence > max * 0.5) return text.slice(0, sentence + 1);

  const cut = text.slice(0, max - 1); // room for the ellipsis
  const clause = cut.lastIndexOf('; ');
  const space = cut.lastIndexOf(' ');
  const at = clause > max * 0.5 ? clause : space > max * 0.6 ? space : cut.length;

  let body = cut.slice(0, at);
  while (TRAILING_STOPWORDS.test(body)) body = body.replace(TRAILING_STOPWORDS, '');
  return `${body.replace(/[\s,;:.—–-]+$/, '')}…`;
};
