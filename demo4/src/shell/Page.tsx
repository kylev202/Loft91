import { useEffect, useRef, type ReactNode } from 'react';
import { ScrollTrigger } from '../lib/gsap';
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { useReveal } from '../hooks/useReveal';
import { initTransitions } from '../lib/transitions';
import { Loader } from './Loader';
import { Nav } from './Nav';
import { Footer } from './Footer';

/**
 * The shell every page mounts into: loader, skip link, nav, main, footer.
 *
 * On a multi-page site this component is what R9 ("one coherent theme across
 * Menu, Packages and Gallery") actually resolves to — the pages cannot drift
 * apart, because the furniture, the smooth scroll, the reveal grammar and the
 * transition wiring are one file rather than eight copies.
 *
 * ── `bare` — the shell without the site around it ─────────────────────────
 * `/admin/` is a tool, not a page of the site, and the furniture that makes the
 * other seven documents cohere is dead weight on it: a nav offering Menu,
 * Packages and Gallery to somebody reading a booking; a footer restating the
 * trading hours, the full page index and a full-width masked wordmark under a
 * list of customer phone numbers. None of it is anything the owner came here to
 * use, and all of it is between them and the board.
 *
 * So `bare` drops the loader, the nav and the footer, and keeps everything
 * that is not decoration — the skip link, `<main>`, the smooth scroll and the
 * reveal grammar — so the page is still the same site, set in the same type,
 * with its own minimal head instead of the site's.
 *
 * The loader goes with them deliberately: it is the front door of the site,
 * and three seconds of wordmark animation in front of a tool somebody opens
 * daily is the clearest case of the "signature, not an obstacle" line in
 * `Loader` itself. A bare page therefore also does not mark the session as
 * loaded — arriving at the site proper afterwards should still get the door.
 */
export function Page({
  current,
  children,
  bare = false,
}: {
  current: string;
  children: ReactNode;
  bare?: boolean;
}) {
  const main = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  // Desktop only, never under reduced motion — both hard gates.
  useSmoothScroll(fine && !reduced);
  /* Reveals no longer take a pointer gate. The gate existed for the gallery's
     scrubbed parallax, which stuttered on a phone's native momentum scroll
     where scroll events stop arriving mid-flick. There is no parallax in this
     design (see useReveal), so a fade and a settle run identically on both. */
  useReveal(main, reduced);

  useEffect(initTransitions, []);

  // Reveals are positioned from element offsets, and those move once the fonts
  // swap and the photographs decode.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      {!bare && <Loader />}

      {/* First tabbable element on the page. Shares the loader's layer, which
          is safe because the loader is `pointer-events: none` and lifts on its
          own timer — nothing has to be dismissed to reach this. */}
      <a
        href="#main"
        className="label sr-only z-(--z-loader) focus:not-sr-only focus:fixed focus:top-md focus:left-md focus:bg-fill focus:px-md focus:py-xs focus:text-on-fill"
      >
        Skip to content
      </a>

      {!bare && <Nav current={current} />}

      <main id="main" ref={main}>
        {children}
      </main>

      {!bare && <Footer current={current} />}
    </>
  );
}
