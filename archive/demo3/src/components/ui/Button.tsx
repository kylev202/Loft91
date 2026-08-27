import type { ReactNode } from 'react';
import { withBase } from '../../lib/base';

/**
 * Two buttons, and there is no third.
 *
 * `primary` is the only solid brass fill on the site. Brass is a light source
 * in this system, so filling a shape with it is reserved for the one action
 * that does the commercial job — starting a functions enquiry. Page colour on
 * brass measures 8.08:1.
 *
 * `secondary` is an outlined box on `--color-outline`, which is 3.47:1 against
 * the page and so clears the 3:1 floor for a boundary that is itself the
 * affordance. Its label is full ink at 17.03:1.
 *
 * Both are 48px tall, above the 44px touch floor, before any padding.
 */
export function Button({
  href,
  children,
  variant = 'secondary',
  className = '',
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  external?: boolean;
}) {
  const base =
    'inline-flex min-h-12 items-center justify-center px-md text-small transition-colors duration-(--dur-micro) ease-out active:duration-(--dur-press)';

  const skin =
    variant === 'primary'
      ? 'bg-brass text-on-brass hover:bg-brass-hi active:bg-brass-hi'
      : 'border border-outline text-ink hover:border-brass hover:text-brass active:border-brass';

  return (
    <a
      href={withBase(href)}
      className={`${base} ${skin} ${className}`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {children}
    </a>
  );
}
