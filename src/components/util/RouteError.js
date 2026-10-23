import { useEffect } from 'react';
import { Link, useLocation, useRouteError } from 'react-router-dom';
import '../../styles/components/notFound.scss';

/**
 * Route error boundary (2026-10-23). Before it, any loader or lazy-chunk
 * failure showed React Router's bare "Unexpected Application Error!" page.
 *
 * The errors that happen in production are stale-deploy errors: a tab
 * opened before a deploy navigates in-app and asks for a file that build no
 * longer ships (vite-react-ssg's loader manifest, or a route chunk whose
 * hash changed). Netlify answers with the 404 page, so the symptom is a JSON
 * parse error or a failed dynamic import. The right response is a full load
 * of the URL the visitor wanted: the fresh HTML carries the current hashes.
 * One automatic try per path (sessionStorage, 10s window), so a persistent
 * failure cannot loop; after that the page offers the reload as a link.
 *
 * Never server-rendered (no route errors during SSG), so the window access
 * below is only ever reached in a browser.
 */
const STALE = /not valid JSON|Unexpected token '<'|dynamically imported module|Importing a module script failed|Failed to fetch/i;

export default function RouteError() {
  const error = useRouteError();
  const { pathname, search, hash } = useLocation();
  const message = error?.message || String(error);
  const stale = STALE.test(message);
  const href = `${pathname}${search}${hash}`;

  useEffect(() => {
    console.error('[route]', error);
    if (!stale) return;
    const key = `scs-reload:${pathname}`;
    let last = 0;
    try {
      last = Number(sessionStorage.getItem(key)) || 0;
    } catch {
      /* storage blocked: still reload once per mount */
    }
    if (Date.now() - last < 10000) return;
    try {
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      /* ignore */
    }
    window.location.replace(href);
  }, [error, stale, pathname, href]);

  return (
    <div className="not-found">
      <p className="not-found__code">{stale ? '↻' : '!'}</p>
      <h1>{stale ? 'The site was just updated.' : 'Something broke on this page.'}</h1>
      <p className="not-found__text">
        {stale ? 'Loading the fresh version.' : 'A reload usually fixes it.'}
      </p>
      <a href={href} className="not-found__cta">
        Reload
      </a>
      {!stale && (
        <p className="not-found__text">
          <Link to="/">Back to home</Link>
        </p>
      )}
    </div>
  );
}
