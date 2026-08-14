/* ==========================================================================
   venue.ts — THE single source of venue facts (CLAUDE.md §5).

   Hours, address and links render from here into the hero, Visit and the
   footer, so they cannot drift between sections. In `demo/` this was hard-coded
   in the markup with a runtime assertion against a data file (D-12), because
   rendering it from JS would have left a no-JS visitor with a bar site that
   never says when the bar is open. That trade-off does not exist here — demo2
   is a React app, so a no-JS visitor has no page at all either way, and the
   drift assertion has nothing left to guard. Prerendering is the real fix and
   it is a production-build task, not a demo one.

   EVERY field below traces to MEMORY.md §1. Nothing here may be invented.
   `confirmed: false` means the fact is sourced but NOT client-signed-off, and
   the UI must show it as provisional (MEMORY.md Q1, and the §1.1 warning that
   published hours are operationally load-bearing).
   ========================================================================== */

const NB = ' '; // non-breaking space — a wrapped address is a broken address

export interface OpeningHours {
  readonly day: string;
  readonly opens: string;
  /** Rendered as the literal word when that is what the source says. Never invent a
      wall-clock closing time (MEMORY.md §1.1). */
  readonly closes: string;
}

export const venue = {
  name: 'Loft 91',
  wordmark: 'LOFT91',

  // MEMORY.md §1 — Instagram bio states "Upstairs, 91 Nicholson".
  // Street type and suite formatting are DERIVED, not confirmed.
  address: {
    line1: `Upstairs, 91${NB}Nicholson${NB}Street`,
    line2: `Footscray VIC${NB}3011`,
    short: `Upstairs, 91${NB}Nicholson${NB}Street, Footscray`,
    confirmed: false,
    tbc: 'street type & suite format, from client',
  },

  // MEMORY.md §1 — Confirmed
  maps: 'https://maps.app.goo.gl/S3cpVjSk9qNEjWpd7',
  geo: { lat: -37.800198, lng: 144.899713 },
  instagram: { url: 'https://www.instagram.com/loft_91_bar/', handle: '@loft_91_bar' },

  // MEMORY.md §1.1 — Confirmed from the Instagram bio as at 2026-08-08, NOT
  // client-confirmed. "late" is rendered as the literal word.
  hours: [
    { day: 'Friday', opens: `5${NB}PM`, closes: 'late' },
    { day: 'Saturday', opens: `5${NB}PM`, closes: 'late' },
    { day: 'Sunday', opens: `1${NB}PM`, closes: `8${NB}PM` },
  ] as readonly OpeningHours[],
  hoursConfirmed: false,
  // MEMORY.md §1.1 — ASSUMED, never published as fact.
  hoursGap: { days: `Mon${NB}– Thu`, state: 'Not published' },
  hoursTbc:
    'hours not yet client-confirmed, incl. what “late” means and whether Mon – Thu open for private hire',

  // MEMORY.md §1 — the only bookings channel that exists today. Q3 is open.
  bookings: { channel: `Instagram${NB}DM`, tbc: 'functions enquiry channel, from client' },
} as const;

/** The one-line hours summary used in the hero. Composed from `venue.hours`, never
    written out by hand, so the hero and the Visit table cannot disagree. */
export const hoursSummary = (() => {
  const [fri, sat, sun] = venue.hours;
  const weekend =
    fri.opens === sat.opens && fri.closes === sat.closes
      ? `Fri${NB}&${NB}Sat ${fri.opens}${NB}– ${fri.closes}`
      : `${fri.day} ${fri.opens}${NB}– ${fri.closes} · ${sat.day} ${sat.opens}${NB}– ${sat.closes}`;
  return `${weekend} · Sun ${sun.opens}${NB}– ${sun.closes}`;
})();
