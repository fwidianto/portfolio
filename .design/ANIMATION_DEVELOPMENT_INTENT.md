# Animation Development Intent

## Status

This document records the owner's **future development intention** for animation work in the portfolio.

It is not permission to begin the deferred work immediately.

**Current execution focus remains Chapter 02 Scene 04.**

Do not reopen Scene 03, redesign Chapter 02 architecture, or begin chapter-level integration until Scene 04 is completed and the owner explicitly moves focus.

---

## Core lesson

The owner has observed that **rushing implementation before the visual idea and sequence are sufficiently understood produces little useful progress**.

Speed should therefore come from a better development system, not from skipping design thinking, causal structure, visual review, or owner approval.

The current preferred principle is:

`build one sequence carefully -> learn what actually worked -> distill the proven flow -> reuse it`

Do not prematurely generalize an unproven process.

---

## Current development priority

For now:

1. Finish Scene 04 to a mature scene-level baseline.
2. Keep using `.design/skills/structured-animation-development/SKILL.md` as the active animation-development methodology.
3. Continue bounded development rather than attempting entire long animations in one pass.
4. Preserve owner review gates before a section is treated as approved or frozen.

Scene 03 refinement is intentionally deferred until Scene 04 is complete.

---

## Future workflow experiment

After Scene 04 is complete, use the lessons from Scene 04 and Scene 05 to examine whether animation development can become faster without sacrificing quality.

The intended experiment is:

`one carefully developed reference sequence`

`-> identify the exact tools, decisions, review gates, and implementation order that produced the mature result`

`-> distill that into a reusable skill / workflow`

`-> apply the workflow to another animation`

`-> validate whether the same maturity can be reached with fewer exploratory loops`

Only after this is proven on another sequence should the workflow be trusted for larger or longer animations.

### Possible optimization to test

The owner is interested in eventually testing whether **approval planning and implementation planning can be established earlier in the task**, allowing a longer animation to proceed more continuously once its direction is clear.

This is an experiment, not current authority.

Do not interpret it as permission to:

- design and implement an entire long animation in one uncontrolled pass;
- eliminate visual comparison when the composition is unresolved;
- remove owner review gates;
- freeze work automatically;
- trade animation quality for speed.

The objective is to reduce repeated setup and unnecessary agent cycles while preserving the quality bar established by the strongest scenes.

---

## Scene 03 intention

After Scene 04 is finished, Scene 03 should be reopened for refinement.

The goal is not to copy Scene 05 visually. The goal is to bring Scene 03 closer to Scene 05's **development maturity**:

- stronger design intent before implementation;
- deliberate geometry;
- clear causal sections;
- traceable material/process continuity;
- restrained motion;
- bounded review and correction;
- stable inherited start/end states.

Scene 03 should be improved using the most mature workflow available at that time, including any workflow distilled from Scene 04/05 if it has been validated.

---

## Future Chapter 02 experience

After the individual scenes are mature, Chapter 02 should eventually be assembled as a **single scene-swapping chapter experience rather than a vertically scrolling stack**.

Intended structure:

`Scene 01 -> Scene 02 -> Scene 03 -> Scene 04 -> Scene 05`

All scenes should occupy the same chapter viewport and change in sequence.

The future chapter-level integration should unify:

- scene navigation;
- previous / next behavior;
- scene progress indication;
- replay behavior;
- inspection-node interaction;
- chapter transition rules;
- reduced-motion behavior;
- shared responsive behavior.

Replay and inspection systems should not be independently reinvented by every scene once chapter integration begins.

Do not implement this chapter shell until scene-level refinement is sufficiently mature and the owner explicitly authorizes the integration phase.

---

## Development order

Current intended order:

`Finish Scene 04`

`-> review what development flow worked best`

`-> distill / refine reusable animation workflow if justified`

`-> refine Scene 03 using the matured workflow`

`-> review Scenes 01-05 as a complete Chapter 02 narrative`

`-> design the unified single-viewport Chapter 02 shell`

`-> unify navigation, replay, inspection, transitions, and responsive behavior`

The owner may change this order explicitly at any time.

---

## Quality rule

A faster workflow is successful only if it preserves or improves:

- visual intentionality;
- animation quality;
- causal/narrative clarity;
- factual honesty;
- continuity;
- owner control over approval;
- ability to inspect and correct bounded sections.

**Do not optimize for fewer steps if the result becomes less mature.**
