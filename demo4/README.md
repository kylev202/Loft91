# demo4 — Atelier

The fourth design direction for Loft 91, and a **full reset** of the third. Built on
explicit user instruction: reset the current design entirely and rebuild the site in the
visual language of a high-end furniture retailer's website that the user supplied as a
reference.

`demo3/` has been moved to `archive/demo3/` — unchanged, still runnable, kept for the
record. References to `demo/`, `demo2/` and `demo3/` in the notes below and in the source
comments are about those directions as *designs*, and still read correctly; only their
location changed.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview
```

---

## 0. What "copy the design" meant here, and what it did not

The reference is a **furniture e-commerce site**: product grids, a cart, a wishlist, room-
based navigation, prices under photographs. Loft 91 is a weekend bar and a function room.
A literal clone would have handed the venue a shop skeleton with nothing to put in it.

So what was taken is the **visual language**, which is the part that transfers: warm white
ground, near-black type, no brand colour at all, generous margins, photography carried at
full bleed, a strict four-up grid, small wide-tracked capitals for interface text, a serif
at size for headings, and motion held to almost nothing. What was **not** taken is any of
the reference's code, copy, imagery or page structure. Every section here is Loft 91's own,
and every fact in it still traces to `MEMORY.md` §1.

## 1. The thesis

**The page is a gallery wall; the room is what hangs on it.** Three rules resolve every
argument about a detail:

1. **There is no brand colour.** Restraint is the strategy. Every hue on the site arrives
   from the venue's own photographs — the magenta neon, the brass counter, the green
   column — and the page around them is warm paper and ink. Where Nocturne used brass to
   mark "this one is live", this uses weight, position and a 1px rule.
2. **Type sits on paper, never on a photograph.** The photograph runs full bleed and
   *finishes*; the title begins underneath it on clean paper. A grade is a dark-page
   device, and on warm white it is a smear.
3. **Nothing rounds, nothing floats, nothing glows.** Radius is zero everywhere, on every
   surface. Depth is one step of surface tone and a 1px rule.

Rule 2 is the one that pays for itself. Nocturne set every page title into the foot of its
own cover shot, which required three content-anchored gradient systems, a reserved
`--cover-band` so titles could not jump between pages, a forced-colours repair per gradient
and a contrast-mode override per gradient. All of it is **deleted, not ported** — there is
no longer any text whose contrast depends on what a photograph is doing behind it.
`base.css` is roughly half its former length as a direct result.

## 2. Palette, computed not estimated

Every ratio below is computed against `--color-page` (`#FBFAF8`), not estimated.

| Token | Value | On `--color-page` |
|---|---|---|
| `--color-page` | `#FBFAF8` | — |
| `--color-panel` | `#F2EFEA` | — |
| `--color-panel-2` | `#E8E4DC` | — |
| `--color-ink` | `#16150F` | **17.38:1** |
| `--color-ink-2` | `rgb(22 21 15 / .70)` | **6.57:1** |
| `--color-ink-3` | `rgb(22 21 15 / .62)` | **4.99:1** |
| `--color-ink-4` | `rgb(22 21 15 / .14)` | 1.34:1 — decorative, never text |
| `--color-outline` | `rgb(22 21 15 / .55)` | 3.97:1 — clears the 3:1 UI floor |
| `--color-fill` | `#16150F` | 17.38:1 the other way round, on the CTA |

`--color-ink-3` is `.62` rather than the `.55` that looked right, because `.55` composites
to **3.97:1** — under the 4.5:1 floor. That is the same defect D-07 found in the dark ramp,
and it is not shipping a second time on the light one.

## 3. Type — the roles are inverted

Same four self-hosted faces as Nocturne. Different jobs, and the swap is the loudest single
signal that this is a new design rather than a recolour:

| Face | Nocturne | Atelier |
|---|---|---|
| **Zodiak Regular** | the one-sentence editorial voice | **display** — every page title and section heading |
| **Switzer Light** | the wordmark's setting | the statement voice, large quiet type |
| **Switzer Regular** | body, lists, tables | unchanged |
| **Switzer Medium** | page titles | labels, nav, buttons — small wide-tracked capitals |

Nothing needed re-licensing or re-sourcing. The display ramp is anchored to the same two
viewports (360px / 1440px) on one continuous curve, and its top end came **down** — 76px,
against Nocturne's 96px — because a title on paper under a photograph does not need to
compete with one.

## 4. Eight documents, not a router

`vite.config.ts` declares eight HTML entries. No router library, each page ships only its own
code, every URL is directly crawlable, and the shared React/GSAP/Lenis chunk is fetched once
and served from cache thereafter.

```
/            index.html          hero, then four frames — nothing else
/menu/       menu/index.html     cover, happy hour, the full drinks list
/packages/   packages/index.html cover, the room, three package tiers, enquiry
/gallery/    gallery/index.html  cover, eight plates in two bands by orientation
/about/      about/index.html    cover, the venue, hours, getting here
/faq/        faq/index.html      cover, every question
/enquire/    enquire/index.html  cover, the function enquiry form, how it works
/admin/      admin/index.html    the venue's board — every enquiry, newest first
```

The nav carries four — Menu, Packages, Gallery, **About us**. `/faq/` and `/enquire/` are
support material rather than destinations the venue is browsed from, so they are reached
from the footer index — which lists the site in full and is on every page — and, in the
form's case, from the four "Enquire" buttons: the running head, the phone menu, the footer
call to action and both buttons on `/packages/`.

`/admin/` is in neither the nav nor the footer index, and carries `noindex, nofollow`. It is
the back of the bar, not part of the site. The one route to it from the site is a quiet
**"Log in"** link at the foot of the footer, under the sign-off and outside the
index — where a venue site puts a staff log-in, and `rel="nofollow"` so the crawler does
not walk in from a public page.

Behind that link the board asks for a **user and a passphrase** (`src/lib/auth.ts`), and
the session lasts a week or until Log out.

`/admin/` is the one document that mounts **`bare`** (`shell/Page`): no loader, no nav, no
footer. It is a tool rather than a page of the site, and the furniture that makes the other
seven cohere is dead weight on it — a nav offering Menu and Gallery to somebody reading a
booking, a footer restating the trading hours under a list of customer phone numbers. In
their place is a slim bar carrying the mark (the way back to the site) and Log out.

The board itself is **one line per enquiry, opening in place** — date, name, what the night
is, how far off it is, and where it got to, with everything else behind the `+`. From `lg`
those rows lock into columns via `display: contents` on the meta group, so the dates and
statuses line up and the eye runs down one of them. Search, status chips carrying live
counts, and a date/arrival order sit above it; **Download CSV** takes a copy off the device.

⚠ **The board carries no notices any more.** It used to state on its own face that it was
local to one browser and that the passphrase was a latch rather than a lock. Both were
removed on client instruction (2026-09-04) along with the rest of the demo copy. **Neither
limit changed** — they are recorded in `src/lib/auth.ts`, `src/lib/enquiries.ts` and
MEMORY.md Q3, and the two blockquotes below are now the only place a reader is told.

> **The passphrase is a latch, not a lock.** There is no server, so the check happens in the
> page against a value that ships in the page — the passphrase is stored as a SHA-256 digest,
> which keeps it out of a devtools panel and would not stop anybody who actually wanted in.
> What it does stop is the next person to pick up the phone or the laptop behind the bar
> reading a customer's mobile number off a screen somebody left open, which is the only risk
> this page has while the store is local. It is also the log-in the venue keeps: when there
> is a backend, `signIn` changes and the form, the session and the log-out survive.

> **The board is per-device.** A submitted enquiry is recorded in `localStorage` — `/admin/`
> shows what was submitted in the browser it is opened in and nothing else, so a stranger
> who opens this URL on their own phone gets an empty board whether they log in or not. The
> delivery that actually works is the email: the form composes the enquiry and the visitor
> sends it from Gmail or their own mail app, so it arrives from their address and the owner
> replies to it directly. **Download all as CSV** on the board is the only way a copy leaves
> the device, and it matters — clearing site data takes every enquiry with it. Swapping the
> local record for a real one is two calls in `src/lib/enquiries.ts`. See MEMORY.md Q3.

**Cross-document view transitions** survive the reset unchanged: the cover photograph of
the page you leave morphs into the cover of the page you arrive at, while the nav and the
footer hold still. Entirely declarative; `src/lib/transitions.ts` hands the `cover`
name to whichever home-page card depicts the destination, so the morph starts from the
picture the visitor pressed.

## 5. What changed, component by component

| Was | Now | Why |
|---|---|---|
| Title set into the cover photograph behind three gradients | Photograph ends, title on paper | Contrast becomes a property of the palette alone; every cover shows 100% of its picture |
| Scrolling fact band (`Band.tsx`) | Nothing | Replaced first by a static notice strip above the nav — a marquee is motion for its own sake, and a retail site states its announcement once and leaves it. The strip itself was then removed on client instruction (D-62), so the hours now live in the footer and on `/about/` only. **Both deleted, not restyled.** |
| Fixed nav, transparent over the cover, solid after 120px | Sticky nav, solid always | With the photograph starting below it there is nothing to be transparent over — deletes the scroll listener, the scroll state and a contrast bug class |
| Uneven 7/5 · 5/7 gateway blocks, captions inside the photographs | A 2 × 2 wall of equal frames, captions on paper | The four destinations are peers; the uneven grid was quietly claiming otherwise (see §5.1 for the later reduction) |
| `clip-path` aperture reveal + gallery parallax drift | Fade + settle | An aperture on warm white is a white box growing into a white page. The reference language has no parallax. |
| Bezel: double frame, 6px reveal, concentric radii | One hairline, one tone step | A concentric double frame with square corners is not a bezel, it is two rectangles |
| Brass accent on prices, markers, active states, CTA | Ink, weight, position, a rule | No brand colour |

`Gateways.tsx` was **dormant in demo3** — built, then orphaned, left in the tree with a
comment saying nothing imported it. It is wired back in here, directly under the hero,
because a grid of frames under a full-bleed image is the reference language's central
pattern — and it has since become the entire landing page. See §5.1.

### 5.1 The landing page, reduced

Client instruction, after the reset landed: minimise the landing page, four gallery images
linking to the four pages, a small caption under each, minimise text, focus on symmetrical
picture frames. So `/` is now **the hero and four frames, and nothing else**.

| Was | Now |
|---|---|
| Hero closing on hours, street, "See the menu" and "Enquire about functions" | Deleted |
| Hero headline "An upstairs bar in Footscray.", display serif at up to 76px | Deleted |
| Hero wordmark lockup, 260px of black artwork under the photograph | Deleted — the hero is now the photograph and one hairline |
| Four cards: photograph, index numeral, name, arrow, one-line blurb | Four frames: photograph, name |
| 1 → 2 → 4 columns, `section-pad`, full shell width | **1 column on a phone, 2 above 480px**, capped at `--container-wall` (68rem) |
| Caption in the label voice — Switzer Medium, 11px, `--tracking-label` | The wordmark's own setting — Switzer **Light**, 14px, `--tracking-mark` |
| Five condensed sections below the grid: Menu + happy hour, Packages + block grid, the gallery strip, three questions, Visit + hours + doorway | Deleted from this page |

The frames are 4:5 everywhere and identical in size at every width — measured on the built
`dist/`, 342 × 428 stacked at 390px and 524 × 655 in the 2 × 2 wall at 1440px, with no
horizontal overflow at 360, 390 or 1440.

**Why the stack is a phone-only rule.** The client asked for the frames to stack vertically
in the iPhone view specifically, so the switch is `sm` (480px) — phone portrait gets four
full-width frames down the page, and anything wider gets the 2 × 2 wall, which is what makes
the arrangement symmetrical on both axes.

**The caption's face.** The client asked for a more elegant sans. Four faces are self-hosted
and no new one can be added without a file and a licence (CLAUDE.md §5), so the real question
is which of them, set how — and the most elegant sans setting this site owns is the one the
client's own logo is set in: Switzer Light, uppercase, at `--tracking-mark`. That is the
existing `wordmark` utility, so the four captions are now set in the venue's own lettering
rather than in interface chrome. It runs at `--text-small` (14px) rather than the label's
11px because, as `base.css` says, Light at 11px with wide tracking on warm paper goes thin
and grey before it goes small — lighter and larger is elegant, lighter and smaller is faint.

With the headline gone, **the display serif no longer appears on the landing page at all**.
Zodiak still sets the page titles on the other five documents; moving the whole site off the
serif is one token in `theme.css` and has not been done.

### 5.2 The hero, emptied

Third instruction: remove the wordmark from this page too. So the landing page's cover is
now **the photograph, full bleed, and one hairline** — no mark, no headline, no facts, no
buttons. Three deletions in a row, each one asked for, and the end point is a legitimate
destination for this design rather than an accident: the reference language is image-led,
and a cover that runs a photograph edge to edge, stops, and draws a single line before the
wall of frames is the quietest version of it.

Two consequences, both handled rather than discovered later:

**The brief asked the homepage to "clearly show their branding"** (`MEMORY.md` §3.1), and
the lockup was the answer to it. The mark has not left the site — it is in the running head
at the top of every page, which is also the home link, and the footer closes every page on
the same artwork used as an alpha mask over the neon stairwell. But it is no longer the
landing page's own statement, and that is a real move away from §3.1. Four lines to reverse.

**The page needed an `h1` that is not an image.** Removing the lockup removed the only
heading on the document. The page title is now carried as screen-reader-only text in
`HomeCover` — the same string as `<title>`, read from `site.ts`, so the two cannot drift.
Verified in the browser: one `h1`, then the `h2`s, in order.

`CoverFrame`'s entrance is now built from a `beat()` helper that adds a tween only when its
selector matches something inside that cover. Every beat is optional: the home hero has no
title lines and no tail, while every interior page still has both, and GSAP warns to the
console for a tween with an empty target list. Verified: no console output on `/`, `/menu/`
or `/about/`, and the interior covers still animate and land.

**Nothing published was deleted, but two things lost prominence, and both are worth stating
rather than burying.** The landing page no longer carries a call to action of its own — the
enquiry path is the nav's Enquire button on desktop and the last item in the menu overlay
on a phone. And it no longer prints the hours in its own body; since D-62 removed the
notice strip they are stated in the footer of every page and in `/about/`, and nowhere
above the fold on any document. Everything
else moved to the document that already carried it in full: happy hour and drinks to
`/menu/`, the room to `/packages/`, the eight frames to `/gallery/`, the address and the
doorway to `/about/` and the footer, the questions to `/faq/` (reached from About us and
the footer index). Both reductions reverse in a few lines.

`Feature`, `HappyHourPanel`, `Bento` and `Strip` are now unused. They are **left in the
tree**, not deleted: they are correct, they are the fastest route back if any of this is
reinstated, and removing them is a separate decision from the one the client made.

⚠ **One thing to look at:** the Gallery frame (`stair`) and the About us frame (`entrance`)
are both magenta-lit stairwell shots, and side by side in a 2 × 2 wall they read as near
duplicates. That was invisible when the two sat a screen apart; it is the most visible
thing on the page now. Fixing it means reassigning one page's cover photograph — a content
decision, not a layout one, so it has not been taken here.

## 6. Photography, assigned by subject

Unchanged from demo3 — the assignment was sound and the photographs did not move.

| Page | Cover | Why |
|---|---|---|
| Home | `bar-wide` | the backlit ribbed counter and arched marble shelves |
| Menu | `taps` | the tap bank; literally what the page is about |
| Packages | `event` | the room lit for a function — the commercial frame, on the commercial page |
| Gallery | `stair` | the magenta neon arch, the venue's signature |
| About us | `entrance` | wayfinding: at street level the venue is an unmarked stairwell beside a deli |
| FAQ | `neon` | the "See You Next Time" sign — the last thing you read, on the page of last questions |

The wordmark lockup flipped from the white artwork to the **black** one everywhere, for the
same reason the palette did. The white PNG stays in the pipeline; nothing renders it today.

## 7. Verified — and what is not

**Verified in this session:** `npm run build` completes, which includes `tsc --noEmit`, so
the eight documents compile and typecheck. Bundle sizes are reported below from that build.

> ⚠ **Nothing else here has been measured.** demo3's README carried a long verification
> section — contrast sampled off the render, overflow sweeps, touch-target counts, keyboard
> walks, reduced-motion checks, per-page budgets. **None of it transfers.** It was measured
> against a near-black page with graded covers; this is a warm-white page with no grades at
> all, and every number in it is stale by construction. It has been removed rather than
> carried forward, because a stale measurement presented as current is worse than no
> measurement.

Re-measurement is outstanding and is the next task if this direction is chosen. The palette
ratios in §2 are arithmetic, not sampling — they are sound, but they say nothing about type
over photography (of which there now is none by design), horizontal overflow, touch
targets, focus order or real-device performance.

**Also not verified:** hover states, cross-document view transitions in a browser that lacks
them, throttled-4G LCP/CLS/INP, and the metric-override numbers in `fonts.css`, which are
`DESIGN.md`'s stated starting point and have never been measured against the real faces.
That last one matters more here than it did in demo3: Zodiak now sets every page title at up
to 76px, so a metric mismatch is a layout shift on the largest element on the page.

## 8. What is still missing — and what the demo now pretends is not

⚠️ **Read this before showing anyone the build.** Until 2026-08-27 nothing on this site
invented a venue fact, and every gap rendered as a visible `[TBC]` naming what was missing
and who owned it. **That is no longer true.** On explicit user instruction (MEMORY.md
D-60) the gaps are filled with invented placeholder copy and every marker is off the
pages, so the demo reads as a finished site.

Still genuinely missing, and now **invisible** on the page:

- function package tiers, inclusions, capacity, minimum spend — *the page shows invented
  tiers, an invented 120 standing / 70 seated, and invented spends*
- an enquiry email or phone; the only channel the venue actually publishes is an Instagram
  DM — *the page shows an invented address, and a phone number taken from ACMA's reserved
  fictitious range so nobody can dial a demo and reach a real person*
- the venue's own story — *the About page shows two invented paragraphs*
- confirmed trading hours: Sunday's 1 – 6 PM is user-confirmed, but what "late" means on
  Fri & Sat is not, and whether Mon–Thu are closed is not — *the page shows "Private hire
  only", which is an assumption printed as a fact*
- confirmed street address formatting
- drinks-menu transcription sign-off, including seven corrected spellings
- photography publication clearance
- a vector wordmark with per-letter paths, still blocking a true per-letter loader (Q2)

⚠️⚠️ **As of 2026-09-04 the page no longer admits any of this.** The footer's "Demo build"
paragraph — which named exactly which content was invented, and was the one thing on the
site telling a reader not to trust the prices, the capacity or the phone number — was
removed on client instruction, along with the `[TBC]` marker component and its styles. **The
site now states invented prices, capacity, an invented email and an invented phone number
for a real business, with nothing on any page marking them as invented.** This section and
MEMORY.md §5/§6 are the only remaining record. The phone number is in a reserved fictitious
range (D-60), so nobody can dial a stranger; nothing else is mitigated.

The invention is contained: `src/data/packages.ts` is entirely placeholder, and the two
blocks at the foot of `src/data/venue.ts` (`contact`, `story`) are the rest of it. Every
one carries a ⚠ comment. To restore the
honest build, delete `data/packages.ts` and those two blocks and revert
`pages/packages.tsx`, `pages/about.tsx` and `data/faq.tsx`.

`components/ui/Tbc.tsx` is now unused. It is left in the tree for the same reason
`Feature`, `Bento` and `Strip` are — it is correct, and it is the fastest route back.

See `MEMORY.md` §5 and §6.
