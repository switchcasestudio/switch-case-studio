/* Passage retrieval for the worlds' lessons (2026-10-27), lifted out of
   the AI world's Grounding lesson so the SEO world's Quoted lesson scores
   passages the same way: TF-IDF and cosine similarity, the classic way
   search scores a match by the words two texts share, weighted by how rare
   each word is. A live engine also matches meaning (embeddings); the
   principle is the same. Pure functions, so the server and the client
   score alike. */

export const STOP = new Set(
  'a an and are as at be by can do does for from how i in is it its me my of on or our than that the their there this to up us we what when where which who will with you your yours if any not get'.split(
    ' ',
  ),
);

export const stem = (w) => {
  for (const [s, r] of [
    ['ies', 'y'],
    ['ing', ''],
    ['ed', ''],
    ['s', ''],
  ]) {
    if (w.endsWith(s) && w.length - s.length >= 3) return w.slice(0, -s.length) + r;
  }
  return w;
};

export const words = (t) => (t.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => !STOP.has(w)).map(stem);

// A scorer over `docs` ({ title, text }): `search(q)` returns every doc
// with its `score`, best first.
export function makeSearch(docs) {
  const docWords = docs.map((d) => words(`${d.title} ${d.text}`));
  const df = {};
  docWords.forEach((ws) =>
    new Set(ws).forEach((w) => {
      df[w] = (df[w] || 0) + 1;
    }),
  );
  const idf = (w) => Math.log((docs.length + 1) / ((df[w] || 0) + 1)) + 1;
  const vec = (ws) => {
    const v = {};
    ws.forEach((w) => {
      v[w] = (v[w] || 0) + 1;
    });
    Object.keys(v).forEach((w) => {
      v[w] *= idf(w);
    });
    return v;
  };
  const size = (v) => Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0)) || 1;
  const docVecs = docWords.map(vec);

  return function search(q) {
    const qv = vec(words(q));
    const qn = size(qv);
    return docs
      .map((d, i) => {
        let dot = 0;
        Object.keys(qv).forEach((w) => {
          if (docVecs[i][w]) dot += qv[w] * docVecs[i][w];
        });
        return { ...d, score: dot / (qn * size(docVecs[i])) };
      })
      .sort((a, b) => b.score - a.score);
  };
}

// A passage with the words it shares with the question marked.
export function Marked({ text, q }) {
  const want = new Set(words(q));
  return text.split(/([A-Za-z0-9]+)/).map((part, i) => {
    const w = part.toLowerCase();
    const hit = /^[a-z0-9]+$/.test(w) && !STOP.has(w) && want.has(stem(w));
    return hit ? <mark key={i}>{part}</mark> : part;
  });
}
