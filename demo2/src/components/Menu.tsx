import { happyHour, menuGroups, menuTbc } from '../data/menu';
import { photos } from '../data/photos';
import { Plate } from './ui/Plate';
import { SectionHead } from './ui/SectionHead';

/**
 * Menu — and the page's single emphasis device.
 *
 * There is no accent hue in this system, so the section that most needs weight
 * inverts instead: the whole block goes to ink and every token inside it flips
 * (see `.on-ink` in base.css). That is not decoration — a drinks list printed
 * white-on-black *is* what the card behind the bar looks like, and it is the one
 * section a visitor reads rather than scans.
 *
 * Set as a printed list, not a table and not cards: category in the editorial
 * serif, then rows of item · description · price on hairlines, at 18px — the
 * largest sustained type on the page after the hero, because in a bar the list
 * is the thing you came to read.
 *
 * All of it is real and client-sourced (MEMORY.md D-22), transcribed from the
 * venue's own printed menu rather than invented, and still pending client
 * sign-off (Q11) — which is what the marker at the foot of the section says.
 */
export function Menu() {
  return (
    <section id="menu" aria-labelledby="menu-h" className="on-ink section-pad">
      <div className="shell">
        <SectionHead index="01" id="menu" title="Menu">
          Drinks, poured upstairs.
        </SectionHead>

        <HappyHour />

        <div className="mt-2xl grid gap-x-2xl gap-y-xl md:grid-cols-2 xl:grid-cols-3">
          {menuGroups.map((group) => (
            <section key={group.id} aria-labelledby={`mg-${group.id}`} data-reveal className="break-inside-avoid">
              <h3
                id={`mg-${group.id}`}
                className="border-b border-rule-strong pb-2xs font-editorial text-editorial text-ink"
              >
                {group.heading}
              </h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item.name} className="border-b border-rule py-sm last:border-b-0">
                    <div className="flex items-baseline justify-between gap-md">
                      <span className="min-w-0 text-item text-ink">{item.name}</span>
                      {item.price ? (
                        // Tabular figures, column-locked. Non-tabular numerals
                        // in a price column are the most common amateur tell.
                        <span className="shrink-0 text-item text-ink-2 tabular-nums">
                          {item.price}
                        </span>
                      ) : null}
                    </div>
                    {item.desc ? (
                      <p className="mt-1 max-w-measure text-pretty text-small text-ink-3">
                        {item.desc}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
              {group.note ? (
                <p className="mt-2xs text-small text-ink-3 tabular-nums">{group.note}</p>
              ) : null}
            </section>
          ))}
        </div>

        <p className="mt-2xl" data-reveal>
          <span className="tbc" aria-label="Content to be confirmed">
            <span className="label mr-2xs">[TBC]</span>
            {menuTbc}
          </span>
        </p>
      </div>

      {/* One plate inside the ink block — the bar the list is poured at. It is
          the only image in this section, and it earns its place by being the
          thing the whole section describes. */}
      <div className="shell mt-2xl" data-reveal>
        <Plate
          photo={photos.taps}
          sizes="(min-width: 90rem) 1600px, 100vw"
          className="aspect-4/5 md:aspect-[21/9]"
          caption="The bar, upstairs at 91 Nicholson"
        />
      </div>
    </section>
  );
}

/**
 * Happy hour leads the section, because it is the one thing on this page that
 * changes what time somebody leaves the house. Set as a band of six figures
 * across the top of the ink block rather than as a list, so it reads at a
 * glance from across a room.
 */
function HappyHour() {
  return (
    <div data-reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-x-md gap-y-2xs border-b border-rule-strong pb-2xs">
        <p className="title text-ink">Happy hour</p>
        <p className="label text-ink-3 tabular-nums">{happyHour.when}</p>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {happyHour.items.map((item) => (
          <li
            key={item.name}
            className="border-b border-rule py-md md:border-r md:pr-md md:nth-[3n]:border-r-0 xl:nth-[3n]:border-r xl:nth-[6n]:border-r-0"
          >
            <p className="font-display text-figure font-medium tracking-tight text-ink tabular-nums">
              {item.price}
            </p>
            <p className="mt-2xs text-small text-ink-2">{item.name}</p>
            {item.note ? <p className="label mt-1 text-ink-3">{item.note}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
