import type { ReactNode } from 'react';
import { withBase } from '../lib/base';

/**
 * The head of a section inside a page: an ink rule across the full column, the
 * section's index and label sitting on it, the way onward at the far right of
 * the same line, and the heading beneath.
 *
 * The rule runs the whole width rather than stopping at the text, because it is
 * doing the same job as the hairline under a page title — dividing the page —
 * and a rule that stops halfway reads as an underline instead. The index is
 * `tabular-nums` so `01` and `04` occupy identical space and the labels below
 * them align down the page.
 *
 * ── What moved, and why ──────────────────────────────────────────────────
 * In Nocturne the section's link was the heading itself, with an arrow after
 * it. Here it is a small capitalised link pinned to the right-hand end of the
 * label row. That is the reference language's convention and it is better for
 * two independent reasons: the heading gets to be a plain serif line rather
 * than an underlined interactive one, and the way onward is stated at the top
 * of the section — where somebody scanning the page is looking — rather than
 * only after they have read to the end of it.
 *
 * ── The standfirst is gone (client instruction, 2026-08-31) ───────────────
 * A section could set a `--text-lead` paragraph under its heading. Six did, on
 * About, Packages and FAQ, and each one restated what was immediately below
 * it: the feature list as a sentence, the tier prices as a sentence, the eight
 * questions as a list of topics. The prop is removed rather than left unused,
 * so the component cannot quietly grow them back one page at a time; the one
 * paragraph that survived the cut is set in its section's own body, which is
 * where a paragraph that is content rather than chrome belongs.
 *
 * A head is now four things at most: the rule, the index, the label, and the
 * heading — plus the optional way onward.
 */
export function SectionHead({
  index,
  label,
  heading,
  href,
  linkLabel = 'View all',
}: {
  /** Omitted on the home page, where the `01`…`05` numerals belong to the
      destinations and reusing them for a section would name two things once. */
  index?: string;
  label: string;
  heading: ReactNode;
  /** Where the section continues. On the home page every section is a condensed
      preview of a document, and this is the way through. */
  href?: string;
  linkLabel?: string;
}) {
  return (
    <header className="mb-xl">
      <div className="rule-ink w-full" data-reveal />

      <div className="mt-xs flex items-baseline justify-between gap-md" data-reveal>
        <span className="flex items-baseline gap-md">
          {index && <span className="label text-ink-3 tabular-nums">{index}</span>}
          <span className="label text-ink">{label}</span>
        </span>

        {href && (
          <a
            href={withBase(href)}
            className="group label flex shrink-0 items-baseline gap-2xs text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
          >
            {linkLabel}
            {/* `aria-hidden` decoration on a link whose accessible name is
                already the label text. */}
            <span
              aria-hidden="true"
              className="transition-transform duration-(--dur-short) ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        )}
      </div>

      <h2
        className="mt-lg max-w-(--container-measure) font-display text-heading uppercase text-ink"
        data-reveal
      >
        {heading}
      </h2>
    </header>
  );
}
