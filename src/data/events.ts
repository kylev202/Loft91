/* ==========================================================================
   events.ts — the recurring nights on `/events/`.

   Sourced from the client, 2026-10-02: *"Comedy Loft from 8 – Thurs every
   2 fortnightly, happy hours all night · karaoke night every friday"*.

   ⚠ Read as: Comedy Loft runs every second Thursday from 8 PM, with happy hour
   prices all night; karaoke runs every Friday. Two things were NOT given and
   are deliberately not printed (CLAUDE.md §4.1):

     · Which Thursdays. "Every second Thursday" is stated; the next date is not,
       because there is no anchor date to count a fortnight from. The page sends
       people to Instagram for dates instead of computing one.
     · What time karaoke starts. Friday trading is confirmed from 5 PM, but
       karaoke could start any time after that, so no time is printed.
   ========================================================================== */

const NB = ' ';

export interface VenueEvent {
  readonly id: string;
  readonly name: string;
  /** The section label above the name. */
  readonly day: string;
  /** The recurrence, as one line. */
  readonly when: string;
  /** Start time, where the client gave one. */
  readonly from?: string;
  /** The offer that runs alongside the night, where there is one. */
  readonly deal?: string;
  readonly sticker: 'comedy' | 'karaoke';
}

export const events = [
  {
    id: 'comedy',
    name: 'Comedy Loft',
    day: 'Thursdays',
    when: `Every second Thursday`,
    from: `8${NB}PM`,
    deal: 'Happy hour all night',
    sticker: 'comedy',
  },
  {
    id: 'karaoke',
    name: 'Karaoke Night',
    day: 'Fridays',
    when: 'Every Friday',
    sticker: 'karaoke',
  },
] as const satisfies readonly VenueEvent[];
