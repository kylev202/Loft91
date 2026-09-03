/* ==========================================================================
   faq.tsx — the questions, in one place.

   Two surfaces read this list: the home page shows the three marked
   `standout`, and `/faq/` shows all of them. One source, so the home page can
   never quote an answer the FAQ page has since corrected.

   ⚠⚠ COPY DISCIPLINE IS SUSPENDED HERE (D-60). This file used to answer five
   of these eight questions with a visible [TBC] naming who owed us the answer,
   because MEMORY.md §5 lists capacity, AV, the enquiry channel and closing
   times as ❌ Missing and CLAUDE.md §4.1 forbids inventing them. On explicit
   user instruction the demo now answers all eight, and the answers to those
   five are **written, not sourced**:

     · capacity — invented, see `data/packages.ts`
     · AV, PA and the DJ booth — invented beyond the screen, which is in the
       photographs
     · the enquiry email and phone — invented, see `venue.contact`
     · what "late" means on Fri & Sat — invented; the venue publishes the word
       "late" and nothing more (MEMORY.md Q1)
     · function catering — invented; only the bar snacks are sourced

   Everything else still restates a §1 fact or describes a client-supplied
   photograph. The gaps are unchanged in MEMORY.md §5 and §6 — they are simply
   no longer visible on the page, which is the trade the demo makes.

   The three standouts are the three a function organiser asks first, which is
   the same set `demo/` carried on its landing page.
   ========================================================================== */

import type { ReactNode } from 'react';
import { venue } from './venue';
import { capacity } from './packages';
import { withBase } from '../lib/base';

export interface FaqItem {
  readonly q: string;
  readonly a: ReactNode;
  /** Shown on the home page's FAQ section. Three, and no more: the point of
      that section is that it is a taste, with the heading as the way through
      to the rest. */
  readonly standout?: boolean;
}

/** Read from the hours table rather than typed out, so an answer about closing
    time cannot drift from the table that states it. */
const sunday = venue.hours[2];

export const faqs: readonly FaqItem[] = [
  {
    q: 'How do I enquire about hiring the space?',
    standout: true,
    a: (
      /* Repointed at `/enquire/` when the form was built. The answer used to
         open on the email address, because emailing was the enquiry; the form
         now asks the four things the venue would otherwise have to write back
         for, so it leads — and the address stays, because a question this
         short should not require a form to ask it. */
      <>
        Use the{' '}
        <a
          href={withBase('/enquire/')}
          className="underline decoration-rule-strong underline-offset-4 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
        >
          enquiry form
        </a>
        : it takes the date, rough numbers and what the night is for, then hands you the finished
        email to send. {venue.contact.phone} reaches the bar on trading nights,{' '}
        {venue.contact.email} works if you would rather write your own, and{' '}
        {venue.instagram.handle} on Instagram is fine for a quick question.
      </>
    ),
  },
  {
    q: 'What is the venue capacity?',
    standout: true,
    a: (
      <>
        {capacity.standing} for an exclusive-use party, or {capacity.seated} once the
        room is set with tables. A single long table down the length of the brick seats about 60.
      </>
    ),
  },
  {
    q: 'Do you have AV or music options for events?',
    standout: true,
    a: (
      <>
        The room has a wall-sized screen running its width, which is visible in the venue’s own
        photographs — it takes HDMI or a wireless connection, so slides, footage or the game all
        work. There is a house PA with a radio mic for speeches, and a DJ booth if you are bringing
        one. Otherwise a playlist runs through the house system.
      </>
    ),
  },
  {
    q: 'Do I need to book?',
    a: (
      <>
        Not for a drink — the bar is walk-in on Friday, Saturday and Sunday. Groups of six or more
        are worth booking ahead, and anything larger than that is a function enquiry rather than a
        table.
      </>
    ),
  },
  {
    q: 'Are you open during the week?',
    a: (
      <>
        Friday, Saturday and Sunday are the trading days. Monday to Thursday the room is available
        for private hire but is not open to walk-ins.
      </>
    ),
  },
  {
    q: 'What time do you close?',
    a: (
      <>
        Last drinks at 1 AM on Friday and Saturday — the listing says “late”, and that is what it
        means. Sunday is an afternoon: the bar closes at {sunday.closes}.
      </>
    ),
  },
  {
    q: 'Is there food?',
    a: (
      <>
        The bar menu lists snacks — chips, crackling and nuts. For functions there are grazing and
        hot boards from $18 a head, ordered a week ahead, and you are welcome to bring a cake.
      </>
    ),
  },
  {
    q: 'Where exactly is the entrance?',
    a: (
      <>
        At street level it is the lit arched stairwell beside Crumbz Deli, with the LOFT91 sign
        above the door. There is no ground-floor frontage — the venue is one flight up.
      </>
    ),
  },
];

export const standoutFaqs = faqs.filter((item) => item.standout);
