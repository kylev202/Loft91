/**
 * derive-images.mjs — add AVIF and WebP derivatives beside the existing JPEGs.
 *
 * `assets/img/opt/*.jpg` (MEMORY.md D-21) is JPEG-only, and six of the frames
 * are over the DESIGN.md §11 per-image budget of 250 KB — taps-1600 is 506 KB.
 * On the real arrival path (an Instagram bio link, a phone, mobile data) that is
 * the single largest thing the site spends.
 *
 * Derives from the existing optimised JPEGs rather than the raw phone files on
 * purpose: those already carry D-21's per-file EXIF-orientation work baked into
 * the pixels, and re-deriving from raw would mean redoing that analysis.
 *
 * Idempotent. Run from demo2: `npm run derive-images`.
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const optDir = resolve(here, '../../assets/img/opt');

const AVIF = { quality: 50, effort: 6, chromaSubsampling: '4:2:0' };
const WEBP = { quality: 76, effort: 6 };

const files = (await readdir(optDir)).filter((f) => f.endsWith('.jpg'));

// Group `taps-800.jpg` / `taps-1600.jpg` into { taps: [800, 1600] } so each
// derivative is downscaled from the largest source rather than re-upscaled.
const families = new Map();
for (const f of files) {
  const m = /^(.+)-(\d+)\.jpg$/.exec(f);
  if (!m) continue;
  const [, name, width] = m;
  if (!families.has(name)) families.set(name, []);
  families.get(name).push(Number(width));
}

const rows = [];
for (const [name, widths] of [...families].sort()) {
  widths.sort((a, b) => a - b);
  const source = join(optDir, `${name}-${widths.at(-1)}.jpg`);
  for (const width of widths) {
    for (const [ext, opts] of [
      ['avif', AVIF],
      ['webp', WEBP],
    ]) {
      const out = join(optDir, `${name}-${width}.${ext}`);
      await sharp(source).resize({ width, withoutEnlargement: true })[ext](opts).toFile(out);
      rows.push([`${name}-${width}.${ext}`, (await stat(out)).size]);
    }
    rows.push([
      `${name}-${width}.jpg`,
      (await stat(join(optDir, `${name}-${width}.jpg`))).size,
    ]);
  }
}

rows.sort((a, b) => b[1] - a[1]);
const over = rows.filter(([, size]) => size > 250 * 1024);
await writeFile(
  join(optDir, 'SIZES.txt'),
  rows.map(([f, s]) => `${String(Math.round(s / 1024)).padStart(5)} KB  ${f}`).join('\n') + '\n',
  'utf8',
);
console.log(`derive-images: ${rows.length} files, largest ${Math.round(rows[0][1] / 1024)} KB`);
console.log(
  over.length
    ? `over the 250 KB §11 budget (JPEG fallbacks only, not what modern browsers fetch):\n` +
        over.map(([f, s]) => `  ${Math.round(s / 1024)} KB  ${f}`).join('\n')
    : 'every file inside the 250 KB §11 budget',
);
