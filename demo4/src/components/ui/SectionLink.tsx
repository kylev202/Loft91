import type { ReactNode } from 'react';
import { withBase } from '../../lib/base';

/**
 * The hand-off at the foot of a home-page section.
 *
 * Every section on the index page is a condensed version of a document, so
 * every one of them ends the same way: a full-width rule with the name of the
 * place it continues, and an arrow. `SectionHead` carries the same destination
 * as a small link at the top of the section — this is the version you reach
 * when you have read the section and are already at the bottom of it.
 *
 * A rule and a row rather than a button: the two buttons in this system are
 * spent (the ink fill for the commercial action, the outline for everything
 * else), and a third shape for "keep reading" would be one shape too many.
 */
export function SectionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={withBase(href)}
      data-reveal
      className="group mt-2xl flex min-h-14 items-center justify-between gap-md border-t border-rule-strong pt-md font-display text-item text-ink transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="shrink-0 transition-transform duration-(--dur-short) ease-out group-hover:translate-x-2"
      >
        →
      </span>
    </a>
  );
}
