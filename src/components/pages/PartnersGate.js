import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Seo from '../util/Seo';
import '../../styles/components/partnersGate.scss';

/* ------------------------------------------------------------------ *
 * Password gate for the agency-partner wholesale offer (/partners).
 *
 * A partner enters a shared password; it's SHA-256 hashed in the browser
 * and compared to EXPECTED_HASH below. On a match the offer chunk
 * (PartnersPage) is lazy-loaded — so its markup never reaches a visitor
 * who hasn't unlocked — and the unlock is remembered for the tab session
 * so they don't retype it on refresh / navigation.
 *
 * SECURITY (be honest): this is obscurity, not real access control. The
 * static site has no backend, so the hash ships in the bundle and a
 * determined person could brute-force a WEAK password offline or dig the
 * lazy chunk out of the network tab. Good enough to keep wholesale pricing
 * off Google and away from casual/anonymous visitors; NOT for anything
 * genuinely confidential. Use a long, random password to make brute force
 * impractical. For a real lock, move this check to a Netlify Edge Function.
 *
 * The current password is `scs-partners-2026` — kept intentionally simple and
 * memorable (owner's call 2026-07-05): nothing sensitive lives behind the gate,
 * so the obscurity tradeoff is fine. This is NOT a placeholder to be "fixed".
 *
 * TO ROTATE THE PASSWORD (optional):
 *   printf 'NEW-PASSWORD' | shasum -a 256
 * paste the 64-char hex into EXPECTED_HASH, redeploy, hand out the new password.
 * (No plaintext password is ever stored in this repo.)
 * ------------------------------------------------------------------ */
const EXPECTED_HASH =
  'edddfbfb46fbf961a36d918a2023e72f203fb744c845fe2f8834d423e6aa5748';

const UNLOCK_KEY = 'scs-partners-unlocked';

// Loaded only after a correct password — keeps the offer out of every other
// bundle and out of the static /partners.html (which ships just this gate).
const PartnersPage = lazy(() => import('./PartnersPage'));

const sha256Hex = async (input) => {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const PartnersGate = () => {
  // 'checking' renders the same lock screen the server pre-rendered, so there's
  // no hydration divergence; an effect then honors a prior unlock. 'ok' swaps
  // in the offer. sessionStorage / crypto only touched client-side (effects +
  // the submit handler), never during the Node static build.
  const [status, setStatus] = useState('checking');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let unlocked = false;
    try {
      unlocked = sessionStorage.getItem(UNLOCK_KEY) === '1';
    } catch {
      unlocked = false;
    }
    setStatus(unlocked ? 'ok' : 'locked');
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (busy || !value) return;
      setBusy(true);
      setError(false);
      try {
        const hex = await sha256Hex(value);
        if (hex === EXPECTED_HASH) {
          try {
            sessionStorage.setItem(UNLOCK_KEY, '1');
          } catch {
            /* private mode — unlock just won't persist this session */
          }
          setStatus('ok');
        } else {
          setError(true);
          setValue('');
        }
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [busy, value],
  );

  if (status === 'ok') {
    return (
      <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
        <PartnersPage />
      </Suspense>
    );
  }

  return (
    <main className="partners-gate">
      <Seo
        title="Partners | Switch Case Studio"
        description="Private area for approved agency partners."
        path="/partners"
        robots="noindex, nofollow"
      />

      <div className="partners-gate__card">
        <p className="partners-gate__eyebrow">For agency partners</p>
        <h1 className="partners-gate__title">Enter your access password</h1>
        <p className="partners-gate__lede">
          This area is for approved white-label partners. Don&apos;t have a
          password?{' '}
          <a
            className="partners-gate__link"
            href="mailto:hello@switchcasestudio.com?subject=Partner%20access"
          >
            Get in touch
          </a>{' '}
          and we&apos;ll set you up.
        </p>

        <form className="partners-gate__form" onSubmit={onSubmit} noValidate>
          <label htmlFor="partners-pw" className="sr-only">
            Access password
          </label>
          <input
            id="partners-pw"
            type="password"
            className="partners-gate__input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            aria-invalid={error || undefined}
            aria-describedby={error ? 'partners-pw-error' : undefined}
          />
          <button
            type="submit"
            className="partners-gate__submit"
            disabled={busy || !value}
          >
            {busy ? 'Checking…' : 'Unlock'}
          </button>
        </form>

        {error && (
          <p
            id="partners-pw-error"
            className="partners-gate__error"
            role="alert"
          >
            That password didn&apos;t match. Try again.
          </p>
        )}
      </div>
    </main>
  );
};

export default PartnersGate;
