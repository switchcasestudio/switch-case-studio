import { useId, useState } from 'react';
import { Range, Plate } from '../worlds/lessonUi';

/* The lessons of the Content & Social Media world's stage (2026-11-18),
   the other worlds' "What we know" for words: one live demo per thing
   every piece has to get right, in the order a piece is made. 01 Plain
   words (the Automated Readability Index, a published formula that counts
   only letters, words and sentences, on the visitor's own paragraph), 02
   First line (where a line is cut, and what is left to read), 03 Proof
   (the words any competitor could use against the facts a reader can
   check), 04 Rhythm (posts, articles and emails laid on four weeks, added
   up to a year), 05 Measure (one page, a tagged link per channel, and
   what a report reads from it). Every figure is arithmetic on the
   visitor's input; nothing is a market statistic and no platform's limit
   is quoted. Nothing moves until the visitor does something. Each demo
   is a `bw-lesson` plate with the shared controls (worlds/lessonUi.js);
   the stickers are the shared fact plate. */

const plural = (v, one, many = `${one}s`) => `${v} ${v === 1 ? one : many}`;
const wordsOf = (s) => s.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || [];

// Two samples a demo switches between; the visitor can type over either.
const Samples = ({ label, items, value, onPick }) => (
  <div className="cw-chips" role="group" aria-label={label}>
    {items.map(([name, text]) => (
      <button
        key={name}
        type="button"
        className={`bw-lesson__chip${value === text ? ' is-on' : ''}`}
        aria-pressed={value === text}
        onClick={() => onPick(text)}
      >
        {name}
      </button>
    ))}
  </div>
);

/* ---- 01 Plain words: letters, words, sentences ---- */

const DENSE =
  'We leverage best-in-class methodologies to deliver innovative, customer-centric solutions that empower organizations to optimize operational efficiency, and our dedicated team of experienced professionals is committed to providing unparalleled service excellence across every engagement.';
const PLAIN = 'We fix leaking roofs. Most repairs take one day. You get the price before we start, and a photo of the finished work.';
const LONG = 20; // words; past this a sentence is marked

// The Automated Readability Index (1967): a US school grade from letters
// per word and words per sentence. No syllable guessing, so it is exact.
export function readability(text) {
  const sentences = (text.match(/[^.!?]+[.!?]*/g) || []).map(wordsOf).filter((w) => w.length);
  const words = sentences.flat();
  if (!words.length) return { sentences: [], words: 0, perSentence: 0, perWord: 0, grade: 0 };
  const letters = words.join('').replace(/[^A-Za-z0-9]/g, '').length;
  const perSentence = words.length / sentences.length;
  const perWord = letters / words.length;
  const grade = Math.max(1, Math.ceil(4.71 * perWord + 0.5 * perSentence - 21.43));
  return { sentences: sentences.map((w) => w.length), words: words.length, perSentence, perWord, grade };
}

export function PlainWords() {
  const id = useId();
  const [text, setText] = useState(DENSE);
  const r = readability(text);
  const longest = Math.max(0, ...r.sentences);
  const long = r.sentences.filter((n) => n > LONG).length;
  const grade = r.grade > 14 ? '14+' : r.grade;
  const one = (n) => n.toFixed(1).replace(/\.0$/, '');

  return (
    <div className="bw-lesson bw-lesson--light cw-read">
      <div className="bw-lesson__bar">
        <label className="bw-ui__lab" htmlFor={`${id}-t`}>
          Your paragraph
        </label>
        <Samples
          label="Paragraphs to try"
          items={[
            ['Dense', DENSE],
            ['Plain', PLAIN],
          ]}
          value={text}
          onPick={setText}
        />
      </div>
      <textarea id={`${id}-t`} className="cw-field cw-read__text" value={text} rows={4} maxLength={600} onChange={(e) => setText(e.target.value)} />

      <div className="cw-sum" aria-hidden="true">
        <p className={r.grade > 9 ? 'is-off' : ''}>
          <b>{r.words ? grade : 0}</b>
          <span>US school grade</span>
        </p>
        <p>
          <b>{one(r.perSentence)}</b>
          <span>words a sentence</span>
        </p>
        <p>
          <b>{one(r.perWord)}</b>
          <span>letters a word</span>
        </p>
      </div>

      <ol className="cw-read__bars" aria-label="Words in each sentence">
        {r.sentences.slice(0, 8).map((n, i) => (
          <li key={i} className={n > LONG ? 'is-long' : ''}>
            <i style={{ '--w': `${Math.min(1, n / 40) * 100}%` }} aria-hidden="true" />
            <b>{n}</b>
            <span className="sr-only"> words in sentence {i + 1}</span>
          </li>
        ))}
      </ol>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>{r.words ? `Grade ${grade}: ${one(r.perSentence)} words a sentence, ${one(r.perWord)} letters a word.` : 'Nothing to read yet.'}</strong>{' '}
        {r.words > 0 &&
          (long ? `Cut the ${longest}-word sentence in two and read it again.` : 'Short sentences and short words: it reads at a glance.')}
      </p>
    </div>
  );
}

export const PlainRules = () => (
  <Plate kicker="PLAIN WORDS" rows={['One idea a sentence', 'The short word first', 'Say who does what', 'Then read it aloud']} foot="FOR ONE READER" mark="number" />
);

/* ---- 02 First line: where it is cut ---- */

const LATE = 'After twelve years of serving families across the valley, we are thrilled to announce that spring booking is now open.';
const EARLY = 'Spring booking is open: reserve a slot by March 1. We have served families across the valley for twelve years.';

// The part of a line that shows in `n` characters, cut back to a whole word.
export function cutAt(text, n) {
  if (text.length <= n) return [text, ''];
  const head = text.slice(0, n);
  const at = /\s/.test(text[n]) ? n : head.lastIndexOf(' ');
  const shown = (at > 0 ? head.slice(0, at) : head).trimEnd();
  return [shown, text.slice(shown.length)];
}

export function FirstLine() {
  const id = useId();
  const [text, setText] = useState(LATE);
  const [n, setN] = useState(60);
  const [shown, rest] = cutAt(text, n);
  const seen = wordsOf(shown).length;
  const all = wordsOf(text).length;

  return (
    <div className="bw-lesson bw-lesson--dark cw-fold">
      <div className="bw-lesson__bar">
        <Range id={`${id}-n`} label="Characters shown" value={n} min={20} max={160} step={5} show={n} text={`${n} characters`} onChange={setN} />
        <Samples
          label="Lines to try"
          items={[
            ['Point last', LATE],
            ['Point first', EARLY],
          ]}
          value={text}
          onPick={setText}
        />
      </div>
      <div className="cw-fold__ask">
        <label className="bw-ui__lab" htmlFor={`${id}-t`}>
          Your first line
        </label>
        <input id={`${id}-t`} className="cw-field" type="text" value={text} maxLength={200} autoComplete="off" onChange={(e) => setText(e.target.value)} />
      </div>

      <div className="cw-fold__view">
        <p className="cw-fold__src">What a reader sees</p>
        <p className="cw-fold__line">
          <b>{shown}</b>
          {rest && (
            <>
              <span className="cw-fold__more" aria-hidden="true">
                … more
              </span>
              <span className="cw-fold__rest">{rest}</span>
            </>
          )}
        </p>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {n} characters: {seen} of {plural(all, 'word')} get read.
        </strong>{' '}
        {rest ? 'The rest waits behind a tap, so the point goes first.' : 'All of it shows.'}
      </p>
    </div>
  );
}

export const LineOrder = () => (
  <Plate kicker="THE FIRST LINE" rows={['The point', 'The proof', 'The action']} foot="IN THAT ORDER" mark="number" />
);

/* ---- 03 Proof: claims and facts ---- */

const CLAIMS = 'We are the leading provider of innovative, high-quality solutions, with a passionate team and world-class service.';
const FACTS = 'We have repaired 412 roofs since 2015. A repair takes 1 day and comes with a 10-year written warranty.';

// Praise any business can print about itself. A reader cannot check one.
const VAGUE = new Set(
  'best leading world-class innovative quality high-quality passionate unique trusted premier cutting-edge solutions seamless exceptional top-rated state-of-the-art unparalleled dedicated excellence best-in-class customer-centric amazing great premium'.split(
    ' ',
  ),
);

// Every word and number in the text, tagged: a figure is a fact a reader
// can check; a word from the list is a claim; the rest is plain text.
export function proofParts(text) {
  const parts = [];
  let at = 0;
  for (const m of text.matchAll(/\$?\d+(?:[.,]\d+)*%?|[A-Za-z][A-Za-z'’-]*/g)) {
    const type = /\d/.test(m[0]) ? 'fact' : VAGUE.has(m[0].toLowerCase()) ? 'claim' : null;
    if (!type) continue;
    if (m.index > at) parts.push({ text: text.slice(at, m.index) });
    parts.push({ text: m[0], type });
    at = m.index + m[0].length;
  }
  if (at < text.length) parts.push({ text: text.slice(at) });
  return parts;
}

export function Proof() {
  const id = useId();
  const [text, setText] = useState(CLAIMS);
  const parts = proofParts(text);
  const claims = parts.filter((p) => p.type === 'claim').length;
  const facts = parts.filter((p) => p.type === 'fact').length;

  return (
    <div className="bw-lesson bw-lesson--light cw-proof">
      <div className="bw-lesson__bar">
        <p className="bw-ui__lab cw-proof__lab">The same business, twice</p>
        <Samples
          label="Sentences to try"
          items={[
            ['Claims', CLAIMS],
            ['Facts', FACTS],
          ]}
          value={text}
          onPick={setText}
        />
      </div>

      <div className="cw-panes">
        <div className="cw-pane">
          <label className="bw-ui__lab" htmlFor={`${id}-t`}>
            What you wrote
          </label>
          <textarea id={`${id}-t`} className="cw-field" value={text} rows={5} maxLength={400} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="cw-pane">
          <p className="bw-ui__lab">What a reader can check</p>
          <p className="cw-proof__out">
            {parts.map((p, i) =>
              p.type ? (
                <mark key={i} className={`is-${p.type}`}>
                  {p.text}
                </mark>
              ) : (
                p.text
              ),
            )}
          </p>
        </div>
      </div>

      <div className="cw-sum cw-sum--two" aria-hidden="true">
        <p className="is-off">
          <b>{claims}</b>
          <span>words anyone could use</span>
        </p>
        <p className="is-good">
          <b>{facts}</b>
          <span>facts a reader can check</span>
        </p>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {plural(claims, 'claim')}, {plural(facts, 'fact')}.
        </strong>{' '}
        {claims > facts ? 'Swap a claim for a number, a name or a date.' : facts ? 'Each one is something a reader can verify.' : 'Add a number, a name or a date.'}
      </p>
    </div>
  );
}

export const ProofNeeds = () => (
  <Plate kicker="A CLAIM NEEDS" rows={['A number', 'A name', 'A date', 'A source']} foot="OR IT IS CUT" />
);

/* ---- 04 Rhythm: four weeks, then a year ---- */

// Which weekdays the posts go out on, Monday first, for 0 to 7 a week.
const POST_DAYS = [[], [2], [1, 3], [0, 2, 4], [0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6]];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
// `count` pieces over the 28 days: one a week on the weekday `shift` after
// Monday, or two a week (two days apart) once there are more than four.
const spread = (count, shift) =>
  Array.from({ length: count }, (_, k) => {
    const week = count > 4 ? Math.floor(k / 2) : Math.floor(((k + 0.5) * 4) / count);
    return Math.min(27, week * 7 + shift + (count > 4 ? (k % 2) * 2 : 0));
  });

export function Rhythm() {
  const id = useId();
  const [posts, setPosts] = useState(3);
  const [articles, setArticles] = useState(2);
  const [emails, setEmails] = useState(1);
  const four = posts * 4 + articles + emails;
  const year = posts * 52 + (articles + emails) * 12;
  const articleDays = spread(articles, 2);
  const emailDays = spread(emails, 1);

  return (
    <div className="bw-lesson bw-lesson--dark cw-rhythm">
      <div className="cw-rhythm__ctls">
        <Range id={`${id}-p`} label="Posts a week" value={posts} min={0} max={7} show={posts} text={plural(posts, 'post')} onChange={setPosts} />
        <Range id={`${id}-a`} label="Articles a month" value={articles} min={0} max={8} show={articles} text={plural(articles, 'article')} onChange={setArticles} />
        <Range id={`${id}-e`} label="Emails a month" value={emails} min={0} max={4} show={emails} text={plural(emails, 'email')} onChange={setEmails} />
      </div>

      <div className="cw-rhythm__body">
        <div className="cw-rhythm__cal" aria-hidden="true">
          <ol className="cw-rhythm__days">
            {DAYS.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ol>
          <ol className="cw-rhythm__grid">
            {Array.from({ length: 28 }, (_, i) => (
              <li key={i}>
                {POST_DAYS[posts].includes(i % 7) && <i className="is-post" />}
                {articleDays.includes(i) && <i className="is-article" />}
                {emailDays.includes(i) && <i className="is-email" />}
              </li>
            ))}
          </ol>
          <p className="cw-rhythm__key">
            <i className="is-post" /> post <i className="is-article" /> article <i className="is-email" /> email
          </p>
        </div>
        <div className="cw-sum cw-sum--stack" aria-hidden="true">
          <p>
            <b>{four}</b>
            <span>pieces in four weeks</span>
          </p>
          <p>
            <b>{year.toLocaleString('en-US')}</b>
            <span>pieces a year</span>
          </p>
        </div>
      </div>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>
          {posts} x 4 + {articles} + {emails} = {plural(four, 'piece')} in four weeks, {year.toLocaleString('en-US')} a year.
        </strong>{' '}
        {four ? 'Planned a month at a time, no day is filled the night before.' : 'An empty calendar: nothing goes out.'}
      </p>
    </div>
  );
}

export const OneBecomes = () => (
  <Plate kicker="ONE ARTICLE CAN BE" rows={['An email', 'Three posts', 'A profile update']} foot="WRITTEN ONCE" />
);

/* ---- 05 Measure: a tag on every link ---- */

const CHANNELS = [
  { key: 'instagram', name: 'Instagram', medium: 'social' },
  { key: 'newsletter', name: 'Email', medium: 'email' },
  { key: 'google', name: 'Business profile', medium: 'organic' },
];
const PAGE = 'yoursite.com/offer';
// A tag is lowercase letters, numbers and hyphens.
export const tagOf = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function Measure() {
  const id = useId();
  const [campaign, setCampaign] = useState('Spring sale');
  const [at, setAt] = useState(0);
  const ch = CHANNELS[at];
  const tag = tagOf(campaign);
  const rows = [
    ['utm_source', ch.key, 'Where from'],
    ['utm_medium', ch.medium, 'Which channel'],
    ...(tag ? [['utm_campaign', tag, 'Which campaign']] : []),
  ];

  return (
    <div className="bw-lesson bw-lesson--light cw-tag">
      <div className="bw-lesson__bar">
        <label className="cw-tag__name">
          <span className="bw-ui__lab">Campaign</span>
          <input className="cw-field" type="text" value={campaign} maxLength={40} autoComplete="off" onChange={(e) => setCampaign(e.target.value)} />
        </label>
        <div className="cw-chips" role="group" aria-label="Where the link is posted">
          {CHANNELS.map((c, i) => (
            <button key={c.key} type="button" className={`bw-lesson__chip${i === at ? ' is-on' : ''}`} aria-pressed={i === at} onClick={() => setAt(i)}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="cw-tag__link">
        <p className="bw-ui__lab">The link in the {ch.name === 'Email' ? 'email' : ch.name === 'Instagram' ? 'post' : 'update'}</p>
        <p className="cw-tag__url">
          {PAGE}
          {rows.map(([k, v], i) => (
            <span key={k}>
              {i ? '&' : '?'}
              {k}=<mark>{v}</mark>
            </span>
          ))}
        </p>
      </div>

      <dl className="cw-tag__reads">
        {rows.map(([k, v, label]) => (
          <div key={k}>
            <dt>{label}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <p className="bw-lesson__note" aria-live="polite">
        <strong>One page, {CHANNELS.length} links.</strong>{' '}
        {tag
          ? `This one tells the report the visit came from ${ch.name}, for ${tag}.`
          : 'Name the campaign, and the report can tell this month from the last.'}
      </p>
    </div>
  );
}

export const TagAnswers = () => (
  <Plate kicker="A TAG ANSWERS" rows={['Where from', 'Which channel', 'Which campaign']} foot="ON EVERY LINK" />
);
