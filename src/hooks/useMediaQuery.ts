import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a media query. `useSyncExternalStore` rather than
 * `useState` + `useEffect` so the first render already has the right answer —
 * a reduced-motion user must never see one frame of the animated build before
 * an effect corrects it.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false, // SSR / prerender: assume the plain, unanimated build
  );
}

/** Reduced motion is a first-class mode, not a fallback (CLAUDE.md §4.6). */
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/** A real pointer. Smooth scroll and the horizontal pin are desktop-only:
    hijacked scroll on a phone breaks momentum and address-bar behaviour, and at
    night it is actively hostile (DESIGN.md §6.2, §7.5). */
export const useFinePointer = () => useMediaQuery('(pointer: fine)');
