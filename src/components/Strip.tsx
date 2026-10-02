import { gallery } from '../data/photos';
import { Frame } from './ui/Frame';

/**
 * The gallery strip from `demo/` — the one deliberate break from the grid.
 *
 * The Gallery *page* runs the same eight frames as two uniform bands
 * (`Plates`, D-61). This is the home page's version of it: the same
 * photographs, in the same order, laid along one horizontal scroller you can
 * flick through in a second without leaving the index page.
 *
 * Portrait sources take the tall frames and landscape sources the wide ones,
 * so nothing is centre-cropped into an accident, and the whole run is
 * bottom-aligned — mixed heights on a shared baseline, which is what makes it
 * read as a contact sheet rather than as a carousel. Note that this is the one
 * surface where mixing the two orientations is the *point*: D-61 separates them
 * on the gallery page because a grid of unequal boxes cannot be symmetrical,
 * and a bottom-aligned scroller is not a grid. This component is currently
 * unused either way — the landing page dropped it at D-57.
 *
 * Operable without a mouse: `tabindex="0"` on the scroller means a keyboard
 * user can reach it and arrow through it, which a plain `overflow-x: auto`
 * region does not give you. `overscroll-behavior-x: contain` stops a
 * horizontal flick from triggering the browser's back gesture.
 *
 * Full-bleed by design, so it sits outside `.shell` and carries the gutter as
 * its own inline padding — the first frame starts on the text column, and the
 * last one runs off the edge of the screen, which is the signal that there is
 * more of it than fits.
 */
export function Strip() {
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Photographs of the venue"
      className="flex snap-x snap-mandatory items-end gap-md overflow-x-auto overscroll-x-contain px-[max(var(--gutter),env(safe-area-inset-left))] pb-md"
    >
      {gallery.map((photo) => {
        const tall = photo.h > photo.w;
        return (
          <figure key={photo.name} className="shrink-0 snap-center">
            <div
              data-plate
              className={`plate ${
                tall
                  ? 'h-[380px] w-[260px] md:h-[480px] md:w-[320px]'
                  : 'h-[300px] w-[420px] md:h-[380px] md:w-[540px]'
              }`}
            >
              <Frame
                photo={photo}
                sizes={tall ? '(min-width: 48rem) 320px, 260px' : '(min-width: 48rem) 540px, 420px'}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="label mt-md text-ink-3">{photo.caption}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
