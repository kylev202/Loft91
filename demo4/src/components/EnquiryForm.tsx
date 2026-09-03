import { useEffect, useRef, useState } from 'react';
import { Field } from './ui/Field';
import { Select } from './ui/Select';
import { DatePicker } from './ui/DatePicker';
import { buttonClass } from './ui/Button';
import { guestBands, occasions, sessions } from '../data/enquiry';
import {
  composePlainText,
  enquiryLines,
  gmailUrl,
  mailtoUrl,
  submitEnquiry,
  type Enquiry,
  type EnquiryDraft,
} from '../lib/enquiries';
import { venue } from '../data/venue';

/**
 * The enquiry form, and the screen that follows it.
 *
 * ── The flow the client asked for ────────────────────────────────────────
 * *"when client submit the form, informs them to send loft 91 a message
 * through their gmail and they will contact them."* So submitting is not the
 * end of the interaction, it is the middle of it: the form's job is to collect
 * the answers and then hand the visitor a finished email to press send on. The
 * venue replies to that email directly.
 *
 * That is stated up front, beside the form, rather than sprung on the visitor
 * at the end — a form that turns out to want one more action after "Send" is a
 * form people abandon at the last step. The three numbered lines in the aside
 * are the whole process, printed before it starts.
 *
 * It is also, on a static site with no backend, the only honest way to deliver
 * an enquiry at all (MEMORY.md Q3 — still open). The upside of this particular
 * shape is real and worth naming: the message arrives from the customer's own
 * address, so the owner replies to it the way they would reply to any other
 * email, with no dashboard to learn and no account to hold.
 *
 * ── Validation ───────────────────────────────────────────────────────────
 * `noValidate`, and every message is ours. The browser's own bubbles are
 * OS-drawn in the system font — the identical objection that made the
 * selection box bespoke, and the same answer.
 *
 * Five fields are required and three are not. The three that are optional —
 * phone, date, details — are optional because the owner can ask for any of
 * them in the reply, and a required field the visitor cannot answer yet is
 * how an enquiry gets abandoned rather than sent.
 */

const EMPTY: EnquiryDraft = {
  name: '',
  email: '',
  phone: '',
  occasion: '',
  guests: '',
  date: '',
  session: '',
  message: '',
};

type Errors = Partial<Record<keyof EnquiryDraft, string>>;

/** Today, in the visitor's own timezone. `toISOString()` would give UTC, which
    in Melbourne is yesterday for the first ten hours of every day — and a date
    field that accepts yesterday is a booking for a night that has been. */
function todayLocal(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/* Deliberately loose. The strict-looking address regexes all reject addresses
   that are perfectly valid, and the real check is that the venue's reply
   arrives — so this catches the typo class (no @, no dot, a stray space) and
   lets everything else through. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(draft: EnquiryDraft): Errors {
  const errors: Errors = {};

  if (!draft.name.trim()) errors.name = 'We need a name to put on the booking.';

  if (!draft.email.trim()) errors.email = 'An email address is how the venue replies.';
  else if (!EMAIL.test(draft.email.trim())) errors.email = 'That does not look like an email address.';

  // Optional — but a phone number with four digits in it is a typo, not a
  // choice, and it is worth catching before it becomes an unreturnable call.
  if (draft.phone.trim() && (draft.phone.match(/\d/g) ?? []).length < 6)
    errors.phone = 'That does not look like a full phone number.';

  if (!draft.occasion) errors.occasion = 'Choose what the night is for.';
  if (!draft.guests) errors.guests = 'Choose a rough group size.';
  if (!draft.session) errors.session = 'Choose a time of day.';

  if (draft.date && draft.date < todayLocal()) errors.date = 'Choose a date that has not passed.';

  return errors;
}

export function EnquiryForm() {
  const [draft, setDraft] = useState<EnquiryDraft>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ enquiry: Enquiry; stored: boolean } | null>(null);

  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLHeadingElement>(null);

  /** One setter per field, and it clears that field's error as the visitor
      fixes it — an error message that stays on screen while the answer under
      it changes is a message the visitor stops reading. */
  const set =
    <K extends keyof EnquiryDraft>(key: K) =>
    (value: string) => {
      setDraft((d) => ({ ...d, [key]: value }));
      setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const found = validate(draft);
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      /* Focus the first field that failed, after the render that marks it.
         `rAF` rather than a timeout: it runs after paint, so the element is
         both present and described by its message when focus lands on it and
         the screen reader reads the pair together. */
      requestAnimationFrame(() =>
        form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    setErrors({});
    setSent(submitEnquiry({ ...draft, name: draft.name.trim(), email: draft.email.trim() }));
  };

  /* Send focus to the confirmation heading. Without this, submitting on a
     phone replaces the form with a screen the visitor has to go looking for,
     and a screen-reader user is left with focus on a button that no longer
     exists. */
  useEffect(() => {
    if (sent) done.current?.focus();
  }, [sent]);

  if (sent) {
    return (
      <Confirmation
        enquiry={sent.enquiry}
        stored={sent.stored}
        heading={done}
        onRestart={() => {
          setDraft(EMPTY);
          setSent(null);
        }}
      />
    );
  }

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid gap-lg">
      {/* --- Who you are ------------------------------------------------- */}
      <fieldset className="grid gap-lg border-0 p-0">
        <legend className="label mb-md text-ink">
          <span className="mr-md text-ink-3 tabular-nums" aria-hidden="true">
            01
          </span>
          Who you are
        </legend>

        <Field
          label="Name"
          name="name"
          value={draft.name}
          onChange={set('name')}
          autoComplete="name"
          placeholder="First and last"
          error={errors.name}
        />

        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={draft.email}
          onChange={set('email')}
          placeholder="you@example.com"
          error={errors.email}
          hint="The reply comes back to this address."
        />

        <Field
          label="Phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={draft.phone}
          onChange={set('phone')}
          placeholder="(+61) 4"
          error={errors.phone}
          optional
        />
      </fieldset>

      {/* --- The night ---------------------------------------------------- */}
      <fieldset className="mt-lg grid gap-lg border-0 p-0">
        <legend className="label mb-md text-ink">
          <span className="mr-md text-ink-3 tabular-nums" aria-hidden="true">
            02
          </span>
          The night
        </legend>

        <Select
          label="Occasion"
          name="occasion"
          value={draft.occasion}
          choices={occasions}
          onChange={set('occasion')}
          placeholder="What the night is for"
          error={errors.occasion}
        />

        <Select
          label="Guests"
          name="guests"
          value={draft.guests}
          choices={guestBands}
          onChange={set('guests')}
          placeholder="Roughly how many"
          error={errors.guests}
        />

        {/* Was `<Field type="date">`. The field was fine; the *picker* was the
            OS calendar, drawn in the system font with a system-blue selection
            and a different shape in every browser. Client instruction
            2026-09-03 — see `DatePicker`, which is the selection box's twin. */}
        <DatePicker
          label="Preferred date"
          name="date"
          value={draft.date}
          onChange={set('date')}
          error={errors.date}
          min={todayLocal()}
          optional
          hint="Leave it blank if the date is still moving."
        />

        <Select
          label="Time of day"
          name="session"
          value={draft.session}
          choices={sessions}
          onChange={set('session')}
          placeholder="When you would start"
          error={errors.session}
        />
      </fieldset>

      {/* --- Anything else ------------------------------------------------ */}
      <fieldset className="mt-lg grid gap-lg border-0 p-0">
        <legend className="label mb-md text-ink">
          <span className="mr-md text-ink-3 tabular-nums" aria-hidden="true">
            03
          </span>
          Anything else
        </legend>

        <Field
          label="Details"
          name="message"
          value={draft.message}
          onChange={set('message')}
          placeholder="Food, a DJ, the screen, a run sheet — whatever matters."
          maxLength={1200}
          optional
          multiline
        />
      </fieldset>

      <div className="mt-lg border-t border-rule pt-lg">
        <button type="submit" className={`${buttonClass('primary')} w-full sm:w-auto`}>
          Prepare my enquiry
        </button>
        <p className="mt-md max-w-(--container-measure) text-small text-ink-3">
          Nothing is sent yet. The next screen hands you the finished email to send from Gmail, or
          from whichever mail app you use.
        </p>
      </div>
    </form>
  );
}

/**
 * The screen after submit — the step the client's process actually turns on.
 *
 * It has one job and states it once: the enquiry is written, press send. The
 * Gmail button is first because it is the route that was asked for; the mail
 * app beside it is not a fallback in the apologetic sense but the correct door
 * for everyone whose mail is not Gmail, and it is given equal weight for that
 * reason. Copying the text is the third door — it is what works when a browser
 * blocks both handoffs, and it is also simply what some people prefer.
 *
 * The enquiry is printed in full underneath. A confirmation that hides what it
 * is about to send asks the visitor to trust a black box at exactly the moment
 * they are checking their own spelling.
 */
function Confirmation({
  enquiry,
  stored,
  heading,
  onRestart,
}: {
  enquiry: Enquiry;
  stored: boolean;
  heading: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(composePlainText(enquiry));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access is refused outright in some browsers and over plain
      // HTTP. Saying so beats a button that silently does nothing.
      setCopied(false);
      window.alert('This browser would not let the page copy. Select the details below instead.');
    }
  };

  return (
    <div>
      {/* `tabIndex={-1}` so focus can be moved here programmatically without
          the heading becoming a tab stop for everyone else. */}
      <h2
        ref={heading}
        tabIndex={-1}
        className="font-display text-heading uppercase text-ink"
      >
        One step left — send it
      </h2>

      <p className="mt-md max-w-(--container-measure) text-lead text-ink-2">
        Your enquiry is written and ready. Send it to {venue.contact.email} from Gmail or your own
        mail app, and {venue.name} will get back to you directly.
      </p>

      <dl className="mt-lg flex flex-wrap items-baseline gap-x-lg gap-y-2xs border-t border-rule pt-sm">
        <dt className="label text-ink-3">Your reference</dt>
        <dd className="text-item text-ink tabular-nums">{enquiry.ref}</dd>
      </dl>

      <div className="mt-lg flex flex-wrap gap-sm">
        <a
          href={gmailUrl(enquiry)}
          target="_blank"
          rel="noreferrer noopener"
          className={buttonClass('primary')}
        >
          Send from Gmail
        </a>
        <a href={mailtoUrl(enquiry)} className={buttonClass('secondary')}>
          Use my mail app
        </a>
        <button type="button" onClick={copy} className={buttonClass('secondary')}>
          {copied ? 'Copied' : 'Copy the details'}
        </button>
      </div>

      {/* Announced, not just shown — the button's own label changing is not
          reliably read out. */}
      <p aria-live="polite" className="sr-only">
        {copied ? 'Enquiry details copied to the clipboard.' : ''}
      </p>

      <h3 className="label mt-2xl text-ink">What you are sending</h3>
      <dl className="mt-sm max-w-(--container-measure)">
        {enquiryLines(enquiry).map(({ key, label, value }) => (
          <div key={key} className="border-t border-rule py-sm">
            <dt className="label text-ink-3">{label}</dt>
            <dd className="mt-2xs text-body text-ink whitespace-pre-line">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-xl border-t border-rule pt-lg">
        <button type="button" onClick={onRestart} className={buttonClass('secondary')}>
          Start another enquiry
        </button>

        {!stored && (
          /* The send does not depend on the local record, so this is a note
             rather than a warning — but a silent failure would leave the
             enquiry missing from the admin board with no explanation for it. */
          <p className="mt-md max-w-(--container-measure) text-small text-ink-3">
            This browser would not let the page keep a copy, so the enquiry will not appear on the
            venue’s board. Sending the email is what reaches {venue.name}, and that is unaffected.
          </p>
        )}
      </div>
    </div>
  );
}
