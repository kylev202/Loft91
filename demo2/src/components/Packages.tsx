import { photos } from '../data/photos';
import { Button } from './ui/Button';
import { Plate } from './ui/Plate';
import { SectionHead } from './ui/SectionHead';
import { Tbc } from './ui/Tbc';

/**
 * Packages — the section with the least to say, because every tier, capacity,
 * inclusion and price is still outstanding (MEMORY.md §5, Q6).
 *
 * So it is built to structure only. No invented package names, no plausible
 * capacities, no placeholder prices — a made-up minimum spend published on a
 * real venue's site is a commercial claim the venue never made (D-05). Each
 * column says exactly what is missing and who it comes from, and the enquiry
 * path reads "Enquire for pricing", which is true whether or not pricing is
 * eventually published.
 *
 * **Columns divided by vertical rules, not cards.** With three-quarters of the
 * content missing, a card is a box with a hole in it; a column is just a column
 * that has not been filled yet. It is also how a printed rate card is set.
 */
export function Packages() {
  return (
    <section id="packages" aria-labelledby="packages-h" className="section-pad">
      <div className="shell">
        <SectionHead index="02" id="packages" title="Packages">
          The room, for whatever you are putting in it.
        </SectionHead>

        <Plate
          photo={photos.room}
          sizes="(min-width: 90rem) 1600px, 100vw"
          className="aspect-3/2 md:aspect-[21/9]"
          caption="Set for a function"
          index="—"
        />

        <div className="mt-2xl grid border-t border-ink md:grid-cols-3">
          {[3, 2, 2].map((lines, i) => (
            <article
              key={i}
              data-reveal
              className="flex flex-col gap-md border-b border-rule py-lg md:border-b-0 md:pr-lg md:not-first:border-l md:not-first:border-rule md:not-first:pl-lg md:last:pr-0"
            >
              <p className="label text-ink-3 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="font-editorial text-editorial text-ink">
                <Tbc>package name</Tbc>
              </p>
              <p>
                <Tbc>capacity &amp; duration</Tbc>
              </p>
              {/* The placeholder occupies the dimensions the real content will
                  occupy — otherwise every layout decision here is made against a
                  lie and re-breaks the day the client answers. */}
              <ul aria-label="Inclusions, to be confirmed" className="flex flex-col gap-xs">
                {Array.from({ length: lines }, (_, n) => (
                  <li key={n} aria-hidden="true">
                    <span
                      className="block h-px bg-ink-4"
                      style={{ width: `${[86, 62, 74][n % 3]}%` }}
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-sm">
                {/* Never a placeholder number. */}
                <Button to="visit" variant="line">
                  Enquire for pricing
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
