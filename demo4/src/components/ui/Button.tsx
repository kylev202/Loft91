import type { ReactNode } from 'react';
import { withBase } from '../../lib/base';

/**
 * Two buttons, and there is no third.
 *
 * With no accent hue in the system, the primary action is the ink itself: a
 * solid near-black block with paper-coloured type, at 17.38:1. That is the
 * whole idea, and it is also the reference language's own convention — a
 * high-end retail page states its one commercial action as a black rectangle
 * with small wide-tracked capitals in it, and states everything else as a link.
 *
 * `secondary` is an outlined box on `--color-outline`, 3.97:1 against the page
 * and so clear of the 3:1 floor for a boundary that is itself the affordance.
 * Its label is full ink at 17.38:1. On hover it fills with ink rather than
 * changing colour — there is no second hue to change to, so the hover state is
 * the button becoming the primary one.
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
    'label inline-flex min-h-12 items-center justify-center border px-lg transition-colors duration-(--dur-micro) ease-out active:duration-(--dur-press)';

  const skin =
    variant === 'primary'
      ? 'border-fill bg-fill text-on-fill hover:bg-transparent hover:text-ink'
      : 'border-outline text-ink hover:border-fill hover:bg-fill hover:text-on-fill';

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
