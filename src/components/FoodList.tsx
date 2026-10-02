import { foodVenues } from '../data/menu';
import { MenuRow } from './MenuRow';
import { SectionHead } from './SectionHead';

/**
 * The food menu, below the drinks: two restaurants that trade from the venue,
 * each with its own printed menu, so each gets its own section rather than a
 * merged list.
 *
 * A section opens the way every other section head on the site does — an ink
 * rule, the restaurant's own tagline as the label ("A taste of Vietnam by"),
 * and its name as the heading beneath. Read straight across, that is the
 * phrase the menu is printed with.
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
 * can land on its rule rather than on the heading beneath it — the cover's
 * "Food menu" button targets the first. `base.css` gives every `[id]` the
 * running head's height as `scroll-margin-top`.
 */
export function FoodList() {
  return (
    <div id="food" className="shell section-pad">
      <div className="flex flex-col gap-2xl">
        {foodVenues.map(({ id, tagline, name, items }) => (
          <section key={id} id={id} aria-labelledby={`food-${id}`}>
            <SectionHead label={tagline} heading={<span id={`food-${id}`}>{name}</span>} />

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
