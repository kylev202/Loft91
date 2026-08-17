import type { ReactNode } from 'react';
import { Anchor } from './Anchor';

/**
 * A hairline arrow, drawn rather than imported — one stroke width site-wide, at
 * a weight no icon set ships. It travels on hover; it is not wrapped in a
 * circle, because nothing in this system is round.
 */
function Arrow() {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className="h-3 w-3 shrink-0 translate-y-px transition-transform duration-(--dur-short) ease-out group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0.5 7h12M8 2.5 12.5 7 8 11.5" />
    </svg>
  );
}

interface ButtonProps {
  to: string;
  children: ReactNode;
  /**
   * `solid` is ink on paper (or paper on ink, inside `.on-ink`) and is the one
   * emphatic control per screen. `line` is a hairline box. `text` is a link
   * that behaves like one.
   */
  variant?: 'solid' | 'line' | 'text';
  onNavigate?: () => void;
  className?: string;
}

/* 44px minimum target met by padding rather than a min-height that would leave
   the label floating off-centre. `:active` sits outside any hover gate — it is
   the only confirmation a touch user gets that the tap was heard. */
const base =
  'group inline-flex items-center gap-2xs rounded-none font-interface text-small ' +
  'min-h-11 px-md ' +
  'transition-[background-color,color,border-color,opacity] duration-(--dur-micro) ease-out ' +
  'active:opacity-70 active:duration-(--dur-press)';

const variants = {
  solid: 'bg-ink text-paper hover:bg-ink-2',
  line: 'border border-outline text-ink hover:bg-ink hover:text-paper',
  text: 'px-0 text-ink underline decoration-rule-strong underline-offset-[0.35em] hover:decoration-ink',
} as const;

export function Button({
  to,
  children,
  variant = 'solid',
  onNavigate,
  className = '',
}: ButtonProps) {
  return (
    <Anchor to={to} onNavigate={onNavigate} className={`${base} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      <Arrow />
    </Anchor>
  );
}
