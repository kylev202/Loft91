import type { ReactNode } from 'react';

interface SectionHeadProps {
  /** Two-digit index — this is the page's own table of contents. */
  index: string;
  id: string;
  title: string;
  /** The one Zodiak line the section is allowed. Optional. */
  children?: ReactNode;
}

/**
 * Every section opens identically: a rule across the full measure, the index
 * and the title sitting *on* it, and — if the section has something to say —
 * one editorial line beneath.
 *
 * The title is 13px. That is the system, not an oversight: the structure
 * whispers so the content can speak. A 6rem section headline announces the
 * furniture, and on a page whose real content is a drinks list and a set of
 * photographs, the furniture is not the point.
 *
 * It is still an `<h2>` — only its voice is small.
 */
export function SectionHead({ index, id, title, children }: SectionHeadProps) {
  return (
    <header className="mb-xl border-t border-ink pt-sm" data-reveal>
      <div className="flex items-baseline gap-md">
        <span className="title text-ink-3 tabular-nums">{index}</span>
        <h2 id={`${id}-h`} className="title text-ink">
          {title}
        </h2>
      </div>
      {children ? (
        <p className="mt-lg max-w-[36ch] text-pretty font-editorial text-editorial text-ink">
          {children}
        </p>
      ) : null}
    </header>
  );
}
