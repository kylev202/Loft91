import type { RefObject } from 'react';
import { DUR, EASE_OUT, gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Two reveals and one drift, because this system has two kinds of thing to
 * reveal and one page that earns more than a reveal.
 *
 * `[data-reveal]` — type and rules. 10px, not 20: the page is calm, and a long
 * travel on a text block reads as a slide rather than as arriving.
 *
 * `[data-plate]` — photographs. Two moves that overlap:
 *
 *   1. **The aperture.** The frame opens from a lit band across its own middle
 *      out to its full height. On a near-black page that is a strip of the room
 *      widening into the page, which is the thesis of the whole design stated
 *      as a motion (theme.css: "light arrives the way it does in the venue").
 *   2. **The settle.** The photograph inside starts wider than its frame and
 *      comes to rest, running roughly twice as long as the aperture — so the
 *      picture is still settling well after the frame has finished opening.
 *      That overlap is the entire effect: two moves of equal length read as one
 *      move, two moves of unequal length read as depth.
 *
 * The settle is not a new gesture. `Cover.tsx` already lands every page's cover
 * photograph the same way, at `scale: 1.06` over 1.8s — "a camera coming to
 * rest". This makes the plates behave like the cover instead of like a wipe,
 * which is what makes a gallery of seven of them read as one sequence.
 *
 * `[data-drift]` — a plate that also parallaxes as it crosses the viewport, for
 * the gallery's monograph sequence. Opt-in, and only where the caller passes
 * `drift`: it is gated on the same signal as the smooth scroll, because a
 * scrubbed transform is smooth exactly where Lenis is driving the scroll and
 * stutters on a phone's native momentum, where scroll events stop arriving
 * mid-flick.
 *
 * The hidden state is set from JS, never from CSS. A `.reveal { opacity: 0 }`
 * rule strands the whole page at zero the moment anything goes wrong with the
 * script — and under reduced motion this hook returns before setting anything,
 * so there is no state to strand in the first place.
 */

/** The aperture's shut state: 46% clipped off the top and the bottom leaves an
    8%-tall band of the photograph showing. Below about 4% it reads as a glitch
    on a short plate; above about 12% the opening stops being an event. */
const SHUT = 'inset(46% 0% 46% 0%)';

/** How much wider than its frame a photograph starts. Larger than the cover's
    1.06 because this move is under half the cover's length — the same apparent
    speed needs more travel over less time. */
const FROM = 1.14;

/** The settle runs ~1.9× the aperture. Anything at or under 1.0 collapses the
    two moves into one and the depth goes with it. */
const SETTLE = DUR.long * 1.9;

const STAGGER = 0.08;

/** A drifting plate rests over-scaled so it has somewhere to travel: 1.06 leaves
    3% of overflow above the frame and 3% below, which is exactly the drift's
    amplitude. Change one and change the other, or the plate's panel colour
    shows at an edge at the end of the crossing. */
const DRIFT_SCALE = 1.06;
const DRIFT = 3;

export function useReveal(
  scope: RefObject<HTMLElement | null>,
  reduced: boolean,
  drift: boolean,
) {
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
      if (!plates.length) return;

      /* The photograph inside a plate is the `<picture>` when `Frame` rendered
         one, and the `<img>` otherwise — never the `<img>` inside a `<picture>`.
         base.css owns that element's `scale` for the hover push, and an inline
         transform written there by GSAP outranks a hover rule permanently, so
         the first reveal would cost every plate its hover for the rest of the
         session. One level out, the two compose instead of fighting. */
      const shots = new Map<HTMLElement, HTMLElement>();
      plates.forEach((plate) => {
        const shot = plate.querySelector<HTMLElement>('picture, img');
        if (shot) shots.set(plate, shot);
      });

      const rest = (shot: HTMLElement) =>
        drift && shot.closest('[data-drift]') ? DRIFT_SCALE : 1;

      gsap.set(plates, { clipPath: SHUT });
      shots.forEach((shot) => gsap.set(shot, { scale: FROM }));

      ScrollTrigger.batch(plates, {
        start: 'top 88%',
        once: true,
        batchMax: 4,
        interval: 0.1,
        onEnter: (batch) => {
          const opening = batch as HTMLElement[];

          gsap.to(opening, {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: DUR.long,
            ease: EASE_OUT,
            stagger: STAGGER,
            /* Land on no clip-path at all rather than on a clip at the border
               box. A clip-path clips the element's entire rendering, outline
               included, so a plate that keeps one can never draw a focus ring —
               the defect Gateways.tsx works around by moving the attribute a
               level in. Clearing it removes the whole class of bug. */
            onComplete: () => gsap.set(opening, { clearProps: 'clipPath' }),
          });

          const pictures = opening
            .map((plate) => shots.get(plate))
            .filter((shot): shot is HTMLElement => !!shot);

          if (pictures.length) {
            gsap.to(pictures, {
              scale: (_i: number, shot: HTMLElement) => rest(shot),
              duration: SETTLE,
              ease: EASE_OUT,
              stagger: STAGGER,
            });
          }
        },
      });

      if (!drift) return;

      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((plate) => {
        const shot = plate.querySelector<HTMLElement>('picture, img');
        if (!shot) return;

        /* Linear, and scrubbed across the plate's whole crossing. An eased
           parallax accelerates and stalls against a scroll the visitor is
           driving at a constant rate, which is the same argument that makes the
           band linear (base.css). */
        gsap.fromTo(
          shot,
          { yPercent: -DRIFT },
          {
            yPercent: DRIFT,
            ease: 'none',
            scrollTrigger: {
              trigger: plate,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });
    },
    { dependencies: [reduced, drift], revertOnUpdate: true, scope },
  );
}
