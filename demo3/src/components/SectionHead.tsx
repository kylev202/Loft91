import type { ReactNode } from 'react';

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
  standfirst,
}: {
  /** Omitted on the home page, where the `01`…`04` numerals belong to the four
      destinations and reusing them for a section would name two things once. */
  index?: string;
  label: string;
  heading: ReactNode;
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
        {heading}
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
