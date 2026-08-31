import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { pages, home } from '../data/site';
import { withBase } from '../lib/base';
import { wordmarkBlack } from '../data/photos';

/* ── The notice strip is gone (D-62) ──────────────────────────────────────
   Every page used to open on a thin panel-toned strip carrying one line of
   trading hours above the running head. Client instruction removed it.

   What that costs, stated plainly because it is a real reduction: the hours
   were the first thing on every page, answering R4's "when is it open" before
   the visitor had scrolled a pixel. They are now in the footer of every page
   and in the About page's hours table, and nowhere above the fold — the
   landing page has carried no hours in its own body since D-57. Reinstating
   it is one component and one line in Nav.

   hoursSummary in data/venue.ts was written for this strip and now has no
   caller. It is left where it is rather than deleted, for the same reason
   Strip and Bento are.

   The running head below is untouched. It is position: sticky on its own
   terms — the strip scrolling away under it was a consequence of that, never
   a dependency of it — so removing the strip changes nothing about how the
   header behaves.
   ---------------------------------------------------------------------- */

/**
 * A hairline running head. Sticky, so it holds at the top of the viewport for
 * the whole page — and, since D-62 removed the strip above it, it is now the
 * first thing on every document.
 *
 * **Solid, always.** Nocturne's nav was transparent over the cover and took the
 * page colour once you left it, because the cover was a dark photograph with a
 * scrim across the top of it. Here the photograph starts *below* the header, so
 * there is nothing to be transparent over and nothing to arrange a scrim for:
 * the running head sits on paper from the first frame to the last. That deletes
 * the scroll listener, the scroll state, the colour transition and one
 * whole class of contrast bug along with them.
 *
 * **Always visible.** Any "hide until scrolled up" behaviour reintroduces a real
 * keyboard hazard: a nav revealed only by a scroll gesture is unreachable for
 * anyone who starts at the top and never scrolls up.
 *
 * Active state is `aria-current="page"` plus full ink and a rule under the item.
 * With no accent hue there is no colour to mark it with, so it is marked with
 * the two things the system does have — weight of tone, and a line.
 */
export function Nav({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header
        style={{ viewTransitionName: 'nav' }}
        className="sticky top-0 z-(--z-nav) border-b border-rule bg-page"
      >
        <div className="shell flex h-(--nav-h) items-center justify-between gap-md">
          <a
            href={withBase(home.href)}
            aria-current={current === 'home' ? 'page' : undefined}
            className="flex h-full shrink-0 items-center pr-md"
          >
            {/* The BLACK lockup, everywhere. Nocturne used the white one on
                every surface because every surface was dark; the inverse holds
                just as absolutely here, and the white artwork is now used in
                exactly one place — nowhere. It stays in the pipeline because
                the client owns both and a future dark surface may want it. */}
            <img
              src={wordmarkBlack.src}
              srcSet={wordmarkBlack.srcSet}
              sizes="104px"
              alt="Loft 91 — home"
              width={wordmarkBlack.w}
              height={wordmarkBlack.h}
              className="h-4 w-auto shrink-0"
              translate="no"
            />
          </a>

          <nav aria-label="Pages" className="hidden h-full items-stretch lg:flex">
            {pages.map(({ id, name, href }) => {
              const active = current === id;
              return (
                <a
                  key={id}
                  href={withBase(href)}
                  aria-current={active ? 'page' : undefined}
                  className="group relative flex items-center px-md"
                >
                  <span
                    className={`label transition-colors duration-(--dur-micro) ease-out ${
                      active ? 'text-ink' : 'text-ink-3 group-hover:text-ink'
                    }`}
                  >
                    {name}
                  </span>
                  {/* `.rule-ink` rather than `h-px bg-ink`: routing the system's
                      one ornament through the component class is what lets the
                      forced-colours repair in base.css reach it. Drawn with
                      nothing but a background colour it would be forced to the
                      system background and mark the current page in
                      page-on-page — `aria-current` would survive, the visual
                      state would not. */}
                  {active && (
                    <span aria-hidden="true" className="rule-ink absolute inset-x-md bottom-0" />
                  )}
                </a>
              );
            })}
          </nav>

          <a
            href={withBase('/packages/#enquire')}
            className="label hidden h-11 shrink-0 items-center border border-fill bg-fill px-md text-on-fill transition-colors duration-(--dur-micro) ease-out hover:bg-transparent hover:text-ink active:duration-(--dur-press) lg:inline-flex"
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
            {/* `focus-inset` because the parent's `overflow: hidden` — the box
                that makes the line-by-line entrance possible — clips this
                link's focus ring away entirely. The ring is drawn inside the
                edge instead of outside it; see the utility in base.css. */}
            <a
              href={withBase(href)}
              aria-current={current === id ? 'page' : undefined}
              className="focus-inset flex min-h-16 items-baseline py-sm"
            >
              <span className="menu-line" style={{ ['--index' as string]: i }}>
                <span
                  className={`label mr-md tabular-nums ${current === id ? 'text-ink' : 'text-ink-3'}`}
                  aria-hidden="true"
                >
                  {index}
                </span>
                <span className="font-display text-display uppercase text-ink">
                  {name}
                </span>
              </span>
            </a>
          </span>
        ))}
      </nav>

      <div className="shell">
        <a
          href={withBase('/packages/#enquire')}
          className="label flex min-h-14 items-center justify-center border border-fill bg-fill px-md text-on-fill active:duration-(--dur-press)"
        >
          Enquire about functions
        </a>
      </div>
    </div>
  );
}
