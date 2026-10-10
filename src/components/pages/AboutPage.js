import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Seo from '../util/Seo';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import useBuildReveal from '../../hooks/useBuildReveal';
import armSafetyNet from '../../animation/armSafetyNet';
import Polaroids from '../sections/Polaroids';
import BookCallCta from '../ui/BookCallCta';
import MagneticButton from '../ui/MagneticButton';
import teamData from '../../data/team.json';
import { ORG_ID, personId } from '../../utils/schemaIds';
import posts from '../../data/posts.json';
import projects from '../../data/projects.json';
import '../../styles/components/aboutPage.scss';

gsap.registerPlugin(ScrollTrigger);

/* About page, redesigned 2026-09-13 (owner: "long, outdated, not clear,
   boring"). Opens on the crew (the polaroid table); the statue hero,
   services, places and client strip were cut on review (owner, same day).
   Every number on this page is DERIVED from projects.json metrics, which
   are sourced in their case studies; nothing is typed here.

   Motion pass 2026-09-14 (owner: "besides the first section everything
   else is very static"). Crew already carries the page's interactive
   weight (Polaroids: drag, tilt, stickers); every section below it now
   gets its own signature build instead of the same flat fade:
   Principles/Process/Proof reuse the Services.js typographic-build hairline
   + masked-title pattern (useBuildReveal, generalized from ServiceItem);
   Process additionally pins and pans its row on desktop (Services.js pin
   pattern, reused verbatim: one parent effect owns pin+pan+parallax, each
   item owns its own build independently); Stack chips and the closing CTA
   get MagneticButton (already proven on AboutCTA/Reviews/CaseStudyPage). */

const PRINCIPLES = [
  {
    title: 'A blank canvas, every time',
    body: 'No themes, no page builders. Every layout, line of copy and line of code is made for your business.',
  },
  {
    title: 'You talk to the builder',
    body: 'The people designing and coding your project are the people on your calls. No account manager in between.',
  },
  {
    title: 'AI where it pays',
    body: 'We use AI where it measurably earns its place, and tell you when it doesn’t. Engineers first, evangelists never.',
  },
  {
    title: 'Measured after launch',
    body: 'Launch is the midpoint. We measure speed, search and conversions against where you started, and publish the numbers.',
  },
];

const STEPS = [
  { title: 'Call', body: 'A strategy call about your goals, your customers and what the site or system has to do.' },
  { title: 'Plan', body: 'A written scope, priced from our published tiers, before any work starts.' },
  { title: 'Design', body: 'Layouts and brand built on your real content, reviewed with you before code.' },
  { title: 'Build', body: 'Hand-written code with the AI and automations wired in, checked at phone and desktop sizes.' },
  { title: 'Launch + measure', body: 'We ship, then measure speed, search and conversions and report what changed.' },
];

const BUILD_WITH = ['Next.js', 'React', 'Node', 'Shopify', 'Python', '.NET'];
const RUN_OURSELVES = [
  'Self-hosted n8n workflows',
  'AI agents on Hermes and OpenClaw',
  'Assistants on Claude and OpenAI',
  'CRM pipelines and our own servers',
];

// [slug, metric index]: the figure is read from projects.json, so it can't
// drift from the case study that sources it.
const PROOF = [
  ['florida-green-improvements', 0],
  ['renewed-bodyworks', 2],
  ['prodani-miami', 0],
  ['zahav-medspa', 3],
]
  .map(([slug, i]) => {
    const p = projects.find((x) => x.slug === slug);
    const m = p?.metrics?.[i];
    return p && m ? { slug, title: p.title, value: m.value, label: m.label } : null;
  })
  .filter(Boolean);

// Timings quoted in the process section, also read from projects.json.
const timing = (slug) => {
  const p = projects.find((x) => x.slug === slug);
  const m = p?.metrics?.find((x) => /to live/i.test(x.label));
  return p && m ? { slug, title: p.title, value: m.value } : null;
};
const TIMINGS = ['crimson-equities', 'jo-marketing-11', 'florida-energy-assistance'].map(timing).filter(Boolean);

// Entries missing name or role are skipped.
const TEAM = teamData.filter((p) => p.name && p.role);

// Merges with the Organization in index.html via the shared @id. Each person
// gets a stable @id (the founder's matches index.html's `founder` and every
// blog post's author). `structuredData: false` keeps a team entry on the page
// but out of the Person markup: Eno is the studio dog (SEO audit fix 9).
const SCHEMA_TEAM = TEAM.filter((p) => p.structuredData !== false);
const teamJsonLd = SCHEMA_TEAM.length
  ? {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      member: SCHEMA_TEAM.map((p) => ({
        '@type': 'Person',
        '@id': personId(p.name),
        name: p.name,
        jobTitle: p.role,
        ...(p.bio ? { description: p.bio } : {}),
        sameAs: [p.linkedin, p.github, p.website].filter(Boolean),
      })),
    }
  : undefined;

/* Scroll reveals, house safe-reveal pattern: static HTML ships visible, the
   hidden state is set at runtime only, anything already on screen stands,
   and armSafetyNet forces an on-screen element visible if its trigger never
   fires. Reduced motion never hides anything. Left for the sections that
   don't get a bespoke build (person cards, journal card, section heads). */
const useReveals = (rootRef, reduced) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    const disarms = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ap-reveal', root).forEach((el) => {
        if (ScrollTrigger.isInViewport(el, 0.05)) return;
        gsap.set(el, { autoAlpha: 0, y: 28 });
        const reveal = () =>
          gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: reveal });
        disarms.push(
          armSafetyNet(
            el,
            () => gsap.getProperty(el, 'opacity') >= 1 || gsap.isTweening(el),
            () => gsap.set(el, { autoAlpha: 1, y: 0 }),
          ),
        );
      });
    }, root);
    return () => {
      disarms.forEach((d) => d && d());
      ctx.revert();
    };
  }, [rootRef, reduced]);
};

const SectionHead = ({ id, kicker, title }) => (
  <header className="ap-head ap-reveal">
    <p className="ap-head__kicker">{kicker}</p>
    <h2 id={id} className="ap-head__title">
      {title}
    </h2>
  </header>
);

/* ── Principles: hairline draw + masked title rise, one build per rule
   (useBuildReveal, the Services.js ServiceItem pattern generalized). ── */
function PrincipleItem({ rule, index }) {
  const itemRef = useRef(null);
  useBuildReveal(
    itemRef,
    { rule: '.ap-rule__line', meta: '.ap-rule__n', title: '.ap-rule__title', body: '.ap-rule__body' },
    { delay: index * 0.06 },
  );
  return (
    <li ref={itemRef} className="ap-rule">
      <span className="ap-rule__line" aria-hidden="true" />
      <span className="ap-rule__n" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="ap-rule__title-mask">
        <h3 className="ap-rule__title">{rule.title}</h3>
      </span>
      <p className="ap-rule__body">{rule.body}</p>
    </li>
  );
}

/* ── Process: each step owns its own build (independent of the pan); the
   pin/pan/parallax below is owned entirely by ProcessTrack's own effect,
   same division as Services.js (parent owns containerAnimation, children
   never touch it). ── */
function StepItem({ step, index }) {
  const itemRef = useRef(null);
  useBuildReveal(
    itemRef,
    { rule: '.ap-step__line', meta: '.ap-step__n', title: '.ap-step__title', body: '.ap-step__body' },
    { delay: index * 0.07 },
  );
  return (
    <li ref={itemRef} className="ap-step">
      <span className="ap-step__line" aria-hidden="true" />
      <span className="ap-step__n" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="ap-step__title">{step.title}</h3>
      <p className="ap-step__body">{step.body}</p>
    </li>
  );
}

function ProcessTrack({ heading, steps }) {
  const pinRef = useRef(null);
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const pin = pinRef.current;
    const list = listRef.current;
    if (!pin || !list) return undefined;

    const mm = gsap.matchMedia();
    // Same gate as the CSS flex-row layout below: desktop, motion allowed.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, list.scrollWidth - list.clientWidth);
      const panTween = gsap.to(list, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top+=110',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: pin,
              start: 'top top+=110',
              end: () => `+=${distance()}`,
              scrub: true,
            },
          },
        );
      }

      // Depth parallax while panning: each step drifts opposite the pan
      // direction as it crosses the screen (Services' `__item-body` tween).
      gsap.utils.toArray('.ap-step', list).forEach((step) => {
        gsap.fromTo(
          step,
          { x: 24 },
          {
            x: -24,
            ease: 'none',
            scrollTrigger: {
              containerAnimation: panTween,
              trigger: step,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });

      return () => {
        panTween.scrollTrigger?.kill();
        panTween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="ap-process__pin" ref={pinRef}>
      <div className="ap-wrap">
        {heading}
        <div className="ap-process__progress" aria-hidden="true">
          <span className="ap-process__progress-fill" ref={fillRef} />
        </div>
      </div>
      <div className="ap-process__viewport">
        <ol className="ap-steps" ref={listRef}>
          {steps.map((s, i) => (
            <StepItem key={s.title} step={s} index={i} />
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Proof: masked value reveal + hairline draw (useBuildReveal), lift on
   hover. The value strings are heterogeneous ("−94%", "61 → 100", "1 in
   13") — a digit count-up would have to reformat them, which risks
   misrepresenting a sourced figure (CLAUDE.md: metrics are a published
   claim). The mask reveal gets the same typographic weight without ever
   touching the string. ── */
function MetricTile({ metric, index }) {
  const itemRef = useRef(null);
  useBuildReveal(
    itemRef,
    { rule: '.ap-metric__line', title: '.ap-metric__value', body: '.ap-metric__label, .ap-metric__who' },
    { delay: index * 0.06 },
  );
  return (
    <li ref={itemRef} className="ap-metric">
      <Link to={`/projects/${metric.slug}`}>
        <span className="ap-metric__line" aria-hidden="true" />
        <span className="ap-metric__value-mask">
          <span className="ap-metric__value">{metric.value}</span>
        </span>
        <span className="ap-metric__label">{metric.label}</span>
        <span className="ap-metric__who">{metric.title}</span>
      </Link>
    </li>
  );
}

/* ── Closing CTA: masked title rise + magnetic buttons (AboutCTA pattern). ── */
function CtaBlock() {
  const ctaRef = useRef(null);
  useBuildReveal(ctaRef, { title: '.ap-cta__title' });
  return (
    <div className="ap-cta" ref={ctaRef}>
      <span className="ap-cta__title-mask">
        <h2 id="ap-cta" className="ap-cta__title">
          Let’s bring your idea to life.
        </h2>
      </span>
      <div className="ap-cta__actions">
        <MagneticButton distance={0.35}>
          <BookCallCta className="ap-btn" />
        </MagneticButton>
        <MagneticButton distance={0.35}>
          <Link to="/projects" className="ap-btn ap-btn--ghost">
            See the work
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}

const AboutPage = () => {
  const reduced = useReducedMotion();
  const headRef = useRef(null);
  const rootRef = useRef(null);
  // Once per page (module-level latches, CLAUDE.md): the page head only.
  usePageHeaderReveal(headRef);
  useReveals(rootRef, reduced);
  const post = posts[0];

  return (
    <>
      <Seo
        title="About | Switch Case Studio"
        description="An engineer-led studio in Portland, Oregon. Websites, web apps and AI systems, designed, built and measured by the people you talk to."
        path="/about"
        jsonLd={teamJsonLd}
      />

      <article className="about-page" ref={rootRef} aria-label="About Switch Case Studio">
        {/* ── Crew: the page opens here ── */}
        <section className="ap-section ap-crew" aria-labelledby="ap-crew">
          <div className="ap-wrap">
            {/* The page head: first screen, so it's GSAP-revealed from the
                static HTML (usePageHeaderReveal), not a scroll reveal. */}
            <header className="ap-head" ref={headRef}>
              <p className="ap-head__kicker page-head-animate">The crew</p>
              <h1 id="ap-crew" className="ap-head__title page-head-animate">
                The people behind the work.
              </h1>
            </header>
          </div>
          <div className="ap-crew__table">
            <Polaroids />
          </div>
          {TEAM.length > 0 && (
            <ul className="ap-wrap ap-crew__list">
              {TEAM.map((p) => (
                <li key={p.name} className="ap-person ap-reveal">
                  {p.photo && (
                    <img
                      className="ap-person__photo"
                      src={p.photo}
                      alt={p.photoAlt || p.name}
                      loading="lazy"
                      width="72"
                      height="72"
                    />
                  )}
                  <h3 className="ap-person__name">{p.name}</h3>
                  <p className="ap-person__role">{p.role}</p>
                  {p.bio && <p className="ap-person__bio">{p.bio}</p>}
                  {(p.linkedin || p.github || p.website) && (
                    <p className="ap-person__links">
                      {p.linkedin && (
                        <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>
                          LinkedIn
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub`}>
                          GitHub
                        </a>
                      )}
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer" aria-label={`${p.name}'s website`}>
                          Site
                        </a>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Principles ── */}
        <section className="ap-section" aria-labelledby="ap-principles">
          <div className="ap-wrap">
            <SectionHead id="ap-principles" kicker="How we work" title="Four rules we don’t bend." />
            <ol className="ap-rules">
              {PRINCIPLES.map((r, i) => (
                <PrincipleItem key={r.title} rule={r} index={i} />
              ))}
            </ol>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="ap-section ap-process" aria-labelledby="ap-process">
          <ProcessTrack
            heading={<SectionHead id="ap-process" kicker="The process" title="From first call to measured results." />}
            steps={STEPS}
          />
          {TIMINGS.length > 0 && (
            <div className="ap-wrap">
              <p className="ap-steps__timing ap-reveal">
                How long it takes, from our own case studies:{' '}
                {TIMINGS.map((t, i) => (
                  <span key={t.slug}>
                    <Link to={`/projects/${t.slug}`}>{t.title}</Link>, {t.value.replace(/\s+/g, ' ')}
                    {i < TIMINGS.length - 1 ? ' · ' : '.'}
                  </span>
                ))}
              </p>
            </div>
          )}
        </section>

        {/* ── Stack ── */}
        <section className="ap-section" aria-labelledby="ap-stack">
          <div className="ap-wrap ap-stack">
            <SectionHead id="ap-stack" kicker="Our stack" title="We run what we sell." />
            <div className="ap-stack__cols">
              <div className="ap-stack__col ap-reveal">
                <h3 className="ap-stack__label">We build with</h3>
                <ul className="ap-stack__chips">
                  {BUILD_WITH.map((t) => (
                    <li key={t} className="ap-stack__chip">
                      <MagneticButton distance={0.4} className="ap-stack__chip-pull">
                        {t}
                      </MagneticButton>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ap-stack__col ap-reveal">
                <h3 className="ap-stack__label">We run for ourselves</h3>
                <ul className="ap-stack__list">
                  {RUN_OURSELVES.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="ap-stack__note">
                  When we recommend a system, it’s because the studio already runs on it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Proof ── */}
        <section className="ap-section" aria-labelledby="ap-proof">
          <div className="ap-wrap">
            <SectionHead id="ap-proof" kicker="Numbers you can check" title="Measured, sourced, linked." />
            <ul className="ap-metrics">
              {PROOF.map((m, i) => (
                <MetricTile key={m.slug} metric={m} index={i} />
              ))}
            </ul>
          </div>
        </section>

        {/* ── Journal + CTA ── */}
        <section className="ap-section ap-end" aria-labelledby="ap-cta">
          <div className="ap-wrap ap-end__grid">
            {post && (
              <aside className="ap-journal ap-reveal" aria-labelledby="ap-journal-title">
                <p className="ap-head__kicker">From the journal</p>
                <h3 id="ap-journal-title" className="ap-journal__title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="ap-journal__excerpt">{post.excerpt}</p>
                <Link to="/blog" className="ap-journal__all">
                  All posts
                </Link>
              </aside>
            )}
            <CtaBlock />
          </div>
        </section>
      </article>
    </>
  );
};

export default AboutPage;
