import type { RefObject } from 'react';
import { DUR, EASE_OUT, gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Two reveals, and that is the entire scroll vocabulary of this site.
 *
 * `[data-reveal]` — type, rules, list rows. 12px and a fade.
 *
 * `[data-plate]` — photographs. A fade, and a settle: the picture starts
 *   fractionally wider than its frame and comes to rest, like a camera
 *   steadying. No clip, no wipe.
 *
 * ── What was removed, and why ────────────────────────────────────────────
 * Nocturne opened every photograph from a lit band across its own middle
 * (`clip-path: inset(46% 0 46% 0)` → full frame) and gave the gallery a
 * scrubbed parallax drift on top. Both were good moves *for that design*: on a
 * near-black page an aperture is a strip of a lit room widening into the page,
 * which was that system's thesis stated as motion.
 *
 * Neither survives the reset, and not because they were hard. On warm white an
 * aperture is a white box growing into a white page — the gesture is invisible
 * against the ground it plays on, so it costs a clip-path on every plate and
 * buys nothing. And the reference language this design is taken from has no
 * parallax at all: its restraint is the point, and a photograph that slides
 * against the scroll is the loudest thing a quiet page can do.
 *
 * So the aperture is gone, the drift is gone, and the `drift` gate that existed
 * to keep a scrubbed transform off phone momentum scroll is gone with it. What
 * is left is a fade and a settle, which is what this design actually asks for.
 *
 * The hidden state is set from JS, never from CSS. A `.reveal { opacity: 0 }`
 * rule strands the whole page at zero the moment anything goes wrong with the
 * script — and under reduced motion this hook returns before setting anything,
 * so there is no state to strand in the first place.
 */

/** How much wider than its frame a photograph starts. Small: this runs over
    `--dur-settle`, and the move should register as the picture *arriving*
    rather than as a zoom. */
const FROM = 1.05;

const STAGGER = 0.07;

export function useReveal(scope: RefObject<HTMLElement | null>, reduced: boolean) {
  useGSAP(
    () => {
      if (reduced) return;

      const type = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      if (type.length) {
        gsap.set(type, { opacity: 0, y: 12 });
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
      if (!plates.length) return;

      /* The photograph inside a plate is the `<picture>` when `Frame` rendered
         one, and the `<img>` otherwise — never the `<img>` inside a `<picture>`.
         base.css owns that element's `scale` for the hover push, and an inline
         transform written there by GSAP outranks a hover rule permanently, so
         the first reveal would cost every plate its hover for the rest of the
         session. One level out, the two compose instead of fighting. */
      const shots = plates
        .map((plate) => plate.querySelector<HTMLElement>('picture, img'))
        .filter((shot): shot is HTMLElement => !!shot);

      gsap.set(plates, { opacity: 0 });
      gsap.set(shots, { scale: FROM });

      ScrollTrigger.batch(plates, {
        start: 'top 88%',
        once: true,
        batchMax: 4,
        interval: 0.1,
        onEnter: (batch) => {
          const opening = batch as HTMLElement[];

          gsap.to(opening, {
            opacity: 1,
            duration: DUR.long,
            ease: EASE_OUT,
            stagger: STAGGER,
          });

          const pictures = opening
            .map((plate) => plate.querySelector<HTMLElement>('picture, img'))
            .filter((shot): shot is HTMLElement => !!shot);

          if (pictures.length) {
            gsap.to(pictures, {
              scale: 1,
              duration: DUR.settle,
              ease: EASE_OUT,
              stagger: STAGGER,
            });
          }
        },
      });
    },
    { dependencies: [reduced], revertOnUpdate: true, scope },
  );
}
