/* ==========================================================================
   enquiries.ts — one enquiry: its shape, where it is kept, and how it is sent.

   ── READ THIS BEFORE TRUSTING THE ADMIN PAGE ─────────────────────────────
   demo4 is a static multi-page build served from GitHub Pages. There is no
   server, no database and no form endpoint, so there is nowhere for a
   submitted form to *go*. That is not a gap in this module — it is MEMORY.md
   **Q3**, still open, and the answer to it is the one thing that decides
   whether this site ever needs a backend.

   What this module does instead, and the honest boundary of each half:

   1. **Sending is real.** On submit the visitor is handed their enquiry
      pre-composed as an email — a Gmail compose link, with a `mailto:`
      alongside it for anyone not on Gmail — and they press send. The message
      arrives in the venue's inbox as an ordinary email from the customer's own
      address, which means the owner can simply reply to it. This is the
      delivery channel, and it works today with nothing switched on.

   2. **Storing is local, and only local.** `localStorage` is per-browser and
      per-origin. An enquiry submitted on a customer's phone is written to *that
      phone* and is unreachable from anywhere else — so `/admin/` shows the
      enquiries made in the browser it is opened in, and nothing else. It is a
      working model of the inbox the owner would get, not the inbox. The page
      says so on its face; do not quietly delete that notice.

   Replacing (2) with something real is one change and one change only: post
   the same `Enquiry` object to a form endpoint in `submitEnquiry`, and read
   the list back from it in `/admin/`. Every other line here survives.

   Storage is wrapped end to end because it genuinely throws: Safari private
   browsing, a browser set to block site data, and a full quota all raise on
   read *or* write. A thrown enquiry form is a lost booking, and the send step
   does not depend on the store — so every failure here degrades to "the
   record was not kept" and never to "the enquiry was not sent".
   ========================================================================== */

import { guestBands, labelOf, occasions, sessions } from '../data/enquiry';
import { venue } from '../data/venue';

export type EnquiryStatus = 'new' | 'contacted' | 'closed';

/** What the form collects. Every field is a string, including the date — it is
    the `yyyy-mm-dd` an `<input type="date">` produces, kept verbatim rather
    than parsed into a `Date`, because it round-trips through JSON unchanged
    and carries no timezone to get wrong. */
export interface Enquiry {
  /** `L91-260903-4F2K`. Printed in the subject line, so the owner and the
      customer are looking at the same string when they talk. */
  readonly ref: string;
  /** ISO instant the form was submitted. */
  readonly submittedAt: string;
  readonly status: EnquiryStatus;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly occasion: string;
  readonly guests: string;
  readonly date: string;
  readonly session: string;
  readonly message: string;
}

/** The form's own fields — an enquiry before it has a reference or a status. */
export type EnquiryDraft = Omit<Enquiry, 'ref' | 'submittedAt' | 'status'>;

export const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
] as const satisfies readonly { value: EnquiryStatus; label: string }[];

/* --------------------------------------------------------------------------
   Reference
   -------------------------------------------------------------------------- */

/* No I, O, S or Z: a reference gets read down a phone line and spoken back. */
const ALPHABET = 'ABCDEFGHJKLMNPQRTUVWXY0123456789';

/** `L91-YYMMDD-XXXX`. The date is in it so the owner can sort a printed list
    by eye; the four characters are random rather than sequential because a
    counter in `localStorage` restarts on every device it is read from. */
export function makeRef(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${pad(now.getFullYear() % 100)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;

  const bytes = new Uint8Array(4);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);

  let tail = '';
  for (const byte of bytes) tail += ALPHABET[byte % ALPHABET.length];

  return `L91-${stamp}-${tail}`;
}

/* --------------------------------------------------------------------------
   The store
   -------------------------------------------------------------------------- */

const KEY = 'l91-enquiries';

/** Reached through a getter rather than captured at module load: touching
    `localStorage` throws outright in a browser configured to block site data,
    and that must not take the module's import with it. */
function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Newest first. A malformed store returns empty rather than throwing — the
    admin page showing nothing is recoverable; the admin page not rendering is
    not. */
export function readEnquiries(): Enquiry[] {
  try {
    const raw = storage()?.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as Enquiry[])
      .filter((e) => e && typeof e.ref === 'string')
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  } catch {
    return [];
  }
}

/** `false` when the write did not happen, so a caller can say so rather than
    claim a record it does not have. */
function writeEnquiries(list: readonly Enquiry[]): boolean {
  try {
    const store = storage();
    if (!store) return false;
    store.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** Record a submission. Returns the enquiry either way — a failed write costs
    the local record, never the send, so the confirmation screen still gets a
    reference to show and an email to compose. */
export function submitEnquiry(draft: EnquiryDraft): { enquiry: Enquiry; stored: boolean } {
  const enquiry: Enquiry = {
    ...draft,
    ref: makeRef(),
    submittedAt: new Date().toISOString(),
    status: 'new',
  };
  return { enquiry, stored: writeEnquiries([enquiry, ...readEnquiries()]) };
}

export function setStatus(ref: string, status: EnquiryStatus): Enquiry[] {
  const next = readEnquiries().map((e) => (e.ref === ref ? { ...e, status } : e));
  writeEnquiries(next);
  return next;
}

export function removeEnquiry(ref: string): Enquiry[] {
  const next = readEnquiries().filter((e) => e.ref !== ref);
  writeEnquiries(next);
  return next;
}

export function clearEnquiries(): Enquiry[] {
  writeEnquiries([]);
  return [];
}

/* --------------------------------------------------------------------------
   Rendering an enquiry
   -------------------------------------------------------------------------- */

const AU = 'en-AU';

/** `2026-09-12` becomes `Sat 12 Sep 2026`. Built from the parts rather than
    handed to `new Date(string)`, which parses a bare date as UTC midnight and
    can render the day before in a negative-offset timezone. */
export function formatDate(value: string): string {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString(AU, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** The submission instant, in the reader's own timezone. */
export function formatStamp(iso: string): string {
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return iso;
  return at.toLocaleString(AU, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export interface Line {
  readonly key: keyof Enquiry;
  readonly label: string;
  readonly value: string;
}

/**
 * One enquiry as ordered label/value pairs — the single description of what an
 * enquiry *says*, read by the composed email, the copy-to-clipboard action and
 * the admin board alike. Three renderings of the same record that cannot fall
 * out of step, which is the whole reason this is a function and not three
 * templates.
 *
 * Empty optional fields are dropped rather than printed blank: an email whose
 * body reads "Phone:" with nothing after it is worse than one that does not
 * mention a phone at all.
 */
export function enquiryLines(e: Enquiry): Line[] {
  const lines: Line[] = [
    { key: 'name', label: 'Name', value: e.name },
    { key: 'email', label: 'Email', value: e.email },
  ];
  if (e.phone) lines.push({ key: 'phone', label: 'Phone', value: e.phone });
  lines.push(
    { key: 'occasion', label: 'Occasion', value: labelOf(occasions, e.occasion) },
    { key: 'guests', label: 'Guests', value: labelOf(guestBands, e.guests) },
  );
  if (e.date) lines.push({ key: 'date', label: 'Preferred date', value: formatDate(e.date) });
  lines.push({ key: 'session', label: 'Time of day', value: labelOf(sessions, e.session) });
  if (e.message) lines.push({ key: 'message', label: 'Details', value: e.message });
  return lines;
}

/* --------------------------------------------------------------------------
   Sending it
   -------------------------------------------------------------------------- */

/** The customer's own name and the reference, because the owner sorts a real
    inbox by subject line before opening anything. */
export const composeSubject = (e: Enquiry): string =>
  `Function enquiry — ${e.name || venue.name} — ${e.ref}`;

/** Plain text, "Label: value", one per line. Not column-aligned with padding —
    every mail client reflows it in a proportional face and the columns become
    ragged whitespace. The details paragraph is set apart under its own heading
    because it is the one field that runs to more than a line. */
export function composeBody(e: Enquiry): string {
  const lines = enquiryLines(e);
  const details = lines.find((l) => l.key === 'message');
  const facts = lines.filter((l) => l.key !== 'message');

  const parts = [
    `Hello ${venue.name},`,
    '',
    'I would like to enquire about hiring the room.',
    '',
    ...facts.map((l) => `${l.label}: ${l.value}`),
  ];

  if (details) parts.push('', 'Details', details.value);

  parts.push('', `Reference: ${e.ref}`, `Submitted: ${formatStamp(e.submittedAt)}`);

  return parts.join('\n');
}

/** The whole enquiry as one block of text, for the copy button on both pages. */
export const composePlainText = (e: Enquiry): string =>
  `${composeSubject(e)}\n\n${composeBody(e)}`;

/**
 * Gmail's compose URL — the route the client asked for, and the one most
 * people on a phone actually have signed in.
 *
 * `view=cm&fs=1` opens a full compose window; on a signed-out browser Google
 * asks for a sign-in and then opens it, which is correct behaviour and not
 * something to route around. `mailtoUrl` is offered beside it, always, for
 * everyone whose mail is not Gmail — a send flow with exactly one door is a
 * dead end for whoever is standing at the wrong one.
 */
/**
 * A query string with every space as `%20` rather than `+`.
 *
 * `URLSearchParams` serialises a space as `+`, which is correct only for a
 * reader applying form-decoding semantics. `%20` is a space under *both*
 * readings, so it is the one encoding that cannot come out the other end as a
 * subject line reading "Function+enquiry+—+Jane". Every other escape
 * `URLSearchParams` produces is already right; this replaces the single
 * ambiguous one, for the mail client and for Gmail alike.
 */
function query(params: Record<string, string>): string {
  return new URLSearchParams(params).toString().replace(/\+/g, '%20');
}

export function gmailUrl(e: Enquiry): string {
  return `https://mail.google.com/mail/?${query({
    view: 'cm',
    fs: '1',
    to: venue.contact.email,
    su: composeSubject(e),
    body: composeBody(e),
  })}`;
}

export function mailtoUrl(e: Enquiry): string {
  return `mailto:${venue.contact.email}?${query({
    subject: composeSubject(e),
    body: composeBody(e),
  })}`;
}
