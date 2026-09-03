import { useMemo, useState } from 'react';
import { buttonClass } from './ui/Button';
import { Select } from './ui/Select';
import {
  clearEnquiries,
  composePlainText,
  composeSubject,
  enquiryLines,
  formatStamp,
  readEnquiries,
  removeEnquiry,
  setStatus,
  STATUSES,
  type Enquiry,
  type EnquiryStatus,
} from '../lib/enquiries';

/**
 * The board — everything that came in, newest first, so the owner can read it
 * and pick up the phone.
 *
 * The brief for this page was one sentence and it is the whole specification:
 * *"keep it simple as the owner just need to look at the information and he
 * will contact the customer directly."* So there is no pipeline, no assignment,
 * no notes field and no calendar. An enquiry is a card you read; the two things
 * you can do to it are contact the person and mark where you got to.
 *
 * Three statuses, and they are a memory aid rather than a workflow: **New**
 * is the default, **Contacted** means you have replied, **Closed** means it is
 * finished either way. Nothing in the site behaves differently because of
 * them — they exist so a board with fourteen cards on it tells you which four
 * you still owe an answer.
 *
 * ⚠ WHERE THE DATA COMES FROM, stated on the page as well as here. There is no
 * server behind this build, so an enquiry is recorded in the browser it was
 * submitted in and nowhere else — see the header of `lib/enquiries.ts`. This
 * board is therefore a faithful model of the inbox, not the inbox: it shows
 * what was submitted *on this device*. The real delivery is the email the
 * visitor sends, which arrives in the venue's actual mailbox. The notice at
 * the top of the page says exactly that and must not be quietly removed.
 */

/** `All` first, then the three real statuses. A filter needs a value for "do
    not filter", and an empty string would collide with the Select's own
    placeholder state. */
const FILTERS = [
  { value: 'all', label: 'Everything' },
  ...STATUSES.map((s) => ({ value: s.value, label: s.label })),
] as const;

export function AdminBoard() {
  /* Read once, on the first render. The store only changes through this
     component, so a listener for `storage` events would be answering a
     question nobody is asking — a second tab is not a case this page has. */
  const [list, setList] = useState<Enquiry[]>(() => readEnquiries());
  const [filter, setFilter] = useState<string>('all');

  const shown = useMemo(
    () => (filter === 'all' ? list : list.filter((e) => e.status === filter)),
    [list, filter],
  );

  const newCount = list.filter((e) => e.status === 'new').length;

  return (
    <>
      {/* --- The count, and the filter ----------------------------------- */}
      <div className="grid gap-lg border-t border-rule-strong pt-md lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-item text-ink">
            <span className="tabular-nums">{list.length}</span>{' '}
            {list.length === 1 ? 'enquiry' : 'enquiries'}
            {newCount > 0 && (
              <>
                {' · '}
                <span className="tabular-nums">{newCount}</span> not yet contacted
              </>
            )}
          </p>
        </div>

        {list.length > 0 && (
          <div className="lg:col-span-4 lg:col-start-9">
            <Select
              label="Show"
              name="filter"
              value={filter}
              choices={FILTERS}
              onChange={setFilter}
            />
          </div>
        )}
      </div>

      {/* --- The cards ---------------------------------------------------- */}
      {shown.length === 0 ? (
        <p className="mt-xl max-w-(--container-measure) text-lead text-ink-3">
          {list.length === 0
            ? 'Nothing here yet. An enquiry appears on this board once it has been submitted through the form in this browser.'
            : 'No enquiries with that status.'}
        </p>
      ) : (
        <ul className="mt-xl grid gap-lg">
          {shown.map((enquiry) => (
            <li key={enquiry.ref}>
              <Card
                enquiry={enquiry}
                onStatus={(status) => setList(setStatus(enquiry.ref, status))}
                onRemove={() => {
                  if (window.confirm(`Remove ${enquiry.ref} from the board? This cannot be undone.`))
                    setList(removeEnquiry(enquiry.ref));
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {list.length > 0 && (
        <div className="mt-2xl border-t border-rule pt-lg">
          <button
            type="button"
            className={buttonClass('secondary')}
            onClick={() => {
              if (
                window.confirm(
                  `Remove all ${list.length} enquiries from this board? This cannot be undone.`,
                )
              )
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
 * One enquiry.
 *
 * The reference and the time it came in sit on the top rule; the person's name
 * is the heading, because that is what the owner is about to ask for by name.
 * Contact details are links first — a phone at the bar on a Friday should be
 * one tap from calling somebody back — and text second, because a number you
 * cannot select is a number you cannot write down.
 */
function Card({
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
  const detail = lines.filter((l) => l.key !== 'name' && l.key !== 'message');
  const message = lines.find((l) => l.key === 'message');

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
    <article className="border-t border-rule-strong pt-sm" data-reveal>
      <div className="flex flex-wrap items-baseline justify-between gap-x-lg gap-y-2xs">
        <span className="label text-ink-3 tabular-nums">{enquiry.ref}</span>
        <span className="label text-ink-3">{formatStamp(enquiry.submittedAt)}</span>
      </div>

      <h3 className="mt-sm font-display text-lead uppercase tracking-wide text-ink">
        {enquiry.name}
      </h3>

      <div className="mt-md grid gap-lg lg:grid-cols-12">
        {/* The facts, as the same rows the email carried. */}
        <dl className="lg:col-span-5">
          {detail.map(({ key, label, value }) => (
            <div key={key} className="border-t border-rule py-xs">
              <dt className="label text-ink-3">{label}</dt>
              <dd className="mt-2xs text-body text-ink">
                {key === 'email' ? (
                  <a
                    href={reply}
                    className="break-all transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
                  >
                    {value}
                  </a>
                ) : key === 'phone' ? (
                  <a
                    href={`tel:${value.replace(/[^\d+]/g, '')}`}
                    className="tabular-nums transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="lg:col-span-6 lg:col-start-7">
          {message ? (
            <>
              <p className="label text-ink-3">{message.label}</p>
              <p className="mt-2xs text-body text-ink-2 whitespace-pre-line">{message.value}</p>
            </>
          ) : (
            <p className="text-body text-ink-3">No details were added.</p>
          )}

          {/* --- Where this one got to ---------------------------------- */}
          <fieldset className="mt-lg border-0 p-0">
            <legend className="label text-ink-3">Status</legend>
            <div className="mt-2xs flex flex-wrap gap-2xs" role="group">
              {STATUSES.map(({ value, label }) => {
                const on = enquiry.status === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onStatus(value)}
                    className={`label inline-flex min-h-11 items-center border px-md transition-colors duration-(--dur-micro) ease-out ${
                      on
                        ? 'border-fill bg-fill text-on-fill'
                        : 'border-rule-strong text-ink-3 hover:border-outline hover:text-ink'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-md flex flex-wrap gap-2xs">
            <a href={reply} className={`${buttonClass('secondary')} min-h-11 px-md`}>
              Reply by email
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
      </div>
    </article>
  );
}
