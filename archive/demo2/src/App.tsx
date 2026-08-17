import { useEffect, useRef } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { useFinePointer, usePrefersReducedMotion } from './hooks/useMediaQuery';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useReveal } from './hooks/useReveal';
import { Loader } from './components/Loader';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Band } from './components/Band';
import { Menu } from './components/Menu';
import { Packages } from './components/Packages';
import { Gallery } from './components/Gallery';
import { Faq } from './components/Faq';
import { Visit } from './components/Visit';
import { Footer } from './components/Footer';

/**
 * One page, anchored sections: Menu, Packages and Gallery are chapters of one
 * scroll rather than separate pages. Deep links still work — `/#menu` is a real
 * entry point.
 */
export function App() {
  const main = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const fine = useFinePointer();

  // Desktop only, never under reduced motion — both hard gates.
  useSmoothScroll(fine && !reduced);
  useReveal(main, reduced);

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

      {/* First tabbable element on the page. Shares the loader's layer, which is
          safe because Tab dismisses the loader on the way in. */}
      <a
        href="#main"
        className="sr-only z-(--z-loader) focus:not-sr-only focus:fixed focus:top-md focus:left-md focus:bg-ink focus:px-md focus:py-2xs focus:text-small focus:text-paper"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main" ref={main}>
        <Hero />
        <Band />
        <Menu />
        <Packages />
        <Gallery />
        <Faq />
        <Visit />
      </main>

      <Footer />
    </>
  );
}
