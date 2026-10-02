import { happyHour } from '../data/menu';
import { SectionHead } from './SectionHead';

/**
 * Happy hour — a panel of prices inside a hairline.
 *
 * **Prominence comes from the panel, the rule weight and the position.** That
 * was already true in Nocturne, where it was argued as a departure: the earlier
 * build set these prices at `--text-figure` in the accent, and marking a whole
 * six-item list with the one light source in the system spent the entire accent
 * budget on a single block.
 *
 * Here that argument is not a departure, it is the only option — there is no
 * accent hue to spend. The block is distinguished by taking the panel tone
 * against the page, by a slightly heavier hairline than the rows inside it, and
 * by sitting first in the section. That is the whole vocabulary, and it turns
 * out to be enough, which is the case the reference language makes generally.
 *
 * The corners are square. The panel carried a 16px radius in Nocturne; radius
 * is zero everywhere in this system, so a "raised block" is a tone step and a
 * border and nothing else.
 *
 * The trading window is set in the display serif, because it is a line that is
 * written rather than labelled — the same reason the page statements are.
 *
 * Two exports so the two surfaces that carry happy hour share one set of
 * prices:
 *
 *   `HappyHourPanel`  the block itself. The home page's Menu section is built
 *                     around it — that section keeps happy hour in full and
 *                     sends the rest of the list to `/menu/`.
 *   `HappyHour`       the same panel as its own section, leading `/menu/`,
 *                     where the section head already says "Happy hour" and
 *                     prints the window — so the panel drops its own head
 *                     rather than saying both twice.
 *
 * MEMORY.md Q12 is still open: the two client posters disagree about whether
 * the $16 cocktail deal runs on Sunday. The narrower reading still ships — it
 * under-promises rather than over-promises — carrying the poster's own "Fri &
 * Sat only" as a note rather than being silently widened. What is gone is the
 * [TBC] that used to say so under the panel (D-60); the disagreement is now
 * recorded only in `data/menu.ts` and MEMORY.md Q12.
 */
export function HappyHourPanel({
  head = true,
  onPanel = false,
}: {
  head?: boolean;
  /** Set where the panel sits on `--color-panel` rather than on the page, so it
      takes the step above instead of disappearing into its own ground. There is
      no elevation system here — there are three surface tones and a hairline —
      which is exactly why which one is used has to be chosen rather than
      defaulted. */
  onPanel?: boolean;
}) {
  return (
    <div
      data-reveal
      className={`rounded-plate border border-rule-strong p-lg md:p-xl ${
        onPanel ? 'bg-panel-2' : 'bg-panel'
      } ${head ? 'md:grid md:grid-cols-[1fr_1.4fr] md:items-start md:gap-xl' : ''}`}
    >
      {head && (
        <div className="mb-md md:mb-0">
          <p className="label text-ink-3">Happy hour</p>
          <p className="mt-2xs font-display text-lead text-balance text-ink">{happyHour.when}</p>
        </div>
      )}

      {/* Two columns once there is room. The bottom row of *each* column loses
          its rule — with row flow that is always the last two items, whether
          the count is odd or even — so the list ends on the panel's padding
          rather than on a hairline running into it. */}
      <ul className="lg:grid lg:grid-cols-2 lg:gap-x-xl">
        {happyHour.items.map(({ name, price, note }) => (
          <li
            key={name}
            className="flex items-baseline justify-between gap-md border-b border-rule py-2xs text-item text-ink last:border-b-0 lg:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <span>
              {name}
              {note && <span className="ml-2xs text-small text-ink-3">{note}</span>}
            </span>
            <span className="shrink-0 tabular-nums">{price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HappyHour({ index, heading }: { index?: string; heading: string }) {
  return (
    /* `frame` + `shell-inset`, like every other tinted ground since
       2026-08-31 — the tint stops short of the screen and the content inside
       still lands on the page's own left edge. This section is not mounted
       anywhere today (see the note at the top of home.tsx); it is kept in step
       so reinstating it does not reintroduce the one full-bleed band on an
       otherwise framed site. */
    <section aria-labelledby="happy-hour" className="frame">
      <div className="rounded-plate bg-panel">
        <div className="shell-inset section-pad">
          {/* ⚠ The trading window used to be this head's standfirst.
              `SectionHead` no longer takes one (2026-08-31, the site-wide copy
              cut), and this section passes `head={false}` below, so as it
              stands the window is stated nowhere in it. Nothing renders this
              component today; if it is ever reinstated, drop the `head={false}`
              so the panel states the window itself — that is the only thing
              this edit took out of it. */}
          <SectionHead
            index={index}
            label="Happy hour"
            heading={<span id="happy-hour">{heading}</span>}
          />

          {/* The head is already above it, so the panel drops its own; and this
              section's ground is `--color-panel`, so the block takes the step
              above rather than vanishing into it. */}
          <HappyHourPanel head={false} onPanel />
        </div>
      </div>
    </section>
  );
}
