import { venue } from '../data/venue';

/**
 * A slow strip of the venue's own facts between the cover and the first
 * section — the line of type that runs along the top of a printed programme.
 *
 * `aria-hidden` and `pointer-events: none`, deliberately: every fact in it is
 * stated properly elsewhere on the page, and without this a screen reader
 * hears the address twice within one screen. It is a graphic device made of
 * true sentences, not a content region.
 *
 * Two identical copies, translated by exactly half the track, so the loop has
 * no seam. Stopped dead under reduced motion (base.css).
 */
const facts = [
  venue.address.short,
  'Fri & Sat from 5 PM',
  'Sun 1 – 8 PM',
  'Functions & venue hire',
  venue.instagram.handle,
] as const;

export function Band() {
  const run = [...facts, ...facts];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-rule py-md select-none"
      style={{ pointerEvents: 'none' }}
    >
      <div className="band">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {run.map((fact, i) => (
              <span key={`${copy}-${i}`} className="label flex items-center text-ink-3">
                {fact}
                <span className="mx-lg text-brass" aria-hidden="true">
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
