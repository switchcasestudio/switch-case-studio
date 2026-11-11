import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

function getHeaderOffset() {
  const header = document.querySelector('.site-header');
  return header ? header.offsetHeight : 0;
}

// Where each history entry was last scrolled to, by its router key. The
// browser's own restore runs before the old page is back in the DOM (the
// document is still too short), so on Back the position is put back here.
const positions = new Map();

export default function ScrollToTop() {
  const location = useLocation();
  const { pathname, hash, key } = location;

  useEffect(() => {
    const save = () => positions.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [key]);

  // Back and Forward (and a reload) are POP: the browser puts the reader
  // back where they were, and scrolling to the top undid it (UX audit,
  // 2026-11-10: Back from a post landed ten screens above the list).
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === 'POP' && !hash) {
      const y = positions.get(key);
      if (!y) return undefined;
      // Wait (up to a second) for the page to be tall enough again.
      let tries = 0;
      const id = setInterval(() => {
        tries += 1;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max >= y - 4 || tries >= 20) {
          clearInterval(id);
          window.scrollTo({ top: y, left: 0, behavior: 'instant' });
        }
      }, 50);
      return () => clearInterval(id);
    }

    // Helper to run on the next paint (after layout)
    const nextFrame = (fn) =>
      requestAnimationFrame(() => requestAnimationFrame(fn));

    // A) STANDARD NAVIGATION (no hash) → instant scroll to top.
    // 'auto' (instant) is less jarring than 'smooth' on every route
    // change, and matches user expectations for new pages.
    if (!hash) {
      nextFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
      return undefined;
    }

    // B) HASH NAVIGATION → wait for element, then scroll
    let attempts = 0;
    const maxAttempts = 40; // ~2s @ 50ms
    const interval = setInterval(() => {
      attempts += 1;
      const id = hash.slice(1);
      const el = document.getElementById(id);

      if (el) {
        const offset = getHeaderOffset() + 20; // +20px breathing room
        // Layout position (offsetTop chain), not the rect: a page reveal
        // holds its targets on a translateY while this measures (the
        // pricing boards sit 24px low at hydration), and a rect-based
        // target then lands the element under the fixed header.
        let top = -offset;
        for (let n = el; n; n = n.offsetParent) top += n.offsetTop;

        window.scrollTo({ top, behavior: 'smooth' });
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [pathname, hash, navType, key]);

  return null;
}
