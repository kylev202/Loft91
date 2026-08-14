# UI/UX Design Skill Library

A curated design skill library for Claude coding agents. Every folder here contains a
real, self-contained skill (`SKILL.md` + assets) — no duplicates, no empty catalog
stubs, no API-key-dependent wrappers.

**How to use:** copy the skill folders you need into `~/.claude/skills/` (or a
project's `.claude/skills/`), or point Claude at this library and let it read the
relevant `SKILL.md` by path. Folder groups below are for organization; each skill
works independently.

---

## Routing guide — which skill for which task

### `core-design/` — design judgment and taste (start here)

| Skill | Use when |
|---|---|
| `impeccable` | The flagship, full-lifecycle skill: design, redesign, critique, audit, polish, animate, harden any frontend UI. Has 27 reference docs + scripts. Default choice for serious UI work. |
| `frontend-design` | Anthropic's official skill for building distinctive, production-grade interfaces from scratch. Lighter than impeccable; good default for greenfield builds. |
| `design-taste-frontend` | Anti-slop taste skill: infers design direction from the brief, audit-first on redesigns. Best for landing pages and portfolios that must not look templated. |
| `high-end-visual-design` | Strict "banned defaults" ruleset (fonts, shadows, layouts, motion) that forces premium agency-level output. Use when output keeps looking generic. |
| `web-design-guidelines` | Vercel's Web Interface Guidelines — review/audit UI code for compliance (layout, a11y, motion, typography). Review-only. |
| `critique` | Fast 5-dimension expert design review of any HTML artifact. Use as a scoring gate. |
| `ui-ux-pro-max` | Searchable design database: 50+ styles, 161 palettes, 57 font pairings, UX guidelines across 10 stacks. Use as a reference/lookup engine, not a workflow. |
| `reference-design-contract` | Turns vague taste ("make it feel like this" + screenshots/URLs) into an explicit design contract before building. |

**Overlap rule:** for a build → `frontend-design` or `design-taste-frontend`; for a
full design pass or redesign → `impeccable`; for review only → `web-design-guidelines`
or `critique`; for lookups → `ui-ux-pro-max`.

### `styles/` — committed aesthetic directions

| Skill | Aesthetic |
|---|---|
| `minimalist-ui` | Clean editorial, warm monochrome, flat bento grids, no gradients/shadows. |
| `industrial-brutalist-ui` | Swiss print × military terminal: rigid grids, extreme type contrast, analog degradation. |

(More aesthetics live as deck/prototype templates: `templates/web-prototype-taste-*`,
`templates/deck-swiss-international`, `templates/doc-kami-parchment`.)

### `motion/` — animation and interaction feel

| Skill | Use when |
|---|---|
| `gsap-core` / `gsap-timeline` / `gsap-scrolltrigger` / `gsap-plugins` / `gsap-react` / `gsap-frameworks` / `gsap-utils` / `gsap-performance` | Official GSAP skills. Start at `gsap-core`; the others cover sequencing, scroll animation, plugins, React/Vue/Svelte integration, utils, and performance. |
| `emil-design-eng` | Emil Kowalski's philosophy on UI polish, component feel, and when/how to animate. Read before adding motion. |
| `review-animations` | Reviews existing animation code against a high craft bar. Use after motion is written. |

### `design-systems/` — tokens, themes, brand identity

| Skill / folder | Use when |
|---|---|
| `theme-factory` | 10 ready color/font themes + on-the-fly theme generation for any artifact (slides, docs, pages). |
| `stitch-design-taste` | Generates an agent-friendly `DESIGN.md` design system file enforcing premium UI standards. |
| `brand-extract` | Extracts a complete brand kit (tokens, type, color) from a live website. |
| `brand-systems/` | **Reference library, not a skill.** 24 real-world design systems (Apple, Stripe, Linear-adjacent brands: Airbnb, Notion, Vercel, Spotify, Nike, OpenAI, GitHub…). Each folder has `DESIGN.md` (the system described for agents), `design-tokens.json`, `tokens.css`, `tailwind-v4.css`, `components.html`, and previews. Use when asked to "design like X" or to study how strong systems make decisions. |

### `image-direction/` — visual asset creation and art direction

| Skill | Use when |
|---|---|
| `canvas-design` | Create original static visual art/posters as PNG/PDF (ships 80+ fonts). |
| `brandkit` | Premium brand-identity image generation: logo systems, identity boards, visual-world decks. |
| `imagegen-frontend-web` | Art-directs generated website design reference images (one image per section) that developers can rebuild accurately. |
| `imagegen-frontend-mobile` | Same for mobile: premium app screen concepts in phone mockups. Images only, no code. |

### `workflow/` — design process skills

| Skill | Use when |
|---|---|
| `redesign-existing-projects` | Upgrade an existing site/app to premium quality without breaking functionality. Audit → fix. |
| `image-to-code` | Generate design images first, analyze them, then implement the site to match. |
| `research-decision-room` | Synthesize messy user research (notes, tickets, surveys) into decisions. |

### `templates/` — deliverable blueprints (60)

Ready-made, self-contained starting points. Pick by deliverable type:

- **Web pages:** `saas-landing`, `pricing-page`, `waitlist-page`, `docs-page`, `blog-post`, `faq-page`, `contact-widget`, `email-marketing`
- **Product UI:** `dashboard`, `live-dashboard`, `kanban-board`, `mobile-app`, `mobile-onboarding`, `login-flow`, `gamified-app`
- **Prototyping:** `web-prototype` (+ `-taste-brutalist` / `-taste-editorial` / `-taste-soft`), `wireframe-sketch`, `wireframe-greybox`, `wireframe-annotated`, `wireframe-mobile-flow`
- **Decks:** `html-ppt` (the engine — 36 themes + animations bundled), `simple-deck`, `guizang-ppt`, `kami-deck`, `kami-landing`, `deck-swiss-international`, `deck-open-slide-canvas`
- **Documents:** `invoice`, `resume-modern`, `meeting-notes`, `pm-spec`, `weekly-update`, `team-okrs`, `finance-report`, `data-report`, `release-notes-one-pager`, `article-magazine`, `doc-kami-parchment`
- **Social & graphics:** `card-twitter`, `card-xiaohongshu`, `social-x-post-card`, `social-carousel`, `poster-hero`, `image-poster`, `magazine-poster`, `mockup-device-3d`
- **Video & motion:** `hyperframes` (HTML video engine), `motion-frames`, `video-shortform`, `webgl-experience`, and single-effect frames: `frame-data-chart-nyt`, `frame-flowchart-sticky`, `frame-glitch-title`, `frame-light-leak-cinema`, `frame-liquid-bg-hero`, `frame-logo-outro`, `frame-macos-notification`

### `artifacts/` — building and shipping rich HTML output

| Skill | Use when |
|---|---|
| `artifacts-builder` | Anthropic's suite for complex multi-component claude.ai artifacts (React, Tailwind, shadcn/ui). |
| `tweaks` | Wraps an HTML artifact with a live parameter side panel for design iteration. |
| `full-output-enforcement` | Forces complete, unabridged code output — no placeholders/truncation. Pair with any large build. |

---

## Worth installing separately (not bundled here)

The original collection contained catalog stubs pointing at these upstream skills.
The stubs had no content and were archived, but the upstreams are good:

- Apple HIG (14 skills): https://github.com/raintree-technology/apple-hig-skills
- Color science expert: https://github.com/meodai/skill.color-expert
- Cross-platform design rules (HIG + Material 3 + WCAG): https://github.com/ehmo/platform-design-skills
- Three.js: https://github.com/CloudAI-X/threejs-skills
- D3 data visualization: https://github.com/jiannanya/snow-d3/
- UI constraint sets: https://github.com/ibelick/ui-skills
- Figma official skills: https://github.com/figma/skills

## `_archive/`

Everything filtered out, untouched and recoverable: 85 empty catalog stubs,
duplicate copies (opendesign repackaged most top-level skills), 45 `html-ppt-*`
theme-variant wrappers (themes already ship inside `templates/html-ppt`),
API-dependent generation wrappers (fal.ai, Venice, Replicate, Sora, MiniMax…),
brand one-offs, off-topic utilities, and per-brand translations of the
`brand-systems` docs. Delete the folder once you're confident nothing is missed.
