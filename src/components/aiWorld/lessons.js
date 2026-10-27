import { useId, useState } from 'react';

/* The lessons of the AI world's stage (2026-10-27), the brand and Web
   worlds' "What we know" for automation: one live demo per thing every
   automation has to get right, each small enough for a stage tile and
   plain enough to stack on a phone. 01 Payback (minutes a time, times a
   week, hours to build: when it pays back), 02 Grounding (an assistant
   finds the passage in your notes before it answers, scored live), 03
   Handoff (where the line sits between answering and asking a person,
   on fourteen questions with known answers), 04 Retries (twenty jobs, the
   same failures, handled three ways), 05 Privacy (what is masked before
   text leaves your server). Every figure is arithmetic or measured on the
   visitor's own input; nothing is a market statistic. Nothing moves until
   the visitor does something. Each demo is a `bw-lesson` plate with the
   shared `.bw-ui` controls; the stickers are small SVG fact plates. */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const META = { fontFamily: INTER, fontSize: 18, fontWeight: 700, letterSpacing: 2 };

function Range({ id, label, value, min, max, step = 1, show, text, onChange }) {
  return (
    <div className="bw-lesson__ctl">
      <label className="bw-ui__lab" htmlFor={id}>
        {label}
      </label>
      <span className="bw-ui__val" aria-hidden="true">
        {show}
      </span>
      <input
        id={id}
        className="bw-ui__range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}

const Toggle = ({ on, onClick, children }) => (
  <button type="button" className={`bw-lesson__toggle${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>
    {children}
  </button>
);

/* ---- 01 Payback: minutes, times, weeks ---- */

const plural = (v, one, many = `${one}s`) => `${v} ${v === 1 ? one : many}`;

export function Payback() {
  const id = useId();
  const [m, setM] = useState(6);
  const [n, setN] = useState(40);
  const [b, setB] = useState(12);
  const perWeek = (m * n) / 60;
  const year = Math.round(perWeek * 52).toLocaleString('en-US');
  const week = Math.ceil(b / perWeek);
  const pays = week <= 52;
  const fmt = (h) => (h < 10 ? h.toFixed(1).replace(/\.0$/, '') : Math.round(h));

  return (
    <div className="bw-lesson bw-lesson--dark aw-pay">
      <div className="aw-pay__ctls">
        <Range id={`${id}-m`} label="Minutes each time" value={m} min={1} max={60} show={`${m} min`} text={plural(m, 'minute')} onChange={setM} />
        <Range id={`${id}-n`} label="Times a week" value={n} min={1} max={200} show={n} text={`${n} times a week`} onChange={setN} />
        <Range id={`${id}-b`} label="Hours to build it" value={b} min={1} max={80} show={`${b} h`} text={plural(b, 'hour')} onChange={setB} />
      </div>

      <div className="aw-pay__sum" aria-hidden="true">
        <p>
          <b>{fmt(perWeek)}</b>
          <span>hours a week</span>
        </p>
        <p>
          <b>{year}</b>
          <span>hours a year</span>
        </p>
        <p className={pays ? '' : 'is-late'}>
          <b>{pays ? `Week ${week}` : `${week} wk`}</b>
          <span>{pays ? 'it pays back' : 'past a year'}</span>
        </p>
      </div>

      <ol className="aw-pay__year" aria-hidden="true">
        {Array.from({ length: 52 }, (_, i) => (
          <li key={i} className={i + 1 >= week ? 'is-saved' : ''} />
        ))}
      </ol>
      <div className="aw-pay__axis" aria-hidden="true">
        <span>Week 1</span>
        <span>26</span>
        <span>52</span>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {m} min x {n} a week = {fmt(perWeek)} hours a week, {year} a year.
        </strong>{' '}
        {pays
          ? `${plural(b, 'hour')} of building pays back in week ${week}; the rest of the year is time back.`
          : `${plural(b, 'hour')} of building takes ${week} weeks to pay back: make it simpler, or leave it manual.`}
      </p>
    </div>
  );
}

// Five workdays, fifty-two weeks: 260 days. Hours = min x times x 260 / 60.
export function PaybackTable() {
  const rows = [
    ['2 min', '20 a day', '173 h'],
    ['5 min', '10 a day', '217 h'],
    ['15 min', '4 a day', '260 h'],
  ];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        ONE TASK, ONE YEAR
      </text>
      {rows.map(([a, b, h], i) => (
        <g key={a} transform={`translate(28 ${70 + i * 62})`}>
          <text y="16" className="bw-f-cream" fontFamily={INTER} fontSize="18" fontWeight="700">
            {a}
          </text>
          <text y="38" className="bw-f-cream" fontFamily={INTER} fontSize="18" opacity="0.75">
            {b}
          </text>
          <text x="344" y="34" className="bw-f-orange" fontFamily={INTER} fontSize="34" fontWeight="800" letterSpacing="-1" textAnchor="end">
            {h}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        260 WORKDAYS
      </text>
    </svg>
  );
}

/* ---- 02 Grounding and 03 Handoff: one search over your notes ---- */

// "Your business"'s notes, a sample. The assistant answers from these and
// nothing else.
export const NOTES = [
  { key: 'hours', title: 'Hours', text: 'Open Monday to Friday, 9 am to 6 pm, and Saturday 10 am to 2 pm. Closed on Sunday and public holidays.' },
  { key: 'delivery', title: 'Delivery', text: 'We deliver within 25 miles, Monday to Saturday. Orders placed by noon go out the same day. Delivery is free on orders over $50.' },
  { key: 'returns', title: 'Returns', text: 'Return unused items within 30 days, with the receipt, for a full refund. Sale items can be exchanged, not refunded.' },
  { key: 'booking', title: 'Booking', text: 'Book a visit online or by phone. We confirm by email and text, and you can move or cancel your booking up to 24 hours before.' },
  { key: 'quotes', title: 'Quotes', text: 'Prices are on the Prices page. A quote for a larger order is free and takes one working day.' },
  { key: 'payment', title: 'Payment', text: 'We take cards, Apple Pay and bank transfer. Invoices are due in 14 days.' },
];

// TF-IDF and cosine similarity, the classic way search scores a match by
// the words two texts share, weighted by how rare each word is. A live
// assistant also matches meaning (embeddings); the principle is the same.
const STOP = new Set(
  'a an and are as at be by can do does for from how i in is it its me my of on or our than that the their there this to up us we what when where which who will with you your yours if any not get'.split(
    ' ',
  ),
);
const stem = (w) => {
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
const words = (t) => (t.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => !STOP.has(w)).map(stem);
const docWords = NOTES.map((d) => words(`${d.title} ${d.text}`));
const df = {};
docWords.forEach((ws) =>
  new Set(ws).forEach((w) => {
    df[w] = (df[w] || 0) + 1;
  }),
);
const idf = (w) => Math.log((NOTES.length + 1) / ((df[w] || 0) + 1)) + 1;
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

export function search(q) {
  const qv = vec(words(q));
  const qn = size(qv);
  return NOTES.map((d, i) => {
    let dot = 0;
    Object.keys(qv).forEach((w) => {
      if (docVecs[i][w]) dot += qv[w] * docVecs[i][w];
    });
    return { ...d, score: dot / (qn * size(docVecs[i])) };
  }).sort((a, b) => b.score - a.score);
}

const LINE = 0.25;
const ASK = ['Is delivery free?', 'Can I move my booking?', 'Do you take Apple Pay?', 'Do you sell gift cards?'];

// The passage, with the words it shares with the question marked.
function Marked({ text, q }) {
  const want = new Set(words(q));
  return text.split(/([A-Za-z0-9]+)/).map((part, i) => {
    const w = part.toLowerCase();
    const hit = /^[a-z0-9]+$/.test(w) && !STOP.has(w) && want.has(stem(w));
    return hit ? <mark key={i}>{part}</mark> : part;
  });
}

export function Grounding() {
  const id = useId();
  const [q, setQ] = useState(ASK[0]);
  const ranked = search(q);
  const top = ranked[0];
  const asked = q.trim().length > 0;
  const found = asked && top.score >= LINE;

  return (
    <div className="bw-lesson bw-lesson--light aw-find">
      <form className="aw-find__ask" onSubmit={(e) => e.preventDefault()}>
        <label className="bw-ui__lab" htmlFor={`${id}-q`}>
          Ask Your business
        </label>
        <input
          id={`${id}-q`}
          className="aw-find__input"
          type="text"
          value={q}
          maxLength={80}
          autoComplete="off"
          onChange={(e) => setQ(e.target.value)}
        />
      </form>
      <div className="aw-find__chips" role="group" aria-label="Questions to try">
        {ASK.map((a) => (
          <button key={a} type="button" className={`bw-lesson__chip${q === a ? ' is-on' : ''}`} aria-pressed={q === a} onClick={() => setQ(a)}>
            {a}
          </button>
        ))}
      </div>

      <div className="aw-find__body">
        <div className="aw-find__rank" style={{ '--at': `${(LINE / 0.7) * 100}%` }}>
          <ol aria-label="How well each note matches">
            {ranked.map((d) => (
              <li key={d.key} className={found && d.key === top.key ? 'is-top' : ''}>
                <span>{d.title}</span>
                <i style={{ '--w': `${Math.min(1, d.score / 0.7) * 100}%` }} aria-hidden="true" />
                <b>{d.score.toFixed(2)}</b>
              </li>
            ))}
          </ol>
          <p className="aw-find__line" aria-hidden="true">
            line {LINE}
          </p>
        </div>
        <div className={`aw-find__answer${found ? '' : ' is-out'}`}>
          {found ? (
            <>
              <p className="aw-find__src">From your notes: {top.title}</p>
              <p className="aw-find__quote">
                <Marked text={top.text} q={q} />
              </p>
            </>
          ) : (
            <>
              <p className="aw-find__src">Not in your notes</p>
              <p className="aw-find__quote">{asked ? 'It says so, and sends the question to a person.' : 'Ask it something.'}</p>
            </>
          )}
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>{asked ? `Best match: ${top.title}, ${top.score.toFixed(2)}.` : 'No question yet.'}</strong>{' '}
        {asked && (found ? 'The answer is written from that passage, and names it.' : `Under ${LINE}, it does not guess.`)}
      </p>
    </div>
  );
}

export function AnswerSteps() {
  const steps = ['Find the passage', 'Answer from it', 'Name the source', 'Or hand it over'];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        HOW IT ANSWERS
      </text>
      {steps.map((s, i) => (
        <g key={s} transform={`translate(28 ${76 + i * 46})`}>
          <text y="22" className="bw-f-orange" fontFamily={INTER} fontSize="26" fontWeight="800">
            {i + 1}
          </text>
          <text x="40" y="21" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight={i === 3 ? 700 : 500}>
            {s}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        IN THAT ORDER
      </text>
    </svg>
  );
}

// Fourteen questions with known answers: nine the notes answer, five they
// do not (two of those share words with a note, which is how a wrong
// answer goes out).
const ASKED = [
  ['What time do you open on Saturday?', 'hours'],
  ['Are you open on Sunday?', 'hours'],
  ['Do you deliver on Saturday?', 'delivery'],
  ['Is delivery free?', 'delivery'],
  ['Can I get a refund on a sale item?', 'returns'],
  ['Can I return something without the receipt?', 'returns'],
  ['Can I move my booking?', 'booking'],
  ['Do you take Apple Pay?', 'payment'],
  ['How long does a quote take?', 'quotes'],
  ['Do you sell gift cards?', null],
  ['Can I bring my dog?', null],
  ['Are you hiring?', null],
  ['Can I pay on delivery?', null],
  ['Do you price match?', null],
].map(([q, k]) => {
  const top = search(q)[0];
  return { q, k, top: top.key, title: top.title, score: top.score };
});

const OUTCOME = { right: 'Answered right', wrong: 'Answered wrong', person: 'Sent to a person' };

export function Handoff() {
  const id = useId();
  const [line, setLine] = useState(LINE);
  const [open, setOpen] = useState(12);
  const rows = ASKED.map((r) => ({ ...r, out: r.score < line ? 'person' : r.top === r.k ? 'right' : 'wrong' }));
  const count = (o) => rows.filter((r) => r.out === o).length;
  const sel = rows[open];
  const say = {
    right: `matched ${sel.title} (${sel.score.toFixed(2)}), the right note.`,
    wrong: `matched ${sel.title} (${sel.score.toFixed(2)}), but ${sel.k ? 'the answer is in another note' : 'no note answers it'}.`,
    person: `best match ${sel.score.toFixed(2)}, under the line: a person answers.`,
  }[sel.out];

  return (
    <div className="bw-lesson bw-lesson--dark aw-line">
      <div className="bw-lesson__bar">
        <Range
          id={`${id}-l`}
          label="The line"
          value={line}
          min={0}
          max={0.6}
          step={0.01}
          show={line.toFixed(2)}
          text={`${line.toFixed(2)}: ${count('right')} right, ${count('wrong')} wrong, ${count('person')} to a person`}
          onChange={setLine}
        />
      </div>

      <div className="aw-line__counts" aria-hidden="true">
        {Object.keys(OUTCOME).map((o) => (
          <p key={o} className={`is-${o}`}>
            <b>{count(o)}</b>
            <span>{OUTCOME[o]}</span>
          </p>
        ))}
      </div>

      <ul className="aw-line__qs" aria-label="Fourteen questions">
        {rows.map((r, i) => (
          <li key={r.q}>
            <button
              type="button"
              className={`aw-line__q is-${r.out}${open === i ? ' is-open' : ''}`}
              aria-pressed={open === i}
              onClick={() => setOpen(i)}
            >
              <i aria-hidden="true" />
              <span>{r.q}</span>
              <span className="sr-only">: {OUTCOME[r.out]}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>&ldquo;{sel.q}&rdquo;</strong> {say}
      </p>
    </div>
  );
}

export function KeptHuman() {
  const rows = ['Refunds and money', 'Complaints', 'Anything legal', 'Under the line'];
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        ALWAYS A PERSON
      </text>
      {rows.map((s, i) => (
        <g key={s} transform={`translate(28 ${74 + i * 46})`}>
          <circle cx="11" cy="14" r="11" className="bw-f-orange" />
          <text x="38" y="21" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="600">
            {s}
          </text>
        </g>
      ))}
      <text x="28" y="282" className="bw-f-cream" {...META}>
        SET BEFORE LAUNCH
      </text>
    </svg>
  );
}

/* ---- 04 Retries: the same twenty jobs, handled three ways ---- */

const JOBS = 20;
const TRIES = 4;
const WAITS = [1, 2, 4];

// A small seeded random (mulberry32), so a run is the same on the server
// and in the browser, and the same failures meet every setting.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each try: it works, or it fails. Half the failures are timeouts after
// the write went through (the CRM saved it, the answer never came back),
// which is how a retry without a job ID makes a second copy.
function runJobs(seed, rate, retry, jobId) {
  const r = rng(seed);
  const draws = Array.from({ length: JOBS }, () => Array.from({ length: TRIES }, () => [r(), r()]));
  return draws.map((tries) => {
    const marks = [];
    let writes = 0;
    const max = retry ? TRIES : 1;
    for (let i = 0; i < max; i += 1) {
      const [u, v] = tries[i];
      if (u >= rate) {
        marks.push('ok');
        writes += 1;
        break;
      }
      const timeout = v < 0.5;
      if (timeout) writes += 1;
      marks.push(timeout ? 'late' : 'no');
    }
    const copies = jobId ? Math.min(writes, 1) : writes;
    const gaveUp = marks[marks.length - 1] !== 'ok';
    return { marks, copies, told: retry && gaveUp };
  });
}

const MARK = { ok: 'worked', late: 'timed out after saving', no: 'refused' };

export function Retries() {
  const id = useId();
  const [rate, setRate] = useState(30);
  const [retry, setRetry] = useState(false);
  const [jobId, setJobId] = useState(false);
  const [seed, setSeed] = useState(7);
  const jobs = runJobs(seed, rate / 100, retry, jobId);
  const once = jobs.filter((j) => j.copies === 1).length;
  const dup = jobs.filter((j) => j.copies > 1).length;
  const lost = jobs.filter((j) => j.copies === 0).length;
  const told = jobs.filter((j) => j.told).length;
  const why = !retry
    ? 'No retries: a refused job is simply lost.'
    : !jobId
      ? 'Retries save the refused jobs, but a timeout that already saved is sent again.'
      : 'Retries with a job ID: the CRM ignores a copy it has seen.';

  return (
    <div className="bw-lesson bw-lesson--light aw-retry">
      <div className="bw-lesson__bar">
        <Range
          id={`${id}-r`}
          label="The CRM fails"
          value={rate}
          min={0}
          max={60}
          step={5}
          show={`${rate}%`}
          text={`${rate} percent of tries`}
          onChange={setRate}
        />
        <Toggle on={retry} onClick={() => setRetry(!retry)}>
          Retry, waiting longer
        </Toggle>
        <Toggle on={jobId} onClick={() => setJobId(!jobId)}>
          Job ID
        </Toggle>
        <button type="button" className="bw-lesson__toggle aw-retry__go" onClick={() => setSeed((s) => s + 1)}>
          New jobs
        </button>
      </div>

      <ol className="aw-retry__jobs" key={`${seed}-${retry}-${jobId}-${rate}`}>
        {jobs.map((j, i) => (
          <li key={i} className={j.copies === 0 ? 'is-lost' : j.copies > 1 ? 'is-dup' : 'is-once'} style={{ '--i': i }}>
            <span className="aw-retry__n" aria-hidden="true">
              {i + 1}
            </span>
            <span className="aw-retry__marks" aria-hidden="true">
              {j.marks.map((m, k) => (
                <i key={k} className={`is-${m}`} />
              ))}
            </span>
            <b aria-hidden="true">{j.copies === 0 ? 'lost' : j.copies > 1 ? `${j.copies} copies` : 'saved'}</b>
            <span className="sr-only">
              {`Job ${i + 1}: ${j.marks.map((m) => MARK[m]).join(', ')}; ${j.copies === 0 ? 'lost' : `${j.copies} saved`}.`}
            </span>
          </li>
        ))}
      </ol>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {once} saved once, {dup} saved twice or more, {lost} lost{told ? `; ${told} flagged to a person` : ''}.
        </strong>{' '}
        {why}
      </p>
    </div>
  );
}

export function Backoff() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        WAIT, THEN TRY AGAIN
      </text>
      {WAITS.map((s, i) => (
        <g key={s} transform={`translate(28 ${72 + i * 46})`}>
          <rect width={40 + s * 52} height="28" rx="14" className="bw-f-orange" />
          <text x={52 + s * 52} y="21" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="700">
            {s} s
          </text>
        </g>
      ))}
      <text x="28" y="234" className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="600">
        Then a person is told.
      </text>
      <text x="28" y="282" className="bw-f-cream" {...META}>
        EACH WAIT DOUBLES
      </text>
    </svg>
  );
}

/* ---- 05 Privacy: what leaves your server ---- */

const SAMPLE =
  "Hi, it's Jordan Lee. I was charged twice on 4242 4242 4242 4242. Call me at (555) 013-4477 or write to jordan.lee@example.com.";

// A card number is 13 to 19 digits that pass the Luhn check.
const luhn = (digits) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let d = +digits[digits.length - 1 - i];
    if (i % 2) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
};
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Every span to keep back, in priority order; a later kind never overlaps
// an earlier one. The name comes from the contact's record, not a guess.
function findPrivate(text, name) {
  const found = [];
  const add = (type, re, ok = () => true) => {
    for (const m of text.matchAll(re)) {
      const a = m.index;
      const b = a + m[0].length;
      if (ok(m[0]) && !found.some((f) => a < f.b && b > f.a)) found.push({ type, a, b });
    }
  };
  add('EMAIL', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g);
  add('CARD', /\b\d(?:[ -]?\d){12,18}\b/g, (s) => luhn(s.replace(/\D/g, '')));
  add('PHONE', /(?:\+?1[ .-]?)?\(?\b\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}\b/g);
  name
    .split(/\s+/)
    .filter((p) => p.length > 1)
    .forEach((p) => add('NAME', new RegExp(`\\b${esc(p)}\\b`, 'gi')));
  return found.sort((x, y) => x.a - y.a);
}

function maskParts(text, spans, on) {
  const out = [];
  let at = 0;
  spans.forEach((s, i) => {
    if (s.a > at) out.push(text.slice(at, s.a));
    out.push(
      on ? (
        <mark key={i} className="is-token">
          [{s.type}]
        </mark>
      ) : (
        <mark key={i}>{text.slice(s.a, s.b)}</mark>
      ),
    );
    at = s.b;
  });
  out.push(text.slice(at));
  return out;
}

export function Masking() {
  const id = useId();
  const [text, setText] = useState(SAMPLE);
  const [name, setName] = useState('Jordan Lee');
  const [on, setOn] = useState(true);
  const spans = findPrivate(text, name);
  const kinds = [...new Set(spans.map((s) => s.type.toLowerCase()))];

  return (
    <div className="bw-lesson bw-lesson--dark aw-mask">
      <div className="bw-lesson__bar">
        <label className="aw-mask__name">
          <span className="bw-ui__lab">Name on the record</span>
          <input type="text" value={name} maxLength={40} autoComplete="off" onChange={(e) => setName(e.target.value)} />
        </label>
        <Toggle on={on} onClick={() => setOn(!on)}>
          Mask before sending
        </Toggle>
      </div>

      <div className="aw-mask__panes">
        <div className="aw-mask__pane">
          <label className="bw-ui__lab" htmlFor={`${id}-t`}>
            On your server
          </label>
          <textarea id={`${id}-t`} value={text} rows={5} maxLength={400} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className={`aw-mask__pane aw-mask__pane--out${on ? '' : ' is-raw'}`}>
          <p className="bw-ui__lab">Sent to the model</p>
          <p className="aw-mask__out">{maskParts(text, spans, on)}</p>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {on
            ? `${plural(spans.length, 'item')} kept on your server${kinds.length ? `: ${kinds.join(', ')}` : ''}.`
            : `${plural(spans.length, 'item')} sent as written.`}
        </strong>{' '}
        {on ? 'The answer comes back with the same tags, and they are filled in on your server.' : 'Everything in the message leaves your server.'}
      </p>
    </div>
  );
}

export function WhatLeaves() {
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect width="400" height="300" className="bw-f-ink" />
      <text x="28" y="44" className="bw-f-cream" {...META} opacity="0.7">
        STAYS ON YOUR SERVER
      </text>
      {['Names and emails', 'Phone and card numbers', 'The full log'].map((s, i) => (
        <text key={s} x="28" y={80 + i * 30} className="bw-f-cream" fontFamily={INTER} fontSize="20" fontWeight="600">
          {s}
        </text>
      ))}
      <text x="28" y="188" className="bw-f-cream" {...META} opacity="0.7">
        LEAVES IT
      </text>
      <text x="28" y="224" className="bw-f-orange" fontFamily={INTER} fontSize="22" fontWeight="800">
        The masked text
      </text>
      <text x="28" y="282" className="bw-f-cream" {...META}>
        ONLY WHAT THE JOB NEEDS
      </text>
    </svg>
  );
}
