import type { MenuItem } from '../data/menu';

/**
 * One row of the menu, drinks and food alike: the name at the left edge of the
 * column, the price at the right, one hairline under it, and — where there is
 * one — the description beneath in `ink-3`.
 *
 * It is one component because the client asked for the two lists to keep the
 * same style, and two copies of a row is how they drift. The description is
 * `--text-small` (14px), one step under the name and price at `--text-item`
 * (17px): an ingredient list is a caption to the dish, not a second line of
 * equal weight. Everything else on the page stays at the sizes the drinks list
 * already used.
 *
 * `break-inside-avoid` is for the food lists, which run in CSS columns and must
 * not split a dish across the break; in the drinks grid it does nothing.
 */
export function MenuRow({ name, price, desc }: MenuItem) {
  return (
    <li className="break-inside-avoid border-b border-rule py-xs">
      <div className="flex items-baseline justify-between gap-md">
        <span className="text-item text-ink">{name}</span>
        {price && <span className="shrink-0 text-item text-ink-2 tabular-nums">{price}</span>}
      </div>
      {desc && <p className="mt-2xs text-small text-ink-3">{desc}</p>}
    </li>
  );
}
