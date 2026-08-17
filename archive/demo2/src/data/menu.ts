/* ==========================================================================
   menu.ts — the drinks list, transcribed from the venue's own printed menu
   (assets/img/MENU.png) and the two happy-hour posters. MEMORY.md D-22.

   Nothing here is invented: every line and every price traces to one of those
   three client-supplied assets, and every price was verified against crops of
   the original at native resolution rather than read off a thumbnail.

   Set as data → text rather than shown as the poster image, because the poster
   is 2,480 px of black-background type that a phone can only read by
   pinch-zooming, and it is unselectable, unsearchable and invisible to a screen
   reader.

   Seven spellings were corrected and are listed for client sign-off (D-22,
   MEMORY.md Q11): Japaneses→Japanese, Lychhee→Lychee, Liquer→Liqueur,
   Resposado→Reposado, Martel→Martell, Jalepenos→Jalapeños, Kahlua→Kahlúa.
   The whole transcription is still pending client confirmation.
   ========================================================================== */

const NB = ' ';

export interface MenuItem {
  readonly name: string;
  /** Absent where the printed menu prices the whole group instead of the row. */
  readonly price?: string;
  readonly desc?: string;
}

export interface MenuGroup {
  readonly id: string;
  readonly heading: string;
  readonly items: readonly MenuItem[];
  /** A group-level price, where the menu sets one. Written as a full claim
      ("$12 each"), never a bare figure floating under unpriced rows. */
  readonly note?: string;
}

/** Happy hour leads the section: it is the one thing on this page that changes
    what time somebody leaves the house. */
export const happyHour = {
  // "HAPPY HOUR MAIN" poster.
  when: `Fri${NB}& Sat 5${NB}–${NB}8${NB}PM · All day Sunday`,
  items: [
    { name: 'Pots', price: '$4' },
    { name: 'Schooners', price: '$6' },
    { name: `Beer jugs, 2${NB}L`, price: '$22' },
    { name: 'Basic spirits', price: '$9' },
    { name: 'Premix & stubbies', price: '$8' },
    // MEMORY.md Q12: the two posters disagree on scope. "HAPPY HOUR MAIN" reads
    // Fri–Sat plus all day Sunday; "HAPPY HOUR COCKTAILS" reads Fri–Sat only.
    // The narrower, safer reading is rendered — it under-promises rather than
    // over-promises — but it may simply be wrong.
    { name: 'Cocktails', price: '$16', note: `Fri${NB}& Sat only` },
  ] as readonly { name: string; price: string; note?: string }[],
} as const;

export const menuGroups: readonly MenuGroup[] = [
  {
    id: 'draught',
    heading: 'Draught beers',
    items: [{ name: 'Carlton Dry' }, { name: 'Balter XPA' }],
    note: '$6 pot · $8 schooner',
  },
  {
    id: 'bottle',
    heading: 'Bottle beers',
    items: [
      { name: 'Asahi Dry', price: '$10' },
      { name: 'Corona Extra', price: '$11' },
      { name: 'Cass', price: '$10' },
    ],
  },
  {
    id: 'premix',
    heading: 'Pre-mixes',
    items: [
      { name: 'Hard Rated Lemon', price: '$14' },
      { name: 'Vodka Cruiser Watermelon', price: '$14' },
    ],
  },
  {
    id: 'vodka',
    heading: 'Vodka & gin',
    items: [
      { name: 'Vodka O', price: '$11' },
      { name: 'Absolut', price: '$12' },
      { name: 'Grey Goose', price: '$14' },
      { name: 'Tanqueray', price: '$14' },
    ],
  },
  {
    id: 'tequila',
    heading: 'Tequila',
    items: [
      { name: 'Espolon Blanco', price: '$12' },
      { name: '1800 Reposado', price: '$14' },
      { name: '1800 Cristalino', price: '$16' },
    ],
  },
  {
    id: 'whiskey',
    heading: 'Whiskey & scotch',
    items: [{ name: 'Canadian Club' }, { name: 'Johnnie Walker Black' }, { name: 'Jack Daniels' }],
    note: '$12 each',
  },
  {
    id: 'cognac',
    heading: 'Cognac',
    items: [{ name: 'Martell Blue Swift', price: '$16 · $240 bottle' }],
  },
  {
    id: 'soju',
    heading: 'Soju',
    items: [
      { name: 'Soju', price: '$15', desc: 'Original, green grape, lychee' },
      { name: 'Soju somaek', price: '$30', desc: '2× Cass + 1 soju' },
    ],
  },
  {
    id: 'cocktails',
    heading: 'Cocktails',
    items: [
      { name: 'Espresso martini', price: '$24', desc: 'Kahlúa, vodka, espresso' },
      { name: 'Japanese slipper', price: '$22', desc: 'Midori, triple sec, lemon juice' },
      {
        name: 'Long Island iced tea',
        price: '$22',
        desc: 'Vodka, tequila, white rum, triple sec, gin, lemon juice, cola',
      },
      { name: 'Margarita', price: '$22', desc: 'Tequila, triple sec, fresh lime juice' },
      {
        name: 'Spicy margarita',
        price: '$22',
        desc: 'Tequila, triple sec, fresh lime juice, Tajín salt, jalapeños',
      },
      { name: 'Lychee martini', price: '$22', desc: 'Lychee liqueur, vodka, lychee syrup' },
    ],
  },
  {
    id: 'snacks',
    heading: 'Snacks',
    items: [{ name: 'Chips, crackling, nuts', price: '$4' }],
  },
];

export const menuTbc =
  'transcribed from the venue’s printed menu & happy-hour posters; prices and spelling to be confirmed by client before launch';
