import { Link } from 'react-router-dom';
import kindsParts, { INTER, rr, ring } from '../worlds/kindsParts';
import useKindsHero from '../worlds/useKindsHero';

/* The AI world's hero (2026-10-27, owner: "match the content of
   'services/ai-automation' in the same way we did for 'graphic design' and
   'web development'"), the Web hero's sibling: that one runs the five kinds
   of build, this one the five kinds of automation the service sells, from
   rules to judgment (workflow, follow-ups, AI step, assistant, agent). The
   frame, copy, captions, log and Pause are the shared `world-hero`; the
   engine (worlds/useKindsHero.js), the drawing parts (worlds/kindsParts.js)
   and the draw-in (`kinds-hero`) are the Web hero's, so the two behave
   alike. It replaces the workbench (2026-10-23), which ran one machine;
   this runs the five kinds and says where each stops.

   One business, "Your business", on a flow canvas (2026-10-27, owner:
   "all three services, hero, looking pretty much the same ... we need to
   get a little bit of diversity"): no laptop and no phone, which are the
   Web hero's language; the flow itself fills a dotted canvas and wires
   carry its output to two nodes, the contact in the CRM and what lands in
   the owner's inbox. Each kind is drawn the way it really behaves (a
   workflow runs the same three steps every time, follow-ups stop when the
   lead replies, an AI step tags and sums up, an assistant answers from
   your notes or hands over, an agent uses tools and writes down each
   step), and the log says what each kind does well and where it stops.
   The SSR markup is the rest state (the workflow) and is complete;
   entrances are CSS keyframes from first paint. CSS owns every color, the
   draw-in, the wires' flow (only while live, so Pause stops it) and which
   kind shows; GSAP writes only the drift. */

// Log lines stay at about 37 characters: beside the drawing each is one
// line with an ellipsis, and a cut line loses its point.
const KINDS = [
  {
    key: 'flow',
    name: 'Workflow',
    lines: [
      ['kind', 'workflow: when this, then that'],
      ['crm', 'every lead lands in the CRM'],
      ['phone', 'the team gets a text at once'],
      ['limit', 'it follows rules; it cannot judge'],
    ],
  },
  {
    key: 'sequence',
    name: 'Follow-ups',
    lines: [
      ['kind', 'follow-ups: emails on a schedule'],
      ['phone', 'day 0, day 2, day 7, then it stops'],
      ['crm', 'a reply stops the rest at once'],
      ['limit', 'the same words for everyone'],
    ],
  },
  {
    key: 'step',
    name: 'AI step',
    lines: [
      ['kind', 'AI step: one model call in a flow'],
      ['inbox', 'it tags each email and sums it up'],
      ['crm', 'the summary lands on the contact'],
      ['limit', 'it can mislabel; we read samples'],
    ],
  },
  {
    key: 'assistant',
    name: 'Assistant',
    lines: [
      ['kind', 'assistant: answers from your docs'],
      ['phone', 'it names the page it answered from'],
      ['inbox', "what it can't answer comes to you"],
      ['limit', 'it knows only what you gave it'],
    ],
  },
  {
    key: 'agent',
    name: 'Agent',
    lines: [
      ['kind', 'agent: plans steps and uses tools'],
      ['flow', 'reads, checks the calendar, books'],
      ['crm', 'it writes down every step it took'],
      ['limit', 'it acts, so it gets limits and a log'],
    ],
  },
];

/* ---- Drawing parts (worlds/kindsParts.js) ---- */

const { D, B, L, O, A, T, Kinds } = kindsParts('aw', KINDS);

// A step in the flow: an outlined box (or an accent plate) with its name
// and, under it, what runs it.
const Node = ({ x, y, w = 190, h = 100, label, sub, a }) => (
  <>
    {a ? <A x={x} y={y} w={w} h={h} r={20} /> : <B x={x} y={y} w={w} h={h} r={20} />}
    <T x={x + 20} y={y + h / 2 - 2} size={21} w={700} on={a}>
      {label}
    </T>
    {sub && (
      <T x={x + 20} y={y + h / 2 + 24} size={16} w={500} on={a}>
        {sub}
      </T>
    )}
  </>
);
// A wire with its arrowhead, left to right.
const Wire = ({ x1, x2, y }) => <D d={`M${x1} ${y}H${x2}M${x2 - 11} ${y - 8}L${x2} ${y}L${x2 - 11} ${y + 8}`} />;
const Env = ({ x, y, w = 84, h = 60 }) => <D d={`${rr(x, y, w, h, 10)}M${x + 8} ${y + 10}L${x + w / 2} ${y + h * 0.55}L${x + w - 8} ${y + 10}`} />;
// The flow's name and its switch, over the canvas.
const Head = ({ name, state = 'Active' }) => (
  <>
    <T x={36} y={48} size={22} w={700}>
      {name}
    </T>
    <A x={596} y={18} w={128} h={40} r={20} label={state} size={17} />
    <L x1={0} y1={78} x2={760} y2={78} />
  </>
);
// One run of the workflow: trigger, two steps, done; the same every time.
const runRow = (y) => `${ring(48, y, 8)}M56 ${y}H112${ring(120, y, 8)}M128 ${y}H184${ring(192, y, 8)}`;

/* The canvas: the flow itself, 760 x 520, drawn at 1.12. */
const DESK = {
  flow: () => (
    <>
      <Head name="New lead" />
      <Node x={36} y={150} label="Form sent" sub="Trigger" a />
      <Wire x1={226} x2={284} y={200} />
      <Node x={284} y={150} label="Add to CRM" sub="Your CRM" />
      <Wire x1={474} x2={534} y={200} />
      <Node x={534} y={150} label="Text the team" sub="SMS" />
      <T x={36} y={352} size={18} w={700}>
        Runs
      </T>
      <D d={runRow(392)} />
      <B x={226} y={386} w={498} h={12} r={6} />
      <D d={runRow(432)} />
      <B x={226} y={426} w={498} h={12} r={6} />
      <D d={runRow(472)} />
      <B x={226} y={466} w={498} h={12} r={6} />
    </>
  ),
  sequence: () => (
    <>
      <Head name="Follow-ups" />
      <A x={36} y={108} w={200} h={56} r={28} label="Quote sent" size={19} />
      <D d="M136 164V214" />
      <Env x={94} y={214} />
      <Wire x1={178} x2={338} y={244} />
      <Env x={338} y={214} />
      <Wire x1={422} x2={582} y={244} />
      <Env x={582} y={214} />
      <T x={258} y={226} size={16} w={500} anchor="middle">
        wait 2 days
      </T>
      <T x={502} y={226} size={16} w={500} anchor="middle">
        wait 5 days
      </T>
      <T x={136} y={308} size={18} w={700} anchor="middle">
        Day 0
      </T>
      <T x={380} y={308} size={18} w={700} anchor="middle">
        Day 2
      </T>
      <T x={624} y={308} size={18} w={700} anchor="middle">
        Day 7
      </T>
      <D a d="M380 326V384" />
      <A x={240} y={384} w={280} h={56} r={28} label="A reply stops the rest" size={18} />
    </>
  ),
  step: () => (
    <>
      <Head name="Sort the inbox" />
      <Node x={36} y={186} w={170} label="Email in" sub="Trigger" />
      <Wire x1={206} x2={262} y={236} />
      <Node x={262} y={166} w={200} h={140} label="AI step" sub="Read, tag, sum up" a />
      <D d="M462 236C500 236 500 146 540 146" />
      <D d="M462 236H540" />
      <D d="M462 236C500 236 500 326 540 326" />
      <B x={540} y={116} w={184} h={60} r={16} />
      <T x={558} y={153} size={18} w={600}>
        Quote: Sales
      </T>
      <B x={540} y={206} w={184} h={60} r={16} />
      <T x={558} y={243} size={18} w={600}>
        Help: Support
      </T>
      <B x={540} y={296} w={184} h={60} r={16} />
      <T x={558} y={333} size={18} w={600}>
        Other: You
      </T>
      <B x={36} y={420} w={688} h={64} r={16} />
      <T x={58} y={459} size={17} w={500}>
        Each email is read once, tagged and summed up.
      </T>
    </>
  ),
  assistant: () => (
    <>
      <Head name="Answer questions" />
      <Node x={36} y={150} w={170} label="Question" sub="Chat or email" />
      <Wire x1={206} x2={262} y={200} />
      <Node x={262} y={150} w={200} label="Find it" sub="In your notes" />
      <Wire x1={462} x2={534} y={200} />
      <Node x={534} y={150} label="Answer" sub="Names the page" a />
      <D d="M362 250V322M354 312L362 322L370 312" />
      <Node x={262} y={322} w={200} label="Not found" sub="Under the line" />
      <Wire x1={462} x2={534} y={372} />
      <Node x={534} y={322} label="Hand to you" sub="Your inbox" />
      <B x={36} y={452} w={688} h={52} r={16} />
      <T x={58} y={485} size={17} w={500}>
        It answers from your notes, or it hands over.
      </T>
    </>
  ),
  agent: () => (
    <>
      <Head name="Booking agent" state="Running" />
      <B x={36} y={112} w={200} h={64} r={16} />
      <T x={58} y={151} size={19} w={600}>
        Calendar
      </T>
      <B x={524} y={112} w={200} h={64} r={16} />
      <T x={546} y={151} size={19} w={600}>
        CRM
      </T>
      <B x={36} y={326} w={200} h={64} r={16} />
      <T x={58} y={365} size={19} w={600}>
        Email
      </T>
      <B x={524} y={326} w={200} h={64} r={16} />
      <T x={546} y={365} size={19} w={600}>
        Notes
      </T>
      <L x1={236} y1={150} x2={326} y2={210} />
      <L x1={524} y1={150} x2={434} y2={210} />
      <L x1={236} y1={354} x2={326} y2={296} />
      <L x1={524} y1={354} x2={434} y2={296} />
      <A x={316} y={189} w={128} h={128} r={64} label="Agent" size={22} />
      {['Read', 'Check', 'Book', 'Reply', 'Log'].map((s, i) => (
        <T key={s} x={36 + i * 140} y={460} size={18} w={600}>
          {s}
        </T>
      ))}
      <D a d="M36 478H664" />
    </>
  ),
};

/* The CRM: one contact, 412 x 160 under the filter bar (the filter sits
   above, in the bar). */
const Avatar = () => <D d={`${ring(22, 30, 22)}M8 46Q22 34 36 46`} />;
const CRM = {
  flow: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Leads · new
      </T>
      <Avatar />
      <T x={58} y={26} size={20} w={700}>
        Your lead
      </T>
      <T x={58} y={54} size={16} w={500}>
        Site form · just now
      </T>
      <A x={322} y={10} w={90} h={36} r={18} label="New" size={16} />
      <L x1={0} y1={84} x2={412} y2={84} />
      <B x={0} y={104} w={300} h={12} r={6} />
      <B x={0} y={128} w={220} h={12} r={6} />
    </>
  ),
  sequence: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Leads · following up
      </T>
      <Avatar />
      <T x={58} y={26} size={20} w={700}>
        Your lead
      </T>
      <T x={58} y={54} size={16} w={500}>
        Follow-up 2 of 3
      </T>
      <A x={296} y={10} w={116} h={36} r={18} label="Replied" size={16} />
      <L x1={0} y1={84} x2={412} y2={84} />
      <T x={0} y={120} size={17} w={500}>
        Follow-ups stopped on day 3.
      </T>
    </>
  ),
  step: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Leads · sorted
      </T>
      <Avatar />
      <T x={58} y={26} size={20} w={700}>
        Your lead
      </T>
      <A x={58} y={42} w={80} h={28} r={14} label="Quote" size={14} />
      <A x={146} y={42} w={84} h={28} r={14} label="Urgent" size={14} />
      <L x1={0} y1={84} x2={412} y2={84} />
      <T x={0} y={120} size={17} w={500}>
        Summary: needs a price by Friday.
      </T>
    </>
  ),
  assistant: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Leads · from chat
      </T>
      <Avatar />
      <T x={58} y={26} size={20} w={700}>
        Chat visitor
      </T>
      <T x={58} y={54} size={16} w={500}>
        Asked about delivery
      </T>
      <A x={322} y={10} w={90} h={36} r={18} label="Lead" size={16} />
      <L x1={0} y1={84} x2={412} y2={84} />
      <T x={0} y={120} size={17} w={500}>
        Left an email in the chat.
      </T>
    </>
  ),
  agent: () => (
    <>
      <T x={52} y={-34} size={20} w={500}>
        Leads · booked
      </T>
      <Avatar />
      <T x={58} y={26} size={20} w={700}>
        Your lead
      </T>
      <T x={58} y={54} size={16} w={500}>
        Booked Tue 10:30
      </T>
      <A x={296} y={10} w={116} h={36} r={18} label="Booked" size={16} />
      <L x1={0} y1={84} x2={412} y2={84} />
      <T x={0} y={120} size={17} w={500}>
        Reply sent, slot held, all logged.
      </T>
    </>
  ),
};

/* The inbox: one notification, 412 x 92 inside the card. */
const MAIL = 'M10 14H42V40H10ZM10 14L26 28L42 14';
const NOTICE = {
  flow: () => (
    <>
      <D d={MAIL} />
      <T x={64} y={26} size={20} w={700}>
        New lead
      </T>
      <T x={64} y={58} size={18} w={400}>
        In your CRM; the team was texted.
      </T>
    </>
  ),
  sequence: () => (
    <>
      <D d={MAIL} />
      <T x={64} y={26} size={20} w={700}>
        Your lead replied
      </T>
      <T x={64} y={58} size={18} w={400}>
        Their follow-ups stopped.
      </T>
    </>
  ),
  step: () => (
    <>
      <D a d="M10 14H30L44 28L30 42H10ZM18 28h0" />
      <T x={64} y={26} size={20} w={700}>
        Quote · urgent
      </T>
      <T x={64} y={58} size={18} w={400}>
        Needs a price by Friday.
      </T>
    </>
  ),
  assistant: () => (
    <>
      <D d={`${ring(26, 18, 9)}M10 44Q26 26 42 44`} />
      <T x={64} y={26} size={20} w={700}>
        Handed to you
      </T>
      <T x={64} y={58} size={18} w={400}>
        A question it could not answer.
      </T>
    </>
  ),
  agent: () => (
    <>
      <A x={6} y={8} w={40} h={38} r={8} />
      <T x={64} y={26} size={20} w={700}>
        Booked: Tuesday 10:30
      </T>
      <T x={64} y={58} size={18} w={400}>
        Read, checked, booked, replied.
      </T>
    </>
  ),
};

// The nodes, smallest first: the order the kinds draw in (`--d`) and the
// order the entrance runs. Captions sit in zones no wire or node crosses,
// short, because the type floors at 12px while the drawing shrinks.
const TOUCH = ['notice', 'crm', 'canvas'];
const DRIFT = { notice: 1.4, crm: 1.2, canvas: 0.5 };
const CAPS = [
  { key: 'canvas', l: 2.5, t: 74.5, w: 50, text: ['The flow.', 'Each step it runs, in order.'] },
  { key: 'crm', l: 68.75, t: 39.25, w: 28.75, text: ['CRM.', 'Every lead and reply, written down.'] },
  { key: 'notice', l: 68.75, t: 70.25, w: 28.75, text: ['Inbox.', 'What it tells you, and what it hands you.'] },
];

export default function AutomationHero() {
  const { rootRef, kind, log, hot, paused, announce, cls, pick, togglePause, hover, tp } = useKindsHero({
    p: 'aw',
    kinds: KINDS,
    touch: TOUCH,
    drift: DRIFT,
  });

  return (
    <section ref={rootRef} className={cls} aria-labelledby="aw-hero-title">
      <div className="aw-hero__frame">
        <div className="aw-hero__copy">
          <p className="aw-hero__kicker">AI &amp; automation</p>
          <h1 id="aw-hero-title" className="aw-hero__title">
            It works the night shift.
          </h1>
          <p className="aw-hero__lede">
            Workflows, follow-ups, AI steps, assistants and agents, built by engineers and wired into the tools you
            already pay for.<span className="aw-hero__hint"> Pick a kind to see where it shows up.</span>
          </p>
          <div className="aw-hero__ctas">
            <Link to="/contact" className="bw-cta aw-hero__cta">
              Start an automation
            </Link>
            <Link to="/pricing/ai-automation" className="aw-hero__more">
              <span className="aw-hero__wide">Packages and prices</span>
              <span className="aw-hero__narrow">Prices</span>
            </Link>
          </div>
        </div>

        <div className="aw-hero__bench">
          <div className="aw-hero__stage">
            <div className="aw-hero__plate">
              <p className="aw-hero__tag">
                <i aria-hidden="true" />
                Five kinds of automation
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false" fontFamily={INTER}>
                {/* The canvas's dot grid (inside the flow's group only, so no caption sits on dots) and the wires to its outputs. */}
                <defs>
                  <pattern id="aw-hero-dots" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle className="aw-hero__dot" cx="16" cy="16" r="2.2" />
                  </pattern>
                  <clipPath id="aw-hero-canvas">
                    <path d={rr(40, 40, 900, 660, 28)} />
                  </clipPath>
                </defs>
                <rect x="40" y="40" width="900" height="660" fill="url(#aw-hero-dots)" clipPath="url(#aw-hero-canvas)" />
                <path className="aw-hero__wire" d="M940 300C1020 300 1020 225 1100 225" />
                <path className="aw-hero__wire" d="M940 440C1020 440 1020 590 1100 590" />

                {/* The flow, on the canvas. */}
                <g data-p="drift-canvas">
                  <g {...tp('canvas')}>
                    <path className="aw-hero__grp" d={rr(40, 40, 900, 660, 28)} />
                    <g transform="translate(70 70) scale(1.12)">
                      <Kinds art={DESK} x={0} y={0} />
                    </g>
                    <path className="aw-hero__frm" d={ring(940, 300, 8)} />
                    <path className="aw-hero__frm" d={ring(940, 440, 8)} />
                  </g>
                </g>

                {/* The CRM, under its filter. */}
                <g data-p="drift-crm">
                  <g {...tp('crm')}>
                    <path className="aw-hero__frm" d={rr(1100, 90, 460, 270, 24)} />
                    <path className="aw-hero__thin" d={rr(1124, 114, 412, 48, 24)} />
                    <path className="aw-hero__thin" d={`${ring(1154, 136, 10)}M1161 143L1170 152`} />
                    <Kinds art={CRM} x={1124} y={180} />
                    <path className="aw-hero__frm" d={ring(1100, 225, 8)} />
                  </g>
                </g>

                {/* The inbox: what the automation tells you. */}
                <g data-p="drift-notice">
                  <g {...tp('notice')}>
                    <path className="aw-hero__frm" d={rr(1100, 520, 460, 140, 24)} />
                    <text className="aw-hero__now" x="1536" y="556" fontSize="15" textAnchor="end">
                      now
                    </text>
                    <Kinds art={NOTICE} x={1124} y={544} />
                    <path className="aw-hero__frm" d={ring(1100, 590, 8)} />
                  </g>
                </g>
              </svg>
            </div>

            <div className="aw-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`aw-hero__cap${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>

            <div className="aw-hero__picks" role="group" aria-label="Show a kind of automation">
              {KINDS.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  className={`aw-hero__pick${i === kind ? ' is-on' : ''}`}
                  aria-pressed={i === kind}
                  onClick={() => pick(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="aw-hero__logbox">
          <div className="aw-hero__meta">
            <span>The run log</span>
            <span className="aw-hero__count">
              {`Kind ${kind + 1} of ${KINDS.length}`}
              <button type="button" className="aw-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="aw-hero__log" aria-live={announce ? 'polite' : 'off'}>
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
