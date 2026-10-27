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

   One business, "Your business", on four screens at once: what lands in
   the owner's inbox, the contact in the CRM, a phone and the flow itself
   on a laptop. Each kind is drawn the way it really behaves there (a
   workflow runs the same three steps every time, follow-ups stop when the
   lead replies, an AI step tags and sums up, an assistant names the page
   it answered from and hands over what it cannot answer, an agent uses
   tools and writes down each step), and the log says what each kind does
   well and where it stops. The SSR markup is the rest state (the
   workflow) and is complete; entrances are CSS keyframes from first
   paint. CSS owns every color, the draw-in and which kind shows; GSAP
   writes only the drift. */

// Log lines stay at about 37 characters: beside the drawing each is one
// line with an ellipsis, and a cut line loses its point.
const KINDS = [
  {
    key: 'flow',
    name: 'Workflow',
    url: 'flows.yourbusiness.com/new-lead',
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
    url: 'flows.yourbusiness.com/follow-ups',
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
    url: 'flows.yourbusiness.com/sort-inbox',
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
    url: 'yourbusiness.com',
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
    url: 'flows.yourbusiness.com/booking',
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

/* The laptop: the flow itself, 760 x 520 under the address bar. */
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
      <T x={36} y={48} size={22} w={700}>
        Your business
      </T>
      <T x={530} y={46} size={20} w={500}>
        Prices
      </T>
      <T x={612} y={46} size={20} w={500}>
        Contact
      </T>
      <L x1={0} y1={78} x2={760} y2={78} />
      <B x={36} y={110} w={330} h={30} r={8} />
      <B x={36} y={152} w={260} h={30} r={8} />
      <B x={36} y={208} w={320} h={14} r={7} />
      <B x={36} y={234} w={270} h={14} r={7} />
      <B x={36} y={280} w={330} h={200} r={18} />
      <B x={404} y={100} w={320} h={404} r={22} />
      <T x={428} y={138} size={18} w={700}>
        Ask Your business
      </T>
      <L x1={404} y1={158} x2={724} y2={158} />
      <B x={520} y={176} w={184} h={48} r={18} />
      <T x={536} y={207} size={16} w={500}>
        Do you deliver?
      </T>
      <A x={428} y={240} w={250} h={84} r={18} />
      <T x={446} y={275} size={16} w={600} on>
        Yes, within 25 miles,
      </T>
      <T x={446} y={301} size={16} w={600} on>
        Monday to Saturday.
      </T>
      <B x={428} y={338} w={170} h={34} r={17} />
      <T x={446} y={361} size={15} w={600}>
        From: Delivery
      </T>
      <B x={428} y={440} w={272} h={44} r={22} />
      <T x={450} y={468} size={16} w={500}>
        Ask a question
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

/* The phone's screen, 194 x 412 under the speaker. */
const PHONE = {
  flow: () => (
    <>
      <T x={14} y={28} size={15} w={700}>
        Team chat
      </T>
      <L x1={0} y1={46} x2={194} y2={46} />
      <T x={14} y={78} size={13} w={500}>
        Your flow
      </T>
      <A x={14} y={90} w={170} h={100} r={16} />
      <T x={28} y={120} size={14} w={600} on>
        New lead from
      </T>
      <T x={28} y={142} size={14} w={600} on>
        the site form.
      </T>
      <T x={28} y={170} size={14} w={600} on>
        Wants a quote.
      </T>
      <T x={14} y={212} size={12} w={500}>
        now
      </T>
      <B x={14} y={356} w={166} h={40} r={20} />
    </>
  ),
  sequence: () => (
    <>
      <T x={14} y={28} size={15} w={700}>
        Inbox
      </T>
      <L x1={0} y1={46} x2={194} y2={46} />
      <B x={14} y={60} w={166} h={60} r={12} />
      <T x={26} y={85} size={13} w={700}>
        Your quote
      </T>
      <T x={26} y={106} size={12} w={500}>
        Day 0
      </T>
      <B x={14} y={132} w={166} h={60} r={12} />
      <T x={26} y={157} size={13} w={700}>
        Any questions?
      </T>
      <T x={26} y={178} size={12} w={500}>
        Day 2
      </T>
      <A x={14} y={204} w={166} h={60} r={12} />
      <T x={26} y={229} size={13} w={700} on>
        You replied
      </T>
      <T x={26} y={250} size={12} w={500} on>
        Day 3
      </T>
      <T x={14} y={300} size={12} w={500}>
        Day 7 note: not sent.
      </T>
    </>
  ),
  step: () => (
    <>
      <T x={14} y={28} size={15} w={700}>
        Team chat
      </T>
      <L x1={0} y1={46} x2={194} y2={46} />
      <T x={14} y={78} size={13} w={500}>
        #sales
      </T>
      <A x={14} y={90} w={78} h={30} r={15} label="Quote" size={14} />
      <A x={100} y={90} w={80} h={30} r={15} label="Urgent" size={14} />
      <T x={14} y={152} size={15} w={700}>
        Your lead
      </T>
      <T x={14} y={178} size={13} w={400}>
        Needs a price by
      </T>
      <T x={14} y={198} size={13} w={400}>
        Friday. Asked twice.
      </T>
      <B x={14} y={220} w={120} h={10} r={5} />
      <B x={14} y={356} w={166} h={40} r={20} />
    </>
  ),
  assistant: () => (
    <>
      <T x={14} y={28} size={15} w={700}>
        Your business
      </T>
      <L x1={0} y1={46} x2={194} y2={46} />
      <B x={44} y={62} w={136} h={58} r={16} />
      <T x={56} y={86} size={13} w={500}>
        Do you deliver
      </T>
      <T x={56} y={106} size={13} w={500}>
        on Sundays?
      </T>
      <A x={14} y={134} w={156} h={78} r={16} />
      <T x={26} y={164} size={13} w={600} on>
        No: Monday to
      </T>
      <T x={26} y={184} size={13} w={600} on>
        Saturday only.
      </T>
      <B x={14} y={224} w={124} h={28} r={14} />
      <T x={26} y={243} size={11} w={600}>
        From: Delivery
      </T>
      <B x={14} y={356} w={166} h={40} r={20} />
      <T x={30} y={381} size={13} w={500}>
        Ask a question
      </T>
    </>
  ),
  agent: () => (
    <>
      <T x={14} y={28} size={15} w={700}>
        Messages
      </T>
      <L x1={0} y1={46} x2={194} y2={46} />
      <T x={14} y={78} size={13} w={500}>
        Your business
      </T>
      <A x={14} y={90} w={170} h={100} r={16} />
      <T x={28} y={120} size={14} w={600} on>
        You&apos;re booked:
      </T>
      <T x={28} y={144} size={18} w={800} on>
        Tue 10:30
      </T>
      <T x={28} y={172} size={13} w={500} on>
        Reply to move it.
      </T>
      <T x={14} y={212} size={12} w={500}>
        now
      </T>
      <B x={14} y={228} w={166} h={44} r={22} />
      <T x={97} y={255} size={14} w={700} anchor="middle">
        Add to calendar
      </T>
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

// The screens, smallest first: the order the kinds draw in (`--d`) and
// the order the entrance runs. Captions sit in the Web hero's zones (the
// screens share its frames), short, because the type floors at 12px while
// the drawing shrinks.
const TOUCH = ['notice', 'crm', 'phone', 'desk'];
const DRIFT = { notice: 1.4, crm: 1.2, phone: 1.3, desk: 0.6 };
const CAPS = [
  { key: 'crm', l: 2.5, t: 36.5, w: 28.75, text: ['CRM.', 'Every lead and reply, written down.'] },
  { key: 'notice', l: 2.5, t: 63.5, w: 28.75, text: ['Inbox.', 'What it tells you, and what it hands you.'] },
  { key: 'desk', l: 35, t: 73.5, w: 30, text: ['The flow.', 'Each step it runs, in order.'] },
  { key: 'phone', l: 83.75, t: 83.5, w: 14.5, text: ['Phone.', 'Where it reaches people.'] },
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
                {/* The laptop: the flow under its address bar, on a base. */}
                <g data-p="drift-desk">
                  <g {...tp('desk')}>
                    <path className="aw-hero__frm" d={rr(560, 60, 760, 580, 28)} />
                    <path className="aw-hero__thin" d="M560 120H1320" />
                    {[594, 620, 646].map((cx) => (
                      <circle key={cx} className="aw-hero__thin" cx={cx} cy="90" r="7" />
                    ))}
                    <path className="aw-hero__thin" d={rr(690, 74, 470, 32, 16)} />
                    {KINDS.map((x) => (
                      <text key={x.key} className={`aw-hero__url aw-v aw-v--${x.key}`} x="712" y="97" fontSize="19" fontWeight="500">
                        {x.url}
                      </text>
                    ))}
                    <Kinds art={DESK} x={560} y={120} />
                    <path className="aw-hero__frm" d={rr(496, 648, 888, 30, 15)} />
                  </g>
                </g>

                {/* The phone, in front of the laptop's corner. */}
                <g data-p="drift-phone">
                  <g {...tp('phone')}>
                    <path className="aw-hero__frm" d={rr(1340, 300, 230, 480, 40)} />
                    <path className="aw-hero__thin" d="M1430 324H1480" />
                    <Kinds art={PHONE} x={1358} y={350} />
                  </g>
                </g>

                {/* The CRM, under its filter. */}
                <g data-p="drift-crm">
                  <g {...tp('crm')}>
                    <path className="aw-hero__frm" d={rr(40, 60, 460, 270, 24)} />
                    <path className="aw-hero__thin" d={rr(64, 84, 412, 48, 24)} />
                    <path className="aw-hero__thin" d={`${ring(94, 106, 10)}M101 113L110 122`} />
                    <Kinds art={CRM} x={64} y={150} />
                  </g>
                </g>

                {/* The inbox: what the automation tells you. */}
                <g data-p="drift-notice">
                  <g {...tp('notice')}>
                    <path className="aw-hero__frm" d={rr(40, 450, 460, 140, 24)} />
                    <text className="aw-hero__now" x="476" y="486" fontSize="15" textAnchor="end">
                      now
                    </text>
                    <Kinds art={NOTICE} x={64} y={474} />
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
