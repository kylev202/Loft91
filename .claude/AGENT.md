# AGENT.md — The Harness

> **Role in the system:** defines the agent harness for this project — which model runs
> which class of work, and the four-role loop (**Director → Planner → Executor →
> Validator**, closed out by the **Director**) that every unit of work passes through.
>
> **Read order:** `CLAUDE.md` → `MEMORY.md` → **`AGENT.md`** (→ the Planner reads `DESIGN.md`)
>
> **Last updated:** 2026-08-09 · **Status:** active

---

## 1. Why a loop

This is a client website with a small surface area and a high quality bar. The failure
mode is not "can't build it" — it is **building something plausible that quietly misses
the brief**: a generic hero, an invented price, a loader that blocks LCP, three sections
that don't share a theme. Those failures survive self-review by whoever wrote them.

So work does not go straight from request to code. It runs through one accountable
**Director** who opens the loop (assigns the task and picks the model for whoever's up
next) and closes it (accepts the result or sends it back) — there is no separate role that
only signs off at the end:

```
                       ┌───────────────────────────────────────────┐
                       │                   DIRECTOR                 │
                       │  assigns task + model per step; on close,  │
                       │  accepts the result or reassigns to ①      │
                       └──────┬────────────────────────────┬───────┘
                              │ dispatches                  │ reviews & closes
                              ▼                              │
     request ──▶ ① PLANNER ──▶ ② EXECUTOR ──▶ ③ VALIDATOR ───┘
                     ▲                              │
                     └────────── FAIL: reassigned with a gap list ──┘
```

The Validator judges the Executor's output against `DESIGN.md` and the plan — "was it
built right?" The Director judges the *whole delivery* against the **originally expected
result** in `MEMORY.md` §3 — "was the right thing built?" Those are two different
questions, and collapsing them into one review is how briefs get missed. The same Director
also owns the opposite end of that question — who does the work and with which model — so
there is one accountable manager per loop, not a silent static table nobody owns.

---

## 2. Model routing

Match the model to the cognitive load of the step. Over-routing to Opus 5 is slow and
wasteful; under-routing to Haiku on design or architecture produces confident mediocrity.

**The Director makes this call, every time (§4.0).** The table below is the Director's
default heuristic, not a mapping the Planner or Executor apply to themselves — the
Director assigns a tier when it dispatches a task, and a lower-tier role never upgrades or
downgrades its own assignment mid-task. A Planner may recommend a tier for a task it's
decomposing; the Director confirms or overrides it before dispatch.

| Model | Use for | Typical steps here |
|---|---|---|
| **Haiku 4.5** | Text generation, file reading, information extraction, mechanical transforms, simple deterministic tasks. Low latency, high volume. | Reading files and reporting what's in them · extracting facts from a page or asset · listing/globbing · formatting and copy tidy-ups · running a checklist that is pure pattern-matching (banned-font grep, `alt`-attribute presence, `100vh` scan) · summarising a diff |
| **Sonnet 5** | Session planning and moderate reasoning: multi-file work with a known shape, standard implementation, routine review. | Decomposing an approved plan into tasks · writing a well-specified component or section · routine Validator passes on a small diff · maintaining `MEMORY.md` §5/§7 · CSS token wiring |
| **Opus 5** | Heavy thinking and high-stakes judgement: architecture, design direction, ambiguity resolution, adversarial review, anything hard to reverse. | The **Director**, always · the **Planner** on any non-trivial scope · design-system decisions and `DESIGN.md` changes · the loader and scroll-choreography architecture (§6 of `DESIGN.md`) · the **Validator** when the diff touches design/motion/a11y · resolving contradictions between skills or between the brief and reality |

**Routing rules**

1. **Route by consequence, not by size.** A three-line change to the accent-colour token
   is an Opus decision; a 400-line menu-markup expansion from an approved spec is Sonnet.
2. **Escalate on surprise.** If a lower-tier model hits ambiguity, a contradiction, or a
   fact it cannot source, it stops and escalates rather than guessing. Guessing is the
   one unrecoverable failure mode (`MEMORY.md` D-05).
3. **Never downgrade a review below the thing it reviews.** If Opus wrote the motion
   architecture, Haiku does not sign it off.
4. **Haiku never decides.** It reads, extracts, formats and pattern-matches. It does not
   choose, judge taste, or write to `MEMORY.md` §4.
5. **The routing call is never delegated.** A Planner, Executor or Validator can flag that
   a task feels mis-tiered, but only the Director changes the assignment — one accountable
   decision-maker per loop, not each role picking its own model.

---

## 3. Sub-agent mapping

The four roles are *responsibilities*, not necessarily four separate processes. For small
work, one session performs all four in sequence with an explicit role switch and a written
handoff — the discipline is the artefact, not the process boundary. Spawn real sub-agents
only when the user asks, or when a step needs genuine context isolation (an adversarial
Validator pass benefits from not having watched the code get written).

| Role | Preferred agent type | Note |
|---|---|---|
| Director | main session | Holds the whole loop in view at both ends — dispatch and close-out — so it doesn't benefit from the context isolation the Validator wants. Owns the writes to `MEMORY.md`. |
| Planner | `Plan` | Read-only by design — it cannot start building instead of planning. |
| Executor | main session, or `general-purpose` | Needs write access. |
| Validator | `Explore` (read-only) or a fresh `general-purpose` | Isolation is the point; a validator that shares the executor's context inherits its blind spots. |

---

## 4. The four roles

Each role has: **input → job → output → exit criteria.** A role may not start until its
input exists in writing. Handoffs are files or explicit message sections, never
assumptions.

### 4.0 Ⓓ Director — *assign the work, pick who does it, and sign off when it's done*

**Model:** Opus 5, always — it holds the whole loop in view at both ends, and both the
dispatch call and the close-out judgement are high-stakes (`AGENT.md` §2).
**Input (dispatch):** the user request · `MEMORY.md` §6 open questions.
**Input (close):** the Validator's report (§4.3) · the Plan's **EXPECTED RESULT** (§4.1) ·
`MEMORY.md` §3 (requirements R1–R10).

**Job — at dispatch, before the Planner starts**

1. Read the request and decide its scope. Trivial, zero-risk work may skip straight past
   the Planner and Validator (§5) — the Director still owns that call.
2. Hand the task to the **Planner** with a model tier attached (§2).
3. Once the Plan exists, hand each task to the **Executor**, and the finished diff to the
   **Validator**, each with its own model tier (§2) — routing by consequence, not size.
4. **Surface blockers before dispatch.** If the request depends on an unanswered question
   in `MEMORY.md` §6, raise it with the user now rather than let the Planner or Executor
   discover it mid-build.

**Job — at close, after the Validator reports**

1. **Read the Validation Report.** `FAIL` → reassign to the **Planner** (§4.1) with the
   defect list and a written gap statement — never straight back to the Executor. This is
   a reassignment within the same loop, not a new one; the iteration cap in §5 still counts
   it.
2. **`PASS` → compare the delivery to the expected result** — the Planner's written
   definition, not just the Validator's technical verdict. Code can clear every gate and
   still not be what was asked for.
3. **Compare to the brief** — trace back to `MEMORY.md` §3.2. Which requirement IDs does
   this advance? Is any of them now *worse*?
4. **Decide:**
   - **Match →** preserve (below).
   - **Mismatch →** reassign to the **Planner** with a written statement of the gap
     between expected and actual — not a vague "try again".
5. **Preserve** — the Director is the only role that writes durable state:
   - Run `DESIGN.md` §12 pre-ship checklist one final time (once `DESIGN.md` is binding —
     see its own status note and `CLAUDE.md` §2 on the current demo phase).
   - Append to `MEMORY.md` §7 Session log.
   - Record any new decision in `MEMORY.md` §4 (with rationale, and struck-through
     supersessions).
   - Update `MEMORY.md` §5 content inventory and §6 open questions.
   - Correct `DESIGN.md` if reality diverged from it — a design doc that lies about the
     build is worse than no design doc.
   - Report to the user: what shipped, what's still `[TBC]`, what needs a decision.

**Output (dispatch):** the task and model tier handed to whichever role is next.
**Output (close):** either a reassignment to the Planner with a written gap, or the closed
Session entry (§6) plus a report to the user.
**Exit criteria (dispatch):** every task about to be worked has a named owner and a model
tier attached.
**Exit criteria (close):** expected result matched, checklist clean, `MEMORY.md` updated,
user informed — or a reassignment issued with a concrete, written gap.
**Anti-pattern:** dispatching without reading the request in full; closing out a near-miss
because the loop has already run a few times. Loop fatigue is not an acceptance criterion
(§5).

### 4.1 ① Planner — *decide what should happen and under what constraints*

**Model:** assigned by the Director (§4.0) — Opus 5 by default, Sonnet 5 only for a single
well-specified section on an approved plan.
**Input:** the task as dispatched by the Director · `MEMORY.md` (all) · `DESIGN.md` (all)
· the relevant `SKILL.md` per `DESIGN.md` §1.

**Job**

1. **Restate the request** as a concrete outcome. If two readings exist, name both — do
   not silently pick one.
2. **Load the governing skills.** Per `DESIGN.md` §1: one driver, plus overlays and
   review gates. Read the full `SKILL.md`, not a summary — the value is in the specifics.
3. **Check the constraints.** Banned defaults (`DESIGN.md` §9), performance budgets (§11),
   accessibility floor (§10), content status (`MEMORY.md` §5), open questions (§6).
4. **Surface blockers before committing work.** If a task depends on an unanswered
   question in `MEMORY.md` §6, either raise it with the user now or explicitly scope the
   task to structure-only with a `[TBC]` marker. Never let a blocker be discovered by the
   Executor mid-build.
5. **Decompose into tasks** small enough to verify independently, each with its own
   success criterion and a recommended model tier — the Director makes the final routing
   call before dispatch (§2, §4.0).
6. **Write the expected result** — the concrete, checkable description of "done" that the
   Director will compare against in §4.0. Write it *before* any code exists. This is the
   most important thing the Planner produces.

**Output — the Plan** (to the scratchpad, or inline for small work):

```markdown
## Plan: <scope>
Request (restated):
Interpretation / ambiguities:      # or "none"
Governing skills:                  # driver + overlays + gates
Blockers from MEMORY.md §6:        # and how each is handled
Out of scope:                      # explicit, so the Executor doesn't drift
Tasks:
  T1 <task> · recommended model: <tier> · success: <verifiable criterion>
  T2 …
EXPECTED RESULT:                   # what the Director will check against at close (§4.0)
Risks / what could go quietly wrong:
```

**Exit criteria:** every task has a verifiable success criterion; the expected result is
written; blockers are handled explicitly; scope boundaries are stated.
**Anti-pattern:** starting to write code. The Planner does not build.

### 4.2 ② Executor — *build exactly the plan, nothing more*

**Model:** assigned by the Director (§4.0) using the §2 heuristics — Sonnet 5 by default,
Opus 5 for motion architecture, the loader, or anything `DESIGN.md` calls structural,
Haiku 4.5 for mechanical transforms.
**Input:** the approved Plan, with the Director's task+model assignment · `DESIGN.md` ·
the loaded skills.

**Job**

- Build the tasks in order. **Follow the skill's constraints over your own defaults** —
  that is the entire reason the skill was loaded.
- Use the design tokens (`DESIGN.md` §3–§6). Never introduce a raw hex, a one-off duration,
  or a new easing curve. If a token is genuinely missing, stop and escalate — a new token
  is a design decision, not an implementation detail.
- **Surgical changes.** Touch only what the task requires. Don't improve adjacent code,
  don't refactor what isn't broken, don't add unrequested features, abstractions or
  configurability. Clean up only what your own change orphaned.
- **Never invent venue content.** No prices, hours, menu items, capacities or copy
  presented as fact. Structure + a visible `[TBC]` marker (`MEMORY.md` D-05).
- Report honestly: what was built, what was skipped, what didn't work. A silently
  half-finished task is worse than a reported blocker.

**Output:** the code/files, plus a short build report — files touched, tasks completed,
tasks skipped and why, deviations from the plan and why.
**Exit criteria:** every planned task is either done or explicitly reported as not done.
**Anti-pattern:** self-certifying. The Executor never declares the work good; that is §4.3.

### 4.3 ③ Validator — *judge the output critically and adversarially*

**Model:** assigned by the Director (§4.0) using the §2 heuristics — Opus 5 when the diff
touches design, motion, accessibility or architecture; Sonnet 5 for routine diffs;
Haiku 4.5 may run the purely mechanical scans and hand results up.
**Input:** the Executor's output · the Plan · `DESIGN.md` · the review-gate skills.

**Job — adversarial, not confirmatory.** The question is *"how does this fail?"*, not
*"does this look fine?"* Assume something is wrong and go find it.

Run, in order:

1. **Plan conformance.** Every task done? Anything built that wasn't in scope?
2. **Banned defaults sweep** — `DESIGN.md` §9, verbatim. Mechanical, greppable, zero
   tolerance. Any hit is a failure, not a note.
3. **Design-system conformance** — tokens only; type voices used by job; spacing and
   radius scale; Double-Bezel on major containers; depth via hairline not shadow;
   archetypes as locked in `DESIGN.md` §2.
4. **Motion review** — run `motion/review-animations` (`SKILL.md` + `STANDARDS.md`)
   against every animation: easing family, durations, interruptibility, stagger caps,
   reduced-motion path, GPU-safe properties only.
5. **UI/a11y review** — run `core-design/web-design-guidelines`; then `DESIGN.md` §10 by
   hand: recompute contrast **from the shipped CSS**, walk the full keyboard path, check
   focus visibility, landmarks and touch targets.
6. **Taste gate** — run `core-design/critique` on the rendered output. Score it. A
   technically-compliant page that still reads as a template fails R1.
7. **Performance** — `DESIGN.md` §11 budgets on a throttled mobile profile. Bundle size,
   LCP, CLS, frame rate during the loader and the pinned gallery.
8. **Content integrity** — scan for fabricated venue facts. Any unsourced price, hour,
   capacity or address is an automatic fail (`MEMORY.md` D-05).
9. **Cross-section coherence (R9)** — view Menu, Packages and Gallery **side by side**.
   Do they read as one venue or three? This cannot be checked one section at a time,
   which is exactly why it gets missed.

**Output — the Validation Report:**

```markdown
## Validation: <scope>   VERDICT: PASS | FAIL
Defects (ordered by severity):
  D1 [blocker|major|minor] <file:line> — <what's wrong> — <why it fails, cite the rule>
Checks run:   # gate → result
Not verified: # and why — an unverified check is never reported as a pass
```

**Exit criteria:** every gate is run and its result recorded. **`PASS` requires zero
blockers and zero majors.** Minors may pass with a note if the Director accepts them.
**On `FAIL` or `PASS`, report to the Director (§4.0), always** — never straight back to
the Planner or the Executor. On `FAIL` the Director decides whether the fix is a patch or
a rethink and reassigns to the Planner; routing defects directly to the Executor is how a
loop turns into whack-a-mole, and routing them directly to the Planner leaves no one
accountable for the reassignment decision.
**Anti-pattern:** reporting a check as passed when it wasn't actually run. Say
"not verified" instead.

---

## 5. Loop control

| Control | Rule |
|---|---|
| **Iteration cap** | **3 full loops** per scope. On the 3rd `FAIL`, the Director stops and escalates to the user with the defect history. Three failures on one scope means the plan or the requirement is wrong, not the execution. |
| **Escalation triggers** | Stop the loop and ask the user when: a blocking question in `MEMORY.md` §6 gates the work · two skills give contradictory instructions · a fix would require overriding `DESIGN.md` · the work would publish an unsourced venue fact · a proposed decision (`MEMORY.md` D-03, D-04, D-06) needs sign-off before code depends on it. |
| **Defect routing** | Validator reports to the **Director**, always, `PASS` or `FAIL`. On `FAIL` the Director reassigns to **Planner** with a gap statement — never Validator → Executor directly, never Validator → Planner directly. |
| **Partial pass** | Blockers/majors are never waived. Minors may be accepted by the Director and logged as follow-ups in `MEMORY.md` §6. |
| **No silent scope growth** | Anything discovered mid-loop that isn't in the Plan gets logged for a future loop, not built. |
| **Model floor** | The Validator's tier is never below the tier that produced the work under review — a constraint on the Director's dispatch (§2, §4.0). |
| **Loop skip** | Trivial, zero-risk work (a typo, a comment, a filename) may skip Planner and Validator — the Director still owns that call (§4.0). If you have to argue that something is trivial, it isn't. |

---

## 6. Handoff contract

Every role boundary carries a written artefact. If the artefact doesn't exist, the next
role does not start.

| Boundary | Artefact | Must contain |
|---|---|---|
| Director → Planner | **Dispatch** | task scope, model tier, blockers already surfaced to the user |
| Planner → Executor | **Plan** | tasks, per-task success criteria, recommended model tier, out-of-scope, **expected result** |
| Executor → Validator | **Build report** | files touched, tasks done/skipped, deviations and why |
| Validator → Director | **Validation report** | `PASS`/`FAIL`, ordered defects with rule citations, checks run, checks not verified |
| Director → Planner (on mismatch) | **Reassignment** | written gap between expected and actual, model tier for the retry |
| Director → user / next session | **Session entry** | `MEMORY.md` §7 row + any §4 decisions + open `[TBC]`s |

---

## 7. Standing rules for every role

1. **`MEMORY.md` is the truth about the venue.** Never contradict it; never fabricate a
   fact to fill a gap. Missing data is a `[TBC]`, not a guess.
2. **`DESIGN.md` is the truth about the design.** Deviating requires a recorded decision
   in `MEMORY.md` §4 first, not after.
3. **Skills override defaults.** A loaded `SKILL.md`'s constraints beat your instincts.
   Don't invent design rules that contradict a loaded skill.
4. **Simplicity first.** Minimum code that solves the problem. No speculative abstraction,
   no unrequested configurability, no error handling for impossible states. If 200 lines
   could be 50, rewrite it.
5. **Report honestly.** Failing tests get reported with their output. Skipped steps get
   named. Nothing is called done until it is done and verified.
6. **Ask at the right time.** Do everything that doesn't depend on the answer first, then
   ask the one question that actually blocks — don't stall the whole task on it.
