import { hoursSummary, venue } from '../data/venue';

/**
 * The band — the strip of type that runs along a printed programme, moving
 * slowly between the cover and the menu.
 *
 * Every fact in it is real and comes from `venue.ts`; none of it is new
 * information, which is the point. It is `aria-hidden` because a screen reader
 * would otherwise hear the address and the hours twice within one screen, and
 * it is `pointer-events: none` because there is nothing in it to click.
 *
 * Two identical copies, translated by exactly half the track, so the loop has
 * no seam. Under reduced motion the animation is off and it simply sits there
 * as a line of type, which is a perfectly good thing for it to be.
 */
const items = [
  venue.name,
  `Upstairs at ${venue.address.line1.replace('Upstairs, ', '')}`,
  'Footscray',
  hoursSummary,
];

function Track() {
  return (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex shrink-0 items-center">
          <span className="px-lg whitespace-nowrap">{item}</span>
          <span className="text-ink-3">·</span>
        </span>
      ))}
    </span>
  );
}

export function Band() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none overflow-hidden border-y border-ink py-md select-none"
    >
      <div className="band font-display text-band font-medium tracking-tight text-ink uppercase">
        <Track />
        <Track />
      </div>
    </div>
  );
}
