import { useEffect } from 'react';
import { loaderSkipped, markLoaded } from '../lib/loader';
import { wordmarkWhite } from '../data/photos';

/**
 * R3 — the animated logo on a loading page.
 *
 * The client's own white wordmark wipes in left to right, a brass rule draws
 * beneath it, and the whole sheet lifts. 1080ms end to end, CSS keyframes only,
 * and **once per session** — not once per page. On a five-document site that
 * distinction is the difference between a signature and an obstacle.
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
          src={wordmarkWhite.src}
          srcSet={wordmarkWhite.srcSet}
          sizes="min(340px, 56vw)"
          width={wordmarkWhite.w}
          height={wordmarkWhite.h}
          alt=""
          translate="no"
        />
        <span className="loader__rule" />
      </div>
    </div>
  );
}
