import { happyHour } from '../data/menu';
import { SectionHead } from './SectionHead';
import { Tbc } from './ui/Tbc';

/**
 * Happy hour — the panel from `demo/`, rebuilt in this system's type and
 * colour.
 *
 * The design is that page's `.happy` block and the reasoning is its own:
 * **prominence comes from the panel, the rule weight and the position, not from
 * the accent.** A raised surface inside a hairline, the label and the trading
 * window held together on the left, and the prices as ruled rows beside them —
 * two columns once there is width, so the block is three rows tall rather than
 * six and the head does not sit over a dead half.
 *
 * So the figures are full ink rather than brass. That is a deliberate departure
 * from the earlier build of this page, where the prices were set at
 * `--text-figure` in the accent: brass is a light source in this system and
 * marking a whole six-item list with it spends the entire accent budget on one
 * block. Here the panel does that job instead, which is the more minimal answer
 * and the one `demo/` argued for.
 *
 * Zodiak on the trading window, because in `demo/` that line is set in *its*
 * `--font-display`, which is Zodiak — the serif is the voice for a line that is
 * written rather than labelled. Mapped to `--font-editorial`, which is the same
 * face in this system.
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
 * MEMORY.md Q12 is open and visible in the markup: the two client posters
 * disagree about whether the $16 cocktail deal runs on Sunday. The narrower
 * reading ships — it under-promises rather than over-promises — carrying the
 * poster's own "Fri & Sat only" as a note rather than being silently widened.
 */
export function HappyHourPanel({
  head = true,
  onPanel = false,
}: {
  head?: boolean;
  /** Set where the panel sits on `--color-panel` rather than on the page, so it
      takes the step above instead of disappearing into its own ground. There is
      no elevation system here — there are two surface tones and a hairline —
      which is exactly why which one is used has to be chosen rather than
      defaulted. */
  onPanel?: boolean;
}) {
  return (
    <div
      data-reveal
      className={`rounded-lg border border-rule-strong p-lg md:p-xl ${
        onPanel ? 'bg-panel-2' : 'bg-panel'
      } ${head ? 'md:grid md:grid-cols-[1fr_1.4fr] md:items-start md:gap-xl' : ''}`}
    >
      {head && (
        <div className="mb-md md:mb-0">
          <p className="label text-ink-3">Happy hour</p>
          <p className="mt-2xs font-editorial text-lead text-balance text-ink">{happyHour.when}</p>
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
    <section aria-labelledby="happy-hour" className="bg-panel">
      <div className="shell section-pad">
        <SectionHead
          index={index}
          label="Happy hour"
          heading={<span id="happy-hour">{heading}</span>}
          standfirst={happyHour.when}
        />

        {/* The head is already above it, so the panel drops its own; and this
            section's ground is `--color-panel`, so the block takes the step
            above rather than vanishing into it. */}
        <HappyHourPanel head={false} onPanel />

        <p className="mt-2xl" data-reveal>
          <Tbc what="happy-hour scope on Sunday differs between the two posters; the narrower reading is shown" />
        </p>
      </div>
    </section>
  );
}
