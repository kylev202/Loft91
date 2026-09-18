/* ==========================================================================
   space.ts — the room itself: what is in it, how it can be set, what it
   carries. Read only by `/space/`.

   Two kinds of line live here and they are NOT equally trustworthy, so they
   are kept apart:

   ✅ `fittings` describes the client's own photographs — the white brick, the
      backlit ribbed counter and the arched shelves behind it, the screen along
      the far wall, the banquette, the bentwood chairs, the planted column, the
      neon stairwell. Describing a supplied photograph is reading a source, and
      it is the same carve-out `pages/packages.tsx` already works under.

   ⚠ Every FIGURE and every service line below is INVENTED (D-60) — and none
      of it is *new* invention, which is the only reason this page does not
      widen the exposure MEMORY.md §5 and Q6 already record:

        · 120 standing and 70 seated are imported from `data/packages.ts`,
          never retyped, so the numerals on this page cannot drift from the
          ones on `/packages/` and `/faq/`.
        · 60 at a long table is already printed in the capacity answer on
          `/faq/`; 20 at the banquette end is the Booth tier's own guest range
          in `data/packages.ts`. Both are restated here, not decided here.
        · `facilities` restates the screen, PA, DJ booth, catering and set-up
          lines that `data/faq.tsx` and the Whole Loft tier already publish.

      Nothing here quotes a price. Delete this file and `pages/space.tsx` and
      the page is gone; the figures' other homes are untouched.
   ========================================================================== */

import { capacity } from './packages';
import { photos, type Photo } from './photos';

export interface Row {
  readonly label: string;
  readonly value: string;
}

/** The fabric of the room, read off the photographs. */
export const fittings: readonly Row[] = [
  {
    label: 'The room',
    value:
      'One upstairs room. The bar and the space you can hire are the same floor — there is no second room behind it.',
  },
  {
    label: 'The walls',
    value: 'White painted brick the length of the room, lit warm and low once it is dark.',
  },
  {
    label: 'The bar',
    value:
      'A backlit ribbed counter with arched marble shelves behind it, and the tap bank across the stone.',
  },
  {
    label: 'The far wall',
    value:
      'A screen running the full width of it, banquette seating facing, a mirrored ceiling over the tables.',
  },
  {
    label: 'The floor',
    value:
      'Tables and bentwood chairs, a planted green column mid-room, and the room to move all of it.',
  },
  {
    label: 'The way in',
    value: 'A lit arched stairwell off the street, with neon running the length of both walls.',
  },
];

/** The four ways the floor gets set. A union rather than a `string`, because
    `components/RoomPlan.tsx` keys a furniture set off every one of them and a
    fifth layout added here without a drawing should fail the build rather
    than render an empty floor. */
export type LayoutId = 'standing' | 'seated' | 'long-table' | 'banquette';

export interface Layout {
  readonly id: LayoutId;
  /** The numeral, set at display size. Tabular, so the four align across the row. */
  readonly figure: string;
  /** "about", "up to" — printed small before the numeral where the number is
      not exact. A figure with no qualifier is stated as it is stated on
      `/packages/`. */
  readonly qualifier?: string;
  /** What the figure counts. */
  readonly unit: string;
  readonly note: string;
  /** The frame that shows this setting. Not decoration: each of the four is a
      photograph of the part of the room the plan is drawing, so the diagram
      and the picture are two views of one claim. All four are already on the
      site — nothing new is being asserted by pairing them. */
  readonly photo: Photo;
}

/** The numeral out of a capacity string — "120 standing" → "120". Derived
    rather than retyped so these cannot drift from `data/packages.ts`. */
const figureOf = (text: string) => text.split(' ')[0];

export const layouts: readonly Layout[] = [
  {
    id: 'standing',
    figure: figureOf(capacity.standing),
    unit: 'standing',
    note: 'The floor cleared and the bar open down one side — the shape an exclusive-use party takes.',
    photo: photos.barWide,
  },
  {
    id: 'seated',
    figure: figureOf(capacity.seated),
    unit: 'seated',
    note: 'The room as it stands most nights: tables down the brick, the banquette along the wall.',
    photo: photos.room,
  },
  {
    id: 'long-table',
    figure: '60',
    qualifier: 'about',
    unit: 'at one long table',
    note: 'A single table the length of the white brick, set for a dinner rather than a party.',
    photo: photos.event,
  },
  {
    id: 'banquette',
    figure: '20',
    qualifier: 'up to',
    unit: 'at the banquette end',
    note: 'Part of the floor held for your group, with the rest of the bar trading as usual.',
    photo: photos.lounge,
  },
];

/* ── The plan's legend ─────────────────────────────────────────────────────
   Six things pinned on the drawing in `components/RoomPlan.tsx`, and the same
   six listed beside it. The labels and the lines are the photographs again —
   the same source `fittings` above reads from, said shorter, because a legend
   row sits next to a picture that is already showing you the thing.

   ⚠ `x` and `y` are PERCENTAGES OF THE DRAWING, not of the room. They are
   measured off that component's 960 × 640 box and they do not survive a
   change of geometry: if the client's own plan replaces the schematic, every
   one of these has to be re-read off the new artwork. See the replacement
   note at the head of `RoomPlan.tsx`.                                       */
export interface PlanFeature {
  readonly n: number;
  readonly label: string;
  readonly line: string;
  readonly x: number;
  readonly y: number;
}

export const planFeatures: readonly PlanFeature[] = [
  {
    n: 1,
    label: 'The bar',
    line: 'The backlit counter across the far end, arched shelves on the wall behind it.',
    x: 75.52,
    y: 43.75,
  },
  {
    n: 2,
    label: 'The screen wall',
    line: 'Wall-sized, filling the opposite end. Every setting faces it.',
    x: 11.98,
    y: 59.38,
  },
  {
    n: 3,
    label: 'The banquette',
    line: 'Bench seating the length of the white brick, down one side.',
    x: 39.58,
    y: 13.44,
  },
  {
    n: 4,
    label: 'The green column',
    line: 'Planted, on the banquette side, and staying exactly where it is.',
    x: 18.75,
    y: 32.03,
  },
  {
    n: 5,
    label: 'The open floor',
    line: 'Everything here moves. This is the part the four settings re-set.',
    x: 46.88,
    y: 59.38,
  },
  {
    n: 6,
    label: 'The way up',
    line: 'One flight from Nicholson Street, arriving at the bar end.',
    x: 76.04,
    y: 84.06,
  },
];

/** What the drawing says, for a reader who is not going to see it. Paired with
    the SVG's own title as its `aria-describedby`, so the plan is a described
    image rather than an unlabelled graphic — the four settings then read as
    four described states of one room. */
export const planDescription =
  'One upstairs room, drawn from above. The bar stands across the far end with the arched spirit shelves on the wall behind it; a wall-sized screen fills the opposite end; the banquette runs the length of the white brick down one side, with the planted column beside it; the stairs from Nicholson Street arrive at the bar end.';

/** What is already in the room, so nobody has to hire it in. */
export const facilities: readonly Row[] = [
  {
    label: 'The screen',
    value:
      'Wall-sized, on HDMI or wirelessly — slides, footage or the game, and a playlist behind it the rest of the night.',
  },
  {
    label: 'Sound',
    value:
      'A house PA with a radio mic for speeches, and a DJ booth if you are bringing one.',
  },
  {
    label: 'The bar',
    value:
      'The room has its own — draught, spirits and cocktails — run on a tab or on a drinks list set in advance.',
  },
  {
    label: 'Food',
    value:
      'Bar snacks any night. For functions, grazing and hot boards from $18 a head, ordered a week ahead.',
  },
  {
    label: 'Set-up',
    value:
      'From 3 PM on an exclusive-use night, and half an hour at the end to pack down.',
  },
  {
    label: 'Getting up there',
    value:
      'One flight of stairs from Nicholson Street — the lit arch beside the deli, LOFT91 above the door.',
  },
];
