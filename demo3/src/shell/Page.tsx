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
 * transition wiring are one file rather than five copies.
 */
export function Page({ current, children }: { current: string; children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  // Desktop only, never under reduced motion — both hard gates.
  useSmoothScroll(fine && !reduced);
  // The gallery's parallax rides the same gate, for the same reason: a scrubbed
  // transform is smooth where Lenis drives the scroll, and stutters on a phone,
  // where scroll events stop arriving during a momentum flick.
  useReveal(main, reduced, fine && !reduced);

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
      <Loader />

      {/* First tabbable element on the page. Shares the loader's layer, which
          is safe because the loader is `pointer-events: none` and lifts on its
          own timer — nothing has to be dismissed to reach this. */}
      <a
        href="#main"
        className="sr-only z-(--z-loader) focus:not-sr-only focus:fixed focus:top-md focus:left-md focus:bg-brass focus:px-md focus:py-2xs focus:text-small focus:text-on-brass"
      >
        Skip to content
      </a>

      <Nav current={current} />

      <main id="main" ref={main}>
        {children}
      </main>

      <Footer current={current} />
    </>
  );
}
