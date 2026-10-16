import { foodVenues } from '../data/menu';
import { MenuRow } from './MenuRow';

/**
 * The food menu, below the drinks: two restaurants that trade from the venue,
 * each with its own printed menu, so each gets its own section rather than a
 * merged list.
 *
 * A section opens the way the drinks list does — a bare `.rule-ink`, full
 * width, with a label underneath — rather than `SectionHead`'s heavier rule
 * + index + label + heading. The drinks list, the food sections and the
 * drink groups between them are all one list of groups at one weight; giving
 * food its own heading-level treatment read as a second design grafted onto
 * the same page. The restaurant's tagline and name are combined into the
 * printed phrase ("A taste of Vietnam by Co Thu Quan") and set as that one
 * label, the same tracking and — on the window view, `lg` up — the same
 * larger size as "Drink list" (client instruction: section head largest,
 * then a drink group's heading, then a row — stepped down a level across the
 * board on 2026-10-16, when the first pass read too big). Phone keeps the
 * shared `.label` size for all three.
 *
 * The rows are the drinks list's own — both render `MenuRow`, so the two lists
 * cannot drift in size or tone — and the food reads as the same list continued
 * rather than as a second design. One thing differs because the content does:
 * a dish is a single flat list rather than a set of small groups, so it runs in
 * two CSS columns from `lg` rather than a grid of groups, and `MenuRow`'s
 * `break-inside-avoid` keeps a dish from splitting across the column break.
 * Columns fill top to bottom, which keeps the restaurant's own order — the
 * printed menu is not grouped, so nothing here invents a grouping.
 *
 * Each section carries its restaurant's id (`co-thu-quan`, `juk-jut`) so a link
 * can land on its rule — the cover's "Food menu" button targets the first.
 * `base.css` gives every `[id]` the running head's height as
 * `scroll-margin-top`.
 */
export function FoodList() {
  return (
    <div id="food" className="shell section-pad">
      <div className="flex flex-col gap-2xl">
        {foodVenues.map(({ id, tagline, name, items }) => (
          <section key={id} id={id} aria-labelledby={`food-${id}`}>
            <div className="rule-ink w-full" data-reveal />
            <h2 id={`food-${id}`} className="label mt-xs mb-md text-ink lg:text-heading" data-reveal>
              {tagline} {name}
            </h2>

            <ul className="lg:columns-2 lg:gap-x-2xl" data-reveal>
              {items.map((item) => (
                <MenuRow key={item.name} {...item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
