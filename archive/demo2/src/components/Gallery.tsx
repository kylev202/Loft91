import { gallery } from '../data/photos';
import { Plate } from './ui/Plate';
import { SectionHead } from './ui/SectionHead';
import { Tbc } from './ui/Tbc';

/**
 * Gallery — a monograph sequence, not a carousel and not a pinned horizontal
 * scroll.
 *
 * The plates run down the page on a twelve-column grid at deliberately uneven
 * widths and offsets, each numbered and captioned, the way colour plates are set
 * in a book. That is the whole reason for the change: a pin hijacks the scroll
 * to *perform*, and this system does not perform. It also means the sequence
 * behaves identically on a phone, under reduced motion, and with JavaScript
 * broken — there is no second version of it to maintain or to get wrong.
 *
 * Sequenced as the arrival actually happens: the stairs from the street, up
 * them, the bar, the room, and the sign you read on the way out.
 */

/** Column spans and offsets, per plate, on the 12-column desktop grid. The
    unevenness is the composition — a uniform grid of photographs is a contact
    sheet, which is a different thing and a worse one here. */
const layout = [
  'lg:col-span-5 lg:col-start-1',
  'lg:col-span-4 lg:col-start-8 lg:mt-2xl',
  'lg:col-span-8 lg:col-start-1',
  'lg:col-span-3 lg:col-start-10 lg:mt-[-6rem]',
  'lg:col-span-7 lg:col-start-2',
  'lg:col-span-5 lg:col-start-1 lg:mt-2xl',
  'lg:col-span-4 lg:col-start-8 lg:mt-[-10rem]',
];

export function Gallery() {
  return (
    <section id="gallery" aria-labelledby="gallery-h" className="section-pad">
      <div className="shell">
        <SectionHead index="03" id="gallery" title="Gallery">
          The stairs from the street, the bar at the top of them, and the room
          behind it.
        </SectionHead>

        <p className="-mt-md mb-2xl" data-reveal>
          <Tbc from="client or a copywriting pass">venue story copy</Tbc>
        </p>

        <div className="grid gap-x-lg gap-y-2xl lg:grid-cols-12">
          {gallery.map((photo, i) => (
            <div key={photo.name} className={layout[i]}>
              <Plate
                photo={photo}
                sizes="(min-width: 64rem) 40vw, 100vw"
                // The first plate is what a visitor scrolling here sees first;
                // everything after it stays lazy.
                priority={i === 0}
                className={photo.h > photo.w ? 'aspect-3/4' : 'aspect-4/3'}
                caption={photo.caption}
                index={String(i + 1).padStart(2, '0')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
