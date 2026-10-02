import { galleryBands } from '../data/photos';
import { Frame } from './ui/Frame';

/**
 * The gallery, as two uniform bands rather than one uneven sequence.
 *
 * D-42 removed a pinned gallery from demo2 and the argument still holds: a pin
 * hijacks the scroll in order to perform, and it needs two implementations — a
 * ScrollTrigger pin for fine pointers and a scroll-snap strip for everything
 * else. This needs one, and it behaves identically on a phone, under reduced
 * motion, and with JavaScript broken.
 *
 * ── Why the uneven grid is gone (D-61) ───────────────────────────────────
 * This used to run seven plates on a twelve-column grid at hand-set spans and
 * vertical offsets, sequenced as the arrival happens. The client asked for the
 * gallery to be symmetrical and for portrait and landscape frames not to be
 * mixed together, and those two requests are really one request: the spans and
 * offsets only ever existed *because* the orientations alternated. A 3:4 frame
 * beside a 4:3 one has to be given fewer columns or it dominates the row, and
 * once every plate is a different width the grid cannot be symmetrical by
 * definition.
 *
 * Group the frames by orientation and the whole apparatus falls away. Each band
 * is four frames of one shape, at one size, on an even column count — two-up
 * for the wide ones, four-up for the tall ones, two-up for both on a small
 * tablet, one-up on a phone. Every row is full and every plate in a row is
 * identical in size, on both axes.
 *
 * ── The aspect ratios are the photographs' own ───────────────────────────
 * `aspect-[4/3]` and `aspect-[3/4]` are not design choices, they are the
 * intrinsic ratios in `photos.ts` (800×600 and 800×1067). Because the box
 * matches the source, `object-cover` has nothing to crop — the frames are
 * uniform *and* nothing is cut off to make them uniform, which is the failure
 * mode of forcing mixed photography into one square grid.
 *
 * Each band carries a hairline and a small label, the same two elements
 * `SectionHead` opens a section with. That is the whole justification the
 * grouping needs on the page: it says what the four pictures below it have in
 * common, in two words, and then gets out of the way.
 *
 * The plates fade in and their photographs settle into frame (`useReveal`).
 * The parallax drift that used to run here is gone: the reference language has
 * no parallax, and on a page that is eight photographs deep a picture sliding
 * against the scroll eight times is the loudest thing a quiet design could do.
 */

/** Per-band grid and per-plate box. Two entries, not seven — the shape of a
    plate now follows from which band it is in, so there is nothing left to
    hand-set. */
const band = {
  landscape: {
    grid: 'sm:grid-cols-2',
    box: 'aspect-[4/3]',
    sizes: '(min-width: 100rem) 700px, (min-width: 30rem) 47vw, 92vw',
  },
  portrait: {
    grid: 'sm:grid-cols-2 lg:grid-cols-4',
    box: 'aspect-[3/4]',
    sizes: '(min-width: 100rem) 340px, (min-width: 64rem) 23vw, (min-width: 30rem) 47vw, 92vw',
  },
} as const;

export function Plates() {
  return (
    <section aria-label="Photographs of the venue" className="shell section-pad">
      {galleryBands.map(({ id, orientation, label, photos }, bandIndex) => {
        const { grid, box, sizes } = band[orientation];

        // Plate numbers run 01…08 across both bands: the numbering is of the
        // gallery, not of the band, and restarting at 01 halfway down the page
        // would read as two galleries rather than one in two parts.
        const offset = galleryBands
          .slice(0, bandIndex)
          .reduce((total, b) => total + b.photos.length, 0);

        return (
          <div key={id} className={bandIndex > 0 ? 'mt-3xl' : ''}>
            <div className="rule-ink w-full" data-reveal />
            <p className="label mt-xs text-ink" data-reveal>
              {label}
            </p>

            <div className={`mt-lg grid gap-lg ${grid}`}>
              {photos.map((photo, i) => (
                <figure key={photo.name}>
                  <div className={`plate w-full ${box}`} data-plate>
                    <Frame photo={photo} sizes={sizes} className="h-full w-full object-cover" />
                  </div>

                  <figcaption className="mt-md flex items-baseline gap-md" data-reveal>
                    <span className="label shrink-0 text-ink-3 tabular-nums" aria-hidden="true">
                      {String(offset + i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-small text-ink-2">{photo.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
