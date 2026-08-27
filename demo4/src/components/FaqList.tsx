import type { FaqItem } from '../data/faq';

/**
 * The questions, as `<details>`/`<summary>` — keyboard-operable and screen-reader
 * announced without a line of JavaScript, and open-by-URL if a `#hash` ever
 * points inside one.
 *
 * Deliberately not height-animated. Opening a `<details>` animates `height`,
 * which is a layout property, and this system animates transform and opacity
 * only; the `+` rotating into a `×` is the whole disclosure gesture.
 *
 * Rendered from `data/faq.tsx` on both surfaces — three items on the home page,
 * all of them on `/faq/` — so the two can never drift.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="max-w-(--container-measure)">
      {items.map(({ q, a }) => (
        <details key={q} className="group border-b border-rule" data-reveal>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-md py-sm text-item text-ink transition-colors duration-(--dur-micro) ease-out hover:text-ink-2 [&::-webkit-details-marker]:hidden">
            <span className="text-pretty">{q}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-lead text-ink-3 transition-transform duration-(--dur-short) ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="pb-md text-body text-ink-2">{a}</div>
        </details>
      ))}
    </div>
  );
}
