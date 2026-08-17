/* ==========================================================================
   faq.tsx — the questions, in one place.

   Two surfaces read this list: the home page shows the three marked
   `standout`, and `/faq/` shows all of them. One source, so the home page can
   never quote an answer the FAQ page has since corrected.

   ⚠ Copy discipline (CLAUDE.md §4.1). Every answer below either restates a
   fact sourced in MEMORY.md §1, describes a client-supplied photograph, or
   says plainly that the answer is not known yet and names who owns it. There
   is no capacity figure, no minimum spend, no AV inventory and no closing
   time, because there is no source for any of them — and a plausible-looking
   guess on a real bar's website sends real people to a closed door.

   The three standouts are the three a function organiser asks first, which is
   the same set `demo/` carried on its landing page. They are also, not
   coincidentally, the three whose answers the venue still owes us.
   ========================================================================== */

import type { ReactNode } from 'react';
import { Tbc } from '../components/ui/Tbc';
import { venue } from './venue';

export interface FaqItem {
  readonly q: string;
  readonly a: ReactNode;
  /** Shown on the home page's FAQ section. Three, and no more: the point of
      that section is that it is a taste, with the heading as the way through
      to the rest. */
  readonly standout?: boolean;
}

export const faqs: readonly FaqItem[] = [
  {
    q: 'How do I enquire about hiring the space?',
    standout: true,
    a: (
      <>
        Message {venue.instagram.handle} on Instagram with your date, rough numbers and what the
        night is for — it is the only enquiry channel the venue publishes today.{' '}
        <Tbc what="an enquiry email address and phone number, so a form can reach an inbox" />
      </>
    ),
  },
  {
    q: 'What is the venue capacity?',
    standout: true,
    a: <Tbc what="standing and seated capacity — not published anywhere the venue controls" />,
  },
  {
    q: 'Do you have AV or music options for events?',
    standout: true,
    a: (
      <>
        The room has a wall-sized screen running its width, which is visible in the venue’s own
        photographs. What can be played through it, and whether a DJ or PA is available, is not
        something the photographs answer.{' '}
        <Tbc what="AV, DJ and music policy for functions" />
      </>
    ),
  },
  {
    q: 'Do I need to book?',
    a: (
      <>
        For functions and venue hire, enquiries go through Instagram — it is the only channel the
        venue publishes today. <Tbc what="whether walk-in tables can be booked, and how" />
      </>
    ),
  },
  {
    q: 'Are you open during the week?',
    a: (
      <>
        Friday, Saturday and Sunday are the published trading days. Monday to Thursday are not
        listed. <Tbc what="whether Mon–Thu are closed, or available for private hire" />
      </>
    ),
  },
  {
    q: 'What time do you close?',
    a: (
      <>
        The venue’s own listing says “late” for Friday and Saturday, and 8 PM on Sunday. That word
        is printed here exactly as published rather than turned into a time.{' '}
        <Tbc what="an actual closing time for Fri & Sat" />
      </>
    ),
  },
  {
    q: 'Is there food?',
    a: (
      <>
        The bar menu lists snacks — chips, crackling and nuts.{' '}
        <Tbc what="whether a kitchen menu or function catering exists" />
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
