import type { MenuItem } from '../data/menu';

/**
 * One row of the menu, drinks and food alike: the name at the left edge of the
 * column, the price at the right, one hairline under it, and — where there is
 * one — the description beneath in `ink-3`.
 *
 * It is one component because the client asked for the two lists to keep the
 * same style, and two copies of a row is how they drift. The name, price and
 * description are all `--text-small` (14px) — stepped down from the name and
 * price's old `--text-item` (17px) on client instruction, 2026-10-16, when
 * the first pass read too big. There is no token below `--text-small` to put
 * the description at instead (`--text-body` is the site's 16px floor, and
 * `--text-label` is reserved for uppercase tracked eyebrow text), so the
 * description now reads at the same size as the name and price, distinguished
 * from them by tone (`ink-3`) alone — the system's own vocabulary elsewhere.
 *
 * `break-inside-avoid` is for the food lists, which run in CSS columns and must
 * not split a dish across the break; in the drinks grid it does nothing.
 */
export function MenuRow({ name, price, desc }: MenuItem) {
  return (
    <li className="break-inside-avoid border-b border-rule py-xs">
      <div className="flex items-baseline justify-between gap-md">
        <span className="text-small text-ink">{name}</span>
        {price && <span className="shrink-0 text-small text-ink-2 tabular-nums">{price}</span>}
      </div>
      {desc && <p className="mt-2xs text-small text-ink-3">{desc}</p>}
    </li>
  );
}
