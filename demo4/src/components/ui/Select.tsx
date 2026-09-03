import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Choice } from '../../data/enquiry';

/**
 * THE SELECTION BOX — the one bespoke control on this site.
 *
 * A native `<select>` was never an option here, and not for the usual reason.
 * It is not that it is hard to style; it is that it *cannot* be styled — the
 * open list is drawn by the operating system, in the system font, with system
 * chrome, in a system-blue highlight. On a site whose entire thesis is that
 * there is no accent hue and everything is type on paper, the moment a visitor
 * opens the guest-numbers list they get Windows' blue or Safari's grey sitting
 * on top of the page. That is the single loudest thing that could happen on
 * `/enquire/`, and it is the one thing a stylesheet has no reach into.
 *
 * So the list is drawn in the page, in the page's own language, and every
 * behaviour the native control gave away for free is re-earned below.
 *
 * ── What makes it Loft 91's, rather than a generic dropdown ───────────────
 * It is built from the marks this system already owns, and introduces nothing
 * new:
 *
 *   · **The numeral.** Every option is indexed `01`, `02`, `03` in the small
 *     wide-tracked voice — the same table-of-contents device the nav, the
 *     section heads, the footer index and the phone menu all use. The site
 *     numbers its destinations; here it numbers its answers.
 *   · **The ink fill.** The row under the cursor fills with near-black and its
 *     type goes to paper. That is this system's documented hover convention —
 *     the secondary button does exactly the same thing, because with no second
 *     hue the way to mark something is to make it the primary one — and it is
 *     the direct replacement for the OS blue a native list would have painted.
 *   · **The rule.** The chosen option is marked the way the current page is
 *     marked in the nav: full ink, and a hairline under it. With no accent hue
 *     there is no colour to select with, so selection is weight and a line.
 *   · **The plus.** The disclosure marker is the FAQ's `+` rotating 45° into a
 *     `×`. The site states its affordances in type, never in pictograms (the
 *     phone nav says the word "Menu" rather than drawing a hamburger), and a
 *     chevron would be the one arbitrary glyph on it.
 *
 * The second column of an option row is a `note` — the package tier a guest
 * band corresponds to, so choosing "20 – 60" also says "The Long Table". A
 * native list cannot hold two columns at all.
 *
 * ── The border is gone; the line does the work (2026-09-03) ───────────────
 * Client instruction: *"remove the selected box border, change it to a more
 * engaging animation of the line existed in the bottom."* The open list no
 * longer has a box drawn around it — it is separated from the page by one step
 * of surface tone, the system's only other depth device — and the hairline
 * under the control now carries the whole of the active state, sweeping open
 * from its own centre. The mechanics and the reasoning are in `.rule-sweep`
 * and `.select-panel` in `base.css`.
 *
 * ── Accessibility ────────────────────────────────────────────────────────
 * The ARIA select-only combobox pattern, in full, because a bespoke control
 * that is only operable by mouse is a worse control than the ugly native one:
 *
 *   · `role="combobox"` + `aria-expanded` + `aria-controls` on the trigger,
 *     `role="listbox"` / `role="option"` + `aria-selected` on the list.
 *   · Focus never leaves the trigger. The highlighted option is announced
 *     through `aria-activedescendant`, which is what lets `Escape` and `Tab`
 *     behave the way they do in a native select.
 *   · ↑ ↓ move, Home / End jump, Enter and Space choose, Escape closes without
 *     choosing, Tab closes and moves on, Alt+↓ / Alt+↑ open and close.
 *   · Type-ahead: typing `l` jumps to "Live music or a DJ", and a second
 *     keystroke inside 500 ms extends the search rather than restarting it.
 *   · The trigger is 56px tall — well over the 44px touch floor — because the
 *     arrival path is a phone, at night, one-handed.
 *
 * A hidden input carries the value so the control is a real form participant
 * and `FormData` sees it, rather than existing only in React state.
 */
export function Select({
  label,
  name,
  value,
  choices,
  onChange,
  placeholder = 'Choose one',
  error,
  optional = false,
}: {
  label: string;
  name: string;
  /** `''` until the visitor chooses — the placeholder state is a real state,
      not a first option pretending to be one. */
  value: string;
  choices: readonly Choice[];
  onChange: (value: string) => void;
  placeholder?: string;
  /** Rendered under the control and pointed at by `aria-describedby`. */
  error?: string;
  optional?: boolean;
}) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const listId = `${uid}-list`;
  const errorId = `${uid}-error`;
  const optionId = (index: number) => `${uid}-opt-${index}`;

  const [open, setOpen] = useState(false);
  /** Which option the keyboard is on. Distinct from `value`: opening a list
      highlights the current choice without changing it, and arrowing around
      changes the highlight without committing anything. */
  const [active, setActive] = useState(0);

  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ buffer: '', at: 0 });

  const selected = choices.findIndex((c) => c.value === value);
  const current = selected >= 0 ? choices[selected] : undefined;

  const openList = useCallback(() => {
    setActive(selected >= 0 ? selected : 0);
    setOpen(true);
  }, [selected]);

  const choose = useCallback(
    (index: number) => {
      const choice = choices[index];
      if (choice) onChange(choice.value);
      setOpen(false);
      trigger.current?.focus();
    },
    [choices, onChange],
  );

  /* Close on a press outside. `pointerdown` rather than `click`, so the list is
     gone before the thing underneath it takes the press — closing on `click`
     means a tap that lands on a link both closes the list and follows the
     link. */
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  /* Keep the highlighted row in view when the list is long enough to scroll.
     `block: 'nearest'` so arrowing down one row scrolls by one row rather than
     centring the list on every keystroke.

     Reached by child index rather than by selector. `useId` returns a string
     containing characters that are not valid unescaped in a CSS selector, so
     a `querySelector` here would need `CSS.escape` around it — and the options
     are the `ul`'s only children in the order they are rendered, which makes
     the index the more direct answer as well as the safer one. */
  useEffect(() => {
    if (!open) return;
    list.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  /** Jump to the first option whose label starts with what has been typed.
      The buffer extends while the visitor keeps typing and resets after half a
      second of quiet — the same behaviour a native select has, and the reason
      typing `ch` finds "Christmas" rather than stopping at the first `c`. */
  const typeAhead = (key: string) => {
    const now = Date.now();
    typed.current.buffer = now - typed.current.at > 500 ? key : typed.current.buffer + key;
    typed.current.at = now;

    const query = typed.current.buffer.toLowerCase();
    const hit = choices.findIndex((c) => c.label.toLowerCase().startsWith(query));
    if (hit < 0) return;

    if (open) setActive(hit);
    else onChange(choices[hit].value);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const { key, altKey } = event;

    if (key === 'Escape') {
      if (open) event.stopPropagation(); // do not also close a dialog behind it
      setOpen(false);
      return;
    }

    // Tab must move focus on, which means the list has to go with it.
    if (key === 'Tab') {
      setOpen(false);
      return;
    }

    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        openList();
        return;
      }
    } else {
      switch (key) {
        case 'ArrowDown':
          event.preventDefault();
          // Alt+↓ opens a closed list; on an open one the OS convention is
          // that it does nothing, so the highlight is left where it is.
          if (!altKey) setActive((i) => Math.min(i + 1, choices.length - 1));
          return;
        case 'ArrowUp':
          event.preventDefault();
          if (altKey) choose(active);
          else setActive((i) => Math.max(i - 1, 0));
          return;
        case 'Home':
          event.preventDefault();
          setActive(0);
          return;
        case 'End':
          event.preventDefault();
          setActive(choices.length - 1);
          return;
        case 'Enter':
        case ' ':
          event.preventDefault();
          choose(active);
          return;
        default:
          break;
      }
    }

    // A single printable character, and not a browser shortcut.
    if (key.length === 1 && !event.metaKey && !event.ctrlKey && !altKey && key !== ' ') {
      event.preventDefault();
      typeAhead(key);
    }
  };

  /* The underline is full ink whenever the control is live in any sense — open,
     answered, or flagged. One line saying "this one is dealt with", which is
     what makes a column of them scannable at a glance. */
  const live = open || Boolean(value) || Boolean(error);

  return (
    <div ref={root}>
      <div className="flex items-baseline justify-between gap-md">
        <span id={labelId} className="label text-ink-3">
          {label}
        </span>
        {optional && (
          /* `text-ink-3`, not `text-ink-4`. This is a word the visitor is meant
             to read — it is the only thing telling them the field can be
             skipped — and level 4 is decoration at 2.06:1. */
          <span className="label text-ink-3" aria-hidden="true">
            Optional
          </span>
        )}
      </div>

      {/* The trigger and its list share a positioning context, so the list opens
          directly under the control rather than under the whole component. That
          also fixes a real bug: with the error message inside the positioned
          box, `top-full` put an open list below the message. */}
      <div className="relative">
        <button
          ref={trigger}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={labelId}
          aria-activedescendant={open ? optionId(active) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          /* `border-outline` at rest, not `border-rule-strong`. This hairline is
             the whole affordance now that the box is gone, and a boundary
             carrying that job has a 3:1 floor to clear — 1.69:1 does not. It
             turns `--color-error` when the field is flagged; see `Field`, where
             the reasoning for the red is written out. */
          className={`focus-line flex min-h-14 w-full items-center justify-between gap-md border-b pt-xs pb-2xs text-left text-item ${
            error ? 'border-error' : 'border-outline'
          } ${current ? 'text-ink' : 'text-ink-3'}`}
        >
          <span className="truncate">{current ? current.label : placeholder}</span>

          {/* The FAQ's disclosure mark, rotating into a close mark. The one
              glyph this system has agreed to use for "this opens". */}
          <span
            aria-hidden="true"
            className={`shrink-0 text-lead text-ink-3 transition-transform duration-(--dur-short) ease-out ${
              open ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </button>

        {/* The state, drawn as a line. See `.rule-sweep` in base.css. */}
        <span aria-hidden="true" className="rule-sweep" data-on={live} data-error={Boolean(error)} />

        {/* Always rendered, so `aria-controls` always resolves to a real element
            — a control pointing at an id that only exists while it is open is a
            broken reference for the whole time it is closed. */}
        <ul
          ref={list}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          hidden={!open}
          /* No border, on client instruction — the list is separated from the
             page by one step of surface tone instead, which is the only other
             depth device this system has (`theme.css`: "Depth is one step of
             surface tone and a 1px rule"). `--color-panel-2` rather than
             `--color-panel`: this is the tone the token block describes as "the
             step above that, rarely used", and a list floating over live text is
             exactly the rare case it was reserved for. At 1.22:1 against the
             page it is quiet — the ink-filled row inside it is what removes any
             doubt about which list you are looking at.

             `--z-nav`, reused rather than a new layer invented for it. The one
             thing this list has to clear is the sticky running head — the form
             reaches the top of the viewport while a list is open — and that is
             the layer the running head occupies. Equal `z-index` resolves in
             document order, and this is later in the document, so it paints
             above it. A `--z-popover` token between nav and overlay would be a
             new value in the system to solve a problem the system already has a
             value for (CLAUDE.md §4.3). */
          className="select-panel absolute inset-x-0 top-full z-(--z-nav) mt-2xs max-h-80 overflow-y-auto overscroll-contain bg-panel-2"
        >
          {choices.map((choice, index) => {
            const isSelected = choice.value === value;
            const isActive = open && index === active;

            return (
              <li
                key={choice.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                /* `onPointerDown` prevents the default so the press never takes
                   focus off the trigger — `aria-activedescendant` is only
                   truthful while focus stays there. The commit is on click, so a
                   press that slides off the row still cancels. */
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                onPointerEnter={() => setActive(index)}
                className={`relative flex min-h-12 cursor-pointer items-baseline justify-between gap-md border-t border-rule px-sm py-xs transition-colors duration-(--dur-micro) ease-out first:border-t-0 ${
                  isActive ? 'bg-fill' : ''
                }`}
              >
                <span className="flex items-baseline gap-sm">
                  <span
                    aria-hidden="true"
                    className={`label tabular-nums ${
                      isActive ? 'text-on-fill' : isSelected ? 'text-ink' : 'text-ink-3'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-body ${
                      isActive ? 'text-on-fill' : isSelected ? 'text-ink' : 'text-ink-2'
                    }`}
                  >
                    {choice.label}
                  </span>
                </span>

                {choice.note && (
                  <span className={`label shrink-0 ${isActive ? 'text-on-fill' : 'text-ink-3'}`}>
                    {choice.note}
                  </span>
                )}

                {/* Selection, marked the way the nav marks the current page:
                    full ink above, and a hairline underneath. Suppressed while
                    the row is ink-filled, where an ink rule would be invisible
                    and the fill is already saying it louder. */}
                {isSelected && !isActive && (
                  <span aria-hidden="true" className="rule-ink absolute inset-x-sm bottom-0" />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <input type="hidden" name={name} value={value} />

      {error && (
        <p id={errorId} className="mt-2xs text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}
