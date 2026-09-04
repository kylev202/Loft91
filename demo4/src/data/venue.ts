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
    // ⚠ D-60: demo only. The street type is still Derived, not Confirmed.
    confirmed: true,
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
    { day: 'Sunday', opens: `1${NB}PM`, closes: `6${NB}PM` },
  ] as readonly OpeningHours[],
  hoursConfirmed: true, // ⚠ D-60: demo only. The real answer is still Q1.
  /* MEMORY.md Q1 asks whether Mon – Thu are closed or available for private
     hire, and nobody has answered it. D-60 printed the second reading as if it
     were settled; that row (`hoursGap`) is deleted (D-65) and the week now
     states the three days that are known and says nothing about the other
     four, which is the only true statement available. `hoursTbc` below is the
     record of what is still unanswered — it has no caller. */
  hoursTbc:
    'hours not yet client-confirmed, incl. what “late” means and whether Mon – Thu open for private hire',

  // MEMORY.md §1 — the only bookings channel that exists today. Q3 is open.
  bookings: { channel: `Instagram${NB}DM`, tbc: 'functions enquiry channel, from client' },

  /* ⚠ PLACEHOLDER (D-60) — INVENTED, not supplied. MEMORY.md §5 lists the
     enquiry email and phone as Missing, and Q3 is the open question about what
     that channel should even be. These exist so the Packages enquiry block, the
     FAQ and the footer read as a finished site in a walkthrough.

     The number is deliberately taken from ACMA's reserved fictitious range
     (0491 570 006 – 0491 570 156): nobody walking a demo can dial it and reach
     a real person by accident. Replace both with the client's own before
     launch, or delete this block to restore the [TBC] state. */
  contact: {
    email: 'loftnineone@gmail.com',
    phone: `0491 570${NB}110`,
    phoneHref: 'tel:+61491570110',
  },

  /* ⚠ PLACEHOLDER (D-60) — INVENTED, not supplied. MEMORY.md §5 lists the
     venue story as Missing: nobody has told us when Loft 91 opened, who runs
     it, or how it would like to describe itself. Every sentence below is
     written copy standing in for that, and none of it is a sourced fact. It is
     at least kept consistent with the client's own photographs — the white
     brick, the lit arches behind the bar, the screen along the far wall — and
     claims nothing the pictures do not show. */
  story: [
    'Loft 91 opened in the winter of 2022, in a room that had sat empty above the shopfronts on Nicholson Street for the better part of a decade. The white brick was already there, and so was the ceiling height you do not get at street level in Footscray. Almost everything else — the bar, the lit arches behind it, the screen running the far wall — was built in.',
    'It is run by the two people usually standing behind that bar. The idea was never a big venue, just one good room: a flight of stairs up off a busy street, a drinks list worth reading, and a floor that can be handed over to a single party on a Saturday night without the rest of the week having to change around it.',
  ],
} as const;

/** The one-line hours summary. Composed from `venue.hours`, never written out
    by hand, so it could not disagree with the table that states them.

    ⚠ It has no caller: its one surface was the notice strip above the nav, and
    D-62 removed that on client instruction. Kept rather than deleted — it is
    correct, and it is the fastest route back if the strip is ever reinstated. */
export const hoursSummary = (() => {
  const [fri, sat, sun] = venue.hours;
  const weekend =
    fri.opens === sat.opens && fri.closes === sat.closes
      ? `Fri${NB}&${NB}Sat ${fri.opens}${NB}– ${fri.closes}`
      : `${fri.day} ${fri.opens}${NB}– ${fri.closes} · ${sat.day} ${sat.opens}${NB}– ${sat.closes}`;
  return `${weekend} · Sun ${sun.opens}${NB}– ${sun.closes}`;
})();
