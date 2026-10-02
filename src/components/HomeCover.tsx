import { CoverFrame } from '../shell/Cover';
import { home } from '../data/site';

/**
 * The home hero: the venue's own backlit counter at full bleed, one hairline
 * beneath it, and nothing else.
 *
 * ── What this component used to be, and why it is not ────────────────────
 * Three client instructions, each one a subtraction, in the order they came:
 *
 *   1. The fact row went — trading hours, the street, "See the menu" and the
 *      primary "Enquire about functions" button (D-57).
 *   2. The headline went — "An upstairs bar in Footscray.", the display serif
 *      at up to 76px, the largest type on the site (D-58).
 *   3. **The wordmark lockup went** (D-59) — the 260px black artwork that sat
 *      under the photograph as the page's signature.
 *
 * What is left is the photograph and the system's one ornament. That is a
 * legitimate destination for this design rather than an accident of three
 * deletions: the reference language is image-led, and a cover that runs a
 * photograph edge to edge, stops, and draws a single line before the wall of
 * frames is the quietest version of it.
 *
 * ── Two things this raises, both answered here ───────────────────────────
 * **The brief asked the homepage to "clearly show their branding"**
 * (MEMORY.md §3.1), and the lockup was the answer to it. The mark has not left
 * the site — it is in the running head at the top of every page, which is also
 * the home link, and the footer closes every page on the same artwork used as
 * an alpha mask over the neon stairwell. But it is no longer the landing page's
 * own statement, and that is a real move away from §3.1 rather than a neutral
 * one. It is four lines to put back.
 *
 * **The page needed an `h1` that is not an image.** Removing the lockup removed
 * the only heading on the document. Rather than leave the landing page with no
 * `h1` at all, the page title is carried here as screen-reader-only text — the
 * same string as `<title>`, from `site.ts`, so the two cannot drift. Nothing
 * about the visible page changes; a screen reader gets "Loft 91 — an upstairs
 * bar & function space in Footscray", then the four destinations.
 */
export function HomeCover() {
  return (
    <CoverFrame photo={home.photo} tall>
      <h1 className="sr-only">{home.title}</h1>

      {/* `.rule-ink` rather than `h-px bg-ink`: routing the system's one
          ornament through the component class is what lets the forced-colours
          repair in base.css reach it. Drawn with nothing but a background
          colour it would be forced to the system background and become the page
          drawn on the page — and on this document it is now the only thing
          between the photograph and the frames. */}
      <div className="rule-ink w-full" data-cover-rule />
    </CoverFrame>
  );
}
