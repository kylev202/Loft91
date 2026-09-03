/* ==========================================================================
   enquiry.ts — the choices offered by the enquiry form.

   Held here rather than inside the form component for the same reason
   `site.ts` holds the page model: the option lists are read three times over
   — by the form, by the composed email, and by the admin board that renders a
   stored enquiry back — and a label that exists in one of those and not the
   others is a booking the owner cannot read.

   ⚠ COPY DISCIPLINE (CLAUDE.md §4.1, MEMORY.md D-05). Nothing below states a
   venue fact. An occasion, a group size and a part of the day are the
   *visitor's* answers, not the venue's — none of them claims the room is
   available, holds that many people, or opens at that hour.

   The one exception is deliberate and marked: the guest bands carry the
   package tier that matches them, read from `packages.ts` rather than retyped.
   Those tiers and their capacities are INVENTED placeholder content (D-60) and
   are already published on `/packages/`. Pulling the names from that module
   means the form cannot quote a tier the packages page does not offer — but if
   D-60 is ever reverted, this note is the record that these bands go with it.
   ========================================================================== */

import { tiers } from './packages';

export interface Choice {
  readonly value: string;
  /** What the option reads as, in the list and in the sent email. */
  readonly label: string;
  /** The quiet second column of the option row. Context, never the answer. */
  readonly note?: string;
}

/** What the night is for. Six named occasions and a seventh way out, because a
    list of occasions that does not admit an unlisted one makes the visitor
    pick the closest wrong answer. */
export const occasions = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'engagement', label: 'Engagement or wedding' },
  { value: 'work', label: 'Work or corporate function' },
  { value: 'end-of-year', label: 'Christmas or end of year' },
  { value: 'music', label: 'Live music or a DJ' },
  { value: 'screening', label: 'A screening or watch party' },
  { value: 'other', label: 'Something else' },
] as const satisfies readonly Choice[];

/** Group size, in the same bands the packages page sells the room in — so the
    answer the visitor gives here is already the answer the owner needs to
    quote from. `tiers` is read, never restated (see the warning above). */
export const guestBands = [
  { value: 'to-20', label: 'Up to 20', note: tiers[0].name },
  { value: '20-60', label: '20 – 60', note: tiers[1].name },
  { value: '60-120', label: '60 – 120', note: tiers[2].name },
  { value: 'unsure', label: 'Not decided yet' },
] as const satisfies readonly Choice[];

/** Part of the day. The visitor's preference — this says nothing about when
    the venue trades, which is MEMORY.md Q1 and still unanswered. */
export const sessions = [
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'late', label: 'Late night' },
] as const satisfies readonly Choice[];

/** Resolve a stored value back to its label. The admin board and the composed
    email both render enquiries that were submitted against this list, so the
    lookup has to survive an option being renamed — an unrecognised value comes
    back as itself rather than as a blank. */
export const labelOf = (choices: readonly Choice[], value: string): string =>
  choices.find((c) => c.value === value)?.label ?? value;
