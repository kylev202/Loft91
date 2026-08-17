import type { ReactNode } from 'react';
import { withBase } from '../lib/base';

/**
 * The asymmetrical bento from `demo/` — one wide block and two beside it, and
 * it is the only grid on the site that is deliberately uneven.
 *
 * The box itself is that page's `.bezel`: a 1px frame with a 6px reveal inside
 * it, so the block reads as something set into the page rather than a card
 * floating on top of it. Rebuilt in this system's colours, with no shadow —
 * on a near-black page a drop shadow is invisible and a glow is a nightclub
 * flyer (theme.css, rule 3) — but with `--radius-lg`/`--radius-md` on the
 * shell and core, the pair concentric across the 6px reveal. The whole box
 * is one link with one accessible name; the arrow at its foot is decoration
 * on top of that.
 *
 * On the home page all three go to `/packages/`: the brief is that the boxes
 * show the shape of what is on offer and the page carries the detail.
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
      className={`group rounded-lg border border-rule bg-panel p-1.5 transition-colors duration-(--dur-short) ease-out hover:border-rule-strong ${
        wide ? 'md:col-span-6 lg:col-span-7 lg:row-span-2' : 'md:col-span-3 lg:col-span-5'
      }`}
    >
      <div className="flex h-full flex-col items-start gap-md rounded-md bg-panel p-lg transition-colors duration-(--dur-short) ease-out group-hover:bg-panel-2">
        <h3 className="font-display text-lead font-medium tracking-tight text-ink">{title}</h3>
        {meta && <p className="text-small text-ink-3">{meta}</p>}
        {children}

        {/* `mt-auto` pushes the arrow to the foot of the box, so it aligns
            across a row and the wide block's extra height reads as breathing
            room rather than a dead void. */}
        <span
          aria-hidden="true"
          className="mt-auto flex items-baseline gap-2xs text-small text-brass"
        >
          See the packages
          <span className="transition-transform duration-(--dur-short) ease-out group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
