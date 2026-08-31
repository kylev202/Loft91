import { useEffect } from 'react';
import { loaderSkipped, markLoaded } from '../lib/loader';
import { wordmarkBlack } from '../data/photos';

/**
 * R3 — the animated logo on a loading page.
 *
 * The client's own wordmark wipes in left to right, an ink rule draws beneath
 * it, and the whole sheet lifts. 3000ms end to end, CSS keyframes only, and
 * **once per session** — not once per page. On a six-document site that
 * distinction is the difference between a signature and an obstacle.
 *
 * The sheet is the page colour, which on this design means the loader is the
 * page: the lift reads as paper being drawn away from paper, and there is no
 * flash at the end because there was never a different ground underneath. In
 * Nocturne the same component was a lit sheet over a near-black page, and the
 * hand-off was the interesting moment; here the hand-off is meant to be
 * invisible and the wordmark is the whole event.
 *
 * `aria-hidden` and `pointer-events: none`: it is decoration over a page that
 * is already parsed and already tabbable. The skip link sits on the same layer
 * and is reachable through it.
 *
 * A true per-letter animation still needs a vector with per-letter paths —
 * MEMORY.md Q2, open. The wipe is the honest thing to build from a raster.
 */
export function Loader() {
  // Runs whether or not the loader renders, so the second page of a session
  // skips it even if the first one never mounted the overlay.
  useEffect(markLoaded, []);

  if (loaderSkipped) return null;

  return (
    <div className="loader" aria-hidden="true">
      <div className="loader__mark">
        <img
          className="loader__wordmark"
          src={wordmarkBlack.src}
          srcSet={wordmarkBlack.srcSet}
          sizes="min(320px, 54vw)"
          width={wordmarkBlack.w}
          height={wordmarkBlack.h}
          alt=""
          translate="no"
        />
        <span className="loader__rule" />
      </div>
    </div>
  );
}
