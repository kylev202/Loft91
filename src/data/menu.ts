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

/* --------------------------------------------------------------------------
   The food menu — two restaurants trading from the venue, each with its own
   printed menu, so each is its own list rather than one merged one.

   Transcribed from the text supplied on 2026-09-25 (pending client sign-off,
   like the drinks). Every dish, price and ingredient is theirs; the order is
   theirs too, so nothing is regrouped or re-sorted.

   ── Descriptions are ingredient lists (client instruction, 2026-09-25) ──────
   The printed menu describes each dish in a sentence or two — how it is
   served, how it is cooked, how it feels to eat. The client asked for the
   description to list the ingredients and nothing more, the way a cocktail
   line above does ("Kahlúa, vodka, espresso"). So each one is cut to its
   ingredients, in the order the print names them, and no ingredient is added:
     · texture and narrative words go ("crunchy", "chewy", "golden", "served
       with", "stuffed with", "wrapped in"); words that name the ingredient
       stay ("pickled pork ears", "dried shrimp", "crispy fried shallot")
     · "your choice of" becomes "or": "tamarind sauce or salt and pepper"
     · no full stops, as in the drinks

   Typographic corrections, as before: "Vienamese" → "Vietnamese", "house- made"
   and "home made" joined, "w/" → "with", names in sentence case (the print is
   all caps; the page's CSS uppercases headings, not dish names).

   Left exactly as printed, for the client to confirm:
     · "sundry tomatoes" (Duck salad) — reads as a slip for sun-dried, but that
       is a kitchen fact, not a typo this file can settle
     · "Green papaya salad with steamed prawn and pork belly" — its ingredients
       name pork ears and no prawn or pork belly
     · the Spicy rice paper salad ($16) is priced under the plain Rice paper
       salad ($18) though it lists more
   -------------------------------------------------------------------------- */

export interface FoodVenue {
  readonly id: string;
  /** Printed as the line above the name: "A taste of Vietnam by". */
  readonly tagline: string;
  readonly name: string;
  readonly items: readonly MenuItem[];
}

export const foodVenues: readonly FoodVenue[] = [
  {
    id: 'co-thu-quan',
    tagline: 'A taste of Vietnam by',
    name: 'Co Thu Quan',
    items: [
      {
        name: 'Rice paper salad',
        price: '$18',
        desc: 'Shredded green papaya, pickled pork ears, Thai basil, peanuts, sweet dressing, chilli sauce',
      },
      {
        name: 'Spicy rice paper salad',
        price: '$16',
        desc: 'Rice paper, beef jerky, dried shredded squid, dried shrimp, sour green mango, Vietnamese mint, spicy salted shrimp, quail eggs, crispy fried pork skin, crispy fried shallot, scallion oil, peanuts',
      },
      {
        name: 'Vietnamese shrimp dumplings (5pcs)',
        price: '$16',
        desc: 'Tapioca dumpling, shrimp, ground pork, banana leaf, sweet and spicy Vietnamese fish sauce',
      },
      {
        name: 'Fried fish balls (8pcs)',
        price: '$15',
        desc: 'Fish balls, house-made dipping sauce, pickled carrots',
      },
      {
        name: 'Fried wontons (6pcs)',
        price: '$15',
        desc: 'Wontons, prawn filling, sweet and spicy sauce',
      },
      {
        name: 'Hog plums slaw',
        price: '$19',
        desc: 'Hog plum, beef jerky, dried shredded squid, dried shrimp, persicaria odorata, sweet and sour Vietnamese dressing, peanuts, crispy fried shallot, chilli',
      },
      {
        name: 'Barramundi slaw',
        price: '$25',
        desc: 'Fried barramundi fillet, salad mix, green apple, pickled carrot, homemade ginger sauce',
      },
      {
        name: 'Vietnamese chicken slaw',
        price: '$25',
        desc: 'Shredded chicken breast, cabbage, carrot, Vietnamese mint, sweet and sour dressing, peanuts, crispy fried shallot',
      },
      {
        name: 'Green papaya salad with beef jerky',
        price: '$19',
        desc: 'Shredded green papaya, Thai basil, beef jerky, peanuts, sweet dressing, chilli sauce',
      },
      {
        name: 'Green papaya salad with steamed prawn and pork belly',
        price: '$20',
        desc: 'Steamed pork ears, pickled carrot and daikon, shredded green papaya, sweet and sour Vietnamese fish sauce, peanuts, fried shallot, persicaria odorata, Thai basil, chilli',
      },
      {
        name: 'Roasted duck rice paper rolls (4pcs)',
        price: '$19',
        desc: 'Rice paper, vermicelli noodle, bean sprouts, cucumber, shredded lettuce, fresh herbs, roast Peking duck breast, homemade hoisin sauce, peanuts, crispy fried shallot, chilli',
      },
      {
        name: 'Steamed prawns and pork rice paper rolls (4pcs)',
        price: '$16',
        desc: 'Rice paper, vermicelli noodle, bean sprouts, shredded lettuce, fresh herbs, prawns or prawns and pork, homemade Vietnamese sweet dipping sauce, peanuts, crispy fried shallot, chilli',
      },
      {
        name: 'Vietnamese popiah (5pcs)',
        price: '$15',
        desc: 'Chinese sausage, dried shrimp, basil leaves, shredded lettuce, jicama, rice paper, house-made hoisin sauce, peanuts, crispy fried shallot, chilli',
      },
      {
        name: 'Pork / chicken spring rolls (8pcs)',
        price: '$17',
        desc: 'Fried spring rolls, lettuce, fresh herbs, house-made Vietnamese dipping sauce',
      },
      {
        name: 'Mixed rolls combo',
        price: '$24',
        desc: '2 Vietnamese popiah, 2 rice paper rolls, 4 spring rolls, 2 crispy fried wontons, Vietnamese sweet dipping sauce',
      },
      {
        name: 'Salt & pepper squid tentacles',
        price: '$25',
        desc: 'Battered squid tentacles, seasoning, sweet chilli dipping sauce',
      },
      {
        name: 'Tamarind / salt & pepper soft shell crab',
        price: '$26',
        desc: 'Soft-shell crab, tamarind sauce or salt and pepper, Vietnamese sweet chilli dipping sauce',
      },
      {
        name: 'Tamarind / salt & pepper prawns',
        price: '$26',
        desc: 'Prawns, capsicum, garlic, tamarind sauce or salt and pepper',
      },
      {
        name: 'Salt & pepper tofu / eggplant',
        price: '$24',
        desc: 'Tofu or eggplant, salt and pepper seasoning',
      },
    ],
  },
  {
    id: 'juk-jut',
    tagline: 'A taste of Asian fusion by',
    name: 'Juk Jut',
    items: [
      {
        name: 'Satay chicken skewers (2pcs)',
        price: '$15',
        desc: 'Satay sauce, peanuts, lemongrass, onion, lime leaves',
      },
      {
        name: 'Chicken ribs (5pcs)',
        price: '$22',
        desc: 'Onion, lemongrass, coriander, cashew nuts, soybean',
      },
      {
        name: 'Duck kra pao',
        price: '$22',
        desc: 'Duck, Thai basil, snake beans, chili, rice cracker, lettuce',
      },
      {
        name: 'Roti Peking duck (4pcs)',
        price: '$25',
        desc: 'Roast duck breast, cucumber, spring onion, pickled carrot, radish, roti, special sauce',
      },
      {
        name: 'Spiced lamb ribs with Asian slaw',
        price: '$32',
        desc: 'Special Juk Jut spices, fresh herbs, cabbage, chives',
      },
      { name: 'Duck salad', price: '$30', desc: 'Roast duck, orange, sundry tomatoes, spring onion' },
      { name: 'Crispy pork gai lan', price: '$30', desc: 'Crispy pork, gai lan' },
      {
        name: 'Pad Thai chicken or prawn',
        price: '$31',
        desc: 'Prawns or chicken, bean sprouts, egg, tofu, chives, peanuts',
      },
      {
        name: 'Beef salad',
        price: '$29',
        desc: 'Grilled beef, ground rice, onion, cucumber, mint, lime leaves, coriander, ginger',
      },
    ],
  },
];

export const menuTbc =
  'transcribed from the venue’s printed menu & happy-hour posters; prices and spelling to be confirmed by client before launch';
