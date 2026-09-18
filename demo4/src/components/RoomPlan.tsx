import { useId, type CSSProperties } from 'react';
import type { LayoutId } from '../data/space';

/**
 * The room, drawn from above.
 *
 * ── What this is, and what it is not ─────────────────────────────────────
 * It is a **schematic**: the room's parts in the right relation to one
 * another, at roughly the right proportion, so that a function organiser can
 * see at a glance where the bar is, where the screen is, and what happens to
 * the floor when the night changes shape. It is NOT a measured drawing, it
 * carries no dimensions, and the caption under it says so on the page.
 *
 * The parts are read off the client's own photographs — the backlit counter
 * with the arched shelves behind it, the wall-sized screen on the opposite
 * end, the banquette down the brick, the planted column beside it, the
 * stairwell off Nicholson Street. That is the same carve-out `data/space.ts`
 * already works under, and the arrangement is argued out at `ROOM` below.
 * What is *not* in the photographs is the geometry: how long the room is
 * against how wide, and where on the bar end the stairs land. Those are drawn
 * to be plausible and legible, and they are the one thing on this page a
 * client would correct. MEMORY.md Q17.
 *
 * ── Replacing it with the venue's real plan ──────────────────────────────
 * When the client supplies a drawing, this component is the only file that
 * changes:
 *
 *   1. Put the artwork in `public/img/` — SVG preferred, since it stays crisp
 *      and can inherit the ink tokens; a raster works if that is all there is.
 *   2. Swap `<Shell />` below for the supplied drawing, keeping this `viewBox`
 *      aspect (3:2) or changing `VIEW` to match the new one.
 *   3. Re-read the six pin positions in `planFeatures` (`data/space.ts`) off
 *      the new drawing. They are percentages of this box, so they do not
 *      survive a change of geometry.
 *   4. Redraw or delete the four `FURNITURE` sets. If the supplied plan is one
 *      fixed drawing with no layout variants, drop the `layout` prop and the
 *      groups with it — the tabs above still switch the figure, the note and
 *      the photograph, which is most of what they are for.
 *
 * ── Why the type is HTML and not SVG ─────────────────────────────────────
 * Every word on and around this drawing is a DOM element positioned over the
 * box, not `<text>` inside it. Text inside an SVG scales with the drawing: a
 * label sized to read on a 1400px desktop plan is 4px on a 360px phone, and
 * the phone is the primary target (CLAUDE.md §4.5). Positioned over it, the
 * pins hold a fixed 20–24px and the legend stays at `--text-label` at every
 * width, in the site's own face rather than in whatever the SVG inherits.
 *
 * ── The visual grammar ───────────────────────────────────────────────────
 * Solid shapes are fixed — the bar, the screen, the banquette, the column.
 * Outlined shapes are furniture, and furniture is what the four layouts move.
 * That distinction is the reason the drawing is worth having: it is the
 * difference between what the room *is* and what you can *do* with it, stated
 * in two line weights instead of a paragraph.
 */

/** The drawing's coordinate space. 3:2, so the container can use `aspect-3/2`
    and the pin percentages in `data/space.ts` stay honest. */
const VIEW = { w: 960, h: 640 } as const;

/**
 * The interior boundary: a long rectangle with the stairwell landing pushed
 * out of the bar end of it.
 *
 *   (60,60) ─────────────────────────── (900,60)
 *      │                                    │
 *   (60,500) ───── (650,500)   (810,500) ─ (900,500)
 *                      │           │
 *                   (650,580) ─ (810,580)
 *
 * The arrangement is read off three of the client's frames rather than
 * arranged for the drawing's convenience: `bar-wide` puts the counter across
 * one end with the arched shelves on the wall behind it; `lounge` puts the
 * wall-sized screen on the opposite end wall, with the banquette running down
 * the brick side toward it; `room` looks the other way down the same floor,
 * brick to the left and the bar at the far end, which is what confirms the two
 * are opposite ends of one room rather than two rooms. The planted column
 * stands on the banquette side in both.
 *
 * What remains a guess is the proportion, and where on the bar end the stairs
 * land. Hence the caption, and MEMORY.md Q17.
 */
const ROOM = 'M 60 60 H 900 V 500 H 810 V 580 H 650 V 500 H 60 Z';

type Shape =
  | readonly ['r', number, number, number, number]
  | readonly ['c', number, number, number];

interface Furniture {
  /** A part of the floor held for one group: tinted, and edged where it does
      not run to a wall. */
  readonly zone?: readonly [number, number, number, number];
  readonly edge?: string;
  readonly shapes: readonly Shape[];
  /** Drawn faint — the part of the room that carries on trading around you. */
  readonly dim?: readonly Shape[];
}

/** Stools down the near face of the counter. Written once because three of the
    four layouts want them and the fourth deliberately does not. */
const STOOLS: readonly Shape[] = [
  ['c', 678, 175, 10],
  ['c', 678, 222, 10],
  ['c', 678, 269, 10],
  ['c', 678, 316, 10],
  ['c', 678, 363, 10],
];

/** The tables that stand in front of the banquette on an ordinary night. */
const BRICK_TABLES: readonly Shape[] = [130, 220, 310, 400, 490, 570].map(
  (x): Shape => ['r', x, 120, 68, 44],
);

/** And the row out on the open floor beside them. */
const FLOOR_TABLES: readonly Shape[] = [130, 230, 330, 430, 530].map(
  (x): Shape => ['r', x, 300, 68, 44],
);

/** Chairs down both sides of the long table, at 70 units of pitch. */
const LONG_TABLE_CHAIRS: readonly Shape[] = [156, 226, 296, 366, 436, 506, 576].flatMap(
  (x): readonly Shape[] => [
    ['r', x, 252, 44, 12],
    ['r', x, 336, 44, 12],
  ],
);

const FURNITURE: Record<LayoutId, Furniture> = {
  /* The floor cleared: leaners pushed out to the walls, the middle left empty
     between the bar at one end and the screen at the other. */
  standing: {
    shapes: [
      ['c', 140, 165, 17],
      ['c', 140, 300, 17],
      ['c', 140, 430, 17],
      ['c', 300, 435, 17],
      ['c', 460, 435, 17],
      ['c', 620, 435, 17],
      ['c', 620, 165, 17],
      ...STOOLS,
    ],
  },

  /* The room as it stands most nights: tables the length of the banquette, a
     second row out on the floor, and stools at the counter. */
  seated: {
    shapes: [...BRICK_TABLES, ...FLOOR_TABLES, ...STOOLS],
  },

  /* One table the length of the white brick. The stools go with it: a floor
     given over to a dinner is not also a floor with people standing at the
     bar behind the guests' chairs. */
  'long-table': {
    shapes: [['r', 140, 270, 500, 60], ...LONG_TABLE_CHAIRS],
  },

  /* The banquette end held, the rest of the bar trading as usual — which is
     exactly what the faint half of this drawing is saying. */
  banquette: {
    zone: [100, 65, 460, 220],
    edge: 'M 100 65 V 285 H 560 V 65',
    shapes: [130, 220, 310, 400, 490].map((x): Shape => ['r', x, 120, 68, 44]),
    dim: [...FLOOR_TABLES, ...STOOLS],
  },
};

function draw(shape: Shape, i: number) {
  return shape[0] === 'r' ? (
    <rect key={i} x={shape[1]} y={shape[2]} width={shape[3]} height={shape[4]} />
  ) : (
    <circle key={i} cx={shape[1]} cy={shape[2]} r={shape[3]} />
  );
}

/** The parts of the room that do not move. Solid, so the eye separates them
    from the outlined furniture without having to be told. */
function Shell() {
  return (
    <g className="fill-panel-2 stroke-outline" strokeWidth={2}>
      {/* The bar: the counter standing across the far end, with the arched
          shelves on the wall behind it as the darker strip. */}
      <rect x={700} y={150} width={50} height={260} />
      <rect x={880} y={150} width={15} height={260} className="fill-ink-4 stroke-none" />

      {/* The screen, filling the opposite end wall. Ink rather than the
          fitting tone — it is the one fixed thing in the room that is also a
          feature, and every layout is set facing it. */}
      <rect x={66} y={150} width={13} height={280} className="fill-ink stroke-none" />

      {/* The banquette, the length of the white brick. */}
      <rect x={120} y={65} width={520} height={42} />

      {/* The planted column, standing on the banquette side. */}
      <circle cx={250} cy={205} r={22} />

      {/* The stairs arriving at the bar end: treads, then the arrow that says
          which way is up. */}
      <path
        d="M 665 512 H 795 M 665 524 H 795 M 665 536 H 795 M 665 548 H 795 M 665 560 H 795"
        className="fill-none stroke-outline"
      />
      <path d="M 730 494 l -11 15 h 22 Z" className="fill-ink stroke-none" />
    </g>
  );
}

export function RoomPlan({
  layout,
  title,
  desc,
}: {
  layout: LayoutId;
  /** The drawing's accessible name — what this plan is currently showing. */
  title: string;
  /** And what is in it, for a reader who will never see the lines. */
  desc: string;
}) {
  /* Wired explicitly rather than relying on `<title>` alone. A `<title>` first
     child does name an `img`-role SVG in every current engine, but the
     `<desc>` needs the reference regardless, and doing one by hand and the
     other by inference is the kind of asymmetry that quietly rots. */
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{desc}</desc>

      {/* The floor and its walls. The floor takes the page tone rather than no
          fill at all, so the held zone below has something to sit on. */}
      <path d={ROOM} className="fill-page stroke-ink" strokeWidth={10} strokeLinejoin="miter" />

      {Object.entries(FURNITURE).map(([id, set]) => (
        <g
          key={id}
          /* All four sets are drawn and three are held at zero, so changing a
             tab cross-fades rather than re-mounting — and the fixed shell
             underneath never redraws. */
          style={{ opacity: id === layout ? 1 : 0 }}
          className="transition-opacity duration-(--dur-short) ease-out motion-reduce:transition-none"
        >
          {set.zone && (
            <rect
              x={set.zone[0]}
              y={set.zone[1]}
              width={set.zone[2]}
              height={set.zone[3]}
              className="fill-panel"
            />
          )}
          {set.edge && (
            <path
              d={set.edge}
              className="fill-none stroke-outline"
              strokeWidth={2}
              strokeDasharray="10 8"
            />
          )}
          {set.dim && (
            <g className="fill-none stroke-outline opacity-35" strokeWidth={2}>
              {set.dim.map(draw)}
            </g>
          )}
          <g className="fill-page stroke-outline" strokeWidth={2}>
            {set.shapes.map(draw)}
          </g>
        </g>
      ))}

      <Shell />
    </svg>
  );
}

/**
 * A numbered callout. The same object twice — once pinned to the drawing,
 * once at the head of its legend row — which is the only thing that makes the
 * numeral mean anything.
 *
 * Square, not round. This system draws in rules and rectangles and contains
 * exactly one curve (`--radius-plate`, and it marks a mounted photograph); a
 * round chip would be a second idea about corners, borrowed from an
 * architectural convention this drawing is not otherwise following.
 *
 * `aria-hidden` at both ends: the pin is a cross-reference between a picture
 * and a list, and the list already says the words. A screen reader that
 * announced "1" twice would be reading the wiring rather than the room.
 */
export function PlanPin({
  n,
  className = '',
  style,
}: {
  n: number;
  className?: string;
  /** Only the two percentages that place a pin on the drawing. The legend's
      copy of the same pin passes nothing. */
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={style}
      /* 20px on a phone, where the whole drawing is only ~330px wide and a
         24px chip starts covering the thing it is pointing at; 24px from the
         first breakpoint up. The numeral stays 11px at both — it is the chip
         that shrinks, not the type. */
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center bg-fill text-label font-medium tabular-nums text-on-fill sm:h-6 sm:w-6 ${className}`}
    >
      {n}
    </span>
  );
}
