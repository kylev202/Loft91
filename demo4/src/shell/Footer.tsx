import { allPages, home } from '../data/site';
import { withBase } from '../lib/base';
import { venue } from '../data/venue';
import { photos, wordmarkBlack } from '../data/photos';
import { Frame } from '../components/ui/Frame';

/**
 * The footer is the same on all eight pages, which is what makes it the right
 * place for the site's full index and its one repeated set of facts.
 *
 * Three columns — where and when, the pages, off-site — which is the reference
 * language's own footer shape and, conveniently, exactly the three things a
 * venue site owes a visitor who has read to the bottom.
 *
 * It closes on **the mark filled with the room**: the client's wordmark used as
 * an alpha mask over the neon stairwell, so the last thing on every page is the
 * venue's own letterforms with its own light inside them. On a page this quiet
 * it is the single place saturated colour is allowed to exist, which is what
 * stops the footer being three columns of grey capitals. It is the brand rather
 * than an ornament, and it costs nothing in legibility — decorative, `alt=""`,
 * with the venue name set as text directly above it. Browsers without mask
 * support get the plain ink mark.
 *
 * `view-transition-name: footer` keeps it out of the root cross-fade, so it
 * holds still while the page changes above it.
 */
export function Footer({ current }: { current: string }) {
  return (
    <footer style={{ viewTransitionName: 'footer' }} className="border-t border-rule bg-page">
      <div className="shell section-pad">
        <div className="grid gap-lg lg:grid-cols-12 xl:gap-2xl">
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
            </dl>

            {/* ⚠ This used to be a [TBC] on the hours (MEMORY.md Q1, still
                open). D-60 replaced it with contact detail — which is itself
                invented, see `venue.contact`. */}
            <ul className="mt-lg">
              <li className="border-t border-rule">
                <a
                  href={`mailto:${venue.contact.email}`}
                  className="flex min-h-11 items-center text-small text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  {venue.contact.email}
                </a>
              </li>
              <li className="border-t border-rule">
                <a
                  href={venue.contact.phoneHref}
                  className="flex min-h-11 items-center text-small text-ink-2 tabular-nums transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  {venue.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* --- The index ------------------------------------------------
              `allPages`, not `pages`: the nav shows the four destinations, and
              this is the one place the site lists itself in full — which is
              what makes the FAQ, deliberately not in the nav, reachable from
              every page rather than only from the home page's heading. */}
          <nav aria-label="All pages" className="lg:col-span-3 lg:col-start-7">
            <h2 className="label text-ink-3">Pages</h2>
            <ul className="mt-md">
              <li className="border-t border-rule">
                <a
                  href={withBase(home.href)}
                  aria-current={current === 'home' ? 'page' : undefined}
                  className="flex min-h-11 items-center gap-md text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  <span className="label text-ink-4 tabular-nums" aria-hidden="true">
                    00
                  </span>
                  Home
                </a>
              </li>
              {allPages.map(({ id, index, name, href }) => (
                <li key={id} className="border-t border-rule">
                  <a
                    href={withBase(href)}
                    aria-current={current === id ? 'page' : undefined}
                    className="flex min-h-11 items-center gap-md text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                  >
                    <span
                      className={`label tabular-nums ${current === id ? 'text-ink' : 'text-ink-4'}`}
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

            <a
              href={withBase('/enquire/')}
              className="group label mt-lg flex min-h-11 items-center gap-2xs text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
            >
              Function enquiries
              <span
                aria-hidden="true"
                className="transition-transform duration-(--dur-short) ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        {/* --- The mark, filled with the room ----------------------------
            Capped at `--container-mark` rather than run to the full shell
            (client, 2026-08-31: *"on the desktop, make the loft picture in the
            footer smaller"*). The cap sits on this wrapper so it governs the
            masked version and the no-mask fallback with one declaration and
            they cannot drift apart.

            Centred (client, same day). It is the one element in the system
            not drawn from the left edge — every rule, title and column is —
            and that is the point once the mark is capped: a 960px block held
            against the left of a 1424px footer reads as a column that ran out
            of room, where the same block on the page's own centre line reads
            as a sign-off under the three columns above it. Centring a
            full-bleed element would have meant nothing; centring a capped one
            is the whole reason the cap and this instruction arrived together. */}
        <div className="mx-auto mt-3xl max-w-(--container-mark)" aria-hidden="true">
          <div className="mark-fill">
            <Frame
              photo={photos.ascent}
              sizes="(min-width: 68rem) 960px, 92vw"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <img
            className="mark-fill-fallback w-full"
            src={wordmarkBlack.src}
            srcSet={wordmarkBlack.srcSet}
            sizes="(min-width: 68rem) 960px, 92vw"
            width={wordmarkBlack.w}
            height={wordmarkBlack.h}
            alt=""
            translate="no"
          />
        </div>

        {/* --- The venue's own way in -------------------------------------
            Client instruction, 2026-09-03: the board should be reachable
            "through the website under log in" rather than by remembering a URL.

            Under the sign-off, not inside the `Pages` index above it — and the
            distinction is the whole placement. That index is the site listing
            itself in full, and `/admin/` is deliberately not in it (see the note
            on `allPages` in data/site.ts); a staff log-in down here is where
            every venue site puts this, and it is the one position that reads as
            "the back of the bar" rather than as an eighth page.

            `rel="nofollow"` for the same reason `admin/index.html` carries
            `noindex, nofollow`: this link is now on all eight documents, and it
            is the one path a crawler could take in from a public page. */}
        <p className="mt-2xl">
          <a
            href={withBase('/admin/')}
            rel="nofollow"
            aria-current={current === 'admin' ? 'page' : undefined}
            className="label inline-flex min-h-11 items-center text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
          >
            Log in
          </a>
        </p>
      </div>
    </footer>
  );
}
