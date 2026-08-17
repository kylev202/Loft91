/* ==========================================================================
   photos.ts — the venue's own photography (MEMORY.md D-21, Q13 open).

   Ten client photographs, width-matched derivatives in assets/img/opt/. `w`/`h`
   are the *real* intrinsic pixels of the base candidate, read off the files —
   not the shape of the box the picture happens to sit in. Getting that wrong is
   a CLS bug that no screenshot shows you.

   Every alt describes the room, not the file (§10).
   ========================================================================== */

export interface Photo {
  /** Base filename in /img — `stair` resolves to stair-800.avif|webp|jpg etc. */
  readonly name: string;
  readonly widths: readonly number[];
  /** Intrinsic pixels of the smallest candidate — the aspect ratio the browser
      reserves space with. */
  readonly w: number;
  readonly h: number;
  readonly alt: string;
  /** Signal-voice caption where the frame carries one. */
  readonly caption?: string;
}

const portrait = { w: 800, h: 1067 };
const landscape = { w: 800, h: 600 };

export const photos = {
  /** The room lit for a function — the hero (D-31, needs client sign-off). */
  event: {
    name: 'event',
    widths: [800, 1600, 2200],
    ...landscape,
    alt: 'The upstairs room lit for a function, tables set along the white brick wall.',
  },
  stair: {
    name: 'stair',
    widths: [800, 1600],
    ...portrait,
    alt: 'The street-level entrance: an arched stairwell edged in magenta neon, LOFT91 lit above it.',
    caption: 'The stairs',
  },
  ascent: {
    name: 'ascent',
    widths: [800, 1600],
    ...portrait,
    alt: 'Looking up the stairwell, neon strip lighting running the length of both walls.',
    caption: 'Upstairs',
  },
  barWide: {
    name: 'bar-wide',
    widths: [800, 1600],
    ...landscape,
    alt: 'The bar: a backlit ribbed counter, arched marble shelves behind it, white brick either side.',
    caption: 'The bar',
  },
  taps: {
    name: 'taps',
    widths: [800, 1600],
    ...portrait,
    alt: 'The tap bank seen across the stone counter, arched spirit shelves lit behind.',
    caption: 'The taps',
  },
  room: {
    name: 'room',
    widths: [800, 1600],
    ...landscape,
    alt: 'Tables and bentwood chairs along a white brick wall, a planted green column mid-room.',
    caption: 'The room',
  },
  lounge: {
    name: 'lounge',
    widths: [800, 1600],
    ...landscape,
    alt: 'Banquette seating facing a wall-sized screen, mirrored ceiling above the tables.',
    caption: 'The screen wall',
  },
  neon: {
    name: 'neon',
    widths: [800, 1600],
    ...portrait,
    alt: 'A neon sign reading See You Next Time, mounted on steel at the top of the stairs.',
    caption: 'On the way out',
  },
  /** Wayfinding, not decoration: at street level the venue is an unmarked
      stairwell next to a deli, so this is the thing you actually look for.
      MEMORY.md Q13 — it also puts a neighbouring business's neon on the page. */
  entrance: {
    name: 'entrance',
    widths: [800, 1600],
    ...portrait,
    alt: 'Street level: the LOFT91 stairwell entrance, lit magenta, beside the Crumbz Deli neon sign.',
    caption: 'Street level — the stairs are beside the deli',
  },
} as const satisfies Record<string, Photo>;

/** Sequenced as the arrival actually happens: the stairs from the street, up
    them, the bar, the room, and the sign you read on the way out. */
export const gallery: readonly Photo[] = [
  photos.stair,
  photos.ascent,
  photos.barWide,
  photos.taps,
  photos.room,
  photos.lounge,
  photos.neon,
];

export const srcSet = (photo: Photo, ext: string) =>
  photo.widths.map((w) => `/img/${photo.name}-${w}.${ext} ${w}w`).join(', ');

export const fallbackSrc = (photo: Photo) => `/img/${photo.name}-${photo.widths[0]}.jpg`;

/** The wordmark lockup — a transparent PNG, not a vector. A true per-letter
    loader animation is still blocked on MEMORY.md Q2.

    Two colourways, both the client's own artwork: the black lockup is what this
    design uses everywhere (it sits on paper), the white one is kept because it
    is the only version that works over a photograph. */
const lockup = (colour: 'black' | 'white') => ({
  widths: [320, 640, 1280, 1920],
  w: 640,
  h: 139,
  srcSet: [320, 640, 1280, 1920]
    .map((w) => `/img/wordmark-${colour}-${w}.png ${w}w`)
    .join(', '),
  src: `/img/wordmark-${colour}-640.png`,
});

export const wordmarkBlack = lockup('black');
export const wordmarkWhite = lockup('white');
