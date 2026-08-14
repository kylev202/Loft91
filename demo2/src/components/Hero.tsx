import { useRef } from 'react';
import { DUR, EASE_OUT, gsap, useGSAP } from '../lib/gsap';
import { HERO_DELAY } from '../lib/loader';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { photos, wordmarkBlack } from '../data/photos';
import { hoursSummary, venue } from '../data/venue';
import { Plate } from './ui/Plate';
import { Button } from './ui/Button';

/** The statement, as a three-line lockup rather than a wrapped paragraph.
    Each line is its own mask, and the break points are a composition decision:
    "An upstairs / bar in / Footscray." steps down the page at 9rem. */
const STATEMENT = ['An upstairs', 'bar in', 'Footscray.'];

/**
 * Hero — the programme cover.
 *
 * The whole page refuses colour, so scale is what carries it: the statement is
 * set at up to 9rem against an 11px label, and the photograph runs edge to
 * edge, breaking the shell that every other element on the page respects. Those
 * two moves are the argument — a bigger accent hue could not do either.
 *
 * Order is deliberate. The mark, the statement, then the four things somebody
 * actually came for — where it is, when it is open, how to book — and *then*
 * the room. The facts sit above the fold on every phone size because they are
 * above the photograph, not because the photograph was shrunk to make room.
 *
 * The lines rise from behind the rule rather than fading in. Nothing floats,
 * nothing parallaxes: the plate develops upward exactly as every other plate on
 * the page does.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ delay: HERO_DELAY });
      tl.from('[data-hero-mark]', { opacity: 0, y: 12, duration: DUR.long, ease: EASE_OUT })
        .from('[data-hero-rule]', { scaleX: 0, duration: DUR.mid, ease: EASE_OUT }, 0.08)
        // The masked lines. `yPercent` resolves against each line's own height,
        // so one value is right at every breakpoint the clamp produces.
        .from(
          '[data-hero-line]',
          { yPercent: 105, duration: DUR.long, ease: EASE_OUT, stagger: 0.075 },
          0.18,
        )
        .from(
          '[data-hero-spec]',
          { opacity: 0, y: 12, duration: DUR.mid, ease: EASE_OUT, stagger: 0.05 },
          0.42,
        )
        .from(
          '[data-hero-plate]',
          { clipPath: 'inset(0% 0% 100% 0%)', duration: DUR.long, ease: EASE_OUT },
          0.5,
        );
    },
    { dependencies: [reduced], revertOnUpdate: true, scope: root },
  );

  return (
    <section ref={root} id="hero" aria-labelledby="hero-h" className="pb-2xl">
      <div className="shell pt-lg short:pt-md md:pt-xl">
        <img
          data-hero-mark
          src={wordmarkBlack.src}
          srcSet={wordmarkBlack.srcSet}
          sizes="(min-width: 64rem) 26vw, (min-width: 48rem) 38vw, 62vw"
          alt="Loft 91"
          width={wordmarkBlack.w}
          height={wordmarkBlack.h}
          translate="no"
          className="w-[62vw] md:w-[38vw] lg:w-[min(400px,26vw)]"
        />

        <div data-hero-rule className="mt-md h-px origin-left bg-ink" />

        <h1
          id="hero-h"
          className="mt-lg font-display text-display font-medium tracking-tight text-ink"
        >
          {STATEMENT.map((line) => (
            <span key={line} className="line-mask">
              <span data-hero-line className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        {/* The spec row. Everything factual renders from `venue.ts`, so this and
            the Visit table cannot drift apart. */}
        <dl className="mt-xl grid grid-cols-2 gap-x-md gap-y-md border-t border-ink pt-md md:grid-cols-4 md:gap-xl">
          <div data-hero-spec>
            <dt className="label text-ink-3">Location</dt>
            <dd className="mt-2xs">
              <a
                href={venue.maps}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-11 items-center text-body text-ink underline decoration-rule-strong underline-offset-[0.35em] transition-[text-decoration-color] duration-(--dur-micro) ease-out hover:decoration-ink"
              >
                {venue.address.short}
              </a>
            </dd>
          </div>
          <div data-hero-spec>
            <dt className="label text-ink-3">Open</dt>
            <dd className="mt-2xs flex min-h-11 items-center text-body text-ink tabular-nums">
              {hoursSummary}
            </dd>
          </div>
          <div data-hero-spec>
            <dt className="label text-ink-3">What it is</dt>
            <dd className="mt-2xs flex min-h-11 items-center text-body text-ink">
              Bar · Function space
            </dd>
          </div>
          <div data-hero-spec className="col-span-2 short:col-span-1 md:col-span-1 md:justify-self-end">
            <dt className="label text-ink-3 md:text-right">Functions</dt>
            <dd className="mt-2xs">
              <Button to="visit">
                <span className="short:hidden">Enquire about the room</span>
                <span className="hidden short:inline">Enquire</span>
              </Button>
            </dd>
          </div>
        </dl>
      </div>

      {/* Edge to edge — the one element on the page that breaks the shell, and
          the reason it is worth breaking. */}
      <div data-hero-plate className="mt-xl">
        <Plate
          photo={photos.event}
          sizes="100vw"
          priority
          decorative
          reveal={false}
          className="h-[62vh] max-h-[46rem] min-h-[15rem] md:h-[78vh]"
        />
      </div>
    </section>
  );
}
