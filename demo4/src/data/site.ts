/* ==========================================================================
   site.ts — the page model.

   demo3 is six real documents rather than one scrolling page (a reversal of
   D-04, on explicit user instruction: "each nav will have their own page").
   That makes the set of pages a piece of *data*, not something each file
   restates: the nav, the home page's sections, the footer index and the
   cross-document view transition all read from this one list, so a destination
   cannot exist in one of them and be missing from another.

   The home page is now the full landing page from `demo/` — every section is
   present, condensed, and each one hands off to its own document. So the list
   below is read twice on the index page: once for the nav, once for the
   section that previews it.

   ⚠ Copy discipline (CLAUDE.md §4.1, MEMORY.md D-05). Every line *in this
   file* either describes what is on the page — which is ours to write — or
   restates a fact already sourced in MEMORY.md §1. There is still no capacity,
   no package inclusion, no price and no exclusivity claim here.

   ⚠⚠ That is no longer true of the site as a whole. D-60 fills the Missing
   content — packages, capacity, spend, enquiry details, the venue story, half
   the FAQ answers — with **invented placeholder copy**, on explicit user
   instruction, so the demo reads as a finished site. The invention is confined
   to `data/packages.ts`, the marked blocks at the foot of `data/venue.ts`, and
   the answers in `data/faq.tsx`; every one of them carries a ⚠ comment naming
   it as invented, and the footer of every page says the build is placeheld.
   The [TBC] markers that used to carry those gaps are gone from the pages, so
   MEMORY.md §5 and §6 are now the only record of what is actually unknown.

   ── The copy fields are gone (client instruction, 2026-08-31) ─────────────
   A page used to carry two written lines here on top of its name: `statement`,
   the sentence set beside the cover title, and `blurb`, one line under the
   home page's gateway card. `blurb` stopped rendering when the landing page was
   cut to four captioned frames, and `statement` is now removed everywhere —
   every one of the five restated the eyebrow directly above it ("Behind the
   bar" over "The list behind the bar."). A page is now its index, its eyebrow,
   its name and its picture. The old wording is in git if any of it is wanted
   back; nothing else read either field.
   ========================================================================== */

import { photos, type Photo } from './photos';

export interface PageDef {
  readonly id: string;
  /** `01`…`04`. The same index appears in the nav, the section heads and the
      footer, so the site has one table of contents rather than three. */
  readonly index: string;
  /** Nav label and cover title — one word, set at display size. */
  readonly name: string;
  readonly href: string;
  /** The small line above the cover title. */
  readonly eyebrow: string;
  /** The cover photograph. Chosen because it carries that page's subject, not
      because it looked good: brass counter for the front door, tap bank for
      the drinks, the lit room for hire, the neon arch for the gallery, the
      street doorway for directions. */
  readonly photo: Photo;
  readonly title: string;
  readonly description: string;
}

export const pages = [
  {
    id: 'menu',
    index: '01',
    name: 'Menu',
    href: '/menu/',
    eyebrow: 'Behind the bar',
    photo: photos.taps,
    title: 'Menu — Loft 91',
    description:
      'The drinks list at Loft 91, Footscray: draught and bottled beer, spirits, soju, cocktails and snacks.',
  },
  {
    id: 'packages',
    index: '02',
    name: 'Packages',
    href: '/packages/',
    eyebrow: 'Functions & venue hire',
    photo: photos.event,
    title: 'Packages — Loft 91',
    description:
      'Functions and venue hire at Loft 91, an upstairs bar and event space on Nicholson Street, Footscray.',
  },
  {
    id: 'gallery',
    index: '03',
    name: 'Gallery',
    href: '/gallery/',
    eyebrow: 'The room',
    photo: photos.stair,
    title: 'Gallery — Loft 91',
    description:
      'Photographs of Loft 91: the neon stairwell, the backlit bar, the upstairs room and the screen wall.',
  },
  {
    id: 'about',
    index: '04',
    name: 'About us',
    href: '/about/',
    eyebrow: 'The venue',
    photo: photos.entrance,
    title: 'About us — Loft 91',
    description:
      'Loft 91 is a bar and function space upstairs at 91 Nicholson Street, Footscray. Hours, the address, and how to find the entrance.',
  },
] as const satisfies readonly PageDef[];

/** The FAQ, which is a real document but NOT a nav destination.
 *
 *  The nav carries the four places the venue is being sold from; the questions
 *  page is support material reached from the home page's FAQ heading and from
 *  the footer index. Keeping it out of `pages` is what stops it appearing as a
 *  fifth gateway and a fifth nav item — the user's instruction was that the
 *  fourth nav slot goes to About us instead of Visit, not that the nav grows. */
export const faqPage = {
  id: 'faq',
  index: '05',
  name: 'FAQ',
  href: '/faq/',
  eyebrow: 'Questions',
  photo: photos.neon,
  title: 'FAQ — Loft 91',
  description:
    'Frequently asked questions about Loft 91, Footscray: venue hire enquiries, capacity, opening hours, food and finding the entrance.',
} as const satisfies PageDef;

/** Everything with a URL, for the footer index. The nav deliberately shows a
    subset; the footer is where the site lists itself in full. */
export const allPages = [...pages, faqPage] as const satisfies readonly PageDef[];

export type PageId = (typeof pages)[number]['id'];

export const pageById = (id: PageId) => {
  const found = pages.find((p) => p.id === id);
  // Unreachable while `id` is a PageId, but a thrown error beats a blank cover
  // if this list is ever edited without the pages being updated with it.
  if (!found) throw new Error(`site.ts: no page "${id}"`);
  return found;
};

/** The home page's own cover copy. Held here with the rest of the page model
    rather than inline in the component, for the same reason as everything else
    in this file — one place to check the wording against MEMORY.md.

    ⚠ `statementLines` is NO LONGER RENDERED. The client asked for the hero
    sentence to be removed (D-58), so `HomeCover` sets the mark and a rule and
    nothing else. The wording is kept here rather than deleted because it is the
    record of what was on the page and of the fact that it was never approved —
    if a headline is ever wanted back, this is the interim text to re-approve or
    replace, not to reinstate silently.

    ⚠ The statement is INTERIM (MEMORY.md §5, "Hero wordline copy"): it is
    composed only from §1 confirmed facts — the category (bar), the position
    (upstairs) and the suburb (Footscray) — but the client has not approved the
    wording. Hand-broken into three lines rather than left to wrap, so the
    lockup is the same shape at every width it is designed for.

    Two lines, not three: the home cover's content block was 78% of the frame
    height, which left the photograph — the backlit bar this whole palette is
    sampled from — with nowhere to be seen. A line of display type is ~59px, and
    that is 59px of room back. */
/* ⚠ `home.title` is NOT the browser tab title, despite having been the same
   string until 2026-08-27. The tab is set in `index.html`, and the user
   shortened it to "Loft 91" (commit b05514b, made against demo3 and carried
   across when demo4 took over the Pages URL).

   This one is rendered by `HomeCover` as the page's visually-hidden `<h1>`,
   and since D-58 removed the hero headline and D-59 removed the wordmark, it
   is the *only* heading a screen reader gets on the landing page. Shortened to
   "Loft 91" it would say the venue's name and nothing about what it is. So the
   two are allowed to differ: short in the tab, descriptive in the heading. */
export const home = {
  href: '/',
  statementLines: ['An upstairs bar', 'in Footscray.'] as const,
  statementTbc: 'wording not client-approved — composed from confirmed facts only',
  photo: photos.barWide,
  title: 'Loft 91 — an upstairs bar & function space in Footscray',
  description:
    'Loft 91 is a bar and function space upstairs at 91 Nicholson Street, Footscray. Open Friday and Saturday from 5 PM, and Sunday 1 PM to 6 PM.',
} as const;
