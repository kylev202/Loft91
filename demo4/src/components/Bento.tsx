import type { ReactNode } from 'react';
import { withBase } from '../lib/base';

/**
 * The asymmetrical block grid — one wide box and two beside it.
 *
 * ── The bezel is gone ────────────────────────────────────────────────────
 * In Nocturne each box was a double frame: a 1px border with a 6px reveal
 * inside it, and `--radius-lg`/`--radius-md` on the shell and core so the two
 * curves stayed concentric across that reveal. It was a good object on a
 * near-black page, where a bezel is how you suggest depth without a shadow.
 *
 * It cannot survive radius zero. A concentric double frame with square corners
 * is not a bezel, it is two rectangles — the effect depended entirely on the
 * curves being nested, and without them the inner border reads as a rendering
 * mistake. So the box is now what every other raised surface in this system is:
 * one hairline, one tone step, square corners, and the hover moves the tone
 * rather than the frame. That matches `HappyHourPanel` exactly, which is the
 * point — Nocturne had two different ways to draw a raised block and this has
 * one.
 *
 * The whole box is one link with one accessible name; the arrow at its foot is
 * decoration on top of that. On the home page all three go to `/packages/`: the
 * brief is that the boxes show the shape of what is on offer and the page
 * carries the detail.
 */
export function Bento({ children }: { children: ReactNode }) {
  return <div className="grid gap-md md:grid-cols-6 lg:grid-cols-12">{children}</div>;
}

export function BentoBox({
  title,
  meta,
  href,
  wide = false,
  children,
}: {
  title: string;
  /** The one-line qualifier under the title — capacity, duration, a price. */
  meta?: ReactNode;
  href: string;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <a
      href={withBase(href)}
      data-reveal
      className={`group flex flex-col items-start gap-md border border-rule bg-panel p-lg transition-colors duration-(--dur-short) ease-out hover:border-rule-strong hover:bg-panel-2 ${
        wide ? 'md:col-span-6 lg:col-span-7 lg:row-span-2' : 'md:col-span-3 lg:col-span-5'
      }`}
    >
      <h3 className="font-display text-lead tracking-tight text-ink">{title}</h3>
      {meta && <p className="text-small text-ink-3">{meta}</p>}
      {children}

      {/* `mt-auto` pushes the arrow to the foot of the box, so it aligns across
          a row and the wide block's extra height reads as breathing room rather
          than a dead void. */}
      <span aria-hidden="true" className="label mt-auto flex items-baseline gap-2xs text-ink-3">
        See the packages
        <span className="transition-transform duration-(--dur-short) ease-out group-hover:translate-x-1">
          →
        </span>
      </span>
    </a>
  );
}
