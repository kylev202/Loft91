import { pages, home } from '../data/site';
import { venue } from '../data/venue';
import { photos, wordmarkWhite } from '../data/photos';
import { Frame } from '../components/ui/Frame';
import { Tbc } from '../components/ui/Tbc';

/**
 * The footer is the same on all five pages, which is what makes it the right
 * place for the site's full index and its one repeated set of facts.
 *
 * It closes on **the mark filled with the room**: the client's wordmark used as
 * an alpha mask over the neon stairwell, so the last thing on every page is the
 * venue's own letterforms with its own light inside them. It is the only
 * saturated colour in the interface, it is the brand rather than an ornament,
 * and it costs nothing in legibility — it is decorative, `alt=""`, and the
 * venue name is set as text directly above it. Browsers without mask support
 * get the plain white mark.
 *
 * `view-transition-name: footer` keeps it out of the root cross-fade, so it
 * holds still while the page changes above it.
 */
export function Footer({ current }: { current: string }) {
  return (
    <footer
      style={{ viewTransitionName: 'footer' }}
      className="border-t border-rule bg-page"
    >
      <div className="shell section-pad">
        <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
          {/* --- Where and when ------------------------------------------- */}
          <div className="lg:col-span-5">
            <h2 className="wordmark text-lead text-ink">{venue.wordmark}</h2>

            <address className="mt-md text-body text-ink-2 not-italic">
              {venue.address.line1}
              <br />
              {venue.address.line2}
            </address>

            <dl className="mt-lg grid grid-cols-[auto_1fr] gap-x-lg gap-y-2xs text-small">
              {venue.hours.map(({ day, opens, closes }) => (
                <div key={day} className="col-span-2 grid grid-cols-subgrid">
                  <dt className="text-ink-3">{day}</dt>
                  <dd className="text-ink tabular-nums">
                    {opens} – {closes}
                  </dd>
                </div>
              ))}
              <div className="col-span-2 grid grid-cols-subgrid">
                <dt className="text-ink-3">{venue.hoursGap.days}</dt>
                <dd className="text-ink-3">{venue.hoursGap.state}</dd>
              </div>
            </dl>

            <p className="mt-md">
              <Tbc what={venue.hoursTbc} />
            </p>
          </div>

          {/* --- The index ------------------------------------------------ */}
          <nav aria-label="All pages" className="lg:col-span-3 lg:col-start-7">
            <h2 className="label text-ink-3">Pages</h2>
            <ul className="mt-md">
              <li className="border-t border-rule">
                <a
                  href={home.href}
                  aria-current={current === 'home' ? 'page' : undefined}
                  className="flex min-h-11 items-center gap-md text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  <span className="label text-ink-4 tabular-nums" aria-hidden="true">
                    00
                  </span>
                  Home
                </a>
              </li>
              {pages.map(({ id, index, name, href }) => (
                <li key={id} className="border-t border-rule">
                  <a
                    href={href}
                    aria-current={current === id ? 'page' : undefined}
                    className="flex min-h-11 items-center gap-md text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                  >
                    <span
                      className={`label tabular-nums ${current === id ? 'text-brass' : 'text-ink-4'}`}
                      aria-hidden="true"
                    >
                      {index}
                    </span>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- Off-site -------------------------------------------------- */}
          <div className="lg:col-span-3">
            <h2 className="label text-ink-3">Elsewhere</h2>
            <ul className="mt-md">
              <li className="border-t border-rule">
                <a
                  href={venue.instagram.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex min-h-11 items-center text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  Instagram {venue.instagram.handle}
                </a>
              </li>
              <li className="border-t border-rule">
                <a
                  href={venue.maps}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex min-h-11 items-center text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  Google Maps
                </a>
              </li>
            </ul>

            <p className="mt-lg">
              <Tbc what={venue.bookings.tbc} />
            </p>
          </div>
        </div>

        {/* --- The mark, filled with the room ---------------------------- */}
        <div className="mt-3xl" aria-hidden="true">
          <div className="mark-fill">
            <Frame
              photo={photos.ascent}
              sizes="100vw"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <img
            className="mark-fill-fallback w-full"
            src={wordmarkWhite.src}
            srcSet={wordmarkWhite.srcSet}
            sizes="100vw"
            width={wordmarkWhite.w}
            height={wordmarkWhite.h}
            alt=""
            translate="no"
          />
        </div>

        <p className="mt-lg text-small text-ink-3">
          Demo build. Facts sourced from the venue’s own listings and artwork; every
          unconfirmed item is marked <span className="label text-brass">[TBC]</span>.
        </p>
      </div>
    </footer>
  );
}
