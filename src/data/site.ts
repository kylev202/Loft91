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
  /** `01`…`05`. The same index appears in the nav, the section heads and the
      footer, so the site has one table of contents rather than three. Adding
      `/space/` at `02` therefore renumbered everything below it — the numerals
      belong to the site's order, not to the pages, and a page that keeps its
      old number while a new one takes its place is how two tables of contents
      start. */
  readonly index: string;
  /** Nav label and cover title, set at display size. One word wherever one
      word will do it — "The Space" is the one that needs two. */
  readonly name: string;
  readonly href: string;
  /** The small line above the cover title. */
  readonly eyebrow: string;
  /** The cover photograph. Chosen because it carries that page's subject, not
      because it looked good: brass counter for the front door, tap bank for
      the drinks, the room itself for the room, the lit room for hire, the neon
      arch for the gallery, the street doorway for directions. */
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
    eyebrow: 'Food and Drinks',
    photo: photos.taps,
    title: 'Menu — Loft 91',
    description:
      'The drinks list at Loft 91, Footscray: draught and bottled beer, spirits, soju, cocktails and snacks.',
  },
  {
    id: 'space',
    index: '02',
    name: 'The Space',
    href: '/space/',
    eyebrow: 'Upstairs',
    photo: photos.room,
    title: 'The Space — Loft 91',
    description:
      'The upstairs room at Loft 91, Footscray: what is in it, how it can be set, and what it holds — standing, seated or at one long table.',
  },
  {
    id: 'packages',
    index: '03',
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
    index: '04',
    name: 'Gallery',
    href: '/gallery/',
    eyebrow: 'The room',
    photo: photos.stair,
    title: 'Gallery — Loft 91',
    description:
      'Photographs of Loft 91: the neon stairwell, the backlit bar, the upstairs room and the screen wall.',
  },
  {
    id: 'events',
    index: '05',
    name: 'Events',
    href: '/events/',
    eyebrow: "What's on",
    photo: photos.lounge,
    title: 'Events — Loft 91',
    description:
      'What’s on at Loft 91, Footscray: Comedy Loft every second Thursday from 8 PM with happy hour all night, and karaoke every Friday.',
  },
] as const satisfies readonly PageDef[];

/** The four frames on the landing page — `pages` minus `/space/`.
 *
 *  This is the one place a destination is deliberately in the nav and not on
 *  the home page, and it is worth saying why, because the note at the top of
 *  this file says a destination cannot exist in one surface and be missing
 *  from another.
 *
 *  The client's instruction for the landing page was specific: four gallery
 *  images linking to four pages, symmetrical frames, as little text as
 *  possible. Four is a 2 x 2 wall at every width the grid uses; five is a wall
 *  with a card sitting on its own underneath, which is the exact composition
 *  that instruction was reversing. So the wall stays as it was built and the
 *  new page is reached from the nav, the footer index, `/packages/` and the
 *  hand-off at the foot of `/gallery/`.
 *
 *  It is a one-word reversal if the client would rather the wall grew: export
 *  `pages` here instead, and the home page becomes five frames. */
export const gateways = pages.filter((page) => page.id !== 'space');

/** The FAQ, which is a real document but NOT a nav destination.
 *
 *  The nav carries the five places the venue is being sold from; the questions
 *  page is support material reached from the home page's FAQ heading and from
 *  the footer index. Keeping it out of `pages` is what stops it appearing as a
 *  gateway card and a nav item of its own — it answers questions about the
 *  other pages rather than being one of them. */
export const faqPage = {
  id: 'faq',
  index: '06',
  name: 'FAQ',
  href: '/faq/',
  eyebrow: 'Questions',
  photo: photos.neon,
  title: 'FAQ — Loft 91',
  description:
    'Frequently asked questions about Loft 91, Footscray: venue hire enquiries, capacity, opening hours, food and finding the entrance.',
} as const satisfies PageDef;

/** The enquiry form — a real document, and like the FAQ deliberately NOT a nav
 *  destination.
 *
 *  It does not need to be. It is the target of the "Enquire" button in the
 *  running head, the "Enquire about functions" button at the foot of the phone
 *  menu, both buttons on the Packages page and the footer's own call to
 *  action — four routes to it from every page on the site, which is more
 *  prominence than a nav slot of its own would buy it. The nav carries the
 *  places the venue is *browsed*; this is where a visit is *asked for*, and it
 *  is the one page reached by pressing a button rather than by reading a list.
 *
 *  It is in `allPages`, so it is listed in the footer index like everything
 *  else — the site lists itself in full there, and a page reachable from four
 *  buttons but absent from the index would be the one document the contents
 *  page does not admit to.
 *
 *  `photos.bar` is the only frame in the library no other page had claimed
 *  (D-61 left it out of the gallery as a second pass at the same counter as
 *  `barWide`, and it has been unused since). Every page opens on its own
 *  photograph; this one is now spent. */
export const enquirePage = {
  id: 'enquire',
  index: '07',
  name: 'Enquire',
  href: '/enquire/',
  eyebrow: 'Functions & venue hire',
  photo: photos.bar,
  title: 'Enquire — Loft 91',
  description:
    'Enquire about hiring Loft 91, an upstairs bar and function space on Nicholson Street, Footscray. Tell us the date, the numbers and what the night is for.',
} as const satisfies PageDef;

/** Everything with a URL, for the footer index. The nav deliberately shows a
    subset; the footer is where the site lists itself in full.

    `/admin/` is the one document that is NOT in here and must not be added.
    It is the venue's own board, not a destination — see `pages/admin.tsx`.

    ⚠ That is still true even though the footer now carries a "Log in" link to
    it (2026-09-03, client instruction). The link is rendered *below* the
    demo-build note, outside this index, precisely so the index continues to
    list the public site and only the public site. Putting `/admin/` in
    `allPages` would give it an index number, a row between `/enquire/` and the
    end, and a place in the site's own table of contents — which is the thing
    the paragraph above is refusing, and the link does not change it. */
export const allPages = [...pages, faqPage, enquirePage] as const satisfies readonly PageDef[];

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
