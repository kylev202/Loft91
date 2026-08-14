import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { pages, home } from '../data/site';
import { wordmarkWhite } from '../data/photos';

/**
 * A hairline running head, fixed to the top of every page.
 *
 * **Transparent over the cover, solid once you leave it.** At the top of a page
 * the nav sits inside the dense band of the cover grade (0.88 → 12.64:1 against
 * a blown-out white pixel), so it needs no fill of its own and the photograph
 * runs edge to edge behind it. Past the cover it takes the page colour and a
 * hairline, because a transparent bar over a drinks list is unreadable. No
 * blur, no shadow — the thesis has no floating surfaces.
 *
 * **Always visible.** Any "hide until scrolled up" behaviour reintroduces a
 * real keyboard hazard: a nav revealed only by a scroll gesture is unreachable
 * for anyone who starts at the top and never scrolls up.
 *
 * Active state is `aria-current="page"` plus a brass numeral and a brass rule
 * under the item — the accent's whole job in this system is to mark the thing
 * that is lit, and the page you are on is that thing.
 */
export function Nav({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  // No scroll listener of our own: ScrollTrigger is already running the frame
  // loop, and a second one would sample the same scroll twice.
  useGSAP(() => {
    ScrollTrigger.create({
      start: 'top -120',
      end: 99999,
      onToggle: (self) => setScrolled(self.isActive),
    });
  }, {});

  return (
    <>
      <header
        style={{ viewTransitionName: 'nav' }}
        className={`fixed inset-x-0 top-0 z-(--z-nav) transition-colors duration-(--dur-short) ease-out ${
          scrolled ? 'border-b border-rule bg-page' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="shell flex h-(--nav-h) items-center justify-between gap-md">
          <a
            href={home.href}
            aria-current={current === 'home' ? 'page' : undefined}
            className="flex h-full shrink-0 items-center pr-md"
          >
            <img
              src={wordmarkWhite.src}
              srcSet={wordmarkWhite.srcSet}
              sizes="96px"
              alt="Loft 91 — home"
              width={wordmarkWhite.w}
              height={wordmarkWhite.h}
              className="h-4 w-auto shrink-0"
              translate="no"
            />
          </a>

          <nav aria-label="Pages" className="hidden h-full items-stretch lg:flex">
            {pages.map(({ id, index, name, href }) => {
              const active = current === id;
              return (
                <a
                  key={id}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className="group relative flex items-center gap-2xs px-md"
                >
                  <span
                    aria-hidden="true"
                    className={`label tabular-nums transition-colors duration-(--dur-micro) ease-out ${
                      active ? 'text-brass' : 'text-ink-3 group-hover:text-ink-2'
                    }`}
                  >
                    {index}
                  </span>
                  <span
                    className={`label transition-colors duration-(--dur-micro) ease-out ${
                      active ? 'text-ink' : 'text-ink-3 group-hover:text-ink'
                    }`}
                  >
                    {name}
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-md bottom-0 h-px bg-brass"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <a
            href="/packages/#enquire"
            className="hidden h-11 shrink-0 items-center bg-brass px-md text-small text-on-brass transition-colors duration-(--dur-micro) ease-out hover:bg-brass-hi active:duration-(--dur-press) lg:inline-flex"
          >
            Enquire
          </a>

          {/* A word, not an icon. The whole site is set in type; a hamburger
              would be the one pictogram on it. */}
          <button
            ref={burger}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="nav-overlay"
            className="label flex h-11 min-w-11 items-center justify-end text-ink lg:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <NavOverlay open={open} current={current} trigger={burger} onClose={() => setOpen(false)} />
    </>
  );
}

/**
 * The full-screen menu — the site's contents page. A dialog in the real sense:
 * focus is trapped inside it, `Escape` closes, focus returns to the trigger,
 * and scroll does not chain to the page behind.
 *
 * The lines arrive one at a time, 55ms apart, from CSS: it plays once per open
 * and belongs off the main thread. `--index` is set on the line itself, never
 * on the parent — a custom property on a parent recalculates every child.
 */
function NavOverlay({
  open,
  current,
  trigger,
  onClose,
}: {
  open: boolean;
  current: string;
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
      aria-label="Pages"
      className="fixed inset-0 z-(--z-overlay) flex flex-col overscroll-contain bg-page lg:hidden"
      style={{ paddingBottom: 'max(var(--spacing-lg), env(safe-area-inset-bottom))' }}
    >
      <div className="shell flex h-(--nav-h) shrink-0 items-center justify-end border-b border-rule">
        <button
          type="button"
          onClick={onClose}
          className="label flex h-11 min-w-11 items-center justify-end text-ink"
        >
          Close
        </button>
      </div>

      <nav aria-label="Pages" className="shell flex flex-1 flex-col justify-center">
        {pages.map(({ id, index, name, href }, i) => (
          <span key={id} className="block overflow-hidden border-b border-rule">
            <a
              href={href}
              aria-current={current === id ? 'page' : undefined}
              className="flex min-h-16 items-baseline py-sm"
            >
              <span className="menu-line" style={{ ['--index' as string]: i }}>
                <span
                  className={`label mr-md tabular-nums ${current === id ? 'text-brass' : 'text-ink-3'}`}
                  aria-hidden="true"
                >
                  {index}
                </span>
                <span className="font-display text-[2.5rem] leading-none font-medium tracking-tight text-ink">
                  {name}
                </span>
              </span>
            </a>
          </span>
        ))}
      </nav>

      <div className="shell">
        <a
          href="/packages/#enquire"
          className="flex min-h-14 items-center justify-center bg-brass px-md text-small text-on-brass active:duration-(--dur-press)"
        >
          Enquire about functions
        </a>
      </div>
    </div>
  );
}
