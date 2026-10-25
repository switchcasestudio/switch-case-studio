import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { f, q, qa } from '../servicePoster/usePosterEngine';

/* The Web world's hero (2026-10-24): the build, the AI workbench's
   sibling. One machine from a change to a live site: a commit, the build
   (blocks that assemble), the preview on a desktop AND a phone (the same
   blocks, three columns and one: responsive is the point), Deploy, and the
   uptime monitor that keeps watching. It runs:
   - Live: while on screen it ships a job every few seconds (a landing page
     section, a store update, an app release, a hotfix). The packet rides
     the arrows, the build assembles, the new section lights up on both
     screens, Deploy lands, the monitor beats. The deploy log under the
     headline gets four lines per job. Pause stops all of it (WCAG 2.2.2).
   - Reacting: the screens drift toward the pointer, hovering a part or its
     caption lights both, Deploy and the commit start a job, a screen
     click puts that screen in focus.
   The SSR markup is the rest state and is complete; entrances are CSS
   keyframes from first paint (the world-hero mixin). Under reduced motion
   nothing moves on its own and Deploy writes the log at once. Auto runs
   are not announced; pressed runs are. Colors: cream lines on black, one
   accent (orange), no glow (owner, 2026-10-24). */

const INTER = "Inter, 'Inter Fallback', sans-serif";
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const THIN = { ...S, strokeWidth: 5 };
const ORANGE = '#ff834a';
const AUTO_FIRST = 1700;
const AUTO_GAP = 3800;

// One job per kind: seconds after the commit, then the log line.
const JOBS = [
  {
    span: 52,
    lines: [
      [0, 'commit: new pricing section'],
      [41, 'build passed in 41 s'],
      [44, 'checked on phone and desktop'],
      [52, 'deployed, uptime check green'],
    ],
  },
  {
    span: 47,
    lines: [
      [0, 'commit: holiday prices in the store'],
      [36, 'build passed, checkout tested'],
      [40, 'checked on phone and desktop'],
      [47, 'deployed, cache cleared, logged'],
    ],
  },
  {
    span: 196,
    lines: [
      [0, 'commit: booking screen, mobile app'],
      [184, 'iOS and Android builds signed'],
      [190, 'tested on two phones'],
      [196, 'sent to App Store review, logged'],
    ],
  },
  {
    span: 50,
    lines: [
      [0, 'alert: contact form error on mobile'],
      [6, 'commit: one-line fix'],
      [44, 'build passed, form tested'],
      [50, 'deployed, uptime check green'],
    ],
  },
];

// Each caption sits in a zone no line crosses (viewBox 1600 x 960): above
// the commit, under the build blocks (above the lower arrow), right of the
// preview arrow under the phone, under Deploy, under the monitor. Short
// copy, because the type floors at 12px while the drawing shrinks.
const CAPS = [
  { key: 'commit', l: 3.75, t: 17, w: 20, text: ['Commit.', 'A change to your site or app, saved and reviewed.'] },
  { key: 'build', l: 25, t: 62.5, w: 28, text: ['Build.', 'Tested before anyone sees it.'] },
  { key: 'preview', l: 70.5, t: 52, w: 27.5, text: ['Preview.', 'Checked on a phone and a desktop.'] },
  { key: 'deploy', l: 56.25, t: 87.5, w: 30, text: ['Deploy.', 'One press ships it; one more rolls it back.'] },
  { key: 'live', l: 3.75, t: 87.5, w: 26, text: ['Live.', 'Watched after launch, by a person.'] },
];

const stamp = (s) => {
  const h = 9 + Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const place = (el, path, len) => {
  const pt = path.getPointAtLength(len);
  el.setAttribute('transform', `translate(${f(pt.x)} ${f(pt.y)})`);
};

// The page both screens show: a header, the new section (filled when the
// job reaches the preview), a side block and three cards on the desktop;
// the same blocks in one column on the phone.
function DesktopUi() {
  return (
    <g>
      <rect x="860" y="204" width="440" height="30" rx="8" {...THIN} />
      <rect className="ww-hero__new" x="860" y="250" width="270" height="110" rx="12" {...THIN} />
      <rect x="1146" y="250" width="154" height="110" rx="12" {...THIN} />
      {[860, 1010, 1160].map((x) => (
        <rect key={x} x={x} y="378" width="140" height="66" rx="10" {...THIN} />
      ))}
    </g>
  );
}

function PhoneUi() {
  return (
    <g>
      <rect x="1396" y="192" width="130" height="20" rx="6" {...THIN} />
      <rect className="ww-hero__new" x="1396" y="224" width="130" height="80" rx="10" {...THIN} />
      {[316, 366, 416].map((y) => (
        <rect key={y} x="1396" y={y} width="130" height="38" rx="8" {...THIN} />
      ))}
    </g>
  );
}

export default function BuildHero() {
  const rootRef = useRef(null);
  const engineRef = useRef(null);
  const [runs, setRuns] = useState(0);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState(null);
  const [hot, setHot] = useState(null);
  const [view, setView] = useState('desktop');
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState(false);

  // The engine: jobs, the schedule, visibility. Built once; everything it
  // reads lives in refs, everything it shows goes through state setters.
  useEffect(() => {
    const root = rootRef.current;
    const svg = root && root.querySelector('.ww-hero__stage svg');
    if (!svg) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const st = { busy: false, runs: 0, clock: 0, next: 0, timer: 0, tl: null, visible: false, paused: false };

    const canAuto = () => !reduced && st.visible && !st.paused && !document.hidden;
    const sync = () => setLive(!reduced && st.visible && !st.paused && !document.hidden);
    const push = (line) => setLog((l) => [...l, line].slice(-4));

    function schedule(delay) {
      clearTimeout(st.timer);
      if (!canAuto()) return;
      st.timer = setTimeout(() => runJob(st.next, false), delay);
    }

    function runJob(index, manual) {
      if (st.busy) return;
      clearTimeout(st.timer);
      const job = JOBS[index % JOBS.length];
      st.next = (index + 1) % JOBS.length;
      st.runs += 1;
      setRuns(st.runs);
      setAnnounce(manual);
      const base = st.clock;
      st.clock += job.span + 60;
      const lines = job.lines.map(([s, text]) => ({ at: stamp(base + s), text, id: `${st.runs}-${s}` }));
      if (reduced) {
        setLog((l) => [...l, ...lines].slice(-4));
        return;
      }
      st.busy = true;
      const pkt = q(svg, 'pkt');
      const trail = qa(svg, 'trail');
      const blocks = qa(svg, 'block');
      const ride = (key, duration) => {
        const path = q(svg, key);
        const len = path.getTotalLength();
        const o = { p: 0 };
        return gsap.to(o, {
          p: 1,
          duration,
          ease: 'power1.inOut',
          onUpdate: () => {
            place(pkt, path, o.p * len);
            trail.forEach((t, i) => place(t, path, Math.max(0, o.p * len - (i + 1) * 30)));
          },
        });
      };
      const tl = gsap.timeline({
        onComplete: () => {
          st.busy = false;
          st.tl = null;
          setPhase(null);
          schedule(AUTO_GAP);
        },
      });
      st.tl = tl;
      tl.call(
        () => {
          setPhase('commit');
          push(lines[0]);
        },
        null,
        0,
      );
      tl.set(pkt, { attr: { opacity: 1 } }, 0.3);
      trail.forEach((t, i) => tl.set(t, { attr: { opacity: [0.5, 0.28, 0.14][i] } }, 0.3));
      tl.add(ride('route-in', 0.5), 0.3);
      tl.call(() => setPhase('build'), null, 0.8);
      tl.fromTo(blocks, { x: -70 }, { x: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(1.6)' }, 0.8);
      tl.call(() => push(lines[1]), null, 1.35);
      tl.add(ride('route-up', 0.6), 1.4);
      tl.call(
        () => {
          setPhase('preview');
          push(lines[2]);
        },
        null,
        2.0,
      );
      tl.add(ride('route-down', 0.55), 2.35);
      tl.call(() => setPhase('deploy'), null, 2.9);
      tl.add(ride('route-out', 0.6), 3.1);
      tl.call(
        () => {
          setPhase('up');
          push(lines[3]);
        },
        null,
        3.7,
      );
      tl.set([pkt, ...trail], { attr: { opacity: 0 } }, 3.75);
      tl.to({}, { duration: 0.8 }, 3.75);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        st.visible = e.isIntersecting;
        sync();
        if (st.visible) schedule(st.runs ? AUTO_GAP / 2 : AUTO_FIRST);
        else clearTimeout(st.timer);
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    const onVis = () => {
      sync();
      if (document.hidden) clearTimeout(st.timer);
      else schedule(AUTO_GAP / 2);
    };
    document.addEventListener('visibilitychange', onVis);

    engineRef.current = {
      run: () => runJob(st.next, true),
      setPaused: (p) => {
        st.paused = p;
        sync();
        if (p) clearTimeout(st.timer);
        else schedule(600);
      },
    };

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(st.timer);
      if (st.tl) st.tl.kill();
      engineRef.current = null;
    };
  }, []);

  // The pointer: the two screens drift toward it, the phone a little more
  // (it is nearer). quickTo tweens settle and stop on their own, so nothing
  // ticks while the pointer is still or away. Fine pointers only.
  useEffect(() => {
    const root = rootRef.current;
    const stage = root && root.querySelector('.ww-hero__stage');
    const svg = stage && stage.querySelector('svg');
    if (!svg) return undefined;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;
    if (!ok) return undefined;
    const desk = q(svg, 'desk');
    const phone = q(svg, 'phone');
    const dx = gsap.quickTo(desk, 'x', { duration: 0.6, ease: 'power3' });
    const dy = gsap.quickTo(desk, 'y', { duration: 0.6, ease: 'power3' });
    const px = gsap.quickTo(phone, 'x', { duration: 0.6, ease: 'power3' });
    const py = gsap.quickTo(phone, 'y', { duration: 0.6, ease: 'power3' });
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      dx(x * 14);
      dy(y * 10);
      px(x * 22);
      py(y * 16);
    };
    const onLeave = () => {
      dx(0);
      dy(0);
      px(0);
      py(0);
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([desk, phone]);
    };
  }, []);

  const run = () => engineRef.current && engineRef.current.run();
  const togglePause = () => {
    const p = !paused;
    setPaused(p);
    if (engineRef.current) engineRef.current.setPaused(p);
  };
  const hover = (key) => ({
    onPointerEnter: () => setHot(key),
    onPointerLeave: () => setHot(null),
  });

  const cls = ['ww-hero', `is-view-${view}`];
  if (live) cls.push('is-live');
  if (phase) cls.push(`is-${phase}`);
  if (hot) cls.push('is-hot', `is-hot-${hot}`);

  return (
    <section ref={rootRef} className={cls.join(' ')} aria-labelledby="ww-hero-title">
      <div className="ww-hero__frame">
        <div className="ww-hero__copy">
          <p className="ww-hero__kicker">Web &amp; mobile</p>
          <h1 id="ww-hero-title" className="ww-hero__title">
            Built to load fast. Kept running.
          </h1>
          <p className="ww-hero__lede">
            Sites, stores, web apps and iOS and Android apps, written by engineers and hosted by the same team. This build
            is running now: press Deploy, or click a part.
          </p>
          <div className="ww-hero__ctas">
            <Link to="/contact" className="bw-collage__cta ww-hero__cta">
              Start a project
            </Link>
            <Link to="/pricing/web-development" className="ww-hero__more">
              Packages and prices
            </Link>
          </div>
        </div>

        <div className="ww-hero__bench">
          <div className="ww-hero__stage">
            <div className="ww-hero__plate">
              <p className="ww-hero__tag">
                <i aria-hidden="true" />
                The build
              </p>
              <svg viewBox="0 0 1600 960" aria-hidden="true" focusable="false">
                <defs>
                  <clipPath id="ww-hero-clip">
                    <rect x="72" y="652" width="356" height="156" rx="18" />
                  </clipPath>
                </defs>

                {/* The commit: a solid block with the code mark. */}
                <g data-part="commit">
                  <rect className="ww-hero__commit" x="60" y="380" width="180" height="180" rx="36" {...S} />
                  <text
                    className="ww-hero__code"
                    x="150"
                    y="492"
                    textAnchor="middle"
                    fontFamily={MONO}
                    fontSize="64"
                    fontWeight="600"
                  >
                    {'</>'}
                  </text>
                </g>

                {/* The build: three blocks that slide into place per job. */}
                <g data-part="build">
                  {[360, 440, 520].map((y) => (
                    <rect key={y} data-p="block" className="ww-hero__block" x="400" y={y} width="200" height="60" rx="14" {...S} />
                  ))}
                </g>

                {/* The preview: the same page on a desktop and a phone. */}
                <g data-part="preview">
                  <g data-p="desk" className="ww-hero__desk">
                    <rect className="ww-hero__screen" x="830" y="130" width="500" height="340" rx="28" {...S} />
                    <path d="M830 182H1330" {...THIN} />
                    {[862, 888, 914].map((x) => (
                      <circle key={x} cx={x} cy="156" r="7" {...THIN} />
                    ))}
                    <DesktopUi />
                  </g>
                  <g data-p="phone" className="ww-hero__phone">
                    <rect className="ww-hero__screen" x="1376" y="150" width="170" height="330" rx="30" {...S} />
                    <path d="M1440 170H1482" {...THIN} />
                    <PhoneUi />
                  </g>
                </g>

                {/* The arrows, and the current that runs along them. */}
                <g className="ww-hero__arrows">
                  <path className="ww-hero__draw" pathLength="1" d="M255 470H372" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M342 440L372 470L342 500" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M620 430L812 316" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M772 316L812 316L792 351" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M1080 488V618" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M1050 588L1080 618L1110 588" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M885 730H458" {...S} />
                  <path className="ww-hero__draw" pathLength="1" d="M488 700L458 730L488 760" {...S} />
                </g>
                <g className="ww-hero__currents" fill="none" stroke={ORANGE} strokeWidth="5" strokeLinecap="round">
                  <path pathLength="1" d="M255 470H362" />
                  <path pathLength="1" d="M620 430L802 322" />
                  <path pathLength="1" d="M1080 488V608" />
                  <path pathLength="1" d="M885 730H468" />
                </g>

                {/* Deploy. */}
                <g data-part="deploy">
                  <rect className="ww-hero__pill" x="900" y="640" width="440" height="180" rx="90" {...S} />
                  <text
                    className="ww-hero__word"
                    x="1120"
                    y="762"
                    textAnchor="middle"
                    fontFamily={INTER}
                    fontSize="92"
                    fontWeight="500"
                    letterSpacing="-3"
                  >
                    Deploy
                  </text>
                </g>

                {/* Live: the monitor and its heartbeat. */}
                <g data-part="live">
                  <rect x="60" y="640" width="380" height="180" rx="28" {...S} />
                  <g clipPath="url(#ww-hero-clip)">
                    <path
                      className="ww-hero__beat"
                      d="M60 730H120L140 690L160 770L180 670L200 730H320L340 690L360 770L380 670L400 730H520L540 690L560 770L580 670L600 730H720"
                      {...THIN}
                    />
                  </g>
                  <circle className="ww-hero__status" cx="402" cy="674" r="11" />
                </g>

                {/* The job's routes (invisible), the packet and its trail. */}
                <path data-p="route-in" d="M240 470H400" fill="none" stroke="none" />
                <path data-p="route-up" d="M600 450L820 320L1080 300" fill="none" stroke="none" />
                <path data-p="route-down" d="M1080 300V640" fill="none" stroke="none" />
                <path data-p="route-out" d="M900 730H440" fill="none" stroke="none" />
                {[11, 8, 5].map((r) => (
                  <circle key={r} data-p="trail" r={r} fill={ORANGE} opacity="0" />
                ))}
                <circle data-p="pkt" r="16" fill={ORANGE} opacity="0" />

                {/* Hit areas: hover lights a part; the commit runs a job, a screen takes focus. */}
                <rect
                  className="ww-hero__hit ww-hero__hit--act"
                  x="40"
                  y="360"
                  width="220"
                  height="220"
                  fill="transparent"
                  {...hover('commit')}
                  onClick={run}
                />
                <rect className="ww-hero__hit" x="380" y="340" width="240" height="260" fill="transparent" {...hover('build')} />
                <rect
                  className="ww-hero__hit ww-hero__hit--act"
                  x="820"
                  y="120"
                  width="520"
                  height="360"
                  fill="transparent"
                  {...hover('preview')}
                  onClick={() => setView('desktop')}
                />
                <rect
                  className="ww-hero__hit ww-hero__hit--act"
                  x="1366"
                  y="140"
                  width="190"
                  height="350"
                  fill="transparent"
                  {...hover('preview')}
                  onClick={() => setView('phone')}
                />
                <rect className="ww-hero__hit" x="50" y="630" width="400" height="200" fill="transparent" {...hover('live')} />
              </svg>

              <button
                type="button"
                className="ww-hero__run"
                style={{ left: '56.25%', top: '66.6%', width: '27.5%', height: '18.75%' }}
                onClick={run}
                onFocus={() => setHot('deploy')}
                onBlur={() => setHot(null)}
                {...hover('deploy')}
                aria-label="Deploy one job through the build"
              />
            </div>

            <div className="ww-hero__caps">
              {CAPS.map((c, i) => (
                <p
                  key={c.key}
                  className={`ww-hero__cap ww-hero__cap--${c.key}${hot === c.key ? ' is-on' : ''}`}
                  style={{ left: `${c.l}%`, top: `${c.t}%`, width: `${c.w}%`, '--i': i }}
                  {...hover(c.key)}
                >
                  <strong>{c.text[0]}</strong> {c.text[1]}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="ww-hero__logbox">
          <div className="ww-hero__meta">
            <span>The deploy log</span>
            <span className="ww-hero__count">
              {runs ? `${runs} deploy${runs > 1 ? 's' : ''}` : 'No deploys yet'}
              <button type="button" className="ww-hero__pause" onClick={togglePause} aria-pressed={paused}>
                {paused ? 'Resume' : 'Pause'}
              </button>
            </span>
          </div>
          <ol className="ww-hero__log" aria-live={announce ? 'polite' : 'off'}>
            {log.length ? (
              log.map((l) => (
                <li key={l.id}>
                  <time>{l.at}</time>
                  <span>{l.text}</span>
                </li>
              ))
            ) : (
              <li>
                <time>09:00:00</time>
                <span>waiting for a commit</span>
              </li>
            )}
          </ol>
        </div>
      </div>
    </section>
  );
}
