# archive

The three superseded design directions for Loft 91. Each was moved here when a later one
replaced it; **none was modified in the move** — same files, same git history, only a new
path.

| Folder | Direction | Stack | Status |
|---|---|---|---|
| `demo/` | Charcoal + white + bone. Full-height sidebar nav, single page, anchored sections. | Zero dependencies — plain HTML + CSS + ES5, no build step (D-10). Open `index.html` directly. | Declined |
| `demo2/` | Warm paper + ink, **no accent hue at all**. One inverted ink block for emphasis, editorial type. | Vite + React 19 + Tailwind v4 + GSAP + Lenis. `npm install && npm run dev`. | Declined |
| `demo3/` | **Nocturne.** Deep warm near-black, brass as the single accent. Six real documents, one per nav destination. Page titles set into the foot of each cover photograph. | Vite + React 19 + Tailwind v4 + GSAP + Lenis. `npm install && npm run dev`. | Superseded by `demo4/` |

`demo/` and `demo2/` were declined for the same reason, and it is worth keeping written
down because it is the argument `demo3/` was built on: neither page looked like the venue it
describes. `MEMORY.md` §1.2 reads Loft 91 as weekend-only and night-weighted, and a charcoal
page and a warm-paper page are both daytime rooms. See D-44.

`demo3/` was **not** declined on that argument, and this is worth being precise about: it was
reset on explicit user instruction to rebuild the site in the visual language of a supplied
reference site, which is warm white with no accent hue — the exact inverse of Nocturne. The
night-weighted reading in §1.2 was never refuted; it simply is not what was asked for. If the
dark direction is ever revisited, `demo3/` is the built form of it and D-44/D-01 are the
argument. See D-56.

**These are history, not references.** The decision log in `.claude/MEMORY.md` (D-10, D-35,
D-36, D-40 … D-44, D-56) is the authority on what each one decided and why — read that
rather than reverse-engineering it from the code here. Source comments in `demo4/` that
mention `demo/`, `demo2/` and `demo3/` are citing those *designs*, not these paths.

Nothing in `demo4/` imports from this folder, and its build does not read it.
