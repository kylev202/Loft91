import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';

/**
 * R2 — smooth scrolling, via Lenis rather than ScrollSmoother.
 *
 * DESIGN.md §6.2 prefers ScrollSmoother and names Lenis as the sanctioned
 * substitute if the §11 JS budget is at risk. It is: this build already spends
 * ~60 KB gz on the React runtime before any animation code, and Lenis is ~3 KB
 * against ScrollSmoother's ~14 KB on top of core + ScrollTrigger. Licensing is
 * not the reason and must not be re-checked — every GSAP plugin is free
 * (MEMORY.md D-09).
 *
 * Desktop only, and never under reduced motion. Both are hard gates, not
 * degradations.
 */
let lenis: Lenis | null = null;

export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    lenis = new Lenis({
      // Slightly unhurried, to match a room you climb stairs to rather than a
      // product launch. Below ~0.08 it reads as native; above ~0.15 it lags.
      lerp: 0.1,
      // `false` because this never runs on touch — normalizeScroll exists to
      // tame mobile address-bar behaviour, and we are not there.
      syncTouch: false,
    });

    // ScrollTrigger's calculations are stale unless it is told the scroller
    // moved (gsap-scrolltrigger §scrollerProxy, "Critical").
    lenis.on('scroll', ScrollTrigger.update);

    // One rAF loop for both, driven by GSAP's ticker so the two never disagree
    // about the current frame.
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's own default
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);
}

/**
 * One anchor path for the whole site: Lenis when it is running, native scroll
 * when it is not. Written explicitly rather than left to `scroll-behavior:
 * smooth`, which fights a smooth-scroll library for control of the same scroll.
 *
 * `<a href="#id">` stays a real link — Cmd/middle-click still work, and this
 * only intercepts the plain left-click.
 */
export function scrollToId(id: string, reduced: boolean) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: -NAV_CLEARANCE, duration: 1.1 });
  } else {
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }
  // Move the keyboard's place in the document too. Without this, Tab after a
  // nav click resumes from the nav, not from the section just landed on.
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Matches `section[id] { scroll-margin-top }` in base.css — the floating nav
    overlays the top of the page, and a deep link must land clear of it. */
const NAV_CLEARANCE = 88;
