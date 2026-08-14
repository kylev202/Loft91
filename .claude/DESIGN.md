# DESIGN.md — The Loft 91 Design System

> **Role in the system:** the design constitution for this website. It teaches the
> theme, the principles, the tokens and the motion grammar, and it is derived from
> `.claude/skills/` — the design skill library — rather than invented ad hoc.
>
> **Who reads this:** the **Planner** loads it before writing any plan; the **Executor**
> obeys it while building; the **Validator** audits against it. See `AGENT.md`.
>
> **Depends on:** `MEMORY.md` §1–§3 (venue facts and brief). If a fact here contradicts
> `MEMORY.md`, `MEMORY.md` wins and this file gets corrected.
>
> **Last updated:** 2026-08-09 (rev 3 — bright theme, vertical rail, centred hero; see
> `MEMORY.md` D-13/D-14) · **Status:** DRAFT — a proposed direction, not yet confirmed.
>
> **Demo-phase hold (2026-08-09, `CLAUDE.md` §2.2):** the client hasn't confirmed a design
> layout yet — the live work is the visual demo in `demo/`. Until that confirmation
> happens, this document is a reference, not a gate: the Planner does not need to load it
> before touching `demo/`, the Executor is not bound by its tokens or §9 banned defaults
> there, and the Validator does not fail a demo build against it. It becomes binding — and
> gets corrected to match whatever layout is actually confirmed — only once the user signs
> off on a direction and asks for it to be updated.

---

## 1. Skill routing — which skills govern this project, and how they stack

`.claude/skills/CLAUDE.md` sets the operating rule: **classify the task, pick ONE primary
skill, read its full `SKILL.md`, follow its constraints over your defaults, then layer a
review skill.** Loading five overlapping taste skills makes them contradict each other.

This project's stack is fixed as follows. Do not re-litigate it per task.

| Layer | Skill | Path | Why this one |
|---|---|---|---|
| **Driver** (one only) | `high-end-visual-design` | `.claude/skills/core-design/high-end-visual-design/SKILL.md` | Its "Absolute Zero" banned-defaults ruleset and motion choreography are exactly what stops a bar site reading as a template. Its **Vibe Archetype** for this build is locked (§2). |
| **Discipline overlay** | `minimalist-ui` | `.claude/skills/styles/minimalist-ui/SKILL.md` | The brief says *minimalism*. This supplies restraint: hairlines, macro-whitespace, scarce colour, flat architecture. Since D-13 its warm-white canvas is used as-is — see §1.1. |
| **Motion — foundation** | `gsap-core`, `gsap-timeline` | `.claude/skills/motion/gsap-core/`, `…/gsap-timeline/` | Tween/timeline primitives for the loader and section reveals. |
| **Motion — scroll** | `gsap-scrolltrigger`, `gsap-plugins` | `.claude/skills/motion/gsap-scrolltrigger/`, `…/gsap-plugins/` | ScrollTrigger for reveals/pinning; `gsap-plugins` §ScrollSmoother for R2 smooth scrolling and SplitText for the wordmark. |
| **Motion — judgement** | `emil-design-eng` | `.claude/skills/motion/emil-design-eng/SKILL.md` | Read **before** deciding whether a thing should animate at all. Motion here must be scarce and load-bearing. |
| **Motion — perf** | `gsap-performance` | `.claude/skills/motion/gsap-performance/SKILL.md` | Consulted when frame budget (§11) is at risk. |
| **Reference (lookup)** | `ui-ux-pro-max` | `.claude/skills/core-design/ui-ux-pro-max/` | Palettes, font pairings, UX rules, dark-mode contrast guidance. A database, **not** a workflow — pull from it, don't let it drive. |
| **Review gate — motion** | `review-animations` | `.claude/skills/motion/review-animations/SKILL.md` + `STANDARDS.md` | Validator runs this over all animation code. |
| **Review gate — UI** | `web-design-guidelines` | `.claude/skills/core-design/web-design-guidelines/SKILL.md` | Validator runs this for layout / a11y / typography compliance. |
| **Review gate — taste** | `critique` | `.claude/skills/core-design/critique/SKILL.md` | Validator's 5-dimension scoring gate on rendered output. |

**Explicitly not used, and why** — recorded so no one loads them mid-build and creates a
contradiction: `impeccable` and `design-taste-frontend` (both full taste drivers; would
fight `high-end-visual-design` — one driver only); `industrial-brutalist-ui` (wrong
aesthetic); `templates/saas-landing` and siblings (this is a venue, not a SaaS product —
a template would produce exactly the genericism R1 forbids); `_archive/` (never load).

### 1.1 Where a skill is overridden

`minimalist-ui` mandates a warm-white canvas (`#FFFFFF` / `#F7F6F3`) and off-black text.
**Since D-13 this project follows it.** We take the overlay's *discipline* — scarce colour,
1px hairlines, macro-whitespace, flat components, no gradients-as-decoration,
IntersectionObserver-driven reveals — *and* its canvas, and keep only the **Editorial
Luxury** texture from `high-end-visual-design` (paper grain, serif display). Two of the
four overrides below retired as a direct result: the system now fights its own overlay in
fewer places than it did when the canvas was dark.

**The override register.** Every deviation from a loaded skill is listed here. If it is not
in this table, it is not sanctioned — record it as a decision in `MEMORY.md` §4 *before*
it is built (`AGENT.md` §7.2).

| # | Skill rule overridden | This project does | Why |
|---|---|---|---|
| ~~**O-1**~~ | ~~`minimalist-ui` §4 — warm-white canvas, off-black text~~ | **RETIRED 2026-08-09 (D-13).** We now use the skill's own canvas | The bright direction removed the override entirely. The discipline overlay and the canvas finally agree |
| **O-2** | `minimalist-ui` §6 — Phosphor **Bold/Fill** icons | Phosphor **Light** / Remix Line | Direct contradiction with `high-end-visual-design` §2, which bans thick strokes. Driver skill wins; a bold icon on a hairline-driven layout reads as clip-art |
| ~~**O-3**~~ | ~~`minimalist-ui` §7 — hover lift via `box-shadow 0 2px 8px rgba(0,0,0,0.04)`~~ | **RETIRED 2026-08-09 (D-13).** The skill's hover lift is restored via `--l91-shadow` | The no-shadow rule existed only because a shadow is invisible on black. On a bright canvas depth *is* occlusion |
| **O-4** | `minimalist-ui` §6 — `picsum.photos` placeholders when assets are unavailable | Never. `[TBC]` markers holding real dimensions (§7.8) | `MEMORY.md` D-05: a stock interior on a real venue's site misrepresents the room |

`high-end-visual-design`'s Variance Mandate is also deliberately suspended — see §2.

---

## 2. The design thesis

> **An upstairs room, in daylight.** Warm off-black type on a warm-white page, set like
> a printed bar list rather than a webpage. The site is quiet, wide-tracked and unhurried
> — it reveals itself as you descend through it, exactly like climbing the stairs.

> ⚠️ **Revised 2026-08-09 (`MEMORY.md` D-13).** This thesis previously read *"after dark"*
> and the whole system was dark-native. The client direction is now bright. Recorded
> plainly because it is a real tension, not a neutral swap: `MEMORY.md` §1.2 reads the
> venue as weekend-only and night-weighted, and the dark canvas was *derived* from that.
> The bright system is executed properly on its own terms below — but it no longer argues
> the venue's case, it argues an aesthetic one.

Three principles that resolve every disagreement about a detail:

1. **The page is paper, the ink is the content.** Nothing is "placed on a background."
   Type, images and hairlines sit *on* the page. If a section needs a box to look
   designed, the composition is wrong.
2. **Restraint is the luxury signal.** One accent colour, two type families, one motion
   grammar, one radius scale. Every additional element must displace an existing one.
3. **The room is the hero, not the layout.** Once photography lands, the interface's job
   is to get out of its way. Structure serves the venue; it never performs on its own.

**Vibe Archetype (locked):** Editorial Luxury (paper grain, serif display). The Ethereal
Glass base retired with the dark canvas (D-13).
**Layout Archetype (locked):** *The Editorial Split* — massive type on one side,
imagery/content on the other — as the recurring section pattern, with the Asymmetrical
Bento reserved for Packages only. Locking these is a deliberate departure from
`high-end-visual-design`'s Variance Mandate (which prevents repetition *across* projects);
**within one site, consistency outranks variance** — that is requirement R9.
Which section gets which archetype, and at which ratio, is fixed in the **§7 archetype
map** — "recurring" is not a checkable claim until it names sections.

---

## 3. Colour system

Bright-native since D-13. Every value below was recomputed from scratch against the new
canvas rather than algebraically flipped — the accent in particular had to *change hue
depth*, not merely invert, to stay legal (see the brass note).

```css
:root {
  /* Canvas — warm white. minimalist-ui §4's own canvas, no longer overridden. */
  --l91-void:        #F7F6F3;   /* page canvas                            */
  --l91-surface:     #FFFFFF;   /* raised surface: cards                  */
  --l91-surface-hi:  #EFEDE7;   /* hover / active surface                 */

  /* Ink — warm off-black. Never pure #000000.
     Levels 1–3 are AA-safe for text at ANY size, including 11px Signal,
     on BOTH the canvas and the white surface. Level 4 is never text. */
  --l91-ink:         #14120E;                  /* primary type   17.31:1 */
  --l91-ink-2:       rgba(20, 18, 14, 0.78);   /* secondary/body  8.97:1 */
  --l91-ink-3:       rgba(20, 18, 14, 0.62);   /* meta, Signal    5.10:1 */
  --l91-ink-4:       rgba(20, 18, 14, 0.14);   /* decorative      1.34:1 */

  /* Structure — hairlines, never solid grey borders */
  --l91-rule:        rgba(20, 18, 14, 0.12);
  --l91-rule-strong: rgba(20, 18, 14, 0.22);

  /* Accent — a single warm brass, DEEPENED for the bright canvas (D-13).
     The dark theme's #C8A46A computes to 2.17:1 here and cannot legally
     carry text or a solid CTA. Scarce by contract: see budget below. */
  --l91-brass:       #7E5F22;
  --l91-brass-dim:   rgba(126, 95, 34, 0.55);
  --l91-brass-wash:  rgba(126, 95, 34, 0.08);  /* focus halo, ambient wash */

  /* Elevation — occlusion, not light (O-3 retired). Far under the §9 ceiling. */
  --l91-shadow:      0 2px 8px rgba(20, 18, 14, 0.06);

  /* Focus — must be visible against both canvas and imagery */
  --l91-focus:       #6F5320;
}
```

**Accent budget — hard rule.** `--l91-brass` may occupy at most **three *roles* per
viewport**: (1) the active nav indicator, (2) one primary CTA, (3) section numerals and
rules. A role may repeat — eight menu-category rules are one role, not eight hits. A
*fourth role* is the failure. If one appears, delete a role, don't shrink it. Colour is a
scarce resource (`minimalist-ui` §4); brass everywhere is how a premium palette becomes a
cheap one.

**Contrast — computed, not estimated.** Ratios against `--l91-void` (`#F7F6F3`), alpha
composited before measuring:

| Pair | Ratio | WCAG 2.2 AA use |
|---|---|---|
| `--l91-ink` on `--l91-void` | 17.31:1 | ✅ any size |
| `--l91-ink-2` on `--l91-void` | 8.97:1 | ✅ any size |
| `--l91-ink-3` on `--l91-void` | 5.10:1 | ✅ any size, **including 11px Signal** |
| `--l91-ink-4` on `--l91-void` | 1.34:1 | ❌ decorative only — never text, never a focus ring |
| `--l91-brass` on `--l91-void` | 5.48:1 | ✅ any size |
| `--l91-void` on `--l91-brass` (solid CTA) | 5.48:1 | ✅ any size |
| `--l91-focus` on `--l91-void` | 6.62:1 | ✅ focus ring |

> **Why level 3 is `0.52` and not `0.42`.** At `0.42` it computes to **3.67:1** — below the
> 4.5:1 floor. §7.2 sets the trading hours in 11px Signal type; at the old value the
> venue's opening times would have shipped as a WCAG failure on the one line the site
> exists to deliver. The ramp was rebalanced (`0.64 → 0.72`, `0.42 → 0.52`) so all three
> text levels clear AA at any size **and** stay visually separated. This removes the
> "large text only" tier entirely — a conditional contrast rule is a rule that gets broken.

The Validator recomputes these from the shipped CSS rather than reading this table
(`AGENT.md` §4.3). Text over photography must carry a scrim — see §7.5.

**Platform colour declarations** (both required, both one line, both routinely forgotten on
dark-native builds — `web-design-guidelines` §Dark Mode & Theming):

```css
html { color-scheme: light; }           /* native scrollbars, form controls, caret */
```
```html
<meta name="theme-color" content="#F7F6F3">   <!-- mobile browser chrome matches the canvas -->
```

**Banned in colour:** primary-coloured section backgrounds; multi-stop decorative
gradients; neon; any second accent hue; pure `#000000` canvas (kills the warmth and
crushes photo shadows); pure `#FFFFFF` type.

---

## 4. Typography

The brief asks for professional fonts *in combination* (R5). Three voices, strictly
separated by job. Zero banned families: **Inter, Roboto, Arial, Open Sans, Helvetica are
prohibited** (`high-end-visual-design` §2 and `minimalist-ui` §2).

| Voice | Family | Fallback stack | Job |
|---|---|---|---|
| **Display** | **Zodiak** (Indian Type Foundry / Fontshare) | `'Zodiak', 'Instrument Serif', 'Newsreader', Georgia, serif` | Hero statement, section headlines, pull quotes. Light/Regular only, tight tracking (`-0.02em`), tight leading (`1.05`). |
| **Interface** | **Switzer** (Fontshare) | `'Switzer', 'Geist Sans', 'Cabinet Grotesk', system-ui, sans-serif` | Body, nav, buttons, menu items, all UI. |
| **Signal** | **Switzer** — uppercase, `300`, `letter-spacing: 0.28em` | as above | Eyebrows, section labels, hours, tags. **This is the wordmark's voice** — it echoes the logo's thin, wide-tracked geometry and is what stitches the whole site to the brand. |

Serif display against a wide-tracked geometric signal type is the "combination" R5 asks
for: high contrast in form, unified in temperature.

> **Before implementation:** confirm licence terms and self-host (`MEMORY.md` D-06). Both
> families are free for commercial use via Fontshare at time of writing — *verify at build
> time, do not assume.* If either is unavailable, substitute within the same fallback
> stack and record it as a decision.

### 4.1 Scale — fluid, `clamp()`-based

Families are tokens too — the table above is the decision, this is the single declaration.
Nothing else in the codebase may name a font family.

```css
--font-display:   'Zodiak', 'Zodiak Fallback', 'Instrument Serif', Georgia, serif;
--font-interface: 'Switzer', 'Switzer Fallback', 'Cabinet Grotesk', system-ui, sans-serif;
/* Signal is --font-interface at 300 / uppercase / 0.28em — a style, not a family */
```

```css
--fs-display: clamp(3.25rem, 9vw, 8.5rem);    /* hero wordline           */
--fs-h1:      clamp(2.25rem, 5.5vw, 4.5rem);  /* section headline        */
--fs-h2:      clamp(1.5rem, 2.6vw, 2.25rem);  /* sub-head                */
--fs-lead:    clamp(1.05rem, 1.4vw, 1.375rem);/* intro paragraph         */
--fs-body:    1rem;                            /* 16px floor — never below */
--fs-small:   0.875rem;
--fs-signal:  0.6875rem;                       /* 11px, uppercase, 0.28em */
```

**Rules.** Body line-height `1.6`, display `1.05`, sub-heads `1.25`. Measure capped at
`68ch` (`max-width: 68ch`) — long lines are the fastest way to look unprofessional.
Never set body text below `16px` (mobile zoom trigger). Never justify. Never set display
type in the interface family or vice versa. Hyphenation off for display, `auto` for body.

### 4.2 Microtypography — the editorial tell

A serif display face on a black canvas invites scrutiny of exactly these details, and they
are the cheapest quality signal on the site (`web-design-guidelines` §Typography).

- **`…` not `...`** · **curly quotes `“ ” ’` not `" '`** · **en dash `–` in ranges**
  (`5:00 PM – late`), em dash `—` in prose.
- **Non-breaking spaces** before units and inside indivisible pairs: `91&nbsp;Nicholson`,
  `40&nbsp;guests`, `5&nbsp;PM`. A wrapped address is a broken address.
- **`text-wrap: balance` on all headings** (`--fs-h1`, `--fs-h2`) — at `clamp(2.25rem,
  5.5vw, 4.5rem)` a one-word widow is guaranteed otherwise. `text-wrap: pretty` on body.
  **Never on the hero wordline** — see the conflict note below.
- **`font-variant-numeric: tabular-nums`** on every number column: menu prices, capacities,
  hours. Non-tabular figures in a price column are the single most common amateur tell.
- **`translate="no"`** on the wordmark and `LOFT&nbsp;91` wherever it appears as text —
  browser auto-translation mangles brand names.

> **Resolved skill conflict.** `web-design-guidelines` mandates `text-wrap: balance` on
> headings; `gsap-plugins` §SplitText Tips says *avoid* `text-wrap: balance`, it interferes
> with splitting. Both are right in their own scope. **Rule: `balance` on every heading
> except SplitText targets** — the hero wordline and the loader mark (§6.3) set
> `text-wrap: nowrap` or plain wrapping instead. Logged per `AGENT.md` §5 (contradictory
> skills) so it is not re-litigated per section.

### 4.3 Heading map — fixed, so §10 cannot be failed by accident

§10 forbids heading-level skips and permits exactly one `<h1>`. That is unbuildable unless
the map is declared once, here:

| Level | Where | Voice |
|---|---|---|
| `<h1>` | Hero wordline — **once on the page** | Display |
| `<h2>` | Each section headline: Menu · Packages · Gallery · Visit | Display |
| `<h3>` | Menu category headings · Package card names | Display (smaller) |
| `<h4>` | Sub-groupings inside a package card, if any | Interface |
| *not a heading* | Eyebrows, section labels, the running caption rail | Signal — `<p>`/`<span>`, **never** a heading element |

The Signal voice is styling, not structure. An eyebrow marked up as `<h3>` is a
heading-level skip wearing a costume.

### 4.4 Font loading — self-hosted, metric-matched

D-06 self-hosts; this is *how*, because the naive version breaks the §11 CLS budget.

- Subset to `latin`, `woff2`, **≤4 files total** (Display Regular, Interface Regular,
  Interface Medium, Interface Light). Preload only the two faces above the fold.
- `font-display: swap` — but `swap` at `--fs-display` reflows visibly. Neutralise it with
  **fallback metric overrides** on the `@font-face` fallback so the swap is dimensionally
  invisible:

```css
@font-face {
  font-family: 'Zodiak Fallback';
  src: local('Georgia');
  size-adjust: 96%; ascent-override: 90%; descent-override: 22%; line-gap-override: 0%;
}
```

  Percentages above are a **starting point, not a spec** — measure the real faces at build
  time and tune until the swap produces zero layout shift.
- First-time visitors never see the swap (it happens behind the loader). **Repeat visitors
  do** — the loader is session-gated (§6.3). Tune for the repeat visitor.

---

## 5. Space, grid and structure

```css
--space-2xs: 0.5rem;  --space-xs: 0.75rem; --space-sm: 1rem;  --space-md: 1.5rem;
--space-lg:  2.5rem;  --space-xl: 4rem;    --space-2xl: 6rem; --space-3xl: 10rem;
--radius-sm: 4px;  --radius-md: 10px;  --radius-lg: 20px;  /* nothing larger */
--gutter:    clamp(1.25rem, 5vw, 5rem);
--measure:   68ch;
--shell-max: 1440px;
```

- **Macro-whitespace is the primary composition tool.** Section padding-block:
  `clamp(6rem, 14vh, 10rem)`. Both skills mandate doubling standard padding; comply.
- **12-column grid** above `1024px`, 6-column `768–1023px`, single column below `768px`.
  (Breakpoints are the §5.1 set only — there is no `640px` tier.) The Editorial Split runs
  `5 / 7` or `7 / 5`, never `6 / 6` — symmetry reads as a template.
- **Radius discipline.** `--radius-md` for images and cards, `--radius-sm` for inputs and
  small controls. **No `rounded-full` on containers, cards or primary buttons**
  (`minimalist-ui` §2). Pills are permitted *only* for eyebrow tags and status badges.
- **Nesting over decoration.** Where a container needs presence, use
  `high-end-visual-design`'s **Double-Bezel**: an outer shell (`background: var(--l91-surface)`,
  `1px` hairline, `p: 6px`, `--radius-lg`) wrapping an inner core with a concentric
  smaller radius (`calc(20px - 6px)`). Never a naked box with a grey border.
- **Depth comes from light, not shadow.** Elevation is expressed by a hairline plus a
  marginal surface lift (`--l91-surface` → `--l91-surface-hi`), optionally an inset top
  highlight (`inset 0 1px 0 rgba(242,240,236,0.06)`). **No dark drop shadows** — they are
  invisible on black and always read as cheap. Banned: `shadow-md`, `shadow-lg`,
  `shadow-xl`, any `rgba(0,0,0,0.2+)` shadow.
- **Texture.** One fixed film-grain layer at `opacity: 0.03`, `position: fixed; inset: 0;
  pointer-events: none;` on a dedicated top layer — never attached to a scrolling
  container (`high-end-visual-design` §6). This is what makes black feel like a room
  instead of a void.

### 5.1 Breakpoints

`480` · `768` · `1024` · `1440`. Mobile-first authoring. Below `768px`: single column,
`w-full`, gutters to `--space-md`, **all asymmetry, rotation and negative-margin overlap
removed**, all `col-span` overrides reset. Use `min-height: 100dvh`, **never `100vh`**
(iOS Safari viewport jump).

### 5.2 Phone-hardware rules

Non-optional, because the arrival path is an Instagram bio link on a phone (`MEMORY.md`
§3.3). Every one of these is invisible on a desktop monitor and obvious on a handset.

```css
html { -webkit-tap-highlight-color: transparent; }   /* replaced by our own :active state */
a, button, [role="button"] { touch-action: manipulation; }  /* kills the 300ms double-tap delay */
```

- **Safe areas.** The floating nav (§7.1), the `100dvh` hero and the footer are full-bleed
  and must respect the notch and home indicator:
  `padding-inline: max(var(--gutter), env(safe-area-inset-left));` and
  `padding-block-end: max(var(--space-lg), env(safe-area-inset-bottom));`.
- **`overscroll-behavior: contain`** on the nav overlay (§7.1) and the gallery strip
  (§7.5) — otherwise a scroll gesture inside them chains to the page behind.
- **Never disable zoom.** No `user-scalable=no`, no `maximum-scale=1`
  (`web-design-guidelines` §Anti-patterns).
- **`scroll-margin-top: calc(var(--space-md) + 4rem)`** on every anchored section. D-04
  makes `/#menu` a real entry point and the nav floats over the top — without this, deep
  links land with the headline under the nav.
- **No horizontal overflow, ever.** The Editorial Split's negative margins are a classic
  source; verify at `320px`, not just at the breakpoints.

---

## 6. Motion system

Read `motion/emil-design-eng` before adding any animation: the question is always
*should this animate*, not *how*. Motion here is scarce, slow and confident. A bar is
not a product launch — nothing bounces, nothing pops, nothing demands attention.

### 6.1 The grammar — two easing curves, five durations

```css
--ease-out:     cubic-bezier(0.16, 1, 0.30, 1);   /* entrances, reveals, exits   */
--ease-move:    cubic-bezier(0.32, 0.72, 0, 1);   /* moves, morphs, overlay lift */
--ease-ambient: linear;                            /* constant motion ONLY — §6.7 */
--dur-press:   140ms;   /* :active feedback on a pressable      */
--dur-micro:   180ms;   /* hover, focus, state flip             */
--dur-short:   320ms;   /* small element transitions            */
--dur-mid:     620ms;   /* section reveals                      */
--dur-long:    900ms;   /* hero and loader beats                */
```

Three notes so the Validator does not re-open settled choices:

- **`--ease-out` is `minimalist-ui`'s curve** (`0.16, 1, 0.30, 1`), not
  `review-animations/STANDARDS.md`'s (`0.23, 1, 0.32, 1`). Both are strong ease-outs; the
  discipline overlay's is marginally gentler, which suits a bar. **Deliberate. Not a
  finding.**
- **`--ease-move` is the Ionic drawer curve.** It is named for what it does, not
  "ease-in-out", because it is not one — a token whose name misdescribes its curve is how
  the wrong easing gets used confidently.
- **`--dur-press` exists** because STANDARDS puts press feedback at 100–160ms and
  `--dur-micro` (180ms) sits outside it. Presses are the one interaction users repeat.

**Banned:** the CSS keywords `ease`, `ease-in`, `ease-in-out`; bare `linear` outside the
§6.7 carve-out; instant state changes; bounce/elastic; `transition: all`; any duration over
`1200ms` on a user-initiated interaction (`high-end-visual-design` §2,
`review-animations/STANDARDS.md`).

### 6.2 Smooth scrolling (R2)

GSAP **ScrollSmoother** (`motion/gsap-plugins` §ScrollSmoother), which integrates with
ScrollTrigger natively and needs no `scrollerProxy`. Settings: `smooth: 1.1`,
`effects: true`, `normalizeScroll: false`.

- **Desktop only.** On touch devices, hand back to native scroll — hijacked scroll on a
  phone at night is actively hostile, and it breaks momentum and address-bar behaviour.
- **Kill switch.** Under `prefers-reduced-motion: reduce`, ScrollSmoother is never
  initialised. This is not a downgrade path; it must be a supported first-class mode.
- **Licensing is a settled non-issue — do not re-check it.** Since Webflow's acquisition of
  GSAP, **every plugin is free, including commercially**; ScrollSmoother, SplitText and
  Flip need no membership, licence key or auth token (`gsap-plugins` §Licensing & Install).
  Install from the public `gsap` package. Never generate an `.npmrc` with a GreenSock token
  or point at `npm.greensock.com` — that instruction is outdated, and the skill names it
  explicitly as a thing not to do.
- The real constraint is **weight, not licence**. If ScrollSmoother pushes the §11 JS
  budget, **Lenis** is the sanctioned substitute — with `ScrollTrigger.scrollerProxy()`
  wired per `gsap-scrolltrigger` §scrollerProxy.
- `normalizeScroll: false` is correct *because* this is desktop-only; normalizeScroll exists
  to tame mobile address-bar behaviour, and we never run there.

### 6.3 The loading page (R3) — the site's signature moment

The one place where motion is allowed to be the point. Budget: **≤1400ms total.**

1. `0ms` — void canvas. Nothing.
2. `+120ms` — the wordmark's letters (`L O F T 9 1`, split into individual `<path>` or
   `<span>` elements) resolve inward: each letter animates `opacity 0→1` and
   `translateX` from an expanded position to its final position, staggered `55ms`,
   `--dur-long`, `--ease-out`. **Animate `transform`, never `letter-spacing`** — tracking
   is a layout property and will thrash the main thread.
3. `+780ms` — a `1px` brass hairline draws beneath the mark via `scaleX: 0 → 1`,
   `transform-origin: left`, `--dur-mid`.
4. `+1100ms` — the overlay lifts: the whole mark scales to `0.94` and fades while the
   overlay clip-path opens, revealing the hero beneath. The wordmark then settles into
   the nav — use **GSAP Flip** if the transform is exact, otherwise a plain cross-fade.
   A janky Flip is worse than a clean fade.

**Non-negotiable constraints:**

- **Never blocks content.** The DOM renders underneath; the overlay is a `position: fixed`
  layer. If JS fails or is slow, the site is fully usable — the overlay has a CSS-driven
  auto-dismiss failsafe at `1800ms`.
- **Once per session.** Gate on `sessionStorage`. A loader on every navigation is a tax,
  not a brand.
- **`prefers-reduced-motion`:** no loader at all. Straight to content.
- The wordmark SVG is inlined (not `<img>`), so letters are animatable and there is no
  network round-trip before the first beat. Blocked on `MEMORY.md` Q2.
- **Keyboard and screen readers.** The overlay is `aria-hidden="true"` and `inert` for its
  whole life, and the failsafe removes it from the DOM — never just `opacity: 0`. A
  `Tab` or `Esc` press during the loader dismisses it immediately: someone reaching for the
  keyboard has already decided they want the content.

**How this interacts with LCP — read before optimising it.** An opaque full-viewport
overlay means the loader *is* the first contentful paint, so "the loader must never gate
LCP" is not achievable by wishing. What is achievable, and what we commit to:

1. The **inlined wordmark SVG is the intended LCP element** — no network round-trip, so it
   paints on the first frame. This is why the SVG is inlined, not just why it is animatable.
2. LCP is **not final** at that point. When the overlay lifts at `+1100ms`, the hero display
   line becomes the largest paint and re-takes LCP. **The 2.5 s budget in §11 is measured at
   that second paint, and the loader's 1400 ms is spent inside it — not beside it.** The
   real budget for everything else is therefore ≈1.1 s.
3. Consequence: the Display face must be **preloaded and metric-matched** (§4.4). A font
   swap after the overlay lifts is a late LCP *and* a CLS hit at `--fs-display` size.

### 6.4 Scroll reveals

The house pattern, applied to every major block: `opacity: 0` + `translateY(20px)` →
resolved over `--dur-mid` with `--ease-out`. Optional `blur(6px) → 0` on hero-scale
elements only — blur is expensive; never on more than two elements per viewport.

- **Once only** (`ScrollTrigger` `once: true`). Content that re-animates on scroll-up is
  a gimmick and it makes re-reading annoying.
- **Stagger** grid and list children at `60–80ms` (`ScrollTrigger.batch()`), capped at
  `6` items — beyond that the last item's delay becomes a visible wait. `80ms` is a
  ceiling, not a target: `review-animations/STANDARDS.md` §Stagger puts the usable band at
  30–80ms and says longer *feels slow*. Stagger is decorative — it never blocks interaction
  while it plays.
- **Never `window.addEventListener('scroll')`.** ScrollTrigger or IntersectionObserver
  only (both skills state this explicitly; it causes continuous reflow and kills mobile).
- **Pinning** is permitted **once**, for the Gallery's horizontal sequence (§7.5). A
  second pinned section makes the page feel stuck.

### 6.5 Micro-interactions

**Gate every hover state.** On a phone, `:hover` fires on tap and then *sticks* until the
next tap elsewhere — so an ungated hover animation reads as a stuck, broken element on the
primary target device. Every rule below lives inside:

```css
@media (hover: hover) and (pointer: fine) { /* hover states only in here */ }
```

`:active` and `:focus-visible` states go **outside** the query — those are the touch and
keyboard affordances, and they are what actually confirm a tap was heard.

- **Links:** underline drawn via `background-size` or a pseudo-element `scaleX` on hover,
  `--dur-micro`, `--ease-out`, with `transform-origin: left` on enter and `right` on leave
  so the underline retracts the way it arrived rather than rewinding.
- **Buttons:** `--l91-surface-hi` fill shift on hover; `transform: scale(0.97)` on
  `:active` over `--dur-press` — subtle but *felt*, and the only feedback a touch user
  gets (`review-animations/STANDARDS.md` §Physicality). Where a CTA carries a trailing
  arrow, nest it in its own circular wrapper that translates `x: +2px, y: -1px` on
  group-hover (`high-end-visual-design` §4B). Never a naked arrow glyph beside text.
- **Images:** `scale(1.03) → 1` over `--dur-mid` on reveal; on hover, `scale(1.02)` with
  a scrim lift. Container must be `overflow: hidden` with the radius applied to the
  container, not the image. Never animate from `scale(0)` — nothing in the real world
  appears from nothing (STANDARDS §Physicality).
- **Interruptibility:** every hover/focus transition must be reversible mid-flight, which
  means **CSS transitions, not keyframes**, on anything a user can re-trigger rapidly —
  keyframes restart from zero, transitions retarget from the current value. No animation
  may lock a control (STANDARDS §Interruptibility).
- **Asymmetric timing:** where a state is deliberate to enter and instant to leave, exit
  faster than enter (STANDARDS §Asymmetric timing) — the nav overlay closes quicker than it
  opens. This is a *duration* rule; it is separate from the underline's origin flip above.

### 6.6 Performance guardrails (both skills, non-negotiable)

Animate **only** `transform`, `opacity`, `clip-path` and `filter` (sparingly). Never
`top`, `left`, `width`, `height`, `letter-spacing`, `margin`. `will-change` only on
elements actively animating, removed after. `backdrop-blur` only on fixed/sticky layers
(nav, overlay) — never on scrolling content. No arbitrary z-index: the layer scale is
`base 0 · sticky nav 100 · overlay 200 · loader 300 · grain 400`.

> **Skip link.** The scale above has no slot for it, which forces a `calc()` off-scale
> value — the exact improvisation this rule forbids. It shares the `loader` tier (300) and
> relies on §6.3's rule that `Tab` dismisses the loader, so the two are never in contention.
> Revisit if the loader ever stops being keyboard-dismissible.

### 6.7 The `linear` carve-out — one exception, tightly bounded

§9 bans `linear` because eased UI motion is the whole point. But §7.2 specifies a
*slow-drifting ambient light*, and `review-animations/STANDARDS.md` §Easing is explicit
that **constant motion takes `linear`**. Easing a 20-second ambient drift makes it visibly
accelerate and stall — it stops reading as light and starts reading as an animation.

**`--ease-ambient` (`linear`) is permitted on exactly one class of thing:** continuous,
non-interactive, infinitely-looping decoration with no start or end state the user can
perceive. Today that is the hero's ambient light and nothing else.

It is **banned** on: anything a user triggers, anything with an entrance or exit, anything
carrying state, and any reveal. If a `linear` appears outside a `20s+` infinite loop on a
`pointer-events: none` layer, it is a §9 hit.

Both ambient layers (this and the §5 film grain) are suppressed entirely under
`prefers-reduced-motion: reduce`.

---

## 7. Section blueprints

Order below is the intended scroll narrative (`MEMORY.md` D-04: one page, anchored
sections). Content status per section is tracked in `MEMORY.md` §5.

**Archetype map.** §2 locks the Editorial Split as the recurring pattern and the Bento to
Packages. Stated that way it is unfalsifiable — three of the six sections are neither.
Here is what "recurring" actually means, so §12 can check it:

| Section | Archetype | Split ratio |
|---|---|---|
| 7.2 Hero | **Centred mark** (D-14 — was Editorial Split `7/5`) | — |
| 7.3 Menu | Editorial column *inside* a Split — headline and category rail left, item rows right | `5 / 7` |
| 7.4 Packages | **Asymmetrical Bento** (the only one) | — |
| 7.5 Gallery | Horizontal pin — full-bleed, breaks the grid **on purpose**, once | — |
| 7.6 Visit | **Editorial Split** — address/hours left, map and enquiry right | `5 / 7` |
| 7.7 Footer | Single hairline row | — |

Two Splits at `5/7` (Menu, Visit) are the rhythm. There are now **two** deliberate
breaks: the centred hero (D-14) and the Gallery, which earns its break by being the only
pinned section (§6.4). Below `768px`
every ratio collapses to one column and the map stops applying.

### 7.1 Nav — sticky vertical rail (revised D-14)
A floating **vertical** stack pinned in the left gutter, vertically centred, **always
visible**. Not a top navbar (§9 bans one glued to the top) and not a full-height sidebar
panel — it has no background of its own and occupies **no layout space**, so content is
inset by `13rem` at `≥1024px` to keep clear of it. Contents top to bottom: wordmark ·
Menu / Packages / Gallery / Visit (Signal type) · a single brass CTA.

Each link carries a **leading hairline** that extends into the accent on the active
section — animated with `scaleX` on a 1px rule, so no layout property moves (§6.6).
That extension is brass **role 1**; the CTA is role 2; section numerals are role 3.

**Below `1024px`** there is no gutter to float in, so the rail collapses to a compact top
bar (wordmark + hamburger) opening the full-screen overlay: focus trap, `Esc` closes,
focus returns to the hamburger, `overscroll-behavior: contain`, `aria-expanded` /
`aria-controls` on the trigger, and a 44×44px target including safe-area inset. The
hamburger **morphs into an X** (`rotate-45 / -rotate-45`, not a swap); the morph is
decorative, the state must be announced regardless.

> **The old keyboard hazard is gone, not patched.** Rev 2 hid the nav over the hero and
> revealed it on scroll-up, which made it unreachable for anyone who starts at the top and
> never scrolls up — so §7.1 needed a `:focus-within` escape hatch and a rule against
> `display: none`. An always-visible rail removes the failure mode at the source. Keep it
> that way: any future "hide until scrolled" behaviour re-introduces the bug.

### 7.2 Hero — R4 (revised D-14)
Full `100dvh` (`min-height`, `dvh` not `vh`), **centred composition** built around the
wordmark — no longer an Editorial Split. Order: the mark, then a Signal eyebrow, the
display serif wordline, then the venue's essential facts in Signal type: what it is, where
it is, when it's open, and one primary CTA.

**The whole block must clear the fold on a phone** — this is the answer to "should I go
tonight?" and it is the one hard constraint on this section. Verify by measuring the CTA's
bottom edge against `innerHeight`, not by eye. Because height is the binding variable, the
rhythm tightens under `@media (max-height: 720px)` rather than at a width breakpoint; a
320×640 handset otherwise pushes the CTA ~90px below the fold.

**The mark.** Until a vector lands (`MEMORY.md` Q2) this is the supplied 150×150 JPEG,
inverted in CSS to sit dark-on-bright (D-15) and **never upscaled** — a blown-up lossy
avatar is exactly the amateur tell §4.2 warns about. Behind it, a slow-drifting warm
radial wash at `--l91-brass-wash` (§6.7 carve-out). Never an empty flat background.

### 7.3 Menu — R6
The proof of R9 (one theme across sections). A single editorial column, **not cards**:
category headings in display serif, then rows of `item · description · price` separated by
`1px` hairlines with generous `--space-md` row padding — the typographic architecture of a
printed bar list, not a data table. Prices in Signal type, tabular numerals
(`font-variant-numeric: tabular-nums`), right-aligned and column-locked.
Long menus get sticky category headers, never tabs that hide content.
**No fabricated items or prices** (`MEMORY.md` D-05) — until real data lands, render
structure with a visible `[TBC]` marker.

### 7.4 Packages — R7
The only section using the **Asymmetrical Bento** (`high-end-visual-design` §3B1) — an
uneven grid where the flagship package spans wider than the others. Each card uses the
Double-Bezel construction. Per card: name (display), capacity + duration (Signal),
inclusions (body, ≤5 lines), and one enquiry CTA. Pricing appears **only** if the client
publishes it (`MEMORY.md` Q6); otherwise "Enquire for pricing" — never a placeholder
number. Below `768px` the bento collapses to a single-column stack, all spans reset.

### 7.5 Gallery — R8
Horizontal scroll sequence driven by `ScrollTrigger` `containerAnimation`
(`gsap-scrolltrigger` §Horizontal scroll) — the one sanctioned pin on the page. Images run
at mixed sizes on a shared baseline, not a uniform grid, with the venue name set in Signal
type as a running caption rail. Below `768px` it degrades to a native horizontal
scroll-snap strip with `-webkit-overflow-scrolling: touch` — **no pin, no hijack on
touch.** Every image: explicit `width`/`height` (zero CLS), `loading="lazy"` except the
first, AVIF/WebP with fallback, meaningful `alt`. Any text over an image sits on a
gradient scrim (`linear-gradient(to top, rgba(8,8,10,0.75), transparent)`) so contrast
holds regardless of the photo.

### 7.6 Visit / Contact — §3.3
Address, hours, map link, Instagram. Hours rendered from a single data source so they can
never drift between hero and footer. A `<address>` element with real semantics, a Maps
deep link that opens the native app on mobile, and the functions enquiry path — form vs.
`mailto:` vs. DM is blocked on `MEMORY.md` Q3.

### 7.7 Footer
One hairline, wordmark, socials, legal/licensing line (`MEMORY.md` Q8), credit. Signal
type throughout. Nothing else — a fat footer on a 6-section site is filler.

### 7.8 The `[TBC]` state — the most-used component on day one

`MEMORY.md` §5 lists **eight of eleven** content rows as Missing. The first buildable
version of this site is therefore mostly `[TBC]`, and D-05 requires the marker to be
*visible*. Leaving its appearance undefined guarantees the Executor invents one — and an
invented placeholder that looks designed is exactly the thing D-05 exists to prevent.

**Visual spec.** One component, one look, every section:

```css
.tbc {
  font: var(--fs-signal)/1 var(--font-interface);   /* Signal voice, uppercase, 0.28em */
  color: var(--l91-ink-3);                          /* AA-safe — it must be readable   */
  border: 1px dashed var(--l91-rule-strong);        /* the ONLY dashed border on site  */
  border-radius: var(--radius-sm);
  padding: var(--space-2xs) var(--space-xs);
}
```

- **Dashed is reserved.** Nothing else on the site uses a dashed border, so the marker is
  unmistakable at a glance and greppable in a screenshot review.
- **No brass.** A `[TBC]` must never occupy one of the three accent roles (§3). Missing
  content does not get to look important.
- **It holds real space.** The placeholder occupies the dimensions the real content will
  occupy — otherwise every layout decision is made against a lie and re-breaks on arrival.
  Explicit `width`/`height` on image placeholders, same as real media (§11, CLS).
- **It says what is missing and who owns it**, in plain words: `[TBC — drinks menu, from
  client]`, not a bare `[TBC]`. Reviewers should not have to open `MEMORY.md` §5.
- **Never a `<h1>`–`<h4>`.** A placeholder inside a heading breaks the §4.3 map.
- **Never invented adjacent copy.** A `[TBC]` price does not get a plausible neighbouring
  description written to "show the layout". Structure only.

**Ship guard.** The `[TBC]` class is a **build-time failure in a production build**, not a
warning. `grep -r 'tbc\|\[TBC\]' dist/` must return zero before deploy. This is what turns
D-05 from a promise into a mechanism, and it is the checklist line in §12 that matters most.

**Reduced-motion and a11y:** placeholders are static, and carry
`aria-label="Content to be confirmed"` so a screen-reader user is not read a bare bracket.

---

## 8. Imagery and iconography

- **Photography:** desaturated, warm, low-key. Consistent grade across every image — one
  LUT, one temperature. Never oversaturated stock. Never a smiling-stock-people shot. If
  a real photo is unavailable, use a black field with ambient light, **not** a stock
  substitute that misrepresents the venue (`MEMORY.md` D-05).
- **Icons:** ultra-light precise line icons only — **Phosphor Light** or **Remix Line**.
  Banned: Lucide/Feather default weights, FontAwesome, Material Icons
  (`high-end-visual-design` §2). One stroke width site-wide. Icons are rare here; most
  affordances are typographic. This contradicts `minimalist-ui` §6, which asks for Phosphor
  **Bold/Fill** — resolved in favour of the driver skill and recorded as override **O-2**
  (§1.1).
- **Emoji: banned** anywhere in markup, copy, headings or `alt` text (`minimalist-ui` §2).
- All decorative SVG gets `aria-hidden="true"`; all meaningful SVG gets a `<title>`.

---

## 9. Banned defaults — the audit list

Merged from `high-end-visual-design` §2 and `minimalist-ui` §2. **Any hit is a build
failure**, not a note. The Validator runs this list verbatim (`AGENT.md` §4.3).

**Type** — Inter · Roboto · Arial · Open Sans · Helvetica · system-font-only stacks ·
body text below 16px · unbounded line length · `...` where `…` belongs · straight quotes ·
non-tabular figures in a price or hours column.
**Colour** — pure `#FFF` canvas (kills the warmth) · pure `#000` type · primary-coloured section backgrounds ·
decorative multi-stop gradients · neon · a second accent hue · **a fourth brass *role* in
one viewport** (§3 — repeats within a role are fine; a new role is not) · `--l91-ink-4`
used as text.
**Depth** — `shadow-md`/`lg`/`xl` · any `rgba(0,0,0,0.2+)` shadow · generic `1px solid grey`
borders (use the token hairlines) · glassmorphism beyond nav/overlay blur · dashed borders
anywhere except the `[TBC]` marker (§7.8).
**Layout** — edge-to-edge sticky navbar glued to the top · symmetric 3-column Bootstrap
grids · `rounded-full` on cards/containers/primary buttons · `100vh` (use `100dvh`) ·
sections under `py: 6rem` · any un-collapsed asymmetry below `768px` · horizontal page
overflow at any width from `320px` up.
**Motion** — the CSS keywords `ease` / `ease-in` / `ease-in-out` · `linear` outside the
§6.7 ambient carve-out · `transition: all` · bounce/elastic · instant state changes ·
`window.addEventListener('scroll')` · animating layout properties · `scale(0)` entrances ·
hover animations not gated behind `@media (hover: hover)` · more than one pinned section ·
reveals that replay on scroll-up · blocking loaders · motion with no
`prefers-reduced-motion` path.
**Mobile & platform** — `user-scalable=no` / `maximum-scale=1` · missing
`color-scheme: light` · missing `theme-color` · full-bleed layers ignoring
`env(safe-area-inset-*)` · `outline: none` without a `:focus-visible` replacement ·
icon-only controls without `aria-label` · media without explicit `width`/`height`.
**Content** — Lorem Ipsum · "John Doe" / "Acme" · emoji · AI copy clichés ("Elevate",
"Seamless", "Unleash", "Next-Gen", "Game-changer", "Delve", "Nestled in the heart of") ·
**invented venue facts of any kind** (`MEMORY.md` D-05) · a bare `[TBC]` with no owner
named (§7.8) · any `[TBC]` surviving into a production build.

> **Greppable subset** — Haiku may run these mechanically and hand results up
> (`AGENT.md` §2): banned font names · `100vh` · `shadow-(md|lg|xl)` · `transition: all` ·
> `outline:\s*none` · `ease-in-out|linear` · `addEventListener\(['"]scroll` ·
> `rounded-full` · `\.\.\.` · `\[TBC\]` · `<img` without `width=`. Everything else on this
> list needs judgement and does not get downgraded.

---

## 10. Accessibility floor

Non-negotiable; a venue site that excludes people is a failed venue site.

- WCAG 2.2 AA. Text ≥ 4.5:1; large text (**≥24px, or ≥18.66px bold** — not 18px) and UI
  glyphs ≥ 3:1 — **measured on the shipped CSS**, and independently in dark
  (`ui-ux-pro-max` §Light/Dark Mode Contrast). The §3 ramp is built so this threshold never
  has to be reasoned about: levels 1–3 pass at any size, level 4 is not text.
- Visible focus on every interactive element, via **`:focus-visible`, not `:focus`** —
  `:focus` puts a ring on every mouse click and trains people to see it as noise.
  **Never `outline: none`** without an equivalent replacement.
- **The focus ring must survive photography.** `outline: 2px solid var(--l91-focus)` with
  `outline-offset: 2px` leaves a 2px gap showing whatever is underneath — over a bright
  patch of a gallery image the ring disappears. Pair it with a same-width dark inner ring
  so contrast holds against any backdrop:
  `box-shadow: 0 0 0 2px var(--l91-void);` under the outline. Verify on the lightest image
  in the gallery, not on the canvas.
- Full keyboard operability including the nav overlay (focus trap, `Esc` to close, focus
  restored to the trigger). Skip-to-content link as the first tabbable element.
- Semantic landmarks (`header`/`nav`/`main`/`section`/`footer`/`address`), one `<h1>`,
  no heading-level skips.
- Touch targets ≥ `44×44px` with ≥ `8px` separation.
- `prefers-reduced-motion: reduce` → no smooth scroll, no loader, no parallax, no
  horizontal pin; reveals collapse to a ≤150ms opacity fade. Nothing becomes unreachable.
- Every image has an `alt` that describes the room, not the file.

---

## 11. Performance budget

Measured on a mid-tier Android over 4G — the actual arrival path from an Instagram bio.

| Metric | Budget |
|---|---|
| LCP | ≤ 2.5 s — **measured at the hero display line, after the overlay lifts** (§6.3) |
| CLS | ≤ 0.05 (explicit media dimensions everywhere + font metric overrides, §4.4) |
| INP | ≤ 200 ms |
| JS, compressed | ≤ 120 KB (GSAP + plugins included) |
| CSS, compressed | ≤ 30 KB — one token file plus section styles; there is no framework to blame |
| Fonts | ≤ 4 files, subset (`latin`), `woff2`, `font-display: swap`, self-hosted, preloaded, metric-matched fallback |
| Largest image | ≤ 250 KB, AVIF/WebP, responsive `srcset` |
| Animation | 60 fps sustained; no long task > 50 ms during the loader |

**The LCP budget is not what it looks like.** §6.3 establishes that the loader occupies the
first ~1100 ms *inside* the 2.5 s, not alongside it. Everything else — fonts, hero paint,
first section — has ≈1.4 s. Treat the budget as **1.4 s**, and the loader as spent money.

**Load discipline.** GSAP plugins imported per-section, not as one bundle (`gsap-frameworks`
shows the dynamic-import pattern): core + ScrollTrigger + SplitText are needed for the
first screen; ScrollSmoother and the Gallery's `containerAnimation` are not, and neither is
loaded on touch (§6.2, §7.5). **Measure the real gzipped bundle before assuming it fits** —
if core + ScrollTrigger + ScrollSmoother + SplitText plus app code approaches the 120 KB
ceiling, drop ScrollSmoother for Lenis (§6.2) rather than trimming the a11y or font budget.
Gallery images lazy-loaded below the fold; the first is not.

---

## 12. Pre-ship checklist

The Validator runs this before the Director may close a loop (`AGENT.md` §4.3 Validator,
§4.0 Director) — and only once this document is binding (see the demo-phase hold above,
`CLAUDE.md` §2.2).

Grouped by who may run it. **Mechanical** may be delegated to Haiku; everything below it
needs judgement and stays at the tier that produced the work (`AGENT.md` §5 model floor).

**Mechanical — greppable, zero tolerance**
- [ ] Zero hits against §9, including its greppable subset
- [ ] `100dvh` not `100vh`; no `transition: all`; no `outline: none` without a replacement
- [ ] Every `<img>`/`<video>` carries explicit `width`/`height`
- [ ] `grep -r '\[TBC\]' dist/` returns **zero** (§7.8 ship guard)

**Design system**
- [ ] Archetype map (§7) matches the build — Splits at `7/5` → `5/7` → `5/7`, Bento on Packages only, one deliberate Gallery break
- [ ] Colour tokens only; **no fourth brass role** per viewport; `--l91-ink-4` never text
- [ ] Type: Display / Interface / Signal strictly by job; §4.3 heading map intact, one `<h1>`, no skips
- [ ] Microtypography (§4.2): `…`, curly quotes, nbsp in address and hours, `balance` on headings but **not** on SplitText targets, tabular figures in price and hours columns
- [ ] Section padding-block ≥ `6rem`; Double-Bezel on major containers; ≤ 68ch measure
- [ ] Depth via hairline + surface lift only — no dark drop shadows; dashed borders only on `[TBC]`

**Motion**
- [ ] Every reveal uses §6.1 tokens; `once: true`; batched staggers ≤ 6 items at 60–80 ms
- [ ] Only `transform`/`opacity`/`clip-path` animated; `backdrop-blur` on fixed layers only
- [ ] Hover states gated behind `@media (hover: hover) and (pointer: fine)`; `:active` and `:focus-visible` outside it
- [ ] Transitions (not keyframes) on anything re-triggerable; all motion interruptible
- [ ] `linear` appears **only** inside the §6.7 carve-out
- [ ] Loader: ≤1400 ms, non-blocking, session-gated, `1800 ms` failsafe, `inert` + `aria-hidden`, `Tab`/`Esc` dismisses, reduced-motion bypass
- [ ] Smooth scroll: desktop only, off under reduced motion, ScrollTrigger in sync
- [ ] Exactly one pinned section (Gallery); touch fallback is native scroll-snap

**Mobile & platform** *(on a real handset, not a resized window)*
- [ ] `color-scheme: light` · `theme-color` · `touch-action` · tap-highlight set (§5.2)
- [ ] Safe-area insets respected on nav, hero and footer; no horizontal overflow at `320px`
- [ ] `scroll-margin-top` on every anchor — `/#menu` lands clear of the floating nav
- [ ] Full single-column collapse below `768px`; no asymmetry survives; zoom not disabled

**Accessibility (§10)**
- [ ] Contrast recomputed **from the shipped CSS**, including over the lightest gallery image
- [ ] `:focus-visible` everywhere, ring legible over photography; keyboard path complete
- [ ] Nav reachable by keyboard while visually hidden on the hero (§7.1); overlay traps focus, `Esc` closes, focus restored
- [ ] Touch targets ≥ 44×44 px with ≥ 8 px separation; icon-only controls labelled
- [ ] Reduced-motion pass walked end to end — nothing unreachable, nothing missing
- [ ] Every image has an `alt` that describes the room, not the file

**Performance (§11)**
- [ ] Budgets met on a throttled mobile profile; JS and CSS **measured**, not estimated
- [ ] LCP measured at the hero line after the overlay lifts; CLS ≤ 0.05 with fonts swapped

**Content & coherence**
- [ ] **No fabricated venue content**; every `[TBC]` names what is missing and who owns it
- [ ] Hours, address and links resolve from the single data module — no drift hero → footer
- [ ] Menu, Packages and Gallery reviewed **side by side** — one theme, not three (R9)
- [ ] `motion/review-animations` + `core-design/web-design-guidelines` + `core-design/critique` run, findings closed
