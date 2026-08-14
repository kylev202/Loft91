import type { MouseEvent, ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { scrollToId } from '../../hooks/useSmoothScroll';

interface AnchorProps {
  /** Section id, without the `#`. */
  to: string;
  children: ReactNode;
  className?: string;
  /** Fired after navigation — the mobile overlay uses it to close itself. */
  onNavigate?: () => void;
}

/**
 * An in-page link. Stays a real `<a href="#id">`, so Cmd/Ctrl-click,
 * middle-click, "copy link" and the browser's own history all keep working; the
 * handler only takes over the plain left-click, to hand the scroll to Lenis.
 */
export function Anchor({ to, children, className, onNavigate }: AnchorProps) {
  const reduced = usePrefersReducedMotion();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToId(to, reduced);
    // The URL should still say where you are — a section is a shareable place.
    history.replaceState(null, '', `#${to}`);
    onNavigate?.();
  };

  return (
    <a href={`#${to}`} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
