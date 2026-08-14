import { useEffect, useState } from 'react';
import { loaderSkipped } from '../lib/loader';
import { wordmarkBlack } from '../data/photos';

/**
 * The loading page — the one place motion is allowed to be the point, and here
 * it is one gesture: the mark wipes on, a rule draws under it, the sheet lifts.
 * 1080ms end to end.
 *
 * The beats are CSS keyframes (see `base.css`), not GSAP. This runs while the
 * browser is at its busiest — parsing, fetching, mounting React — and CSS
 * animation runs off the main thread where a rAF timeline drops frames.
 *
 * - **Never blocks content.** The app renders underneath; this is a fixed layer
 *   with `pointer-events: none`.
 * - **Once per session**, gated on `sessionStorage`. A loader on every
 *   navigation is a tax, not a brand.
 * - **No loader at all under `prefers-reduced-motion`** — the gate in
 *   `index.html` sets `data-loader="skip"` and this returns null.
 * - **`inert` + `aria-hidden` for its whole life**, and removed from the DOM
 *   rather than left at `opacity: 0`.
 * - **`Tab` or `Escape` dismisses it immediately.** Someone reaching for the
 *   keyboard has already decided they want the content.
 */
export function Loader() {
  const [done, setDone] = useState(loaderSkipped);

  useEffect(() => {
    if (loaderSkipped) return;
    try {
      sessionStorage.setItem('l91-loaded', '1');
    } catch {
      // Private browsing: the loader simply plays again next visit.
    }

    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Escape') setDone(true);
    };
    window.addEventListener('keydown', dismiss);
    // Failsafe. The CSS has already lifted the sheet and left it
    // non-interactive by 1080ms; this only tidies the node away.
    const failsafe = window.setTimeout(() => setDone(true), 1600);

    return () => {
      window.removeEventListener('keydown', dismiss);
      window.clearTimeout(failsafe);
    };
  }, []);

  if (done) return null;

  return (
    <div className="loader" aria-hidden="true" inert>
      <div className="loader__mark">
        <img
          className="loader__wordmark"
          src={wordmarkBlack.src}
          srcSet={wordmarkBlack.srcSet}
          sizes="min(340px, 56vw)"
          alt=""
          width={wordmarkBlack.w}
          height={wordmarkBlack.h}
          translate="no"
        />
        <span className="loader__rule" />
      </div>
    </div>
  );
}
