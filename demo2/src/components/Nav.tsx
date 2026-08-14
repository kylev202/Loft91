import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { wordmarkBlack } from '../data/photos';
import { Anchor } from './ui/Anchor';

export const sections = [
  { id: 'menu', label: 'Menu' },
  { id: 'packages', label: 'Packages' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'faq', label: 'Questions' },
  { id: 'visit', label: 'Visit' },
] as const;

/**
 * The nav is a rule with things sitting on it — the running head of a printed
 * programme, not a floating pill and not a glass slab. Paper background, one
 * hairline underneath, no blur, no shadow, nothing that moves.
 *
 * The destinations carry the same `01`…`05` numbers the section heads do, so
 * the nav and the page share one table of contents rather than two vocabularies.
 * **Active state is typographic**: the number of the section you are in goes to
 * full ink while the rest stay pale. There is no accent hue in this system to
 * underline it with, and a rule under the active item would put two competing
 * horizontals within 20px of each other.
 *
 * **Always visible.** Any "hide until scrolled up" behaviour reintroduces a real
 * keyboard hazard: a nav revealed only by a scroll gesture is unreachable for
 * anyone who starts at the top and never scrolls up.
 */
export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    // No scroll listener — ScrollTrigger only. Created in page order so the
    // refresh order matches the scroll order.
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => self.isActive && setActive(id),
      });
    }
  }, {});

  return (
    <>
      <header className="sticky top-0 z-(--z-nav) border-b border-rule bg-paper">
        <div className="shell flex h-18 items-center justify-between gap-md">
          <Anchor to="hero" className="flex h-full shrink-0 items-center pr-md">
            <img
              src={wordmarkBlack.src}
              srcSet={wordmarkBlack.srcSet}
              sizes="140px"
              alt="Loft 91 — back to top"
              width={wordmarkBlack.w}
              height={wordmarkBlack.h}
              className="h-3.5 w-auto shrink-0"
              translate="no"
            />
          </Anchor>

          <nav aria-label="Sections" className="hidden h-full items-stretch lg:flex">
            {sections.map(({ id, label }, i) => (
              <Anchor
                key={id}
                to={id}
                className="flex items-center gap-2xs px-md transition-colors duration-(--dur-micro) ease-out hover:bg-paper-2"
              >
                <span
                  aria-hidden="true"
                  className={`label tabular-nums transition-colors duration-(--dur-micro) ease-out ${
                    active === id ? 'text-ink' : 'text-ink-3'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-current={active === id ? 'true' : undefined}
                  className={`title transition-colors duration-(--dur-micro) ease-out ${
                    active === id ? 'text-ink' : 'text-ink-3'
                  }`}
                >
                  {label}
                </span>
              </Anchor>
            ))}
          </nav>

          <Anchor
            to="visit"
            className="hidden h-11 shrink-0 items-center bg-ink px-md text-small text-paper transition-opacity duration-(--dur-micro) ease-out hover:opacity-80 active:opacity-70 active:duration-(--dur-press) lg:inline-flex"
          >
            Enquire
          </Anchor>

          {/* A word, not an icon. The whole page is set in type; a hamburger
              would be the one pictogram on it. */}
          <button
            ref={burger}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="nav-overlay"
            className="title flex h-11 min-w-11 items-center justify-end text-ink lg:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <NavOverlay open={open} trigger={burger} onClose={() => setOpen(false)} />
    </>
  );
}

/**
 * The full-screen menu — the programme's contents page. A dialog in the real
 * sense: focus is trapped inside it, `Escape` closes, focus returns to the
 * trigger, and scroll does not chain to the page behind.
 *
 * The lines arrive one at a time, 55ms apart, from CSS: it plays once per open
 * and belongs off the main thread. `--index` is set on the line itself, never on
 * the parent — a custom property on a parent recalculates every child.
 */
function NavOverlay({
  open,
  trigger,
  onClose,
}: {
  open: boolean;
  trigger: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = panel.current;
    node?.querySelector<HTMLElement>('a,button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !node) return;
      const focusable = node.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      // Restored to the trigger element itself, not to whatever was active when
      // the overlay opened — Safari does not focus a <button> on tap.
      trigger.current?.focus();
    };
  }, [open, onClose, trigger]);

  if (!open) return null;

  return (
    <div
      ref={panel}
      id="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-(--z-overlay) flex flex-col overscroll-contain bg-paper lg:hidden"
      style={{ paddingBottom: 'max(var(--spacing-lg), env(safe-area-inset-bottom))' }}
    >
      <div className="shell flex h-18 shrink-0 items-center justify-end border-b border-rule">
        <button
          type="button"
          onClick={onClose}
          className="title flex h-11 min-w-11 items-center justify-end text-ink"
        >
          Close
        </button>
      </div>

      <nav aria-label="Sections" className="shell flex flex-1 flex-col justify-center">
        {sections.map(({ id, label }, i) => (
          <span key={id} className="block overflow-hidden border-b border-rule">
            <Anchor to={id} onNavigate={onClose} className="flex min-h-16 items-baseline py-sm">
              <span className="menu-line" style={{ ['--index' as string]: i }}>
                <span className="label mr-md text-ink-3 tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[2.5rem] leading-none font-medium tracking-tight text-ink">
                  {label}
                </span>
              </span>
            </Anchor>
          </span>
        ))}
      </nav>

      <div className="shell">
        <Anchor
          to="visit"
          onNavigate={onClose}
          className="flex min-h-14 items-center justify-center bg-ink px-md text-small text-paper active:opacity-70 active:duration-(--dur-press)"
        >
          Enquire about functions
        </Anchor>
      </div>
    </div>
  );
}
