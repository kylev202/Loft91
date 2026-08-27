import { menuGroups } from '../data/menu';
import { SectionHead } from './SectionHead';

/**
 * The drinks list, set as text.
 *
 * The client's menu exists as `assets/img/MENU.png` — 2,480px of type on a
 * black background. It ships transcribed rather than as the poster because a
 * phone can only read that image by pinch-zooming, and it is unselectable,
 * unsearchable and invisible to a screen reader. Transcribing a client-supplied
 * asset is reading a source, not inventing one, so D-05 is satisfied; the whole
 * transcription is still pending sign-off (MEMORY.md Q11) and says so.
 *
 * Two columns on desktop via CSS multi-column, so groups flow naturally at
 * whatever length they are rather than being hand-balanced into a grid. A group
 * never breaks across a column — `break-inside: avoid` — because a category
 * heading stranded at the foot of column one is worse than an uneven column.
 *
 * A group-level price is written as a full claim ("$12 each"), never as a bare
 * figure under unpriced rows, which reads as a stray number.
 */
export function DrinksList({ index }: { index: string }) {
  return (
    <section aria-labelledby="drinks" className="shell section-pad">
      <SectionHead
        index={index}
        label="The list"
        heading={<span id="drinks">Everything behind the bar</span>}
      />

      <div className="gap-2xl lg:columns-2">
        {menuGroups.map(({ id, heading, items, note }) => (
          <section
            key={id}
            className="mb-2xl break-inside-avoid"
            aria-labelledby={`group-${id}`}
            data-reveal
          >
            <div className="flex items-baseline justify-between gap-md border-b border-rule-strong pb-2xs">
              <h3 id={`group-${id}`} className="font-display text-lead text-ink">
                {heading}
              </h3>
              {note && <p className="label shrink-0 text-ink-3">{note}</p>}
            </div>

            <ul>
              {items.map(({ name, price, desc }) => (
                <li key={name} className="border-b border-rule py-xs">
                  <div className="flex items-baseline justify-between gap-md">
                    <span className="text-item text-ink">{name}</span>
                    {price && (
                      <span className="shrink-0 text-item text-ink-2 tabular-nums">{price}</span>
                    )}
                  </div>
                  {desc && <p className="mt-2xs text-small text-ink-3">{desc}</p>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
