import { useRef, type ReactNode } from 'react';
import { DUR, EASE_OUT, gsap, useGSAP } from '../lib/gsap';
import { COVER_DELAY } from '../lib/loader';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { Frame } from '../components/ui/Frame';
import type { Photo } from '../data/photos';

/**
 * THE COVER — the one structural idea this design is built on, rebuilt.
 *
 * Every page still opens on a photograph of the real room. What changed is
 * where the words go: the photograph **ends**, and the title begins underneath
 * it on clean paper. (It is no longer full bleed either — see the plate
 * below — but that is a later, separate instruction.)
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
  /* The plate is the shell minus its gutter, so `100vw` would now over-request
     the picture at every width. The three stops below are `--gutter`'s own
     clamp read back as widths: it is flat at 24px until 480px, tracks 5vw
     through the middle, and pins at 88px once `.shell` stops growing at
     1600px — which leaves 1424px of plate. */
  sizes = '(min-width: 110rem) 1424px, (min-width: 30rem) 90vw, calc(100vw - 3rem)',
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
         and no tail (D-59); an interior page carries an eyebrow and a title,
         and three of the five carry buttons. GSAP warns to the console for a tween
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
      {/* The photograph — mounted, not bled. Client instruction, 2026-08-31.

          It sits in the same `.shell` as the words underneath it, so its left
          and right edges land on exactly the same line as the page title and
          every heading below. That alignment is the whole point
          of the change: an image inset to an arbitrary amount is a banner with
          a page under it, and an image inset to the text margin is the page's
          own first block.

          `pt-(--gutter)` closes the third side. The running head is
          `position: sticky` so it occupies real space in the flow above this,
          and the picture used to start immediately underneath it; now the same
          white that runs down both sides runs across the top too, and the
          plate is framed evenly on three sides. (Not the fourth — the words
          are what sits below it, and their own `pt-xl` is the gap there.) */}
      <div className="shell pt-(--gutter)">
        <div data-cover className={`plate w-full ${tall ? 'h-(--hero-h)' : 'h-(--cover-h)'}`}>
          <Frame photo={photo} sizes={sizes} priority className="h-full w-full object-cover" />
        </div>
      </div>

      {/* The words, on paper.

          The bottom padding is smaller on a phone. Under `lg` the cover's
          buttons stack beneath the title instead of sitting beside it, so this
          padding is no longer the gap under a heading — it is the gap under a
          row of 48px blocks, stacked on top of `--section-pad` below it. Two
          large vertical rhythms in a row read as a break in the page on a
          narrow screen; from `lg` the desktop spacing is unchanged. */}
      <div className="shell pt-xl pb-2xs lg:pb-lg">{children}</div>
    </header>
  );
}

/**
 * The interior-page cover: an index and eyebrow, a hairline across the full
 * measure, and the page name at display size beneath it.
 *
 * ── The statement is gone (client instruction, 2026-08-31) ────────────────
 * Every cover used to set the page's one written sentence against the title,
 * holding the opposite end of the rule. It was the editorial move the design
 * turned on, and losing it is a real cost to the lockup — but all five of them
 * restated the eyebrow printed three lines above ("Behind the bar" over "The
 * list behind the bar."; "Functions & venue hire" over "The upstairs room,
 * available for functions and venue hire."), and a subtitle that says the
 * label again is the first thing to go when the instruction is to cut text.
 *
 * The twelve-column split survives, because on About, Packages and FAQ the
 * right-hand column still holds something real — the page's buttons, which is
 * what the statement used to sit above. Where a page passes no children
 * (Gallery) the column is not rendered at all and the title runs alone, so the
 * grid never leaves an empty cell beside a heading.
 */
export function Cover({
  index,
  eyebrow,
  name,
  photo,
  children,
}: {
  index: string;
  eyebrow: string;
  name: string;
  photo: Photo;
  /** The page's buttons, set against the title on the right from `lg`. */
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

      {/* The grid exists to hold the title against something. With no children
          there is nothing to hold it against, so the title is laid out by
          ordinary flow — a lone `<h1>` in a twelve-column grid with no span
          would be one column wide. */}
      {children ? (
        <div className="mt-lg grid gap-lg lg:grid-cols-12 lg:gap-x-xl">
          <h1 className="line-mask lg:col-span-7" data-cover-line>
            <span className="block font-display text-display uppercase text-ink">{name}</span>
          </h1>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end lg:pb-2xs">{children}</div>
        </div>
      ) : (
        <h1 className="line-mask mt-lg" data-cover-line>
          <span className="block font-display text-display uppercase text-ink">{name}</span>
        </h1>
      )}
    </CoverFrame>
  );
}
