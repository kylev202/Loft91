import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/** One HTML document per destination — this is a multi-page app, not a router.
 *
 *  The brief is "each nav item gets its own page", and the honest way to build
 *  that on a static host is a real document each. There are eight now — the six
 *  the brief asked for, plus `/enquire/` and the venue-only `/admin/` board.
 *  It costs no router library, it
 *  means a page ships only its own code, every URL is directly crawlable and
 *  cacheable, and the shared React/GSAP/Lenis chunk is fetched once and then
 *  served from cache on every subsequent navigation.
 *
 *  Nested paths (`menu/index.html`) rather than flat (`menu.html`) so the built
 *  URLs are `/menu/` on any static host, with no rewrite rules to configure. */
const page = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** Where the site is served from. `/` locally; the deploy workflow passes the
 *  GitHub Pages project path (`/Loft91/`) so the built URLs resolve there.
 *
 *  Set from the environment rather than hardcoded because the two differ and
 *  `npm run dev` should not have to know about the host. Normalised to a
 *  trailing slash — `actions/configure-pages` reports the path without one, and
 *  `import.meta.env.BASE_URL` is read in `lib/base.ts` on the assumption that it
 *  ends in a separator. */
const rawBase = process.env.BASE_PATH || '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    // The §11 budget is measured on the real output, so keep the report honest.
    reportCompressedSize: true,
    rollupOptions: {
      input: {
        home: page('./index.html'),
        menu: page('./menu/index.html'),
        packages: page('./packages/index.html'),
        gallery: page('./gallery/index.html'),
        about: page('./about/index.html'),
        // Not a nav destination — reached from the home page's FAQ heading,
        // from About us, and from the footer index. Still a real document.
        faq: page('./faq/index.html'),
        // Also not a nav destination: the target of every "Enquire" button on
        // the site, and listed in the footer index.
        enquire: page('./enquire/index.html'),
        // The venue's own board. Deliberately not in the nav, not in the footer
        // index and `noindex` in its own head — see `src/pages/admin.tsx`. It is
        // built because it has to be reachable by URL, not because it is part
        // of the site.
        admin: page('./admin/index.html'),
      },
    },
  },
});
