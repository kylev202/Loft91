/**
 * Whether the loader is being skipped this visit — decided by the inline script
 * in `index.html`, before any stylesheet or module loads, so a repeat visitor or
 * a reduced-motion user never sees a frame of it.
 *
 * Read once, at module scope: it cannot change during a session, and the hero's
 * entrance timing has to agree with the loader's exactly.
 */
export const loaderSkipped = document.documentElement.getAttribute('data-loader') === 'skip';

/** Loader lift (820ms) + `--dur-short` (260ms). Seconds, for GSAP. */
export const HERO_DELAY = loaderSkipped ? 0 : 1.08;
