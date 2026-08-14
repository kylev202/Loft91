import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/** One HTML document per destination — this is a multi-page app, not a router.
 *
 *  The brief is "each nav item gets its own page", and the honest way to build
 *  that on a static host is five real documents. It costs no router library, it
 *  means a page ships only its own code, every URL is directly crawlable and
 *  cacheable, and the shared React/GSAP/Lenis chunk is fetched once and then
 *  served from cache on every subsequent navigation.
 *
 *  Nested paths (`menu/index.html`) rather than flat (`menu.html`) so the built
 *  URLs are `/menu/` on any static host, with no rewrite rules to configure. */
const page = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  base: '/',
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
        visit: page('./visit/index.html'),
      },
    },
  },
});
