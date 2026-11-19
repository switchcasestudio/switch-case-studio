import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import '../../styles/components/cursorComponent.scss';

const PURPLE = '#d99cff'; // $g6

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input[type='button'], input[type='submit'], summary, [data-cursor-color], [data-cursor-morph]";

// Zones where wrapping looks wrong (logo art, accordion rows): the cursor
// falls back to a hollow 35px circle there instead of morphing.
// The owner wants the wrap in the header and FAQ too (2026-09-11), but NOT
// on the service cards: their live posters are the hover response there.
// Add a selector here only for zones where the wrap genuinely competes.
const NO_MORPH_ZONES = '#services';
const HOVER_SIZE = 35;

// Zones that draw their OWN cursor (the testimonial carousel's Prev/Next
// pill). The dot ignores them entirely: wrapping the carousel (it is a
// role="button") flashed a carousel-sized ring for a frame before the dot
// faded out, the "blink" on entry (owner, 2026-09-13).
const OWN_CURSOR_ZONES = '.testimonial-carousel';

const BASE = 25; // resting circle (owner, 2026-09-10: circle everywhere)
const ROUND = '50%'; // the resting / no-morph shape
const PRESSED = 17; // VE-12 press tighten
const MORPH_PAD = 10; // breathing room around a wrapped element
// The ring is a border, and a border must not crowd text (owner, 2026-11-18:
// "the border is too close to the text"). A button or a card has padding
// and MORPH_PAD is plenty; a row or a text link has none beside its text,
// and the ring's inner edge stood 3px from the letters. `padsFor` measures
// how far the element's text sits from its own box and widens the ring on
// that axis until the text is this far inside it. Vertical is smaller: a
// line box already carries the room over and under its letters.
const TEXT_GAP_X = 10;
const TEXT_GAP_Y = 5;
const RING = 2; // the ring's border width (cursorComponent.scss)
const PAD_MAX = 48;

const padsFor = (box) => {
  const r = box.getBoundingClientRect();
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node;
  let seen = 0;
  let x = Infinity;
  let y = Infinity;
  while ((node = walker.nextNode()) && seen < 60) {
    if (!node.nodeValue.trim()) continue;
    const parent = node.parentElement;
    // Skip visually hidden labels (a 1px clipped box) and text in drawings.
    if (!parent || parent.offsetWidth <= 2 || parent.closest('svg')) continue;
    range.selectNodeContents(node);
    for (const t of range.getClientRects()) {
      if (t.width < 1 || t.height < 1) continue;
      seen += 1;
      x = Math.min(x, t.left - r.left, r.right - t.right);
      y = Math.min(y, t.top - r.top, r.bottom - t.bottom);
    }
  }
  if (!seen) return [MORPH_PAD, MORPH_PAD];
  const need = (inset, gap) => Math.min(PAD_MAX, Math.max(MORPH_PAD, 2 * (gap + RING - inset)));
  return [need(x, TEXT_GAP_X), need(y, TEXT_GAP_Y)];
};

// Elements whose hover wraps a LARGER box than the hovered control: the FAQ
// button wraps its whole card, so the ring keeps the card's 1rem corners and
// stays around the item when it opens (owner, 2026-09-11: square ring on a
// rounded card; ring around the question only once the answer showed).
const WRAP_BOX = '.faq__item';

const CursorComponent = () => {
  const dotRef = useRef(null);

  // Pointer detection lives in an effect, not at module scope: the SSG render
  // has no window (server output = null, same as the first client render —
  // no hydration divergence), and the portal target (document.body) must not
  // be touched until we're mounted in a real browser.
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    setIsPointerDevice(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    );
  }, []);

  useEffect(() => {
    if (!isPointerDevice) return;

    // Native cursor off everywhere while the custom square exists (class-
    // gated so touch / non-mounting environments keep the OS cursor).
    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    let parked = true; // VE-12: hidden until the first real mousemove
    let morphTarget = null; // element the cursor is currently wrapped around
    let padX = MORPH_PAD; // the ring's extra width and height around it
    let padY = MORPH_PAD;
    let hoverTarget = null; // element behind a no-morph (hollow circle) hover
    let pressed = false;
    let lastX = 0;
    let lastY = 0;
    let xTo, yTo, wTo, hTo;

    // JS owns ALL cursor geometry (position + size). CSS transitions on
    // width/height were removed from the stylesheet: they'd re-animate every
    // per-frame quickTo write and turn the morph to mush.
    const makeSetters = () => {
      xTo = gsap.quickTo(dot, 'x', { duration: 0.16, ease: 'power2.out' });
      yTo = gsap.quickTo(dot, 'y', { duration: 0.16, ease: 'power2.out' });
      wTo = gsap.quickTo(dot, 'width', { duration: 0.28, ease: 'power3.out' });
      hTo = gsap.quickTo(dot, 'height', { duration: 0.28, ease: 'power3.out' });
    };

    // While wrapped, stay glued to the element every frame — survives
    // scrolling, magnetic-button drift, and hover-lift transforms.
    // Release the wrap without an exit event. pointerout is MISSED when the
    // wrapped element vanishes under the pointer (header hiding over the hero,
    // a closing dropdown, the services pin re-parenting the row); the cursor
    // then stayed glued to a zero-size box at 0,0 (it "disappeared") or kept
    // a pill's huge radius at 25px (the accidental circle).
    const release = () => {
      morphTarget = null;
      gsap.ticker.remove(morphTick);
      dot.classList.remove('is-hovering', 'is-morphed');
      dot.style.removeProperty('--cursor-color');
      gsap.to(dot, { borderRadius: ROUND, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      if (wTo) {
        const size = pressed ? PRESSED : BASE;
        wTo(size);
        hTo(size);
        xTo(lastX);
        yTo(lastY);
      }
    };

    const morphTick = () => {
      if (!morphTarget) return;
      const r = morphTarget.getBoundingClientRect();
      const pad = Math.max(padX, padY);
      if (
        !morphTarget.isConnected ||
        r.width === 0 ||
        r.height === 0 ||
        lastX < r.left - pad ||
        lastX > r.right + pad ||
        lastY < r.top - pad ||
        lastY > r.bottom + pad
      ) {
        release();
        return;
      }
      xTo(r.left + r.width / 2);
      yTo(r.top + r.height / 2);
      wTo(r.width + padX);
      hTo(r.height + padY);
    };

    const onMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (parked) {
        // First move: snap into place (no tween from 0,0) and claim the
        // -50% centering in GSAP terms — the CSS translate parses into a
        // pixel matrix that the x/y tweens would otherwise discard,
        // leaving the dot anchored by its corner.
        parked = false;
        gsap.set(dot, {
          x: e.clientX,
          y: e.clientY,
          xPercent: -50,
          yPercent: -50,
          width: BASE,
          height: BASE,
          borderRadius: ROUND,
        });
        makeSetters();
        dot.classList.remove('is-parked');
        return;
      }
      if (morphTarget) return; // wrapped: morphTick owns position
      // Same missed-exit guard as release(), for the hollow-circle hover:
      // drop it if its element vanished or the pointer left its box.
      if (hoverTarget) {
        const r = hoverTarget.getBoundingClientRect();
        if (
          !hoverTarget.isConnected ||
          r.width === 0 ||
          e.clientX < r.left || e.clientX > r.right ||
          e.clientY < r.top || e.clientY > r.bottom
        ) {
          hoverTarget = null;
          dot.classList.remove('is-hovering');
          dot.style.removeProperty('--cursor-color');
          if (wTo) {
            const size = pressed ? PRESSED : BASE;
            wTo(size);
            hTo(size);
          }
        }
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // VE-12: physical press feedback — the dot tightens while the button is
    // down (skipped while wrapped around an element; the wrap IS the state).
    const onDown = () => {
      pressed = true;
      if (!morphTarget && wTo) {
        wTo(PRESSED);
        hTo(PRESSED);
      }
    };
    const onUp = () => {
      pressed = false;
      if (!morphTarget && wTo) {
        wTo(BASE);
        hTo(BASE);
      }
    };

    const onOver = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target || parked || target.closest(OWN_CURSOR_ZONES)) return;

      const custom = target.getAttribute('data-cursor-color');
      if (custom) {
        dot.style.setProperty('--cursor-color', custom);
      } else if (target.closest('.site-header, .faq, #testimonials, #hero')) {
        dot.style.setProperty('--cursor-color', PURPLE);
      } else {
        dot.style.removeProperty('--cursor-color');
      }

      // No-morph zones: classic hollow square, no wrapping.
      if (NO_MORPH_ZONES && target.closest(NO_MORPH_ZONES)) {
        if (morphTarget) {
          morphTarget = null;
          gsap.ticker.remove(morphTick);
        }
        gsap.to(dot, { borderRadius: ROUND, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
        if (wTo) {
          wTo(HOVER_SIZE);
          hTo(HOVER_SIZE);
        }
        hoverTarget = target;
        dot.classList.add('is-hovering');
        dot.classList.remove('is-morphed');
        return;
      }

      // Become the element's border: wrap the hovered element, matching its
      // rounded corners (square elements get a hair of rounding so the
      // cursor never looks broken against them).
      hoverTarget = null;
      const box = target.closest(WRAP_BOX) || target;
      if (morphTarget !== box) {
        morphTarget = box;
        [padX, padY] = padsFor(box);
        // Concentric corners: the ring sits half its pad outside the element,
        // so its radius is the element's radius PLUS that offset. Copying the
        // raw radius left a visibly tighter corner on rounded cards (owner,
        // 2026-09-10: the services-card border didn't follow the panel).
        const radius = parseFloat(getComputedStyle(box).borderTopLeftRadius) || 0;
        gsap.to(dot, {
          borderRadius: `${radius > 0 ? radius + Math.min(padX, padY) / 2 : 3}px`,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.ticker.add(morphTick);
      }

      dot.classList.add('is-hovering', 'is-morphed');
    };

    const onOut = (e) => {
      const target = e.target.closest(INTERACTIVE_SELECTOR);
      if (!target || target.closest(OWN_CURSOR_ZONES)) return;
      // Still inside the wrapped element (moved onto a child)? Not a real exit.
      // With a WRAP_BOX the wrapped element is the card, not the control.
      if (e.relatedTarget && (morphTarget || target).contains(e.relatedTarget)) return;

      if (morphTarget) {
        release();
        return;
      }
      hoverTarget = null;
      dot.classList.remove('is-hovering', 'is-morphed');
      dot.style.removeProperty('--cursor-color');
      if (wTo) {
        // leaving a no-morph hover: shrink the hollow square back down
        const size = pressed ? PRESSED : BASE;
        wTo(size);
        hTo(size);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('mouseup', onUp, true);
    window.addEventListener('blur', onUp);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      gsap.ticker.remove(morphTick);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('pointerover', onOver, true);
      document.removeEventListener('pointerout', onOut, true);
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('mouseup', onUp, true);
      window.removeEventListener('blur', onUp);
    };
  }, [isPointerDevice]);

  if (!isPointerDevice) return null;

  return createPortal(
    <div id="cursor-dot" className="is-parked" ref={dotRef} />,
    document.body,
  );
};

export default CursorComponent;
