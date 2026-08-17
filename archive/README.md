# archive

The two superseded design directions for Loft 91. Moved here when `demo3/` was chosen as
the one to carry forward; **neither was modified in the move** — same files, same git
history, only a new path.

| Folder | Direction | Stack | Status |
|---|---|---|---|
| `demo/` | Charcoal + white + bone. Full-height sidebar nav, single page, anchored sections. | Zero dependencies — plain HTML + CSS + ES5, no build step (D-10). Open `index.html` directly. | Declined |
| `demo2/` | Warm paper + ink, **no accent hue at all**. One inverted ink block for emphasis, editorial type. | Vite + React 19 + Tailwind v4 + GSAP + Lenis. `npm install && npm run dev`. | Declined |

Both were declined for the same reason, and it is worth keeping written down because it is
the argument `demo3/` is built on: neither page looked like the venue it describes.
`MEMORY.md` §1.2 reads Loft 91 as weekend-only and night-weighted, and a charcoal page and
a warm-paper page are both daytime rooms. See D-44.

**These are history, not references.** The decision log in `.claude/MEMORY.md` (D-10, D-35,
D-36, D-40 … D-43) is the authority on what each one decided and why — read that rather
than reverse-engineering it from the code here. Source comments in `demo3/` that mention
`demo/` and `demo2/` are citing those *designs*, not these paths.

Nothing in `demo3/` imports from this folder, and its build does not read it.
