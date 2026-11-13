/* Plain words for the measuring terms the case studies use (UX audit,
   2026-11-10: "largest contentful paint" and "DOM elements" are not results
   a business owner can read). A gloss DEFINES the term; it never adds a
   claim about the project, so the sourced value and label stay as written.
   First match wins; a label with no known term gets no gloss. */
const GLOSSES = [
  [/largest contentful paint|page paint/i, "The time until the page's main content shows."],
  [/layout shift/i, 'How much the page jumps around while it loads.'],
  [/DOM elements/i, 'The pieces a browser builds to draw the page. Fewer is faster.'],
  [/(homepage|page) weight|homepage on a phone/i, "What a visitor's phone has to download."],
  [/Lighthouse/i, "Lighthouse is Google's page test, scored out of 100."],
  [/requests to load/i, 'The files a page fetches. Fewer is faster.'],
  [/structured data/i, 'Structured data is the labeling that lets Google show rich results.'],
  [/allowed to index/i, 'Indexed pages are the ones Google can show in search.'],
  [/average Google position/i, 'Where the page ranks in Google results. 1 is the top.'],
  [/visits engaged/i, 'Google counts a visit as engaged when it lasts over 10 seconds or opens a second page.'],
];

export const metricGloss = (label = '') => {
  const hit = GLOSSES.find(([re]) => re.test(label));
  return hit ? hit[1] : null;
};
