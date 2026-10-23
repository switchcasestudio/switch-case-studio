import { Navigate, useParams } from 'react-router-dom';

/* /services/<slug> for a service without a world yet (2026-10-22): the
   in-app fallback for the 301s in netlify.toml. A world gets its own static
   route record in routes.js above this param record, so this never emits a
   page of its own. */
export default function ServiceRedirect() {
  const { serviceSlug } = useParams();
  return <Navigate to={serviceSlug ? `/pricing/${serviceSlug}` : '/pricing'} replace />;
}
