import { Frame } from './ui/Frame';
import type { Photo } from '../data/photos';

/**
 * One wide photograph inside a section, captioned — the `.feature` block from
 * `demo/`, rebuilt on this system's plate.
 *
 * Its job on the home page is the job it had there: the Menu and Packages
 * sections are otherwise a long run of type on flat ground, and this is the
 * picture that breaks it. 4:3 on a phone, a 16:9 band once there is width —
 * a full-bleed 4:3 on a desktop is a photograph you have to scroll past.
 *
 * `coverFor` is what makes the click-through morph: the taps frame here is the
 * Menu page's own cover photograph, so pressing into `/menu/` expands *this*
 * picture into that page's cover rather than cutting to it. `lib/transitions.ts`
 * finds it by destination.
 */
export function Feature({
  photo,
  coverFor,
  caption,
  compact = false,
}: {
  photo: Photo;
  coverFor?: string;
  /** Defaults to the photograph's own caption from `photos.ts`. */
  caption?: string;
  /** Drops the figure's own bottom margin — for when a caller is placing it
      inside a grid alongside other content and owns the spacing itself. */
  compact?: boolean;
}) {
  return (
    <figure className={compact ? '' : 'mb-2xl'}>
      <div
        data-plate
        data-cover-for={coverFor}
        className="plate aspect-4/3 w-full md:aspect-16/9"
      >
        <Frame
          photo={photo}
          sizes="(min-width: 90rem) 1560px, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <figcaption className="label mt-md text-ink-3" data-reveal>
        {caption ?? photo.caption}
      </figcaption>
    </figure>
  );
}
