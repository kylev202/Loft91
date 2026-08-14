# CLAUDE.md — Operating Instructions

> **Role in the system:** the entry point. Read this first, every session. It tells you
> what this project is, which documents govern which decisions, in what order to load
> them, and the rules that hold regardless of the task.
>
> **This file instructs; it does not decide.** Venue facts live in `MEMORY.md`, design
> decisions in `DESIGN.md`, process in `AGENT.md`. When those files disagree with this
> one on their own subject, they win.
>
> **Last updated:** 2026-08-08 · **Status:** active

---

## 1. The project in four lines

Building the website for **Loft 91** — a bar and function-space-for-hire, upstairs on
Nicholson Street, Footscray, Melbourne. Weekend trade, night-weighted, two audiences
(walk-in drinkers and function organisers). The client wants minimalism, smooth scrolling,
an animated logo on a loading page, professional type, and Menu / Packages / Gallery under
one coherent theme.

Full facts: `MEMORY.md` §1. Full brief: `MEMORY.md` §3.

---

## 2. Document map and load order

```
  CLAUDE.md   ─▶  MEMORY.md   ─▶  AGENT.md   ─▶  (Planner) DESIGN.md  ─▶  .claude/skills/
  how to work     what is true    who does what     how it must look      how to do it well
```

| Order | File | Owns | Authority |
|---|---|---|---|
| 1 | **`CLAUDE.md`** (this file) | Operating rules, load order, repo conventions, definition of done | Process defaults |
| 2 | **`MEMORY.md`** | Venue facts, client brief, requirements R1–R10, decision log, content inventory, open questions | **Final authority on anything factual** |
| 3 | **`AGENT.md`** | Model routing (Haiku / Sonnet 5 / Opus 5), the Director-run loop (Director → Planner → Executor → Validator → Director), handoff contracts, escalation | Final authority on process |
| 4 | **`DESIGN.md`** | Design thesis, tokens, type, motion, section blueprints, banned defaults, a11y and performance budgets, pre-ship checklist | **Final authority on anything visual once confirmed** — currently a proposed direction, **not yet binding** while the layout is being worked out in the demo. See its own status note and §2.2 below. |
| 5 | **`.claude/skills/`** | The design skill library — routed by `DESIGN.md` §1 | Its constraints override your defaults |

**Conflict resolution, in order:** the user's explicit instruction → `MEMORY.md` (facts) →
`DESIGN.md` (visual) → `AGENT.md` (process) → the governing `SKILL.md` → this file → your
own defaults.

### 2.1 What not to touch

`.claude/skills/CLAUDE.md` and `.claude/skills/README.md` are the **skill library's own**
documentation, hard-linked to a shared library outside this project. Read them; never edit
them — a change here propagates to every project using that library. The group directories
(`core-design/`, `motion/`, `styles/`, …) are symlinks into the same library. **Never load
anything from `_archive/`.**

### 2.2 `DESIGN.md`'s current status — the demo phase

The site is currently in a **visual demo** (`demo/`), not a production build, and the
client has not yet confirmed a design layout. `DESIGN.md` describes a *proposed* direction
— useful as a reference and a reason things look the way they do — but it is **not a gate**
on demo work: the Planner does not need to load it before touching `demo/`, the Executor is
not bound by its tokens or banned-defaults list there, and the Validator does not fail a
demo build against it. Work inside `demo/` freely; don't treat a deviation from `DESIGN.md`
as a defect while this hold is in effect.

`DESIGN.md` becomes binding again — and gets corrected to match whatever layout actually
gets confirmed — only once the user confirms a direction from the demo and asks for it to
be updated. Until then, treat `DESIGN.md` as **history and a hypothesis, not a spec**.

---

## 3. How a task runs

Every non-trivial request goes through the four-role loop in `AGENT.md` §4, run by one
accountable **Director** who opens and closes it — there is no separate closing role:

0. **Direct** (Opus 5, always) — the Director reads the request, surfaces any blocker from
   `MEMORY.md` §6 up front, then assigns the task — and a model tier — to whichever role is
   next.
1. **Plan** (model set by the Director) — restate the request, load the governing skills,
   check constraints and blockers, decompose into verifiable tasks, and **write the
   expected result before any code exists**.
2. **Execute** (model set by the Director) — build exactly the plan.
3. **Validate** (model set by the Director) — adversarially, against `DESIGN.md` §9 banned
   defaults, the review-gate skills, and the §10/§11 budgets. Reports back to the Director,
   not straight to the Planner.
4. **Direct closes** — compare the delivery to the expected result and the brief. Match →
   preserve and update `MEMORY.md`. Mismatch → reassign to the Planner with a written gap.
   Cap: 3 loops, then escalate.

Trivial, zero-risk edits may skip Planner and Validator — the Director still owns that
call. If you find yourself arguing that something is trivial, it isn't.

**Model routing in one line:** Haiku 4.5 reads, extracts and pattern-matches · Sonnet 5
plans sessions and does standard implementation · Opus 5 does architecture, design
judgement, adversarial review and anything hard to reverse. Route by *consequence*, not by
size. **The Director makes this call per task**, using the table as its default heuristic:
`AGENT.md` §2, §4.0.

---

## 4. Non-negotiable rules

These hold in every role, every model tier, every task.

1. **Never invent a venue fact.** No prices, hours, menu items, capacities, addresses,
   phone numbers or licensing details unless they are sourced in `MEMORY.md` §1 or came
   from the client. A plausible-looking guess published on a real bar's live website sends
   real people to a closed door. Missing data renders as a visible `[TBC]`, never as
   confident placeholder content. (`MEMORY.md` D-05.)
2. **Check before assuming something exists.** A prompt implying a file, asset, font or
   API is present does not make it present. Look.
3. **Tokens only.** No raw hex, one-off duration, ad-hoc easing curve or magic spacing
   value. A missing token is a *design decision* — escalate, don't improvise.
4. **The banned-defaults list is a build failure, not a style note.** `DESIGN.md` §9.
   Fonts, shadows, layouts, motion, copy clichés, emoji — zero tolerance.
5. **Mobile is the primary target.** Traffic arrives from an Instagram bio link, on a
   phone, at night, on mobile data. Every feature is designed there first and degrades
   *upward*, not down.
6. **Reduced motion is a first-class mode.** Not a fallback. Under
   `prefers-reduced-motion: reduce` the site has no smooth scroll, no loader, no pins, no
   parallax — and nothing becomes unreachable.
7. **Surgical changes.** Touch only what the task requires. Don't improve adjacent code,
   don't refactor what isn't broken, don't add unrequested features or abstractions.
   Notice unrelated dead code? Mention it; don't delete it. Every changed line should trace
   to the request.
8. **Simplicity first.** The minimum that solves the problem. If 200 lines could be 50,
   rewrite it. If a senior engineer would call it overcomplicated, it is.
9. **Report honestly.** Failing tests get reported with their output. Skipped work gets
   named. Nothing is "done" until it is done *and verified* — no hedging either way.
10. **Ask at the right moment.** Do everything that doesn't depend on the answer first,
    then raise the one question that actually blocks. Don't stall a whole task on a
    question you could have deferred, and don't guess on one you couldn't.

---

## 5. Repository conventions

```
Loft91/
├─ .claude/
│  ├─ CLAUDE.md      ← you are here
│  ├─ MEMORY.md      ← facts, brief, decisions
│  ├─ AGENT.md       ← harness: models + the four-role loop
│  ├─ DESIGN.md      ← the design system
│  └─ skills/        ← design skill library (symlinked; read-only)
└─ assets/
   └─ logo.jpg       ← wordmark, raster only — vector still missing (MEMORY.md Q2)
```

**Not yet decided — do not create application code until these are signed off**
(`MEMORY.md` D-03, D-04, D-06):

- **Stack:** proposed Vite + vanilla TypeScript + GSAP, static output. No framework
  runtime for a 6-section marketing site.
- **Structure:** proposed single page with anchored sections, not multi-page.
- **Fonts:** self-hosted, no CDN call; licences verified at build time, not assumed.

**Conventions once building starts**

- Not a git repository yet. Initialise before the first code commit, and commit or push
  only when asked.
- Design tokens live in one CSS custom-property file, mirroring `DESIGN.md` §3–§6
  verbatim. That file is the single source; nothing else declares colour, duration or
  easing.
- Hours, address and social links come from **one** data module — they must never be able
  to drift between the hero, the visit section and the footer.
- Assets go in `assets/`. Optimised derivatives (AVIF/WebP, subset `woff2`) are generated,
  never hand-edited.
- Temporary files, scratch scripts and intermediate output go in the session scratchpad —
  never in the project tree.

---

## 6. Definition of done

A unit of work is done when **all** of the following hold:

- [ ] The Plan's **expected result** is matched — verified by the Director, not asserted
      by the Executor
- [ ] The Validator returned `PASS` with zero blockers and zero majors (`AGENT.md` §4.3)
- [ ] `DESIGN.md` §12 pre-ship checklist is clean
- [ ] Zero hits against the `DESIGN.md` §9 banned defaults
- [ ] Accessibility floor (`DESIGN.md` §10) and performance budget (`DESIGN.md` §11) met,
      measured on a throttled mobile profile
- [ ] No fabricated venue content anywhere; every `[TBC]` is resolved or visibly marked
- [ ] `MEMORY.md` updated — §4 decisions, §5 inventory, §6 questions, §7 session log
- [ ] The user has been told what shipped, what's still `[TBC]`, and what needs a decision

---

## 7. Start-of-session checklist

1. Read `MEMORY.md` — especially **§6 Open Questions**. Eight questions are currently
   blocking; know which ones affect today's task before you plan around them.
2. Read `AGENT.md` §2, the Director's model-routing heuristics, before dispatching work.
3. Check whether `DESIGN.md` is currently binding (§2.2 — it isn't, during the demo
   phase). If it is, read it in full before any visual task, then load its §1 governing
   skills — the whole `SKILL.md`, not a summary.
4. Check `MEMORY.md` §5 content inventory before building any section. A section with
   `Missing` content gets built to structure only, marked `[TBC]`.
5. Confirm the three proposed decisions (D-03 stack, D-04 structure, D-06 fonts) are
   signed off before writing application code that depends on them.
