/* ==========================================================================
   venue.js — THE single source of venue facts (CLAUDE.md §5).
   Hours, address and links render from here into the hero, Visit and footer,
   so they can never drift between sections.

   EVERY field below traces to MEMORY.md §1. Nothing here may be invented.
   `confirmed: false` means the fact is sourced but NOT client-signed-off, and
   the UI must show it as provisional (MEMORY.md Q1, and the §1.1 warning that
   published hours are operationally load-bearing).
   ========================================================================== */

var VENUE = {
  name: 'Loft 91',
  wordmark: 'LOFT91',

  // MEMORY.md §1 — Instagram bio states "Upstairs, 91 Nicholson".
  // Street type and suite formatting are DERIVED, not confirmed. See §6 Q-address.
  address: {
    line1: 'Upstairs, 91 Nicholson Street',
    line2: 'Footscray VIC 3011',
    confirmed: false,
    tbc: 'street type & suite format, from client'
  },

  // MEMORY.md §1 — Confirmed
  maps: 'https://maps.app.goo.gl/S3cpVjSk9qNEjWpd7',
  geo: { lat: -37.800198, lng: 144.899713 },
  instagram: { url: 'https://www.instagram.com/loft_91_bar/', handle: '@loft_91_bar' },

  // MEMORY.md §1.1 — Confirmed from Instagram bio as at 2026-08-08, NOT client-confirmed.
  // "late" is rendered as the literal word. Never invent a closing time (§1.1 warning).
  hours: [
    { day: 'Friday',   opens: '5 PM', closes: 'late' },
    { day: 'Saturday', opens: '5 PM', closes: 'late' },
    { day: 'Sunday',   opens: '1 PM', closes: '8 PM' }
  ],
  hoursConfirmed: false,
  // MEMORY.md §1.1 — ASSUMED, never published as fact.
  hoursGap: 'Mon–Thu not published',
  hoursTbc: 'Mon–Thu trading & closing times, from client',

  // MEMORY.md §1 — the only bookings channel that exists today. MEMORY.md Q3 open.
  bookings: { channel: 'Instagram DM', tbc: 'functions enquiry channel, from client' }
};
