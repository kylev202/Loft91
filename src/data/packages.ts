/* ==========================================================================
   packages.ts — function tiers, capacity and terms.

   ⚠⚠ THE WHOLE FILE IS PLACEHOLDER CONTENT (D-60), written on explicit user
   instruction so the Packages page reads as a finished page in a demo. None of
   it came from the client.

   MEMORY.md §5 lists package tiers, inclusions, capacity and minimum spend as
   ❌ Missing, and Q6 — whether functions are priced publicly at all, or priced
   on enquiry — is still open. Every figure below is invented: the capacities,
   the spends, the deposit, the lead times, the catering rate. Published on the
   live site, this would quote a real venue prices it does not charge and
   promise a room size nobody has measured.

   Two things here are NOT invented, and they are why the page is not pure
   fiction: the room description, and the inclusions that describe fittings —
   the white brick, the wall-sized screen, banquette seating along one wall, the
   bar with draught taps — are all read off the client's own photographs.

   To restore the honest state: delete this file and revert `pages/packages.tsx`
   — the [TBC] markers come back with it.
   ========================================================================== */

const NB = '\u00a0'; // non-breaking space — a wrapped price is a broken price

export interface Tier {
  readonly id: string;
  readonly name: string;
  /** Guest range. Invented. */
  readonly scale: string;
  /** Minimum spend. Invented — and the answer to Q6 may well be that no price
      belongs on this page at all. */
  readonly price: string;
  readonly summary: string;
  readonly includes: readonly string[];
}

/** Capacity, as the room's feature list prints it. Invented (MEMORY.md §5). */
export const capacity = {
  standing: '120 standing',
  seated: '70 seated',
  combined: `120 standing${NB}· 70 seated`,
} as const;

/** Minimum spend, as the feature list prints it. Invented. */
export const minimumSpend = `From $600 Sunday${NB}· from $1,400 Fri${NB}& Sat`;

export const tiers: readonly Tier[] = [
  {
    id: 'booth',
    name: 'The Booth',
    scale: 'Up to 20 guests',
    price: 'From $600 minimum spend',
    summary: 'The banquette end of the room, held for your group, with the bar open as usual.',
    includes: [
      'The banquette section along the brick, reserved for four hours',
      'Table service from the main bar',
      'Two snack boards — chips, crackling and nuts',
      'The screen wall for a playlist, a slideshow or the game',
    ],
  },
  {
    id: 'long-table',
    name: 'The Long Table',
    scale: '20 – 60 guests',
    price: 'From $1,400 minimum spend',
    summary: 'Half the floor, set as one long table, with a bartender who stays with your party.',
    includes: [
      'Half the room for five hours, tables set the length of the white brick',
      'A bartender on your party for the whole night',
      'An arrival drink for every guest — beer, wine or a house cocktail',
      'The screen wall, running your own slides or footage',
      'A cake table, a cloakroom rail and somewhere to put the cards',
    ],
  },
  {
    id: 'whole-loft',
    name: 'The Whole Loft',
    scale: '60 – 120 guests',
    price: 'From $3,000 minimum spend',
    summary: 'Exclusive use of the upstairs room, its bar and the stairwell, for the night.',
    includes: [
      'The whole room to yourselves, 5 PM until close',
      'The full bar, staffed, on a tab or a drinks list you set in advance',
      'DJ booth and house PA — bring your own DJ, or run a playlist through it',
      'The screen wall, a radio mic and a lectern for speeches',
      'Set-up from 3 PM, and half an hour at the end to pack down',
    ],
  },
];

/** The terms row under the tiers. Invented, every line of it. */
export const terms: readonly { readonly label: string; readonly value: string }[] = [
  { label: 'Deposit', value: '$300 holds the date, and comes off the final bill' },
  { label: 'Cancellation', value: 'Refunded in full up to 14 days before' },
  { label: 'Lead time', value: 'Two weeks for the room, four for the whole floor' },
  { label: 'Catering', value: 'Grazing and hot boards from $18 a head, ordered a week ahead' },
];
