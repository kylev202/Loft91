import { mount } from '../lib/mount';
import { HomeCover } from '../components/HomeCover';
import { Gateways } from '../components/Gateways';

/**
 * The index page: the hero, then four frames. That is the whole document.
 *
 * ── The reduction ────────────────────────────────────────────────────────
 * On client instruction: minimise the landing page, four gallery images
 * linking to the four pages, a small caption under each, as little text as
 * possible, symmetrical picture frames.
 *
 * So the five condensed sections that used to run beneath the grid — Menu with
 * the happy-hour panel, Packages with the block grid, the gallery strip, the
 * three standout questions, and Visit with the hours and the doorway — are
 * **removed from this page**. None of that content is deleted or weakened: each
 * section was already a condensed preview of a document that carries the same
 * material in full, and the previews were the thing the client asked to lose.
 *
 * Where each one now lives, so nothing here is taken on trust:
 *
 *   Happy hour, drinks       `/menu/`
 *   The room, packages       `/packages/`
 *   The eight frames         `/gallery/`
 *   The questions            `/faq/` — reached from the footer index on every
 *                            page, and from About us
 *   Hours                    the footer, on every page — the notice strip
 *                            that carried them above the nav is gone (D-62)
 *   Address, the doorway     `/about/`, and the footer on every page
 *   Enquire                  the nav on desktop, the menu overlay on a phone,
 *                            the footer, and `/enquire/` — its own document
 *                            since the form was built
 *
 * Two of those are worth stating plainly rather than burying: the landing page
 * no longer carries a call to action of its own, and it no longer prints the
 * hours in its own body — both are one element away rather than absent, but
 * both are a real reduction in prominence and both are a one-line reversal if
 * the client wants them back.
 *
 * The components those sections used (`Feature`, `HappyHourPanel`, `Bento`,
 * `Strip`) are left in the tree rather than deleted. They are correct, they are
 * the fastest route back if any of this is reinstated, and removing them is a
 * separate decision from the one the client actually made.
 */

mount(
  'home',
  <>
    <HomeCover />
    <Gateways />
  </>,
);
