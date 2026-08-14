# Working with this design skill library

This repository is a **skill library**, not an app. Each subfolder under the group
directories (`core-design/`, `motion/`, `templates/`, …) is a self-contained skill:
a `SKILL.md` file plus its own reference docs, scripts, and assets. Your job when a
design task comes in is to **find the right skill, load its `SKILL.md`, and follow it**
— not to design from scratch when a skill already encodes the approach.

`README.md` is the human-facing index. This file tells you how to operate.

## The core loop

1. **Classify the task** — is it design judgment, a specific aesthetic, motion, a
   design system, image art-direction, a process, a deliverable template, or artifact
   plumbing? That maps to one group directory.
2. **Pick one primary skill** using the routing table below. Resist loading five
   overlapping skills — they will contradict each other. Pick the best fit.
3. **Read that skill's full `SKILL.md`** before acting. Some are long
   (`design-taste-frontend` is ~1200 lines, `impeccable` ships 27 reference docs) —
   read the whole thing; the value is in the specifics, not the summary.
4. **Follow the skill's own workflow and constraints.** These skills carry hard rules
   (banned fonts, required audit steps, output formats). Honor them over your defaults.
5. **Layer a review skill at the end** when quality matters (see Composition below).

## Routing — task → skill

| The task is… | Load |
|---|---|
| Build a new frontend/landing/app UI from scratch | `core-design/frontend-design` (lighter) or `core-design/design-taste-frontend` (anti-slop, brief-driven) |
| A full design pass: design **and** critique/polish/harden/animate | `core-design/impeccable` (flagship, lifecycle) |
| Output keeps looking generic/"AI-slop" | `core-design/high-end-visual-design` (banned-defaults ruleset) |
| Redesign/upgrade an existing site without breaking it | `workflow/redesign-existing-projects` |
| Review/audit UI code (no building) | `core-design/web-design-guidelines` or `core-design/critique` |
| Look up styles, palettes, font pairings, UX rules | `core-design/ui-ux-pro-max` (reference DB, not a workflow) |
| Turn vague taste + screenshots/URLs into a spec | `core-design/reference-design-contract` |
| A committed aesthetic (minimalist / brutalist) | `styles/*` |
| Add or review animation/motion | `motion/gsap-*` (start `gsap-core`), `motion/emil-design-eng`, `motion/review-animations` |
| Theme an artifact / build a design system / extract a brand | `design-systems/theme-factory` · `stitch-design-taste` · `brand-extract` |
| "Design like Stripe/Apple/Notion…" or study a real system | `design-systems/brand-systems/<brand>/` (reference, not a skill) |
| Generate images: art, brand identity, web/mobile mockups | `image-direction/*` |
| Build a specific deliverable (deck, dashboard, invoice, wireframe, poster, video frame…) | `templates/<name>` — scan the README template list first |
| Build a complex claude.ai artifact | `artifacts/artifacts-builder` (+ `full-output-enforcement`) |

## Composition rules (which skills stack, which don't)

- **One taste skill at a time.** `frontend-design`, `design-taste-frontend`,
  `high-end-visual-design`, and `impeccable` overlap heavily. Choose one as the driver.
- **Build → then review.** A build skill (taste or template) pairs well with a review
  skill at the end: `web-design-guidelines`, `critique`, or `impeccable`'s audit mode.
- **Motion is additive.** Any build skill + a `gsap-*` skill + `review-animations` is a
  valid stack. Read `emil-design-eng` before deciding *whether* to animate.
- **Templates are starting points, not straitjackets.** A `templates/*` skill gives
  structure; still apply a taste/style skill for visual direction on top of it.
- **`brand-systems/` and `ui-ux-pro-max` are references**, consulted mid-task — they
  don't drive a workflow. Pull tokens/rules from them into whatever skill is driving.

## When no skill fits

If the task is genuinely off the map of what's here, say so and design directly rather
than forcing a mismatched skill. A few capabilities were intentionally left as upstream
pointers (color science, Apple HIG, Three.js, Figma, D3 — see README "Worth installing
separately"); if one of those is needed, tell the user to install the upstream rather
than improvising a weak substitute.

## Do not

- Don't touch `_archive/` — it's filtered-out duplicates and stubs kept only for
  recovery. Never load a skill from there; the live copy is in a group directory.
- Don't invent design rules that contradict a loaded skill's constraints.
- Don't load a skill's summary and skip its reference docs/scripts when it points to them.
