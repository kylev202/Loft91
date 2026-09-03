import { mount } from '../lib/mount';
import { AdminBoard } from '../components/AdminBoard';
import { Button } from '../components/ui/Button';
import { venue } from '../data/venue';

/**
 * `/admin/` — the venue's own board. Every enquiry submitted through
 * `/enquire/`, newest first, with the customer's details one tap from a reply.
 *
 * ── It is a real document, and it is not in the site ──────────────────────
 * It is built by Vite like the other seven, and it is reachable by typing its
 * URL. It is deliberately absent from `pages`, from `allPages` and therefore
 * from the nav, the phone menu and the footer index — the site lists itself in
 * full in the footer, and this is not part of the site the way `/faq/` is. It
 * is the back of the bar.
 *
 * `noindex, nofollow` is set in `admin/index.html` for the same reason.
 *
 * ── There is no password on it, and that is deliberate ────────────────────
 * A static site cannot authenticate anybody. Any gate written here would be a
 * check the page performs on itself, with the answer sitting in the JavaScript
 * that performs it — anyone who can open the page can read the password out of
 * the bundle. A lock that opens for everyone is worse than no lock, because it
 * is the one that gets trusted.
 *
 * What actually protects this page is that there is nothing behind it: the
 * board reads `localStorage`, which is per-browser, so a stranger opening this
 * URL sees an empty board. Real access control arrives with the backend that
 * answers MEMORY.md Q3, and it belongs there, not here.
 *
 * ── No cover photograph ──────────────────────────────────────────────────
 * Every public page opens on a plate of the room. This one opens on the words
 * alone — the same eyebrow, rule and display title the covers set, without the
 * picture above them. A 46svh photograph of the bar is the right first thing on
 * a page that is selling the room and the wrong first thing on a page the owner
 * opens to find a phone number. The type is identical, so it still reads as the
 * same site; it just does not spend a screen on atmosphere.
 */
mount(
  'admin',
  <>
    <header className="shell pt-(--gutter) pb-lg">
      <p className="label flex items-baseline gap-xs text-ink-3" data-cover-tail>
        <span className="text-ink">Venue only</span>
      </p>

      <div className="rule-ink mt-sm w-full" data-cover-rule />

      <div className="mt-lg grid gap-lg lg:grid-cols-12 lg:gap-x-xl">
        <h1 className="line-mask lg:col-span-7" data-cover-line>
          <span className="block font-display text-display uppercase text-ink">Enquiries</span>
        </h1>

        <div className="lg:col-span-5 lg:col-start-8 lg:self-end lg:pb-2xs">
          <div className="mt-xl flex flex-wrap gap-sm lg:mt-0" data-cover-tail>
            <Button href="/enquire/" variant="secondary">
              Open the form
            </Button>
            <Button href={`mailto:${venue.contact.email}`} variant="secondary">
              The venue inbox
            </Button>
          </div>
        </div>
      </div>
    </header>

    <section aria-labelledby="board" className="shell section-pad">
      <h2 id="board" className="sr-only">
        Enquiries received
      </h2>

      {/* ⚠ The honesty notice. Set in the same voice as the demo-build note in
          the footer, because it is the same kind of statement: what this page
          is, and what it is not. Do not remove it while the build is static —
          an owner who believes this board is their inbox will miss a booking
          that was sent to them by email and never appeared here. */}
      <p className="mb-xl max-w-(--container-measure) text-small text-ink-3" data-reveal>
        <span className="label text-ink">Local to this browser.</span> This build has no server, so
        an enquiry is recorded in the browser it was submitted in — this board shows what was
        submitted on this device, and nothing else. The enquiry itself reaches {venue.name} as an
        email sent by the customer to {venue.contact.email}; that inbox is the record, and this is a
        working model of it. Anyone who opens this URL can read whatever is on it, so treat it as an
        unlocked page.
      </p>

      <AdminBoard />
    </section>
  </>,
);
