# demo2 — Loft 91

The second visual demo, beside `demo/`. Same venue, same facts, same
photographs — a completely different design language, and a real application
build rather than a static page.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck + production build into dist/
npm run preview      # serve dist/
```

`predev` and `prebuild` mirror `assets/img/opt` and `assets/fonts` into
`public/`. **`public/` is generated — never hand-edit it**; edit `assets/` and
re-run. `npm run derive-images` regenerates the AVIF/WebP derivatives in
`assets/img/opt/` from the existing JPEGs.

## The design

**A printed programme.** Warm paper, a precise grid, hairlines, small confident
labels, numbered sections, and the venue's photographs set as plates with
captions — the way a monograph prints colour plates on stock.

Impact comes from scale and from what the page refuses, not from ornament:
the statement is set at up to **9rem** against an 11px label, the hero
photograph runs **edge to edge** as the only element that breaks the shell, and
the footer closes on the wordmark used as an **alpha mask** over the neon
stairwell — the one moment of saturated colour in the whole interface, and it is
the brand rather than a decoration.

Three rules resolve every argument about a detail:

1. **The page has no colour. The room has all of it.** There is no accent hue in
   this system — not one. The photography is intensely coloured (magenta neon on
   the stairs, brass at the bar, a wall-sized screen), and an achromatic page is
   what lets that read as the venue's colour rather than as one more thing
   competing. Emphasis is made by **inverting a whole section to ink**, never by
   tinting something.
2. **The structure whispers; the content speaks.** Section titles are 13px
   labels on a rule. The drinks list, the plates and the hero line are the large
   things. A 6rem section headline announces the furniture.
3. **Nothing floats.** Radius 0, no shadow, no blur, no glow, no grain, no
   parallax, no pinned scroll. Depth is a change of paper tone and a 1px rule.

Two families, four faces, four jobs. **Switzer Medium** is the display face — it
echoes the wordmark's own thin geometric construction. **Zodiak** is the
editorial voice and appears in exactly two places, the section standfirst and
the menu's category names, which is what keeps it feeling like a decision.

This deliberately sets aside `.claude/DESIGN.md`, on explicit instruction — see
`MEMORY.md` **D-40**. What it does *not* set aside, because none of it is a
design instruction: no fabricated venue facts, WCAG AA, keyboard operability,
reduced motion as a first-class mode, mobile-first, and the performance budget.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 8 | Static output, no server needed |
| UI | React 19 + TypeScript | Strict, no `any` |
| Styling | Tailwind CSS v4 | `@theme` **is** the token file — see below |
| Motion | GSAP 3 + `@gsap/react` + ScrollTrigger | `useGSAP` handles StrictMode double-invocation and unmount cleanup |
| Smooth scroll | Lenis | ~3 KB against ScrollSmoother's ~14 KB, and React already spends 60 KB gz |
| Images | sharp (build-time only) | AVIF + WebP derivatives; never shipped to the browser |

## Two mechanisms worth reading

**`src/styles/theme.css` deletes most of the framework.** The
`--namespace-*: initial` lines clear Tailwind's colours, type scale, shadows,
easings, breakpoints and container widths before redeclaring only what this
system sanctions. `bg-blue-500`, `shadow-lg`, `ease-in-out`, `animate-bounce`,
`text-4xl` and the 640px `sm:` tier all compile to nothing — verified against the
built CSS, not asserted. Tailwind's own `--default-transition-timing-function`
(an ease-in-out) and `--default-font-family` (a system stack) are re-pointed at
tokens, so the sanctioned values are what you get by forgetting.

> ⚠ One trap this creates, documented rather than hidden: the named spacing steps
> share Tailwind's t-shirt naming, and `max-w-*` resolves from `--container-*`
> first and spacing second. With the container scale cleared, `max-w-md` would
> silently mean 24px. Every width here is named for what it is — `max-w-narrow`,
> `max-w-measure`, `max-w-shell`.

**`.on-ink` in `src/styles/base.css`** is how a section inverts. It re-declares
the semantic tokens inside its own scope; because every Tailwind utility compiles
to `var(--color-ink)` and friends, the whole subtree flips with no markup change
and no second set of classes.

## Layout

```
src/
├─ data/        venue.ts · menu.ts · photos.ts   — every fact, once
├─ styles/      fonts.css · theme.css · base.css
├─ lib/         gsap.ts (plugin registration) · loader.ts (session gate)
├─ hooks/       useMediaQuery · useSmoothScroll · useReveal
└─ components/  Loader · Nav · Hero · Band · Menu · Packages · Gallery · Faq · Visit · Footer
   └─ ui/       Anchor · Button · Plate · SectionHead · Tbc
```

Nothing in `components/` writes a venue fact. Hours, address, prices and links
come from `data/`, so the hero and the Visit table cannot drift apart.

## Status

Demo. Not production. See `.claude/MEMORY.md` §6 — the drinks transcription, the
trading hours, the street address and every package tier are still unconfirmed,
and each is marked in the UI with a visible `[TBC]` naming what is missing and
who owns it. `grep -r '\[TBC\]' dist/` must return zero before this can ship.
