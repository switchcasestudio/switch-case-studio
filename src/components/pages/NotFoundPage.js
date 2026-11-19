import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import '../../styles/components/notFound.scss';

/**
 * 404 — rendered two ways:
 *  - statically as build/404.html (route path "404"), which Netlify serves
 *    with a real 404 status for any path that has no file;
 *  - client-side for the router's "*" catch-all (unknown in-app navigations),
 *    which used to silently redirect home.
 */
const NotFoundPage = () => (
  <div className="not-found">
    <Seo
      title="Page Not Found | Switch Case Studio"
      description="That page doesn't exist. Head back to the homepage."
      path="/404"
      noindex
    />
    <p className="not-found__kicker">Error 404</p>
    <h1>This page doesn't exist.</h1>
    <Link to="/" className="not-found__cta">
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
