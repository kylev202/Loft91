import { useState } from 'react';
import { mount } from '../lib/mount';
import { AdminBoard } from '../components/AdminBoard';
import { AdminLogin } from '../components/AdminLogin';
import { readSession, signOut } from '../lib/auth';
import { withBase } from '../lib/base';
import { wordmarkBlack } from '../data/photos';

/**
 * `/admin/` — the venue's own board. Every enquiry from `/enquire/`, one line
 * each, with the customer's details one tap from a reply.
 *
 * ── It is a tool, so it does not wear the site ────────────────────────────
 * It mounts `bare` (see `shell/Page`): no loader, no nav, no footer. The
 * furniture that makes the other seven documents cohere is dead weight here —
 * a nav offering Menu, Packages and Gallery to somebody reading a booking, and
 * a footer restating the trading hours, the site index and a full-width masked
 * wordmark underneath a list of customer phone numbers. In its place is the
 * slim bar below: the mark, which is the way back to the site, and Log out.
 *
 * It is still absent from `pages`, from `allPages` and therefore from the site
 * index, and `admin/index.html` still carries `noindex, nofollow`. The one
 * route in is the "Log in" link at the foot of the footer.
 *
 * ── The passphrase is a latch, not a lock ─────────────────────────────────
 * There is no server, so the check happens in the page against a value that
 * ships in the page — the full argument, and the reason it is still worth
 * having, is in the header of `lib/auth.ts`. It stops the next person to pick
 * up the phone behind the bar reading a customer's number off a screen left
 * open; it is not protecting the enquiries, which are held in this browser and
 * nowhere else.
 *
 * That was said on the page in two paragraphs until 2026-09-04, when the client
 * asked for the notices to come off. The limits are unchanged and are recorded
 * in `lib/auth.ts`, `lib/enquiries.ts` and MEMORY.md Q3 — the page simply no
 * longer explains itself to the person using it.
 */
function Admin() {
  /* Read synchronously on the first render, so a signed-in owner never sees the
     log-in screen flash before the board replaces it. There is no server render
     to disagree with — every page here mounts client-side. */
  const [user, setUser] = useState<string | null>(() => readSession()?.user ?? null);

  return (
    <>
      {/* --- The bar ------------------------------------------------------
          The running head's own proportions — `--nav-h`, a hairline under it,
          the mark at the left — carrying only what this page needs. Sticky for
          the same reason the site's is: the way out should not require
          scrolling back to the top of a long board. */}
      <header className="sticky top-0 z-(--z-nav) border-b border-rule bg-page">
        <div className="shell flex h-(--nav-h) items-center justify-between gap-md">
          <a href={withBase('/')} className="flex h-full shrink-0 items-center pr-md">
            <img
              src={wordmarkBlack.src}
              srcSet={wordmarkBlack.srcSet}
              sizes="104px"
              alt="Loft 91 — back to the site"
              width={wordmarkBlack.w}
              height={wordmarkBlack.h}
              className="h-4 w-auto shrink-0"
              translate="no"
            />
          </a>

          {user && (
            <button
              type="button"
              className="label flex h-11 items-center text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
              onClick={() => {
                signOut();
                setUser(null);
              }}
            >
              Log out
            </button>
          )}
        </div>
      </header>

      <section aria-labelledby="board" className="shell pt-xl pb-3xl">
        <h1 id="board" className="font-display text-display uppercase text-ink">
          {user ? 'Enquiries' : 'Log in'}
        </h1>

        <div className="mt-lg">{user ? <AdminBoard /> : <AdminLogin onSignedIn={setUser} />}</div>
      </section>
    </>
  );
}

mount('admin', <Admin />, { bare: true });
