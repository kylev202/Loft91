/* ==========================================================================
   photos.ts — the venue's own photography (MEMORY.md D-21, Q13 open).

   Ten client photographs, width-matched derivatives in assets/img/opt/, mirrored
   into public/img by scripts/sync-assets.mjs. `w`/`h` are the *real* intrinsic
   pixels of the base candidate, read off the files — not the shape of the box
   the picture happens to sit in. Getting that wrong is a CLS bug that no
   screenshot shows you.

   Every alt describes the room, not the file.
   ========================================================================== */

import { withBase } from '../lib/base';

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
  /** `object-position` for the frame, where centre is the wrong crop. A phone
      crops a landscape frame to its centre band and a portrait frame to its
      middle third, so this is per-photograph judgement, not a default. */
  readonly position?: string;
}

const portrait = { w: 800, h: 1067 };
const landscape = { w: 800, h: 600 };

export const photos = {
  /** THE cover of the site. The backlit ribbed counter and the arched marble
      shelves behind it are where this whole design's brass comes from — the
      palette is sampled from this photograph, so the home page opens on it.
      Carries a 2200w tier because it is the largest thing rendered anywhere. */
  barWide: {
    name: 'bar-wide',
    widths: [800, 1600, 2200],
    ...landscape,
    alt: 'The bar: a backlit ribbed counter, arched marble shelves behind it, white brick either side.',
    caption: 'The bar',
  },
  /** The tap bank across the stone counter, arches lit behind — the drinks
      page's cover, because it is literally what the page is about. Nearly
      symmetrical, so it survives being cropped to a wide band. */
  taps: {
    name: 'taps',
    widths: [800, 1600],
    ...portrait,
    alt: 'The tap bank seen across the stone counter, arched spirit shelves lit behind.',
    caption: 'The taps',
  },
  /** The room lit for a function — the Packages cover (D-31 chose this frame
      as the commercial one; that reasoning holds, on the page whose job it is). */
  event: {
    name: 'event',
    widths: [800, 1600, 2200],
    ...landscape,
    alt: 'The upstairs room lit for a function, tables set along the white brick wall.',
    caption: 'Set for a function',
  },
  /** The signature frame: the neon arch from the foot of the stairs. */
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
      stairwell next to a deli, so this is the thing you actually look for —
      which is why it is the Visit page's cover rather than a gallery plate.
      MEMORY.md Q13: it also puts a neighbouring business's neon on the page. */
  entrance: {
    name: 'entrance',
    widths: [800, 1600],
    ...portrait,
    alt: 'Street level: the LOFT91 stairwell entrance, lit magenta, beside the Crumbz Deli neon sign.',
    caption: 'Street level — the stairs are beside the deli',
    /** The lit doorway sits right of centre in the frame; centring the crop on
        a wide cover would put the blank plaster wall in the middle and cut the
        stairwell in half. */
    position: '62% 50%',
  },
  /** The original bar frame. Unused as a cover, kept in the gallery. */
  bar: {
    name: 'bar',
    widths: [800, 1600, 2200],
    ...landscape,
    alt: 'The bar counter lit from within, spirit shelves and glassware behind it.',
    caption: 'Behind the counter',
  },
} as const satisfies Record<string, Photo>;

/* ── The gallery, grouped by orientation (D-61) ───────────────────────────
   The client asked for the gallery to read symmetrically, and for the two
   orientations never to be mixed together.

   The old order was the arrival as it actually happens — the stairs from the
   street, up them, the bar, the taps, the room, the screen wall, the sign you
   read on the way out — and it was a good sequence, but it alternated 3:4 and
   4:3 frames almost every step. That is what forced the hand-set uneven column
   spans in `Plates`: the spans existed to stop a tall frame and a wide one
   from looking like a mistake beside each other. Remove the mixing and the
   whole apparatus is unnecessary.

   So the sequence is now two bands of four, each one internally uniform. The
   wide frames of the room lead; the tall frames of the way up follow. Four
   divides evenly into every column count the grid uses — 1, 2 and 4 — so no
   row is ever short and no plate is ever a different size from its neighbour.

   Two frames are deliberately not here. `entrance` is the About page's cover
   and belongs to wayfinding rather than to a gallery, and `bar` is a second
   pass at the same counter as `barWide`. They are the reserves if either band
   ever needs a fifth. */
export const galleryBands = [
  {
    id: 'room',
    orientation: 'landscape',
    label: 'The room',
    photos: [photos.barWide, photos.event, photos.room, photos.lounge],
  },
  {
    id: 'arrival',
    orientation: 'portrait',
    label: 'The way up',
    photos: [photos.stair, photos.ascent, photos.taps, photos.neon],
  },
] as const satisfies readonly {
  readonly id: string;
  readonly orientation: 'landscape' | 'portrait';
  readonly label: string;
  readonly photos: readonly Photo[];
}[];

/** The same eight frames flattened, in band order — for the home page's
    horizontal strip, which is bottom-aligned and therefore the one surface
    where mixed heights were always the point. */
export const gallery: readonly Photo[] = galleryBands.flatMap(
  // The annotation widens each band's `as const` tuple to `Photo` before the
  // flatten; without it TypeScript tries to unify two tuples of four distinct
  // literal object types and fails.
  (band): readonly Photo[] => band.photos,
);

export const srcSet = (photo: Photo, ext: string) =>
  photo.widths.map((w) => `${withBase(`/img/${photo.name}-${w}.${ext}`)} ${w}w`).join(', ');

export const fallbackSrc = (photo: Photo) => withBase(`/img/${photo.name}-${photo.widths[0]}.jpg`);

/** The wordmark lockup — a transparent PNG, not a vector. A true per-letter
    loader animation is still blocked on MEMORY.md Q2.

    Nocturne uses the WHITE lockup everywhere, because every surface it lands on
    is dark. The black one is kept only for the alpha mask in the footer, where
    what matters is the artwork's shape rather than its colour. */
const lockup = (colour: 'black' | 'white') => ({
  widths: [320, 640, 1280, 1920],
  w: 640,
  h: 139,
  srcSet: [320, 640, 1280, 1920]
    .map((w) => `${withBase(`/img/wordmark-${colour}-${w}.png`)} ${w}w`)
    .join(', '),
  src: withBase(`/img/wordmark-${colour}-640.png`),
});

export const wordmarkWhite = lockup('white');
export const wordmarkBlack = lockup('black');
