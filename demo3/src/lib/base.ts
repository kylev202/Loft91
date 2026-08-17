/**
 * base.ts — resolve authored root-absolute paths against the deployment base.
 *
 * Every path in this codebase is authored the way the site reads: `/menu/`,
 * `/img/taps-1600.avif`. That is correct at a domain root and wrong everywhere
 * else — the demo publishes to a GitHub Pages *project* path, where `/menu/` is
 * a 404 and `/Loft91/menu/` is the page.
 *
 * Vite already rebases the URLs it can see statically: `href` and `src` in the
 * HTML documents, and `url()` in CSS. It cannot see a path assembled inside a
 * template literal (`photos.ts`) or handed to a component as a prop, because
 * neither exists until the bundle runs. Those are exactly the paths that come
 * through here.
 *
 * One helper applied at the point a URL is *rendered* — rather than 29 edits to
 * the data and the pages — keeps every authored path base-agnostic, so the same
 * source serves from `/` in `npm run dev` and from `/Loft91/` in production with
 * no branch anywhere.
 */

/** Vite guarantees a leading and a trailing slash: `/` or `/Loft91/`. */
const base = import.meta.env.BASE_URL;

/**
 * Prefix a root-absolute path with the base; pass anything else through.
 *
 * The pass-through is load-bearing, not defensive. `Button` and `Footer` take
 * internal paths, in-page hashes (`#enquire`) and external URLs
 * (`https://instagram.com/…`, the Maps link) through the same `href` prop, so
 * the helper wrapping that prop has to be safe for all three. A hash and an
 * absolute URL are already resolved; only a site-root path needs rebasing.
 */
export function withBase(path: string): string {
  return path.startsWith('/') ? base + path.slice(1) : path;
}

/**
 * The inverse: a real `location.pathname` back to the authored form.
 *
 * `transitions.ts` matches a navigation destination against the `data-cover-for`
 * attributes on the home page. Those attributes stay authored (`/menu/`) so they
 * remain readable logical keys rather than deployment-specific strings, which
 * means the *pathname* is the side that has to be normalised before comparison.
 */
export function stripBase(pathname: string): string {
  return pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
}
