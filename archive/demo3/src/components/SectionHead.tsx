import type { ReactNode } from 'react';
import { withBase } from '../lib/base';

/**
 * The head of a section inside a page: a brass rule across the full column, the
 * section's index and label sitting on it, and the heading beneath.
 *
 * The rule runs the whole width rather than stopping at the text, because it is
 * doing the same job as the hairline under a page title — dividing the page —
 * and a rule that stops halfway reads as an underline instead. The index is
 * `tabular-nums` so `01` and `04` occupy identical space and the labels below
 * them align down the page.
 */
export function SectionHead({
  index,
  label,
  heading,
  href,
  standfirst,
}: {
  /** Omitted on the home page, where the `01`…`05` numerals belong to the
      destinations and reusing them for a section would name two things once. */
  index?: string;
  label: string;
  heading: ReactNode;
  /** Where the heading goes. On the home page every section is a condensed
      preview of a document, and pressing its title is the way through — so the
      heading itself is the link rather than a "read more" bolted underneath.
      The arrow is `aria-hidden` decoration on a link whose accessible name is
      already the heading text. */
  href?: string;
  standfirst?: ReactNode;
}) {
  return (
    <header className="mb-xl">
      <div className="rule-brass w-full" data-reveal />
      <div className="mt-xs flex items-baseline gap-md" data-reveal>
        {index && <span className="label text-brass tabular-nums">{index}</span>}
        <span className="label text-ink-3">{label}</span>
      </div>

      <h2
        className="mt-lg max-w-(--container-measure) font-display text-heading font-medium tracking-tight text-ink"
        data-reveal
      >
        {href ? (
          <a
            href={withBase(href)}
            className="group inline-flex flex-wrap items-baseline gap-x-md transition-colors duration-(--dur-micro) ease-out hover:text-brass"
          >
            {heading}
            <span
              aria-hidden="true"
              className="text-brass transition-transform duration-(--dur-short) ease-out group-hover:translate-x-2"
            >
              →
            </span>
          </a>
        ) : (
          heading
        )}
      </h2>

      {standfirst && (
        <p
          className="mt-md max-w-(--container-measure) font-editorial text-lead text-ink-2"
          data-reveal
        >
          {standfirst}
        </p>
      )}
    </header>
  );
}
