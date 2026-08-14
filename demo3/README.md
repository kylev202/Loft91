# demo3 — Nocturne

The third design direction for Loft 91, and the first **multi-page** one. Built on
explicit user instruction: *"each nav will have their own page and the index page will
just show the most stand out and it will links to the according page, you have to use the
picture more wisely."*

`demo/` and `demo2/` are untouched. All three now sit side by side for the client.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview
```

---

## 1. The thesis

**The site is lit the way the room is.** Loft 91 trades Friday and Saturday nights and a
Sunday afternoon, upstairs, above a street you would walk past. Three rules resolve every
argument about a detail:

1. **Brass is a light source, not a colour swatch.** It marks the thing that is lit — the
   current page, the price you came to read, the button that does the commercial job, the
   rule under a page title. There is no second accent hue. The venue's photography supplies
   every other colour on the site.
2. **The photograph is the page's architecture.** Every page opens on one full-bleed frame
   of the real room, chosen because it carries that page's subject. The picture is
   structure, not garnish.
3. **Nothing floats, nothing glows.** Radius 0, zero shadow, zero blur. On a near-black
   page a drop shadow is invisible and a glow is a nightclub flyer. Depth is one step of
   surface tone and a 1px rule.

Why not the previous two: `demo/` is charcoal + white + bone, `demo2/` is warm paper + ink
with no accent hue at all. Both were declined. What they share is that neither page looks
like the venue it describes — `MEMORY.md` §1.2 reads Loft 91 as weekend-only and
night-weighted, and D-01 said exactly this before being reversed. Nocturne is that reading,
rebuilt with an accent that can actually carry text.

## 2. Palette, computed not estimated

| Token | Value | On `--color-page` |
|---|---|---|
| `--color-page` | `#0D0C0A` | — |
| `--color-panel` | `#16140F` | — |
| `--color-ink` | `#F2EFE8` | **17.03:1** |
| `--color-ink-2` | `rgb(242 239 232 / .72)` | **8.95:1** |
| `--color-ink-3` | `rgb(242 239 232 / .55)` | **5.59:1** |
| `--color-ink-4` | `rgb(242 239 232 / .16)` | 1.71:1 — decorative, never text |
| `--color-brass` | `#C9A227` | **8.08:1** |
| `--color-brass-hi` | `#E8C86A` | **12.01:1** |
| `--color-outline` | `rgb(242 239 232 / .40)` | 3.47:1 — clears the 3:1 UI floor |

Page colour on brass (the one solid fill, on the primary CTA) is 8.08:1 the other way round.

## 3. Five documents, not a router

`vite.config.ts` declares five HTML entries. The brief asks for a page per destination and
the honest way to build that on a static host is five real documents: no router library,
each page ships only its own code, every URL is directly crawlable, and the shared
React/GSAP/Lenis chunk is fetched once and served from cache thereafter.

```
/            index.html          home — cover, band, happy hour, four gateways, find us
/menu/       menu/index.html     cover, happy hour, the full drinks list
/packages/   packages/index.html cover, the room, package tiers [TBC], enquiry
/gallery/    gallery/index.html  cover, seven plates as a monograph sequence
/visit/      visit/index.html    cover, hours, getting here, questions
```

Nested paths rather than flat (`menu/index.html`, not `menu.html`) so the built URLs are
`/menu/` on any static host with no rewrite rules to configure.

**Cross-document view transitions** are the one piece of choreography that earns its place:
the cover photograph of the page you leave morphs into the cover of the page you arrive at,
and the nav and footer hold still instead of cross-fading. Entirely declarative
(`@view-transition { navigation: auto }` plus `[data-cover] { view-transition-name: cover }`);
`src/lib/transitions.ts` does one job on top of it — on `pageswap`, hand the `cover` name to
whichever gateway block was actually pressed, so the morph starts from the photograph the
visitor touched. A browser without the feature performs an ordinary navigation and loses
nothing.

## 4. Photography, assigned by subject

| Page | Cover | Why |
|---|---|---|
| Home | `bar-wide` | the backlit ribbed counter and arched marble shelves — this entire palette is sampled from it |
| Menu | `taps` | the tap bank; literally what the page is about, and near-symmetrical so it survives a wide crop |
| Packages | `event` | the room lit for a function — the commercial frame, on the commercial page |
| Gallery | `stair` | the magenta neon arch, the venue's signature |
| Visit | `entrance` | wayfinding: at street level the venue is an unmarked stairwell beside a deli |

The home page's four gateway blocks use **the destination's own cover photograph**, which is
what makes the view transition legible — press the Menu block and that picture expands into
the Menu cover, because it is the same picture.

`bar-wide` gained a missing 2200w tier (identified by perceptual match against the raw set;
`IMG_3393`, MSE 3.1 against 3470 for the runner-up). AVIF/WebP/JPEG at every width; the
largest AVIF is 184 KB, inside the 250 KB per-image budget.

## 5. The cover grade — the one hard problem

Text sits on a photograph on every page, so legibility cannot be asserted, it has to be
measured. The obvious build — one gradient down the cover with a clear window at some fixed
percentage — **cannot work**, and measuring proved it: the cover's type block is
bottom-anchored and sized by its own content, so it spans **46%–88% of the frame at 1440px
but 20%–88% at 320px**. Any fixed window sits under the title at some viewport. Two rounds
of tuning percentages produced "Packages" at 1.89:1 over lit brick and "Finding us" at
1.98:1.

So the grade is anchored to the **content**, not the frame — `.grade-base::before` starts
`4rem` above the content wrapper and completes its ramp `1rem` before the type begins, at
any content height and any viewport. Nothing to re-tune. The same mechanism handles the
gateway captions (`.grade-caption`).

Everything between the nav scrim and the content grade is the photographic window, and it
sizes itself: generous on a desktop, nearly closed on a small phone. That is correct in both
cases.

> ⚠ `z-index: 1` on `.grade-cover::before` / `::after` is load-bearing. GSAP animates
> `scale` on the cover photograph; a transformed element paints as though it created a
> stacking context at z-index 0, which moved it into the positioned layer where DOM order
> decides — so `::before` (which precedes the `<picture>`) was painted **underneath the
> photograph**. The nav scrim silently stopped existing, and only when motion was enabled:
> under `prefers-reduced-motion` GSAP never runs, no transform is set, and the same CSS
> renders correctly. It cost the nav 1.00:1 over the home cover.

## 6. Verified

Measured over HTTP against the real `dist/`, headless Chrome over CDP.

- **Contrast over photography — sampled off the render, not derived.** Type hidden, graded
  photograph screenshotted, the *brightest* pixel inside each text box sampled and
  composited against that text's own computed colour. **220 cover/nav samples and 92
  gateway-caption samples across 5 pages × 5 viewports: 0 failing.** Worst 4.96:1 (an 11px
  nav item over the home cover) and 6.41:1 respectively.
- **Contrast on solid backgrounds:** computed-style sweep of every text node against its
  first opaque ancestor, 12 distinct combinations, 0 failing.
- **Zero horizontal overflow** at 320/360/390/412/768/1024/1280/1440/1920 — checked
  per-element, because `body { overflow-x: hidden }` makes `scrollWidth` lie.
- **Zero touch targets under 44px**, one `<h1>` per page, no console errors, nothing
  stranded at `opacity: 0`, 26 `[TBC]` markers and none bare.
- **Primary CTA above the fold** at 320×640, 360×640, 390×844, 412×915, 768×1024.
- **Keyboard:** 22 focus stops walked on `/visit/`, focus ring visible on every one. Mobile
  overlay is a real dialog — focus trapped, `Esc` closes, focus returns to the trigger, body
  scroll locked and restored.
- **Reduced motion,** end to end on all five pages: no loader, no Lenis, zero running
  animations, no clipped plates, `scroll-behavior: auto`, view transitions resolve instantly.
- **Budget:** JS **112.3–114.1 KB gz** per page against the 120 KB ceiling (shared chunk
  111.6, page-specific 0.7–2.5). CSS **6.2 KB gz** of 30.

**Not verified:** real device, throttled-4G LCP/CLS/INP, sustained 60 fps under load, hover
states (no pointer in headless), and cross-document view transitions in a browser that lacks
them (they are progressive by construction, but the fallback has not been seen).

## 7. What is still missing

Nothing on this site invents a venue fact. Every gap renders as a visible `[TBC]` naming
what is missing and who owns it — 26 of them, mostly on Packages and Visit:

- function package tiers, inclusions, capacity, minimum spend — **all Missing**
- an enquiry email or phone (today the only published channel is an Instagram DM)
- confirmed trading hours, including what "late" means and whether Mon–Thu are closed
- confirmed street address formatting
- drinks-menu transcription sign-off, including seven corrected spellings
- photography publication clearance

See `MEMORY.md` §5 and §6.
