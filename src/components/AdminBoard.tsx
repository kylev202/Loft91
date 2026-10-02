import { useId, useMemo, useState, type ReactNode } from 'react';
import { buttonClass } from './ui/Button';
import {
  clearEnquiries,
  composePlainText,
  composeSubject,
  countdown,
  daysUntil,
  enquiryLines,
  formatDate,
  formatStamp,
  readEnquiries,
  removeEnquiry,
  setStatus,
  STATUSES,
  toCsv,
  type Enquiry,
  type EnquiryStatus,
} from '../lib/enquiries';

/**
 * The board — one line per enquiry, opening in place.
 *
 * ── Why it is a list of lines and not a wall of cards ─────────────────────
 * It used to be cards: every enquiry rendered in full, every time, at roughly a
 * third of a screen each. That is the right shape for four enquiries and the
 * wrong one for thirty — ten screens of scrolling to answer "who do I still owe
 * a reply to", with the answer never visible in one look.
 *
 * So the enquiry is a **row** carrying only what is compared *between* rows —
 * when the function is, who it is for, what it is, how far off it is, and where
 * it got to — and everything you need once you have picked one (the address,
 * the number, what they wrote, the actions) opens underneath it. Thirty
 * enquiries are now about two screens, and the scan is a single column of
 * dates.
 *
 * From `lg` the same rows lock into columns, so the dates, the countdowns and
 * the statuses line up and the eye can run down one of them. That is done with
 * `display: contents` on the meta group rather than with two sets of markup —
 * one row, read two ways.
 *
 * `<details>`/`<summary>`, the site's own disclosure (see `FaqList`): keyboard
 * operable and screen-reader announced with no JavaScript, and the `+` rotating
 * to `×` is the whole gesture, as everywhere else.
 *
 * **No `[data-reveal]` on the rows.** Scroll-triggered fades are right for a
 * page being read and wrong for a tool being used — the owner is scanning, and
 * a row that arrives late is a row that is not there yet.
 */

/** `All` first, then the three real statuses. */
const FILTERS = [{ value: 'all', label: 'Everything' }, ...STATUSES] as const;

const SORTS = [
  { value: 'event', label: 'By date' },
  { value: 'received', label: 'Newest' },
] as const;

type Sort = (typeof SORTS)[number]['value'];

/** 0 upcoming · 1 already past · 2 no date given. The three groups the event
    ordering is built from, in the order they are useful. */
const eventRank = (e: Enquiry): 0 | 1 | 2 => {
  const days = daysUntil(e.date);
  if (days === null) return 2;
  return days < 0 ? 1 : 0;
};

/** Upcoming first and soonest at the top; then the ones already past, most
 *  recent first; then anything with no date on it at all.
 *
 *  Undated enquiries go last rather than first for the same reason the past
 *  ones do: they cannot be planned around, and floating either group to the top
 *  pushes next weekend's party off the first screen. */
function byEvent(a: Enquiry, b: Enquiry): number {
  const rank = eventRank(a) - eventRank(b);
  if (rank !== 0) return rank;
  if (eventRank(a) === 0) return a.date.localeCompare(b.date);
  if (eventRank(a) === 1) return b.date.localeCompare(a.date);
  return b.submittedAt.localeCompare(a.submittedAt);
}

/** What a search runs against. The rendered labels are deliberately *not* in
    here — "birthday" finds the enquiries whose message says birthday, not every
    enquiry whose occasion dropdown happened to say it, which would return half
    the board for the most obvious word anybody would type. */
const haystack = (e: Enquiry): string =>
  `${e.ref} ${e.name} ${e.email} ${e.phone} ${e.message}`.toLowerCase();

export function AdminBoard() {
  /* Read once, on the first render. The store only changes through this
     component, so a listener for `storage` events would be answering a
     question nobody is asking — a second tab is not a case this page has. */
  const [list, setList] = useState<Enquiry[]>(() => readEnquiries());
  const [filter, setFilter] = useState<string>('all');
  /* Date order is the default now, not arrival order. This is a board for
     function hire: what happens next matters more than what arrived last. */
  const [sort, setSort] = useState<Sort>('event');
  const [query, setQuery] = useState('');

  const searchId = useId();

  /** One tally per chip, seeded from `STATUSES` rather than from three named
      keys — a fourth status would otherwise render as a chip counting zero. */
  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: list.length };
    for (const { value } of STATUSES) tally[value] = 0;
    for (const enquiry of list) tally[enquiry.status] += 1;
    return tally;
  }, [list]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const found = list.filter(
      (e) => (filter === 'all' || e.status === filter) && (!needle || haystack(e).includes(needle)),
    );
    /* `readEnquiries` already returns newest-submitted first, so the arrival
       ordering is the list as it stands and only the date one sorts. */
    return sort === 'event' ? [...found].sort(byEvent) : found;
  }, [list, filter, sort, query]);

  /** The board as a file the owner keeps. Built here rather than in
      `enquiries.ts` because the CSV is that module's business and the anchor
      is the document's. */
  const download = () => {
    /* A BOM, built from its code point rather than typed: U+FEFF is invisible
       in a source file, and an editor or a formatter that strips it would take
       the fix with it and leave no trace. Excel reads a BOM-less UTF-8 file as
       the system codepage, which turns the é in a customer's name into two. */
    const blob = new Blob([String.fromCharCode(0xfeff), toCsv(list)], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `loft91-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    // Revoked on a timer, not immediately: a synchronous revoke can land before
    // the browser has finished reading the blob and cancel the download.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      {/* --- Find, filter, order ------------------------------------------
          Below two enquiries there is nothing to find and nothing to order, so
          the controls are not drawn at all. The chips carry the counts, which
          is why there is no longer a separate line of totals above them — it
          said the same numbers twice.

          Laid out with flex rather than a twelve-column grid. On a rigid grid
          the four status chips wrapped to a second line while the ordering pair
          sat against the right edge with a gap between them — the columns were
          deciding the widths, and a chip is its own width. Here the search takes
          a fixed measure and the two chip groups sit together at the far end,
          wrapping as a unit only when there is genuinely no room. */}
      {list.length > 1 && (
        <div className="flex flex-col gap-lg border-b border-rule pb-lg lg:flex-row lg:items-end lg:justify-between lg:gap-xl">
          <div className="lg:w-80 lg:shrink-0">
            <label htmlFor={searchId} className="label block text-ink-3">
              Search
            </label>
            <div className="relative">
              <input
                id={searchId}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, reference, email, phone"
                /* The same anatomy as every other control on the site: a
                   hairline at `--color-outline` for the affordance, and
                   `.rule-sweep` in full ink over it once the field is live. */
                className="focus-line block min-h-12 w-full border-b border-outline bg-transparent pt-xs pb-2xs text-item text-ink placeholder:text-ink-3"
              />
              <span aria-hidden="true" className="rule-sweep" data-on={Boolean(query)} />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-x-lg gap-y-md">
            <div className="flex flex-wrap gap-2xs" role="group" aria-label="Show">
              {FILTERS.map(({ value, label }) => (
                <Chip key={value} on={filter === value} onClick={() => setFilter(value)}>
                  {label}{' '}
                  {/* The explicit space is load-bearing: JSX drops the newline
                      between an expression and the next element, and without it
                      the chip's accessible name is "New4". */}
                  <span className="ml-2xs tabular-nums">{counts[value] ?? 0}</span>
                </Chip>
              ))}
            </div>

            <div className="flex flex-wrap gap-2xs" role="group" aria-label="Order">
              {SORTS.map(({ value, label }) => (
                <Chip key={value} on={sort === value} onClick={() => setSort(value)}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- The rows ----------------------------------------------------- */}
      {shown.length === 0 ? (
        <p className="mt-xl max-w-(--container-measure) text-lead text-ink-3">
          {list.length === 0 ? 'No enquiries yet.' : 'Nothing matches.'}
        </p>
      ) : (
        <>
          {/* Only when something is hidden. With everything shown the chips
              already carry the count. */}
          {shown.length !== list.length && (
            <p className="mt-md text-small text-ink-3">
              Showing <span className="tabular-nums">{shown.length}</span> of{' '}
              <span className="tabular-nums">{list.length}</span>
            </p>
          )}

          <div className="mt-md">
            {shown.map((enquiry) => (
              <Row
                key={enquiry.ref}
                enquiry={enquiry}
                onStatus={(status) => setList(setStatus(enquiry.ref, status))}
                onRemove={() => {
                  if (window.confirm(`Remove ${enquiry.ref}? This cannot be undone.`))
                    setList(removeEnquiry(enquiry.ref));
                }}
              />
            ))}
          </div>
        </>
      )}

      {list.length > 0 && (
        <div className="mt-xl flex flex-wrap gap-2xs">
          <button type="button" className={buttonClass('secondary')} onClick={download}>
            Download CSV
          </button>
          <button
            type="button"
            className={buttonClass('secondary')}
            onClick={() => {
              if (window.confirm(`Remove all ${list.length} enquiries? This cannot be undone.`))
                setList(clearEnquiries());
            }}
          >
            Clear the board
          </button>
        </div>
      )}
    </>
  );
}

/**
 * A pressed-or-not control in small wide-tracked capitals: on, it is ink-filled
 * with paper type; off, it is a hairline box that fills on hover.
 *
 * One definition for the filters, the ordering and the status buttons inside
 * every row, because they are the same control doing the same thing three times
 * and three copies of the class string is three things to keep in step. 44px
 * tall, because the arrival path for this page is a phone behind a bar.
 */
function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`label inline-flex min-h-11 items-center border px-md transition-colors duration-(--dur-micro) ease-out ${
        on
          ? 'border-fill bg-fill text-on-fill'
          : 'border-rule-strong text-ink-3 hover:border-outline hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * One enquiry, collapsed to a line.
 *
 * The line carries five things and no more: **when the function is** (the
 * column the owner scans), **who** it is for, **what** it is, **how far off**
 * it is, and **where it got to**. The reference and the time it arrived are not
 * on it — they are lookup keys, not comparison keys, so they move inside where
 * they are found rather than read.
 *
 * The status is full ink while it is `New` and quiet once it is not, so a board
 * of thirty tells you at a glance which four you still owe an answer.
 */
function Row({
  enquiry,
  onStatus,
  onRemove,
}: {
  enquiry: Enquiry;
  onStatus: (status: EnquiryStatus) => void;
  onRemove: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const lines = enquiryLines(enquiry);
  const contact = lines.filter((l) => l.key === 'email' || l.key === 'phone');
  const message = lines.find((l) => l.key === 'message');
  const summary = lines
    .filter((l) => l.key === 'occasion' || l.key === 'guests' || l.key === 'session')
    .map((l) => l.value)
    .join(' · ');

  const status = STATUSES.find((s) => s.value === enquiry.status);
  const when = enquiry.date ? countdown(enquiry.date) : null;

  /* Replying quotes the original subject, so the venue's answer threads with
     the customer's own email rather than arriving as an unrelated message. */
  const reply = `mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${composeSubject(enquiry)}`)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(composePlainText(enquiry));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.alert('This browser would not let the page copy. Select the details instead.');
    }
  };

  return (
    <details className="group border-b border-rule">
      {/* On a phone: a meta line, a name, a detail line, and the `+` held down
          the right of all three. From `lg` the meta group goes `display:
          contents` and its three spans become columns of the row's own grid, so
          date, countdown and status line up down the board. One row, two
          readings, no second set of markup. */}
      <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-x-md gap-y-2xs py-sm transition-colors duration-(--dur-micro) ease-out hover:bg-panel lg:grid-cols-[11rem_minmax(0,1fr)_6.5rem_6rem_1.5rem] [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-baseline gap-x-sm lg:contents">
          <span
            className={`label tabular-nums lg:col-start-1 lg:row-start-1 ${
              enquiry.date ? 'text-ink' : 'text-ink-3'
            }`}
          >
            {enquiry.date ? formatDate(enquiry.date) : 'No date'}
          </span>
          <span className="label text-ink-3 lg:col-start-3 lg:row-start-1">{when}</span>
          <span
            className={`label lg:col-start-4 lg:row-start-1 ${
              enquiry.status === 'new' ? 'text-ink' : 'text-ink-3'
            }`}
          >
            {status?.label}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="row-span-2 self-center justify-self-end text-lead text-ink-3 transition-transform duration-(--dur-short) ease-out group-open:rotate-45 lg:col-start-5 lg:row-span-1 lg:row-start-1"
        >
          +
        </span>

        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <p className="truncate font-display text-item uppercase tracking-wide text-ink">
            {enquiry.name}
          </p>
          <p className="truncate text-small text-ink-2">{summary}</p>
        </div>
      </summary>

      {/* --- Open ---------------------------------------------------------
          Everything that is needed once this one has been picked, and nothing
          that was already on the line above. */}
      <div className="grid gap-md pt-xs pb-lg lg:grid-cols-12">
        {/* The address and the number are the two things on this page that get
            *pressed*, on a phone, behind a bar. So each is a full-height link
            rather than a line of text with a link in it — `flex min-h-11` is
            the footer's own pattern, and it takes the target from the 20px an
            inline anchor gets to the 44px floor. */}
        <dl className="lg:col-span-4">
          {contact.map(({ key, label, value }) => (
            <div key={key} className="border-t border-rule pt-xs">
              <dt className="label text-ink-3">{label}</dt>
              <dd className="text-body text-ink">
                <a
                  href={key === 'email' ? reply : `tel:${value.replace(/[^\d+]/g, '')}`}
                  className={`flex min-h-11 items-center transition-colors duration-(--dur-micro) ease-out hover:text-ink-2 ${
                    key === 'email' ? 'break-all' : 'tabular-nums'
                  }`}
                >
                  {value}
                </a>
              </dd>
            </div>
          ))}
        </dl>

        <div className="lg:col-span-7 lg:col-start-6">
          {message ? (
            <>
              <p className="label border-t border-rule pt-xs text-ink-3">{message.label}</p>
              <p className="mt-2xs text-body whitespace-pre-line text-ink-2">{message.value}</p>
            </>
          ) : (
            <p className="border-t border-rule pt-xs text-body text-ink-3">No details were added.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-lg gap-y-md border-t border-rule pt-md lg:col-span-12">
          <div className="flex flex-wrap gap-2xs" role="group" aria-label="Status">
            {STATUSES.map(({ value, label }) => (
              <Chip key={value} on={enquiry.status === value} onClick={() => onStatus(value)}>
                {label}
              </Chip>
            ))}
          </div>

          <div className="flex flex-wrap gap-2xs">
            <a href={reply} className={`${buttonClass('secondary')} min-h-11 px-md`}>
              Reply
            </a>
            <button
              type="button"
              onClick={copy}
              className={`${buttonClass('secondary')} min-h-11 px-md`}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onRemove}
              className={`${buttonClass('secondary')} min-h-11 px-md`}
            >
              Remove
            </button>
          </div>
        </div>

        <p className="label text-ink-3 lg:col-span-12">
          <span className="tabular-nums">{enquiry.ref}</span> · received{' '}
          {formatStamp(enquiry.submittedAt)}
        </p>
      </div>
    </details>
  );
}
