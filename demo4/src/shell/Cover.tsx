import { useRef, type ReactNode } from 'react';
import { DUR, EASE_OUT, gsap, useGSAP } from '../lib/gsap';
import { COVER_DELAY } from '../lib/loader';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { Frame } from '../components/ui/Frame';
import type { Photo } from '../data/photos';

/**
 * THE COVER — the one structural idea this design is built on, rebuilt.
 *
 * Every page still opens on a full-bleed photograph of the real room. What
 * changed is where the words go: the photograph **ends**, and the title begins
 * underneath it on clean paper.
 *
 * That is the whole reset in one component. Nocturne set the title into the
 * foot of the frame, which meant three content-anchored gradient systems, a
 * reserved `--cover-band` so the title could not jump between pages, a
 * forced-colours repair per gradient and a contrast-mode override per gradient
 * — a large amount of machinery whose only job was making type survive a
 * photograph. On warm white none of it works anyway: a grade over a bright
 * picture on a bright page is a smear, and the reference language this design
 * comes from never puts a headline over an image in the first place. It runs
 * the picture, stops, and sets the words on the page.
 *
 * The consequences are all good and worth naming, because they are the argument
 * for the change:
 *
 *   · Every cover shows 100% of its photograph. Nocturne's covers gave the
 *     bottom 74% to a grade, so the room — the thing the site exists to show —
 *     was mostly under a black ramp.
 *   · Contrast becomes a property of the palette alone. No sampling, no "1.08:1
 *     over the lit brick" class of defect, and nothing to re-tune per page.
 *   · The title cannot jump between pages, because it is laid out by ordinary
 *     flow rather than bottom-anchored inside a variable-height frame. The band
 *     that existed to prevent that is deleted rather than retuned.
 *
 * `data-cover` still does two jobs: `base.css` gives it `view-transition-name:
 * cover` so it morphs into the next page's cover across a navigation, and
 * `lib/transitions.ts` reassigns that name when the visitor pressed a gateway
 * card instead of the nav.
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
  /** The home page's hero is taller — it is the whole first impression, and it
      has no page above it to establish the site. */
  tall?: boolean;
  sizes?: string;
}) {
  const scope = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ delay: COVER_DELAY });

      /* Every beat below is OPTIONAL, and that is the point of the helper.
         The home hero is now the photograph and one hairline — no title lines
         and no tail (D-59) — while every interior page still carries an
         eyebrow, a title and a statement. GSAP warns to the console for a tween
         whose target list is empty, so a beat is added only when its selector
         actually matches something inside this cover. Scoped to `scope.current`
         rather than the document, so a cover can never animate another one's
         elements. */
      const beat = (selector: string, vars: gsap.TweenVars, at: number) => {
        const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current);
        if (targets.length) tl.from(targets, vars, at);
      };

      // The photograph settles rather than arrives — a camera coming to rest.
      // 1.6s: at --dur-long the same move reads as a glitch (D-28), and the
      // travel is smaller here than it was over a graded frame, because on
      // clean paper there is nothing to hide the edges of the move.
      beat('[data-cover] img', { scale: 1.05, duration: 1.6, ease: EASE_OUT }, 0);

      // Each line rises from behind the line above it, inside its own
      // `overflow: hidden` box, so type arrives from somewhere.
      beat(
        '[data-cover-line] > *',
        { yPercent: 105, duration: DUR.long, ease: EASE_OUT, stagger: 0.075 },
        0.1,
      );

      beat('[data-cover-rule]', { scaleX: 0, duration: DUR.mid, ease: EASE_OUT }, 0.3);

      beat(
        '[data-cover-tail]',
        { opacity: 0, y: 12, duration: DUR.mid, ease: EASE_OUT, stagger: 0.06 },
        0.42,
      );
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <header ref={scope}>
      {/* The photograph. Full bleed, edge to edge, and it finishes.

          No top offset of any kind: the running head is `position: sticky`, so
          it occupies real space in the flow above this and the picture simply
          starts underneath it. A fixed nav would have needed the offset — and
          would have put the running head over a photograph, which is the exact
          contrast problem this redesign exists to delete. */}
      <div data-cover className={`plate w-full ${tall ? 'h-(--hero-h)' : 'h-(--cover-h)'}`}>
        <Frame photo={photo} sizes={sizes} priority className="h-full w-full object-cover" />
      </div>

      {/* The words, on paper. */}
      <div className="shell pt-xl pb-lg">{children}</div>
    </header>
  );
}

/**
 * The interior-page cover: an index and eyebrow, a hairline across the full
 * measure, then the page name at display size on the left with the page's one
 * written sentence set against it on the right.
 *
 * The two-column split at `lg` is the editorial move the whole design turns on
 * — a serif title and a short sans paragraph holding opposite ends of a wide
 * rule is what a high-end retail page looks like, and it is what stops a
 * generous gutter from reading as an empty one. Below `lg` it stacks, because
 * on a phone there is one column and pretending otherwise costs the title its
 * size.
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
      <p className="label flex items-baseline gap-xs text-ink-3" data-cover-tail>
        <span className="tabular-nums">{index}</span>
        <span className="text-ink">{eyebrow}</span>
      </p>

      {/* `.rule-ink` rather than `h-px bg-ink`: with no accent hue this is the
          system's one ornament, and routing it through the component class is
          what lets the forced-colours repair in base.css reach it. Drawn with
          nothing but a background colour it would be forced to the system
          background and become the page drawn on the page. */}
      <div className="rule-ink mt-sm w-full" data-cover-rule />

      <div className="mt-lg grid gap-lg lg:grid-cols-12 lg:gap-x-xl">
        <h1 className="line-mask lg:col-span-7" data-cover-line>
          <span className="block font-display text-display text-ink">{name}</span>
        </h1>

        <div className="lg:col-span-5 lg:self-end lg:pb-2xs">
          <p className="max-w-(--container-measure) text-statement font-light text-ink-2" data-cover-tail>
            {statement}
          </p>
          {children}
        </div>
      </div>
    </CoverFrame>
  );
}
