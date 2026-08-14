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
 * cover, and the gateway block the visitor just pressed. A view-transition name
 * must be unique in a document — two elements claiming `cover` makes the
 * browser skip the transition entirely — so exactly one of them can hold it,
 * and which one depends on where the visitor is going. Pressing the Menu block
 * should expand *that photograph* into the Menu cover; using the nav instead
 * should carry the cover already on screen.
 *
 * Runs on `pageswap`, which fires on the outgoing document once the destination
 * is known and before the snapshot is taken — the one moment where that is
 * decidable. Everything here is progressive: a browser without cross-document
 * view transitions never fires the event and performs an ordinary navigation.
 */

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

    const destination = new URL(activation.entry.url, location.href).pathname;
    const card = document.querySelector<HTMLElement>(
      `[data-cover-for="${CSS.escape(destination)}"]`,
    );
    // Nothing on this page depicts where we are going — the page's own cover
    // keeps the name, which is the right answer for every nav-driven move.
    if (!card) return;

    document
      .querySelectorAll<HTMLElement>('[data-cover]')
      .forEach((el) => (el.style.viewTransitionName = 'none'));
    card.style.viewTransitionName = 'cover';
  });
}
