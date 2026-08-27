/**
 * sync-assets.mjs — mirror the generated asset derivatives into demo3/public.
 *
 * `assets/` at the repo root stays the single source (CLAUDE.md §5). This copies
 * only the *generated* derivatives — the optimised images and the vendored woff2
 * faces — into Vite's publicDir so they get stable, un-hashed URLs.
 *
 * Deliberately NOT `publicDir: '../assets'`: that would serve the 30 MB of raw
 * phone JPEGs and copy every one of them into `dist/` on build.
 *
 * `demo3/public/` is generated output. Never hand-edit it; edit `assets/` and
 * re-run. Runs automatically before `dev` and `build`.
 */
import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoAssets = resolve(here, '../../assets');
const publicDir = resolve(here, '../public');

const pairs = [
  [resolve(repoAssets, 'img/opt'), resolve(publicDir, 'img')],
  [resolve(repoAssets, 'fonts'), resolve(publicDir, 'fonts')],
];

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });
for (const [from, to] of pairs) await cp(from, to, { recursive: true });

console.log('sync-assets: assets/img/opt + assets/fonts -> demo3/public');
