import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import armSafetyNet from '../../animation/armSafetyNet';
import '../../styles/components/polaroids.scss';
import playMuted from '../../utils/playMuted';

gsap.registerPlugin(ScrollTrigger);

/* Polaroid strip (owner, 2026-09-11): three short loops (1.5s, 12fps) set
   like prints tossed on a table, between the About statement and the
   marquee. Each has a WebM (VP9, ~25-50KB) then an MP4 (H.264) source and
   a WebP poster cut from the clip's last frame, so a blocked or unsupported
   video still shows the print. All six encodes are limited-range BT.709
   yuv420p (the house rule for site video).

   "Random" placement is a FIXED table, not Math.random: the SSG HTML and
   the first client render must agree, and a reshuffle on every load would
   move the composition under the owner's feet.

   Motion, one owner per element (CLAUDE.md: one tween per property):
   - .polaroid        scroll parallax (y), per card speed
   - .polaroid__drag  drag offset (x/y) and the base tilt (rotate)
   - .polaroid__tilt  pointer tilt (rotationX/Y) and hover lift (scale)
   Videos play only while on screen; reduced motion shows posters, no
   parallax, no tilt, no drag. */
/* `tags`: stickers glued to a print (owner, 2026-09-11): each crew member's
   NAME and TITLE. They render INSIDE .polaroid__tilt, so they drag, tilt,
   parallax and pop with the photo; left/top/w are % of the print, rot is
   extra on top of the print's own tilt. Name and title must stay on the
   same print: Adi = Social Media Director (left), Moses = Brand
   Strategist (middle), Christian = Content Manager (right). */
const PRINTS = [
  {
    name: 'polaroid', h: 882, left: '8%', top: '14%', rotate: -7, speed: -40, z: 1,
    tags: [
      { name: '16-name-adi', left: '6%', top: '4%', w: 26, rot: 4 },
      { name: '20-title-social-media-director', left: '68%', top: '62%', w: 40, rot: 8 },
    ],
  },
  {
    name: 'polaroid-dump', h: 878, left: '40%', top: '2%', rotate: 4, speed: 30, z: 3,
    // Round ring sticker since 2026-09-11 (was a wide name tag parked above
    // the print's top edge, where the round one hid under the fixed header).
    tags: [
      { name: '15-name-moses', left: '66%', top: '60%', w: 36, rot: -6 },
      // Lower-left, opposite the round name: above the top edge it hid under
      // the fixed header and a loose sticker.
      { name: '18-title-brand-strategist', left: '-14%', top: '66%', w: 48, rot: -7 },
    ],
  },
  {
    name: 'polaroid-cap', h: 882, left: '69%', top: '20%', rotate: -3, speed: -60, z: 2,
    tags: [
      { name: '17-name-christian', left: '58%', top: '6%', w: 54, rot: 3 },
      { name: '19-title-content-manager', left: '-18%', top: '74%', w: 60, rot: -4 },
    ],
  },
];

/* Stickers (owner, 2026-09-11), slapped around the prints. Files are the
   brand's own animated SVGs (public/stickers/, fonts embedded are the
   site's SCS Display + Inter subsets), shown via <img> so their internal
   CSS animations still run. Interaction ported from the identity kit's
   scs-stickers-interactive.html: drag (comes to the front, "slaps" on
   drop), push away from a nearby cursor, a depth parallax toward it, and
   double-click on the table resets them. One rAF loop, running only while
   the table is on screen and something is moving.
   Ownership: JS writes the OUTER .sticker transform (translate only); CSS
   owns the inner .sticker__img (base --rot, hover lift, slap). */
const STICKERS = [
  // 11 stickers in total (owner, 2026-09-11): the 6 crew name/title tags on
  // the prints plus these 5 loose ones, one per open corner of the table.
  { name: '09-star-2026', left: '1%', top: '6%', w: 10, rot: -8 },
  { name: '06-design-code-ai', left: '91%', top: '2%', w: 8, rot: 8 },
  { name: '08-numbers-ellipse', left: '3%', top: '88%', w: 15, rot: -4 },
  { name: '11-stack-ring', left: '52%', top: '84%', w: 9, rot: -12 },
  { name: '14-switch-case-arch', left: '92%', top: '70%', w: 7, rot: 6 },
];

/* Pop-in (owner, 2026-09-11): when the table scrolls in, the 8 pieces
   (3 prints with their name + title tags, then 5 stickers, in DOM order) pop one after another in a
   shuffled order. The order is a FIXED permutation, so SSG and hydration
   agree and it reads random without reshuffling per load. CSS does the
   motion with the individual `scale` + `opacity` properties, which compose
   with the transforms GSAP (prints) and the rAF loop (stickers) write, so
   no property has two owners. Static HTML is visible; `has-pop` (runtime
   only) hides, `is-in` reveals, and armSafetyNet forces it on screen. */
const POP_ORDER = [5, 0, 3, 7, 1, 6, 2, 4];

const usePopIn = (rootRef, reduced) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    if (ScrollTrigger.isInViewport(root, 0.2)) return undefined; // already here: stand
    root.classList.add('has-pop');
    const reveal = () => root.classList.add('is-in');
    const st = ScrollTrigger.create({ trigger: root, start: 'top 75%', once: true, onEnter: reveal });
    const disarm = armSafetyNet(root, () => root.classList.contains('is-in'), reveal);
    return () => {
      st.kill();
      disarm();
      root.classList.remove('has-pop', 'is-in');
    };
  }, [rootRef, reduced]);
};

const useStickers = (rootRef, reduced) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const els = [...root.querySelectorAll('.sticker')];
    const items = els.map((el, i) => ({
      el,
      dx: 0, dy: 0, // user drag offset
      px: 0, py: 0, // smoothed parallax + push
      depth: 0.4 + ((i * 37) % 10) / 10,
      last: '',
    }));
    const ptr = { x: 0, y: 0, in: false };
    let drag = null;
    let visible = false;
    let raf = 0;
    let topZ = 100; // stickers live at 100+, above any print (capped at 99)

    const tick = () => {
      raf = 0;
      let moving = false;
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      items.forEach((it) => {
        let tx = 0;
        let ty = 0;
        if (ptr.in && drag?.it !== it) {
          tx = (cx - ptr.x) * 0.02 * it.depth;
          ty = (cy - ptr.y) * 0.02 * it.depth;
          const b = it.el.getBoundingClientRect();
          const ex = b.left + b.width / 2 - ptr.x;
          const ey = b.top + b.height / 2 - ptr.y;
          const d = Math.hypot(ex, ey);
          if (d < 220 && d > 1) {
            const f = (1 - d / 220) * 22;
            tx += (ex / d) * f;
            ty += (ey / d) * f;
          }
        }
        it.px += (tx - it.px) * 0.12;
        it.py += (ty - it.py) * 0.12;
        if (Math.abs(tx - it.px) > 0.05 || Math.abs(ty - it.py) > 0.05) moving = true;
        const t = `translate(${(it.dx + it.px).toFixed(1)}px, ${(it.dy + it.py).toFixed(1)}px)`;
        if (t !== it.last) {
          it.el.style.transform = t;
          it.last = t;
        }
      });
      if (moving || drag) wake();
    };
    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.in = true;
      if (drag) {
        drag.it.dx = drag.ox + e.clientX - drag.sx;
        drag.it.dy = drag.oy + e.clientY - drag.sy;
      }
      wake();
    };
    const onLeave = () => {
      ptr.in = false;
      wake();
    };
    const onReset = () => {
      items.forEach((it) => {
        it.dx = 0;
        it.dy = 0;
      });
      wake();
    };
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('dblclick', onReset);

    const offs = items.map((it) => {
      const down = (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        drag = { it, sx: e.clientX, sy: e.clientY, ox: it.dx, oy: it.dy };
        it.el.setPointerCapture(e.pointerId);
        it.el.style.zIndex = String(++topZ);
        it.el.classList.add('is-dragging');
      };
      const up = () => {
        if (drag?.it !== it) return;
        drag = null;
        it.el.classList.remove('is-dragging');
        it.el.classList.add('is-slap');
        setTimeout(() => it.el.classList.remove('is-slap'), 450);
      };
      it.el.addEventListener('pointerdown', down);
      it.el.addEventListener('pointerup', up);
      it.el.addEventListener('pointercancel', up);
      return () => {
        it.el.removeEventListener('pointerdown', down);
        it.el.removeEventListener('pointerup', up);
        it.el.removeEventListener('pointercancel', up);
      };
    });

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    io.observe(root);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('dblclick', onReset);
      offs.forEach((o) => o());
      els.forEach((el) => {
        el.style.transform = '';
      });
    };
  }, [rootRef, reduced]);
};

// `children` render inside the table's own box (above the stickers), so a
// caller can float things over it in the table's coordinates: the home page
// passes its links into /about; the /about page passes nothing.
const Polaroids = ({ children }) => {
  const rootRef = useRef(null);
  const reduced = useReducedMotion();
  useStickers(rootRef, reduced);
  usePopIn(rootRef, reduced);

  // Play on screen, pause off screen (and never under reduced motion).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const videos = [...root.querySelectorAll('video')];
    if (reduced) {
      videos.forEach((v) => v.pause());
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) {
            v.muted = true;
            playMuted(v);
          } else {
            v.pause();
          }
        }),
      { rootMargin: '100px' },
    );
    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [reduced]);

  // Parallax, tilt, drag.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups = [];
    let topZ = 10;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.polaroid').forEach((card, i) => {
        const { speed, rotate } = PRINTS[i];
        const drag = card.querySelector('.polaroid__drag');
        const tilt = card.querySelector('.polaroid__tilt');

        gsap.set(card, { x: 0, y: 0 });
        gsap.fromTo(
          card,
          { y: -speed },
          {
            y: speed,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
        gsap.set(drag, { x: 0, y: 0, rotate });
        gsap.set(tilt, { transformPerspective: 900, rotationX: 0, rotationY: 0, scale: 1 });

        if (!fine) return;

        const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.5, ease: 'power3.out' });
        const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.5, ease: 'power3.out' });
        const onMove = (e) => {
          const r = tilt.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 16);
          rx(-py * 16);
        };
        const onEnter = () => {
          // Capped below the stickers' floor (100): a hovered print comes to
          // the front of the PRINTS, never over a sticker.
          topZ = Math.min(topZ + 1, 99);
          card.style.zIndex = String(topZ);
          gsap.to(tilt, { scale: 1.05, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(drag, { rotate: rotate * 0.3, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        };
        const onLeave = () => {
          rx(0);
          ry(0);
          gsap.to(tilt, { scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(drag, { rotate, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
        };

        // Drag to rearrange: pointer capture, the print follows the pointer
        // and settles where it's dropped. Fine pointers only (on touch a drag
        // would fight the page scroll).
        let start = null;
        const onDown = (e) => {
          if (e.button !== 0) return;
          start = {
            x: e.clientX - gsap.getProperty(drag, 'x'),
            y: e.clientY - gsap.getProperty(drag, 'y'),
          };
          card.setPointerCapture(e.pointerId);
          card.classList.add('is-dragging');
        };
        const onDrag = (e) => {
          if (!start) return;
          gsap.set(drag, { x: e.clientX - start.x, y: e.clientY - start.y });
        };
        const onUp = (e) => {
          if (!start) return;
          start = null;
          card.releasePointerCapture?.(e.pointerId);
          card.classList.remove('is-dragging');
        };

        card.addEventListener('pointerenter', onEnter);
        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', onLeave);
        card.addEventListener('pointerdown', onDown);
        card.addEventListener('pointermove', onDrag);
        card.addEventListener('pointerup', onUp);
        card.addEventListener('pointercancel', onUp);
        cleanups.push(() => {
          card.removeEventListener('pointerenter', onEnter);
          card.removeEventListener('pointermove', onMove);
          card.removeEventListener('pointerleave', onLeave);
          card.removeEventListener('pointerdown', onDown);
          card.removeEventListener('pointermove', onDrag);
          card.removeEventListener('pointerup', onUp);
          card.removeEventListener('pointercancel', onUp);
        });
      });
    }, root);

    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, [reduced]);

  return (
    // aria-hidden sits on each print and sticker, not the table: real links
    // passed in as children must stay in the accessibility tree.
    <div className="polaroids" ref={rootRef}>
      {PRINTS.map((p, i) => (
        <div
          key={p.name}
          className="polaroid"
          aria-hidden="true"
          style={{
            left: p.left,
            top: p.top,
            zIndex: p.z,
            '--rot': `${p.rotate}deg`,
            '--pop': POP_ORDER[i],
          }}
        >
          <div className="polaroid__drag">
            <div className="polaroid__tilt">
              <video
                className="polaroid__video"
                muted
                loop
                playsInline
                preload="metadata"
                poster={`/polaroids/${p.name}-poster.webp`}
                width="720"
                height={p.h}
                tabIndex={-1}
              >
                <source src={`/polaroids/${p.name}.webm`} type="video/webm" />
                <source src={`/polaroids/${p.name}.mp4`} type="video/mp4" />
              </video>
              {(p.tags || []).map((t) => (
                <img
                  key={t.name}
                  className="polaroid__tag"
                  src={`/stickers/${t.name}.svg`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  style={{
                    left: t.left,
                    top: t.top,
                    width: `${t.w}%`,
                    '--tag-rot': `${t.rot}deg`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      {STICKERS.map((s, i) => (
        <div
          key={s.name}
          className="sticker"
          aria-hidden="true"
          style={{
            '--left': s.left,
            top: s.top,
            width: `${s.w}%`,
            '--rot': `${s.rot}deg`,
            '--pop': POP_ORDER[PRINTS.length + i],
          }}
        >
          <img
            className="sticker__img"
            src={`/stickers/${s.name}.svg`}
            alt=""
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>
      ))}
      {children}
    </div>
  );
};

export default Polaroids;
