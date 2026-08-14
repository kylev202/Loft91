import { happyHour } from '../data/menu';
import { SectionHead } from './SectionHead';
import { Tbc } from './ui/Tbc';

/**
 * Happy hour, set as figures.
 *
 * In a bar the happy-hour price is the loudest fact there is — it is the one
 * thing on the whole site that changes what time somebody leaves the house — so
 * it is set at `--text-figure` in brass rather than as a row in a price list.
 * This is the accent doing its actual job: marking the thing that is lit.
 *
 * Runs on both the home page (as the single highlight the index page carries)
 * and the Menu page (leading the list). One component, so the two can never
 * disagree about a price.
 *
 * MEMORY.md Q12 is open and visible in the markup: the two client posters
 * disagree about whether the $16 cocktail deal runs on Sunday. The narrower
 * reading ships — it under-promises rather than over-promises — carrying the
 * poster's own "Fri & Sat only" as a note rather than being silently widened.
 */
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

        <ul className="grid grid-cols-2 gap-x-lg gap-y-xl md:grid-cols-3 lg:grid-cols-6">
          {happyHour.items.map(({ name, price, note }) => (
            <li key={name} data-reveal>
              <p className="font-display text-figure font-medium text-brass tabular-nums">
                {price}
              </p>
              <p className="mt-2xs text-body text-ink">{name}</p>
              {note && <p className="label mt-2xs text-ink-3">{note}</p>}
            </li>
          ))}
        </ul>

        <p className="mt-2xl" data-reveal>
          <Tbc what="happy-hour scope on Sunday differs between the two posters; the narrower reading is shown" />
        </p>
      </div>
    </section>
  );
}
