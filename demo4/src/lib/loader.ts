/**
 * Whether the loader is being skipped this visit — decided by the inline script
 * in every page's `<head>`, before any stylesheet or module loads, so a repeat
 * visitor or a reduced-motion user never sees a frame of it.
 *
 * This matters more on a multi-page site than it did on a single-page one: the
 * loader is a *first arrival* moment, and replaying it on every internal
 * navigation would turn the site's best gesture into its most irritating one.
 * The session flag is what makes five documents feel like one visit.
 *
 * Read once, at module scope: it cannot change during a session, and the
 * cover's entrance timing has to agree with the loader's exactly.
 */
export const loaderSkipped = document.documentElement.getAttribute('data-loader') === 'skip';

/** Marks the session so every subsequent page load skips the loader. Called by
    the Loader component on mount — and also when it decides not to render. */
export function markLoaded() {
  try {
    sessionStorage.setItem('l91-loaded', '1');
  } catch {
    // Private browsing, or storage disabled. The loader simply plays again;
    // there is nothing to recover from and nothing to tell the user.
  }
}

/** Loader lift (760ms) + `--dur-short` (280ms), mirroring `--delay-hero`.
    Seconds, for GSAP. */
export const COVER_DELAY = loaderSkipped ? 0 : 1.04;
