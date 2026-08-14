import { gallery } from '../data/photos';
import { Frame } from './ui/Frame';

/**
 * The gallery, as a monograph sequence rather than a pinned horizontal strip.
 *
 * D-42 removed a pinned gallery from demo2 and the argument holds here: a pin
 * hijacks the scroll in order to perform, and it needs two implementations —
 * a ScrollTrigger pin for fine pointers and a scroll-snap strip for everything
 * else. This needs one, and it behaves identically on a phone, under reduced
 * motion, and with JavaScript broken.
 *
 * The plates sit on a twelve-column grid at uneven widths and vertical offsets,
 * numbered and captioned, sequenced the way the arrival actually happens: the
 * stairs from the street, up them, the bar, the taps, the room, the screen wall,
 * and the sign you read on the way out. Each one develops upward on a
 * `clip-path` as it enters — the same gesture as the loader's wipe.
 */

/** Column span and offset per plate. Hand-set rather than generated: the shape
    of the sequence is a composition, and a modulo would produce a pattern
    instead of a rhythm. Portrait frames get fewer columns than landscape ones,
    so every plate ends up roughly the same visual weight on the page. */
const layout = [
  'lg:col-span-5 lg:col-start-1',
  'lg:col-span-4 lg:col-start-8 lg:mt-3xl',
  'lg:col-span-7 lg:col-start-2',
  'lg:col-span-4 lg:col-start-9 lg:-mt-2xl',
  'lg:col-span-6 lg:col-start-1 lg:mt-2xl',
  'lg:col-span-5 lg:col-start-8',
  'lg:col-span-4 lg:col-start-3 lg:mt-2xl',
] as const;

export function Plates() {
  return (
    <section aria-label="Photographs of the venue" className="shell section-pad">
      {/* Column gutters stay tight; the vertical gap is where the sequence
          breathes. A 12-column grid cannot afford a 96px gutter — eleven of
          them is 1,056px of pure gap, more than the whole content column at
          1024 (the same arithmetic that overflowed the page in D-25). */}
      <div className="grid gap-x-lg gap-y-3xl lg:grid-cols-12">
        {gallery.map((photo, i) => (
          <figure key={photo.name} className={layout[i] ?? 'lg:col-span-6'}>
            <div className="plate w-full" data-plate>
              <Frame
                photo={photo}
                sizes="(min-width: 48rem) 55vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>

            <figcaption className="mt-md flex items-baseline gap-md" data-reveal>
              <span className="label shrink-0 text-brass tabular-nums" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-small text-ink-2">{photo.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
