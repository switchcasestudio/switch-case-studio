import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import AboutHeading from './AboutHeading';
import AboutText from './AboutText';
import AboutJournal from './AboutJournal';
import AboutCTA from './AboutCTA';
import TextLoop from '../ui/TextLoop';
import Polaroids from './Polaroids';
import { Link } from 'react-router-dom';

import DecorativeBoundary from '../util/DecorativeBoundary';
import '../../styles/components/work.scss';
import '../../styles/components/aboutJumps.scss';

// Doors into the About page (owner, 2026-09-13): quiet links floating on the
// polaroid table, one per /about section. x/y are % of the table box, picked
// for its empty patches; at <=768px they drop into a row under the table.
const JUMPS = [
  { label: 'Four rules we don’t bend', to: '/about#ap-principles', x: '14%', y: '76%', d: '0s' },
  { label: 'From first call to measured results', to: '/about#ap-process', x: '38%', y: '64%', d: '-1.5s' },
  { label: 'We run what we sell', to: '/about#ap-stack', x: '64%', y: '84%', d: '-3s' },
  { label: 'Measured, sourced, linked', to: '/about#ap-proof', x: '66%', y: '5%', d: '-4.5s' },
];

// The Three.js stack (three + fiber) must not touch the initial load; the
// slot is named for the 3D moon (three + fiber + drei + Draco, ≈ 990KB) it
// held until 2026-09-12. React.lazy alone is NOT enough: rendering the lazy
// component at hydration fires the import immediately — PSI showed the chunk fetching+
// parsing during the hero's LCP window with no scroll. The import itself is
// gated behind an IntersectionObserver: nothing downloads until the
// slot scrolls within ~200px of the viewport.
// Since 2026-09-12 the slot holds DepthImage (a relit photo, three + fiber,
// no drei, no model); the gate and its reasoning are unchanged.
const DepthImage = lazy(() => import('../ui/DepthImage'));

// Can this browser create a WebGL context at all? If not, the Three.js
// chunk is never fetched and the slot stays an empty, correctly-sized box.
const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const MoonSlot = () => {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasWebGL()) return; // decorative: no WebGL, no canvas, no error
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true); // ancient browser: load it, same as before
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // SSR + first client render are both `near = false` (empty slot, same
  // dimensions) — no hydration divergence; DepthImage mounts on approach.
  return (
    <div ref={ref} className="work-moon">
      {near && (
        <DecorativeBoundary>
          <Suspense fallback={null}>
            {/* Values tuned by the owner in the component's Customize panel
                (2026-09-12); anything unlisted is the component default. */}
            <DepthImage
              image="/photos/about-depth.webp"
              fit="cover"
              view="lit"
              depthFromLight={0.5}
              depthSmoothing={7}
              depthContrast={1.4}
              invertDepth={false}
              displacement={1.5}
              normalStrength={1.6}
              detail={1.1}
              shadowIntensity={0.76}
              shadowSoftness={0.1}
              lightColor="#de9eff"
              lightIntensity={7.9}
              falloff={2.1}
              elevation={0.65}
              ambient={0.02}
              ambientColor="#ffffff"
              backgroundColor="#0a0a0a"
              colorPreserve={0}
              follow={0.12}
              autoOrbit
              orbitRadius={0.5}
              orbitDuration={10}
            />
          </Suspense>
        </DecorativeBoundary>
      )}
    </div>
  );
};

const About = () => {
  return (
    <div id="about">

      <div className="work-wrapper">
        <AboutHeading />
        <Polaroids>
          <nav className="about-jumps" aria-label="More about the studio">
            {JUMPS.map((j, i) => (
              <Link
                key={j.to}
                to={j.to}
                className="about-jumps__link"
                style={{ '--x': j.x, '--y': j.y, '--d': j.d, '--i': i }}
              >
                {j.label}
                <span className="about-jumps__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </Polaroids>
        {/* TextLoop ribbon (owner, 2026-09-13): swapped in for the "Switch
            Case Studio" marquee, which now sits after this section. */}
        <div className="text-loop-band">
          <TextLoop
            text="Design ✦ Development ✦ Marketing ✦ AI"
            shape="wave"
            speed={90}
            direction="forward"
            separator="✦"
            curviness={114}
            fontSize={46}
            fontWeight={400}
            letterSpacing={2}
            uppercase
            color="#ffffff"
            ribbon
            ribbonColor="#5227FF"
            ribbonWidth={86}
            pauseOnHover={false}
            trim
          />
        </div>

        <div className="work-content">
          <AboutText />
          <AboutJournal />
          <MoonSlot />
          {/* Inside the statue since 2026-09-12 (owner): bottom-centre over
              the photo on desktop, last in the stack on phones. */}
          <AboutCTA />
        </div>
      </div>
    </div>
  );
};

export default About;
