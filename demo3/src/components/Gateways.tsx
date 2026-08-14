import { pages } from '../data/site';
import { Frame } from './ui/Frame';

/**
 * The home page's four gateway blocks — the whole reason the index page exists
 * now that each destination has its own document.
 *
 * Each block is the destination's *own cover photograph*, not a generic tile.
 * That is what makes the cross-document view transition legible: press the Menu
 * block and that photograph expands into the Menu page's cover, because it is
 * the same picture. `data-cover-for` is how `lib/transitions.ts` finds it.
 *
 * The grid is deliberately uneven — 7/5 then 5/7 — so the page reads as a
 * composition rather than as four equal cards. Every block is one link with one
 * accessible name; the index numeral and the arrow are `aria-hidden` decoration
 * on top of it.
 */
export function Gateways() {
  return (
    <section aria-labelledby="explore" className="shell section-pad">
      <h2 id="explore" className="sr-only">
        Explore Loft 91
      </h2>

      {/* `items-start` matters: the two blocks in a row have different column
          spans and therefore different heights, and a stretched grid item makes
          the link taller than its own photograph. With the caption anchored to
          the bottom of the *link*, the shorter card's caption floated below its
          picture onto bare page. The caption now lives inside the plate, so it
          is anchored to the photograph it labels and cannot come off it. */}
      <div className="grid items-start gap-md md:grid-cols-12">
        {pages.map(({ id, index, name, href, blurb, photo }, i) => (
          <a
            key={id}
            href={href}
            data-plate
            className={`group relative block ${
              i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5'
            }`}
          >
            <div
              data-cover-for={href}
              className="plate grade-card aspect-[4/5] w-full sm:aspect-[16/10]"
            >
              <Frame
                photo={photo}
                sizes="(min-width: 48rem) 58vw, 100vw"
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="grade-caption pointer-events-none absolute inset-x-0 bottom-0 z-10 p-md md:p-lg">
                <div className="relative z-10 flex items-baseline gap-xs">
                  <span className="label text-brass tabular-nums" aria-hidden="true">
                    {index}
                  </span>
                  <h3 className="font-display text-heading font-medium tracking-tight text-ink">
                    {name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="ml-auto text-lead text-brass transition-transform duration-(--dur-short) ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
                <p className="relative z-10 mt-2xs max-w-(--container-measure) text-small text-ink-2">
                  {blurb}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
