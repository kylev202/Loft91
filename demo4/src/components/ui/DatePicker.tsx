import { useEffect, useId, useMemo, useRef, useState } from 'react';

/**
 * THE CALENDAR — the second bespoke control, and it exists for exactly the
 * reason the first one does.
 *
 * `<input type="date">` was doing the job until now, and the field itself was
 * fine: it is the *picker* that is the problem. Press it and the browser opens
 * a calendar it draws entirely by itself — system font, system chrome, system
 * blue on the selected day, a different shape in every browser and a full-screen
 * wheel on iOS. It is the identical objection that made the selection box
 * bespoke (see `Select.tsx`), and it has the identical answer: a stylesheet
 * cannot reach into it, so the calendar is drawn in the page instead.
 *
 * Client instruction, 2026-09-03: *"the date options box (calendar) should have
 * our own style, make one."*
 *
 * ── It is the selection box's twin, deliberately ──────────────────────────
 * Nothing new is introduced. Every mark here is one the form already uses, so
 * the two controls read as one system rather than as two components that
 * happen to sit in the same column:
 *
 *   · the same label row, with the same `Optional` marker;
 *   · the same trigger — one line of type on a hairline, with the FAQ's `+`
 *     rotating 45° into a `×`;
 *   · the same `.rule-sweep` underneath, sweeping open from its centre;
 *   · the same panel — no border, one step of surface tone (`--color-panel-2`),
 *     the same `.select-panel` entrance;
 *   · the same selection mark — the chosen day fills with ink and its numeral
 *     goes to paper, which is what the highlighted row in the list does, and
 *     the direct replacement for the system blue.
 *
 * Two marks are the calendar's own, and both are borrowed rather than invented:
 * **today** is underlined with `.rule-ink`, the way the nav marks the current
 * page; and the month arrows are the `→` the section heads and the footer
 * already use, mirrored.
 *
 * ── Behaviour ────────────────────────────────────────────────────────────
 * A grid with roving `tabindex`, which is the ARIA pattern for a date grid and
 * the reason the whole calendar is one tab stop rather than forty-two:
 *
 *   · ← → move a day, ↑ ↓ move a week, and crossing an edge turns the month.
 *   · Home / End jump to the start and end of the week.
 *   · PageUp / PageDown change the month; with Shift, the year.
 *   · Enter and Space choose; Escape closes and returns focus to the trigger.
 *   · Tab is trapped inside the panel while it is open, because it is a dialog.
 *
 * Six rows are always rendered, even when a month only needs five. The panel is
 * then the same height every month, so turning the page does not make the form
 * underneath it jump.
 *
 * Dates before `min` are disabled rather than hidden — a greyed-out past reads
 * as "not that one", where a missing past reads as a broken calendar.
 */

/* ── Dates, kept local ────────────────────────────────────────────────────
   Every value crossing this component's boundary is a `yyyy-mm-dd` string, and
   every `Date` inside it is constructed from parts. `new Date('2026-11-14')`
   parses as UTC midnight, which in Melbourne is 11am the same day but in a
   negative-offset timezone is the day *before* — the class of bug that makes a
   calendar show the wrong day for some of its users and nobody else. */
const pad = (n: number) => String(n).padStart(2, '0');
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const AU = 'en-AU';
const monthLabel = new Intl.DateTimeFormat(AU, { month: 'long', year: 'numeric' });
const dayLabel = new Intl.DateTimeFormat(AU, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const triggerLabel = new Intl.DateTimeFormat(AU, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const weekdayShort = new Intl.DateTimeFormat(AU, { weekday: 'short' });
const weekdayLong = new Intl.DateTimeFormat(AU, { weekday: 'long' });

/** The six rows of the month, starting on the Monday on or before the 1st.
    Monday-first because this is an Australian venue and that is the week here;
    it is not a locale lookup, because `Intl` does not expose first-day-of-week
    reliably and this site is `lang="en-AU"` throughout. */
function monthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // JS weeks start Sunday; ours do not
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function DatePicker({
  label,
  name,
  value,
  onChange,
  min,
  placeholder = 'Choose a date',
  error,
  optional = false,
  hint,
}: {
  label: string;
  name: string;
  /** `yyyy-mm-dd`, or `''` for no date chosen. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable date, `yyyy-mm-dd`. Days before it are disabled. */
  min?: string;
  placeholder?: string;
  error?: string;
  optional?: boolean;
  hint?: string;
}) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const panelId = `${uid}-panel`;
  const monthId = `${uid}-month`;
  const errorId = `${uid}-error`;
  const hintId = `${uid}-hint`;

  const [open, setOpen] = useState(false);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  /** Where the keyboard is. Opens on the chosen date, or on the first date the
      visitor is actually allowed to pick — landing the cursor on a disabled day
      would make the first arrow press feel broken. */
  const initial = () => {
    if (value) return fromISO(value);
    return min && toISO(today) < min ? fromISO(min) : today;
  };
  const [cursor, setCursor] = useState<Date>(initial);

  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  /** Set on the cell that owns the tab stop, so focus can follow the cursor
      without querying the DOM for it. */
  const cursorCell = useRef<HTMLButtonElement>(null);
  /** Suppresses the focus effect on the render that opens the panel, so the
      month heading is not fought over by two focus calls in one frame. */
  const justOpened = useRef(false);

  const days = useMemo(() => monthGrid(cursor), [cursor]);
  const disabled = (d: Date) => Boolean(min) && toISO(d) < min!;

  const openPanel = () => {
    setCursor(initial());
    justOpened.current = true;
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  };

  const pick = (d: Date) => {
    if (disabled(d)) return;
    onChange(toISO(d));
    close();
  };

  /* Focus follows the cursor — the whole of "roving tabindex". Runs on every
     cursor change while open, which is what moves focus across a month
     boundary along with the grid that re-rendered under it. */
  useEffect(() => {
    if (!open) return;
    cursorCell.current?.focus();
    justOpened.current = false;
  }, [open, cursor]);

  /* Close on a press outside, and trap Tab inside while open. */
  useEffect(() => {
    if (!open) return;

    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"])',
      );
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

    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const move = (n: number) => {
      event.preventDefault();
      setCursor((c) => addDays(c, n));
    };

    switch (event.key) {
      case 'ArrowLeft':
        return move(-1);
      case 'ArrowRight':
        return move(1);
      case 'ArrowUp':
        return move(-7);
      case 'ArrowDown':
        return move(7);
      case 'Home':
        // To Monday of this week; `getDay()` counts from Sunday, so shift it.
        return move(-((cursor.getDay() + 6) % 7));
      case 'End':
        return move(6 - ((cursor.getDay() + 6) % 7));
      case 'PageUp':
        event.preventDefault();
        return setCursor((c) => addMonths(c, event.shiftKey ? -12 : -1));
      case 'PageDown':
        event.preventDefault();
        return setCursor((c) => addMonths(c, event.shiftKey ? 12 : 1));
      case 'Enter':
      case ' ':
        event.preventDefault();
        return pick(cursor);
      case 'Escape':
        event.preventDefault();
        return close();
      default:
        return undefined;
    }
  };

  const chosen = value ? fromISO(value) : null;
  const live = open || Boolean(value) || Boolean(error);
  const described = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  const step = (n: number) => setCursor((c) => addMonths(c, n));

  return (
    <div ref={root}>
      <div className="flex items-baseline justify-between gap-md">
        <span id={labelId} className="label text-ink-3">
          {label}
        </span>
        {optional && (
          <span className="label text-ink-3" aria-hidden="true">
            Optional
          </span>
        )}
      </div>

      <div className="relative">
        <button
          ref={trigger}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-describedby={described || undefined}
          onClick={() => (open ? close(false) : openPanel())}
          onKeyDown={(event) => {
            if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              openPanel();
            }
          }}
          className={`focus-line flex min-h-14 w-full items-center justify-between gap-md border-b pt-xs pb-2xs text-left text-item ${
            error ? 'border-error' : 'border-outline'
          } ${chosen ? 'text-ink' : 'text-ink-3'}`}
        >
          <span className="truncate">{chosen ? triggerLabel.format(chosen) : placeholder}</span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-lead text-ink-3 transition-transform duration-(--dur-short) ease-out ${
              open ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </button>

        <span aria-hidden="true" className="rule-sweep" data-on={live} data-error={Boolean(error)} />

        {open && (
          <div
            ref={panel}
            id={panelId}
            role="dialog"
            aria-label={`${label} — choose a date`}
            className="select-panel absolute inset-x-0 top-full z-(--z-nav) mt-2xs max-w-(--container-narrow) bg-panel-2 p-sm"
          >
            {/* --- The month, and the way through it ---------------------- */}
            <div className="flex items-center justify-between gap-2xs">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous month"
                className="label flex h-11 min-w-11 items-center justify-center text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
              >
                <span aria-hidden="true">←</span>
              </button>

              {/* Announced on change, so a screen-reader user who pages the
                  month hears where they landed without leaving the grid. */}
              <h3
                id={monthId}
                aria-live="polite"
                className="label text-center text-ink tabular-nums"
              >
                {monthLabel.format(cursor)}
              </h3>

              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next month"
                className="label flex h-11 min-w-11 items-center justify-center text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="rule-ink mt-2xs mb-2xs w-full" />

            {/* --- The grid ---------------------------------------------- */}
            <table role="grid" aria-labelledby={monthId} className="w-full border-collapse">
              <thead>
                <tr>
                  {days.slice(0, 7).map((d) => (
                    <th
                      key={d.getDay()}
                      scope="col"
                      abbr={weekdayLong.format(d)}
                      className="label pb-2xs text-center font-medium text-ink-3"
                    >
                      {/* Two letters. `Intl` has no two-letter weekday, and at
                          11px with 0.18em of tracking "Mon" across seven
                          columns overflows a phone — so the short form is
                          trimmed. `abbr` carries the full name for AT, so
                          nothing is lost to a screen reader. */}
                      <span aria-hidden="true">{weekdayShort.format(d).slice(0, 2)}</span>
                      <span className="sr-only">{weekdayLong.format(d)}</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody onKeyDown={onGridKeyDown}>
                {[0, 1, 2, 3, 4, 5].map((week) => (
                  <tr key={week}>
                    {days.slice(week * 7, week * 7 + 7).map((day) => {
                      const iso = toISO(day);
                      const outside = !sameMonth(day, cursor);
                      const isDisabled = disabled(day);
                      const isChosen = Boolean(chosen) && iso === value;
                      const isToday = iso === toISO(today);
                      const isCursor = iso === toISO(cursor);

                      return (
                        <td key={iso} className="p-0 text-center">
                          <button
                            ref={isCursor ? cursorCell : undefined}
                            type="button"
                            /* Roving tabindex: one tab stop for the whole grid,
                               and the arrow keys do the rest. */
                            tabIndex={isCursor ? 0 : -1}
                            disabled={isDisabled}
                            aria-current={isToday ? 'date' : undefined}
                            aria-selected={isChosen}
                            aria-label={dayLabel.format(day)}
                            onClick={() => pick(day)}
                            className={`relative flex aspect-square w-full items-center justify-center text-body tabular-nums transition-colors duration-(--dur-micro) ease-out ${
                              isChosen
                                ? 'bg-fill text-on-fill'
                                : isDisabled
                                  ? 'cursor-not-allowed text-ink-4'
                                  : outside
                                    ? 'text-ink-4 hover:bg-fill hover:text-on-fill'
                                    : 'text-ink-2 hover:bg-fill hover:text-on-fill'
                            }`}
                          >
                            {day.getDate()}

                            {/* Today, marked the way the nav marks the current
                                page — full ink and a rule under it. Dropped on
                                the chosen day, where an ink rule on an ink
                                ground would be invisible anyway. */}
                            {isToday && !isChosen && (
                              <span
                                aria-hidden="true"
                                className="rule-ink absolute inset-x-[30%] bottom-1"
                              />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* --- Clearing it ------------------------------------------- */}
            {optional && value && (
              <div className="mt-2xs border-t border-rule pt-2xs">
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    close();
                  }}
                  className="label flex h-11 w-full items-center justify-center text-ink-3 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                >
                  Clear the date
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <input type="hidden" name={name} value={value} />

      {hint && (
        <p id={hintId} className="mt-2xs text-small text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2xs text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}
