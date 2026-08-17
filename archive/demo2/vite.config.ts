import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Served from its own root (`npm run preview`, or any static host pointed at
  // `dist/`). Kept absolute so the `public/` font and image URLs written into the
  // CSS resolve; revisit if a host requires a sub-path (MEMORY.md Q7 is open).
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // The §11 budget is measured on the real output, so keep the report honest.
    reportCompressedSize: true,
  },
});
