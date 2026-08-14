import type { RefObject } from 'react';
import { DUR, EASE_OUT, gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Two reveals, because this system has two kinds of thing to reveal.
 *
 * `[data-reveal]` — type and rules. 10px, not 20: the page is calm, and a long
 * travel on a text block reads as a slide rather than as arriving.
 *
 * `[data-plate]` — photographs, revealed by `clip-path: inset(0 0 100% 0)`
 * opening upward, so a plate *develops* onto the paper instead of fading in.
 * The same gesture as the loader's wipe, which is what ties the two together.
 *
 * The hidden state is set from JS, never from CSS. A `.reveal { opacity: 0 }`
 * rule strands the whole page at zero the moment anything goes wrong with the
 * script — and under reduced motion this hook returns before setting anything,
 * so there is no state to strand in the first place.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, reduced: boolean) {
  useGSAP(
    () => {
      if (reduced) return;

      const type = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (type.length) {
        gsap.set(type, { opacity: 0, y: 10 });
        ScrollTrigger.batch(type, {
          start: 'top 90%',
          once: true, // content that re-animates on scroll-up is a gimmick
          batchMax: 6, // beyond six, the last item's delay is a visible wait
          interval: 0.1,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: DUR.mid,
              ease: EASE_OUT,
              stagger: 0.055,
              overwrite: true,
            }),
        });
      }

      const plates = gsap.utils.toArray<HTMLElement>('[data-plate]');
      if (plates.length) {
        gsap.set(plates, { clipPath: 'inset(0% 0% 100% 0%)' });
        ScrollTrigger.batch(plates, {
          start: 'top 88%',
          once: true,
          batchMax: 4,
          interval: 0.1,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: DUR.long,
              ease: EASE_OUT,
              stagger: 0.08,
              overwrite: true,
            }),
        });
      }
    },
    { dependencies: [reduced], revertOnUpdate: true, scope },
  );
}
