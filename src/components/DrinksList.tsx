import { menuGroups } from '../data/menu';
import { MenuRow } from './MenuRow';

/**
 * The drinks list, set as text — and, since the menu page was reduced, the
 * whole body of that page.
 *
 * The client's menu exists as `assets/img/MENU.png` — 2,480px of type on a
 * black background. It ships transcribed rather than as the poster because a
 * phone can only read that image by pinch-zooming, and it is unselectable,
 * unsearchable and invisible to a screen reader. Transcribing a client-supplied
 * asset is reading a source, not inventing one, so D-05 is satisfied; the whole
 * transcription is still pending sign-off (MEMORY.md Q11) and says so.
 *
 * ── What changed, on client instruction ───────────────────────────────────
 * Three things, and they are one instruction each.
 *
 * **One face.** Every line on this page is the interface face — Switzer, the
 * running head's own font. The group headings were Zodiak; a serif heading over
 * a sans list is two voices on a page whose content is a single list.
 *
 * This started as the menu page's own treatment. It is now the site's: on
 * 2026-08-31 the client asked for the same thing everywhere, so `--font-display`
 * points at Switzer and the serif is off every page. The headings here are
 * uppercase and tracked for the same reason — a heading should look like a nav
 * item scaled up, which is what the client pointed at.
 *
 * **Three sizes, and a fourth for the description.** `--text-display` for the
 * page title in the cover, `--text-heading` for a group — both cut by about a
 * third on 2026-08-31, when the client said the headings were too big — and
 * `--text-item` for a row's name and price and the group-level price note. The
 * list previously ran five levels (`lead` heading, `item` row, `small`
 * description, `label` note, plus the section head's own `heading` and `lead`),
 * which is four more than a list of drinks needs. Where a distinction is still
 * wanted inside the content size it is drawn in **tone**, not in size: `ink`
 * for a name, `ink-2` for its price, `ink-3` for a description or a note. That
 * is the system's own vocabulary — weight of tone and a line — rather than a
 * new one.
 *
 * The fourth size is the client's, 2026-09-25: with the food menu added below,
 * they asked for the description to be a little smaller, on both lists. It is
 * `--text-small`, applied in `MenuRow` — the one row both this list and the
 * food list render — so the two cannot be set at different sizes.
 *
 * **Fewer elements.** The section head went: its index, label, heading and
 * standfirst restated a page whose title already says Menu, and it was the
 * source of two of the five type levels. A group opens the same way the cover
 * does — one ink rule, full width, with the heading beneath it — so the ten
 * groups read as one rhythm rather than as a list inside a section.
 *
 * **A head again, but only a rule and a label (client instruction,
 * 2026-09-25).** Every other page opens its body on a rule and a label, and
 * once the food menu went in beneath this list the page had two of them (a
 * restaurant each) and the drinks had none. It is set here rather than through
 * `SectionHead` because that component always carries a heading beneath the
 * label, and the client asked for the label alone: "Drink list", in the small
 * tracked capitals the food sections' labels use. The label is the `h2`, so the
 * outline reads Menu → Drink list → groups (`h3`), with Co Thu Quan and Juk Jut
 * alongside at the same level as Drink list.
 *
 * The first row of groups takes no rule of its own. It sits directly under the
 * head's rule and label, and a second line one label below the first reads as
 * a mistake — the food sections go rule, label, heading, and this list now
 * does the same. In one column that is the first group; from `lg` the second
 * group is the other half of that row and goes with it, so the two headings
 * still start on the same line.
 *
 * ── Layout ────────────────────────────────────────────────────────────────
 * A real two-column grid from `lg`, not CSS multi-column. Multi-column balances
 * by height, so the two columns broke at different groups and the headings down
 * the page never lined up. A grid places groups in pairs: both cells in a row
 * start on the same ink rule, both are exactly half the measure, and the ten
 * groups fill five rows with nothing left over. `break-inside` disappears with
 * it — a grid cell cannot split across a column in the first place.
 *
 * Every row is `justify-between`: the name at the left edge of the column, the
 * price at the right, one hairline under each. The group note sits at the
 * opposite end of the heading's own baseline, on the same principle — and
 * stacks under the heading below `sm`, where the pair does not fit a phone.
 */
export function DrinksList() {
  return (
    /* `id` so a link can land here. The cover's button used to ("See all
       drinks"); it now points at the food menu below, and the drinks are the
       first thing under the cover anyway. `base.css` gives every `[id]` the
       sticky running head's height as `scroll-margin-top`, so the first ink
       rule arrives clear of the nav. */
    <section id="drinks" aria-labelledby="drinks-h" className="shell section-pad">
      <div className="rule-ink w-full" data-reveal />
      <h2 id="drinks-h" className="label mt-xs mb-md text-ink" data-reveal>
        Drink list
      </h2>

      <div className="grid gap-x-2xl gap-y-xl lg:grid-cols-2">
        {menuGroups.map(({ id, heading, items, note }, i) => (
          <section key={id} aria-labelledby={`group-${id}`} data-reveal>
            {/* `.rule-ink` rather than `border-t`: with no accent hue this is
                the system's one ornament, and routing it through the component
                class is what lets the forced-colours repair in base.css reach
                it. Drawn with nothing but a background colour it would be
                forced to the system background and vanish. */}
            <div className={`rule-ink w-full ${i === 0 ? 'hidden' : i === 1 ? 'lg:hidden' : ''}`} />

            <div className="mt-sm flex flex-col gap-2xs sm:flex-row sm:items-baseline sm:justify-between sm:gap-md">
              <h3 id={`group-${id}`} className="text-heading uppercase text-ink">
                {heading}
              </h3>
              {/* A group-level price is written as a full claim ("$12 each"),
                  never as a bare figure under unpriced rows. */}
              {note && <p className="text-item text-ink-3 tabular-nums sm:shrink-0">{note}</p>}
            </div>

            <ul className="mt-md">
              {items.map((item) => (
                <MenuRow key={item.name} {...item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
