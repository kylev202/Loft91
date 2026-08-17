import { venue } from '../data/venue';
import { photos, srcSet, wordmarkBlack } from '../data/photos';
import { Tbc } from './ui/Tbc';

/**
 * The colophon — and the page's last moment.
 *
 * The wordmark is set full width across the foot, and the venue's own
 * letterforms are used as an **alpha mask** over the neon stairwell: the
 * mark is filled with the room. It is the one piece of saturated colour in the
 * entire interface, it is the brand rather than an ornament, and it costs
 * nothing in legibility — it is decorative, the name is set as text three lines
 * above it, and browsers without mask support get the plain black mark.
 *
 * Nothing else down here. A fat footer on a six-section site is filler.
 * Australian venues commonly carry liquor-licence detail; whether this one
 * must, and in what words, is the client's and their lawyer's call (Q8).
 */
export function Footer() {
  return (
    <footer className="border-t border-ink">
      <div
        className="shell pt-lg pb-lg"
        style={{ paddingBottom: 'max(var(--spacing-lg), env(safe-area-inset-bottom))' }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-xl gap-y-md">
          <p className="label text-ink-3">
            <span translate="no">Loft&nbsp;91</span> · {venue.address.line2}
          </p>
          <p>
            <a
              href={venue.instagram.url}
              target="_blank"
              rel="noopener"
              className="label inline-flex min-h-11 items-center text-ink underline decoration-rule-strong underline-offset-[0.4em] transition-[text-decoration-color] duration-(--dur-micro) ease-out hover:decoration-ink"
            >
              Instagram
            </a>
          </p>
          <p>
            <Tbc>liquor licence &amp; legal line</Tbc>
          </p>
        </div>

        <div className="mt-xl overflow-hidden" data-plate>
          <img
            className="mark-fill-fallback w-full"
            src={wordmarkBlack.src}
            srcSet={wordmarkBlack.srcSet}
            sizes="100vw"
            alt=""
            width={wordmarkBlack.w}
            height={wordmarkBlack.h}
            translate="no"
            loading="lazy"
            decoding="async"
          />
          <div className="mark-fill">
            <img
              src={`/img/${photos.ascent.name}-1600.jpg`}
              srcSet={srcSet(photos.ascent, 'jpg')}
              sizes="100vw"
              alt=""
              width={photos.ascent.w}
              height={photos.ascent.h}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
