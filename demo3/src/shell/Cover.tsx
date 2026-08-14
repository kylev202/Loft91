import { useRef, type ReactNode } from 'react';
import { DUR, EASE_OUT, gsap, useGSAP } from '../lib/gsap';
import { COVER_DELAY } from '../lib/loader';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { Frame } from '../components/ui/Frame';
import type { Photo } from '../data/photos';

/**
 * THE COVER — the one structural idea this design is built on.
 *
 * Every page opens on a full-bleed photograph of the real room with its title
 * set into the foot of the frame. It is the page's header, its navigation
 * landmark and its LCP element all at once, and it is what makes five separate
 * documents read as one site: the same gesture, the same grade, the same
 * typographic lockup, a different room each time.
 *
 * `data-cover` does two jobs: `base.css` gives it `view-transition-name: cover`
 * so it morphs into the next page's cover across a navigation, and
 * `lib/transitions.ts` reassigns that name when the visitor pressed a gateway
 * block instead of the nav.
 *
 * The entrance is `.from()` rather than `.to()` on purpose: the resting state is
 * what is in the HTML, so if the script never runs the cover is simply *there*,
 * fully composed. Nothing on this page can be stranded at `opacity: 0`.
 */
export function CoverFrame({
  photo,
  children,
  tall = false,
  sizes = '100vw',
}: {
  photo: Photo;
  children: ReactNode;
  /** The home page's cover is taller — it is the whole first impression, and
      it has no page above it to establish the site. */
  tall?: boolean;
  sizes?: string;
}) {
  const scope = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ delay: COVER_DELAY });

      // The photograph settles rather than arrives — a camera coming to rest.
      // 1.8s because at --dur-long the same move reads as a glitch (D-28).
      tl.from('[data-cover] img', { scale: 1.06, duration: 1.8, ease: EASE_OUT }, 0)
        // Each line rises from behind the line above it, inside its own
        // `overflow: hidden` box, so type arrives from somewhere.
        .from(
          '[data-cover-line] > *',
          { yPercent: 105, duration: DUR.long, ease: EASE_OUT, stagger: 0.075 },
          0.08,
        )
        .from('[data-cover-rule]', { scaleX: 0, duration: DUR.mid, ease: EASE_OUT }, 0.4)
        .from(
          '[data-cover-tail]',
          { opacity: 0, y: 12, duration: DUR.mid, ease: EASE_OUT, stagger: 0.06 },
          0.48,
        );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <header
      ref={scope}
      className={`relative flex flex-col justify-end overflow-hidden ${
        /* The window between the nav scrim and the content grade is whatever
           height is left over, so cover height is directly how much of the room
           is visible. At 74svh the Visit cover — whose content block carries two
           CTAs as well as a title — had 64px of photograph left and read as a
           black rectangle. */
        tall ? 'min-h-[max(34rem,88svh)]' : 'min-h-[max(32rem,80svh)]'
      }`}
    >
      <div data-cover className="grade-cover absolute inset-0">
        <Frame photo={photo} sizes={sizes} priority className="h-full w-full object-cover" />
      </div>

      {/* `.grade-base` is full width and carries the legibility grade, which is
          why it wraps `.shell` rather than being applied to it: the gradient
          has to reach the edges of the viewport, the content does not. */}
      <div className="grade-base relative w-full">
        <div className="shell relative pt-(--nav-h) pb-2xl short:pb-xl">{children}</div>
      </div>
    </header>
  );
}

/**
 * The interior-page cover: eyebrow, the page name at display size, a brass
 * hairline, and the page's one written sentence.
 *
 * All of it sits in the bottom third of the frame, which is where the grade is
 * dense — the upper two-thirds are left to the photograph. That is a contrast
 * decision before it is a compositional one (D-29 measured an eyebrow at 3.34:1
 * when it was placed across the lit part of a frame), but it is also simply how
 * a title card is built.
 */
export function Cover({
  index,
  eyebrow,
  name,
  statement,
  photo,
  children,
}: {
  index: string;
  eyebrow: string;
  name: string;
  statement: string;
  photo: Photo;
  /** A meta row under the statement — hours, a CTA, a count of plates. */
  children?: ReactNode;
}) {
  return (
    <CoverFrame photo={photo}>
      {/* Full ink, and the numeral keeps its brass: with the content-anchored
          grade guaranteeing 0.88 under every line, brass measures 5.54:1 here
          against a blown-out white pixel. It did not survive the earlier
          frame-anchored grade — the Menu eyebrow measured 1.08:1 over the lit
          brick — which is why the guarantee, not the colour, was the fix. */}
      <p className="label flex items-baseline gap-xs text-ink" data-cover-tail>
        <span className="text-brass tabular-nums">{index}</span>
        <span>{eyebrow}</span>
      </p>

      <h1 className="line-mask mt-md" data-cover-line>
        <span className="block font-display text-display font-medium text-ink">{name}</span>
      </h1>

      <div className="rule-brass mt-lg w-full max-w-(--container-shell)" data-cover-rule />

      <p
        className="mt-md max-w-(--container-measure) font-editorial text-statement text-ink"
        data-cover-tail
      >
        {statement}
      </p>

      {children}
    </CoverFrame>
  );
}
