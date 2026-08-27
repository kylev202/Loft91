/**
 * transitions.ts — hand the `cover` view-transition name to the right element
 * before a cross-document navigation.
 *
 * The CSS in base.css does almost all of this on its own: `@view-transition {
 * navigation: auto }` plus `[data-cover] { view-transition-name: cover }` is
 * already enough for the cover photograph of one page to morph into the cover
 * of the next. This file exists for one case that CSS cannot express.
 *
 * On the home page there are two candidates for the same name: the page's own
 * cover, and the section photograph depicting where the visitor is going — the
 * tap bank in the Menu section, the lit room in Packages, the doorway in Visit.
 * A view-transition name must be unique in a document — two elements claiming
 * `cover` makes the browser skip the transition entirely — so exactly one of
 * them can hold it, and which one depends on where the visitor is going and on
 * what is actually on screen when they go.
 *
 * Runs on `pageswap`, which fires on the outgoing document once the destination
 * is known and before the snapshot is taken — the one moment where that is
 * decidable. Everything here is progressive: a browser without cross-document
 * view transitions never fires the event and performs an ordinary navigation.
 */

import { stripBase } from './base';

/** Not in the DOM lib yet; only the two fields this file reads are declared. */
interface PageSwapEventLike extends Event {
  readonly viewTransition: ViewTransition | null;
  readonly activation: { readonly entry: { readonly url: string } } | null;
}

export function initTransitions() {
  if (!('onpageswap' in window)) return;

  window.addEventListener('pageswap', (event) => {
    const { viewTransition, activation } = event as PageSwapEventLike;
    // No transition means an ordinary navigation (cross-origin, a download, a
    // reload) — leave the DOM exactly as it is.
    if (!viewTransition || !activation) return;

    // `stripBase` because `data-cover-for` is authored as the site-root path
    // (`/menu/`) while the real pathname carries the deployment base — on GitHub
    // Pages the destination is `/Loft91/menu/`, which matches no card, and every
    // home-page morph would silently fall back to the page's own cover.
    const destination = stripBase(new URL(activation.entry.url, location.href).pathname);
    const card = document.querySelector<HTMLElement>(
      `[data-cover-for="${CSS.escape(destination)}"]`,
    );
    // Nothing on this page depicts where we are going — the page's own cover
    // keeps the name, which is the right answer for every nav-driven move.
    if (!card) return;

    // …and so is the page's own cover when the matching photograph is off
    // screen. The home page is a long scroll now, and the nav reaches every
    // destination from anywhere on it: handing the name to a picture nobody can
    // see makes the next cover grow out of an empty patch of page, or out of a
    // plate still shut at `clip-path: inset(46% 0 46% 0)` waiting for its
    // reveal — which is a morph out of a slot.
    const box = card.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= window.innerHeight) return;

    document
      .querySelectorAll<HTMLElement>('[data-cover]')
      .forEach((el) => (el.style.viewTransitionName = 'none'));
    card.style.viewTransitionName = 'cover';
  });
}
