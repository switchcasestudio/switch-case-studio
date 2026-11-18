import { Link } from 'react-router-dom';
import kindsParts, { INTER, rr, ring } from '../worlds/kindsParts';
import useKindsHero from '../worlds/useKindsHero';

/* The Content & Social Media world's hero (2026-11-18, owner: "build the
   new service in the exact formation, animation, rhythm, style the other
   services are in"), a kinds hero like the Web, AI and SEO worlds': the
   frame, copy, captions, log and Pause are the shared `world-hero`; the
   engine (worlds/useKindsHero.js), the drawing parts (worlds/kindsParts.js)
   and the draw-in (`kinds-hero`) are theirs, so all four behave alike. It
   runs the five kinds of content the service sells, from the one that
   waits to be found to the one that goes out (web page, article, email,
   social post, profile update).

   Its own composition (owner, 2026-10-27: the heroes must not look the
   same): an editor's desk. The draft is a sheet of notebook paper with a
   folded corner, and the work moves in an L: across to the calendar that
   says which day it goes out, then down to where it is published. No
   devices (the Web hero's language), no flow canvas (AI), no results page
   (SEO). The published card carries the engine's `notice` key, so it
   drops in the way the AI world's inbox does. Each kind's log says what
   it is for, how often it goes out, where it lands and where it stops.
   The SSR markup is the rest state (the web page) and is complete;
   entrances are CSS keyframes from first paint. CSS owns every color, the
   draw-in, the wires' flow (only while live, so Pause stops it) and which
   kind shows; GSAP writes only the drift. */

// Log lines stay at about 37 characters: beside the drawing each is one
// line with an ellipsis, and a cut line loses its point.
const KINDS = [
  {
    key: 'page',
    name: 'Web page',
    lines: [
      ['kind', 'web page: one promise, one action'],
      ['plan', 'written once, read again each quarter'],
      ['live', 'on your site the day you approve it'],
      ['limit', 'it waits for people to arrive'],
    ],
  },
  {
    key: 'article',
    name: 'Article',
    lines: [
      ['kind', 'article: answers one real question'],
      ['plan', 'two a month, every fact linked'],
      ['live', 'on your blog, then shared'],
      ['limit', 'it earns its readers slowly'],
    ],
  },
  {
    key: 'email',
    name: 'Email',
    lines: [
      ['kind', 'email: news for people who asked'],
      ['plan', 'one a month, one thing to do'],
      ['live', 'in the inbox, with a way out'],
      ['limit', 'it reaches only your own list'],
    ],
  },
  {
    key: 'post',
    name: 'Social post',
    lines: [
      ['kind', 'social post: one idea, one image'],
      ['plan', 'three a week, written in a batch'],
      ['live', 'posted by us on your account'],
      ['limit', 'the feed moves on within days'],
    ],
  },
  {
    key: 'profile',
    name: 'Profile update',
    lines: [
      ['kind', 'profile update: news on the map'],
      ['plan', 'one a week: hours, an offer, a photo'],
      ['live', 'on your Google Business Profile'],
      ['limit', 'it shows only to local searchers'],
    ],
  },
];

/* ---- Drawing parts (worlds/kindsParts.js) ---- */

const { D, B, L, O, A, T, Kinds } = kindsParts('cw', KINDS);

// The piece's name and where it stands, over the sheet.
const Head = ({ name, state }) => (
  <>
    <T x={36} y={48} size={22} w={700}>
      {name}
    </T>
    <A x={576} y={18} w={148} h={40} r={20} label={state} size={17} />
    <L x1={36} y1={78} x2={724} y2={78} />
  </>
);
// Lines of body copy: bars, the last one short.
const Body = ({ x = 36, y, widths }) =>
  widths.map((w, i) => <B key={i} x={x} y={y + i * 24} w={w} h={12} r={6} />);
// One of the page's three columns: a heading over two lines.
const Column = ({ x, label }) => (
  <>
    <B x={x} y={352} w={212} h={132} r={16} />
    <T x={x + 20} y={392} size={18} w={700}>
      {label}
    </T>
    <B x={x + 20} y={412} w={150} h={10} r={5} />
    <B x={x + 20} y={434} w={112} h={10} r={5} />
  </>
);

/* The draft: the piece itself, 760 x 520, drawn at 1.12. */
const SHEET = {
  page: () => (
    <>
      <Head name="Home page" state="Approved" />
      <T x={36} y={150} size={42} w={800}>
        Your promise, in one line.
      </T>
      <D a d="M36 172H330" />
      <Body y={200} widths={[520, 420]} />
      <A x={36} y={262} w={210} h={56} r={28} label="One action" size={19} />
      <Column x={36} label="What you get" />
      <Column x={274} label="The proof" />
      <Column x={512} label="The price" />
    </>
  ),
  article: () => (
    <>
      <Head name="Article" state="Sourced" />
      <T x={36} y={136} size={34} w={800}>
        What does it cost?
      </T>
      <T x={36} y={166} size={16} w={500}>
        By a named author · every fact linked
      </T>
      <Body y={196} widths={[688, 640, 560]} />
      <D a d="M36 284V350" />
      <T x={58} y={312} size={20} w={600}>
        A figure, with its source
      </T>
      <T x={58} y={340} size={16} w={500}>
        linked in the sentence that states it.
      </T>
      <T x={36} y={400} size={22} w={700}>
        The short answer
      </T>
      <Body y={422} widths={[688, 600, 420]} />
    </>
  ),
  email: () => (
    <>
      <Head name="Email" state="Tue 9:00" />
      <B x={36} y={104} w={688} h={60} r={16} />
      <T x={58} y={141} size={19} w={700}>
        Subject: Spring booking is open
      </T>
      <T x={36} y={212} size={20} w={600}>
        Hi there,
      </T>
      <Body y={236} widths={[640, 580, 420]} />
      <A x={36} y={326} w={220} h={56} r={28} label="Book a slot" size={19} />
      <L x1={36} y1={430} x2={724} y2={430} />
      <T x={36} y={468} size={16} w={500}>
        Your address · Unsubscribe in one tap
      </T>
    </>
  ),
  post: () => (
    <>
      <Head name="Social post" state="1 of 12" />
      <B x={36} y={104} w={330} h={330} r={20} />
      <D d="M36 372L140 262L220 342L270 292L366 392" />
      <O cx={290} cy={176} r={26} a />
      <O cx={420} cy={132} r={22} />
      <T x={456} y={128} size={19} w={700}>
        yourbusiness
      </T>
      <T x={456} y={152} size={15} w={500}>
        Your town
      </T>
      <T x={398} y={210} size={20} w={600}>
        The first line carries it.
      </T>
      <Body x={398} y={232} widths={[300, 240]} />
      <T x={398} y={318} size={17} w={600} a>
        #yourtown
      </T>
      <D d="M414 388C400 376 396 368 396 362A9 9 0 0 1 414 360A9 9 0 0 1 432 362C432 368 428 376 414 388Z" />
      <D d={`${rr(456, 356, 34, 28, 8)}M466 384L462 394L476 384`} />
      <D d="M514 386L544 358M544 358H526M544 358V376" />
      <O cx={186} cy={462} r={5} a />
      <O cx={201} cy={462} r={5} />
      <O cx={216} cy={462} r={5} />
    </>
  ),
  profile: () => (
    <>
      <Head name="Business profile" state="Update" />
      <B x={36} y={104} w={688} h={150} r={20} />
      <O cx={92} cy={160} r={30} />
      <T x={140} y={152} size={22} w={700}>
        Your business
      </T>
      <T x={140} y={180} size={16} w={500}>
        Open · closes 6 pm
      </T>
      <A x={140} y={198} w={110} h={40} r={20} label="Call" size={16} />
      <B x={262} y={198} w={150} h={40} r={20} />
      <T x={337} y={224} size={16} w={600} anchor="middle">
        Directions
      </T>
      <T x={36} y={300} size={18} w={700}>
        Updates
      </T>
      <B x={36} y={320} w={688} h={150} r={20} />
      <B x={56} y={340} w={150} h={110} r={12} />
      <D d="M56 424L100 384L140 414L170 394L206 434" />
      <T x={232} y={376} size={20} w={700}>
        New: spring hours
      </T>
      <T x={232} y={404} size={16} w={500}>
        Open Saturdays from March.
      </T>
    </>
  ),
};

/* The calendar: one week, 412 x 160 under its bar (the plan's name sits
   in the bar). The days it goes out are filled. */
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const Week = ({ plan, on, note }) => (
  <>
    <T x={52} y={-34} size={20} w={500}>
      {plan}
    </T>
    {DAYS.map((d, i) => (
      <T key={`d${i}`} x={26 + i * 60} y={12} size={16} w={600} anchor="middle">
        {d}
      </T>
    ))}
    {DAYS.map((_, i) =>
      on.includes(i) ? (
        <A key={`m${i}`} x={6 + i * 60} y={32} w={40} h={40} r={20} />
      ) : (
        <O key={`m${i}`} cx={26 + i * 60} cy={52} r={20} />
      ),
    )}
    <L x1={0} y1={96} x2={412} y2={96} />
    <T x={0} y={132} size={17} w={500}>
      {note}
    </T>
  </>
);
const WEEK = {
  page: () => <Week plan="Launch week" on={[0]} note="Monday: the page goes live." />,
  article: () => <Week plan="Two a month" on={[2]} note="Wednesday: published, then shared." />,
  email: () => <Week plan="One a month" on={[1]} note="Tuesday, 9:00: sent to your list." />,
  post: () => <Week plan="Three a week" on={[0, 2, 4]} note="Scheduled for the whole month." />,
  profile: () => <Week plan="One a week" on={[3]} note="Thursday: new on your profile." />,
};

/* Published: where the piece lands, 412 x 92 inside the card. */
const MAIL = 'M10 14H42V40H10ZM10 14L26 28L42 14';
const Landed = ({ icon, a, title, text }) => (
  <>
    <D a={a} d={icon} />
    <T x={64} y={26} size={20} w={700}>
      {title}
    </T>
    <T x={64} y={58} size={18} w={400}>
      {text}
    </T>
  </>
);
const NOTICE = {
  page: () => <Landed icon={`${rr(6, 8, 40, 34, 6)}M6 19H46`} title="On your site" text="Published, with a tagged link." />,
  article: () => (
    <Landed icon={`${rr(10, 6, 32, 40, 5)}M17 18H35M17 26H35M17 34H29`} title="On your blog" text="Linked from the home page." />
  ),
  email: () => <Landed icon={MAIL} title="In the inbox" text="Sent once, to people who asked." />,
  post: () => <Landed a icon={`${rr(8, 8, 36, 36, 9)}${ring(26, 26, 7)}`} title="On your feed" text="Posted by us, on your account." />,
  profile: () => (
    <Landed
      icon={`M26 44C26 44 12 30 12 20A14 14 0 0 1 40 20C40 30 26 44 26 44Z${ring(26, 20, 5)}`}
      title="On the map"
      text="Shown beside your listing."
    />
  ),
};

// The parts, smallest first: the order the kinds draw in (`--d`) and the
// order the entrance runs. Captions sit in zones no line crosses, short,
// because the type floors at 12px while the drawing shrinks.
const TOUCH = ['notice', 'week', 'draft'];
const DRIFT = { notice: 1.4, week: 1.2, draft: 0.5 };
const CAPS = [
  { key: 'draft', l: 2.5, t: 74.5, w: 50, text: ['The draft.', 'Each piece, written for one reader.'] },
  // The calendar's caption stops short of the wire that drops to the
  // published card (x 1500 of 1600), so no line runs under its words.
  { key: 'week', l: 68.75, t: 39.25, w: 22, text: ['The calendar.', 'What goes out, and on which day.'] },
  { key: 'notice', l: 68.75, t: 70.25, w: 28.75, text: ['Published.', 'Where it lands, posted by us.'] },
];

// The sheet: notebook paper with its top right corner folded down.
const SHEET_FRAME = 'M68 40H892L940 88V672A28 28 0 0 1 912 700H68A28 28 0 0 1 40 672V68A28 28 0 0 1 68 40Z';

export default function ContentHero() {
  const { rootRef, kind, log, hot, paused, announce, cls, pick, togglePause, hover, tp } = useKindsHero({
    p: 'cw',
    kinds: KINDS,
    touch: TOUCH,
    drift: DRIFT,
  });

  return (
    <section ref={rootRef} className={cls} aria-labelledby="cw-hero-title">
      <div className="cw-hero__frame">
        <div className="cw-hero__copy">
          <p className="cw-hero__kicker">Content &amp; social media</p>
          <h1 id="cw-hero-title" className="cw-hero__title">
            Words that get read.
          </h1>
          <p className="cw-hero__lede">
            Web pages, articles, emails, social posts and profile updates, planned on one calendar, then written,
            designed and posted by the studio.<span className="cw-hero__hint"> Pick a kind to see where it lands.</span>
          </p>
          <div className="cw-hero__ctas">
            <Link to="/contact" className="bw-cta cw-hero__cta">
              Start with a plan
            </Link>
            <Link to="/pricing/content-social-media" className="cw-hero__more">
              <span className="cw-hero__wide">Packages and prices</span>
              <span className="cw-hero__narrow">Prices</span>
            </Link>
          </div>
        </div>

        <div className="cw-hero__bench">
          <div className="cw-hero__stage">
            <div className="cw-hero__plate">
              <p className="cw-hero__tag">
                <i aria-hidden="true" />
                Five kinds of content
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false" fontFamily={INTER}>
                {/* The work's way: across to the calendar, down to where it is published. */}
                <path className="cw-hero__wire" d="M940 225H1100" />
                <path className="cw-hero__wire" d="M1500 360V520" />

                {/* The draft, on its sheet. */}
                <g data-p="drift-draft">
                  <g {...tp('draft')}>
                    <path className="cw-hero__frm" d={SHEET_FRAME} />
                    <path className="cw-hero__thin" d="M892 40V88H940" />
                    <path className="cw-hero__margin" d={`M92 40V700${ring(66, 170, 8)}${ring(66, 370, 8)}${ring(66, 570, 8)}`} />
                    <g transform="translate(70 70) scale(1.12)">
                      <Kinds art={SHEET} x={0} y={0} />
                    </g>
                    <path className="cw-hero__frm" d={ring(940, 225, 8)} />
                  </g>
                </g>

                {/* The calendar: the week it goes out. */}
                <g data-p="drift-week">
                  <g {...tp('week')}>
                    <path className="cw-hero__frm" d={rr(1100, 90, 460, 270, 24)} />
                    <path className="cw-hero__thin" d={rr(1124, 114, 412, 48, 24)} />
                    <path className="cw-hero__thin" d={`${rr(1142, 127, 24, 22, 4)}M1142 135H1166M1149 123V130M1159 123V130`} />
                    <Kinds art={WEEK} x={1124} y={180} />
                    <path className="cw-hero__frm" d={ring(1100, 225, 8)} />
                    <path className="cw-hero__frm" d={ring(1500, 360, 8)} />
                  </g>
                </g>

                {/* Published: where the piece lands. */}
                <g data-p="drift-notice">
                  <g {...tp('notice')}>
                    <path className="cw-hero__frm" d={rr(1100, 520, 460, 140, 24)} />
                    <text className="cw-hero__now" x="1536" y="566" fontSize="15" textAnchor="end">
                      live
                    </text>
                    <Kinds art={NOTICE} x={1124} y={544} />
                    <path className="cw-hero__frm" d={ring(1500, 520, 8)} />
                  </g>
                </g>
              </svg>
            </div>

            <div className="cw-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`cw-hero__cap${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>

            <div className="cw-hero__picks" role="group" aria-label="Show a kind of content">
              {KINDS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  className={`cw-hero__pick${i === kind ? ' is-on' : ''}`}
                  aria-pressed={i === kind}
                  onClick={() => pick(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cw-hero__logbox">
          <div className="cw-hero__meta">
            <span>The desk log</span>
            <span className="cw-hero__count">
              {`Kind ${kind + 1} of ${KINDS.length}`}
              <button type="button" className="cw-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="cw-hero__log" aria-live={announce ? 'polite' : 'off'}>
            {log.map((l) => (
              <li key={l.id}>
                <b>{l.tag}</b>
                <span>{l.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
